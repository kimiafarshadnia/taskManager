"use client";
import { useState } from "react";
import { Card } from "@/types";
import CardModal from "./modals/CreateCommentModal";
import { useDispatch } from "react-redux";
import { addComment } from "@/features/boardSlice";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function ListItem({ listId, card, index }: { listId: string; card: Card; index: number }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const countComments = card.comments.length;

  const handleAddComment = (text: string) => {
    dispatch(addComment({ listId, cardId: card.id, text }));
  };

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: card.id,
    data: { listId, index }, // مهم برای drop بین لیست‌ها
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    willChange: "transform",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="card-item p-2 bg-gray-50 rounded shadow cursor-grab">
      <span className="tw-700">{card.title}</span>
      <button className="btn" onClick={() => setOpen(true)} aria-label="open card">
        + comment({countComments})
      </button>
      {open && <CardModal card={card} onClose={() => setOpen(false)} onAddComment={handleAddComment} />}
    </div>
  );
}