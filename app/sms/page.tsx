"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { useActionState } from "react";
import { SMSLogIn } from "./actions";

const initialState = {
  verificationCode: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, dispatch] = useActionState(SMSLogIn, initialState);

  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Sign in with SMS</h1>
        <h2 className="text-lg font-medium">
          Enter your phone number to receive a verification code.
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-4 w-full">
        {state.verificationCode ? (
          <FormInput
            name="verificationCode"
            type="number"
            placeholder="Verification Code"
            required
            errors={[]}
            min={100000}
            max={999999}
          />
        ) : (
          <FormInput
            name="phone"
            type="number"
            placeholder="Phone Number"
            required
            errors={[]}
          />
        )}
        <FormButton
          text={
            state.verificationCode ? "Verify Code" : "Send Verification Code"
          }
          loading={false}
        />
      </form>
    </div>
  );
}
