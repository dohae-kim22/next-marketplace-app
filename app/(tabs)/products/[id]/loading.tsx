import { PhotoIcon } from "@heroicons/react/24/solid";

export default function Loading() {
  return (
    <div className="flex flex-col gap-2 animate-pulse p-5">
      <div className="flex justify-center items-center aspect-square border-neutral-700 text-neutral-700 border-4 border-dashed rounded-md">
        <PhotoIcon className="h-22" />
      </div>
      <div className="flex gap-2 items-center">
        <div className="size-14 rounded-full bg-neutral-700" />
        <div className="flex flex-col gap-1">
          <div className="h-4 w-40 bg-neutral-700 rounded-md" />
          <div className="h-4 w-20 bg-neutral-700 rounded-md" />
        </div>
      </div>
      <div className="h-10 w-80 bg-neutral-700 rounded-md" />
    </div>
  );
}
