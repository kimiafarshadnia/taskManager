import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Board } from "@/types";
import { v4 as uuid } from "uuid";
import { arrayMove } from "@/utils/dnd";

const STORAGE_KEY = "trello";

const loadFromLocalStorage = (): Board | null => {
  if (typeof window === "undefined") return null;
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? (JSON.parse(s) as Board) : null;
  } catch {
    return null;
  }
};
const saveToLocalStorage = (board: Board) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
};

const demoBoard: Board = {
  id: "",
  title: "",
  lists: [],
};

const initialState: Board = loadFromLocalStorage() ?? demoBoard;

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoardTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
      state.updatedAt = new Date().toISOString();
      saveToLocalStorage(state);
    },

    addList(state, action: PayloadAction<string>) {
      state.lists.push({
        id: uuid(),
        title: action.payload,
        cards: [],
        createdAt: new Date().toISOString(),
      });
      saveToLocalStorage(state);
    },

    updateListTitle(
      state,
      action: PayloadAction<{ listId: string; title: string }>
    ) {
      const l = state.lists.find((x) => x.id === action.payload.listId);
      if (l) l.title = action.payload.title;
      saveToLocalStorage(state);
    },

    deleteList(state, action: PayloadAction<string>) {
      state.lists = state.lists.filter((l) => l.id !== action.payload);
      saveToLocalStorage(state);
    },

    reorderLists(state, action: PayloadAction<{ from: number; to: number }>) {
      state.lists = arrayMove(
        state.lists,
        action.payload.from,
        action.payload.to
      );
      saveToLocalStorage(state);
    },

    addCard(state, action: PayloadAction<{ listId: string; title: string }>) {
      const l = state.lists.find((x) => x.id === action.payload.listId);
      if (l) {
        l.cards.push({
          id: uuid(),
          title: action.payload.title,
          description: "",
          comments: [],
          createdAt: new Date().toISOString(),
        });
        saveToLocalStorage(state);
      }
    },
    deleteAllCards(state, action: PayloadAction<{ listId: string }>) {
      const list = state.lists.find((x) => x.id === action.payload.listId);
      if (list) {
        list.cards = [];
        saveToLocalStorage(state);
      }
    },

    addComment(
      state,
      action: PayloadAction<{ listId: string; cardId: string; text: string }>
    ) {
      const l = state.lists.find((x) => x.id === action.payload.listId);
      const c = l?.cards.find((x) => x.id === action.payload.cardId);
      if (c) {
        c.comments.push({
          id: uuid(),
          text: action.payload.text,
          createdAt: new Date().toISOString(),
        });
        saveToLocalStorage(state);
      }
    },
    moveCard(
      state,
      action: PayloadAction<{
        fromListId: string;
        toListId: string;
        cardId: string;
        toIndex: number;
      }>
    ) {
      const { fromListId, toListId, cardId, toIndex } = action.payload;
      if (fromListId === toListId) {
        const list = state.lists.find((l) => l.id === fromListId);
        if (!list) return;
        const fromIndex = list.cards.findIndex((c) => c.id === cardId);
        if (fromIndex === -1) return;
        list.cards = arrayMove(list.cards, fromIndex, toIndex);
      } else {
        const fromList = state.lists.find((l) => l.id === fromListId);
        const toList = state.lists.find((l) => l.id === toListId);
        if (!fromList || !toList) return;
        const card = fromList.cards.find((c) => c.id === cardId);
        if (!card) return;
        fromList.cards = fromList.cards.filter((c) => c.id !== cardId);
        toList.cards.splice(toIndex, 0, card);
      }
      saveToLocalStorage(state);
    },
  },
});

export const {
  setBoardTitle,
  addList,
  updateListTitle,
  deleteList,
  reorderLists,
  addCard,
  deleteAllCards,
  addComment,
  moveCard,
} = boardSlice.actions;

export default boardSlice.reducer;
