export default function Loading() {
  return (
    <div className="container-lg p-5 md:p-20 lg:flex lg:gap-10 animate-pulse">
      <div className="flex flex-col gap-4 lg:w-[42%]">
        <div className="rounded-md bg-neutral-800 aspect-square md:aspect-[4/3]" />

        <div className="h-14 rounded-md bg-neutral-800" />

        <div className="hidden lg:flex flex-col gap-3">
          <div className="h-10 rounded-md bg-neutral-800" />
          <div className="h-10 rounded-md bg-neutral-800" />
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-4 lg:mt-0">
        <div className="h-5 rounded-md bg-neutral-800" />

        <div className="h-7 w-3/4 rounded-md bg-neutral-800" />

        <div className="h-5 w-2/3 rounded-md bg-neutral-800" />
        <div className="hidden lg:flex gap-3">
          <div className="h-10 flex-1 max-w-[200px] rounded-md bg-neutral-800" />
          <div className="h-10 w-40 rounded-md bg-neutral-800" />
          <div className="h-10 w-40 rounded-md bg-neutral-800" />
        </div>

        <div className="space-y-2">
          <div className="h-4 rounded-md bg-neutral-800" />
          <div className="h-4 w-10/12 rounded-md bg-neutral-800" />
          <div className="h-4 w-8/12 rounded-md bg-neutral-800" />
        </div>

        <div className="space-y-3">
          <div className="h-5 w-32 rounded-md bg-neutral-800" />
          <div className="h-4 w-2/3 rounded-md bg-neutral-800" />
          <div className="h-48 rounded-md bg-neutral-800" />
        </div>
      </div>

      <div className="fixed lg:hidden bottom-0 left-0 w-full p-5 bg-neutral-900">
        <div className="h-12 rounded-md bg-neutral-800" />
      </div>
    </div>
  );
}
