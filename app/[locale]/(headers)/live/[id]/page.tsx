import CopyButton from "@/components/CopyButton";
import db from "@/lib/db";
import { getIsOwner } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";
import DeleteStreamButton from "@/components/DeleteStreamButton";
import { getTranslations } from "next-intl/server";

async function isLiveOnCloudflare(streamId: string) {
  try {
    const res = await fetch(
      `https://${process.env.CLOUDFLARE_DOMAIN}/${streamId}/manifest/video.m3u8`,
      {
        method: "HEAD",
        cache: "no-store",
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function getStream(id: number) {
  return db.liveStream.findUnique({
    where: { id },
    select: {
      title: true,
      streamKey: true,
      streamId: true,
      rtmpsURL: true,
      userId: true,
      description: true,
      user: {
        select: {
          avatar: true,
          userName: true,
        },
      },
    },
  });
}

export default async function LiveDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (isNaN(numericId)) return notFound();

  const stream = await getStream(numericId);
  if (!stream) return notFound();

  const t = await getTranslations("liveDetail");
  const isOwner = await getIsOwner(stream.userId);

  const live = await isLiveOnCloudflare(stream.streamId);

  return (
    <div className="p-5 flex flex-col gap-5 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto text-white lg:pt-15">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-700">
        {live ? (
          <iframe
            src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.streamId}/iframe`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            className="w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <span className="text-white text-lg font-semibold">
              {t("liveStreamEnded")}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-b border-neutral-700 pb-4">
        {stream.user.avatar ? (
          <Image
            src={stream.user.avatar}
            alt={stream.user.userName}
            width={40}
            height={40}
            className="rounded-full object-cover size-10"
          />
        ) : (
          <div className="size-10 flex items-center justify-center bg-neutral-700 rounded-full">
            <UserIcon className="size-6 text-white" />
          </div>
        )}
        <span className="font-semibold text-base flex-1">
          {stream.user.userName}
        </span>

        {isOwner && <DeleteStreamButton streamId={numericId} />}
      </div>

      <h1 className="text-2xl font-bold">{stream.title}</h1>
      {stream.description ? <p>{stream.description}</p> : null}

      {isOwner && (
        <>
          <div className="bg-neutral-800 p-4 rounded-lg border border-yellow-500 space-y-4">
            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="text-neutral-300 truncate">
                <span className="font-semibold text-yellow-400">
                  Stream URL:
                </span>
                <span className="ml-2 break-all">{stream.rtmpsURL}</span>
              </div>
              <CopyButton value={stream.rtmpsURL} iconSize={18} />
            </div>

            <div className="flex items-center justify-between gap-2 text-sm">
              <div className="text-neutral-300 truncate">
                <span className="font-semibold text-yellow-400">
                  Stream Key:
                </span>
                <span className="ml-2 break-all">{stream.streamKey}</span>
              </div>
              <CopyButton value={stream.streamKey} iconSize={18} />
            </div>
          </div>

          <div className="text-neutral-300">
            <h3 className="font-semibold mb-2 text-base">{t("howToTitle")}</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              {t.raw("howToSteps").map((step: string, idx: number) => (
                <li key={idx} className="pl-4">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
