"use client";

import { useState } from "react";
import { createComment } from "@/app/posts/[id]/actions";

interface Comment {
  id: number;
  content: string;
  user: {
    userName: string;
  };
}

export default function CommentSection({
  postId,
  comments: initialComments,
  currentUserName,
}: {
  postId: number;
  comments: Comment[];
  currentUserName: string;
}) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState(initialComments);

  const handleSubmit = async () => {
    if (text.trim().length === 0) return;

    setComments((prev) => [
      { id: Date.now(), content: text, user: { userName: currentUserName } },
      ...prev,
    ]);
    setText("");
    await createComment(postId, text);
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-10">
      <h3 className="font-semibold text-white">Comments</h3>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-md bg-neutral-800 text-white px-3 py-2 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-400"
        >
          Post
        </button>
      </div>

      <ul className="flex flex-col gap-3 text-sm text-neutral-300 border-t border-neutral-700 pt-4">
        {comments.length === 0 ? (
          <li className="text-neutral-500 italic">No comments yet.</li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id}>
              <span className="font-semibold">{comment.user.userName}: </span>
              <span>{comment.content}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
