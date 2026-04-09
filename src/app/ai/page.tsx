// NutriSihat - AI Assistant Page
// Mobile-first design for elderly users

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, UtensilsCrossed, Pill, Sparkles, ArrowLeft, Send, Bot, User, Loader2, MessageCircle } from 'lucide-react';
import { AI_ASSISTANT } from '@/lib/constants';
import ReactMarkdown from 'react-markdown';

export default function AIPage(): JSX.Element {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: AI_ASSISTANT.greeting_detail },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userMessage }], userId: 'anonymous' }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || 'Failed');
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Maaf, masalah sambungan. Cuba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => setInput(suggestion);

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background main-content">
      {/* Header */}
      <header className="page-header">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <ArrowLeft size={24} />
              <span className="text-base font-semibold hidden sm:inline">Kembali</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <Sparkles size={24} />
              <span className="hidden sm:inline">{AI_ASSISTANT.title}</span>
              <span className="sm:hidden">AI</span>
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="w-full px-4 py-4 space-y-4 sm:px-6 sm:py-6 animate-fade-in pb-36">
        {/* Welcome */}
        <section className="text-center py-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bot className="text-accent flex-shrink-0" size={32} />
            <h2 className="text-lg sm:text-2xl font-bold text-primary">{AI_ASSISTANT.description}</h2>
          </div>
          <p className="text-base sm:text-lg text-primary-light">{AI_ASSISTANT.greeting}</p>
        </section>

        {/* Suggestions */}
        <section className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-primary flex items-center gap-2">
            <MessageCircle size={20} /> Cadangan:
          </h3>
          <div className="flex flex-wrap gap-2">
            {AI_ASSISTANT.suggestions.map((suggestion, i) => (
              <Button key={i} variant="outline" size="sm" onClick={() => handleSuggestion(suggestion)} className="text-sm">
                {suggestion}
              </Button>
            ))}
          </div>
        </section>

        {/* Chat */}
        <section className="space-y-3">
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {messages.map((msg, i) => (
              <Card key={i} className={`p-3 sm:p-4 ${msg.role === 'user' ? 'bg-primary-50 ml-8 sm:ml-12' : 'bg-white mr-8 sm:mr-12'}`}>
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${msg.role === 'user' ? 'bg-primary' : 'bg-accent'}`}>
                    {msg.role === 'user' ? <User size={20} className="text-white" /> : <Bot size={20} className="text-primary" />}
                  </div>
                  <div className="flex-grow min-w-0">
                    <span className={`text-sm font-semibold ${msg.role === 'user' ? 'text-primary' : 'text-accent-dark'}`}>
                      {msg.role === 'user' ? 'Mak' : 'AI'}
                    </span>
                    <div className="text-base text-primary mt-1 prose prose-sm max-w-none prose-headings:text-primary prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
                      {msg.role === 'assistant' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : <p>{msg.content}</p>}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {isLoading && (
              <Card className="p-3 sm:p-4 bg-white mr-8 sm:mr-12">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Bot size={20} className="text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin text-accent" />
                    <span className="text-base text-primary">{AI_ASSISTANT.messages.thinking}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <Card className="p-3 sm:p-4 bg-accent/10 border-2 border-accent">
            <p className="text-sm sm:text-base text-primary">{AI_ASSISTANT.disclaimer}</p>
          </Card>
        </section>
      </div>

      {/* Input Bar - Fixed */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-primary-100 shadow-lg p-3 sm:p-4 z-40 safe-bottom">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-3">
            <input
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={AI_ASSISTANT.placeholder}
              className="flex-grow min-h-[48px] sm:min-h-[52px] px-4 rounded-xl border-2 border-primary-100 text-base sm:text-lg text-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="accent" size="lg" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send size={20} className="sm:mr-1" />
              <span className="hidden sm:inline">{AI_ASSISTANT.buttons.send}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <div className="w-full px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <Home size={24} /><span className="text-xs sm:text-sm font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <UtensilsCrossed size={24} /><span className="text-xs sm:text-sm font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 min-h-[56px]">
              <Pill size={24} /><span className="text-xs sm:text-sm font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
              <Sparkles size={24} /><span className="text-xs sm:text-sm font-semibold">AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}