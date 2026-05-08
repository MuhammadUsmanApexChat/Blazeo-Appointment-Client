import { useMemo, useState } from "react";
import { ensureBlazeoHttpReady, getExampleParticipants, getParticipants } from "appointment-client";
import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import {
  configureBlazeoFromEffective,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

function toDisplayJson(value) {
  if (value == null) return JSON.stringify(value, null, 2);
  if (Array.isArray(value) && value.every(isStateTreeNode)) {
    return JSON.stringify(value.map((n) => getSnapshot(n)), null, 2);
  }
  if (isStateTreeNode(value)) return JSON.stringify(getSnapshot(value), null, 2);
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function ParticipantTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const example = useMemo(() => getExampleParticipants(), []);
  const [calendarId, setCalendarId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  async function handleFetchParticipants(e) {
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
      const res = await getParticipants(id, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      setOutput(toDisplayJson(res));
    } catch (err) {
      setError(mapBlazeoDemoError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Participants</h2>
        <p className="muted small">
          Example participants from <code>getExampleParticipants()</code> plus a fetch helper.
        </p>
        <pre className="pre-block">{JSON.stringify(example, null, 2)}</pre>
      </div>

      <div className="card">
        <h2>Fetch participants by calendar</h2>
        <p className="muted small">
          Calls <code>ParticipantModel.getAllByCalendar(calendarId)</code>.
        </p>
        <form onSubmit={handleFetchParticipants} className="form">
          <label className="form__label">
            <span>Calendar id</span>
            <input
              type="text"
              className="form__input"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Loading…" : "Fetch participants"}
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

