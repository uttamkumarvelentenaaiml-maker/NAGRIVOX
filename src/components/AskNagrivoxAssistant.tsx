import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Bot, 
  User, 
  CornerDownLeft,
  RotateCcw
} from 'lucide-react';
import { ChatMessage } from '../types';
import { SupportedLanguage, TRANSLATIONS } from '../locales/translations';
import { SpeechService } from '../services/speechService';
import { ApiClient } from '../services/apiClient';

interface AskNagrivoxAssistantProps {
  lang: SupportedLanguage;
  onApplyAction?: (action: string) => void;
}

export const AskNagrivoxAssistant: React.FC<AskNagrivoxAssistantProps> = ({
  lang,
  onApplyAction
}) => {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: t.aiGreeting || "Namaste! I'm NAGRIVOX. You can ask me in any Indian language.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Mere documents se kya schemes mil sakti hain?',
        'Domicile certificate kaise banaye?',
        'Scholarship ke liye kya documents chahiye?'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stopListeningRef = useRef<(() => void) | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const data = await ApiClient.sendChatMessage(text, lang);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: 'Unable to process your question right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
    } else {
      setIsListening(true);
      const stopFn = SpeechService.startListening(
        lang,
        (transcript) => {
          setInput(transcript);
          setIsListening(false);
          handleSend(transcript);
        },
        (error) => {
          console.warn('Speech error:', error);
          setIsListening(false);
        },
        () => {
          setIsListening(false);
        }
      );
      stopListeningRef.current = stopFn;
    }
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      SpeechService.speak(text, lang);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#004D3A] to-[#006B4F] flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{t.askNagrivox || 'Ask NAGRIVOX'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">
              Grounded AI • 10+ Languages
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            SpeechService.stopSpeaking();
            setMessages([
              {
                id: 'msg-welcome-reset',
                role: 'assistant',
                content: t.aiGreeting || "Namaste! I'm NAGRIVOX. You can ask me in any Indian language.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestedPrompts: [
                  'Mere documents se kya schemes mil sakti hain?',
                  'Domicile certificate kaise banaye?',
                  'Scholarship ke liye kya documents chahiye?'
                ]
              }
            ]);
          }}
          title="Reset Chat"
          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
        {messages.map((msg) => {
          const isBot = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
            >
              <div
                className={`
                  max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-[13px] leading-relaxed relative
                  ${isBot
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                    : 'bg-[#006B4F] text-white shadow-xs'}
                `}
              >
                {/* Content */}
                <div className="whitespace-pre-wrap font-normal">
                  {msg.content}
                </div>

                {/* Citations if available */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">Official Citations:</p>
                    {msg.citations.map((cite, i) => (
                      <a
                        key={i}
                        href={cite.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#006B4F] hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{cite.title}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* Text-to-speech button on bot messages */}
                {isBot && (
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="p-1 hover:text-[#006B4F] transition-colors"
                      title="Read Aloud (सुनें)"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Suggested prompt chips */}
              {msg.suggestedPrompts && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                  {msg.suggestedPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#006B4F] border border-emerald-200/60 transition-colors text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 w-fit">
            <Sparkles className="w-4 h-4 text-[#006B4F] animate-spin" />
            <span>Analyzing documents & official scheme rules...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.aiPlaceholder || 'Type your question here...'}
              className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006B4F]/20 focus:border-[#006B4F] transition-all"
            />
            <button
              type="button"
              onClick={handleVoiceToggle}
              title={isListening ? 'Stop Listening' : 'Voice Input (बोलकर पूछें)'}
              className={`absolute inset-y-0 right-0 pr-2.5 flex items-center ${
                isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-[#006B4F]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-[#006B4F] hover:bg-[#004D3A] text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
