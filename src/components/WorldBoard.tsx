// This component renders the "world board" — a list of cities and their current times, with a visual indicator of where they are in their day. It also handles adding/removing cities and persisting the board in localStorage.
import { useEffect, useMemo, useState } from "react";
import { CITIES, DEFAULT_BOARD, type City } from "../data/cities";
import { getOffsetMinutes, formatOffsetLabel, getTimeParts } from "../lib/time";

/// The board is persisted in localStorage, but if that fails (e.g. private mode) it will still work in-session and fall back to the default.
const BOARD_STORAGE_KEY = "timekeeper:board";

function loadBoard(): string[] {
  try {
    const raw = window.localStorage.getItem(BOARD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_BOARD;
}

// Each city row needs to know the current time to position the marker and display the time.
function CityRow({ city, now }: { city: City; now: Date }) {
  const parts = getTimeParts(city.tz, now);
  const offset = getOffsetMinutes(city.tz, now);
  const pct = parts.fractionOfDay * 100;
  const hh = String(parts.hour).padStart(2, "0");
  const mm = String(parts.minute).padStart(2, "0");

  return (
    <div className="city-row">
      <div className="city-row__id">
        <span className="city-row__city">{city.city}</span>
        <span className="city-row__country">{city.country}</span>
      </div>

      <div className="city-row__strip" aria-hidden="true">
        <div className="city-row__strip-track">
          <span className="city-row__marker" style={{ left: `${pct}%` }} />
        </div>
        <div className="city-row__strip-labels">
          <span>00</span>
          <span>06</span>
          <span>12</span>
          <span>18</span>
          <span>24</span>
        </div>
      </div>

      <div className="city-row__time">
        <span className="city-row__clock">
          {hh}:{mm}
        </span>
        <span className="city-row__offset">{formatOffsetLabel(offset)}</span>
      </div>

      <style>{`
        .city-row {
          display: grid;
          grid-template-columns: minmax(7rem, 1fr) minmax(0, 2.2fr) auto;
          align-items: center;
          gap: 1.25rem;
          padding: 0.95rem 0;
          border-bottom: 1px solid var(--hairline);
        }

        .city-row__id {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .city-row__city {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--bone);
        }

        .city-row__country {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--slate);
        }

        .city-row__strip {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .city-row__strip-track {
          position: relative;
          height: 7px;
          border-radius: 3px;
          border: 1px solid var(--hairline);
          background: linear-gradient(
            90deg,
            var(--ink-raised) 0%,
            var(--ink-raised) 25%,
            var(--verdigris) 38%,
            var(--verdigris-bright) 50%,
            var(--verdigris) 62%,
            var(--ink-raised) 75%,
            var(--ink-raised) 100%
          );
          overflow: visible;
        }

        .city-row__marker {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 16px;
          background: var(--brass-bright);
          border-radius: 1px;
          box-shadow: 0 0 6px rgba(226, 192, 143, 0.7);
        }

        .city-row__strip-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.62rem;
          color: var(--slate);
        }

        .city-row__time {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.1rem;
          min-width: 5.5rem;
        }

        .city-row__clock {
          font-family: var(--font-mech);
          font-weight: 600;
          font-size: 1.3rem;
          font-variant-numeric: tabular-nums;
          color: var(--bone);
        }

        .city-row__offset {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--slate);
        }

        @media (max-width: 640px) {
          .city-row {
            grid-template-columns: 1fr;
            gap: 0.6rem;
          }
          .city-row__time {
            align-items: flex-start;
            flex-direction: row;
            gap: 0.6rem;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
}

// The main component manages the list of cities on the board, the current time (to pass down to rows), and the add/remove/persist logic.
export default function WorldBoard() {
  const [now, setNow] = useState(() => new Date());
  const [boardIds, setBoardIds] = useState<string[]>(DEFAULT_BOARD);
  const [picker, setPicker] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setBoardIds(loadBoard());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(BOARD_STORAGE_KEY, JSON.stringify(boardIds));
    } catch {
      // localStorage may be unavailable (private mode); board still works in-session.
    }
  }, [boardIds, hydrated]);

  const board = useMemo(
    () => boardIds.map((id) => CITIES.find((c) => c.id === id)).filter(Boolean) as City[],
    [boardIds]
  );

  const available = useMemo(
    () => CITIES.filter((c) => !boardIds.includes(c.id)),
    [boardIds]
  );

  function addCity(id: string) {
    if (!id) return;
    setBoardIds((prev) => [...prev, id]);
    setPicker("");
  }

  function removeCity(id: string) {
    setBoardIds((prev) => prev.filter((existing) => existing !== id));
  }

  return (
    <div className="world-board">
      <div className="world-board__header">
        <div>
          <h2 className="world-board__title">World board</h2>
          <p className="world-board__sub">
            Brass marker shows where each city sits in its day.
          </p>
        </div>
        <div className="world-board__add">
          <select
            value={picker}
            onChange={(e) => addCity(e.target.value)}
            aria-label="Add a city to the board"
          >
            <option value="">+ Add city…</option>
            {available.map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}, {c.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="world-board__list">
        {board.map((city) => (
          <div key={city.id} className="world-board__row-wrap">
            <CityRow city={city} now={now} />
            <button
              type="button"
              className="world-board__remove"
              onClick={() => removeCity(city.id)}
              aria-label={`Remove ${city.city} from board`}
            >
              ×
            </button>
          </div>
        ))}
        {board.length === 0 && (
          <p className="world-board__empty">
            Your board is empty. Add a city above to start tracking it.
          </p>
        )}
      </div>

      <style>{`
        .world-board {
          background: var(--ink-raised);
          border: 1px solid var(--hairline);
          border-radius: 14px;
          padding: 1.75rem 1.75rem 0.5rem;
          height: 100%;
        }

        .world-board__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }

        .world-board__title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          letter-spacing: 0.01em;
          margin: 0 0 0.3rem;
          color: var(--brass-bright);
          text-transform: uppercase;
        }

        .world-board__sub {
          margin: 0;
          font-size: 0.85rem;
          color: var(--slate);
          max-width: 32ch;
        }

        .world-board__add select {
          background: var(--ink);
          border: 1px solid var(--hairline);
          color: var(--bone);
          font-family: var(--font-body);
          font-size: 0.85rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
        }

        .world-board__row-wrap {
          position: relative;
        }

        .world-board__remove {
          position: absolute;
          right: -0.4rem;
          top: 0.4rem;
          background: transparent;
          border: none;
          color: var(--slate);
          font-size: 1rem;
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          line-height: 1;
          transition: color 0.15s ease;
        }

        .world-board__remove:hover {
          color: var(--signal);
        }

        .world-board__empty {
          padding: 2rem 0;
          text-align: center;
          color: var(--slate);
          font-size: 0.9rem;
        }
        
        @media (max-width: 640px) {
          .world-board { padding: 1.25rem 1.25rem 0.4rem; margin-bottom: 1.5rem;}
          .world-board__remove { right: -0.2rem; }

        }
      `}</style>
    </div>
  );
}
