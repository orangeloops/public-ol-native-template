export type LocaleParams = {
  "Common-date": {};
  "Common-dateFormatterWithoutTimeZone": {};
  "Common-dateFormatterWithTimeZone": {};
  "Common-day": {};
  "Common-days": {};
  "Common-error": {};
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
  "Common-retry": {};
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
  "Validation-emailInvalidError": {};
  "Validation-emptyFieldError": {};
};

export type LocaleKey = keyof LocaleParams;

export type Locale = Record<LocaleKey, string> & {
  code: string;
};
