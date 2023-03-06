import { type VNode } from "preact";

export default class TableBuilder {
  private cells: VNode<HTMLElement>[][] = [];

  constructor(private title?: string) {}

  public append(title: string, ...contents: string[]) {
    const row = [
      <th>{title}</th>,
      ...contents.map((c) => <td>{c}</td>),
    ];
    this.cells.push(row);
    return this;
  }

  public appendMany(title: string, ...contents: string[][]) {
    const rowCount = Math.max(...contents.map((c) => c?.length ?? 0));
    for (let i = 0; i < rowCount; i++) {
      const row = [
        <th>{i == 0 ? title : ""}</th>,
        ...contents.map((c) => <td>{c[i] ?? ""}</td>),
      ];
      this.cells.push(row);
    }
    return this;
  }

  public complete() {
    const colCount = Math.max(...this.cells.map((r) => r.length));
    const titleRow = this.title
      ? (
        <tr>
          <th colSpan={colCount}>{this.title}</th>
        </tr>
      )
      : <></>;
    const rows = [
      titleRow,
      ...this.cells.map((r) => <tr>{r}</tr>),
    ];
    return <table>{rows}</table>;
  }
}
