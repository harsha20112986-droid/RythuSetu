import { useState } from "react";
import { Star, X, CheckCircle2 } from "lucide-react";

export type FacilityRatingData = {
  rating: number;
  count: number;
  userRated?: number;
};

// Generates a deterministic, realistic seed rating for any facility ID
export function getSeededRating(id: string): { rating: number; count: number } {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const abs = Math.abs(hash);
  // rating between 4.1 and 4.9
  const rating = Number((4.1 + (abs % 8) * 0.1).toFixed(1));
  // review count between 14 and 86
  const count = 14 + (abs % 73);
  return { rating, count };
}

export function getFacilityRating(id: string): FacilityRatingData {
  const seed = getSeededRating(id);
  try {
    const raw = localStorage.getItem(`rythusetu_rating_${id}`);
    if (raw) {
      const saved = JSON.parse(raw);
      return {
        rating: saved.rating || seed.rating,
        count: saved.count || seed.count,
        userRated: saved.userRated,
      };
    }
  } catch {
    // fallback
  }
  return seed;
}

export function saveFacilityRating(id: string, userStars: number, reviewText?: string) {
  try {
    const current = getFacilityRating(id);
    const newCount = current.userRated ? current.count : current.count + 1;
    // Calculate new average
    const totalScore = current.rating * current.count + userStars - (current.userRated || 0);
    const newRating = Number((totalScore / newCount).toFixed(1));

    const record = {
      rating: newRating,
      count: newCount,
      userRated: userStars,
      reviewText: reviewText || "",
      ratedAt: new Date().toISOString(),
    };
    localStorage.setItem(`rythusetu_rating_${id}`, JSON.stringify(record));
    return record;
  } catch (e) {
    console.warn("Could not save rating to localStorage:", e);
    return null;
  }
}

export function FacilityRatingBadge({
  facilityId,
  facilityName,
  onRated,
}: {
  facilityId: string;
  facilityName: string;
  onRated?: () => void;
}) {
  const [data, setData] = useState<FacilityRatingData>(() => getFacilityRating(facilityId));
  const [modalOpen, setModalOpen] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(data.userRated || 5);
  const [reviewNote, setReviewNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveFacilityRating(facilityId, selectedStar, reviewNote);
    if (updated) {
      setData({ rating: updated.rating, count: updated.count, userRated: selectedStar });
      setSubmitted(true);
      setTimeout(() => {
        setModalOpen(false);
        setSubmitted(false);
        if (onRated) onRated();
      }, 1200);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="flex items-center gap-0.5 text-amber-500">
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-black text-slate-800">{data.rating}</span>
        </div>
        <span className="text-[11px] text-slate-400">({data.count} farmer ratings)</span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }}
          className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/90 text-[10px] font-bold transition cursor-pointer"
        >
          <span>{data.userRated ? `Your rating: ${data.userRated}★` : "★ Rate this"}</span>
        </button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-600">
                  Farmer Community Review
                </span>
                <h3 className="text-base font-black text-slate-900 leading-snug mt-0.5">
                  {facilityName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="size-10 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-black text-emerald-950">Thank you, Rythu Mitra!</h4>
                <p className="text-xs text-slate-500">Your rating helps fellow farmers choose trusted facilities.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitRating} className="mt-4 space-y-4">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-700 mb-2">How would you rate this facility?</p>
                  <div className="flex items-center justify-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setSelectedStar(star)}
                        className="p-1 transition-transform hover:scale-125 cursor-pointer"
                      >
                        <Star
                          className={`size-7 ${
                            star <= (hoverStar || selectedStar)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 mt-1 block">
                    {selectedStar === 5
                      ? "★★★★★ Excellent / Top Fair Dealing"
                      : selectedStar === 4
                      ? "★★★★☆ Very Good Service"
                      : selectedStar === 3
                      ? "★★★☆☆ Average Service"
                      : selectedStar === 2
                      ? "★★☆☆☆ Needs Improvement"
                      : "★☆☆☆☆ Poor Service"}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Farmer Feedback Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="e.g. Weighbridge was accurate, quick payment, good preservation quality..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    Submit Rating
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
