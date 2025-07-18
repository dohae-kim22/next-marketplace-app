import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-between p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <img src="/logo.png" alt="next market logo" className="h-32" />
        <h1 className="text-4xl">Next Market</h1>
        <h2 className="text-lg">Join your local community marketplace</h2>
      </div>
      <div className="flex flex-col gap-3 items-center w-full">
        <Link
          href="/create-account"
          className="text-white bg-orange-500 w-full text-center text-lg font-medium py-2 rounded-md hover:bg-orange-400 transition-colors"
        >
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
