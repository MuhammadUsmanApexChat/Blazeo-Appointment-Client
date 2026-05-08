import { useState } from "react";
import { ensureBlazeoHttpReady, fetchCalendarWithOpeningHours } from "appointment-client";
import {
  configureBlazeoFromEffective,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

export function OpeningHoursTab() {
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
    if (!id) {
      setError("Enter a calendar id.");
      return;
    }
    if (!effective.baseUrl) {
      setError("Set Base URL in the connection card above.");
      return;
    }
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });
    setBusy(true);
    try {
      const res = await fetchCalendarWithOpeningHours(id, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      setOutput(JSON.stringify(res, null, 2));
    } catch (err) {
      setError(mapBlazeoDemoError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Opening Hours (Detailed)</h2>
        <p className="muted small">
          Fetches business hours using <code>fetchCalendarWithOpeningHours</code>.
        </p>
        <form onSubmit={handleFetch} className="form">
          <label className="form__label">
            <span>Calendar id</span>
            <input
              type="text"
              className="form__input"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Loading…" : "Fetch Opening Hours"}
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
