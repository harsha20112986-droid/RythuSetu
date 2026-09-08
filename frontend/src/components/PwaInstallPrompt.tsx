import { useState, useEffect } from "react";
import { Download, Smartphone, X, CheckCircle2, Share2, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    // Check iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua);
    setIsIos(isApple);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  if (isInstalled || dismissed) {
    return null;
  }

  return (
    <>
      {/* Floating Bottom App Installation Bar */}
      <aside aria-label="Install RythuSetu App" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in slide-in-from-bottom duration-300">
        <div className="rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-emerald-950 via-slate-950 to-emerald-900 p-4 text-white shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-emerald-600/30 border border-emerald-400/40 text-white shrink-0">
              <Smartphone className="size-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black">Install RythuSetu App</h4>
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black px-2 py-0.5">
                  1-Tap
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 leading-tight mt-0.5">
                Install on your home screen for offline access & faster mandi updates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-2 text-xs font-black shadow-md transition cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Install</span>
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-emerald-300 hover:text-white transition cursor-pointer"
              title="Dismiss"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="size-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-base">How to Install RythuSetu App</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-slate-700">
              {isIos ? (
                /* iOS Instructions */
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Share2 className="size-4 text-emerald-600" />
                    For iPhone & iPad (Safari):
                  </span>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-slate-600">
                    <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (హోమ్ స్క్రీన్‌కి జోడించు).</li>
                    <li>Tap <strong>"Add"</strong> in the top-right corner. The RythuSetu icon will appear on your phone home screen!</li>
                  </ol>
                </div>
              ) : (
                /* Android / Chrome Instructions */
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="size-4 text-emerald-600" />
                    For Android Phones (Google Chrome / Samsung Internet):
                  </span>
                  <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-slate-600">
                    <li>Tap the <strong>three dots (⋮)</strong> menu in the top-right of your browser.</li>
                    <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong> (యాప్‌ని ఇన్‌స్టాల్ చేయండి).</li>
                    <li>Confirm <strong>"Install"</strong>. RythuSetu will install as a native standalone app!</li>
                  </ol>
                </div>
              )}

              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 space-y-1.5">
                <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-600" />
                  App Features on Your Phone:
                </span>
                <ul className="space-y-1 text-emerald-900">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                    <span>Runs fullscreen without browser bars</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                    <span>Works offline with cached mandis and POP guides</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-3 text-emerald-600 shrink-0" />
                    <span>Instant 1-tap launch from your phone home screen</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 text-xs transition cursor-pointer shadow-xs"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
