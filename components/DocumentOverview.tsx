import { type Document } from "../schema/document.ts";
import Postcard from "./Postcard.tsx";

export interface DocumentOverviewProps {
  documents: Document[];
  page: number;
  pageCount?: number;
}

export default function DocumentOverview(props: DocumentOverviewProps) {
  const navigation = [];
  if (props.page != 0) {
    navigation.push(
      <a href={`?page=${props.page - 1}`}>&larr;</a>,
    );
  }
  if (props.page != props.pageCount) {
    navigation.push(
      <a href={`?page=${props.page + 1}`}>&rarr;</a>,
    );
  }
  return (
    <>
      <div class="not-prose">
        {props.documents.map((p) => (
          <Postcard
            title={p.title}
            image={p.thumbnail?.resource}
            href={p.path}
          />
        ))}
      </div>
      <div class="text-center">
        {navigation}
      </div>
    </>
  );
}
