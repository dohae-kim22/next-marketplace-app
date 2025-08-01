"use client";

import FormInput from "@/components/FormInput";
import { useActionState } from "react";
import { startLive } from "./actions";
import FormTextarea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";

const initialState = {
  fieldErrors: {},
  values: {
    title: "",
    description: "",
  },
};

export default function AddLive() {
  const [state, dispatch] = useActionState(startLive, initialState);
  return (
    <form
      className="p-5 flex flex-col gap-5 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto"
      action={dispatch}
    >
      <h1 className="font-medium text-xl text-neutral-300">
        Start Your Live Stream
      </h1>
      <FormInput
        name="title"
        placeholder="Enter a title for your live stream"
        type="text"
        required
        errors={state?.fieldErrors.title}
        defaultValue={state?.values?.title as string}
      />
      <FormTextarea
        name="description"
        placeholder="Description (optional)"
        errors={state?.fieldErrors.description}
      />
      <FormButton text="Start streaming" />
    </form>
  );
}
