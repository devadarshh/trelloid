import { ReactNode } from "react";
import { create } from "zustand";

interface Card {
  title: ReactNode;
  id: string;
  description: string;
}

interface CreateCardStore {
  title: string;
  description: string;
  cards: Card[];
  setTitle: (newTitle: string) => void;
  setDescription: (newDescription: string) => void;
  setCards: (newCards: Card[]) => void;
}

export const useCreateCard = create<CreateCardStore>((set) => ({
  title: "",
  description: "",
  cards: [],
  setTitle: (newTitle) => set({ title: newTitle }),
  setDescription: (newDescription) => set({ description: newDescription }),
  setCards: (newCards) => set({ cards: newCards }),
}));

interface RefreshCard {
  refreshCards: boolean;
  triggerRefreshCards: (newRefresh: boolean) => void;
}

export const useRefreshCards = create<RefreshCard>((set) => ({
  refreshCards: false,
  triggerRefreshCards: () =>
    set((state) => ({ refreshCards: !state.refreshCards })),
}));
