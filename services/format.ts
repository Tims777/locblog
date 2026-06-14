interface FormatArgs {
  dateOnly?: boolean;
  fallback?: string;
}

class FormattingService {
  constructor(
    private locale = globalThis.Deno?.env.get("LOCALE") ?? navigator.language,
  ) {}

  public format(x: unknown, args?: FormatArgs): string {
    switch (typeof x) {
      case "string":
        return x;
      case "number":
      case "bigint":
      case "boolean":
        return x.toString();
      case "object":
        if (x === null) return args?.fallback ?? "";
        return this.formatObject(x, args);
      case "undefined":
      default:
        return args?.fallback ?? "";
    }
  }

  public surround(x: string, prefix?: string, suffix?: string): string {
    return [prefix, x, suffix].filter((x) => x !== undefined).join("");
  }

  public formatObject(x: object, args?: FormatArgs): string {
    if (x instanceof Date) {
      const date = x.toLocaleDateString(this.locale);
      if (args?.dateOnly) {
        return date;
      } else {
        const time = x.toLocaleTimeString(this.locale);
        return `${date} ${time}`;
      }
    }
    return x.toString();
  }
}

const formatter = new FormattingService();
export default formatter;
