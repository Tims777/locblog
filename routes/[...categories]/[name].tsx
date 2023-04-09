import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Mdast } from "preactify-markdown/types.d.ts";
import db from "../../services/database.ts";
import md from "../../services/markdown.ts";

const notEmpty = (x: string) => x.trim() !== "";

interface PreparedDocument {
  markdown: Mdast;
  fullscreen?: boolean;
}

export const handler: Handlers<PreparedDocument> = {
  async GET(_, ctx) {
    const path = [ctx.params.categories, ctx.params.name]
      .filter(notEmpty)
      .join("/");
    const doc = await db.document.query({
      where: { path },
      limit: 1,
    });
    if (doc.length) {
      const markdown = md.parse(doc[0].content);
      await md.configure(markdown);
      return ctx.render({
        markdown,
        fullscreen: doc[0].fullscreen,
      });
    } else {
      return ctx.renderNotFound();
    }
  },
};

export default function DocumentPage(props: PageProps<PreparedDocument>) {
  const classList = ["prose", "prose-lg"];
  if (props.data.fullscreen) {
    classList.push("max-w-none", "w-screen", "h-screen");
  } else {
    classList.push("max-w-2xl", "mx-auto", "p-2");
  }

  return (
    <>
      <Head>
        <title>LocBlog</title>
      </Head>
      <main class={classList.join(" ")}>
        {md.preactify(props.data.markdown)}
      </main>
    </>
  );
}
