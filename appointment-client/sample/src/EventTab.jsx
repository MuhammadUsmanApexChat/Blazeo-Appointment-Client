import { useMemo, useState } from "react";
import {
  cancelAppointmentEventAsync,
  createAppointmentEventAsync,
  ensureBlazeoHttpReady,
  EventModel,
  getAppointmentsByFilter,
  rescheduleAppointmentEventAsync,
} from "appointment-client";
import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import {
  configureBlazeoFromEffective,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

function getExampleCreatePayload() {
  const start = new Date();
  start.setHours(10, 0, 0, 0);
  const end = new Date(start);
  end.setHours(10, 30, 0, 0);
  return {
    thirdPartyCalendarId: "your-calendar-id",
    participantId: "00000000-0000-0000-0000-000000000000",
    title: "Sample appointment",
    description: "Created via appointment-client sample",
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    email: "visitor@example.com",
    visitorName: "Visitor",
    timeZone: "Pakistan Standard Time",
    rescheduleUrl: "https://example.com/reschedule",
    cancelUrl: "https://example.com/cancel",
  };
}

function getExampleReschedulePayload() {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(14, 0, 0, 0);
  const end = new Date(start);
  end.setHours(14, 45, 0, 0);
  return {
    thirdPartyAppointmentId: "existing-blazeo-event-id",
    thirdPartyCalendarId: "your-calendar-id",
    participantId: "00000000-0000-0000-0000-000000000000",
    title: "Rescheduled title",
    notes: "Reschedule body",
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    email: "visitor@example.com",
    timeZone: "Pakistan Standard Time",
  };
}

function resultToJson(result) {
  if (!result) return "";
  if (result.ok && result.event && isStateTreeNode(result.event)) {
    return JSON.stringify(
      {
        ok: true,
        eventSnapshot: getSnapshot(result.event),
        apiResponse: result.apiResponse ?? null,
      },
      null,
      2
    );
  }
  return JSON.stringify(result, null, 2);
}

function safeJsonParse(text, fallback) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

export function EventTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [offsetMinutes, setOffsetMinutes] = useState(-new Date().getTimezoneOffset());
  const [createJson, setCreateJson] = useState(() =>
    JSON.stringify(getExampleCreatePayload(), null, 2)
  );
  const [rescheduleJson, setRescheduleJson] = useState(() =>
    JSON.stringify(getExampleReschedulePayload(), null, 2)
  );
  const [searchCompanyKey, setSearchCompanyKey] = useState("");
  const [searchFrom, setSearchFrom] = useState(() => new Date().toISOString().slice(0, 10));
  const [searchTo, setSearchTo] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [searchFiltersJson, setSearchFiltersJson] = useState(() =>
    JSON.stringify(
      {
        calendarId: "",
        participantId: "",
        leadId: "",
        visitorName: "",
        visitorEmail: "",
        visitorPhone: "",
        title: "",
        search: "",
        attendeeStatus: "",
        eventSource: "",
        sort: "",
        sortOrder: "desc",
        page: 1,
        page_size: 25,
      },
      null,
      2
    )
  );
  const [cancelEventId, setCancelEventId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");

  const opts = useMemo(() => ({ offsetMinutes: Number(offsetMinutes) || 0 }), [offsetMinutes]);
  const eventOpts = useMemo(() => ({ ...opts, ...connectionOpts }), [opts, connectionOpts]);

  function ensureBase() {
    if (!effective.baseUrl) {
      setError("Set Base URL in the connection card above.");
      return false;
    }
    return true;
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    if (!ensureBase()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });
    let payload;
    try {
      payload = JSON.parse(createJson);
    } catch (err) {
      setError(`Create JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    setBusy(true);
    try {
      const result = await createAppointmentEventAsync(payload, eventOpts);
      setOutput(resultToJson(result));
      if (!result.ok) setError(mapBlazeoDemoError(result.error));
    } finally {
      setBusy(false);
    }
  }

  async function handleReschedule(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    if (!ensureBase()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });
    let payload;
    try {
      payload = JSON.parse(rescheduleJson);
    } catch (err) {
      setError(`Reschedule JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    setBusy(true);
    try {
      const result = await rescheduleAppointmentEventAsync(payload, eventOpts);
      setOutput(resultToJson(result));
      if (!result.ok) setError(mapBlazeoDemoError(result.error));
    } finally {
      setBusy(false);
    }
  }

  async function handleCancel(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    const id = cancelEventId.trim();
    if (!id) return setError("Enter Blazeo event id to cancel.");
    if (!ensureBase()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });
    setBusy(true);
    try {
      const result = await cancelAppointmentEventAsync(id, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      setOutput(JSON.stringify(result, null, 2));
      if (!result.ok) setError(mapBlazeoDemoError(result.error));
    } finally {
      setBusy(false);
    }
  }

  async function handleSearchByDateRange(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    const companyKey = searchCompanyKey.trim();
    if (!companyKey) return setError("Enter company key.");
    if (!searchFrom) return setError("Pick start date.");
    if (!searchTo) return setError("Pick end date.");
    if (!ensureBase()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });

    const optsFromJson = safeJsonParse(searchFiltersJson, {});
    const startDateFrom = new Date(`${searchFrom}T00:00:00.000Z`).toISOString();
    const startDateTo = new Date(`${searchTo}T23:59:59.999Z`).toISOString();

    setBusy(true);
    try {
      const res = await EventModel.getByDateRangeWithFilters(
        companyKey,
        startDateFrom,
        startDateTo,
        optsFromJson
      );

      const events = (res?.events ?? []).map((e) =>
        isStateTreeNode(e) ? getSnapshot(e) : (e?.toJSON?.() ?? e)
      );
      const totalCount = res?.totalCount ?? events.length;
      setOutput(JSON.stringify({ totalCount, events }, null, 2));
    } finally {
      setBusy(false);
    }
  }

  async function handleEnrichedSearch(e) {
    e.preventDefault();
    setError("");
    setOutput("");
    const companyKey = searchCompanyKey.trim();
    if (!companyKey) return setError("Enter company key.");
    if (!searchFrom) return setError("Pick start date.");
    if (!searchTo) return setError("Pick end date.");
    if (!ensureBase()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });

    const optsFromJson = safeJsonParse(searchFiltersJson, {});
    const startDateFrom = new Date(`${searchFrom}T00:00:00.000Z`).toISOString();
    const startDateTo = new Date(`${searchTo}T23:59:59.999Z`).toISOString();

    setBusy(true);
    try {
      const res = await getAppointmentsByFilter(
        companyKey,
        startDateFrom,
        startDateTo,
        optsFromJson
      );

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
        <h2>Appointment events</h2>
        <p className="muted small">
          Create/reschedule/cancel Blazeo events via <code>appointment-client</code>.
        </p>
        <label className="form__label">
          <span>Offset minutes</span>
          <input
            type="number"
            className="form__input"
            value={offsetMinutes}
            onChange={(e) => setOffsetMinutes(e.target.value)}
          />
        </label>
      </div>

      <div className="card">
        <h2>Search events (date range + filters)</h2>
        <p className="muted small">
          Calls <code>EventModel.getByDateRangeWithFilters</code> →
          <code> GET /event/search/daterange/get</code> (company scope). Offset header comes from the{" "}
          <code>offset</code> field above.
        </p>
        <form onSubmit={handleSearchByDateRange} className="form">
          <label className="form__label">
            <span>Company key</span>
            <input
              className="form__input"
              value={searchCompanyKey}
              onChange={(e) => setSearchCompanyKey(e.target.value)}
              placeholder="company_key"
              autoComplete="off"
            />
          </label>
          <div className="connection-card__row">
            <label className="form__label">
              <span>Start date (from)</span>
              <input
                type="date"
                className="form__input"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
              />
            </label>
            <label className="form__label">
              <span>Start date (to)</span>
              <input
                type="date"
                className="form__input"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
              />
            </label>
          </div>
          <label className="form__label">
            <span>Filters (JSON)</span>
            <textarea
              className="form__textarea"
              value={searchFiltersJson}
              onChange={(e) => setSearchFiltersJson(e.target.value)}
              spellCheck={false}
              rows={10}
            />
          </label>
          <div className="connection-card__row">
            <button type="button" className="btn btn--secondary" onClick={handleSearchByDateRange} disabled={busy}>
              {busy ? "Loading…" : "Raw Search"}
            </button>
            <button type="button" className="btn btn--primary" onClick={handleEnrichedSearch} disabled={busy}>
              {busy ? "Loading…" : "Enriched Search (New)"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Create event</h2>
        <form onSubmit={handleCreate} className="form">
          <label className="form__label">
            <span>Payload (JSON)</span>
            <textarea
              className="form__textarea"
              value={createJson}
              onChange={(e) => setCreateJson(e.target.value)}
              spellCheck={false}
              rows={14}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Working…" : "Create"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Reschedule event</h2>
        <form onSubmit={handleReschedule} className="form">
          <label className="form__label">
            <span>Payload (JSON)</span>
            <textarea
              className="form__textarea"
              value={rescheduleJson}
              onChange={(e) => setRescheduleJson(e.target.value)}
              spellCheck={false}
              rows={14}
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Working…" : "Reschedule"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Cancel event</h2>
        <form onSubmit={handleCancel} className="form">
          <label className="form__label">
            <span>Event id</span>
            <input
              className="form__input"
              value={cancelEventId}
              onChange={(e) => setCancelEventId(e.target.value)}
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Working…" : "Cancel"}
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
