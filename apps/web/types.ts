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
export enum ACTION {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum ENTITY_TYPE {
  BOARD = "BOARD",
  LIST = "LIST",
  CARD = "CARD",
}

export interface AuditLog {
  id: string;
  orgId: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  userImage: string;
  userName: string;
  createdAt: string; 
  updatedAt: string;
}
