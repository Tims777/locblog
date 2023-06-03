class FormattingService {
  constructor(
    private locale = Deno.env.get("LANG") ?? navigator.language,
  ) {}

  public format(x: unknown): string {
    switch (typeof x) {
      case "string":
        return x;
      case "number":
      case "bigint":
      case "boolean":
        return x.toString();
      case "object":
        if (x === null) return "";
        return this.formatObject(x);
      case "undefined":
      default:
        return "";
    }
  }

  public surround(x: string, prefix?: string, suffix?: string): string {
    return [prefix, x, suffix].filter((x) => x !== undefined).join("");
  }

  // deno-lint-ignore ban-types
  public formatObject(x: object): string {
    if (x instanceof Date) {
      const date = x.toLocaleDateString(this.locale);
      if (
        x.getHours() == 12 &&
        x.getMinutes() == 0 &&
        x.getSeconds() == 0 &&
        x.getMilliseconds() == 0
      ) {
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
