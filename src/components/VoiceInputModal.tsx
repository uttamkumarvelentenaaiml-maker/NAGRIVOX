import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';
import { SpeechService } from '../services/speechService';
import { SupportedLanguage } from '../locales/translations';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: SupportedLanguage;
  onTranscript: (text: string) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({
  isOpen,
  onClose,
  lang,
  onTranscript
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const stopListeningRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setError('');
      startVoiceSession();
    } else {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
    }
  }, [isOpen]);

  const startVoiceSession = () => {
    setIsListening(true);
    const stopFn = SpeechService.startListening(
      lang,
      (text) => {
        setTranscript(text);
        setIsListening(false);
        setTimeout(() => {
          onTranscript(text);
          onClose();
        }, 600);
      },
      (err) => {
        setError(err || 'Voice input failed');
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
    stopListeningRef.current = stopFn;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="py-4 space-y-4">
          <div className="relative inline-block">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-transform ${
              isListening ? 'bg-red-50 text-red-600 scale-110' : 'bg-emerald-50 text-[#006B4F]'
            }`}>
              {isListening ? (
                <Mic className="w-8 h-8 animate-pulse text-red-600" />
              ) : (
                <MicOff className="w-8 h-8 text-slate-400" />
              )}
            </div>
            {isListening && (
              <span className="absolute -inset-1 rounded-full border-2 border-red-400 animate-ping pointer-events-none" />
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isListening ? 'Listening...' : 'Processing voice...'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ask about any scheme or document in your preferred Indian language
            </p>
          </div>

          {transcript && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-[#004D3A] text-xs font-semibold">
              "{transcript}"
            </div>
          )}

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                if (isListening) {
                  stopListeningRef.current?.();
                  setIsListening(false);
                } else {
                  startVoiceSession();
                }
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isListening ? 'Stop Listening' : 'Tap to Speak Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
