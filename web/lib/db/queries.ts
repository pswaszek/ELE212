import { getDb } from './schema';
import { seedDatabase } from './seed';

export type AssignmentStatus = 'upcoming' | 'in_progress' | 'completed' | 'overdue' | 'skipped';
export type AssignmentType = 'homework' | 'exercise' | 'quiz' | 'extra_credit';

export interface Assignment {
  id: string;
  course_id: string;
  type: AssignmentType;
  number: number;
  title: string;
  topic: string | null;
  due_date: string | null;
  status: AssignmentStatus;
  points: number;
  url: string | null;
  late_url: string | null;
  lecture_ref: string | null;
  estimated_minutes: number;
  difficulty: number;
  notes: string;
  steps: string; // JSON array
  completed_steps: string; // JSON array
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  lecture_number: number;
  date: string;
  title: string;
  topic: string;
  section: string;
  textbook_ref: string;
  slides_file: string | null;
  annotated_file: string | null;
  video_links: string;
  key_concepts: string;
  created_at: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  color: string;
}

function ensureSeeded() {
  seedDatabase();
}

// ── Assignments ──────────────────────────────────────────────────────────────

export function getAllAssignments(): Assignment[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`SELECT * FROM assignments ORDER BY due_date ASC`).all() as Assignment[];
}

export function getAssignmentById(id: string): Assignment | null {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`SELECT * FROM assignments WHERE id = ?`).get(id) as Assignment | null;
}

export function getUpcomingAssignments(days = 7): Assignment[] {
  ensureSeeded();
  const db = getDb();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  return db.prepare(`
    SELECT * FROM assignments
    WHERE status IN ('upcoming','in_progress','overdue')
    AND due_date <= ?
    ORDER BY due_date ASC
  `).all(cutoff.toISOString()) as Assignment[];
}

export function getTodayAssignments(): Assignment[] {
  ensureSeeded();
  const db = getDb();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrowStr = new Date(today.getTime() + 86400000).toISOString().split('T')[0];
  return db.prepare(`
    SELECT * FROM assignments
    WHERE due_date >= ? AND due_date < ?
    AND status != 'completed'
    ORDER BY due_date ASC
  `).all(todayStr, tomorrowStr) as Assignment[];
}

export function getOverdueAssignments(): Assignment[] {
  ensureSeeded();
  const db = getDb();
  const now = new Date().toISOString();
  return db.prepare(`
    SELECT * FROM assignments
    WHERE due_date < ? AND status = 'overdue'
    ORDER BY due_date DESC
  `).all(now) as Assignment[];
}

export function updateAssignment(id: string, fields: Partial<Assignment>): Assignment | null {
  const db = getDb();
  const allowed = ['status', 'notes', 'steps', 'completed_steps', 'started_at', 'completed_at', 'estimated_minutes'];
  const sets = Object.keys(fields)
    .filter(k => allowed.includes(k))
    .map(k => `${k} = @${k}`)
    .join(', ');
  if (!sets) return null;
  db.prepare(`UPDATE assignments SET ${sets} WHERE id = @id`).run({ ...fields, id });
  return getAssignmentById(id);
}

export function getAssignmentStats() {
  ensureSeeded();
  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) as n FROM assignments WHERE type = 'homework'`).get() as { n: number }).n;
  const done = (db.prepare(`SELECT COUNT(*) as n FROM assignments WHERE type = 'homework' AND status = 'completed'`).get() as { n: number }).n;
  const overdue = (db.prepare(`SELECT COUNT(*) as n FROM assignments WHERE status = 'overdue'`).get() as { n: number }).n;
  const upcoming = (db.prepare(`SELECT COUNT(*) as n FROM assignments WHERE status IN ('upcoming','in_progress')`).get() as { n: number }).n;
  return { total, done, overdue, upcoming, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ── Lessons ───────────────────────────────────────────────────────────────────

export function getAllLessons(): Lesson[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`SELECT * FROM lessons ORDER BY lecture_number ASC`).all() as Lesson[];
}

export function getLessonById(id: string): Lesson | null {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`SELECT * FROM lessons WHERE id = ?`).get(id) as Lesson | null;
}

export function getLessonsBySection(section: string): Lesson[] {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`SELECT * FROM lessons WHERE section = ? ORDER BY lecture_number ASC`).all(section) as Lesson[];
}

// ── Courses ───────────────────────────────────────────────────────────────────

export function getCourse(id: string): Course | null {
  ensureSeeded();
  const db = getDb();
  return db.prepare(`SELECT * FROM courses WHERE id = ?`).get(id) as Course | null;
}

// ── AI Sessions ───────────────────────────────────────────────────────────────

export function createAiSession(contextType: string, contextId?: string) {
  const db = getDb();
  const id = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  db.prepare(`
    INSERT INTO ai_sessions (id, context_type, context_id) VALUES (?, ?, ?)
  `).run(id, contextType, contextId ?? null);
  return id;
}

export function updateAiSession(id: string, messages: unknown[], studentState?: string) {
  const db = getDb();
  db.prepare(`
    UPDATE ai_sessions SET messages = ?, student_state = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(JSON.stringify(messages), studentState ?? 'engaged', id);
}

export function getAiSession(id: string) {
  const db = getDb();
  return db.prepare(`SELECT * FROM ai_sessions WHERE id = ?`).get(id);
}

// ── Settings ──────────────────────────────────────────────────────────────────

export function getSetting(key: string): string | null {
  ensureSeeded();
  const db = getDb();
  const row = db.prepare(`SELECT value FROM settings WHERE key = ?`).get(key) as { value: string } | undefined;
  return row?.value ?? null;
}

export function setSetting(key: string, value: string) {
  const db = getDb();
  db.prepare(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`).run(key, value);
}
