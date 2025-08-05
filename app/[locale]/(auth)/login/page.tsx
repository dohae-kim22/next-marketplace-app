"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import SocialLogin from "@/components/SocialLogin";
import { useActionState } from "react";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useTranslations } from "next-intl";

const initialState = {
  fieldErrors: {},
  values: {
    email: "",
    password: "",
  },
};

export default function Login() {
  const [state, dispatch] = useActionState(login, initialState);
  const t = useTranslations("signIn");

  return (
    <div className="flex flex-col justify-center px-6 py-8 gap-8 mx-auto md:max-w-lg">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{t("welcome")}</h1>
        <h2 className="text-base font-semibold">{t("subtitle")}</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-5 w-full">
        <div className="flex flex-col gap-2 text-neutral-400 font-semibold">
          <label htmlFor="email" className="text-sm">
            {t("email")}
          </label>
          <FormInput
            name="email"
            type="email"
            required
            defaultValue={state?.values.email as string}
            errors={state?.fieldErrors?.email}
          />
        </div>
        <div className="flex flex-col gap-2 text-neutral-400 font-semibold">
          <label htmlFor="password" className="text-sm">
            {t("password")}
          </label>
          <FormInput
            name="password"
            type="password"
            required
            defaultValue={state?.values.password as string}
            errors={state?.fieldErrors?.password}
            minLength={PASSWORD_MIN_LENGTH}
          />
        </div>
        <FormButton text={t("logIn")} />
      </form>
      <SocialLogin />
    </div>
  );
}
