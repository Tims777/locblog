import { type Document } from "../schema/document.ts";
import PostCard from "./PostCard.tsx";

export interface DocumentOverviewProps {
  documents: Document[];
  page: number;
  pageCount?: number;
}

export default function DocumentOverview(props: DocumentOverviewProps) {
  const navigation = [];
  const navigationClasses = [
    "text-center",
    "m-2",
    "children:(mx-1,no-underline,hover:(underline,decoration-solid))",
  ].join(" ");
  if (props.page > 1) {
    navigation.push(
      <a href={`?page=${props.page - 1}`}>&larr;</a>,
    );
  }
  const pageCount = props.pageCount ?? 0;
  if (pageCount > 1) {
    for (let i = 1; i <= pageCount; i++) {
      navigation.push(
        <a href={`?page=${i}`} class={i == props.page ? "font-bold" : ""}>
          {i}
        </a>,
      );
    }
  }
  if (props.page < (props.pageCount ?? Infinity)) {
    navigation.push(
      <a href={`?page=${props.page + 1}`}>&rarr;</a>,
    );
  }
  return (
    <>
      <div class={navigationClasses}>
        {navigation}
      </div>
      <div class="not-prose">
        {props.documents.map((p) => (
          <PostCard
            title={p.title}
            image={p.thumbnail?.resource}
            summary={summarize(p.content)}
            href={p.path}
          />
        ))}
      </div>
      <div class={navigationClasses}>
        {navigation}
      </div>
    </>
  );
}

function summarize(content: string, maxWords = 50) {
  const paragraphs = content.split("\n").filter((l) =>
    l && !l.startsWith("#") && !l.startsWith(":")
  );
  let words = paragraphs.length ? paragraphs[0].split(" ") : [];
  if (words.length > maxWords) {
    words = words.slice(0, maxWords);
  }
  words.push("...");
  return words.join(" ");
}
