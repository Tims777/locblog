import { createTemplate } from "../helpers/string-helpers.ts";
import { Locality, Template } from "../types.d.ts";

class WikidataLocalityQueryService {
  private getUrl: Template;

  constructor() {
    const queryUrl =
      "https://www.wikidata.org/w/api.php?action=query&generator=search&format=json&origin=*&prop=entityterms|coordinates&gsrsearch=${query}";
    this.getUrl = createTemplate(queryUrl!);
  }

  public async find(query: string, signal?: AbortSignal): Promise<Locality[]> {
    const url = this.getUrl({ query });
    const response = await fetch(url, { signal });
    const result = await response.json();
    const pages: any[] = Object.values(result.query.pages);
    return pages
      .filter((l) => l.coordinates)
      .map((l) => ({
        latitude: l.coordinates[0].lat,
        longitude: l.coordinates[0].lon,
        label: l.entityterms.label[0],
        description: l.entityterms.description[0],
      }));
  }
}

const localities = new WikidataLocalityQueryService();
export default localities;
