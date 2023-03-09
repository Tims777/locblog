import PreactMarkdown from "preact-markdown";
import remarkDirective from "remark-directive";
import remarkDirectiveRehype from "remark-directive-rehype";
import Gallery from "../islands/Gallery.tsx";

class MarkdownService {
  private components = {
    gallery: Gallery,
  };
  public render(markdown: string) {
    return PreactMarkdown({
      children: markdown,
      remarkPlugins: [remarkDirective, remarkDirectiveRehype],
      // deno-lint-ignore no-explicit-any
      components: this.components as any,
    });
  }
}

const md = new MarkdownService();
export default md;
