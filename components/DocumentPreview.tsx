import type { Document as DocumentPreviewProps } from "../schema/document.ts";

export default function DocumentPreviewProps(props: DocumentPreviewProps) {
  return (
    <a
      href={props.path}
      class="block relative mb-4 shadow-lg shadow-gray-500 hover:rotate-1 transition min-h-[3rem] bg-gray-200"
    >
      <img src={props.thumbnail} />
      <div class="absolute bottom-0 w-full h-12 text-center">
        <h2 class="text-lg p-2 bg-gray-200 text-black font-mono bg-opacity-90">
          {props.title}
        </h2>
      </div>
    </a>
  );
}

function summarize(content: string) {
  const paragraphs = content.split("\n").filter((l) =>
    l && !l.startsWith("#") && !l.startsWith(":")
  );
  let words = paragraphs.length ? paragraphs[0].split(" ") : [];
  const maxWords = 42;
  if (words.length > maxWords) {
    words = words.slice(0, maxWords);
    words.push("...");
  }
  return words.join(" ");
}
