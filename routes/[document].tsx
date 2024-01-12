import { Head } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Mdast } from "preactify-markdown/types.d.ts";
import db from "../services/database.ts";
import md from "../services/markdown.ts";
import redirect from "../services/redirect.ts";
import type { ConfiguratorContext } from "../types.d.ts";
import { renderToString } from "preact-render-to-string";

export const config: RouteConfig = {
  routeOverride: "/:path(.*?)",
};

interface PreparedDocument {
  title?: string;
  style: string[];
  header?: Mdast;
  content: Mdast;
  footer?: Mdast;
  summary?: string;
}

async function parseAndConfigure(
  markdown: string | undefined,
  context: ConfiguratorContext,
) {
  if (!markdown) return undefined;
  const mdast = md.parse(markdown);
  await md.configure(mdast, context);
  return mdast;
}

export const handler: Handlers<PreparedDocument> = {
  async GET(req, ctx) {
    const path = ctx.params.path;
    const docs = await db.document.query({
      where: { path },
      limit: 1,
    });

    if (!docs.length) {
      return redirect.for(req.url) ?? ctx.renderNotFound();
    }

    const doc = docs[0];
    const title = doc.title;
    const summary = doc.summary;
    const style = doc.style?.classes ?? [];
    const parseContext = { req, ctx, doc };
    const content = (await parseAndConfigure(doc.content, parseContext))!;
    const header = await parseAndConfigure(doc.style?.header, parseContext);
    const footer = await parseAndConfigure(doc.style?.footer, parseContext);

    if (doc.type == "svg") {
      const svg = md.preactify(content)!;
      const headers = { "Content-Type": "image/svg+xml" };
      return new Response(renderToString(svg), { headers });
    }

    return ctx.render({
      title,
      summary,
      style,
      header,
      content,
      footer,
    });
  },
};

export default function DocumentPage(props: PageProps<PreparedDocument>) {
  const title = props.data.title ?? "LocBlog";
  const summary = props.data.summary ?? "A blog about travelling places.";

  const content = [];
  if (props.data.header) {
    content.push(<header>{md.preactify(props.data.header)}</header>);
  }
  content.push(<main>{md.preactify(props.data.content)}</main>);
  if (props.data.footer) {
    content.push(<footer>{md.preactify(props.data.footer)}</footer>);
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={summary} />
      </Head>
      <body class={props.data.style.join(" ")}>
        {content}
      </body>
    </>
  );
}
