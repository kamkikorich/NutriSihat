// NutriSihat - AI Assistant Page
// Ollama AI integration placeholder

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive } from '@/components/ui/card';
import {
  Home,
  UtensilsCrossed,
  Pill,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  RefreshCw,
} from 'lucide-react';
import { AI_ASSISTANT, BUTTONS } from '@/lib/constants';

export default function AIPage(): JSX.Element {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([
    {
      role: 'assistant',
      content: AI_ASSISTANT.greeting_detail,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle send message
  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    // Simulate AI response (placeholder)
    setTimeout(() => {
      let response = '';
      
      // Simple keyword-based responses for demo
      if (userMessage.toLowerCase().includes('nasi lemak')) {
        response = 'Mak, Nasi Lemak adalah makanan yang tinggi GI (85) dan mengandungi nasi putih, santan, dan sambal manis. Untuk diabetes, elakkan atau kurangkan Nasi Lemak. Alternatif: Nasi brown dengan lauk sihat.';
      } else if (userMessage.toLowerCase().includes('teh tarik')) {
        response = 'Mak, Teh Tarik adalah minuman yang sangat tinggi gula. Untuk diabetes, elakkan Teh Tarik biasa. Alternatif: Teh O tanpa gula atau Teh dengan stevia.';
      } else if (userMessage.toLowerCase().includes('selamat') || userMessage.toLowerCase().includes('boleh makan')) {
        response = 'Mak, makanan selamat untuk diabetes dan kesihatan uterus termasuk: sayur hijau (brokoli, kobis, bayam), buah-buahan (apple, jambu batu), protein (ikan, ayam tanpa kulit), dan whole grain (oatmeal).';
      } else if (userMessage.toLowerCase().includes('elak')) {
        response = 'Mak, makanan perlu elak untuk diabetes termasuk: Nasi putih, Teh Tarik, Roti Canai, kuih-muih, minuman manis, dan makanan processed.';
      } else if (userMessage.toLowerCase().includes('uterus') || userMessage.toLowerCase().includes('rahim')) {
        response = 'Mak, untuk kesihatan uterus, makan sayur cruciferous (brokoli, kobis), buah-buahan (apple, tomato, berries), vitamin D dari ikan, dan kurangkan makanan processed.';
      } else {
        response = 'Mak, saya faham pertanyaan anda. Untuk nasihat yang lebih tepat, sila berjumpa doktor atau dietitian. Saya boleh membantu dengan panduan umum tentang makanan untuk diabetes dan kesihatan uterus.';
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1500);
  };
  
  // Handle suggestion click
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={28} />
              <span className="text-lg font-semibold">Kembali</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles size={28} />
              {AI_ASSISTANT.title}
            </h1>
            <div className="w-20" />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-6 animate-fade-in pb-32">
        {/* Welcome */}
        <section className="text-center py-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bot className="text-accent" size={40} />
            <h2 className="text-2xl font-bold text-primary">
              {AI_ASSISTANT.description}
            </h2>
          </div>
          <p className="text-lg text-primary-light">
            {AI_ASSISTANT.greeting}
          </p>
        </section>
        
        {/* Suggestions */}
        <section className="space-y-3">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <MessageCircle size={24} />
            Cadangan Soalan:
          </h3>
          <div className="flex flex-wrap gap-3">
            {AI_ASSISTANT.suggestions.map((suggestion, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestion(suggestion)}
                className="text-base"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </section>
        
        {/* Chat Messages */}
        <section className="space-y-4">
          <div className="space-y-4 max-h-[50vh] overflow-y-auto">
            {messages.map((msg, i) => (
              <Card key={i} className={`p-5 ${
                msg.role === 'user' ? 'bg-primary-50 ml-12' : 'bg-white mr-12'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                  }`}>
                    {msg.role === 'user' ? (
                      <User size={24} className="text-white" />
                    ) : (
                      <Bot size={24} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <span className={`text-base font-semibold ${
                      msg.role === 'user' ? 'text-primary' : 'text-accent-dark'
                    }`}>
                      {msg.role === 'user' ? 'Mak' : 'Penasihat AI'}
                    </span>
                    <p className="text-lg text-primary mt-1">{msg.content}</p>
                  </div>
                </div>
              </Card>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <Card className="p-5 bg-white mr-12">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                    <Bot size={24} className="text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-accent" />
                    <span className="text-lg text-primary">{AI_ASSISTANT.messages.thinking}</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </section>
        
        {/* Disclaimer */}
        <section>
          <Card className="p-4 bg-accent/10 border-2 border-accent">
            <p className="text-base text-primary">
              {AI_ASSISTANT.disclaimer}
            </p>
          </Card>
        </section>
      </div>
      
      {/* Input Bar - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t-2 border-primary-100 shadow-lg p-4 z-40">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={AI_ASSISTANT.placeholder}
              className="flex-grow min-h-[56px] px-6 rounded-xl border-2 border-primary-100 text-lg text-primary placeholder:text-primary-light focus:border-primary"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
              variant="accent"
              size="lg"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex items-center gap-2"
            >
              <Send size={24} />
              {AI_ASSISTANT.buttons.send}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-primary-100 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Home size={28} />
              <span className="text-base font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <UtensilsCrossed size={28} />
              <span className="text-base font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Pill size={28} />
              <span className="text-base font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-primary text-white">
              <Sparkles size={28} />
              <span className="text-base font-semibold">Tanya AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}