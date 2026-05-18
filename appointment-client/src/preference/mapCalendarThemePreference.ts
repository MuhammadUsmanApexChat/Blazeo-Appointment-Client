export const CALENDAR_THEME_OPTION = "CalendarTheme";

export type CalendarThemePreferenceRow = {
  logoUrl: string;
  color: string;
  Name: typeof CALENDAR_THEME_OPTION;
  Enabled: boolean;
};

function pick<T>(obj: any, ...keys: string[]): T | undefined {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k] as T;
  }
  return undefined;
}

/**
 * Map calendar payload (`logoUrl` / `color` on root or under `theme`) → `CalendarTheme` preference JSON.
 */
export function mapCalendarThemeToPreferencePayload(calendar: any): CalendarThemePreferenceRow[] {
  const theme = calendar?.theme ?? calendar?.Theme;
  const logoUrl =
    pick<string>(calendar, "logoUrl", "LogoUrl") ??
    pick<string>(theme, "logoUrl", "LogoUrl") ??
    "";
  const color =
    pick<string>(calendar, "color", "Color") ??
    pick<string>(theme, "color", "Color") ??
    "";

  const logo = String(logoUrl).trim();
  const clr = String(color).trim();
  if (!logo && !clr) return [];

  return [
    {
      logoUrl: logo,
      color: clr,
      Name: CALENDAR_THEME_OPTION as CalendarThemePreferenceRow["Name"],
      Enabled: true,
    },
  ];
}

export function calendarPayloadHasTheme(calendar: any): boolean {
  return mapCalendarThemeToPreferencePayload(calendar).length > 0;
}
