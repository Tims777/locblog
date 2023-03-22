import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { galleryContentClass } from "../../../islands/Gallery.tsx";
import LightBox from "../../../islands/LightBox.tsx";
import { type Document } from "../../../schema/document.ts";
import db from "../../../services/database.ts";
import md from "../../../services/markdown.ts";

const notEmpty = (x: string) => x.trim() !== "";

export const handler: Handlers<Document> = {
  async GET(_, ctx) {
    const path = [ctx.params.categories, ctx.params.name]
      .filter(notEmpty)
      .join("/");
    const doc = await db.document.query({
      where: { path },
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
  return (
    <>
      <Head>
        <title>LocBlog</title>
      </Head>
      <main class="prose prose-lg mx-auto max-w-2xl p-2">
        {md.render(props.data.content)}
      </main>
      <LightBox
        gallerySelector="main"
        contentSelector={`.${galleryContentClass}`}
      />
    </>
  );
}
