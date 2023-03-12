const jsonHeaders = { "content-type": "application/json" };

// deno-lint-ignore no-explicit-any
export function createJsonResponse(content: any) {
  return new Response(
    JSON.stringify(content),
    { headers: jsonHeaders },
  );
}

export function createErrorResponse(status: number, message?: string) {
  return new Response(message, { status });
}
