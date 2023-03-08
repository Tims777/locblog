import { micromark } from "micromark";
import {
  gfm,
  gfmHtml,
  type HtmlOptions as GfmOptions,
} from "micromark-extension-gfm";
import {
  directive,
  directiveHtml,
  type HtmlOptions as DirectiveOptions,
} from "micromark-extension-directive";
import { renderToString } from "preact-render-to-string";
import galleries from "./galleries.ts";

const gfmOptions: GfmOptions = {
  clobberPrefix: "",
};

const directiveOptions: DirectiveOptions = {
  gallery: function (this, directive) {
    if (!directive.label) return false;
    this.tag(renderToString(galleries.getByName(directive.label)));
    return true;
  },
};

class MarkdownService {
  public render(markdown: string) {
    const options = {
      extensions: [gfm(), directive()],
      htmlExtensions: [gfmHtml(gfmOptions), directiveHtml(directiveOptions)],
    };
    return micromark(markdown, options);
  }
}

const md = new MarkdownService();
export default md;
