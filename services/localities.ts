import { Template } from "../types.d.ts";

function createTemplate(src: string): Template {
  const regex = /\$\{(.+?)\}/;
  const parts = src.split(regex);
  return (args: Record<string, string>) => {
    return parts
      .map((part, index) => index % 2 == 0 ? part : args[part])
      .join("");
  };
}

class Locality {
  constructor(
    public lat: number,
    public lon: number,
    public label?: string,
    public description?: string,
  ) {}
}

class WikidataLocalityQueryService {
  private getUrl: Template;

  constructor() {
    const queryUrl =
      "https://www.wikidata.org/w/api.php?action=query&generator=search&format=json&origin=*&prop=entityterms|coordinates&gsrsearch=${query}";
    this.getUrl = createTemplate(queryUrl!);
  }

  public async find(query: string): Promise<Locality[]> {
    const url = this.getUrl({ query });
    const response = await fetch(url);
    const result = await response.json();
    const pages: any[] = Object.values(result.query.pages);
    return pages
      .filter((l) => l.coordinates)
      .map((l) =>
        new Locality(
          l.coordinates[0].lat,
          l.coordinates[0].lon,
          l.entityterms.label[0],
          l.entityterms.description[0],
        )
      );
  }
}

const localities = new WikidataLocalityQueryService();
export default localities;
