import { type Document } from "../schema/document.ts";

export interface DocumentOverviewProps {
  documents: Document[];
}

export default function DocumentOverview(props: DocumentOverviewProps) {
  return <ul>{props.documents.map((p) => <li><a href={p.path}>{p.title}</a></li>)}</ul>;
}
