export default function Loading() {
  return (
    <div
      className="container-lg flex flex-col gap-3 p-5 md:p-20 md:py-0 md:pt-5 lg:py-8 lg:px-5 lg:flex-row lg:gap-15 animate-pulse"
      aria-hidden
    >
      <div className="flex flex-col gap-3 lg:w-[42%]">
        <div className="h-5 w-48 rounded-lg bg-neutral-800" />

        <div className="relative overflow-hidden rounded-xl bg-neutral-800 aspect-square" />

        <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
          <div className="flex justify-center items-center size-12 rounded-full bg-neutral-800" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-800" />
            <div className="h-3 w-24 rounded bg-neutral-800" />
          </div>
          <div className="h-6 w-20 rounded-md bg-neutral-800" />
        </div>

        <div className="hidden lg:flex flex-col gap-2 mt-3">
          <div className="h-11 rounded-lg bg-neutral-800" />
          <div className="h-11 rounded-lg bg-neutral-800" />
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 mt-2 lg:mt-0">
        <div className="flex gap-3 items-center text-neutral-400">
          <div className="h-3 w-28 rounded bg-neutral-800" />
          <div className="h-3 w-16 rounded bg-neutral-800" />
          <div className="h-3 w-16 rounded bg-neutral-800" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-8 w-3/4 rounded-lg bg-neutral-800" />
          <div className="flex flex-col gap-3 my-1">
            <div className="h-7 w-36 rounded-lg bg-neutral-800 hidden lg:block" />
            <div className="hidden lg:block h-10 w-44 rounded-md bg-neutral-800" />
          </div>
        </div>

        <div className="mt-1 space-y-3">
          <div className="h-4 w-full rounded bg-neutral-800" />
          <div className="h-4 w-10/12 rounded bg-neutral-800" />
          <div className="h-4 w-8/12 rounded bg-neutral-800" />
        </div>

        <div className="mt-5 flex flex-col gap-3 md:mt-7">
          <div className="h-4 w-48 rounded bg-neutral-800" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-2/3 rounded bg-neutral-800" />
            <div className="h-8 w-24 rounded-md bg-neutral-800" />
          </div>
          <div className="rounded-xl bg-neutral-800 aspect-[16/10] md:aspect-[16/9] h-50" />
        </div>

        <div className="fixed lg:hidden w-full bottom-0 p-5 left-0 bg-neutral-900/80 backdrop-blur flex gap-2 items-center">
          <div className="h-6 w-24 rounded bg-neutral-800" />
          <div className="h-11 flex-1 rounded-md bg-neutral-800" />
          <div className="h-11 w-11 rounded-md bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
