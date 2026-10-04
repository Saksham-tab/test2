import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight, CornerDownRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useCartStore } from '../../store/useCartStore';
import { chatService } from '../../services/chatService';
import { productsData } from '../../data/products';
import { ChatMessage } from '../../types/ai';
import { formatPrice } from '../../lib/utils';
import { Link, useRouter } from '../../lib/router';
import { analytics } from '../../lib/analytics';

const SUGGESTED_PROMPTS = [
  'Help me find something for sleep',
  'Show me hair care for shedding',
  'Build me a night routine',
  'What are the benefits of saffron?',
  'What is your shipping policy?',
];

export const ChatbotWidget: React.FC = () => {
  const { isChatbotOpen, closeChatbot, toggleChatbot, openChatbot } = useUIStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { navigate } = useRouter();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([chatService.getInitialMessage()]);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isChatbotOpen) {
      analytics.track('chatbot_opened');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isChatbotOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setInputText('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    analytics.track('chatbot_message_sent', { textLength: text.length });

    try {
      const response = await chatService.sendMessage(text);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I couldn't process that inquiry right now. Please explore our shop or contact our customer care circle.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatbotOpen && (
        <button
          onClick={openChatbot}
          aria-label="Open AI Wellness Guide Chatbot"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-[#434D3D] hover:bg-[#343D2F] text-[#FAF7F2] py-3 px-4.5 rounded-full shadow-lg transition-transform hover:scale-105 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#434D3D]"
        >
          <Sparkles size={16} className="text-[#C59B27]" />
          <span className="text-xs font-semibold tracking-wide">Wellness Guide</span>
        </button>
      )}

      {/* Chatbot Window (Bottom-right on desktop, sheet on mobile) */}
      {isChatbotOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 sm:max-w-md h-[90vh] sm:h-[580px] bg-[#FAF7F2] sm:rounded-xl shadow-2xl border border-[#D5CCC0] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#434D3D] text-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FAF7F2]/15 flex items-center justify-center text-[#C59B27]">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold tracking-wide">Wellness Guide</h3>
                <p className="text-[10px] text-[#FAF7F2]/80">
                  Grounded botanical assistant
                </p>
              </div>
            </div>
            <button
              onClick={closeChatbot}
              className="p-1 text-[#FAF7F2]/80 hover:text-[#FAF7F2] rounded-md transition-colors"
              aria-label="Close Wellness Guide"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const recommendedProducts = msg.recommendedProductIds
                ? productsData.filter((p) => msg.recommendedProductIds?.includes(p.id))
                : [];

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#434D3D] text-[#FAF7F2] rounded-br-xs'
                        : 'bg-[#F4EFEB] text-[#23201D] border border-[#E8E2D8] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action Link if provided */}
                    {msg.suggestedAction && (
                      <button
                        onClick={() => {
                          closeChatbot();
                          navigate(msg.suggestedAction!.payload);
                        }}
                        className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[#A35843] hover:underline"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>

                  {/* Grounded Recommended Product Cards inside Chat */}
                  {recommendedProducts.length > 0 && (
                    <div className="w-full mt-2 space-y-2">
                      {recommendedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#D5CCC0] rounded-md"
                        >
                          <div
                            onClick={() => {
                              closeChatbot();
                              navigate(`/products/${p.slug}`);
                            }}
                            className="flex items-center gap-2 cursor-pointer min-w-0"
                          >
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-9 h-9 object-cover rounded bg-[#EBE3D8] shrink-0"
                            />
                            <div className="min-w-0">
                              <h5 className="text-[11px] font-semibold text-[#23201D] truncate">
                                {p.name}
                              </h5>
                              <span className="text-[10px] text-[#635F59]">
                                {formatPrice(p.price)}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => addItem(p.id, undefined, 1, true)}
                            className="shrink-0 text-[11px] font-semibold text-[#434D3D] hover:underline px-2 py-1 bg-[#F4EFEB] rounded border border-[#E8E2D8]"
                          >
                            + Cart
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[9px] text-[#8E8A83] mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 bg-[#F4EFEB] rounded-lg max-w-[40%] border border-[#E8E2D8]">
                <span className="w-1.5 h-1.5 bg-[#635F59] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#635F59] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#635F59] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Rail */}
          <div className="px-3 py-2 bg-[#F4EFEB] border-t border-[#E8E2D8] flex gap-2 overflow-x-auto no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="shrink-0 text-[10px] bg-[#FAF7F2] hover:bg-[#EBE3D8] text-[#635F59] border border-[#D5CCC0] px-2.5 py-1 rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-[#FAF7F2] border-t border-[#E8E2D8] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about concerns, ingredients, routines..."
              className="flex-1 bg-[#F4EFEB] text-xs text-[#23201D] placeholder:text-[#8E8A83] px-3 py-2.5 rounded-md border border-[#E8E2D8] focus:outline-none focus:border-[#434D3D]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 bg-[#434D3D] text-[#FAF7F2] hover:bg-[#343D2F] disabled:opacity-40 rounded-md transition-colors"
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
