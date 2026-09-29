export class SpeechService {
  private static recognition: any = null;

  public static isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public static isSpeechSynthesisSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  public static startListening(
    lang: string = 'hi-IN',
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): () => void {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please type your message.');
      return () => {};
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          onResult(finalTranscript);
        }
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error || 'Speech input interrupted');
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();

      return () => {
        if (this.recognition) {
          try {
            this.recognition.stop();
          } catch (e) {
            // ignore
          }
        }
      };
    } catch (err: any) {
      onError(err.message || 'Microphone access failed');
      return () => {};
    }
  }

  public static speak(text: string, lang: string = 'hi-IN'): void {
    if (!this.isSpeechSynthesisSupported()) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick appropriate voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchVoice = voices.find(v => v.lang.startsWith(lang));
    if (matchVoice) {
      utterance.voice = matchVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking(): void {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}
