
export interface Card {
  id: string;
  title: string;
  description?: string;
  order: number;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  order: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListWithCards extends List {
  cards: Card[];
}

export interface CardWithList extends Card {
  list: List;
}
