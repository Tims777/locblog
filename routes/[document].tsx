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

    ctx.state = {
      title,
      summary,
      style,
      header,
      content,
      footer,
    };

    return ctx.render();
  },
};

export default function DocumentPage(props: PageProps<void, PreparedDocument>) {
  const { header, content, footer, style } = props.state;
  const title = props.state.title ?? "LocBlog";
  const summary = props.state.summary ?? "A blog about travelling places.";

  const body = [];
  if (header) {
    body.push(<header>{md.preactify(header)}</header>);
  }
  body.push(<main>{md.preactify(content)}</main>);
  if (footer) {
    body.push(<footer>{md.preactify(footer)}</footer>);
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={summary} />
      </Head>
      <body class={style.join(" ")}>
        {body}
      </body>
    </>
  );
}
