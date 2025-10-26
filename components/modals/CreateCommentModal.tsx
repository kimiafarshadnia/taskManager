"use client";
import { Card } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function CreateCommentModal({
  card,
  onClose,
  onAddComment,
}: {
  card: Card;
  onClose: () => void;
  onAddComment: (text: string) => void;
}) {
  const [text, setText] = useState("");

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h4 className="modal-title">Comments for &quot;{card.title}&quot;</h4>

        <div className="comments">
          {card.comments.length === 0 && (
            <p className="no-comments">No comments yet...</p>
          )}
          {card.comments.map((c) => (
            <div key={c.id} className="comments item">
              <p>{c.text}</p>
              <span>{formatDate(c.createdAt)}</span>
            </div>
          ))}
        </div>

        <textarea
          className="comment-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
        />

        <div className="modal-actions">
          <button
            className="btn add"
            onClick={() => {
              if (text.trim()) {
                onAddComment(text.trim());
                setText("");
              }
            }}
          >
            Add Comment
          </button>

           <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
