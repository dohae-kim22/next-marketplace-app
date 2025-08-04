"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import SocialLogin from "@/components/SocialLogin";
import { createAccount } from "./actions";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

const initialState = {
  fieldErrors: {},
  values: {
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccount, initialState);

  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8 mx-auto md:max-w-lg">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Welcome!</h1>
        <h2 className="text-lg font-medium">
          Join us by filling out the form below.
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-4 w-full">
        <FormInput
          name="userName"
          type="text"
          placeholder="Username"
          required
          defaultValue={state?.values.userName as string}
          errors={state?.fieldErrors?.userName}
          minLength={3}
          maxLength={10}
        />
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
        <FormInput
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          defaultValue={state?.values.confirmPassword as string}
          errors={state?.fieldErrors?.confirmPassword}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <FormButton text="Create Account" />
      </form>
      <SocialLogin />
    </div>
  );
}
