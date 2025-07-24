"use client";

import {
  InitialChatMessages,
  markMessagesAsRead,
  saveMessage,
} from "@/app/chats/actions";
import { formatToTimeAgo } from "@/lib/utils";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
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

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        content: message,
        created_at: new Date(),
        read: false,
        sender: {
          userName,
          id: userId,
          avatar,
        },
      },
    ]);

    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        content: message,
        created_at: new Date(),
        read: false,
        sender: {
          userName,
          avatar,
          id: userId,
        },
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

  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-start ${
            message.sender.id === userId ? "justify-end" : ""
          }`}
        >
          {message.sender.id === userId ? null : (
            <Image
              src={message.sender.avatar ?? "/default-user.png"}
              alt={message.sender.userName}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1${
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
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
      <form className="flex relative" onSubmit={onSubmit}>
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="Write a message..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
