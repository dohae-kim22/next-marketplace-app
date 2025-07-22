import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export default function Header() {
  return (
    <div className="flex justify-end p-4">
      <Link
        href="/products/add"
        className="size-7 bg-orange-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-orange-400"
      >
        <PlusIcon className="text-white" />
      </Link>
    </div>
  );
}
