export default function Loading() {
  return (
    <div className="flex flex-col gap-5 p-5 animate-pulse">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex gap-5">
          <div className="size-28 bg-neutral-700 rounded-md"></div>
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="h-4 w-40 bg-neutral-700"></div>
            <div className="h-4 w-30 bg-neutral-700"></div>
            <div className="h-4 w-20 bg-neutral-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
