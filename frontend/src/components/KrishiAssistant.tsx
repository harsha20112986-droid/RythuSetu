import { useState, useRef } from "react";
import {
  Bot,
  X,
  Volume2,
  VolumeX,
  Copy,
  Mic,
  Send,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { type ChatMessage } from "../types";

export function KrishiAssistant({
  open,
  setOpen,
  language,
  setLanguage,
  messages,
  question,
  setQuestion,
  loading,
  error,
  onSend,
  }: {
  open: boolean;
  setOpen: (v: boolean) => void;
  language: string;
  setLanguage: (l: string) => void;
  messages: ChatMessage[];
  question: string;
  setQuestion: (q: string) => void;
  loading: boolean;
  error: string;
  onSend: (q?: string) => void;
  }) {
  const [listening, setListening] = useState(false);
  const [assistantVoiceError, setAssistantVoiceError] = useState("");
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const quickQuestions =
    language === "Telugu"
      ? [
          "\u0C08 \u0C30\u0C4B\u0C1C\u0C41 \u0C28\u0C3E \u0C2A\u0C02\u0C1F\u0C15\u0C41 \u0C35\u0C3E\u0C24\u0C3E\u0C35\u0C30\u0C23 \u0C2A\u0C30\u0C3F\u0C38\u0C4D\u0C25\u0C3F\u0C24\u0C3F \u0C0E\u0C32\u0C3E \u0C09\u0C02\u0C26\u0C3F?",
          "\u0C28\u0C3E \u0C2A\u0C02\u0C1F\u0C15\u0C41 \u0C38\u0C30\u0C3F\u0C2A\u0C4B\u0C2F\u0C47 \u0C2A\u0C25\u0C15\u0C3E\u0C32\u0C41 \u0C0F\u0C2E\u0C3F\u0C1F\u0C3F?",
          "\u0C28\u0C3E \u0C2A\u0C02\u0C1F \u0C28\u0C37\u0C4D\u0C1F\u0C02 \u0C0E\u0C32\u0C3E \u0C30\u0C3F\u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C4D \u0C1A\u0C47\u0C2F\u0C3E\u0C32\u0C3F?",
        ]
      : language === "Hindi"
        ? [
            "\u0906\u091C \u092E\u0947\u0930\u0940 \u092B\u0938\u0932 \u0915\u0947 \u0932\u093F\u090F \u092E\u094C\u0938\u092E \u0915\u0948\u0938\u093E \u0939\u0948?",
            "\u092E\u0947\u0930\u0940 \u092B\u0938\u0932 \u0915\u0947 \u0932\u093F\u090F \u0915\u094C\u0928 \u0938\u0940 \u092F\u094B\u091C\u0928\u093E\u090F\u0901 \u0939\u0948\u0902?",
            "\u092B\u0938\u0932 \u0928\u0941\u0915\u0938\u093E\u0928 \u0915\u0948\u0938\u0947 \u0930\u093F\u092A\u094B\u0930\u094D\u091F \u0915\u0930\u0947\u0902?",
          ]
        : [
            "What is my weather risk today?",
            "Which schemes match my farm?",
            "How do I report crop loss under PMFBY?",
          ];

  // Speech Recognition
  const toggleVoice = () => {
    setAssistantVoiceError("");

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setAssistantVoiceError(
        "Microphone speech recognition is not supported in this browser. Please use Chrome or Edge.",
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang =
        language === "Telugu" ? "te-IN" : language === "Hindi" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setListening(true);
        setAssistantVoiceError("");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuestion(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        setListening(false);
        if (event.error === "not-allowed") {
          setAssistantVoiceError("Microphone permission denied. Please allow microphone access.");
        } else {
          setAssistantVoiceError(`Voice recognition: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setListening(false);
      setAssistantVoiceError(err instanceof Error ? err.message : "Voice input error");
    }
  };

  // Text-to-speech
  const readAloud = (text: string, index: number) => {
    if (!("speechSynthesis" in window)) {
      setAssistantVoiceError("Voice speech synthesis is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }

    const cleaned = text.replace(/\*\*/g, "").replace(/^[•*-]\s*/gm, "");
    const utterance = new SpeechSynthesisUtterance(cleaned);

    utterance.lang =
      language === "Telugu" ? "te-IN" : language === "Hindi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <>
      {/* Floating launcher: Pure circular icon button without full text on screen */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Rythu AI"
          className="group fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center size-13 sm:size-14 rounded-full bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-600 text-white shadow-xl shadow-emerald-950/40 hover:shadow-2xl hover:shadow-emerald-900/50 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-emerald-400/40 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
          title="Rythu AI"
        >
          {/* Live pulsing status badge */}
          <span className="absolute top-1 right-1 flex size-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-3 bg-amber-300 border border-emerald-950" />
          </span>

          {/* Assistant Icon with Sparkle */}
          <div className="relative">
            <Bot className="size-6 sm:size-7 text-white transition-transform group-hover:scale-110" />
            <Sparkles className="size-3 text-amber-300 absolute -top-1 -right-1.5 animate-pulse" />
          </div>

          {/* Desktop-only hover tooltip pill (completely hidden on mobile, NO persistent label on screen) */}
          <div className="hidden sm:group-hover:flex absolute right-full mr-3 items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-bold whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none transition-opacity">
            <span className="text-emerald-400">Rythu AI</span>
            <span className="text-slate-400 text-[10px]">(రైతు AI)</span>
          </div>
        </button>
      )}

      {/* Slide-over Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="flex h-full w-full sm:w-[420px] flex-col bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 p-5 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-2xl bg-white/10 text-white shadow-inner">
                    <Bot className="size-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h2 className="text-lg font-black leading-tight">Rythu AI</h2>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 border border-emerald-500/40">
                        {language === "Telugu" ? "రైతు AI" : language === "Hindi" ? "कृषि AI" : "Smart Agro AI"}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-200/90 mt-0.5">
                      Grounded in verified data & your farm context
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setOpen(false);
                    window.speechSynthesis?.cancel();
                  }}
                  className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-lg transition cursor-pointer"
                >
                  <X className="size-4 text-white" />
                </button>
              </div>

              {/* Language Switch */}
              <div className="mt-4 flex gap-1.5">
                <button
                  onClick={() => {
                    setLanguage("English");
                    window.speechSynthesis?.cancel();
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                    language === "English"
                      ? "bg-white text-emerald-950"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    setLanguage("Telugu");
                    window.speechSynthesis?.cancel();
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                    language === "Telugu"
                      ? "bg-white text-emerald-950"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {"\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41"}
                </button>
                <button
                  onClick={() => {
                    setLanguage("Hindi");
                    window.speechSynthesis?.cancel();
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition cursor-pointer ${
                    language === "Hindi"
                      ? "bg-white text-emerald-950"
                      : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                >
                  {"\u0939\u093F\u0928\u094D\u0926\u0940"}
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Quick Prompts */}
              <div className="rounded-2xl bg-emerald-50/70 border border-emerald-100 p-3">
                <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1 mb-2">
                  <Sparkles className="size-3 text-amber-500" />
                  Suggested Questions:
                </p>
                <div className="space-y-1.5">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSend(q)}
                      disabled={loading}
                      className="w-full text-left rounded-xl bg-white border border-emerald-200/70 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-emerald-100/50 transition cursor-pointer shadow-2xs"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat history */}
              {messages.map((msg, i) => {
                const isAssistant = msg.role === "assistant";
                return (
                  <div
                    key={i}
                    className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isAssistant
                          ? "bg-slate-100 text-slate-900 border border-slate-200"
                          : "bg-emerald-700 text-white font-medium"
                      }`}
                    >
                      {isAssistant ? (
                        renderAssistantText(msg.text)
                      ) : (
                        <p>{msg.text}</p>
                      )}
                    </div>

                    {isAssistant && (
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 pl-1">
                        <button
                          onClick={() => readAloud(msg.text, i)}
                          className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                          title="Read response aloud"
                        >
                          {speakingIndex === i ? (
                            <>
                              <VolumeX className="size-3 text-emerald-700" />
                              <span className="text-emerald-700 font-bold">Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="size-3" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => navigator.clipboard?.writeText(msg.text)}
                          className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                          title="Copy response"
                        >
                          <Copy className="size-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <RefreshCw className="size-3.5 animate-spin text-emerald-600" />
                  <span>Krishi Assistant is verifying rules & writing response...</span>
                </div>
              )}

              {error && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              {assistantVoiceError && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                  {assistantVoiceError}
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-200 p-3.5 bg-slate-50">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`grid size-10 shrink-0 place-items-center rounded-xl transition cursor-pointer ${
                    listening
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                  title={listening ? "Listening... click to stop" : "Speak question"}
                >
                  <Mic className="size-4" />
                </button>

                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      onSend();
                    }
                  }}
                  placeholder={
                    language === "Telugu"
                      ? "\u0C35\u0C3E\u0C24\u0C3E\u0C35\u0C30\u0C23\u0C02 \u0C32\u0C47\u0C26\u0C3E \u0C2A\u0C25\u0C15\u0C3E\u0C32 \u0C17\u0C41\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C05\u0C21\u0C17\u0C02\u0C21\u0C3F..."
                      : language === "Hindi"
                        ? "\u092E\u094C\u0938\u092E \u092F\u093E \u092F\u094B\u091C\u0928\u093E\u0913\u0902 \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u092A\u0942\u091B\u0947\u0902..."
                        : "Ask about weather, schemes, benefits..."
                  }
                  className="flex-1 min-w-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <button
                  onClick={() => onSend()}
                  disabled={!question.trim() || loading}
                  className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 transition cursor-pointer"
                >
                  <Send className="size-4" />
                </button>
              </div>

              <p className="mt-2 text-[10px] text-slate-400 text-center">
                Advice is informational. Verify recommendations with local Krishi Vigyan Kendra (KVK) agronomists or product labels.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function renderAssistantText(text: string) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5">
      {lines.map((line, lineIndex) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIndex} className="h-0.5" />;

        const isBullet =
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ") ||
          trimmed.startsWith("\u2022 ");

        const content = isBullet ? trimmed.slice(2).trim() : trimmed;
        const parts = content.split(/(\b\*[^*]+\*\b|\*\*[^*]+\*\*)/g);

        const rendered = parts.map((part, partIndex) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={partIndex} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
          }
          return <span key={partIndex}>{part}</span>;
        });

        return (
          <div key={lineIndex} className={isBullet ? "pl-2 flex items-start gap-1.5" : undefined}>
            {isBullet && <span className="text-emerald-700 font-bold">•</span>}
            <div>{rendered}</div>
          </div>
        );
      })}
    </div>
  );
}
