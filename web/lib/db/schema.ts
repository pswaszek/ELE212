import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'adhd.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      instructor TEXT,
      color TEXT DEFAULT '#6366f1',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      type TEXT NOT NULL CHECK(type IN ('homework','exercise','quiz','extra_credit')),
      number INTEGER,
      title TEXT NOT NULL,
      topic TEXT,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'upcoming' CHECK(status IN ('upcoming','in_progress','completed','overdue','skipped')),
      points INTEGER DEFAULT 0,
      url TEXT,
      late_url TEXT,
      lecture_ref TEXT,
      estimated_minutes INTEGER DEFAULT 30,
      difficulty INTEGER DEFAULT 2 CHECK(difficulty BETWEEN 1 AND 5),
      notes TEXT DEFAULT '',
      steps TEXT DEFAULT '[]',
      completed_steps TEXT DEFAULT '[]',
      started_at TEXT,
      completed_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL REFERENCES courses(id),
      lecture_number INTEGER,
      date TEXT,
      title TEXT NOT NULL,
      topic TEXT,
      section TEXT,
      textbook_ref TEXT,
      slides_file TEXT,
      annotated_file TEXT,
      video_links TEXT DEFAULT '[]',
      key_concepts TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ai_sessions (
      id TEXT PRIMARY KEY,
      context_type TEXT NOT NULL CHECK(context_type IN ('assignment','lesson','general')),
      context_id TEXT,
      messages TEXT DEFAULT '[]',
      student_state TEXT DEFAULT 'engaged' CHECK(student_state IN ('engaged','confused','overwhelmed','disengaged')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
}
