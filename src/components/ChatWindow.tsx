'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Smile } from 'lucide-react';

export default function ChatWindow() {
  const [messages, setMessages] = useState<{
    id: string;
    text: string;
    fromMe?: boolean;
    time?: string;
  }[]>([
    { id: 'm1', text: 'Hi! Is this still available?', fromMe: false, time: '10:04' },
    { id: 'm2', text: 'Yes — it is! Where are you located?', fromMe: true, time: '10:06' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const m = { id: Date.now().toString(), text: input.trim(), fromMe: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((s) => [...s, m]);
    setInput('');
    setTyping(false);
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-3xl">
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">MA</div>
        <div className="flex-1">
          <div className="text-sm font-600 text-foreground">Maya Alvarez</div>
          <div className="text-xs text-muted-foreground">Active • Portland, OR</div>
        </div>
      </div>

      <div ref={ref} className="p-4 h-80 overflow-y-auto space-y-3 bg-background">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`${m.fromMe ? 'bg-primary text-background' : 'bg-muted text-foreground'} rounded-lg px-3 py-2 text-sm max-w-[78%]`}> 
              {m.text}
              <div className="text-[10px] text-muted-foreground mt-1 text-right">{m.time}</div>
            </div>
          </div>
        ))}

        {typing && (
          <div className="text-xs text-muted-foreground">Typing…</div>
        )}
      </div>

      <div className="p-3 border-t border-border flex items-center gap-2">
        <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Smile size={18} /></button>
        <button className="p-2 rounded-lg hover:bg-muted transition-colors"><Image size={18} /></button>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setTyping(Boolean(e.target.value)); }}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Write a message…"
          className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <button onClick={send} className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2">
          <Send size={14} />
          Send
        </button>
      </div>
    </div>
  );
}
