// frontend/src/components/VoiceSynthesizer.ts
// Cyberpunk AI Voice Announcer using Web Speech API with pitch & rate modulation
"use client";

class CyberVoiceAnnouncer {
  private enabled: boolean = true;
  private synth: SpeechSynthesis | null = null;
  private uzVoice: SpeechSynthesisVoice | null = null;
  private enVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      try {
        const saved = localStorage.getItem("ghostqa_voice_enabled");
        if (saved !== null) {
          this.enabled = saved === "true";
        }
      } catch (e) {}
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Look for Turkish or Russian or English as best phonetic matches for cyber voice
    this.uzVoice = voices.find((v) => v.lang.startsWith("tr") || v.lang.startsWith("ru")) || null;
    this.enVoice = voices.find((v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("google")) || voices.find((v) => v.lang.startsWith("en")) || null;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggleVoice(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem("ghostqa_voice_enabled", String(this.enabled));
    } catch (e) {}
    if (this.enabled) {
      this.speak("Ovozli nazorat yoqildi. Ghost-QA Sentinel himoyada.", "uz");
    } else {
      if (this.synth) this.synth.cancel();
    }
    return this.enabled;
  }

  public speak(text: string, lang: "uz" | "en" | "ru" = "uz") {
    if (!this.enabled || !this.synth) return;

    try {
      // Cancel pending utterances to stay in sync with real-time UI
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05; // Slightly rapid, energetic
      utterance.pitch = 0.95; // Slightly deeper, authoritative synth tone

      if (lang === "uz") {
        if (this.uzVoice) {
          utterance.voice = this.uzVoice;
        } else if (this.enVoice) {
          utterance.voice = this.enVoice;
        }
      } else if (lang === "en" && this.enVoice) {
        utterance.voice = this.enVoice;
      }

      this.synth.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis non-fatal error:", err);
    }
  }

  // Pre-configured Cyber Alerts
  public announceScanStart(target: string, lang: "uz" | "en" | "ru" = "uz") {
    const cleanUrl = target.replace(/^https?:\/\//, "").split("/")[0];
    if (lang === "uz") {
      this.speak(`Diqqat! Beshta avtonom agent nishonga yo'naltirildi. Nishon: ${cleanUrl}`, "uz");
    } else if (lang === "ru") {
      this.speak(`Внимание! Пять автономных агентов запущены по цели: ${cleanUrl}`, "ru");
    } else {
      this.speak(`Alert! Five autonomous agents deployed to target: ${cleanUrl}`, "en");
    }
  }

  public announceDefect(bugType: string, lang: "uz" | "en" | "ru" = "uz") {
    if (lang === "uz") {
      this.speak(`Qizil xavf! Saytda nosozlik aniqlandi: ${bugType}`, "uz");
    } else if (lang === "ru") {
      this.speak(`Красная тревога! Обнаружен дефект: ${bugType}`, "ru");
    } else {
      this.speak(`Critical alert! Runtime defect discovered: ${bugType}`, "en");
    }
  }

  public announceHealed(lang: "uz" | "en" | "ru" = "uz") {
    if (lang === "uz") {
      this.speak("Google Gemini 3.8 Flash koddagi xatoni tuzatdi. Git diff tayyor!", "uz");
    } else if (lang === "ru") {
      this.speak("Google Gemini 3.8 Flash исправил ошибку в коде. Патч готов!", "ru");
    } else {
      this.speak("Google Gemini 3.8 Flash healed the defect. Unified git diff is ready!", "en");
    }
  }

  public announceScanComplete(score: number, lang: "uz" | "en" | "ru" = "uz") {
    if (lang === "uz") {
      this.speak(`Audit yakunlandi. Sayt salomatlik reytingi: ${score} ball. Tizim himoyalangan.`, "uz");
    } else if (lang === "ru") {
      this.speak(`Аудит завершён. Рейтинг здоровья: ${score} баллов. Система защищена.`, "ru");
    } else {
      this.speak(`Audit completed. Site health score: ${score} points. System verified.`, "en");
    }
  }
}

export const cyberVoice = new CyberVoiceAnnouncer();
