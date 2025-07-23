"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { getUploadURL, uploadProduct } from "./actions";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import LocationPicker from "@/components/LocationPicker";

export default function AddProduct() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isFree, setIsFree] = useState(false);

  const handleRemoveImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    setIsUploading(true);
    setImageError("");
    const file = e.target.files?.[0];
    if (!file) {
      setIsUploading(true);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Each file must be less than 2MB.");
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
      return;
    }

    setPreviews((prev) => {
      const next = [...prev];
      next[index] = URL.createObjectURL(file);
      return next;
    });

    setUploadUrls((prev) => {
      const next = [...prev];
      next[
        index
      ] = `https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/${result.id}`;
      return next;
    });

    setImageError("");
    setIsUploading(false);
  };

  const [state, dispatch] = useActionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (_: any, formData: FormData) => {
      uploadUrls.forEach((url) => formData.append("photos", url));

      if (isFree) {
        formData.set("price", "0");
      }

      return uploadProduct(_, formData);
    },
    null
  );

  useEffect(() => {
    if (state?.fieldErrors?.photos) {
      setImageError(state.fieldErrors.photos[0]);
    }
  }, [state?.fieldErrors?.photos]);

  return (
    <form action={dispatch} className="p-5 flex flex-col gap-5">
      <div className="flex gap-3 flex-wrap">
        {previews.map((preview, i) => (
          <div key={i} className="relative">
            <label
              htmlFor={`photo-${i}`}
              className="size-14 rounded-md border-2 border-dashed border-neutral-300 bg-center bg-cover flex items-center justify-center cursor-pointer"
              style={{ backgroundImage: `url(${preview})` }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              className="absolute top-[-6px] right-[-6px] bg-neutral-500 text-white rounded-full size-5 text-xs flex items-center justify-center shadow cursor-pointer"
              aria-label="Remove image"
            >
              <XMarkIcon className="size-3" />
            </button>
          </div>
        ))}

        {previews.length < 5 && (
          <label
            htmlFor={`photo-${previews.length}`}
            className="size-14 rounded-md border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer *:text-neutral-400"
          >
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <PhotoIcon className="w-6" />
            )}
            <span className="text-xs">({previews.length}/5)</span>
          </label>
        )}

        {Array.from({
          length: previews.length < 5 ? previews.length + 1 : previews.length,
        }).map((_, i) =>
          i === previews.length ? (
            <input
              key={i}
              type="file"
              id={`photo-${i}`}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageChange(e, i)}
            />
          ) : null
        )}
      </div>
      {imageError && <span className="text-red-500 text-sm">{imageError}</span>}

      <FormInput
        name="title"
        placeholder="Title"
        type="text"
        required
        errors={state?.fieldErrors.title}
        defaultValue={state?.values?.title as string}
      />

      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setIsFree(false)}
          className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
            !isFree
              ? "bg-orange-500 text-neutral-50"
              : "bg-neutral-50 text-neutral-700"
          }`}
        >
          For Sale
        </button>
        <button
          type="button"
          onClick={() => setIsFree(true)}
          className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
            isFree
              ? "bg-orange-500 text-neutral-50"
              : "bg-neutral-50 text-neutral-700"
          }`}
        >
          Giveaway
        </button>
      </div>

      <FormInput
        name="price"
        placeholder={isFree ? "€ 0" : "€ Price"}
        type="number"
        step="0.01"
        required
        errors={state?.fieldErrors.price}
        defaultValue={state?.values?.price as string}
        disabled={isFree}
      />
      <FormTextarea
        name="description"
        placeholder="Description"
        required
        errors={state?.fieldErrors.description}
      />
      <LocationPicker
        errors={state?.fieldErrors.location}
        onChange={({ lat, lng, address }) => {
          const loc = {
            location: address ?? "",
            latitude: lat,
            longitude: lng,
          };
          const hidden = document.createElement("div");
          hidden.innerHTML = `
            <input type="hidden" name="location" value="${loc.location}" />
            <input type="hidden" name="latitude" value="${loc.latitude}" />
            <input type="hidden" name="longitude" value="${loc.longitude}" />
          `;
          document.forms[0].appendChild(hidden);
        }}
      />
      <FormButton text="Post" />
    </form>
  );
}
