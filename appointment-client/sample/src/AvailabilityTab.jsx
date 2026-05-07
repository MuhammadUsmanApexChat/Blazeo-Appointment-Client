import { useMemo, useState } from "react";
import { ensureBlazeoHttpReady, EventModel } from "appointment-client";
import { configureBlazeoFromEffective, useBlazeoConnection } from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

function parseYmd(ymd) {
  const t = (ymd ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return null;
  const [y, m, d] = t.split("-").map((x) => Number(x));
  return { y, m, d };
}

export function AvailabilityTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [calendarId, setCalendarId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [offsetMinutes, setOffsetMinutes] = useState(-new Date().getTimezoneOffset());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const opts = useMemo(() => ({ offset: Number(offsetMinutes) || 0 }), [offsetMinutes]);

  async function handleSlots(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    const id = calendarId.trim();
    const parts = parseYmd(date);
    if (!id) return setError("Enter calendar id.");
    if (!parts) return setError("Pick a valid date.");
    if (!effective.baseUrl) return setError("Set Base URL above.");
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady(connectionOpts);

    setBusy(true);
    try {
      const list = await EventModel.getAvailability(id, parts.y, parts.m, parts.d, opts);
      setOutput(JSON.stringify(list.map((n) => n.toJSON?.() ?? n), null, 2));
    } catch (err) {
      setError(mapBlazeoDemoError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Availability</h2>
        <form onSubmit={handleSlots} className="form">
          <label className="form__label">
            <span>Calendar id</span>
            <input className="form__input" value={calendarId} onChange={(e) => setCalendarId(e.target.value)} />
          </label>
          <label className="form__label">
            <span>Date</span>
            <input type="date" className="form__input" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
          <label className="form__label">
            <span>Offset minutes</span>
            <input type="number" className="form__input" value={offsetMinutes} onChange={(e) => setOffsetMinutes(e.target.value)} />
          </label>
          <button className="btn btn--secondary" disabled={busy}>
            {busy ? "Loading…" : "Load slots"}
          </button>
        </form>
      </div>

      {error ? (
        <div className="card card--error" role="alert">
          <h2>Error</h2>
          <pre className="pre-block">{error}</pre>
        </div>
      ) : null}
      {output ? (
        <div className="card card--success">
          <h2>Result</h2>
          <pre className="pre-block">{output}</pre>
        </div>
      ) : null}
    </>
  );
}

