import { getSnapshot, isStateTreeNode } from "mobx-state-tree";

const DAY_NAMES = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;

function pick<T = unknown>(row: any, ...keys: string[]): T | undefined {
  if (row == null || typeof row !== "object") return undefined;
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null) return row[k] as T;
  }
  return undefined;
}

function toPlain<T>(value: T): T {
  if (value == null) return value;
  if (isStateTreeNode(value)) return getSnapshot(value) as T;
  if (Array.isArray(value)) return value.map((x) => toPlain(x)) as T;
  return value;
}

function normParticipantKey(v: string | number | null | undefined): string {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

function coerceMemberId(v: unknown): number | string | null {
  if (v == null || v === "") return null;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const t = v.trim();
    if (/^\d+$/.test(t)) return Number(t);
    return t;
  }
  return null;
}

/**
 * Canonical member id used in both `members[].id` and `openingHours[].member`.
 */
function resolveParticipantMemberId(calPart: Record<string, any>): number | string {
  const n = pick<number | null>(calPart, "id", "Id");
  if (n != null && typeof n === "number" && !Number.isNaN(n)) return n;
  const sid = pick<string>(calPart, "participantId", "ParticipantId", "participant_id");
  if (sid != null && String(sid).trim() !== "") {
    const t = String(sid).trim();
    if (/^\d+$/.test(t)) return Number(t);
    return t;
  }
  return "";
}

export interface UnifiedCalendarMember {
  id: number | string;
  name: string;
  email: string | null;
  /** When API exposes status; otherwise derived from participant info flags. */
  status: number | null;
  /** Full row from Participants/GetInfo (plain object). */
  participantInfo?: Record<string, unknown> | null;
  __typename?: string;
}

export interface UnifiedParticipantWithHours extends UnifiedCalendarMember {
  openingHours: UnifiedOpeningHourRow[];
}

export interface UnifiedOpeningHourRow {
  id?: number | string;
  createdOn?: string;
  modifiedOn?: string;
  member: number | string;
  openingHourId?: string;
  calendarId?: string;
  participantId?: string;
  days: string[];
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  off: boolean;
  __typename?: string;
}

function dayOrderIndex(d: string): number {
  const u = d.toUpperCase();
  const i = DAY_NAMES.indexOf(u as (typeof DAY_NAMES)[number]);
  return i >= 0 ? i : 999;
}

/** Merge rows that share participant + time span + off into one row with combined `days`. */
function mergeOpeningHoursBySlot(rows: UnifiedOpeningHourRow[]) {
  const map = new Map<string, UnifiedOpeningHourRow>();
  for (const r of rows) {
    const key = [r.member, r.startHour, r.startMinute, r.endHour, r.endMinute, r.off].join("|");
    const existing = map.get(key);
    if (!existing) {
      map.set(key, { ...r, days: [...r.days] });
    } else {
      const set = new Set([...existing.days, ...r.days]);
      existing.days = Array.from(set).sort((a, b) => dayOrderIndex(a) - dayOrderIndex(b));
    }
  }
  rows.length = 0;
  rows.push(...map.values());
}

export type UnifiedCalendarView = Record<string, unknown> & {
  members: UnifiedCalendarMember[];
  openingHours: UnifiedOpeningHourRow[];
  participants?: UnifiedParticipantWithHours[];
};

function normalizeDaysFromRow(row: Record<string, any>): string[] {
  const rawDays = pick<any>(row, "days", "Days");
  if (Array.isArray(rawDays)) {
    return rawDays.map((d) => String(d).trim().toUpperCase()).filter(Boolean);
  }
  const dayNum = pick<number>(row, "day", "Day");
  if (dayNum != null && typeof dayNum === "number" && dayNum >= 0 && dayNum <= 6) {
    return [DAY_NAMES[dayNum]];
  }
  const dayStr = pick<string>(row, "dayName", "DayName", "dayOfWeek", "DayOfWeek");
  if (dayStr != null && String(dayStr).trim() !== "") {
    return [String(dayStr).trim().toUpperCase()];
  }
  return [];
}

