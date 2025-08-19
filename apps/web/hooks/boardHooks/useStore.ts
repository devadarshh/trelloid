import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface CreateBoardStore {
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

export const useCreateBoardStore = create<CreateBoardStore>((set) => ({
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

interface Board {
  id: string;
  title: string;
  imageThumbUrl?: string;
  imageFullUrl?: string;
  organizationId: string;
}

interface BoardStore {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  currentBoard: Board | null;
  setCurrentBoard: (board: Board) => void;
}

export const useGetBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      boards: [],
      setBoards: (boards) => set({ boards }),
      currentBoard: null,
      setCurrentBoard: (board) => set({ currentBoard: board }),
    }),
    {
      name: "board-storage",
      partialize: (state) => ({
        boards: state.boards,
        currentBoard: state.currentBoard,
      }),
    }
  )
);

interface BoardId {
  BoardId: string;
  setBoardId: (newBoardId: string) => void;
}

export const useBoardIdStore = create<BoardId>((set) => ({
  BoardId: "",
  setBoardId: (newBoardId) => set({ BoardId: newBoardId }),
}));

type RefreshBoardState = {
  shouldRefresh: boolean;
  triggerRefreshBoards: () => void;
  resetRefresh: () => void;
};

export const useRefreshBoard = create<RefreshBoardState>((set) => ({
  shouldRefresh: false,
  triggerRefreshBoards: () => set({ shouldRefresh: true }),
  resetRefresh: () => set({ shouldRefresh: false }),
}));
