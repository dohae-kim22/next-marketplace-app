import db from "@/lib/db";
import ListStream from "@/components/ListStream";
import { getTranslations } from "next-intl/server";

export default async function Live() {
  const t = await getTranslations("liveStream");

  const streams = await db.liveStream.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      streamId: true,
      user: {
        select: { userName: true },
      },
    },
  });

  return (
    <div className="p-5 flex flex-col mb-20 gap-5 md:p-15 md:pt-0 lg:pt-8 lg:max-w-4xl lg:mx-auto">
      <h1 className="text-xl font-bold text-white">{t("liveStreams")}</h1>

      <div className="flex flex-col gap-4">
        {streams.map((stream) => (
          <ListStream key={stream.id} {...stream} />
        ))}
      </div>
    </div>
  );
}
