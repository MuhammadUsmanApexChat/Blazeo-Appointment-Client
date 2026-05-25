import { useMemo, useState } from "react";
import {
  CalendarModel,
  ensureBlazeoHttpReady,
} from "appointment-client";
import {
  configureBlazeoFromEffective,
  useBlazeoConnection,
} from "./BlazeoConnectionSettings.jsx";
import { mapBlazeoDemoError } from "./blazeoDemoError.js";

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
    "Dev workaround: set VITE_DEV_PROXY_TARGET and Base URL http://localhost:5173/blazeo-api";

  if (isRemote) {
    return `${msg}\n\nLikely CORS. ${proxyHint}`;
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

/** Example from product spec — calendar-style + lead-style rows. */
export function getExampleFrontendFormFields() {
  return [
    {
      fieldLabel: "First Name",
      fieldKey: "FirstName",
      fieldId: "0702d225-45b1-4381-b24b-e788b17c2915",
      fieldToolTipText: "",
      isRequired: true,
      sortOrder: 0,
      calendarId: 0,
      isMandatory: true,
    },
    {
      fieldLabel: "Last Name",
      fieldKey: "LastName",
      fieldId: "ef9a369b-ebc8-48ae-97ab-13d04081bf07",
      isRequired: true,
      isMandatory: true,
    },
    {
      fieldLabel: "Email",
      fieldKey: "Email",
      fieldId: "c2c08947-4050-41ba-8d59-3ccff8bbbd79",
      isRequired: true,
      isMandatory: true,
    },
    {
      fieldName: "Test",
      fieldType: 3,
      fieldSubType: 303,
      description: "Test",
      isImportant: false,
      leadCustomOptions: [{ value: "A" }, { value: "B" }, { value: "C" }],
    },
  ];
}

export function SaveFormTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [calendarId, setCalendarId] = useState("");
  /** Optional full calendar JSON; `calendarId` is taken from object when set. */
  const [calendarJson, setCalendarJson] = useState("");
  const [fieldsJson, setFieldsJson] = useState(() =>
    toDisplayJson(getExampleFrontendFormFields())
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [transformedPreview, setTransformedPreview] = useState("");
  const [apiOutput, setApiOutput] = useState("");

  const connection = useMemo(
    () => ({
      ...connectionOpts,
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    }),
    [connectionOpts, effective.baseUrl, effective.consumer]
  );

  function ensureBaseConfigured() {
    if (!effective.baseUrl) {
      setError("Set Base URL in the connection card above.");
      return false;
    }
    return true;
  }

  function resolveCalendarTarget() {
    const raw = calendarJson.trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed != null && typeof parsed === "object") {
          return parsed;
        }
      } catch {
        throw new Error("Calendar JSON must be a valid object when provided.");
      }
    }
    const id = calendarId.trim();
    if (!id) {
      throw new Error("Enter calendar id or paste a calendar object with calendarId.");
    }
    return { calendarId: id };
  }

  function parseFieldsInput() {
    try {
      const parsed = JSON.parse(fieldsJson);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of field objects.");
      }
      return parsed;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  function handlePreviewTransform(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setTransformedPreview("");
    setApiOutput("");
    try {
      const fields = parseFieldsInput();
      const apiFields = CalendarModel.mapFormFieldsToApi(fields);
      setTransformedPreview(toDisplayJson(apiFields));
      setNote(
        `${apiFields.length} row(s) mapped for POST /CustomField/Form/Save (Label, Type, DataId, DropdownOptions, …).`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  async function handleSaveForm(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setTransformedPreview("");
    setApiOutput("");

    if (!ensureBaseConfigured()) return;

    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady(connection);

    setBusy(true);
    try {
      const calendar = resolveCalendarTarget();
      const fields = parseFieldsInput();
      const apiFields = CalendarModel.mapFormFieldsToApi(fields);
      setTransformedPreview(toDisplayJson(apiFields));

      const res = await CalendarModel.saveForm(calendar, fields, connection);
      if (!res.ok) {
        setError(mapBlazeoDemoError(res.detail ?? res.reason ?? ""));
        return;
      }
      const calId =
        typeof calendar === "string"
          ? calendar
          : String(calendar.calendarId ?? calendar.id ?? "");
      setNote(
        `CalendarModel.saveForm → POST /CustomField/Form/Save?calendar_id=${calId} · status: ${res.envelope.status ?? "(unknown)"}`
      );
      setApiOutput(toDisplayJson({ envelope: res.envelope, apiFields: res.apiFields }));
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Save custom field form</h2>
        <p className="muted small">
          <code>CalendarModel.saveForm(calendar, fields)</code> — pass a calendar id string or a calendar
          object with <code>calendarId</code> (from <code>fetchCalendarDetails</code> / calendar view). Maps
          fields then <code>POST /CustomField/Form/Save</code>.
        </p>
        <form onSubmit={handleSaveForm} className="form">
          <label className="form__label">
            <span>Calendar id</span>
            <input
              type="text"
              className="form__input"
              placeholder="calendar GUID"
              value={calendarId}
              onChange={(e) => setCalendarId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="form__label">
            <span>Or calendar object (JSON, optional)</span>
            <textarea
              className="form__input"
              rows={3}
              placeholder='{ "calendarId": "…", "name": "…" }'
              value={calendarJson}
              onChange={(e) => setCalendarJson(e.target.value)}
              spellCheck={false}
            />
          </label>
          <label className="form__label">
            <span>Frontend fields (JSON array)</span>
            <textarea
              className="form__input"
              rows={14}
              value={fieldsJson}
              onChange={(e) => setFieldsJson(e.target.value)}
              spellCheck={false}
            />
          </label>
          <div className="form__row">
            <button type="button" className="btn btn--secondary" onClick={handlePreviewTransform} disabled={busy}>
              Preview transform
            </button>
            <button type="submit" className="btn btn--primary" disabled={busy}>
              {busy ? "Saving…" : "Save form"}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              disabled={busy}
              onClick={() => setFieldsJson(toDisplayJson(getExampleFrontendFormFields()))}
            >
              Reset example
            </button>
          </div>
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

      {transformedPreview ? (
        <div className="card">
          <h2>Transformed payload (sent to API)</h2>
          <pre className="pre-block">{transformedPreview}</pre>
        </div>
      ) : null}

      {apiOutput ? (
        <div className="card">
          <h2>API response</h2>
          <pre className="pre-block">{apiOutput}</pre>
        </div>
      ) : null}
    </>
  );
}
