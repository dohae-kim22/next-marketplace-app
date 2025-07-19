import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome!</h1>
        <h2 className="text-lg">Join us by filling out the form below.</h2>
      </div>
      <form className="flex flex-col gap-4 w-full">
        <FormInput type="text" placeholder="Username" required errors={[]} />
        <FormInput type="email" placeholder="Email" required errors={[]} />
        <FormInput
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="Confirm Password"
          required
          errors={[]}
        />
        <FormButton text="Create Account" loading={false} />
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
