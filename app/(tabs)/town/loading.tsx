export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="*:rounded-md flex gap-5 ">
          <div className="flex flex-col gap-2 *:rounded-md">
            <div className="bg-neutral-700 h-4 w-20" />
            <div className="bg-neutral-700 h-8 w-50" />
            <div className="flex gap-2 *:rounded-md">
              <div className="bg-neutral-700 h-4 w-4" />
              <div className="bg-neutral-700 h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
