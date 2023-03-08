import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Document } from "../../schema/document.ts";
import db from "../../services/database.ts";
import md from "../../services/markdown.ts";

export const handler: Handlers<Document> = {
  async GET(req, ctx) {
    const doc = await db.document.query({
      where: { locator: ctx.params.locator },
      limit: 1,
    });
    if (doc.length) {
      return ctx.render(doc[0]);
    } else {
      return ctx.renderNotFound();
    }
  },
};

export default function PostPage(props: PageProps<Document>) {
  const pageContent = { __html: md.render(props.data.content) };
  return (
    <>
      <Head>
        <title>LocBlog</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>
      <main class="markdown-body" dangerouslySetInnerHTML={pageContent} />
    </>
  );
}
