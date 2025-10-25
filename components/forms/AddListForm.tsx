"use client";
import { useState } from "react";

export default function AddListForm({
  onAdd,
  toggleListForm,
  setToggleListForm,
}: {
  onAdd: (title: string) => void;
  toggleListForm: boolean;
  setToggleListForm: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState("");

  const handleAddList = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle("");
    }
    setToggleListForm(!toggleListForm);
  };
  return (
    <div className="add-form">
      <input
        placeholder="Add new list..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <div>
        <button onClick={() => handleAddList()} className="btn add">Add</button>

        <button
        className="btn cancel"
          onClick={() => {
            setToggleListForm(!toggleListForm);
          }}
        >
          cancel
        </button>
      </div>
    </div>
  );
}
