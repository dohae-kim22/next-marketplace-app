import {
  ChatBubbleBottomCenterTextIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/20/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome!</h1>
        <h2 className="text-lg">Join us by filling out the form below</h2>
      </div>
      <form className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-2">
          <input
            className="bg-transparent border-none rounded-md h-10 ring-1 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400"
            type="text"
            placeholder="Username"
            required
          />
          <span className="text-red-500">
            Invalid username. Please try again.
          </span>
        </div>
        <button className="primary-btn h-10">Create account</button>
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <div>
        <Link
          href="/sms"
          className="primary-btn h-10 flex items-center justify-center gap-2"
        >
          <span>
            <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
          </span>
          <span>Sign up via SMS</span>
        </Link>
      </div>
    </div>
  );
}
