interface FormatArgs {
  dateOnly?: boolean;
}

class FormattingService {
  constructor(
    private locale = Deno.env.get("LANG") ?? navigator.language,
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
        if (x === null) return "";
        return this.formatObject(x, args);
      case "undefined":
      default:
        return "";
    }
  }

  public surround(x: string, prefix?: string, suffix?: string): string {
    return [prefix, x, suffix].filter((x) => x !== undefined).join("");
  }

  // deno-lint-ignore ban-types
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
