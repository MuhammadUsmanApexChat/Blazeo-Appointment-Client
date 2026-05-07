import { useMemo, useState } from "react";
import { createCalendarAsync, createCalendarWithRelationsAsync, ensureBlazeoHttpReady } from "appointment-client";
import { getSnapshot } from "mobx-state-tree";
import { configureBlazeoFromEffective, useBlazeoConnection } from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

/** Demo payload aligned with `CalendarBOInput` / server `CalendarBO`. */
export function getExampleCalendarBOInput() {
  return {
    companyKey: "company_key",
    name: "Demo calendar",
    timeZoneId: "Pakistan Standard Time",
    assignmentMethod: 1,
    duration: 20,
    durationUnit: 1,
    minimumBookingNotice: 1,
    minimumBookingNoticeUnit: 2,
    minimumCancelationNotice: 1,
    minimumCancelationNoticeUnit: 2,
    futureLimit: 1,
    futureLimitUnit: 6,
    bufferTime: 10,
    bufferTimeUnit: 1,
    bookingLimit: -1,
    members: [{ id: "00000000-0000-0000-0000-000000000000" }],
    openingHours: [
      {
        id: 1,
        days: [1, 2, 3, 4, 5],
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
        off: false,
        participantId: "00000000-0000-0000-0000-000000000000",
      },
    ],
  };
}

export function CreateCalendarTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [localOnly, setLocalOnly] = useState(false);
  const [saveRelations, setSaveRelations] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(getExampleCalendarBOInput(), null, 2)
  );

  const hint = useMemo(() => {
    if (localOnly) return "Local only: no HTTP.";
    if (!effective.baseUrl) return "Set Base URL above first.";
    return saveRelations ? "Will save calendar + participants + opening hours." : "Will save calendar body only.";
  }, [localOnly, effective.baseUrl, saveRelations]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    let payload;
    try {
      payload = JSON.parse(jsonText);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    if (!localOnly && !effective.baseUrl) {
      setError("Set Base URL in the connection card above.");
      return;
    }
    if (!localOnly) {
      configureBlazeoFromEffective(effective);
      ensureBlazeoHttpReady(connectionOpts);
    }

    const hasRelations = (payload.members?.length ?? 0) > 0 || (payload.openingHours?.length ?? 0) > 0;
    const useRelations = saveRelations && hasRelations && !localOnly;

    setBusy(true);
    try {
      const result = useRelations
        ? await createCalendarWithRelationsAsync(payload, { localOnly, ...connectionOpts })
        : await createCalendarAsync(payload, { localOnly, ...connectionOpts });
      setOutput(JSON.stringify(result.ok ? getSnapshot(result.calendar) : result, null, 2));
      if (!result.ok) setError(mapBlazeoDemoError(result.error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Create calendar</h2>
        <p className="muted small">{hint}</p>
        <label className="form__label">
          <span>
            <input type="checkbox" checked={localOnly} onChange={(e) => setLocalOnly(e.target.checked)} /> Local only
          </span>
        </label>
        <label className="form__label">
          <span>
            <input
              type="checkbox"
              checked={saveRelations}
              disabled={localOnly}
              onChange={(e) => setSaveRelations(e.target.checked)}
            />{" "}
            Save members &amp; opening hours
          </span>
        </label>
      </div>

      <div className="card">
        <h2>Payload</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label className="form__label">
            <span>JSON</span>
            <textarea
              className="form__textarea"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              spellCheck={false}
              rows={16}
            />
          </label>
          <button className="btn btn--primary" disabled={busy}>
            {busy ? "Working…" : "Create"}
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
