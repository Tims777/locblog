import { type Document } from "../schema/document.ts";
import formatter from "../services/format.ts";
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
            summary={p.summary}
            posted={formatter.format(p.published, { dateOnly: true })}
            author={p.author?.name}
            href={p.path}
            address={p.places?.map((p) => p.name)}
          />
        ))}
      </div>
      <div class={navigationClasses}>
        {navigation}
      </div>
    </>
  );
}
