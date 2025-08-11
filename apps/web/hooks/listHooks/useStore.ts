import { ReactNode } from "react";
import { create } from "zustand";

interface CreateList {
  title: string;
  id: string;
  name: string;
  setTitle: (newTitle: string) => void;
}

export const useCreateList = create<CreateList>((set) => ({
  title: "",
  id: "",
  name: "",
  setTitle: (newTitle) => set({ title: newTitle }),
}));

interface RefreshList {
  refreshLists: boolean;
  triggerRefreshLists: (newRefresh: boolean) => void;
}

export const useRefreshList = create<RefreshList>((set) => ({
  refreshLists: false,
  triggerRefreshLists: () =>
    set((state) => ({ refreshLists: !state.refreshLists })),
}));
interface List {
  title: ReactNode;
  id: string;
  name: string;
}

interface CreateListStore {
  title: string;
  id: string;
  lists: List[];
  setTitle: (newTitle: string) => void;
  setId: (newId: string) => void;
  setLists: (newLists: List[]) => void;
}

export const useCreateListStore = create<CreateListStore>((set) => ({
  title: "",
  id: "",
  lists: [],
  setTitle: (newTitle) => set({ title: newTitle }),
  setId: (newID) => set({ id: newID }),
  setLists: (newLists) => set({ lists: newLists }),
}));
