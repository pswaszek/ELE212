// ADHD support behavior logic – detects student state from message patterns

import type { StudentState } from './prompts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const CONFUSION_SIGNALS = [
  "don't understand", "dont understand", "confused", "confusing",
  "lost", "no idea", "what does", "what is", "huh?", "what?",
  "help", "stuck", "explain", "i don't get", "i dont get",
  "makes no sense", "how does", "why does"
];

const OVERWHELM_SIGNALS = [
  "too much", "overwhelming", "so much", "can't do", "cant do",
  "too hard", "give up", "stressed", "freaking out", "panic",
  "impossible", "don't know where to start", "dont know where to start"
];

const DISENGAGED_SIGNALS: RegExp[] = [
  /^.{0,10}$/, // very short message (< 10 chars)
];

export function detectStudentState(messages: Message[]): StudentState {
  if (messages.length === 0) return 'engaged';

  const recentMessages = messages.slice(-3);
  const recentUserText = recentMessages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  if (OVERWHELM_SIGNALS.some(s => recentUserText.includes(s))) {
    return 'overwhelmed';
  }
  if (CONFUSION_SIGNALS.some(s => recentUserText.includes(s))) {
    return 'confused';
  }

  // Check if user messages are very short (disengaged)
  const userMessages = recentMessages.filter(m => m.role === 'user');
  if (userMessages.length >= 2) {
    const allShort = userMessages.every(m => m.content.trim().length < 15);
    if (allShort) return 'disengaged';
  }

  return 'engaged';
}

// Re-engagement starter messages by state
export function getReEngagementMessage(state: StudentState): string {
  switch (state) {
    case 'confused':
      return "Let's slow down. What's the one thing that's not clicking right now?";
    case 'overwhelmed':
      return "You only need to do one thing. What would be the easiest first step — A: read the question, or B: draw the circuit?";
    case 'disengaged':
      return "Hey — still there? Try this: just tell me the topic you're stuck on in one word.";
    default:
      return "Where would you like to start?";
  }
}

// Choose the right starter question for an assignment
export function buildStarterQuestion(topic: string | null): string {
  if (!topic) return "What part of this assignment do you want to tackle first?";
  const lower = topic.toLowerCase();
  if (lower.includes('thevenin')) {
    return "Quick check — do you remember what a Thevenin equivalent is? (A: a voltage + resistor combo, B: just a resistor, C: not sure)";
  }
  if (lower.includes('phasor')) {
    return "Before we start — phasors turn AC signals into easier math. Does that ring a bell? (A: yes, B: kind of, C: no)";
  }
  if (lower.includes('node') || lower.includes('nodal')) {
    return "Nodal analysis means writing one equation per circuit node. Does that make sense so far? (A: yes, B: not sure)";
  }
  if (lower.includes('kirchhoff') || lower.includes('kvl') || lower.includes('kcl')) {
    return "KVL = voltages around a loop add to zero. KCL = currents at a node add to zero. Do both feel familiar? (A: yes, B: one of them, C: neither)";
  }
  if (lower.includes('1st order') || lower.includes('first order')) {
    return "First-order circuits are like a bathtub filling up or draining — they change exponentially over time. Does that analogy make sense? (A: yes, B: sort of)";
  }
  if (lower.includes('2nd order') || lower.includes('second order')) {
    return "Second-order circuits can oscillate — like a spring bouncing. Ready to look at the math? (A: yes, B: explain the concept first)";
  }
  return `What part of "${topic}" would you like help with first?`;
}

// Urgency label based on hours until due
export function getUrgencyLabel(dueDate: string | null): {
  label: string;
  color: string;
  level: 'critical' | 'high' | 'medium' | 'low' | 'done';
} {
  if (!dueDate) return { label: 'No due date', color: 'slate', level: 'low' };

  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) return { label: 'Overdue', color: 'red', level: 'critical' };
  if (diffHours < 24) return { label: 'Due today', color: 'red', level: 'critical' };
  if (diffHours < 48) return { label: 'Due tomorrow', color: 'orange', level: 'high' };
  if (diffHours < 72) return { label: 'Due in 2 days', color: 'amber', level: 'high' };
  if (diffHours < 168) return { label: 'Due this week', color: 'yellow', level: 'medium' };
  return { label: 'Upcoming', color: 'slate', level: 'low' };
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return 'No due date';
  const d = new Date(dueDate);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

import type { Assignment } from '../db/queries';

export function getTopRecommendation(assignments: Assignment[]): Assignment | null {
  if (assignments.length === 0) return null;

  // Priority: overdue first, then soonest due
  const actionable = assignments.filter(a =>
    a.status === 'overdue' || a.status === 'in_progress' || a.status === 'upcoming'
  );

  if (actionable.length === 0) return null;

  // Overdue wins
  const overdue = actionable.filter(a => a.status === 'overdue');
  if (overdue.length > 0) return overdue[0];

  // In progress second
  const inProgress = actionable.filter(a => a.status === 'in_progress');
  if (inProgress.length > 0) return inProgress[0];

  // Soonest due
  return actionable.sort((a, b) => {
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  })[0];
}
