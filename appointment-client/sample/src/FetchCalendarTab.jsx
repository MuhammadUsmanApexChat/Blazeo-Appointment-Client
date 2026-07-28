import { useMemo, useState } from "react";
import {
  CalendarCreation,
  CalendarModel,
  deleteCalendarAsync,
  ensureBlazeoHttpReady,
  updateCalendarAsync,
} from "appointment-client";
import { getSnapshot, isStateTreeNode } from "mobx-state-tree";
import {
  configureBlazeoFromEffective,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";
import { getExampleCalendarBOInput } from "./CreateCalendarTab.jsx";

function pick(row, ...keys) {
  if (row == null || typeof row !== "object") return undefined;
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k];
  }
  return undefined;
}

function pad2(n) {
  const v = Number(n);
  if (Number.isNaN(v)) return "—";
  return String(v).padStart(2, "0");
}

/**
 * Browser `fetch` often surfaces blocked requests as TypeError "Failed to fetch" (e.g. CORS).
 */
function explainFetchFailure(err, configuredBaseUrl) {
  const msg = err instanceof Error ? err.message : String(err);
  const isNetwork =
    msg === "Failed to fetch" ||
    msg === "Load failed" ||
    (err instanceof TypeError && (/fetch/i.test(msg) || /network/i.test(msg)));
  if (!isNetwork) return mapBlazeoDemoError(msg);

  const isRemote =
    configuredBaseUrl &&
    /^https?:\/\//i.test(configuredBaseUrl) &&
    !/localhost|127\.0\.0\.1/i.test(configuredBaseUrl);

  const proxyHint =
    "Dev workaround (Vite proxy): create sample/.env.development with\n" +
    "  VITE_DEV_PROXY_TARGET=https://YOUR_API_ORIGIN\n" +
    "restart npm run dev, then set Base URL to:\n" +
    "  http://localhost:5173/blazeo-api\n" +
    "Consumer header stays the same.";

  if (isRemote) {
    return `${msg}\n\nLikely CORS / blocked browser cross-origin request.\nFix API CORS for http://localhost:5173, OR:\n${proxyHint}`;
  }
  return `${msg}\n\n${proxyHint}`;
}

/** Opening hours list from `calendarView`, embedded `calendar.openingHours`, or legacy `openingHours`. */
function pickOpeningHoursListFromBundle(parsed) {
  if (Array.isArray(parsed?.openingHours)) return parsed.openingHours;
  const fromView = parsed?.calendarView?.openingHours;
  if (Array.isArray(fromView) && fromView.length > 0) return fromView;
  const fromCal = parsed?.calendar?.openingHours;
  if (Array.isArray(fromCal) && fromCal.length > 0) return fromCal;
  const oh = parsed?.openingHours;
  if (oh == null) return null;
  if (Array.isArray(oh)) return oh.length ? oh : null;
  const d = oh.data ?? oh.Data ?? oh;
  if (Array.isArray(d)) return d.length ? d : null;
  if (d && typeof d === "object") {
    if (Array.isArray(d.openingHours)) return d.openingHours;
    if (Array.isArray(d.items)) return d.items;
  }
  return null;
}

