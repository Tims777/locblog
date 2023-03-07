import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <>
      <h1>404 Not Found</h1>
      <p>Sorry, the page {url.pathname} does not exist.</p>
    </>
  );
}
