import { useEffect, useState } from "react";
import {
  CalendarModel,
  ensureBlazeoHttpReady,
  getFieldType,
  getFieldTypes,
} from "appointment-client";
import {
  configureBlazeoFromEffective,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

/** Browser `fetch` often surfaces blocked requests as TypeError "Failed to fetch" (e.g. CORS). */
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

function toDisplayJson(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

const ALL_TYPES_QUERY =
  "Checkbox, Date, Dropdown, Email, MultilineText, MultiselectList, Number, Phone, RadioButton, Text";

export function FieldTypeTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [fieldType, setFieldType] = useState("Text");
  const [removeCalendarId, setRemoveCalendarId] = useState("");
  const [removeFieldId, setRemoveFieldId] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [output, setOutput] = useState("");

  const connection = {
    ...connectionOpts,
    baseUrl: effective.baseUrl,
    ...(effective.consumer ? { consumer: effective.consumer } : {}),
  };

  function ensureBaseConfigured() {
    if (!effective.baseUrl) {
      setError("Set Base URL in the connection card above or in `blazeoClientDefaults.ts`.");
      return false;
    }
    return true;
  }

  function prepareHttp() {
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady(connection);
  }

  async function loadTypeOptions() {
    if (!ensureBaseConfigured()) return [];
    prepareHttp();
    const res = await getFieldTypes(connection);
    if (!res.ok || !res.fieldTypes?.length) return [];
    setTypeOptions(res.fieldTypes);
    return res.fieldTypes;
  }

  useEffect(() => {
    if (!effective.baseUrl) return;
    loadTypeOptions().catch(() => {});
  }, [effective.baseUrl, effective.consumer]);

  async function handleGetFieldTypes(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    if (!ensureBaseConfigured()) return;

    setBusy(true);
    try {
      const list = await loadTypeOptions();
      if (!list.length) {
        setError("Could not load field type names from the API.");
        return;
      }
      setNote(`${list.length} type name(s) — names only (string[]).`);
      setOutput(toDisplayJson(list));
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  async function handleGetAllDefinitions(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    if (!ensureBaseConfigured()) return;
    prepareHttp();

    setBusy(true);
    try {
      const res = await getFieldType(ALL_TYPES_QUERY, connection);
      if (!res.ok) {
        setError(mapBlazeoDemoError(res.detail ?? ""));
        return;
      }
      const count = Array.isArray(res.fieldType) ? res.fieldType.length : res.fieldType ? 1 : 0;
      setNote(
        `getFieldType(comma-separated list) → ${count} definition object(s) from GET /CustomField/FieldType/Get.`
      );
      setOutput(toDisplayJson(res.fieldType));
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  async function handleGetOneDefinition(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    const ft = fieldType.trim();
    if (!ft || ft.includes(",")) {
      setError("Pick one type for a single definition, or use “Get all definitions”.");
      return;
    }
    if (!ensureBaseConfigured()) return;
    prepareHttp();

    setBusy(true);
    try {
      const res = await getFieldType(ft, connection);
      if (!res.ok) {
        setError(mapBlazeoDemoError(res.detail ?? ""));
        return;
      }
      if (!res.fieldType || Array.isArray(res.fieldType)) {
        setError(`No definition found for "${ft}".`);
        return;
      }
      setNote(`getFieldType("${ft}") → one definition (Type "${res.fieldType.Type ?? res.fieldType.type}").`);
      setOutput(toDisplayJson(res.fieldType));
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Field type names only</h2>
        <p className="muted small">
          <code>getFieldTypes()</code> → <code>string[]</code> of names (
          <code>["Checkbox","Date",…,"Text"]</code>).
        </p>
        <form onSubmit={handleGetFieldTypes} className="form">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Loading…" : "Get type names"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>All field type definitions</h2>
        <p className="muted small">
          <code>getFieldType</code> with a comma-separated list (or <code>all</code>) returns every
          definition object from <code>GET /CustomField/FieldType/Get</code> — same as before filtering
          was added.
        </p>
        <form onSubmit={handleGetAllDefinitions} className="form">
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Loading…" : "Get all definitions"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>One field type definition</h2>
        <p className="muted small">
          <code>getFieldType("Text")</code> → single object for that type.
        </p>
        <form onSubmit={handleGetOneDefinition} className="form">
          {typeOptions.length > 0 ? (
            <label className="form__label">
              <span>Pick type</span>
              <select
                className="form__input"
                value={typeOptions.includes(fieldType) ? fieldType : typeOptions[0]}
                onChange={(e) => setFieldType(e.target.value)}
              >
                {typeOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Loading…" : `Get definition for ${fieldType || "…"}`}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Remove custom fields</h2>
        <p className="muted small">
          <code>CalendarModel.removeField</code> → <code>GET /CustomField/RemoveField?customfield_id=…</code>
          · <code>CalendarModel.removeAllFields</code> →{" "}
          <code>GET /CustomField/RemoveAllFields?calendar_id=…</code>
        </p>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setNote("");
            setOutput("");
            const fid = removeFieldId.trim();
            if (!fid) {
              setError("Enter customFieldId (or fieldId) to remove one field.");
              return;
            }
            if (!ensureBaseConfigured()) return;
            prepareHttp();
            setBusy(true);
            try {
              const res = await CalendarModel.removeField(fid, connection);
              if (!res.ok) {
                setError(mapBlazeoDemoError(res.detail ?? res.reason ?? ""));
                return;
              }
              setNote(`removeField("${fid}") → status: ${res.envelope.status ?? "(unknown)"}`);
              setOutput(toDisplayJson(res.envelope));
            } catch (err) {
              setError(explainFetchFailure(err, effective.baseUrl));
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="form__label">
            <span>customFieldId</span>
            <input
              type="text"
              className="form__input"
              placeholder="GUID"
              value={removeFieldId}
              onChange={(e) => setRemoveFieldId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Working…" : "Remove one field"}
          </button>
        </form>
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setNote("");
            setOutput("");
            const calId = removeCalendarId.trim();
            if (!calId) {
              setError("Enter calendar id for remove all.");
              return;
            }
            if (!ensureBaseConfigured()) return;
            prepareHttp();
            setBusy(true);
            try {
              const res = await CalendarModel.removeAllFields(calId, connection);
              if (!res.ok) {
                setError(mapBlazeoDemoError(res.detail ?? res.reason ?? ""));
                return;
              }
              setNote(`removeAllFields("${calId}") → status: ${res.envelope.status ?? "(unknown)"}`);
              setOutput(toDisplayJson(res.envelope));
            } catch (err) {
              setError(explainFetchFailure(err, effective.baseUrl));
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="form__label">
            <span>Calendar id</span>
            <input
              type="text"
              className="form__input"
              placeholder="calendar GUID"
              value={removeCalendarId}
              onChange={(e) => setRemoveCalendarId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Working…" : "Remove all fields"}
          </button>
        </form>
      </div>

      {note ? (
        <div className="card">
          <h2>Note</h2>
          <p className="muted small">{note}</p>
        </div>
      ) : null}

      {error ? (
        <div className="card card--error" role="alert">
          <h2>Error</h2>
          <pre className="pre-block">{error}</pre>
        </div>
      ) : null}

      {output ? (
        <div className="card">
          <h2>JSON</h2>
          <pre className="pre-block">{output}</pre>
        </div>
      ) : null}
    </>
  );
}
