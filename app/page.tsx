"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import InlineEditable from "@/components/InlineEditable";
import { addList, setBoard, setBoardTitle } from "@/features/boardSlice";
import AddListForm from "@/components/forms/AddListForm";
import { useEffect, useRef, useState } from "react";
import ListColumn from "@/components/lists/ListColumn";
import "@/styles/main.scss";
import { loadBoard } from "@/services/storageService";

export default function BoardPage() {
  const board = useSelector((s: RootState) => s.board);
  const dispatch = useDispatch();
  const [toggleListForm, setToggleListForm] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = loadBoard();
    if (saved) {
      dispatch(setBoard(saved));
    }
  }, [dispatch]);
  return (
    <div className="board-page">
      <InlineEditable
        value={board.title || "board title"}
        onSave={(title) => dispatch(setBoardTitle(title))}
        className="board-title"
      />

      <div className="board-content flex gap-4 overflow-x-auto">
        {board.lists.map((list) => (
          <ListColumn key={list.id} list={list} />
        ))}

        {toggleListForm ? (
          <div ref={listRef}>
            <AddListForm
              onAdd={(title) => dispatch(addList(title))}
              setToggleListForm={setToggleListForm}
              toggleListForm={toggleListForm}
            />
          </div>
        ) : (
          <button className="btn add" onClick={() => setToggleListForm(true)}>
            + Add List
          </button>
        )}
      </div>
    </div>
  );
}
