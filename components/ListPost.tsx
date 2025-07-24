import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  EyeIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

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
  return (
    <Link
      href={`/posts/${props.id}`}
      className="pb-5 mb-5 border-b border-neutral-500 text-neutral-400 flex  flex-col gap-2 last:pb-0 last:border-b-0"
    >
      <h2 className="text-white text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
        {props.title}
      </h2>
      <div className="flex gap-2">
        {props.description && (
          <p className="line-clamp-3 text-sm leading-[1.6]">
            {props.description}
          </p>
        )}
        {props.photo && (
          <Image
            src={`${props.photo}/avatar`}
            width={90}
            height={90}
            alt={props.title}
            className="object-cover shrink-0"
          />
        )}
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-3 items-center justify-center">
          <span>{formatToTimeAgo(props.created_at.toString())}</span>
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
