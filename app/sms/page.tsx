import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import SocialLogin from "@/components/SocialLogin";

export default function SMSLogin() {
  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Sign in with SMS</h1>
        <h2 className="text-lg font-medium">
          Enter your phone number to receive a verification code.
        </h2>
      </div>
      <form className="flex flex-col gap-4 w-full">
        <FormInput
          type="number"
          placeholder="Phone Number"
          required
          errors={[]}
        />
        <FormInput
          type="number"
          placeholder="Verification Code"
          required
          errors={[]}
        />
        <FormButton text="Verify" loading={false} />
      </form>
    </div>
  );
}
