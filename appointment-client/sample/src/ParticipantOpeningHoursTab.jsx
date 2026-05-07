import { useState } from "react";
import { ensureBlazeoHttpReady, getParticipantOpeningHours } from "appointment-client";
import { configureBlazeoFromEffective, useBlazeoConnection } from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

export function ParticipantOpeningHoursTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [calendarId, setCalendarId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  async function handleFetch(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    const id = calendarId.trim();
    if (!id) return setError("Enter a calendar id.");
    if (!effective.baseUrl) return setError("Set Base URL in the connection card above.");

    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady(connectionOpts);
    setBusy(true);
    try {
      const result = await getParticipantOpeningHours(id, connectionOpts);

      if (!result.meta.ok) {
        setError(
          mapBlazeoDemoError(result.meta.error || `Failed to fetch: ${result.meta.reason}`)
        );
        if (result.raw) setOutput(JSON.stringify(result.raw, null, 2));
        return;
      }

      setOutput(JSON.stringify({ 
        calendarId: id, 
        count: result.openingHours.length, 
        openingHours: result.openingHours, 
        raw: result.raw,
        meta: result.meta 
      }, null, 2));
    } catch (err) {
      setError(mapBlazeoDemoError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Participant Opening Hours (Direct)</h2>
        <p className="muted small">
          Calls <code>CalendarModel.get(calendarId)</code> then{" "}
          <code>calendar.getParticipantOpeningHours(&#123;&#125;)</code> (API:{" "}
          <code>GET /Calendar/Participant/OpeningHours/Get</code>).
        </p>
        <form onSubmit={handleFetch} className="form">
          <label className="form__label">
            <span>Calendar id</span>
            <input
              type="text"
              className="form__input"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Loading…" : "Fetch participant opening hours"}
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

