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

  // deno-lint-ignore ban-types
  public formatObject(x: object): string {
    if (x instanceof Date) return x.toLocaleDateString(this.locale);
    else return x.toString();
  }
}

const formatter = new FormattingService();
export default formatter;
