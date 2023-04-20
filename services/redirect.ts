class RedirectService {

    private redirects: [URLPattern, string][] = [];

    constructor(redirects: string | undefined = Deno.env.get("REDIRECTS")) {
        if (redirects) {
            for (const [from, to] of JSON.parse(redirects)) {
                this.redirects.push([new URLPattern(from), to]);
            }
        }
    }

    public for(url: string): Response | null {
        for (const [pattern, to] of this.redirects) {
            const result = pattern.exec(url);
            if (result) {
              const groups = result.pathname.groups;
              const target = to.replace(
                /\$([0-9]+)/,
                (_, index) => index in groups ? groups[index] : "",
              );
              return Response.redirect(target);
            }
        }
        return null;
    }
}

const redirect = new RedirectService();
export default redirect;