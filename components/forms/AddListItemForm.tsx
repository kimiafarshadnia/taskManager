"use client";
import { useState } from "react";

export default function AddListItemForm({
  onAdd,
  toggleCardForm,
  setToggleCardForm,
}: {
  onAdd: (title: string) => void;
  toggleCardForm: boolean;
  setToggleCardForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState("");
  return (
    <div className="add-form">
      <input
        placeholder="Add new card..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <div>
        <button
          onClick={() => {
            if (title.trim()) {
              onAdd(title);
              setTitle("");
            }
          }}
          className="btn add"
        >
          Add
        </button>

        <button
        className="btn cancle"
          onClick={() => {
            setToggleCardForm(!toggleCardForm);
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
}
