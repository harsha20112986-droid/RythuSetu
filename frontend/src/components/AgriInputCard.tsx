import { useState } from "react";
import {
  ExternalLink,
  Phone,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Clock,
  Sparkles,
  Store,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
} from "lucide-react";
import type { AgriProductItem, AgriDealerItem } from "../types";

export function AgriInputCard({
  product,
  nearbyDealers = [],
}: {
  product: AgriProductItem;
  nearbyDealers?: AgriDealerItem[];
}) {
  const [showDealers, setShowDealers] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const lowestStore = product.price_comparison.find((p) => p.is_lowest) || product.price_comparison[0];

  return (
    <div className="rounded-3xl border border-emerald-200/90 bg-white p-5 shadow-sm hover:shadow-md transition space-y-4">
      {/* Top Banner: Product Packshot + Brand & Formula */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Packshot Image with Category Badge & Click-to-Inspect */}
        <div
          onClick={() => setIsZoomed(true)}
          className="relative size-28 sm:size-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 flex items-center justify-center p-2 group cursor-zoom-in shadow-2xs hover:border-emerald-400 transition"
          title="Click to zoom & inspect original bottle/bag packaging (ప్యాకింగ్ పరిశీలించండి)"
        >
          <img
            src={product.image_url}
            alt={product.brand_name}
            onError={(e) => {
              if (product.cdn_image_url && e.currentTarget.src !== product.cdn_image_url) {
                e.currentTarget.src = product.cdn_image_url;
              }
            }}
            className="w-full h-full object-contain rounded-xl transition-transform group-hover:scale-110"
            loading="lazy"
          />
          <span className="absolute top-1.5 left-1.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black uppercase px-1.5 py-0.5 tracking-wider">
            {product.category.split(" ")[0]}
          </span>
          <span className="absolute bottom-1.5 right-1.5 rounded-md bg-emerald-800/90 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 flex items-center gap-0.5 shadow-xs">
            <ZoomIn className="size-2.5" />
            <span>Inspect</span>
          </span>
        </div>

        {/* Brand Information & Active Chemical Formula */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {product.manufacturer}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Verified Original Brand
            </span>
            <button
              type="button"
              onClick={() => setIsZoomed(true)}
              className="text-[10px] font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 flex items-center gap-1 transition cursor-pointer"
            >
              <span>📸 Authentic Packshot</span>
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            {product.brand_name}
            {product.telugu_brand_name && (
              <span className="text-xs sm:text-sm font-bold text-emerald-800 ml-2">
                ({product.telugu_brand_name})
              </span>
            )}
          </h3>

          {/* ACTIVE CHEMICAL FORMULA BOX (Highlighting formula for farmers) */}
          <div className="mt-2 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 p-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sky-900">
              <span>🧪 Chemical Formula / Composition:</span>
            </div>
            <div className="text-xs sm:text-sm font-black text-indigo-950 font-mono mt-0.5">
              {product.chemical_formula}
            </div>
            {product.chemical_class && (
              <div className="text-[10px] text-slate-500 mt-0.5">
                Class: {product.chemical_class}
              </div>
            )}
          </div>

          {/* Recommended Dosage */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 font-medium">Recommended Dosage: </span>
              <strong className="text-emerald-900">{product.recommended_dosage}</strong>
            </div>
            {product.pack_size && (
              <div className="text-[11px] text-slate-500 font-medium">
                Pack: <strong>{product.pack_size}</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Pests & Application */}
      {product.target_pests && product.target_pests.length > 0 && (
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Target Pests & Crop Benefits:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.target_pests.map((pest, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold"
              >
                {pest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MULTI-STORE PRICE COMPARISON (Which site has lowest price?) */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
            <ShoppingBag className="size-4 text-emerald-600" />
            <span>Multi-Store Agri Price Comparison</span>
          </div>
          {lowestStore && (
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="size-3 text-emerald-600" />
              Lowest on {lowestStore.store_name}: ₹{lowestStore.price_inr}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {product.price_comparison.map((store, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-2.5 border transition flex flex-col justify-between ${
                store.is_lowest
                  ? "bg-emerald-50/90 border-emerald-300 shadow-2xs ring-1 ring-emerald-400"
                  : "bg-white border-slate-200 text-slate-700"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-extrabold text-slate-900">
                    {store.store_name}
                  </span>
                  {store.is_lowest && (
                    <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                      Lowest Rate
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-base font-black text-slate-900">
                    ₹{store.price_inr}
                  </span>
                  {store.mrp_inr > store.price_inr && (
                    <span className="text-xs text-slate-400 line-through">
                      MRP ₹{store.mrp_inr}
                    </span>
                  )}
                  {store.savings_inr && store.savings_inr > 0 ? (
                    <span className="text-[10px] font-bold text-emerald-700">
                      (Save ₹{store.savings_inr})
                    </span>
                  ) : null}
                </div>

                <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="size-2.5 text-slate-400" />
                  <span>{store.delivery_days} • {store.shipping}</span>
                </div>
              </div>

              {store.url ? (
                <a
                  href={store.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2.5 w-full inline-flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    store.is_lowest
                      ? "bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  <span>Buy on {store.store_name}</span>
                  <ExternalLink className="size-3" />
                </a>
              ) : (
                <div className="mt-2.5 text-center text-[10px] font-bold text-slate-500 bg-slate-100 py-1.5 rounded-lg">
                  Subsidized Govt Center / Walk-in
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* NEARBY AUTHORIZED DEALERS / FERTILIZER TRADERS (For same-day spray) */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={() => setShowDealers(!showDealers)}
          className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-emerald-800 transition py-1 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Store className="size-4 text-emerald-700" />
            <span>Need this chemical today? Check Authorized Local Dealers nearby ({nearbyDealers.length})</span>
          </div>
          {showDealers ? (
            <ChevronUp className="size-4 text-slate-400" />
          ) : (
            <ChevronDown className="size-4 text-slate-400" />
          )}
        </button>

        {showDealers && (
          <div className="mt-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {nearbyDealers.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">
                No nearby dealers registered for this specific district yet.
              </div>
            ) : (
              nearbyDealers.map((dealer) => (
                <div
                  key={dealer.id}
                  className="rounded-xl border border-slate-200 bg-emerald-50/40 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-slate-900">{dealer.store_name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                        {dealer.distance_km} km away
                      </span>
                      {dealer.gov_authorized && (
                        <span className="text-[10px] text-emerald-700 flex items-center gap-0.5" title="Department of Agriculture Licensed Dealer">
                          <ShieldCheck className="size-3" />
                          Licensed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      {dealer.address} • Prop: {dealer.proprietor}
                    </p>
                    <div className="text-[10px] text-emerald-800 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="size-3 text-emerald-600" />
                      <span>{dealer.stock_status}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${dealer.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-xs cursor-pointer shrink-0"
                  >
                    <Phone className="size-3.5" />
                    <span>Call Store: {dealer.phone}</span>
                  </a>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 📸 FULL PACKAGING INSPECTOR MODAL FOR FARMERS */}
      {isZoomed && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden space-y-4 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    100% Original Certified Packaging
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {product.manufacturer}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {product.brand_name}
                  {product.telugu_brand_name && (
                    <span className="text-sm font-bold text-emerald-700 ml-2">
                      ({product.telugu_brand_name})
                    </span>
                  )}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Large Packaging Packshot */}
            <div className="relative flex-1 min-h-[240px] max-h-[380px] rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/70 border border-slate-200 flex items-center justify-center p-4 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.brand_name}
                onError={(e) => {
                  if (product.cdn_image_url && e.currentTarget.src !== product.cdn_image_url) {
                    e.currentTarget.src = product.cdn_image_url;
                  }
                }}
                className="max-h-full max-w-full object-contain filter drop-shadow-md select-none transition-transform hover:scale-105 duration-200"
              />
              <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                <span className="inline-block text-[10px] sm:text-[11px] font-bold text-slate-700 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  🔍 Check bottle/bag label, ISI & CIBRC seal, and active formula before purchasing
                </span>
              </div>
            </div>

            {/* Chemical Formula & Specifications */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-xs space-y-2 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Active Chemical Formula / Composition:
                </span>
                <span className="text-xs sm:text-sm font-mono font-black text-indigo-950 block mt-0.5">
                  {product.chemical_formula}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Recommended Dosage:</span>
                  <strong className="text-emerald-900 text-xs">{product.recommended_dosage}</strong>
                </div>
                {product.pack_size && (
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Standard Pack Size:</span>
                    <strong className="text-slate-900 text-xs">{product.pack_size}</strong>
                  </div>
                )}
              </div>

              {product.safety_notes && (
                <p className="text-[11px] text-amber-900 bg-amber-50/80 rounded-xl p-2 border border-amber-200/80">
                  ⚠️ <strong>Precaution:</strong> {product.safety_notes}
                </p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between gap-3 pt-1 shrink-0">
              <span className="text-[11px] font-semibold text-emerald-800">
                ✓ Verified authentic packaging photo
              </span>
              <button
                type="button"
                onClick={() => setIsZoomed(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
              >
                Close (మూసివేయండి)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