function resolveOpeningHourMemberId(
  row: Record<string, any>,
  byParticipantKey: Map<string, number | string>,
  byCalendarParticipantKey: Map<string, number | string>
): number | string | null {
  const calPartHook = pick(
    row,
    "calendarParticipantId",
    "CalendarParticipantId",
    "calendarparticipant_id"
  );
  if (calPartHook != null && String(calPartHook).trim() !== "") {
    const ck = normParticipantKey(String(calPartHook));
    if (byCalendarParticipantKey.has(ck)) return byCalendarParticipantKey.get(ck)!;
  }
  const pid = pick(row, "participantId", "ParticipantId", "participant_id");
  if (pid != null && String(pid).trim() !== "") {
    const k = normParticipantKey(String(pid));
    if (byParticipantKey.has(k)) return byParticipantKey.get(k)!;
    return coerceMemberId(pid);
  }
  const member = pick(row, "member", "Member");
  if (member != null && typeof member === "object") {
    const mid =
      coerceMemberId(pick(member, "id", "Id")) ??
      coerceMemberId(pick(member, "participantId", "ParticipantId", "participant_id"));
    if (mid != null) return mid;
  }
  if (member != null && (typeof member === "number" || typeof member === "string")) {
    const m = coerceMemberId(member);
    if (m != null) {
      const k = normParticipantKey(m);
      if (byParticipantKey.has(k)) return byParticipantKey.get(k)!;
    }
    return m;
  }
  return null;
}

function deriveMemberStatus(calPart: Record<string, any>, info: Record<string, any> | undefined): number | null {
  const direct =
    pick<number>(calPart, "status", "Status") ?? pick<number>(info ?? {}, "status", "Status");
  if (direct != null && typeof direct === "number" && !Number.isNaN(direct)) return direct;
  const approved =
    Boolean(pick<boolean>(calPart, "isApproved", "IsApproved", "is_approved")) ||
    Boolean(pick<boolean>(info ?? {}, "isApproved", "IsApproved", "is_approved"));
  if (approved) return approved ? 1 : 0;
  return null;
}

/**
 * Build a consumer-friendly `{ id, name, members, openingHours }` shape where
 * `openingHours[].member` references `members[].id`.
 */
