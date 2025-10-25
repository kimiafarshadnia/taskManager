"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import InlineEditable from "@/components/InlineEditable";
import { addList, reorderLists, setBoardTitle } from "@/features/boardSlice";
import AddListForm from "@/components/forms/AddListForm";
import { useRef, useState } from "react";
import ListColumn from "@/components/lists/ListColumn";
import "@/styles/main.scss";
import useClickOutside from "@/hooks/useClickOutside";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

export default function BoardPage() {
  const board = useSelector((s: RootState) => s.board);
  const dispatch = useDispatch();
  const [toggleListForm, setToggleListForm] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  useClickOutside(listRef, () => setToggleListForm(false));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    // جابجایی لیست‌ها
    const fromIndex = board.lists.findIndex((l) => l.id === active.id);
    const toIndex = board.lists.findIndex((l) => l.id === over.id);
    if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
      dispatch(reorderLists({ from: fromIndex, to: toIndex }));
    }
  }

  return (
    <div className="board-page">
      <h1>
        <InlineEditable
          value={board.title}
          onSave={(title) => dispatch(setBoardTitle(title))}
          className="board-title"
        />
      </h1>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={board.lists.map((l) => l.id)}
          strategy={horizontalListSortingStrategy}
        >
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
              <button
                className="btn add"
                onClick={() => setToggleListForm(true)}
              >
                + Add List
              </button>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}