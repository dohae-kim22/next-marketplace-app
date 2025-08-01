import CopyButton from "@/components/CopyButton";
import db from "@/lib/db";
import { getSession } from "@/lib/session";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

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

  const session = await getSession();

  return (
    <div className="p-5 flex flex-col gap-5 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto text-white">
      <div className="relative aspect-video rounded-lg overflow-hidden border border-neutral-700">
        <iframe
          src={`https://${process.env.CLOUDFLARE_DOMAIN}/${stream.streamId}/iframe`}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          className="w-full h-full"
        />
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
        <span className="font-semibold text-base">{stream.user.userName}</span>
      </div>

      <h1 className="text-2xl font-bold">{stream.title}</h1>
      {stream.description ? <p>{stream.description}</p> : null}

      {stream.userId === session.id && (
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
            <h3 className="font-semibold mb-2 text-base">
              How to Start Streaming:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li className="pl-4">
                Open your streaming software (OBS, Streamlabs, XSplit, etc.).
              </li>
              <li className="pl-4">Go to Settings → Stream.</li>
              <li className="pl-4">
                Select &quot;Custom&quot; or &quot;RTMPS&quot; as your service.
              </li>
              <li className="pl-4">
                Paste the Stream URL and Stream Key above.
              </li>
              <li className="pl-4">
                Start streaming and your live will appear on our platform!
              </li>
            </ol>
          </div>
        </>
      )}
    </div>
  );
}
