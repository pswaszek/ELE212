import { NextResponse } from 'next/server';
import { getAI, AI_MODEL } from '@/lib/ai/client';
import { buildSystemPrompt } from '@/lib/ai/prompts';
import { detectStudentState } from '@/lib/ai/behaviors';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    messages,
    contextType = 'general',
    assignmentTitle,
    lessonTopic,
  }: {
    messages: ChatMessage[];
    contextType?: 'assignment' | 'lesson' | 'general';
    assignmentTitle?: string;
    lessonTopic?: string;
  } = body;

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'messages required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: "AI tutor is not configured yet. Add your ANTHROPIC_API_KEY to .env.local to enable it.",
      studentState: 'engaged',
    });
  }

  const studentState = detectStudentState(messages);

  try {
    const ai = getAI();
    const systemPrompt = buildSystemPrompt({
      type: contextType,
      studentState,
      assignmentTitle,
      lessonTopic,
    });

    const response = await ai.messages.create({
      model: AI_MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ message: text, studentState });
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 });
  }
}
