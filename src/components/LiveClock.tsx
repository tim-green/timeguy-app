// This component renders the "live clock" — the current time in the user's local timezone, as detected by the browser. It also handles persisting the user's timezone preference in localStorage.
import { useEffect, useState } from "react";
import { getOffsetMinutes, formatOffsetLabel, getTimeParts } from "../lib/time";

interface Props {
  initialTz: string;
  initialLabel: string;
}


const TZ_STORAGE_KEY = "timekeeper:home-tz";

export default function LiveClock({ initialTz, initialLabel }: Props) {
  const [tz, setTz] = useState(initialTz);
  const [label, setLabel] = useState(initialLabel);
  const [now, setNow] = useState(() => new Date());
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Browser's own Intl resolution — free, no geolocation permission needed.
    try {
      const stored = window.localStorage.getItem(TZ_STORAGE_KEY);
      const resolved = stored || Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (resolved) {
        setTz(resolved);
        setLabel(resolved.split("/").pop()?.replace(/_/g, " ") ?? resolved);
        setDetected(true);
      }
    } catch {
      // Stay on server-provided default if Intl/localStorage unavailable.
    }
  }, []);

  const parts = getTimeParts(tz, now);
  const offset = getOffsetMinutes(tz, now);
  const hh = String(parts.hour).padStart(2, "0");
  const mm = String(parts.minute).padStart(2, "0");
  const ss = String(parts.second).padStart(2, "0");

  return (
    <div className="live-clock">
      <div className="live-clock__plate">
        <span className="live-clock__live-dot" aria-hidden="true" />
        <span className="live-clock__location">
          {label}
          {detected && <span className="live-clock__detected"> · your local time</span>}
        </span>
      </div>

      <div className="live-clock__readout" role="timer" aria-live="off">
        <span className="live-clock__digits">{hh}</span>
        <span className="live-clock__colon">:</span>
        <span className="live-clock__digits">{mm}</span>
        <span className="live-clock__colon live-clock__colon--sec">:</span>
        <span className="live-clock__digits live-clock__digits--sec">{ss}</span>
      </div>

      <div className="live-clock__meta">
        <span className="live-clock__meta-item">
          {parts.weekday} {parts.day} {parts.month} 
        </span>
        <span className="live-clock__divider" aria-hidden="true" />
        <span className="live-clock__meta-item live-clock__meta-item--mono">
          {formatOffsetLabel(offset)}
        </span>
        <span className="live-clock__divider" aria-hidden="true" />
        <span className="live-clock__meta-item live-clock__meta-item--mono">{tz}</span>
      </div>

      <style>{`
        .live-clock {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
          padding: 3.5rem 1.5rem 2.75rem;
          text-align: center;
        }

        .live-clock__plate {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          padding: 0.50rem 1rem;
          border: 1px solid var(--hairline);
          border-radius: 999px;
          background: var(--ink-raised);
        }

        .live-clock__live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--signal);
          box-shadow: 0 0 0 0 rgba(84, 232, 58, 0.60);
          animation: live-pulse 2s ease-out infinite;
        }

        @keyframes live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(81, 232, 58, 0.55); }
          70% { box-shadow: 0 0 0 7px rgba(232, 71, 58, 0); }
          100% { box-shadow: 0 0 0 0 rgba(232, 71, 58, 0); }
        }

        .live-clock__location {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--bone-dim);
        }

        .live-clock__detected {
          color: var(--verdigris-bright);
        }

        .live-clock__readout {
          display: flex;
          align-items: baseline;
          font-family: var(--font-mech);
          font-weight: 600;
          line-height: 1;
          font-size: clamp(3.4rem, 14vw, 8.5rem);
          letter-spacing: -0.02em;
          color: var(--bone);
        }

        .live-clock__digits {
          font-variant-numeric: tabular-nums;
          min-width: 1.65ch;
        }

        .live-clock__digits--sec {
          font-size: 0.55em;
          color: var(--brass);
          align-self: flex-end;
          padding-bottom: 0.22em;
          min-width: 1.3ch;
        }

        .live-clock__colon {
          padding: 0 0.06em;
          color: var(--brass-bright);
        }

        .live-clock__colon--sec {
          font-size: 0.55em;
          align-self: flex-end;
          padding-bottom: 0.22em;
        }

        .live-clock__meta {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-wrap: wrap;
          justify-content: center;
          color: var(--bone-dim);
          font-size: 0.85rem;
        }

        .live-clock__meta-item--mono {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--slate);
        }

        .live-clock__divider {
          width: 1px;
          height: 0.9em;
          background: var(--hairline);
        }

        @media (max-width: 540px) {
          .live-clock { padding: 2.5rem 1rem 2rem; }
          .live-clock__meta { font-size: 0.75rem; gap: 0.45rem; }
        }
      `}</style>
    </div>
  );
}
