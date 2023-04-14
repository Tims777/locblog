import { Head } from "$fresh/runtime.ts";
import { RouteConfig } from "$fresh/server.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Mdast } from "preactify-markdown/types.d.ts";
import db from "../services/database.ts";
import md from "../services/markdown.ts";

export const config: RouteConfig = {
  routeOverride: "/:path(.*?)",
};

interface PreparedDocument {
  title?: string;
  header?: Mdast;
  content: Mdast;
}

async function parseAndConfigure(markdown: string) {
  const mdast = md.parse(markdown);
  await md.configure(mdast);
  return mdast;
}

export const handler: Handlers<PreparedDocument> = {
  async GET(_, ctx) {
    const path = ctx.params.path;
    const docs = await db.document.query({
      where: { path },
      limit: 1,
    });

    if (!docs.length) {
      return ctx.renderNotFound();
    }

    const doc = docs[0];
    const content = await parseAndConfigure(doc.content);
    const header = doc.header ? await parseAndConfigure(doc.header) : undefined;

    return ctx.render({
      content,
      header,
    });
  },
};

export default function DocumentPage(props: PageProps<PreparedDocument>) {
  const classList = ["prose", "prose-lg", "max-w-2xl", "mx-auto", "p-2"];
  const title = props.data.title ?? "LocBlog";

  const body = [];
  if (props.data.header) {
    body.push(<header>{md.preactify(props.data.header)}</header>);
  }
  body.push(<main>{md.preactify(props.data.content)}</main>);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <body class={classList.join(" ")}>
        {body}
      </body>
    </>
  );
}
