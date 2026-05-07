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
export function mergeBlazeoUiWithFile(uiBaseUrl, uiConsumer) {
  const fileBase = normalizeBase(blazeoClientConfig.baseUrl ?? "");
  const fileConsumer = (blazeoClientConfig.consumer ?? "").trim();
  const baseUrl = normalizeBase(uiBaseUrl) || fileBase || undefined;
  const consumer = (uiConsumer ?? "").trim() || fileConsumer || undefined;
  return { baseUrl, consumer };
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

  const effective = useMemo(
    () => mergeBlazeoUiWithFile(baseUrlInput, consumerInput),
    [baseUrlInput, consumerInput]
  );

  /** Pass into `fetchCalendarDetails`, `createCalendarAsync`, etc. (explicit `baseUrl` for `ensureBlazeoHttpReady`). */
  const connectionOpts = useMemo(
    () => ({
      ...(effective.baseUrl ? { baseUrl: effective.baseUrl } : {}),
      ...(effective.consumer ? { consumer: effective.consumer } : {}),
    }),
    [effective.baseUrl, effective.consumer]
  );

  useEffect(() => {
    writeStored(STORAGE_BASE, baseUrlInput.trim());
  }, [baseUrlInput]);

  useEffect(() => {
    writeStored(STORAGE_CONSUMER, consumerInput.trim());
  }, [consumerInput]);

  /**
   * Sync global Blazeo `configure` before paint so `CalendarModel.get` /
   * `EventModel.*` static calls never see an empty `getConfig()` after the user
   * has set Base URL (including values restored from localStorage on first paint).
   */
  useLayoutEffect(() => {
    const { baseUrl, consumer } = mergeBlazeoUiWithFile(baseUrlInput, consumerInput);
    if (!baseUrl) return;
    pushBlazeoConnection({ baseUrl, consumer });
  }, [baseUrlInput, consumerInput]);

  const value = useMemo(
    () => ({
      baseUrlInput,
      consumerInput,
      setBaseUrlInput,
      setConsumerInput,
      effective,
      connectionOpts,
    }),
    [baseUrlInput, consumerInput, effective, connectionOpts]
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
