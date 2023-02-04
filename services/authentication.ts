class AuthenticationService {
  private adminCreds?: string;

  constructor() {
    this.adminCreds = Deno.env.get("ADMIN_CREDENTIALS");
    if (!this.adminCreds) {
      console.warn(
        "ADMIN_CREDENTIALS are not set, basic authorization will be unavailable.",
      );
    }
  }

  public validateHTTPAuthorization(auth: Request) {
    const authorizationString = auth.headers.get("authorization");
    const [type, credentials] = authorizationString?.split(" ") ?? [];
    if (type == "Basic" && this.adminCreds) {
      // const [user, password] = atob(credentials).split(":");
      return credentials == this.adminCreds;
    } else {
      return false;
    }
  }

  public response = {
    unauthorized: new Response(null, {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    }),
  };
}

const auth = new AuthenticationService();
export default auth;
