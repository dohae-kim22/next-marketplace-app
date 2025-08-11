"use client";

import {
  InitialChatMessages,
  markMessagesAsRead,
  saveMessage,
} from "@/app/[locale]/(headers)/chats/actions";
import { Link } from "@/i18n/navigation";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  userName: string;
  avatar: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  userName,
  avatar,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("chatMessages");

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message.trim()) return;

    const tempId = Date.now();

    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: tempId,
        content: message,
        created_at: new Date(),
        read: false,
        sender: { userName, id: userId, avatar },
      },
    ]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: tempId,
        content: message,
        created_at: new Date(),
        read: false,
        sender: { userName, avatar, id: userId },
      },
    });

    await saveMessage(message, chatRoomId);
    setMessage("");
  };

  useEffect(() => {
    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_API_KEY!
    );

    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  useEffect(() => {
    markMessagesAsRead(chatRoomId);
  }, [chatRoomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-neutral-900">
      <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0 px-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 items-start ${
              message.sender.id === userId ? "justify-end" : ""
            }`}
          >
            {message.sender.id === userId ? null : (
              <Link href={`/users/${message.sender.id}`}>
                <div className="relative size-8 rounded-full overflow-hidden">
                  <Image
                    src={message.sender.avatar ?? "/default-user.png"}
                    alt={message.sender.userName}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
              </Link>
            )}
            <div
              className={`flex flex-col gap-1 mb-2 ${
                message.sender.id === userId ? "items-end" : ""
              }`}
            >
              <span
                className={`relative ${
                  message.sender.id === userId
                    ? "bg-neutral-500"
                    : "bg-orange-500"
                } p-2.5 rounded-md`}
              >
                {message.content}
                {message.sender.id === userId && !message.read && (
                  <span className="absolute bottom-0 -left-3 text-xs text-neutral-300">
                    1
                  </span>
                )}
              </span>
              <span
                className={`text-xs ${
                  message.sender.id === userId ? "text-end" : ""
                }`}
              >
                {formatToTimeAgo(message.created_at.toString(), locale)}
              </span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div
        className="shrink-0 flex items-center justify-center w-full bg-neutral-900 p-5"
        style={{
          paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
        }}
      >
        <form className="flex relative max-w-lg w-full" onSubmit={onSubmit}>
          <input
            required
            onChange={onChange}
            value={message}
            className="bg-transparent rounded-full w-full h-10 focus:outline-none pl-5 pr-12 ring-2 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
            type="text"
            name="message"
            placeholder={t("placeholder")}
          />
          <button
            className="absolute right-0 cursor-pointer"
            aria-label="Send message"
          >
            <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
