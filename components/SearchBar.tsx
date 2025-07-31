"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (term.trim()) {
      router.push(`/products/search?term=${encodeURIComponent(term)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex items-center w-full max-w-3xl mx-auto px-4 py-2 relative"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="flex-1 pl-4 pr-12 py-2 rounded-full bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="submit"
        className="absolute right-5
        
        ml-2 px-2 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600"
      >
        <ArrowRightIcon className="size-5" />
      </button>
    </form>
  );
}
