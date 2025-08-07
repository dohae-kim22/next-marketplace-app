"use client";

import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  EyeIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";

interface ListPostProps {
  id: number;
  title: string;
  description: string;
  views: number;
  photo?: string | null;
  created_at: Date;
  _count: {
    comments: number;
    postLikes: number;
  };
}

export default function ListPost(props: ListPostProps) {
  const locale = useLocale();

  return (
    <Link
      href={`/posts/${props.id}`}
      className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
    >
      <h2 className="text-white text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {props.title}
      </h2>
      <div className="flex gap-4">
        <div className="flex-1 flex items-start">
          {props.description && (
            <p className="text-base text-justify">
              <span className="line-clamp-3">{props.description}</span>
            </p>
          )}
        </div>

        {props.photo && (
          <div className="w-[70px] h-[70px] relative">
            <Image
              src={`${props.photo}/avatar`}
              fill
              alt={props.title}
              className="object-cover shrink-0 rounded-sm"
            />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-3 items-center justify-center">
          <span>{formatToTimeAgo(props.created_at.toString(), locale)}</span>
          <span>·</span>
          <div className="flex items-center justify-center gap-1">
            <EyeIcon className="size-4" />
            <span>{props.views}</span>
          </div>
        </div>
        <div className="flex gap-4 items-center *:flex *:gap-1 *:items-center">
          <span>
            <HandThumbUpIcon className="size-4" />
            {props._count.postLikes}
          </span>
          <span>
            <ChatBubbleBottomCenterIcon className="size-4" />
            {props._count.comments}
          </span>
        </div>
      </div>
    </Link>
  );
}
