"use client";
import { useState, useRef } from "react";
import InlineEditable from "../InlineEditable";
import AddCardForm from "../forms/AddListItemForm";
import { useDispatch } from "react-redux";
import { updateListTitle, addCard, moveCard } from "@/features/boardSlice";
import { List } from "@/types";
import ListItem from "../ListItem";
import { ListActions } from "./ListAction";
import useClickOutside from "@/hooks/useClickOutside";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function ListColumn({ list }: { list: List }) {
  const [toggle, setToggle] = useState(false);
  const [toggleCardForm, setToggleCardForm] = useState(false);
  const dispatch = useDispatch();

  const listItemRef = useRef<HTMLDivElement>(null);
  const listActionRef = useRef<HTMLDivElement>(null);
  useClickOutside(listItemRef, () => setToggleCardForm(false));
  useClickOutside(listActionRef, () => setToggle(false));

  const sensors = useSensors(useSensor(PointerSensor));

  function handleCardDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const fromListId = active.data.current?.listId;
    const toListId = over.data.current?.listId;
    const cardId = active.id as string;
    const toIndex = over.data.current?.index ?? 0;

    if (fromListId && toListId) {
      dispatch(moveCard({ fromListId, toListId, cardId, toIndex }));
    }
  }

  return (
    <div className="list-item flex-shrink-0 w-80 bg-white p-4 rounded shadow">
      <div className="header flex justify-between items-center">
        <InlineEditable
          value={list.title}
          onSave={(t) => dispatch(updateListTitle({ listId: list.id, title: t }))}
          className="fw-700"
        />
        <button className="btn" onClick={() => { setToggle(!toggle); setToggleCardForm(false); }}>...</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCardDragEnd}>
        <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="cards-container flex flex-col gap-2">
            {list.cards.map((card, index) => (
              <ListItem key={card.id} card={card} listId={list.id} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {toggleCardForm ? (
        <div ref={listItemRef} onClick={e => e.stopPropagation()}>
          <AddCardForm
            onAdd={(title) => dispatch(addCard({ listId: list.id, title }))}
            setToggleCardForm={setToggleCardForm}
            toggleCardForm={toggleCardForm}
          />
        </div>
      ) : (
        <button className="btn add" onClick={e => { e.stopPropagation(); setToggleCardForm(true); setToggle(false); }}>
          + add card
        </button>
      )}

      {toggle && <div ref={listActionRef}><ListActions list={list} /></div>}
    </div>
  );
}