import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { blazeoClientConfig } from "appointment-client";
import { pushBlazeoConnection } from "./blazeoPushConnection.js";

const STORAGE_BASE = "appointment-client-sample:blazeoBaseUrl";
const STORAGE_CONSUMER = "appointment-client-sample:blazeoConsumer";
const STORAGE_CRM_API_URL = "appointment-client-sample:crmApiUrl";
const STORAGE_ACCESS_TOKEN = "appointment-client-sample:accessToken";

function readStored(key) {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function writeStored(key, value) {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function normalizeBase(u) {
  const t = (u ?? "").trim();
  if (!t) return "";
  return t.replace(/\/+$/, "");
}

/** Merge UI fields with packaged defaults (`blazeoClientDefaults`) when inputs are empty. */
export function mergeBlazeoUiWithFile(uiBaseUrl, uiConsumer, uiCrmApiUrl = "", uiAccessToken = "") {
  const fileBase = normalizeBase(blazeoClientConfig.baseUrl ?? "");
  const fileConsumer = (blazeoClientConfig.consumer ?? "").trim();
  const baseUrl = normalizeBase(uiBaseUrl) || fileBase || undefined;
  const consumer = (uiConsumer ?? "").trim() || fileConsumer || undefined;
  const crmApiUrl = normalizeBase(uiCrmApiUrl) || undefined;
  const accessToken = (uiAccessToken ?? "").trim() || undefined;
  return { baseUrl, consumer, crmApiUrl, accessToken };
}

/**
 * Re-apply global Blazeo `configure` from the effective connection card state.
 * Pushes into both calendar-client entrypoints ({@link pushBlazeoConnection}).
 */
export function configureBlazeoFromEffective(effective) {
  pushBlazeoConnection(effective);
}

const BlazeoConnectionContext = createContext(null);

export function BlazeoConnectionProvider({ children }) {
  const [baseUrlInput, setBaseUrlInput] = useState(() => readStored(STORAGE_BASE));
  const [consumerInput, setConsumerInput] = useState(() => readStored(STORAGE_CONSUMER));
  const [crmApiUrlInput, setCrmApiUrlInput] = useState(() => readStored(STORAGE_CRM_API_URL));
  const [accessTokenInput, setAccessTokenInput] = useState(() => readStored(STORAGE_ACCESS_TOKEN));

  const effective = useMemo(
    () => mergeBlazeoUiWithFile(baseUrlInput, consumerInput, crmApiUrlInput, accessTokenInput),
    [baseUrlInput, consumerInput, crmApiUrlInput, accessTokenInput]
  );

  /** Pass into `fetchCalendarDetails`, `createCalendarAsync`, etc. (explicit `baseUrl` for `ensureBlazeoHttpReady`). */
  const connectionOpts = useMemo(
    () => ({
      ...(effective.baseUrl ? { baseUrl: effective.baseUrl } : {}),
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
      ...(effective.crmApiUrl ? { crmApiUrl: effective.crmApiUrl } : {}),
      ...(effective.accessToken ? { accessToken: effective.accessToken } : {}),
    }),
    [effective.baseUrl, effective.consumer, effective.crmApiUrl, effective.accessToken]
  );

  useEffect(() => {
    writeStored(STORAGE_BASE, baseUrlInput.trim());
  }, [baseUrlInput]);

  useEffect(() => {
    writeStored(STORAGE_CONSUMER, consumerInput.trim());
  }, [consumerInput]);

  useEffect(() => {
    writeStored(STORAGE_CRM_API_URL, crmApiUrlInput.trim());
  }, [crmApiUrlInput]);

  useEffect(() => {
    writeStored(STORAGE_ACCESS_TOKEN, accessTokenInput.trim());
  }, [accessTokenInput]);

  /**
   * Sync global Blazeo `configure` before paint so `CalendarModel.get` /
   * `EventModel.*` static calls never see an empty `getConfig()` after the user
   * has set Base URL (including values restored from localStorage on first paint).
   */
  useLayoutEffect(() => {
    pushBlazeoConnection(
      mergeBlazeoUiWithFile(baseUrlInput, consumerInput, crmApiUrlInput, accessTokenInput)
    );
  }, [baseUrlInput, consumerInput, crmApiUrlInput, accessTokenInput]);

  const value = useMemo(
    () => ({
      baseUrlInput,
      consumerInput,
      crmApiUrlInput,
      accessTokenInput,
      setBaseUrlInput,
      setConsumerInput,
      setCrmApiUrlInput,
      setAccessTokenInput,
      effective,
      connectionOpts,
    }),
    [baseUrlInput, consumerInput, crmApiUrlInput, accessTokenInput, effective, connectionOpts]
  );

  return (
    <BlazeoConnectionContext.Provider value={value}>
      {children}
    </BlazeoConnectionContext.Provider>
  );
}

export function useBlazeoConnection() {
  const ctx = useContext(BlazeoConnectionContext);
  if (ctx == null) {
    throw new Error("useBlazeoConnection must be used within BlazeoConnectionProvider");
  }
  return ctx;
}
