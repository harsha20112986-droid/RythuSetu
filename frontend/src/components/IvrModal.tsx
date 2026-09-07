import { useState, useEffect, useRef } from "react";
import {
  Phone,
  PhoneOff,
  Volume2,
  X,
  Radio,
  Clock,
} from "lucide-react";
import { type Farmer, API_BASE } from "../types";

export function IvrModal({
  open,
  setOpen,
  farmer,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  farmer: Farmer | null;
}) {
  const [callActive, setCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [ivrStep, setIvrStep] = useState("welcome");
  const [language, setLanguage] = useState("English");
  const [speechText, setSpeechText] = useState(
    "Welcome to RythuSetu Kisan Hotline. For Telugu, press 1. For Hindi, press 2. For English, press 3."
  );
  const [options, setOptions] = useState<{ key: string; label: string }[]>([
    { key: "1", label: "1: Telugu (తెలుగు)" },
    { key: "2", label: "2: Hindi (हिन्दी)" },
    { key: "3", label: "3: English" },
  ]);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [callActive]);

  const speakAudio = (text: string, lang: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "Telugu" ? "te-IN" : lang === "Hindi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const startCall = () => {
    setCallActive(true);
    setIvrStep("welcome");
    const welcome = "Welcome to RythuSetu Kisan Hotline. For Telugu, press 1. For Hindi, press 2. For English, press 3.";
    setSpeechText(welcome);
    setOptions([
      { key: "1", label: "1: Telugu (తెలుగు)" },
      { key: "2", label: "2: Hindi (हिन्दी)" },
      { key: "3", label: "3: English" },
    ]);
    speakAudio(welcome, "English");
  };

  const endCall = () => {
    setCallActive(false);
    window.speechSynthesis?.cancel();
  };

  const pressDigit = async (digit: string) => {
    try {
      const res = await fetch(`${API_BASE}/telephony/simulate-step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: ivrStep,
          digit,
          language,
          farmer_id: farmer?.id || 101,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setIvrStep(data.next_step);
        if (data.language) setLanguage(data.language);
        setSpeechText(data.speech);
        if (data.options) setOptions(data.options);
        speakAudio(data.speech, data.language || language);
      }
    } catch {
      // Offline fallback
    }
  };

  if (!open) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700 text-white shadow-2xl overflow-hidden flex flex-col">
        {/* Top bar */}
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-emerald-300">Toll-Free IVR Simulator</span>
          </div>
          <button
            onClick={() => {
              endCall();
              setOpen(false);
            }}
            className="grid size-7 place-items-center rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Screen */}
        <div className="p-6 text-center flex-1 flex flex-col items-center justify-between">
          <div>
            <div className="size-16 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 grid place-items-center mx-auto shadow-lg shadow-emerald-950/50">
              <Phone className="size-8" />
            </div>
            <h2 className="mt-3 text-lg font-black tracking-tight">1800-890-7388</h2>
            <p className="text-xs text-slate-400">RythuSetu Kisan Call Centre</p>

            {callActive ? (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/20">
                <Clock className="size-3" />
                <span>Call Connected • {formatTimer(callDuration)}</span>
              </div>
            ) : (
              <span className="mt-2 inline-block text-[11px] text-slate-500">
                Ready to simulate toll-free hotline
              </span>
            )}
          </div>

          {/* Interactive Speech Prompt Box */}
          {callActive ? (
            <div className="my-5 w-full rounded-2xl bg-slate-800/80 border border-slate-700 p-4 text-left shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Volume2 className="size-3" />
                  IVR Audio Response ({language}):
                </span>
                <span className="text-[10px] text-slate-400">Step: {ivrStep}</span>
              </div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed">
                "{speechText}"
              </p>

              {/* Options list */}
              {options && options.length > 0 && ivrStep !== "complete" && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                  {options.map((opt) => (
                    <span
                      key={opt.key}
                      className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300 font-semibold"
                    >
                      {opt.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="my-6 text-xs text-slate-400 text-center leading-relaxed max-w-xs">
              Simulates the automated telecom voice menu for farmers calling without a smartphone or internet connection.
            </div>
          )}

          {/* Dialpad */}
          {callActive && (
            <div className="w-full grid grid-cols-3 gap-2.5 my-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((d) => (
                <button
                  key={d}
                  onClick={() => pressDigit(d)}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-sm font-black text-white transition active:scale-95 cursor-pointer shadow-xs"
                >
                  {d}
                </button>
              ))}
            </div>
          )}

          {/* Call / Hangup Buttons */}
          <div className="mt-4 w-full">
            {!callActive ? (
              <button
                onClick={startCall}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 text-sm shadow-lg shadow-emerald-950/50 transition active:scale-95 cursor-pointer"
              >
                <Phone className="size-4" />
                <span>Call Kisan Helpline</span>
              </button>
            ) : (
              <button
                onClick={endCall}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black py-3 text-sm shadow-lg shadow-rose-950/50 transition active:scale-95 cursor-pointer"
              >
                <PhoneOff className="size-4" />
                <span>End Call</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Connected to backend TwiML/Exotel state engine (/api/v1/telephony/simulate-step)
        </div>
      </div>
    </div>
  );
}
