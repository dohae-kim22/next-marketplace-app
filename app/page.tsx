import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-between mx-auto p-6 md:max-w-xl md:p-10">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <img src="/logo.png" alt="next market logo" className="h-32" />
        <h1 className="text-4xl">Next Market</h1>
        <h2 className="text-lg">Join your local community marketplace</h2>
      </div>
      <div className="flex flex-col gap-3 items-center w-full">
        <Link href="/create-account" className="primary-btn py-2 text-lg">
          Create an account
        </Link>
        <div className="flex gap-2">
          <span>Already a member?</span>
          <Link href="/login" className="hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
