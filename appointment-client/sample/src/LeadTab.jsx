import { useState } from "react";
import {
  ensureBlazeoHttpReady,
  fetchLeadByEmail,
  fetchLeadDetails,
  fetchLeadsByCompany,
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

export function LeadTab() {
  const { effective, connectionOpts } = useBlazeoConnection();
  const [leadId, setLeadId] = useState("");
  const [email, setEmail] = useState("");
  const [companyKey, setCompanyKey] = useState("");
  const [listCompanyKey, setListCompanyKey] = useState("");
  const [skip, setSkip] = useState("");
  const [take, setTake] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [output, setOutput] = useState("");

  function ensureBaseConfigured() {
    if (!effective.baseUrl) {
      setError("Set Base URL in the connection card above or in `blazeoClientDefaults.ts`.");
      return false;
    }
    return true;
  }

  async function handleFetchById(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    const id = leadId.trim();
    if (!id) {
      setError("Enter a lead id.");
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
      const res = await fetchLeadDetails(id, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      if (!res.ok) {
        setError(mapBlazeoDemoError(res.detail ?? ""));
        return;
      }
      setNote("LeadModel.get + getRaw → GET /lead/get (lead mapped snapshot + raw envelope).");
      setOutput(toDisplayJson({ lead: res.lead, rawGet: res.rawGet }));
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  async function handleFetchByEmail(e) {
    e.preventDefault();
    setError("");
    setNote("");
    setOutput("");
    const em = email.trim();
    const ck = companyKey.trim();
    if (!em || !ck) {
      setError("Enter email and company key.");
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
      const res = await fetchLeadByEmail(em, ck, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      if (!res.ok) {
        setError(mapBlazeoDemoError(res.detail ?? ""));
        return;
      }
      setNote("LeadModel.getByEmail → GET /lead/getbyemail.");
      setOutput(toDisplayJson({ lead: res.lead }));
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
    const ck = listCompanyKey.trim();
    if (!ck) {
      setError("Enter company key for the list.");
      return;
    }
    if (!ensureBaseConfigured()) return;
    configureBlazeoFromEffective(effective);
    ensureBlazeoHttpReady({
      baseUrl: effective.baseUrl,
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    });

    const listOpts = {};
    const s = skip.trim();
    const t = take.trim();
    if (s !== "") {
      const n = Number(s);
      if (!Number.isFinite(n)) {
        setError("Skip must be a number.");
        return;
      }
      listOpts.skip = n;
    }
    if (t !== "") {
      const n = Number(t);
      if (!Number.isFinite(n)) {
        setError("Take must be a number.");
        return;
      }
      listOpts.take = n;
    }

    setBusy(true);
    try {
      const res = await fetchLeadsByCompany(ck, listOpts, {
        ...connectionOpts,
        baseUrl: effective.baseUrl,
        ...(effective.consumer ? { consumer: effective.consumer } : {}),
      });
      if (!res.ok) {
        setError(mapBlazeoDemoError(res.detail ?? ""));
        return;
      }
      setNote(
        `LeadModel.getByCompany → GET /lead/company/get (${res.leads.length} row(s), MST snapshots as plain objects).`
      );
      setOutput(toDisplayJson({ leads: res.leads }));
    } catch (err) {
      setError(explainFetchFailure(err, effective.baseUrl));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="card">
        <h2>Lead by id</h2>
        <p className="muted small">
          Uses <code>fetchLeadDetails(leadId)</code> from <code>appointment-client</code>, which wraps{" "}
          <code>LeadModel.getRaw</code> + <code>LeadModel.get</code> (<code>GET /lead/get</code>). Output shows both the
          mapped lead snapshot and the raw API envelope.
        </p>
        <form onSubmit={handleFetchById} className="form">
          <label className="form__label">
            <span>Lead id</span>
            <input
              type="text"
              className="form__input"
              placeholder="lead_id"
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? "Loading…" : "Fetch lead"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Lead by email + company</h2>
        <p className="muted small">
          <code>fetchLeadByEmail</code> → <code>LeadModel.getByEmail</code> (<code>GET /lead/getbyemail</code>).
        </p>
        <form onSubmit={handleFetchByEmail} className="form">
          <label className="form__label">
            <span>Email</span>
            <input
              type="email"
              className="form__input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </label>
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
            {busy ? "Loading…" : "Fetch lead"}
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Leads by company</h2>
        <p className="muted small">
          <code>fetchLeadsByCompany</code> → <code>LeadModel.getByCompany</code> (<code>GET /lead/company/get</code>).
          Optional <code>skip</code> / <code>take</code> map to query params (see calendar-client).
        </p>
        <form onSubmit={handleFetchByCompany} className="form">
          <label className="form__label">
            <span>Company key</span>
            <input
              type="text"
              className="form__input"
              placeholder="company_key"
              value={listCompanyKey}
              onChange={(e) => setListCompanyKey(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="form__label">
            <span>Skip (optional)</span>
            <input
              type="text"
              className="form__input"
              inputMode="numeric"
              placeholder="e.g. 0"
              value={skip}
              onChange={(e) => setSkip(e.target.value)}
              autoComplete="off"
            />
          </label>
          <label className="form__label">
            <span>Take (optional)</span>
            <input
              type="text"
              className="form__input"
              inputMode="numeric"
              placeholder="e.g. 50"
              value={take}
              onChange={(e) => setTake(e.target.value)}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="btn btn--secondary" disabled={busy}>
            {busy ? "Loading…" : "Fetch leads"}
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
