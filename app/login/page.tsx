import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import SocialLogin from "@/components/SocialLogin";

export default function Login() {
  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <h2 className="text-lg font-medium">
          Log in to continue to your account.
        </h2>
      </div>
      <form className="flex flex-col gap-4 w-full">
        <FormInput name='email' type="email" placeholder="Email" required errors={[]} />
        <FormInput
        name='password'
          type="password"
          placeholder="Password"
          required
          errors={[]}
        />
        <FormButton text="Log In" loading={false} />
      </form>
      <SocialLogin />
    </div>
  );
}
