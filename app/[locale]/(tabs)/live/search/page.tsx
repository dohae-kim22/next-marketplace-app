import db from "@/lib/db";
import ListStream from "@/components/ListStream";
import FormInput from "@/components/FormInput";
import { getTranslations } from "next-intl/server";

interface LiveSearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function LiveSearchPage({
  searchParams,
}: LiveSearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim();

  const t = await getTranslations("liveStream");

  const streams = query
    ? await db.liveStream.findMany({
        where: {
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          title: true,
          streamId: true,
          description: true,
          user: {
            select: { userName: true },
          },
        },
      })
    : [];

  return (
    <div className="p-5 flex flex-col gap-5 mb-20 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto">
      <form className="md:mt-5 lg:hidden">
        <FormInput
          type="text"
          name="q"
          defaultValue={query}
          placeholder={t("placeholder")}
        />
      </form>

      {query && streams.length === 0 ? (
        <p className="text-neutral-400">{t("noResults")}</p>
      ) : (
        <div className="flex flex-col gap-4 lg:mt-10">
          {streams.map((stream) => (
            <ListStream key={stream.id} {...stream} />
          ))}
        </div>
      )}
    </div>
  );
}
