export interface Comment {
  id: string;
  text: string;
  createdAt: string;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  comments: Comment[];
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
  createdAt: string;
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
  updatedAt?: string;
}
