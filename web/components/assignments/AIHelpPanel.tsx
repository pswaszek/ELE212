'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';
import { buildStarterQuestion } from '@/lib/ai/behaviors';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIHelpPanelProps {
  contextType: 'assignment' | 'lesson' | 'general';
  assignmentTitle?: string;
  lessonTopic?: string;
  starterTopic?: string | null;
}

export function AIHelpPanel({
  contextType,
  assignmentTitle,
  lessonTopic,
  starterTopic,
}: AIHelpPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          contextType,
          assignmentTitle,
          lessonTopic,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I couldn't connect. Check your API key in .env.local."
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    const starter = buildStarterQuestion(starterTopic ?? lessonTopic ?? null);
    setStarted(true);
    setMessages([{ role: 'assistant', content: starter }]);
  }

  return (
    <Card padding="none" className="flex flex-col h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">AI Tutor</p>
          <p className="text-xs text-slate-400">Ask anything about this material</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {!started && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <Bot size={22} className="text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">Ready to help</p>
              <p className="text-xs text-slate-400 mt-0.5">I'll keep it simple and clear.</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleStart}>
              Get me started
            </Button>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={clsx(
              'flex gap-2',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}>
              <div className={clsx(
                'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-100'
              )}>
                {msg.role === 'user'
                  ? <User size={12} className="text-white" />
                  : <Bot size={12} className="text-slate-500" />
                }
              </div>
              <div className={clsx(
                'max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-100'
              )}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Bot size={12} className="text-slate-500" />
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-3 py-2">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {started && (
        <div className="px-3 py-3 border-t border-slate-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask a question..."
              className="flex-1 text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
            />
            <Button
              size="sm"
              icon={<Send size={14} />}
              onClick={() => sendMessage(input)}
              loading={loading}
              disabled={!input.trim()}
            />
          </div>
        </div>
      )}
    </Card>
  );
}
