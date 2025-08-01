"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { getUploadURL, uploadProduct } from "./actions";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import LocationAutocomplete from "@/components/LocationAutocomplete";

export default function AddProduct() {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleRemoveImage = () => {
    setPreview(null);
    setUploadUrl(null);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    setImageError("");
    const file = e.target.files?.[0];
    if (!file) {
      setIsUploading(false);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("File must be less than 2MB.");
      setIsUploading(false);
      return;
    }

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

    setPreview(URL.createObjectURL(file));
    setUploadUrl(
      `https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/${result.id}`
    );

    setImageError("");
    setIsUploading(false);
  };

  const [state, dispatch] = useActionState(
    async (_: any, formData: FormData) => {
      formData.append("photo", uploadUrl ?? "");
      return uploadProduct(_, formData);
    },
    null
  );

  useEffect(() => {
    if (state?.fieldErrors?.photo) {
      setImageError(state.fieldErrors.photo[0]);
    }
  }, [state?.fieldErrors?.photo]);

  return (
    <form
      action={dispatch}
      className="p-5 flex flex-col gap-5 md:p-15 md:pt-0 lg:max-w-4xl lg:mx-auto"
    >
      <h1 className="text-neutral-300 font-medium text-xl">Create New Post</h1>
      <div className="flex gap-3 flex-wrap justify-center">
        <div className="relative size-60">
          <label
            htmlFor="photo"
            className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
            style={{
              backgroundImage: `url(${preview})`,
            }}
          >
            {!preview && (
              <div className="flex flex-col justify-center items-center gap-1 text-neutral-400">
                {isUploading ? (
                  <div className="size-7 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PhotoIcon className="w-17" />
                )}
                <div className="text-sm">(Optional)</div>
                <p className="text-red-500 text-sm">
                  {state?.fieldErrors.photo}
                </p>
              </div>
            )}
          </label>

          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-[-7px] right-[-7px] bg-neutral-500 text-white rounded-full size-6 text-xs flex items-center justify-center shadow cursor-pointer hover:bg-neutral-400"
              aria-label="Remove image"
            >
              <XMarkIcon className="size-4" />
            </button>
          )}

          <input
            onChange={handleImageChange}
            type="file"
            id="photo"
            accept="image/*"
            className="hidden"
          />
        </div>
      </div>

      <FormInput
        name="title"
        placeholder="Title*"
        type="text"
        required
        errors={state?.fieldErrors.title}
        defaultValue={state?.values?.title as string}
      />

      <FormTextarea
        name="description"
        placeholder="Write something to share with your neighbors..."
        errors={state?.fieldErrors.description}
      />

      <div className="flex flex-col gap-2">
        <span className="text-neutral-500 text-sm">
          Select your neighborhood*
        </span>
        <LocationAutocomplete
          onSelect={({ address, lat, lng }) => {
            setLocation(address);
            setLatLng({ lat, lng });
          }}
        />
        {state?.fieldErrors?.location && (
          <p className="text-red-500 text-sm">{state.fieldErrors.location}</p>
        )}
      </div>

      <input type="hidden" name="location" value={location} />
      <input type="hidden" name="latitude" value={latLng?.lat ?? ""} />
      <input type="hidden" name="longitude" value={latLng?.lng ?? ""} />
      {uploadUrl && <input type="hidden" name="photo" value={uploadUrl} />}

      <FormButton text="Post" />
    </form>
  );
}
