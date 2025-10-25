import { Board } from '@/types';

const STORAGE_KEY = 'trello_clone_board';

export const loadBoard = (): Board | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Board : null;
  } catch (e) {
    console.error('loadBoard error', e);
    return null;
  }
};

export const saveBoard = (board: Board) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (e) {
    console.error('saveBoard error', e);
  }
};

export const clearBoard = () => localStorage.removeItem(STORAGE_KEY);