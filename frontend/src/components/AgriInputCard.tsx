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
  const lowestStore = product.price_comparison.find((p) => p.is_lowest) || product.price_comparison[0];

  return (
    <div className="rounded-3xl border border-emerald-200/90 bg-white p-5 shadow-sm hover:shadow-md transition space-y-4">
      {/* Top Banner: Product Packshot + Brand & Formula */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Packshot Image with Category Badge */}
        <div className="relative size-28 sm:size-32 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 flex items-center justify-center p-2 group">
          <img
            src={product.image_url}
            alt={product.brand_name}
            className="w-full h-full object-contain rounded-xl transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-1.5 left-1.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black uppercase px-1.5 py-0.5 tracking-wider">
            {product.category.split(" ")[0]}
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
    </div>
  );
}
