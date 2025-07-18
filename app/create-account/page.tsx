import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import SocialLogin from "@/components/SocialLogin";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <h2 className="text-lg font-medium">
          Join us by filling out the form below.
        </h2>
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
      <SocialLogin />
    </div>
  );
}
