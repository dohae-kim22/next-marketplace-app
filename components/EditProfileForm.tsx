"use client";

import {
  useActionState,
  useEffect,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { updateProfile, getUploadURL } from "@/app/profile/edit/actions";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { UserIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function EditProfileForm({ user }: { user: any }) {
  const [preview, setPreview] = useState<string | null>(user.avatar ?? null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(
    user.avatar ?? null
  );
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [state, formAction] = useActionState(
    async (_: any, formData: FormData) => {
      formData.set("avatar", uploadUrl ?? "");
      return updateProfile(formData);
    },
    null
  );

  useEffect(() => {
    const avatar = state?.values?.avatar;
    if (typeof avatar === "string") {
      setPreview(avatar);
      setUploadUrl(avatar);
    }
  }, [state]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImageError("File must be less than 2MB.");
      return;
    }

    setIsUploading(true);
    setImageError("");

    const { success, result } = await getUploadURL();
    if (!success) {
      setImageError("Failed to get upload URL.");
      setIsUploading(false);
      return;
    }

    const uploadRes = await fetch(result.uploadURL, {
      method: "POST",
      body: (() => {
        const form = new FormData();
        form.append("file", file);
        return form;
      })(),
    });

    if (!uploadRes.ok) {
      setImageError("Image upload failed.");
      setIsUploading(false);
      return;
    }

    const cfUrl = `https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/${result.id}/avatar`;
    setPreview(URL.createObjectURL(file));
    setUploadUrl(cfUrl);
    setIsUploading(false);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUploadUrl(null);
  };

  return (
    <form
      action={formAction}
      className="p-6 flex flex-col gap-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md"
    >
      <h1 className="text-2xl font-bold text-white text-center">
        Edit Profile
      </h1>

      <div className="flex flex-col items-center gap-2">
        <div className="relative size-24 rounded-full overflow-hidden bg-neutral-700">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar Preview"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-full h-full text-neutral-400 p-4" />
          )}

          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-[-6px] right-[-6px] bg-neutral-500 text-white rounded-full size-5 text-xs flex items-center justify-center shadow cursor-pointer"
            >
              <XMarkIcon className="size-3" />
            </button>
          )}
        </div>

        <label
          htmlFor="avatar"
          className="text-sm text-neutral-300 flex items-center gap-1 cursor-pointer"
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <PhotoIcon className="w-4 h-4 text-orange-500" />
          )}
          <span className="underline">Change Avatar</span>
        </label>
        <input
          type="file"
          id="avatar"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="userName" className="text-sm text-white font-medium">
          Nickname
        </label>
        <FormInput
          id="userName"
          name="userName"
          placeholder="Nickname"
          type="text"
          defaultValue={user.userName}
          required
          errors={state?.fieldErrors?.userName}
        />
      </div>

      <FormButton text="Save Changes" />
    </form>
  );
}
