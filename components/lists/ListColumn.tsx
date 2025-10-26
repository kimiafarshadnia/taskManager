"use client";
import { useState, useRef } from "react";
import InlineEditable from "../InlineEditable";
import AddCardForm from "../forms/AddListItemForm";
import { useDispatch } from "react-redux";
import { updateListTitle, addCard } from "@/features/boardSlice";
import { List } from "@/types";
import ListItem from "../ListItem";
import { ListActions } from "./ListAction";
import useClickOutside from "@/hooks/useClickOutside";

export default function ListColumn({ list }: { list: List }) {
  const [toggle, setToggle] = useState(false);
  const [toggleCardForm, setToggleCardForm] = useState(false);
  const dispatch = useDispatch();

  const listItemRef = useRef<HTMLDivElement>(null);
  const listActionRef = useRef<HTMLDivElement>(null);
  useClickOutside(listItemRef, () => setToggleCardForm(false));
  useClickOutside(listActionRef, () => setToggle(false));

  return (
    <div className="list-item flex-shrink-0 w-80 bg-white p-4 rounded shadow">
      <div className="header flex justify-between items-center">
        <InlineEditable
          value={list.title}
          onSave={(t) =>
            dispatch(updateListTitle({ listId: list.id, title: t }))
          }
          className="fw-700"
        />
        <button
          className="btn"
          onClick={() => {
            setToggle(!toggle);
            setToggleCardForm(false);
          }}
        >
          ...
        </button>
      </div>

      <div className="cards-container flex flex-col gap-2">
        {list.cards.map((card, index) => (
          <ListItem key={card.id} card={card} listId={list.id} index={index} />
        ))}
      </div>

      {toggleCardForm ? (
        <div ref={listItemRef} onClick={(e) => e.stopPropagation()}>
          <AddCardForm
            onAdd={(title) => dispatch(addCard({ listId: list.id, title }))}
            setToggleCardForm={setToggleCardForm}
            toggleCardForm={toggleCardForm}
          />
        </div>
      ) : (
        <button
          className="btn add"
          onClick={(e) => {
            e.stopPropagation();
            setToggleCardForm(true);
            setToggle(false);
          }}
        >
          + add card
        </button>
      )}

      {toggle && (
        <div ref={listActionRef}>
          <ListActions list={list} />
        </div>
      )}
    </div>
  );
}
