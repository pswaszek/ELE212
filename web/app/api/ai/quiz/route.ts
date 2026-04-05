import { NextResponse } from 'next/server';
import { getAI, AI_MODEL } from '@/lib/ai/client';
import { buildQuizPrompt } from '@/lib/ai/prompts';

export async function POST(req: Request) {
  const { topic } = await req.json();
  if (!topic) return NextResponse.json({ error: 'topic required' }, { status: 400 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(buildFallbackQuiz(topic));
  }

  try {
    const ai = getAI();
    const response = await ai.messages.create({
      model: AI_MODEL,
      max_tokens: 400,
      messages: [{ role: 'user', content: buildQuizPrompt(topic) }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (err) {
    console.error('Quiz generation error:', err);
    return NextResponse.json(buildFallbackQuiz(topic));
  }
}

function buildFallbackQuiz(topic: string) {
  return {
    question: `Which best describes the main goal of ${topic}?`,
    choices: [
      'A. Simplify circuit analysis',
      'B. Add more components',
      'C. Increase circuit complexity',
    ],
    correct: 'A',
    explanation: 'Most circuit analysis techniques aim to simplify the math needed to find voltages and currents.',
  };
}
