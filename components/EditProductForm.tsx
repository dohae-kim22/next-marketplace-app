"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useActionState } from "react";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import LocationPicker from "@/components/LocationPicker";
import { updateProduct } from "@/app/(headers)/products/[id]/edit/actions";
import { getUploadURL } from "@/app/(headers)/products/add/actions";

export default function EditProductForm({ product }: { product: any }) {
  const [isFree, setIsFree] = useState(product.price === 0);
  const [price, setPrice] = useState(product.price.toString());
  const [previews, setPreviews] = useState<string[]>(
    product.photos.map((p: any) => p.url)
  );
  const [uploadUrls, setUploadUrls] = useState<string[]>(
    product.photos.map((p: any) => p.url)
  );
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState("");
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const [state, formAction] = useActionState(
    async (_: any, formData: FormData) => {
      uploadUrls.forEach((url) => formData.append("photos", url));
      if (isFree) formData.set("price", "0");
      return await updateProduct(product.id, formData);
    },
    null
  );

  useEffect(() => {
    if (state?.fieldErrors?.photos) {
      setImageError(state.fieldErrors.photos[0]);
    }
  }, [state]);

  const handleRemoveImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setImageError("Each file must be less than 2MB.");
      return;
    }

    setIsUploading(true);
    const { success, result } = await getUploadURL();
    if (!success) {
      setImageError("Upload URL error");
      setIsUploading(false);
      return;
    }

    const res = await fetch(result.uploadURL, {
      method: "POST",
      body: (() => {
        const form = new FormData();
        form.append("file", file);
        return form;
      })(),
    });

    if (!res.ok) {
      setImageError("Image upload failed.");
      return;
    }

    const url = `https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/${result.id}`;
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => {
      const copy = [...prev];
      copy[index] = previewUrl;
      return copy;
    });
    setUploadUrls((prev) => {
      const copy = [...prev];
      copy[index] = url;
      return copy;
    });
    setImageError("");
    setIsUploading(false);
  };

  return (
    <form
      action={formAction}
      className="container-lg flex flex-col gap-5 p-5 md:p-20 md:py-5 lg:p-50 lg:py-5"
    >
      <div className="flex gap-3 flex-wrap">
        {previews.map((preview, i) => (
          <div key={i} className="relative">
            <div
              className="size-14 rounded-md border-2 border-dashed border-neutral-300 bg-center bg-cover"
              style={{ backgroundImage: `url(${preview}/public)` }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              className="absolute top-[-6px] right-[-6px] bg-neutral-500 text-white rounded-full size-5 text-xs flex items-center justify-center shadow cursor-pointer"
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
          length: previews.length < 5 ? previews.length + 1 : 0,
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
        errors={state?.fieldErrors?.title}
        defaultValue={product.title}
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
          onClick={() => {
            setIsFree(true);
            setPrice("0");
          }}
          className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
            isFree
              ? "bg-orange-500 text-neutral-50"
              : "bg-neutral-50 text-neutral-700"
          }`}
        >
          Giveaway
        </button>
      </div>
      <input
        type="hidden"
        name="type"
        value={isFree || price === "0" ? "FREE" : "SALE"}
      />

      <FormInput
        name="price"
        placeholder={isFree ? "€ 0" : "€ Price"}
        type="number"
        step="0.01"
        required
        errors={state?.fieldErrors?.price}
        defaultValue={product.price.toString()}
        disabled={isFree}
        value={isFree ? "0" : price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <FormTextarea
        name="description"
        placeholder="Description"
        required
        errors={state?.fieldErrors?.description}
        defaultValue={product.description}
      />

      <LocationPicker
        errors={state?.fieldErrors?.location}
        defaultValue={product.location}
        onChange={({ lat, lng, address }) => {
          setLocation(address ?? "");
          setLatLng({ lat, lng });
        }}
      />

      <input type="hidden" name="location" value={location} />
      <input type="hidden" name="latitude" value={latLng?.lat ?? ""} />
      <input type="hidden" name="longitude" value={latLng?.lng ?? ""} />

      <FormButton text="Save Changes" />
    </form>
  );
}
