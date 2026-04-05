import { getDb } from './schema';

// ELE 212 Spring 2026 – full assignment schedule
// Today = April 5, 2026 (Week 10, after Lecture 28)

const COURSE_ID = 'ele212-sp26';
const BASE_URL = 'https://www.ele.uri.edu/~swaszek/ele212/quiz/';

function dueStatus(dueDate: string): string {
  const due = new Date(dueDate);
  const now = new Date('2026-04-05T08:00:00');
  if (due < now) return 'overdue';
  const diffMs = due.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays < 1) return 'in_progress';
  return 'upcoming';
}

export function seedDatabase() {
  const db = getDb();

  const existing = db.prepare('SELECT id FROM courses WHERE id = ?').get(COURSE_ID);
  if (existing) return; // already seeded

  // ── Course ──────────────────────────────────────────────────────────────
  db.prepare(`INSERT INTO courses (id, code, name, instructor, color) VALUES (?, ?, ?, ?, ?)`).run(
    COURSE_ID,
    'ELE 212',
    'Linear Circuit Theory',
    'Prof. Peter F. Swaszek',
    '#6366f1'
  );

  // ── Homework assignments ─────────────────────────────────────────────────
  const homeworks = [
    // Week 1
    { n: 1,  topic: 'Basics 1: circuit variables',                   due: '2026-01-23T08:55:00', lecture: 'A_1', section: 'A' },
    { n: 2,  topic: 'Basics 2: time variation, sources, resistors',   due: '2026-01-26T08:55:00', lecture: 'A_2', section: 'A' },
    // Week 2
    { n: 3,  topic: 'Basics 3: circuits, Kirchhoff',                  due: '2026-01-28T08:55:00', lecture: 'A_3', section: 'A' },
    { n: 4,  topic: 'Basics 4: series/parallel, voltage/current div', due: '2026-01-30T08:55:00', lecture: 'A_4', section: 'A' },
    { n: 5,  topic: 'Basics 5: equivalent resistance',                due: '2026-02-02T08:55:00', lecture: 'A_5', section: 'A' },
    // Week 3
    { n: 6,  topic: 'Basics 6: circuit analysis, dependent sources',  due: '2026-02-04T08:55:00', lecture: 'A_6', section: 'A' },
    { n: 7,  topic: 'Basics 7: odds and ends',                        due: '2026-02-06T08:55:00', lecture: 'A_7', section: 'A' },
    { n: 8,  topic: 'Node 1: basic concepts',                         due: '2026-02-09T08:55:00', lecture: 'B_1', section: 'B' },
    // Week 4
    { n: 9,  topic: 'Node 2: more complex branches',                  due: '2026-02-11T08:55:00', lecture: 'B_2', section: 'B' },
    { n: 10, topic: 'Node 3: vector/matrix form',                     due: '2026-02-13T08:55:00', lecture: 'B_3', section: 'B' },
    { n: 11, topic: 'Node 4: dependent sources',                      due: '2026-02-18T08:55:00', lecture: 'B_4', section: 'B' },
    // Week 5
    { n: 12, topic: 'Node 5: supernodes',                             due: '2026-02-20T08:55:00', lecture: 'B_5', section: 'B' },
    { n: 13, topic: 'Node 6: examples',                               due: '2026-02-23T08:55:00', lecture: 'B_6', section: 'B' },
    // Week 6
    { n: 14, topic: 'Op amp example',                                 due: '2026-02-25T08:55:00', lecture: 'B_7', section: 'B' },
    { n: 15, topic: 'Phasors 1: introducing L and C',                 due: '2026-02-27T08:55:00', lecture: 'C_1', section: 'C' },
    { n: 16, topic: 'Phasors 2: RLC circuits',                        due: '2026-03-02T08:55:00', lecture: 'C_2', section: 'C' },
    // Week 7
    { n: 17, topic: 'Phasors 3: how phasors help',                    due: '2026-03-04T08:55:00', lecture: 'C_3', section: 'C' },
    { n: 18, topic: 'Phasors 4: how to use them',                     due: '2026-03-06T08:55:00', lecture: 'C_4', section: 'C' },
    { n: 19, topic: 'Phasors 5: examples',                            due: '2026-03-09T08:55:00', lecture: 'C_5', section: 'C' },
    // Week 8
    { n: 20, topic: 'Phasors 6: more examples',                       due: '2026-03-11T08:55:00', lecture: 'C_6', section: 'C' },
    { n: 21, topic: 'Phasors 7: AC power',                            due: '2026-03-13T08:55:00', lecture: 'C_7', section: 'C' },
    { n: 22, topic: 'Phasors 8: power, circuit design',               due: '2026-03-23T08:55:00', lecture: 'C_8', section: 'C' },
    // Week 9 (after spring break)
    { n: 23, topic: 'Phasors 9: circuit design',                      due: '2026-03-25T08:55:00', lecture: 'C_9', section: 'C' },
    { n: 24, topic: 'Theorems 1: superposition and transformations',  due: '2026-03-27T08:55:00', lecture: 'D_1', section: 'D' },
    { n: 25, topic: 'Theorems 2: Thevenin',                           due: '2026-03-30T08:55:00', lecture: 'D_2', section: 'D' },
    // Week 10
    { n: 26, topic: 'Theorems 3: more Thevenin',                      due: '2026-04-01T08:55:00', lecture: 'D_3', section: 'D' },
    { n: 27, topic: 'Theorems 4: maximum power',                      due: '2026-04-03T08:55:00', lecture: 'D_4', section: 'D' },
    { n: 28, topic: 'Theorems 5: AC Thevenin',                        due: '2026-04-06T08:55:00', lecture: 'D_5', section: 'D' },
    // Week 11
    { n: 29, topic: 'Theorems 6: maximum AC power',                   due: '2026-04-08T08:55:00', lecture: 'D_6', section: 'D' },
    { n: 30, topic: '1st order 1: concepts',                          due: '2026-04-10T08:55:00', lecture: 'F_1', section: 'F' },
    { n: 31, topic: '1st order 2: general solution',                  due: '2026-04-13T08:55:00', lecture: 'F_2', section: 'F' },
    // Week 12
    { n: 32, topic: '1st order 3: examples',                          due: '2026-04-15T08:55:00', lecture: 'F_3', section: 'F' },
    { n: 33, topic: '1st order 4: other variables',                   due: '2026-04-17T08:55:00', lecture: 'F_4', section: 'F' },
    { n: 34, topic: '1st order 5: more examples',                     due: '2026-04-20T08:55:00', lecture: 'F_5', section: 'F' },
    // Week 13
    { n: 35, topic: '2nd order 1: concepts',                          due: '2026-04-22T08:55:00', lecture: 'G_1', section: 'G' },
    { n: 36, topic: '2nd order 2: initial conditions',                due: '2026-04-24T08:55:00', lecture: 'G_2', section: 'G' },
    { n: 37, topic: '2nd order 3: full solution',                     due: '2026-04-27T08:55:00', lecture: 'G_3', section: 'G' },
    // Week 14
    { n: 38, topic: '2nd order 4: examples',                          due: '2026-04-29T08:55:00', lecture: 'G_4', section: 'G' },
    { n: 39, topic: 'Mesh: concept and examples',                     due: '2026-05-01T23:59:00', lecture: 'H_1', section: 'H' },
  ];

  const insertHW = db.prepare(`
    INSERT INTO assignments (id, course_id, type, number, title, topic, due_date, status, points, url, late_url, lecture_ref, estimated_minutes, difficulty)
    VALUES (?, ?, 'homework', ?, ?, ?, ?, ?, 100, ?, ?, ?, ?, ?)
  `);

  for (const hw of homeworks) {
    const status = dueStatus(hw.due);
    const diff = hw.n <= 14 ? 2 : hw.n <= 22 ? 3 : hw.n <= 28 ? 3 : 4;
    insertHW.run(
      `hw-${hw.n}`,
      COURSE_ID,
      hw.n,
      `HW ${hw.n}`,
      hw.topic,
      hw.due,
      status,
      `${BASE_URL}quiz0${String(hw.n).padStart(2, '0')}.php`,
      hw.n <= 38 ? `${BASE_URL}quiz1${String(hw.n).padStart(2, '0')}.php` : null,
      hw.lecture,
      hw.n <= 14 ? 25 : hw.n <= 22 ? 35 : 40,
      diff
    );
  }

  // ── Exercises ─────────────────────────────────────────────────────────────
  const exercises = [
    { n: 1,  topic: 'Simultaneous equations',   due: '2026-02-06T08:55:00', url: `${BASE_URL}quiz201.php` },
    { n: 2,  topic: 'Simultaneous equations',   due: '2026-02-06T08:55:00', url: `${BASE_URL}quiz202.php` },
    { n: 3,  topic: 'Delta-Wye transformations',due: '2026-02-18T08:55:00', url: `${BASE_URL}quiz203.php` },
    { n: 4,  topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz204.php` },
    { n: 5,  topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz205.php` },
    { n: 6,  topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz206.php` },
    { n: 7,  topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz207.php` },
    { n: 8,  topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz208.php` },
    { n: 9,  topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz209.php` },
    { n: 10, topic: 'Complex number manipulation', due: '2026-02-25T08:55:00', url: `${BASE_URL}quiz210.php` },
  ];

  const insertEx = db.prepare(`
    INSERT INTO assignments (id, course_id, type, number, title, topic, due_date, status, points, url, estimated_minutes, difficulty)
    VALUES (?, ?, 'exercise', ?, ?, ?, ?, ?, 200, ?, 20, 2)
  `);

  for (const ex of exercises) {
    insertEx.run(
      `ex-${ex.n}`,
      COURSE_ID,
      ex.n,
      `Exercise ${ex.n}`,
      ex.topic,
      ex.due,
      dueStatus(ex.due),
      ex.url
    );
  }

  // ── Extra Credit ──────────────────────────────────────────────────────────
  const insertEC = db.prepare(`
    INSERT INTO assignments (id, course_id, type, number, title, topic, due_date, status, points, url, estimated_minutes, difficulty)
    VALUES (?, ?, 'extra_credit', ?, ?, ?, ?, ?, 200, ?, 45, 4)
  `);

  insertEC.run('ec-1', COURSE_ID, 1, 'Extra Credit 1', 'Phasor homework', '2026-04-12T23:59:00',
    dueStatus('2026-04-12T23:59:00'), `${BASE_URL}quiz901.php`);
  insertEC.run('ec-2', COURSE_ID, 2, 'Extra Credit 2', '2nd order homework', '2026-05-01T23:59:00',
    dueStatus('2026-05-01T23:59:00'), `${BASE_URL}quiz902.php`);

  // ── Lessons ───────────────────────────────────────────────────────────────
  const lessons = [
    { n: 1,  date: '2026-01-21', title: 'Basics 1', topic: 'Administrivia; circuit variables', section: 'A', textbook: 'A&S chap 1', slides: 'A_1.pdf', annot: 'A_1x.pdf' },
    { n: 2,  date: '2026-01-23', title: 'Basics 2', topic: 'Time variation; sources; resistors', section: 'A', textbook: 'A&S chap 1', slides: 'A_2.pdf', annot: 'A_2x.pdf' },
    { n: 3,  date: '2026-01-26', title: 'Basics 3', topic: 'Circuits; Kirchhoff\'s Laws', section: 'A', textbook: 'A&S chap 1 & 2', slides: 'A_3.pdf', annot: null },
    { n: 4,  date: '2026-01-28', title: 'Basics 4', topic: 'Series/parallel resistance; voltage/current division', section: 'A', textbook: 'A&S chap 2', slides: 'A_4.pdf', annot: 'A_4x.pdf' },
    { n: 5,  date: '2026-01-30', title: 'Basics 5', topic: 'Equivalent resistance', section: 'A', textbook: 'A&S chap 2', slides: 'A_5.pdf', annot: 'A_5x.pdf' },
    { n: 6,  date: '2026-02-02', title: 'Basics 6', topic: 'Circuit analysis; dependent sources', section: 'A', textbook: 'A&S chap 2', slides: 'A_6.pdf', annot: 'A_6x.pdf' },
    { n: 7,  date: '2026-02-04', title: 'Basics 7', topic: 'Odds and ends', section: 'A', textbook: 'A&S chap 2', slides: 'A_7.pdf', annot: 'A_7x.pdf' },
    { n: 8,  date: '2026-02-06', title: 'Node 1', topic: 'Basic concepts of nodal analysis', section: 'B', textbook: 'A&S chap 3', slides: 'B_1.pdf', annot: 'B_1x.pdf' },
    { n: 9,  date: '2026-02-09', title: 'Node 2', topic: 'More complex branches', section: 'B', textbook: 'A&S chap 3', slides: 'B_2.pdf', annot: 'B_2x.pdf' },
    { n: 10, date: '2026-02-11', title: 'Node 3', topic: 'Vector/matrix form of node equations', section: 'B', textbook: 'A&S chap 3', slides: 'B_3.pdf', annot: 'B_3x.pdf' },
    { n: 11, date: '2026-02-13', title: 'Node 4', topic: 'Dependent sources in node analysis', section: 'B', textbook: 'A&S chap 3', slides: 'B_4.pdf', annot: 'B_4x.pdf' },
    { n: 12, date: '2026-02-18', title: 'Node 5', topic: 'Supernodes', section: 'B', textbook: 'A&S chap 3', slides: 'B_5.pdf', annot: 'B_5x.pdf' },
    { n: 13, date: '2026-02-20', title: 'Node 6', topic: 'Nodal analysis examples', section: 'B', textbook: 'A&S chap 3', slides: 'B_6.pdf', annot: 'B_6x.pdf' },
    { n: 14, date: '2026-02-23', title: 'Node 7', topic: 'Op amp example using nodal analysis', section: 'B', textbook: 'A&S chap 5', slides: 'B_7.pdf', annot: 'B_7x.pdf' },
    { n: 15, date: '2026-02-25', title: 'Phasors 1', topic: 'Introducing inductors (L) and capacitors (C)', section: 'C', textbook: 'A&S chap 6', slides: 'C_1.pdf', annot: 'C_1x.pdf' },
    { n: 16, date: '2026-02-27', title: 'Phasors 2', topic: 'RLC circuits in frequency domain', section: 'C', textbook: 'A&S chap 9', slides: 'C_2.pdf', annot: 'C_2x.pdf' },
    { n: 17, date: '2026-03-02', title: 'Phasors 3', topic: 'How phasors simplify AC analysis', section: 'C', textbook: 'A&S chap 9 & 10', slides: 'C_3.pdf', annot: 'C_3x.pdf' },
    { n: 18, date: '2026-03-04', title: 'Phasors 4', topic: 'Using phasors to solve circuits', section: 'C', textbook: 'A&S chap 9 & 10', slides: 'C_4.pdf', annot: 'C_4x.pdf' },
    { n: 19, date: '2026-03-06', title: 'Phasors 5', topic: 'Phasor examples', section: 'C', textbook: 'A&S chap 10', slides: 'C_5.pdf', annot: 'C_5x.pdf' },
    { n: 20, date: '2026-03-09', title: 'Phasors 6', topic: 'More phasor examples', section: 'C', textbook: 'A&S chap 10', slides: 'C_6.pdf', annot: 'C_6x.pdf' },
    { n: 21, date: '2026-03-11', title: 'Phasors 7', topic: 'AC power analysis', section: 'C', textbook: 'A&S chap 11', slides: 'C_7.pdf', annot: 'C_7x.pdf' },
    { n: 22, date: '2026-03-13', title: 'Phasors 8', topic: 'Power factor; circuit design', section: 'C', textbook: 'A&S chap 11', slides: 'C_8.pdf', annot: 'C_8x.pdf' },
    { n: 23, date: '2026-03-23', title: 'Phasors 9', topic: 'AC circuit design examples', section: 'C', textbook: 'A&S chap 11', slides: 'C_9.pdf', annot: 'C_9x.pdf' },
    { n: 24, date: '2026-03-25', title: 'Theorems 1', topic: 'Superposition and source transformations', section: 'D', textbook: 'A&S chap 4', slides: 'D_1.pdf', annot: 'D_1x.pdf' },
    { n: 25, date: '2026-03-27', title: 'Theorems 2', topic: 'Thevenin equivalent circuits', section: 'D', textbook: 'A&S chap 4', slides: 'D_2.pdf', annot: 'D_2x.pdf' },
    { n: 26, date: '2026-03-30', title: 'Theorems 3', topic: 'More Thevenin examples', section: 'D', textbook: 'A&S chap 4', slides: 'D_3.pdf', annot: 'D_3x.pdf' },
    { n: 27, date: '2026-04-01', title: 'Theorems 4', topic: 'Maximum power transfer', section: 'D', textbook: 'A&S chap 4', slides: 'D_4.pdf', annot: 'D_4x.pdf' },
    { n: 28, date: '2026-04-03', title: 'Theorems 5', topic: 'AC Thevenin equivalent circuits', section: 'D', textbook: 'A&S chap 4', slides: 'D_5.pdf', annot: 'D_5x.pdf' },
    { n: 29, date: '2026-04-06', title: 'Theorems 6', topic: 'Maximum AC power transfer', section: 'D', textbook: 'A&S chap 4', slides: 'D_6.pdf', annot: null },
    { n: 30, date: '2026-04-08', title: '1st Order 1', topic: 'First-order circuit concepts', section: 'F', textbook: 'A&S chap 7', slides: 'F_1.pdf', annot: null },
    { n: 31, date: '2026-04-10', title: '1st Order 2', topic: 'General solution for first-order circuits', section: 'F', textbook: 'A&S chap 7', slides: 'F_2.pdf', annot: null },
    { n: 32, date: '2026-04-13', title: '1st Order 3', topic: 'First-order circuit examples', section: 'F', textbook: 'A&S chap 7', slides: 'F_3.pdf', annot: null },
    { n: 33, date: '2026-04-15', title: '1st Order 4', topic: 'Finding other circuit variables', section: 'F', textbook: 'A&S chap 7', slides: 'F_4.pdf', annot: null },
    { n: 34, date: '2026-04-17', title: '1st Order 5', topic: 'More first-order examples', section: 'F', textbook: 'A&S chap 7', slides: 'F_5.pdf', annot: null },
    { n: 35, date: '2026-04-20', title: '2nd Order 1', topic: 'Second-order circuit concepts', section: 'G', textbook: 'A&S chap 8', slides: 'G_1.pdf', annot: null },
    { n: 36, date: '2026-04-22', title: '2nd Order 2', topic: 'Initial conditions for second-order circuits', section: 'G', textbook: 'A&S chap 8', slides: 'G_2.pdf', annot: null },
    { n: 37, date: '2026-04-24', title: '2nd Order 3', topic: 'Full solution of second-order circuits', section: 'G', textbook: 'A&S chap 8', slides: 'G_3.pdf', annot: null },
    { n: 38, date: '2026-04-27', title: '2nd Order 4', topic: 'Second-order examples', section: 'G', textbook: 'A&S chap 8', slides: 'G_4.pdf', annot: null },
    { n: 39, date: '2026-04-29', title: 'Mesh', topic: 'Mesh current method: concepts and examples', section: 'H', textbook: 'A&S chap 4', slides: 'H_1.pdf', annot: null },
  ];

  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, course_id, lecture_number, date, title, topic, section, textbook_ref, slides_file, annotated_file)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of lessons) {
    insertLesson.run(
      `lesson-${l.n}`,
      COURSE_ID,
      l.n,
      l.date,
      l.title,
      l.topic,
      l.section,
      l.textbook,
      l.slides,
      l.annot
    );
  }

  // ── Default settings ───────────────────────────────────────────────────────
  const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  insertSetting.run('student_name', 'Student');
  insertSetting.run('ai_enabled', 'true');
  insertSetting.run('focus_sprint_minutes', '10');
  insertSetting.run('theme', 'light');
}
