export type LocaleParams = {
  "Common-dateFormatterWithoutTimeZone": {};
  "Common-dateFormatterWithTimeZone": {};
  "Common-date": {};
  "Common-day": {};
  "Common-days": {};
  "Common-genericError": {};
  "Common-hour": {};
  "Common-hours": {};
  "Common-miles": {};
  "Common-minute": {};
  "Common-minutes": {};
  "Common-month": {};
  "Common-months": {};
  "Common-more": {};
  "Common-networkError": {};
  "Common-ok": {};
  "Common-second": {};
  "Common-seconds": {};
  "Common-test": {};
  "Common-time": {};
  "Common-today": {};
  "Common-tomorrow": {};
  "Common-week": {};
  "Common-weeks": {};
  "Common-year": {};
  "Common-years": {};
  "Common-yesterday": {};
};

export type LocaleKey = keyof LocaleParams;

export type Locale = Record<LocaleKey, string> & {
  code: string;
};