function OpeningHoursSummary({ outputJson }) {
  let list = null;
  try {
    const parsed = JSON.parse(outputJson);
    list = pickOpeningHoursListFromBundle(parsed);
  } catch {
    return null;
  }
  if (!Array.isArray(list) || list.length === 0) {
    return (
      <p className="muted small" style={{ marginBottom: "0.75rem" }}>
        No opening-hours rows parsed for the table. Check{" "}
        <code>calendar.openingHours</code>, <code>calendarView.openingHours</code>, or <code>openingHours</code> in the JSON below.
      </p>
    );
  }

  return (
    <div style={{ marginBottom: "1rem" }}>
      <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", color: "#334155" }}>
        Opening hours (quick view)
      </h3>
      <table className="table">
        <thead>
          <tr>
            <th>Day(s)</th>
            <th>Start</th>
            <th>End</th>
            <th>Off</th>
            <th>Participant</th>
          </tr>
        </thead>
        <tbody>
          {list.map((row, idx) => {
            const days = pick(row, "days", "Days");
            const day = pick(row, "day", "Day");
            const dayLabel = Array.isArray(days)
              ? days.join(", ")
              : day != null
                ? String(day)
                : "—";
            const sh = pick(row, "startHour", "StartHour", "start_hour");
            const sm = pick(row, "startMinute", "StartMinute", "start_minute");
            const eh = pick(row, "endHour", "EndHour", "end_hour");
            const em = pick(row, "endMinute", "EndMinute", "end_minute");
            const off = pick(row, "off", "Off");
            const pid = pick(row, "participantId", "ParticipantId", "participant_id");
            const member = pick(row, "member", "Member");
            const participantDisplay =
              pid != null ? String(pid) : member != null ? String(member) : "—";
            return (
              <tr key={idx}>
                <td className="table__code">{dayLabel}</td>
                <td className="table__code">
                  {pad2(sh)}:{pad2(sm)}
                </td>
                <td className="table__code">
                  {pad2(eh)}:{pad2(em)}
                </td>
                <td className="table__code">{off === true || off === "true" ? "yes" : "no"}</td>
                <td className="table__code">{participantDisplay}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="muted small" style={{ marginTop: "0.5rem" }}>
        Source:{" "}
        {(() => {
          try {
            const p = JSON.parse(outputJson);
            if (p?.__openingHoursMeta?.fromCalendarGet) return "embedded on GET /Calendar/Get";
            if (p?.__openingHoursMeta?.fromParticipantApi)
              return "GET /Calendar/Participant/OpeningHours/Get";
            return "see JSON";
          } catch {
            return "—";
          }
        })()}
      </p>
    </div>
  );
}

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

/** MST `Calendar` snapshot uses `id` (server id). `CalendarInput` / update mapper expect `serverId`. */
function calendarSnapshotToUpdatePayload(snap) {
  const copy = { ...snap };
  const serverId = copy.id;
  delete copy.id;
  if (serverId != null) copy.serverId = serverId;
  return copy;
}

export function FetchCalendarTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [calendarId, setCalendarId] = useState("");
  const [companyKey, setCompanyKey] = useState("");
  const [isCrm, setIsCrm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const initialUpdateJson = useMemo(() => {
    const ex = getExampleCalendarBOInput();
    ex.calendarId = "paste-or-use-button-below";
    return JSON.stringify(ex, null, 2);
  }, []);
  const [updateJson, setUpdateJson] = useState(initialUpdateJson);
  const [mutateNote, setMutateNote] = useState("");
  const [mutateOutput, setMutateOutput] = useState("");
  const [lastFetchUpdatePayload, setLastFetchUpdatePayload] = useState(null);

  function ensureBaseConfigured() {
    if (!effective.baseUrl) {
      setError("Set Base URL in the connection card above or in `blazeoClientDefaults.ts`.");
      return false;
    }
    return true;
  }

  async function handleFetchCalendar(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    setLastFetchUpdatePayload(null);
    const id = calendarId.trim();
    if (!id) {
      setError("Enter a calendar id.");
      return;
    }
    if (!ensureBaseConfigured()) return;
    if (isCrm && !effective.crmApiUrl) {
      setError("Set CRM API URL in the Blazeo connection card when fetching a CRM calendar.");
      return;
    }
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });

    setBusy(true);
    try {
      const result = await CalendarModel.fetchCalendarDetails(id, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
        ...(effective.crmApiUrl ? { crmApiUrl: effective.crmApiUrl } : {}),
        ...(isCrm ? { isCrm: true } : {}),
        ...(companyKey.trim() ? { companyKey: companyKey.trim() } : {}),
      });

      if (result) {
        setOutput(toDisplayJson(result));
        setNote(`CalendarModel.fetchCalendarDetails → frontend calendar view (ID: ${id})`);
        setUpdateJson(toDisplayJson(result));
        setLastFetchUpdatePayload(toDisplayJson(result));
      } else {
        setNote(`Calendar not found or error fetching details for ID: ${id}`);
        setOutput("{}");
      }
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  async function handleFetchByCompany(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    setLastFetchUpdatePayload(null);
    const key = companyKey.trim();
    if (!key) {
      setError("Enter a company key.");
      return;
    }
    if (!ensureBaseConfigured()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });

    setBusy(true);
    try {
      // Use the new optimized method that includes members automatically
      const enriched = await CalendarModel.getCalendarsByCompany(key, {
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });

      if (!enriched || enriched.length === 0) {
        setNote("getCalendarsByCompany returned an empty list.");
        setOutput("[]");
      } else {
        setNote(
          `Loaded ${enriched.length} calendar(s) with members using optimized getCalendarsByCompany.`
        );
        setOutput(toDisplayJson(enriched));
      }
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  function handleFillUpdateFromLastFetch() {
    if (lastFetchUpdatePayload == null) {
      setError("Fetch one calendar first (successful CalendarModel.get), then use this button.");
      return;
    }
    setUpdateJson(lastFetchUpdatePayload);
    setError("");
    setMutateNote("");
    setMutateOutput("");
  }

  function handleInjectCalendarIdIntoUpdateJson() {
    const id = calendarId.trim();
    if (!id) {
      setError("Enter a calendar id above first, or edit the JSON manually.");
      return;
    }
    try {
      const obj = JSON.parse(updateJson);
      obj.calendarId = id;
      setUpdateJson(JSON.stringify(obj, null, 2));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update JSON is not valid JSON.");
    }
  }

  async function handleUpdateCalendar(e) {
    e.preventDefault();
    setError("");
    setMutateNote("");
    setMutateOutput("");
    if (!ensureBaseConfigured()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });
    let payload;
    try {
      payload = JSON.parse(updateJson);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
      return;
    }
    setBusy(true);
    try {
      const result = await CalendarCreation.updateWithRelationsAsync(payload, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      if (result.ok) {
        setMutateNote(
          "updateWithRelationsAsync → POST /Calendar/Event/Update + replace appointmentLocations + Batch Opening Hours"
        );
        setMutateOutput(
          JSON.stringify(
            {
              snapshot: result.calendar ? getSnapshot(result.calendar) : null,
              membersAdded: result.membersAdded,
              openingHoursSaved: result.openingHoursSaved,
              appointmentLocationsSaved: result.appointmentLocationsSaved,
              appointmentLocations: result.appointmentLocations,
              apiResponse: result.apiResponse ?? null,
            },
            null,
            2
          )
        );
      } else {
        setError(mapBlazeoDemoError(result.error));
        if (result.apiResponse != null) {
          setMutateOutput(JSON.stringify(result.apiResponse, null, 2));
        }
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteCalendar(e) {
    e.preventDefault();
    setError("");
    setMutateNote("");
    setMutateOutput("");
    const id = calendarId.trim();
    if (!id) {
      setError("Enter a calendar id to delete.");
      return;
    }
    if (!ensureBaseConfigured()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });
    if (
      !window.confirm(
        `Delete calendar "${id}"?\n\nThis calls GET /Calendar/Remove (cannot be undone on the server).`
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      const result = await deleteCalendarAsync(id, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      if (result.ok) {
        setMutateNote("deleteCalendarAsync → GET /Calendar/Remove");
        setMutateOutput(JSON.stringify({ calendarId: id, apiResponse: result.apiResponse ?? null }, null, 2));
      } else {
        setError(mapBlazeoDemoError(result.error));
        if (result.apiResponse != null) {
          setMutateOutput(JSON.stringify(result.apiResponse, null, 2));
        }
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Fetch calendar · calendarView</h2>
        <p className="muted small">
          Runs <code>fetchCalendarDetails(calendarId)</code> (default <code>viewFormat: &quot;frontend&quot;</code>).
          JSON matches the portal edit payload: <code>openingHours</code> with <code>days[]</code>,{" "}
          <code>members[].id</code>, <code>appointmentReminders</code>, theme fields,{" "}
          <code>appointmentUserDefinedFields</code> — basic lead rows from{" "}
          <code>GET /lead/fields/get</code> plus custom rows from <code>GET /CustomField/Form/Get</code>.
          When <code>isCrm</code> is true and <code>companyKey</code> is available, fields come from{" "}
          <code>GET &#123;crmApiUrl&#125;/crm/calendar/lead-fields/&#123;calendarId&#125;</code>;
          non-empty CRM rows are added as <code>crmLeadCustomFields</code>. Raw API requirements
          also appear as <code>leadFieldRequirements</code>.{" "}
          <code>appointmentLocations</code>. Legacy enriched shape:{" "}
          <code>viewFormat: &quot;unified&quot;</code>. Debug: non-enumerable <code>_enriched</code>, <code>_meta</code>. Plus a{" "}
          <code>participants</code> array where each participant may include nested <code>openingHours</code>. (
          <code>fetchCalendarBundle(calendarId)</code> returns the same shape.)
        </p>
        <p className="muted small">
          Uses <code>fetchCalendarDetails</code>: legacy <code>openingHours</code> prefers embed on{" "}
          <code>CalendarModel.getRaw</code>, else <code>getParticipantOpeningHours</code>.{" "}
          Unified <code>openingHours</code> prefers <code>getAllParticipantOpeningHours</code> (
          <code>GET /Calendar/Participant/OpeningHours/All/Get</code>) when the API returns rows. Members combine{" "}
          <code>CalendarModel.getParticipants</code> + <code>CalendarModel.getParticipantsInfo</code> (each member may
          include <code>participantInfo</code>).
        </p>
        <p className="muted small">
          <strong>In code:</strong> <code>fetchCalendarBundle(calendarId)</code> (after{" "}
          <code>initializeAppointmentClient(&#123; baseUrl, consumer &#125;)</code>) is an alias for the same unified fetch;
          use either alongside explicit <code>baseUrl</code> / <code>consumer</code> options when needed.
        </p>
        <p className="muted small">
          <strong>DevTools Network:</strong> Each fetch fires <code>/Calendar/Get</code> <strong>twice</strong> (
          <code>CalendarModel.get</code> + <code>getRaw</code>). Other calls use different URLs — filter by{" "}
          <code>Participant</code>, <code>OpeningHours</code>, or <code>GetInfo</code>. Those power the unified view. If you only see <code>Calendar/Get</code> yet the UI JSON has members/hours,
          widen the Network filter (&quot;All&quot;) or disable search; if the unified object is empty/missing fields,
          check the <strong>Console</strong> for errors on the participant/opening-hours requests.
        </p>
        <p className="muted small">
          Effective: <code>{effective.baseUrl || "(set connection or blazeoClientDefaults.ts)"}</code>
          {effective.consumer ? (
            <>
              {" "}
              · Consumer: <code>{effective.consumer}</code>
            </>
          ) : null}
        </p>

        <form onSubmit={handleFetchCalendar} className="form">
          <label className="form__label">
            <span>Calendar id</span>
            <input
              type="text"
              className="form__input"
              placeholder="Calendar / third-party id"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="form__label">
            <span>
              <input
                type="checkbox"
                checked={isCrm}
                onChange={(e) => setIsCrm(e.target.checked)}
              />{" "}
              CRM calendar (<code>isCrm</code>) — fetch fields from CRM API
            </span>
          </label>
          {isCrm ? (
            <label className="form__label">
              <span>Company key override (optional)</span>
              <input
                type="text"
                className="form__input"
                placeholder="Uses calendar GET companyKey when empty"
                value={companyKey}
                onChange={(e) => setCompanyKey(e.target.value)}
                autoComplete="off"
              />
            </label>
          ) : null}
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Loading…" : "Fetch calendar + opening hours"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Update calendar</h2>
        <p className="muted small">
          On update, <code>appointmentLocations</code> are replaced transactionally: existing rows are removed,
          payload rows are inserted, and the final <code>GET /Calendar/Location/Get</code> result is returned.
        </p>
        <div className="form-actions form-actions--top">
          <button
            type="button"
            className="btn btn--secondary"
            disabled={busy || lastFetchUpdatePayload == null}
            onClick={handleFillUpdateFromLastFetch}
          >
            Fill update form from last fetch
          </button>
          <button type="button" className="btn btn--secondary" disabled={busy} onClick={handleInjectCalendarIdIntoUpdateJson}>
            Set calendarId from field above
          </button>
        </div>
        <form onSubmit={handleUpdateCalendar} className="form">
          <label className="form__label">
            <span>Payload (JSON)</span>
            <textarea
              className="form__textarea"
              value={updateJson}
              onChange={(e) => setUpdateJson(e.target.value)}
              spellCheck={false}
              rows={14}
              aria-label="Calendar update JSON"
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Working…" : "Update calendar"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Delete calendar</h2>
        <form onSubmit={handleDeleteCalendar} className="form">
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Working…" : "Delete calendar"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Fetch calendars by company</h2>
        <p className="muted small">
          Step 1: <code>CalendarModel.getByCompany</code> → <code>GET /Calendar/All</code> (company key → calendar
          list). Step 2: for each calendar id, this tab runs the same{" "}
          <code>fetchCalendarDetails(calendarId)</code> pipeline as <strong>Fetch calendar · calendarView</strong>, so
          the JSON below is an <strong>array</strong> of unified objects (members, openingHours, participants — same
          shape as a single fetch). If an id is missing from the list row, that entry falls back to the raw snapshot
          only.
        </p>
        <p className="muted small">
          If the UI shows <strong>Failed to fetch</strong> while Base URL points at Azure/production, that is usually{" "}
          <strong>CORS</strong>: enable proxy via <code>VITE_DEV_PROXY_TARGET</code> in{" "}
          <code>sample/.env.development</code> and Base URL <code>http://localhost:5173/blazeo-api</code> (restart dev
          server).
        </p>
        <form onSubmit={handleFetchByCompany} className="form">
          <label className="form__label">
            <span>Company key</span>
            <input
              type="text"
              className="form__input"
              placeholder="company_key"
              value={companyKey}
              onChange={(e) => setCompanyKey(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Loading…" : "Fetch calendars"}
          </button>
        </form>
      </div>

      {error ? (
        <div className="card card--error" role="alert">
          <h2>Error</h2>
          <pre className="pre-block">{error}</pre>
        </div>
      ) : null}

      {note ? <p className="muted small">{note}</p> : null}

      {output ? (
        <div className="card card--success">
          <h2>Calendar + opening hours &amp; participants</h2>
          <OpeningHoursSummary outputJson={output} />
          <pre className="pre-block">{output}</pre>
        </div>
      ) : null}

      {mutateNote ? <p className="muted small">{mutateNote}</p> : null}

      {mutateOutput ? (
        <div className="card card--success">
          <h2>Update / delete result</h2>
          <pre className="pre-block">{mutateOutput}</pre>
        </div>
      ) : null}
    </>
  );
}
