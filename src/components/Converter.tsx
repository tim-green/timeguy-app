import { useEffect, useMemo, useState } from "react";
import { CITIES, type City } from "../data/cities";
import { getOffsetMinutes, formatOffsetLabel, shiftDate } from "../lib/time";

function hourLabel(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h12",
  }).format(date);
}

function dayLabel(date: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
  }).format(date);
}

export default function Converter() {
  const [fromId, setFromId] = useState("syd");
  const [toId, setToId] = useState("lon");
  const [sliderMinutes, setSliderMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });
  const [baseDate, setBaseDate] = useState(() => new Date());

  useEffect(() => {
    setBaseDate(new Date());
  }, []);

  const fromCity = CITIES.find((c) => c.id === fromId) as City;
  const toCity = CITIES.find((c) => c.id === toId) as City;

  const selectedInstant = useMemo(() => {
    const midnight = new Date(baseDate);
    midnight.setHours(0, 0, 0, 0);
    return shiftDate(midnight, sliderMinutes);
  }, [baseDate, sliderMinutes]);

  const fromOffset = getOffsetMinutes(fromCity.tz, selectedInstant);
  const toOffset = getOffsetMinutes(toCity.tz, selectedInstant);
  const diff = toOffset - fromOffset;

  function swap() {
    setFromId(toId);
    setToId(fromId);
  }

  const pct = (sliderMinutes / 1439) * 100;

  return (
    <div className="converter">
      <div className="converter__header">
        <h2 className="converter__title">Converter</h2>
        <p className="converter__sub">Drag the rail. Both clocks move together.</p>
      </div>

      <div className="converter__selectors">
        <label className="converter__field">
          <span>From</span>
          <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
          </select>
        </label>

        <button type="button" className="converter__swap" onClick={swap} aria-label="Swap cities">
          ⇄
        </button>

        <label className="converter__field">
          <span>To</span>
          <select value={toId} onChange={(e) => setToId(e.target.value)}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="converter__readouts">
        <div className="converter__readout">
          <span className="converter__readout-city">{fromCity.city}</span>
          <span className="converter__readout-time">{hourLabel(selectedInstant, fromCity.tz)}</span>
          <span className="converter__readout-day">{dayLabel(selectedInstant, fromCity.tz)}</span>
        </div>
        <div className="converter__diff">
          {diff === 0 ? "same time" : `${diff > 0 ? "+" : ""}${(diff / 60).toFixed(diff % 60 === 0 ? 0 : 1)}h`}
        </div>
        <div className="converter__readout">
          <span className="converter__readout-city">{toCity.city}</span>
          <span className="converter__readout-time">{hourLabel(selectedInstant, toCity.tz)}</span>
          <span className="converter__readout-day">{dayLabel(selectedInstant, toCity.tz)}</span>
        </div>
      </div>

      <div className="converter__rail-wrap">
        <input
          type="range"
          min={0}
          max={1439}
          step={5}
          value={sliderMinutes}
          onChange={(e) => setSliderMinutes(Number(e.target.value))}
          className="converter__rail"
          aria-label={`Time in ${fromCity.city}`}
          style={{ "--fill": `${pct}%` } as React.CSSProperties}
        />
        <div className="converter__rail-ticks">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>12am</span>
        </div>
      </div>

      <div className="converter__offsets">
        <span>
          {fromCity.city}: {formatOffsetLabel(fromOffset)}
        </span>
        <span>
          {toCity.city}: {formatOffsetLabel(toOffset)}
        </span>
      </div>

      <style>{`
        .converter {
          background: var(--ink-raised);
          border: 1px solid var(--hairline);
          border-radius: 14px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .converter__header { margin-bottom: 1.25rem; }

        .converter__title {
          font-family: var(--font-display);
          font-size: 1.05rem;
          color: var(--brass-bright);
          text-transform: uppercase;
          margin: 0 0 0.3rem;
        }

        .converter__sub {
          margin: 0;
          font-size: 0.85rem;
          color: var(--slate);
        }

        .converter__selectors {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: end;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .converter__field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--slate);
        }

        .converter__field select {
          background: var(--ink);
          border: 1px solid var(--hairline);
          color: var(--bone);
          font-family: var(--font-body);
          font-size: 0.95rem;
          padding: 0.55rem 0.7rem;
          border-radius: 8px;
        }

        .converter__swap {
          background: var(--ink);
          border: 1px solid var(--hairline);
          color: var(--brass);
          width: 2.25rem;
          height: 2.25rem;
          border-radius: 50%;
          font-size: 1rem;
          cursor: pointer;
          margin-bottom: 0.1rem;
          transition: border-color 0.15s ease, color 0.15s ease;
        }

        .converter__swap:hover {
          border-color: var(--brass);
          color: var(--brass-bright);
        }

        .converter__readouts {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .converter__readout {
          display: flex;
          flex-direction: column;
          gap: 0.15rem;
        }

        .converter__readout-city {
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--slate);
        }

        .converter__readout-time {
          font-family: var(--font-mech);
          font-weight: 600;
          font-size: 1.8rem;
          font-variant-numeric: tabular-nums;
          color: var(--bone);
        }

        .converter__readout-day {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--slate);
        }

        .converter__diff {
          font-family: var(--font-mono);
          font-size: 0.78rem;
          padding: 0.3rem 0.6rem;
          border-radius: 999px;
          border: 1px solid var(--hairline);
          color: var(--verdigris-bright);
          white-space: nowrap;
        }

        .converter__rail-wrap {
          margin-bottom: 1rem;
        }

        .converter__rail {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            var(--brass) 0%,
            var(--brass) var(--fill, 50%),
            var(--ink) var(--fill, 50%),
            var(--ink) 100%
          );
          cursor: pointer;
        }

        .converter__rail::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--brass-bright);
          border: 2px solid var(--ink);
          box-shadow: 0 0 0 1px var(--hairline);
          cursor: pointer;
        }

        .converter__rail::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--brass-bright);
          border: 2px solid var(--ink);
          cursor: pointer;
        }

        .converter__rail-ticks {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--slate);
          margin-top: 0.4rem;
        }

        .converter__offsets {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--slate);
          margin-top: auto;
          padding-top: 1rem;
        }

        @media (max-width: 560px) {
          .converter { padding: 1.25rem; }
          .converter__readout-time { font-size: 1.4rem; }
        }
      `}</style>
    </div>
  );
}
