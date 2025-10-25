"use client";
import { useState, useRef, useEffect } from "react";

export default function InlineEditable({
  value,
  onSave,
  className,
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editing) ref.current?.focus(); }, [editing]);

  return editing ? (
    <input
      ref={ref}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => { setEditing(false); onSave(text); }}
      onKeyDown={(e) => { if (e.key === "Enter") { setEditing(false); onSave(text); } }}
      className={className}
    />
  ) : (
    <div onClick={() => setEditing(true)} className={className}>
      {value}
    </div>
  );
}