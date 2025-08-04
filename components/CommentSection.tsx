"use client";

import { useState } from "react";
import Image from "next/image";
import { createComment } from "@/app/[locale]/(headers)/posts/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import Link from "next/link";

interface Comment {
  id: number;
  content: string;
  created_at: Date;
  user: {
    userName: string;
    avatar: string | null;
    id: number;
  };
  replies?: Comment[];
}

export default function CommentSection({
  postId,
  comments: initialComments,
  currentUserName,
  currentUserAvatar,
  currentUserId,
}: {
  postId: number;
  comments: Comment[];
  currentUserName: string;
  currentUserAvatar: string;
  currentUserId: number;
}) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSubmit = async () => {
    if (text.trim().length === 0) return;

    const newComment: Comment = {
      id: Date.now(),
      content: text,
      created_at: new Date(),
      user: {
        userName: currentUserName,
        avatar: currentUserAvatar,
        id: currentUserId,
      },
      replies: [],
    };

    setComments((prev) => [newComment, ...prev]);
    setText("");
    await createComment(postId, text);
  };

  const handleReplySubmit = async (parentId: number) => {
    if (replyText.trim().length === 0) return;

    const reply: Comment = {
      id: Date.now(),
      content: replyText,
      created_at: new Date(),
      user: {
        userName: currentUserName,
        avatar: currentUserAvatar,
        id: currentUserId,
      },
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: [...(comment.replies ?? []), reply],
            }
          : comment
      )
    );

    await createComment(postId, replyText, parentId);
    setReplyText("");
    setReplyTo(null);
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

      <ul className="flex flex-col gap-5 text-sm text-neutral-300 border-t border-neutral-700 pt-4">
        {comments.length === 0 ? (
          <li className="text-neutral-500 italic">No comments yet.</li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id}>
              <div className="flex gap-3 items-start">
                <Link href={`/users/${comment.user.id}`}>
                  <Image
                    src={comment.user.avatar || "/default-avatar.png"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                    alt={comment.user.userName}
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {comment.user.userName}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatToTimeAgo(comment.created_at.toString())}
                    </span>
                  </div>
                  <p className="mt-1">{comment.content}</p>

                  <button
                    onClick={() =>
                      setReplyTo(replyTo === comment.id ? null : comment.id)
                    }
                    className="text-xs text-orange-400 hover:underline mt-1"
                  >
                    Reply
                  </button>

                  {replyTo === comment.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 rounded-md bg-neutral-800 text-white px-3 py-1 text-sm"
                        placeholder={`Reply to ${comment.user.userName}...`}
                      />
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        className="text-sm px-3 py-1 bg-orange-500 hover:bg-orange-400 rounded-md text-white font-medium"
                      >
                        Post
                      </button>
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="mt-3 pl-4 border-l border-neutral-700 flex flex-col gap-3">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="flex gap-2 items-start">
                          <Link href={`/users/${reply.user.id}`}>
                            <Image
                              src={reply.user.avatar || "/default-avatar.png"}
                              width={28}
                              height={28}
                              className="rounded-full object-cover"
                              alt={reply.user.userName}
                            />
                          </Link>
                          <div>
                            <span className="font-semibold">
                              {reply.user.userName}
                            </span>
                            <span className="ml-2 text-xs text-neutral-500">
                              {formatToTimeAgo(reply.created_at.toString())}
                            </span>
                            <p>{reply.content}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
