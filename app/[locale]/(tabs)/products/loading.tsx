export default function Loading() {
  return (
    <div className="container-lg p-5 mb-20 animate-pulse">
      <div className="w-full h-9 rounded-md bg-neutral-800 mb-4" />

      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-neutral-800 pb-4 lg:border-none lg:pb-0 lg:flex-col"
          >
            <div className="size-28 rounded-md bg-neutral-800 shrink-0 lg:w-full lg:aspect-square lg:size-auto" />

            <div className="flex-1 flex flex-col gap-2">
              <div className="h-5 w-3/4 rounded-md bg-neutral-800" />
              <div className="h-4 w-2/3 rounded-md bg-neutral-800" />
              <div className="h-4 w-1/3 rounded-md bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