export function buildUnifiedCalendarView(
  calendarSnapshot: Record<string, any> | null,
  openingHoursRows: any[],
  participants: any[] | null | undefined,
  participantsInfo: any[] | null | undefined
): UnifiedCalendarView | null {
  if (calendarSnapshot == null || typeof calendarSnapshot !== "object") return null;

  const calSnap = toPlain(calendarSnapshot) as Record<string, any>;
  const partsPlain = participants != null ? participants.map((p) => toPlain(p) as Record<string, any>) : [];
  const infoPlain =
    participantsInfo != null ? participantsInfo.map((p) => toPlain(p) as Record<string, any>) : [];

  const infoByPid = new Map<string, Record<string, any>>();
  for (const inf of infoPlain) {
    const pid = inf?.participantId ?? inf?.ParticipantId ?? inf?.participant_id;
    if (pid != null && String(pid).trim() !== "") {
      infoByPid.set(normParticipantKey(String(pid)), inf);
    }
  }

  const byParticipantKey = new Map<string, number | string>();
  const byCalendarParticipantKey = new Map<string, number | string>();
  const members: UnifiedCalendarMember[] = [];

  if (partsPlain.length > 0) {
    for (const cp of partsPlain) {
      const memberId = resolveParticipantMemberId(cp);
      const pidStr = pick<string>(cp, "participantId", "ParticipantId", "participant_id") ?? "";
      if (memberId === "" && (!pidStr || pidStr.trim() === "")) continue;

      const ik = normParticipantKey(pidStr || String(memberId));
      const inf = ik ? infoByPid.get(ik) : undefined;
      const participantInfoPlain = inf != null ? ({ ...toPlain(inf) } as Record<string, unknown>) : null;

      const alias = inf?.alias ?? inf?.Alias;
      const name =
        typeof alias === "string" && alias.trim() !== ""
          ? alias.trim()
          : pidStr && pidStr.trim() !== ""
            ? pidStr.trim()
            : String(memberId);
      const email = (inf?.email ?? inf?.Email ?? null) as string | null;
      const id = memberId === "" ? coerceMemberId(pidStr) ?? pidStr : memberId;

      const calPartPk = pick<string | number>(cp, "calendarParticipantId", "CalendarParticipantId", "calendarparticipant_id");
      const calPartKey = calPartPk != null ? normParticipantKey(String(calPartPk)) : "";
      if (calPartKey) byCalendarParticipantKey.set(calPartKey, id);

      const keyParticipant = ik || normParticipantKey(String(id));
      if (keyParticipant) {
        byParticipantKey.set(keyParticipant, id);
        byParticipantKey.set(normParticipantKey(String(id)), id);
      }

      members.push({
        id,
        name,
        email: email ?? null,
        status: deriveMemberStatus(cp, inf),
        participantInfo: participantInfoPlain,
      });
    }
  } else if (infoPlain.length > 0) {
    for (const inf of infoPlain) {
      const pid = inf?.participantId ?? inf?.ParticipantId ?? inf?.participant_id;
      if (pid == null || String(pid).trim() === "") continue;
      const id = coerceMemberId(pid) ?? String(pid).trim();
      const ik = normParticipantKey(String(pid));
      const participantInfoPlain = { ...toPlain(inf) } as Record<string, unknown>;

      if (ik) byParticipantKey.set(ik, id);
      byParticipantKey.set(normParticipantKey(id), id);
      const alias = inf.alias ?? inf.Alias ?? "";
      const name = typeof alias === "string" && alias.trim() !== "" ? alias.trim() : String(pid);
      const email = (inf.email ?? inf.Email ?? null) as string | null;
      members.push({
        id,
        name,
        email: email ?? null,
        status: deriveMemberStatus({}, inf),
        participantInfo: participantInfoPlain,
        __typename: "Member",
      });
    }
  }

  const rawRows = Array.isArray(openingHoursRows) ? openingHoursRows : [];
  const openingHours: UnifiedOpeningHourRow[] = [];

  for (const raw of rawRows) {
    const row = toPlain(raw) as Record<string, any>;
    let memberId = resolveOpeningHourMemberId(row, byParticipantKey, byCalendarParticipantKey);
    if (memberId == null) {
      const m = pick(row, "member", "Member");
      memberId = typeof m === "number" || typeof m === "string" ? coerceMemberId(m) : null;
    }
    if (memberId == null) continue;

    const days = normalizeDaysFromRow(row);
    const startHour = Number(pick(row, "startHour", "StartHour", "start_hour") ?? 0) || 0;
    const startMinute = Number(pick(row, "startMinute", "StartMinute", "start_minute") ?? 0) || 0;
    const endHour = Number(pick(row, "endHour", "EndHour", "end_hour") ?? 0) || 0;
    const endMinute = Number(pick(row, "endMinute", "EndMinute", "end_minute") ?? 0) || 0;
    const off = Boolean(pick(row, "off", "Off"));

    openingHours.push({
      id: pick(row, "id", "Id") ?? 0,
      createdOn: pick(row, "createdOn", "CreatedOn", "created_on") ?? "0001-01-01T00:00:00.000Z",
      modifiedOn: pick(row, "modifiedOn", "ModifiedOn", "modified_on") ?? "0001-01-01T00:00:00.000Z",
      member: memberId,
      openingHourId: pick(row, "openingHourId", "OpeningHourId", "opening_hour_id") ?? "",
      calendarId: pick(row, "calendarId", "CalendarId", "calendar_id") ?? "",
      participantId: pick(row, "participantId", "ParticipantId", "participant_id") ?? "",
      days,
      startHour,
      startMinute,
      endHour,
      endMinute,
      off,
      __typename: "OpeningHour",
    });
  }

  mergeOpeningHoursBySlot(openingHours);

  const view = {
    ...calSnap,
    members,
    openingHours,
    participants: buildNestedParticipants(members, openingHours),
    __typename: "Calendar",
  } as UnifiedCalendarView;

  return view;
}

/**
 * Groups opening hours into their respective participant objects.
 */
function buildNestedParticipants(
  members: UnifiedCalendarMember[],
  openingHours: UnifiedOpeningHourRow[]
): UnifiedParticipantWithHours[] {
  const nested: UnifiedParticipantWithHours[] = [];
  members.forEach((m) => {
    const hoursForThisMember = openingHours.filter((oh) => {
      const mid = String(oh.member).trim().toLowerCase();
      const pid = String(m.id).trim().toLowerCase();
      return mid === pid;
    });
    // Remove the 'member' field from the nested opening hours as it's redundant.
    const nestedHours = hoursForThisMember.map(({ member, ...rest }) => ({
      ...rest,
      __typename: "OpeningHour"
    }));
    nested.push({
      ...m,
      openingHours: nestedHours,
      __typename: "Member",
    } as UnifiedParticipantWithHours);
  });
  return nested;
}
