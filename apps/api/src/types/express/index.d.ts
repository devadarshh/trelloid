import "express";

declare module "express-serve-static-core" {
  interface Request {
    auth: {
      userId: string;
      sessionId?: string;
      getToken?: () => Promise<string>;
    };
  }
}
export type ListWithCards = {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  cards: Card[];
};

// types/card.ts
export type Card = {
  id: string;
  title: string;
  order: number;
  description: string | null;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
};
