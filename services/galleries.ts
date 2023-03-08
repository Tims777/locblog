import Gallery from "../components/Gallery.tsx";

class GalleryService {
  public getByName(name: string) {
    return Gallery({
      name,
    });
  }
}

const galleries = new GalleryService();
export default galleries;
