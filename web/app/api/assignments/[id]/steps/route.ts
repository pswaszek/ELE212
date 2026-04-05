import { NextResponse } from 'next/server';
import { getAssignmentById, updateAssignment } from '@/lib/db/queries';
import { getAI, AI_MODEL, AI_MAX_TOKENS } from '@/lib/ai/client';
import { buildBreakdownPrompt } from '@/lib/ai/prompts';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignment = getAssignmentById(id);
  if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // If steps already exist, return them
  const existing = JSON.parse(assignment.steps || '[]');
  if (existing.length > 0) {
    return NextResponse.json({ steps: existing });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Return sensible default steps if no AI key
    const defaultSteps = buildDefaultSteps(assignment);
    updateAssignment(id, { steps: JSON.stringify(defaultSteps) });
    return NextResponse.json({ steps: defaultSteps });
  }

  try {
    const ai = getAI();
    const prompt = buildBreakdownPrompt(assignment);

    const response = await ai.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON array in response');

    const steps: string[] = JSON.parse(jsonMatch[0]);
    updateAssignment(id, { steps: JSON.stringify(steps) });
    return NextResponse.json({ steps });
  } catch (err) {
    console.error('AI steps error:', err);
    const fallback = buildDefaultSteps(assignment);
    updateAssignment(id, { steps: JSON.stringify(fallback) });
    return NextResponse.json({ steps: fallback });
  }
}

function buildDefaultSteps(a: { title: string; topic: string | null; type: string }): string[] {
  const base = [
    `Open the ${a.title} assignment page`,
    'Read the problem statement carefully',
    'Identify all given values',
    'Draw or label the circuit diagram',
    'Choose the right analysis method',
    'Write your equations',
    'Solve step by step',
    'Check your units and answer',
    'Submit your work',
  ];

  if (a.type === 'extra_credit') {
    return [
      `Open the ${a.title} extra credit page`,
      'Read all parts before starting',
      'Solve part 1',
      'Solve part 2',
      'Double-check both answers',
      'Submit for extra points',
    ];
  }

  return base;
}
