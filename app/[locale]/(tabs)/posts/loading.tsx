export default function Loading() {
  return (
    <div className="container-lg p-5 mb-40 animate-pulse">
      <div className="w-full h-9 rounded-md bg-neutral-800 mb-4" />

      <div className="flex flex-col gap-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-neutral-800 pb-5 last:border-b-0"
          >
            <div className="flex-1 flex flex-col gap-3">
              <div className="h-5 w-2/3 rounded-md bg-neutral-800" />
              <div className="h-4 w-full rounded-md bg-neutral-800" />
              <div className="h-4 w-5/6 rounded-md bg-neutral-800" />

              <div className="h-4 w-40 rounded-md bg-neutral-800" />
            </div>

            <div className="w-[70px] h-[70px] rounded-sm bg-neutral-800 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
