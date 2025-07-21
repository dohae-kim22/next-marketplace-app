"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useActionState, useState } from "react";
import { getUploadURL, uploadProduct } from "./actions";
import FormTextarea from "@/components/FormTextArea";

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [imageId, setImageId] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const interceptAction = async (_: any, formData: FormData) => {
    if (imageError || !uploadUrl || !imageId) {
      return {
        fieldErrors: {
          photo: ["Cannot upload image. Please check file size."],
          title: [],
          price: [],
          description: [],
        },
      };
    }
    const file = formData.get("photo");
    if (!file) return;

    // Upload image to Cloudflare
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: cloudflareForm,
    });

    if (!response.ok) {
      return {
        fieldErrors: {
          photo: ["Image upload failed. Try again."],
        },
      };
    }

    const photoUrl = `https://imagedelivery.net/D1tmCeHaZw3ssCcAXbxakA/${imageId}`;
    formData.set("photo", photoUrl);

    return uploadProduct(_, formData);
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const file = files[0];

    if (file.size > 2 * 1024 * 1024) {
      setImageError("File size must be 2MB or less.");
      setPreview("");
      setUploadUrl("");
      setImageId("");
      return;
    }

    setImageError("");
    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadURL();
    if (success) {
      const { id, uploadURL } = result;
      setImageId(id);
      setUploadUrl(uploadURL);
    }
  };

  const [state, dispatch] = useActionState(interceptAction, null);

  return (
    <div>
      <form action={dispatch} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="aspect-square border-2 border-dashed border-neutral-300 flex flex-col justify-center items-center rounded-md cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-17" />
              <div className="text-neutral-400 text-sm flex flex-col text-center">
                Add photo
                <span className="text-red-500 text-sm">
                  {state?.fieldErrors.photo}
                </span>
                {imageError && (
                  <span className="text-red-500 text-sm ml-1">
                    {imageError}
                  </span>
                )}
              </div>
            </>
          ) : null}
        </label>
        <input
          type="file"
          name="photo"
          id="photo"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
        <FormInput
          name="title"
          placeholder="Title"
          type="text"
          required
          errors={state?.fieldErrors.title}
        />
        <FormInput
          name="price"
          placeholder="€ Price"
          type="number"
          step="0.01"
          required
          errors={state?.fieldErrors.price}
        />
        <FormTextarea
          name="description"
          placeholder="Description"
          required
          errors={state?.fieldErrors.description}
        />
        <FormButton text="Post" />
      </form>
    </div>
  );
}
