"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import SocialLogin from "@/components/SocialLogin";
import { useActionState } from "react";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

const initialState = {
  fieldErrors: {},
  values: {
    email: "",
    password: "",
  },
};

export default function Login() {
  const [state, dispatch] = useActionState(login, initialState);

  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome Back!</h1>
        <h2 className="text-lg font-medium">
          Log in to continue to your account.
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-4 w-full">
        <FormInput
          name="email"
          type="email"
          placeholder="Email"
          required
          defaultValue={state?.values.email as string}
          errors={state?.fieldErrors?.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="Password"
          required
          defaultValue={state?.values.password as string}
          errors={state?.fieldErrors?.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <FormButton text="Log In"/>
      </form>
      <SocialLogin />
    </div>
  );
}
