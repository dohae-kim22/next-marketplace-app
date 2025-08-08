"use client";

import { PlayCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ListStreamProps {
  id: number;
  title: string;
  description: string | null;
  user: {
    userName: string;
  };
  streamId: string;
}

export default function ListStream(props: ListStreamProps) {
  const [imgSrc, setImgSrc] = useState(
    `https://${process.env.NEXT_PUBLIC_CLOUDFLARE_DOMAIN}/${props.streamId}/thumbnails/thumbnail.jpg?height=200`
  );

  const t = useTranslations("liveStream");

  return (
    <Link
      key={props.id}
      href={`/live/${props.id}`}
      className="flex items-start gap-4 bg-neutral-800 hover:bg-neutral-700 transition rounded-xl overflow-hidden p-3"
    >
      <div className="relative w-32 shrink-0">
        <Image
          // src={imgSrc}
          src="/fallback-thumbnail.jpg"
          alt={`${props.title} thumbnail`}
          width={640}
          height={360}
          className="w-full aspect-video object-cover rounded-md"
          onError={() => setImgSrc("/fallback-thumbnail.jpg")}
        />
        <PlayCircleIcon className="absolute size-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 opacity-80" />
      </div>

      <div className="flex flex-col justify-between flex-1 min-w-0 h-[72px] justify-between">
        <h2 className="text-white text-base font-semibold truncate">
          {props.title}
        </h2>
        {props.description ? (
          <p className="text-neutral-400 text-sm line-clamp-1">
            {props.description}
          </p>
        ) : null}
        <p className="text-sm text-neutral-400 mt-1 truncate">
          {t("host", { name: props.user.userName })}
        </p>
      </div>
    </Link>
  );
}
