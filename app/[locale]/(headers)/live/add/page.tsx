"use client";

import FormInput from "@/components/FormInput";
import { useActionState } from "react";
import { startLive } from "./actions";
import FormTextarea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import { useTranslations } from "next-intl";

const initialState = {
  fieldErrors: {},
  values: {
    title: "",
    description: "",
  },
};

export default function AddLive() {
  const [state, dispatch] = useActionState(startLive, initialState);
  const t = useTranslations("addLive");

  return (
    <form
      className="p-5 flex flex-col gap-5 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto lg:pt-15"
      action={dispatch}
    >
      <h1 className="font-medium text-xl text-neutral-300">{t("pageTitle")}</h1>
      <FormInput
        name="title"
        placeholder={t("titlePlaceholder")}
        type="text"
        required
        errors={state?.fieldErrors.title}
        defaultValue={state?.values?.title as string}
      />
      <FormTextarea
        name="description"
        placeholder={t("descriptionPlaceholder")}
        errors={state?.fieldErrors.description}
      />
      <FormButton text={t("startButton")} />
    </form>
  );
}
