import { ReactNode } from "react";
import { ListWithCards } from "types";
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
  triggerRefreshLists: () => void;
}

export const useRefreshList = create<RefreshList>((set) => ({
  refreshLists: false,
  triggerRefreshLists: () =>
    set((state) => ({ refreshLists: !state.refreshLists })),
}));

interface ListState {
  lists: ListWithCards[];
  setLists: (
    lists: ListWithCards[] | ((prev: ListWithCards[]) => ListWithCards[])
  ) => void;
}

export const useCreateListStore = create<ListState>((set) => ({
  lists: [],
  setLists: (lists) =>
    set((state) => ({
      lists: typeof lists === "function" ? lists(state.lists) : lists,
    })),
}));
