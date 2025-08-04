export default function Loading() {
  return (
    <div className="animate-pulse container-lg p-5 flex flex-col gap-3 mb-20">
      <div className="bg-neutral-700 rounded-md w-full h-9 mb-3" />
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-5 lg:gap-8">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="flex gap-5 lg:flex-col lg:gap-3 border-b border-neutral-800 lg:border-0 pb-4 lg:pb-0"
          >
            <div className="size-28 lg:w-full lg:h-65 bg-neutral-700 rounded-md" />
            <div className="flex flex-col gap-2 flex-1 *:rounded-md">
              <div className="h-4 w-40 lg:w-3/4 bg-neutral-700" />
              <div className="h-4 w-32 lg:w-2/3 bg-neutral-700" />
              <div className="h-4 w-20 lg:w-1/3 bg-neutral-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
