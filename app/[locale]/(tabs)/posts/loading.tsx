export default function Loading() {
  return (
    <div className="p-5 md:p-0 animate-pulse flex flex-col gap-5 items-center">
      <div className="bg-neutral-700 rounded-md w-full md:w-lg lg:w-xl h-8 mb-3" />
      {[...Array(10)].map((_, index) => (
        <div key={index} className="*:rounded-md flex items-start gap-5 ">
          <div className="flex flex-col gap-3 *:rounded-md">
            <div className="bg-neutral-700 h-5 w-72 md:w-md" />
            <div className="bg-neutral-700 h-12 w-xs md:w-lg" />
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
