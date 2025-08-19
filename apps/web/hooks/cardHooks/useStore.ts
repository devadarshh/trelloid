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
  triggerRefreshCards: () => void;
}

export const useRefreshCards = create<RefreshCard>((set) => ({
  refreshCards: false,
  triggerRefreshCards: () =>
    set((state) => ({ refreshCards: !state.refreshCards })),
}));

type CardModalStore = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
