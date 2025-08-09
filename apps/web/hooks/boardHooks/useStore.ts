import { create } from "zustand";

interface LoadingStore {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}
export const useLoadingStore = create<LoadingStore>((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));

interface Image {
  id: string;
  urls: {
    thumb: string;
    [key: string]: string;
  };
  links: {
    html: string;
  };
  user: {
    name: string;
  };
}
interface ImageStore {
  images: Image[];
  setImages: (imgs: Image[]) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
  images: [],
  setImages: (imgs) => set({ images: imgs }),
}));

interface BoardStore {
  title: string;
  imageId: string;
  imageThumbUrl: string;
  imageFullUrl: string;
  imageLinkHTML: string;

  setTitle: (newTitle: string) => void;
  setImageId: (newId: string) => void;
  setImageThumbUrl: (url: string) => void;
  setImageFullUrl: (url: string) => void;
  setImageLinkHTML: (link: string) => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  title: "",
  imageId: "",
  imageThumbUrl: "",
  imageFullUrl: "",
  imageLinkHTML: "",

  setTitle: (newTitle) => set({ title: newTitle }),
  setImageId: (newId) => set({ imageId: newId }),
  setImageThumbUrl: (url) => set({ imageThumbUrl: url }),
  setImageFullUrl: (url) => set({ imageFullUrl: url }),
  setImageLinkHTML: (link) => set({ imageLinkHTML: link }),
}));
