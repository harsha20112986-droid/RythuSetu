import { CheckCircle2, Clock, AlertTriangle, ShieldCheck, AlertCircle, ExternalLink } from "lucide-react";

interface DataSourceBadgeProps {
  status?: string;
  freshness?: string;
  marketDate?: string;
  lastSyncTimestamp?: string;
  sourceUrl?: string;
  compact?: boolean;
}

export function DataSourceBadge({
  status = "OFFICIAL_LATEST_AVAILABLE",
  freshness = "RECENT",
  marketDate,
  lastSyncTimestamp,
  sourceUrl = "https://agmarknet.gov.in",
  compact = false,
}: DataSourceBadgeProps) {
  let badgeStyle = "bg-sky-50 text-sky-800 border-sky-300";
  let Icon = Clock;
  let statusLabel = "Official Latest Available Feed";
  let freshnessBadge = "bg-sky-100 text-sky-900";

  switch (status) {
    case "OFFICIAL_LATEST":
      badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-300";
      Icon = CheckCircle2;
      statusLabel = "Government OGD / AGMARKNET (Live Session)";
      freshnessBadge = "bg-emerald-100 text-emerald-900";
      break;
    case "OFFICIAL_LATEST_AVAILABLE":
      badgeStyle = "bg-blue-50 text-blue-800 border-blue-300";
      Icon = Clock;
      statusLabel = "Government AGMARKNET (Latest Available Session)";
      freshnessBadge = "bg-blue-100 text-blue-900";
      break;
    case "SOURCE_DELAYED":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-300";
      Icon = AlertTriangle;
      statusLabel = "Government Feed Delayed / Weekend Session";
      freshnessBadge = "bg-amber-100 text-amber-900";
      break;
    case "REFERENCE_ONLY":
      badgeStyle = "bg-slate-50 text-slate-700 border-slate-300";
      Icon = ShieldCheck;
      statusLabel = "CACP / MIS Reference Benchmark";
      freshnessBadge = "bg-slate-200 text-slate-800";
      break;
    case "SOURCE_ERROR":
      badgeStyle = "bg-red-50 text-red-700 border-red-300";
      Icon = AlertCircle;
      statusLabel = "Upstream Feed Offline (Serving Cached Benchmark)";
      freshnessBadge = "bg-red-100 text-red-900";
      break;
    default:
      break;
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeStyle}`}>
        <Icon className="size-3 shrink-0" />
        <span>{statusLabel}</span>
        {marketDate && (
          <span className="opacity-75 font-mono">({marketDate})</span>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border p-3 sm:p-4 text-xs ${badgeStyle}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4 shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-xs sm:text-sm">{statusLabel}</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${freshnessBadge}`}>
              {freshness}
            </span>
          </div>
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold underline hover:opacity-80 transition"
          >
            <span>agmarknet.gov.in</span>
            <ExternalLink className="size-3" />
          </a>
        )}
      </div>

      <div className="mt-2 pt-2 border-t border-current/15 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] opacity-90">
        {marketDate && (
          <div>
            <strong>Market Session Date:</strong> <span className="font-mono">{marketDate}</span>
          </div>
        )}
        {lastSyncTimestamp && (
          <div>
            <strong>Last Synced:</strong> <span className="font-mono">{lastSyncTimestamp}</span>
          </div>
        )}
        <div>
          <strong>Pricing Unit:</strong> INR / Quintal (100 kg)
        </div>
      </div>
    </div>
  );
}
