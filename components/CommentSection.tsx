"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createComment,
  deleteComment,
} from "@/app/[locale]/(headers)/posts/[id]/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

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

  const locale = useLocale();
  const t = useTranslations("postDetail");

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

  const handleDelete = async (
    commentId: number,
    isReply = false,
    parentId?: number
  ) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map((reply) =>
              reply.id === commentId
                ? { ...reply, content: t("deletedComment") }
                : reply
            ),
          };
        }
        if (!isReply && comment.id === commentId) {
          return { ...comment, content: t("deletedComment") };
        }
        return comment;
      })
    );

    try {
      await deleteComment(commentId, postId);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-10">
      <h3 className="font-semibold text-white">{t("commentsTitle")}</h3>

      <div className="flex gap-2 items-center">
        <input
          className="flex-1 bg-transparent border-none rounded-md focus:outline-none transition h-8 ring-1 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("writeComment")}
        />
        <button
          onClick={handleSubmit}
          className="bg-orange-500 text-white px-4 h-8 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
        >
          {t("post")}
        </button>
      </div>

      <ul className="flex flex-col gap-5 text-sm text-neutral-300 border-t border-neutral-700 pt-4">
        {comments.length === 0 ? (
          <li className="text-neutral-500 italic">{t("noComments")}</li>
        ) : (
          comments.map((comment) => (
            <li key={comment.id}>
              <div className="flex gap-3 items-start">
                <Link href={`/users/${comment.user.id}`}>
                  <div className="relative size-9 rounded-full overflow-hidden">
                    <Image
                      src={comment.user.avatar || "/default-avatar.png"}
                      alt={comment.user.userName}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                  </div>
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      {comment.user.userName}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {formatToTimeAgo(comment.created_at.toString(), locale)}
                    </span>
                  </div>

                  <p
                    className={`mt-1 ${
                      comment.content === t("deletedComment")
                        ? "italic text-neutral-500"
                        : ""
                    }`}
                  >
                    {comment.content}
                  </p>

                  <div className="flex gap-3 mt-1">
                    <button
                      onClick={() =>
                        setReplyTo(replyTo === comment.id ? null : comment.id)
                      }
                      className="text-xs text-orange-400 hover:underline"
                    >
                      {t("reply")}
                    </button>
                    {comment.user.id === currentUserId && (
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {replyTo === comment.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-transparent border-none rounded-md focus:outline-none transition h-8 ring-1 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400"
                        placeholder={`Reply to ${comment.user.userName}...`}
                      />
                      <button
                        onClick={() => handleReplySubmit(comment.id)}
                        className="text-sm px-3 h-8 bg-orange-500 hover:bg-orange-600 transition-colors rounded-md text-white font-medium"
                      >
                        {t("post")}
                      </button>
                    </div>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <ul className="mt-3 pl-4 border-l border-neutral-700 flex flex-col gap-3">
                      {comment.replies.map((reply) => (
                        <li key={reply.id} className="flex gap-2 items-start">
                          <Link href={`/users/${reply.user.id}`}>
                            <div className="relative size-8 rounded-full overflow-hidden">
                              <Image
                                src={reply.user.avatar || "/default-avatar.png"}
                                alt={reply.user.userName}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            </div>
                          </Link>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {reply.user.userName}
                              </span>
                              <span className="text-xs text-neutral-500">
                                {formatToTimeAgo(
                                  reply.created_at.toString(),
                                  locale
                                )}
                              </span>
                              {reply.user.id === currentUserId && (
                                <button
                                  onClick={() =>
                                    handleDelete(reply.id, true, comment.id)
                                  }
                                  className="text-xs text-red-400 hover:underline"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p
                              className={
                                reply.content === t("deletedComment")
                                  ? "italic text-neutral-500"
                                  : ""
                              }
                            >
                              {reply.content}
                            </p>
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
