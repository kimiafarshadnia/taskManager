"use client"
import { useEffect, useState, useCallback } from 'react';
import { Board, List, Card } from '@/types';
import { loadBoard, saveBoard } from '@/services/storageService';
import { v4 as uuid } from 'uuid';

const demoBoard: Board = {
  id: 'board-1',
  title: 'Demo Board',
  lists: [
    {
      id: 'list-1',
      title: 'To do',
      createdAt: new Date().toISOString(),
      cards: [
        { id: 'card-1', title: 'Example task', comments: [], createdAt: new Date().toISOString() }
      ]
    },
    {
      id: 'list-2',
      title: 'Doing',
      createdAt: new Date().toISOString(),
      cards: []
    }
  ],
};

export const useBoard = () => {
  const [board, setBoard] = useState<Board>(() => loadBoard() ?? demoBoard);

  useEffect(() => {
    saveBoard(board);
  }, [board]);

  const setTitle = useCallback((title: string) => {
    setBoard(prev => ({ ...prev, title, updatedAt: new Date().toISOString() }));
  }, []);

  const addList = useCallback((title: string) => {
    const newList: List = { id: uuid(), title, cards: [], createdAt: new Date().toISOString() };
    setBoard(prev => ({ ...prev, lists: [...prev.lists, newList], updatedAt: new Date().toISOString() }));
  }, []);

  const updateListTitle = useCallback((listId: string, title: string) => {
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, title } : l),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const removeList = useCallback((listId: string) => {
    setBoard(prev => ({ ...prev, lists: prev.lists.filter(l => l.id !== listId), updatedAt: new Date().toISOString() }));
  }, []);

  const addCard = useCallback((listId: string, title: string) => {
    const newCard: Card = { id: uuid(), title, comments: [], createdAt: new Date().toISOString() };
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? { ...l, cards: [...l.cards, newCard] } : l),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  const moveCard = useCallback((fromListId: string, toListId: string, cardId: string, toIndex: number) => {
    setBoard(prev => {
      let movingCard: Card | null = null;
      const listsAfterRemoval = prev.lists.map(l => {
        if (l.id === fromListId) {
          const filtered = l.cards.filter(c => {
            if (c.id === cardId) { movingCard = c; return false; }
            return true;
          });
          return { ...l, cards: filtered };
        }
        return l;
      });

      const listsAfterInsert = listsAfterRemoval.map(l => {
        if (l.id === toListId && movingCard) {
          const newCards = [...l.cards];
          newCards.splice(toIndex, 0, movingCard);
          return { ...l, cards: newCards };
        }
        return l;
      });

      return { ...prev, lists: listsAfterInsert, updatedAt: new Date().toISOString() };
    });
  }, []);

  const addComment = useCallback((listId: string, cardId: string, text: string) => {
    const comment = { id: uuid(), text, createdAt: new Date().toISOString() };
    setBoard(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === listId ? {
        ...l,
        cards: l.cards.map(c => c.id === cardId ? { ...c, comments: [...c.comments, comment] } : c)
      } : l),
      updatedAt: new Date().toISOString()
    }));
  }, []);

  return {
    board,
    setTitle,
    addList,
    updateListTitle,
    removeList,
    addCard,
    moveCard,
    addComment,
    setBoard
  };
};