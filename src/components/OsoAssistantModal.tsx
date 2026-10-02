import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, MessageCircle, Utensils, RefreshCw } from 'lucide-react';
import { ChatMessage, RestaurantConfig, Product } from '../types';

interface OsoAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  products: Product[];
  onOpenProduct: (product: Product) => void;
}

export const OsoAssistantModal: React.FC<OsoAssistantModalProps> = ({
  isOpen,
  onClose,
  config,
  products,
  onOpenProduct,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! 🐾 I am **Oso Assistant**, your culinary guide at **Oso Fusion**.\n\nI can recommend dishes based on your cravings, verify allergens and ingredients, share our active promotions (like Fusion Wednesday or Birthday perks), or answer your questions about delivery and dining in Ibagué.`,
      timestamp: 'Now',
      suggestions: [
        'What dish do you recommend?',
        'Do you have gluten-free options?',
        'What promotions are active?',
        'Where are you located and what are your hours?',
        'How does home delivery work in Ibagué?',
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (!res.ok) throw new Error('Connection error');
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Chat error fallback:', err);
      const fallbackMsg: ChatMessage = {
        id: `ast-err-${Date.now()}`,
        sender: 'assistant',
        text: `Pardon me, I encountered a brief network delay. You can also chat directly with our culinary team via WhatsApp at **${config.phone}** for immediate assistance. 🐾`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:items-end p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md h-[85vh] sm:h-[620px] rounded-2xl bg-[#161D18] border border-[#E5B869]/50 shadow-2xl flex flex-col text-[#F3EFE6] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#1A231D] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bear Avatar SVG Icon */}
            <div className="w-10 h-10 rounded-full bg-[#202923] border border-[#E5B869] flex items-center justify-center relative overflow-hidden shadow-inner">
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                <circle cx="27" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2" />
                <circle cx="73" cy="30" r="14" fill="#202422" stroke="#E5B869" strokeWidth="2" />
                <circle cx="50" cy="54" r="34" fill="#181C19" stroke="#E5B869" strokeWidth="2" />
                <path d="M 28 46 C 26 38, 44 38, 45 47 C 46 54, 30 55, 28 46 Z" stroke="#E5B869" strokeWidth="3" />
                <path d="M 72 46 C 74 38, 56 38, 55 47 C 54 54, 70 55, 72 46 Z" stroke="#E5B869" strokeWidth="3" />
                <circle cx="37" cy="46" r="3" fill="#F3EFE6" />
                <circle cx="63" cy="46" r="3" fill="#F3EFE6" />
                <ellipse cx="50" cy="62" rx="7" ry="5" fill="#E5B869" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-sm text-[#F3EFE6]">Oso Assistant</h3>
                <span className="w-2 h-2 rounded-full bg-[#8ED09E] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#CFCBC0]/70">
                Official culinary guide • Oso Fusion Ibagué
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#CFCBC0] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#E5B869] text-[#111412] font-medium rounded-tr-none shadow-md'
                    : 'bg-[#1D2620] text-[#F3EFE6] border border-white/10 rounded-tl-none shadow-lg'
                }`}
              >
                {/* Format markdown bold / line breaks nicely */}
                <div className="whitespace-pre-line">
                  {msg.text.split('\n').map((line, idx) => {
                    return (
                      <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Suggestions chips */}
              {msg.suggestions && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestions.map((sug, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleSendMessage(sug)}
                      className="px-2.5 py-1 rounded-full bg-[#202923] hover:bg-[#E5B869] hover:text-[#111412] text-[11px] text-[#CFCBC0] border border-white/10 hover:border-transparent transition-all cursor-pointer text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-[#CFCBC0]/50 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#1D2620] border border-white/10 text-xs text-[#E5B869] w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-[#CFCBC0] ml-1">Oso is crafting a recommendation...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-[#1A231D] border-t border-white/10 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about dishes, allergens, pairing recommendations..."
            className="flex-1 rounded-xl bg-[#141A16] border border-white/10 px-3.5 py-2 text-xs text-[#F3EFE6] placeholder-[#CFCBC0]/50 focus:border-[#E5B869] focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="p-2 rounded-xl bg-[#E5B869] hover:bg-[#F5DCA3] text-[#111412] disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
