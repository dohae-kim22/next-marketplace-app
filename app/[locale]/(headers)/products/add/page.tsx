"use client";

import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { ChangeEvent, useActionState, useEffect, useState } from "react";
import { getUploadURL, uploadProduct } from "./actions";
import FormInput from "@/components/FormInput";
import FormTextarea from "@/components/FormTextArea";
import FormButton from "@/components/FormButton";
import LocationPicker from "@/components/LocationPicker";
import CategorySelector from "@/components/CategorySelector";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface LocationData {
  lat: number;
  lng: number;
  location?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
}

export default function AddProduct() {
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadUrls, setUploadUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [type, setType] = useState<"SALE" | "FREE" | "WANTED">("SALE");
  const isFree = type === "FREE";
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState({ main: "", sub: "", subSub: "" });
  const [position, setPosition] = useState<LocationData | null>(null);

  const router = useRouter();
  const t = useTranslations("addProduct");

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

    if (file.size > 15 * 1024 * 1024) {
      setImageError(t("form.sizeError"));
      setIsUploading(false);
      return;
    }

    const { success, result } = await getUploadURL();
    if (!success) {
      setImageError(t("form.uploadUrlError"));
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
      setImageError(t("form.uploadError"));
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
    async (_: any, formData: FormData) => {
      uploadUrls.forEach((url) => formData.append("photos", url));

      if (isFree) {
        formData.set("price", "0");
      }

      formData.set("categoryMain", category.main);
      formData.set("categorySub", category.sub);
      formData.set("categorySubSub", category.subSub);

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
    <form
      action={dispatch}
      className="p-5 flex flex-col gap-5 md:p-15 md:pt-5 lg:max-w-4xl lg:mx-auto lg:pt-10"
    >
      <h1 className="text-neutral-300 font-medium text-xl">{t("title")}</h1>
      <div className="flex gap-3 flex-wrap">
        {previews.map((preview, i) => (
          <div key={i} className="relative">
            <label
              htmlFor={`photo-${i}`}
              className="size-14 rounded-md border-2 border-dashed border-neutral-300 bg-center bg-cover flex items-center justify-center cursor-pointer md:size-28"
              style={{ backgroundImage: `url(${preview})` }}
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(i)}
              className="absolute top-[-6px] right-[-6px] bg-neutral-500 text-white rounded-full size-5 text-xs flex items-center justify-center shadow cursor-pointer md:size-6"
              aria-label="Remove image"
            >
              <XMarkIcon className="size-3" />
            </button>
          </div>
        ))}
        {previews.length < 5 && (
          <label
            htmlFor={`photo-${previews.length}`}
            className="size-14 rounded-md border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer *:text-neutral-400 md:size-28"
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

      <div className="flex flex-col gap-5 text-neutral-300 font-semibold">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm">
            {t("form.title")}
          </label>
          <FormInput
            id="title"
            name="title"
            type="text"
            required
            errors={state?.fieldErrors.title}
            defaultValue={state?.values?.title as string}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm">{t("form.category")}</label>
          <CategorySelector
            onChange={(values) =>
              setCategory({
                main: values[0] || "",
                sub: values[1] || "",
                subSub: values[2] || "",
              })
            }
            errors={state?.fieldErrors?.categoryMain}
          />
        </div>
        <input type="hidden" name="categoryMain" value={category.main} />
        <input type="hidden" name="categorySub" value={category.sub} />
        <input type="hidden" name="categorySubSub" value={category.subSub} />

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => setType("SALE")}
            className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
              type === "SALE"
                ? "bg-orange-500 text-neutral-100"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {t("form.type.sale")}
          </button>

          <button
            type="button"
            onClick={() => {
              setType("FREE");
              setPrice("0");
            }}
            className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
              type === "FREE"
                ? "bg-orange-500 text-neutral-100"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {t("form.type.free")}
          </button>

          <button
            type="button"
            onClick={() => setType("WANTED")}
            className={`px-3 py-1 rounded-full border border-neutral-700 text-sm ${
              type === "WANTED"
                ? "bg-orange-500 text-neutral-100"
                : "bg-neutral-100 text-neutral-700"
            }`}
          >
            {t("form.type.wanted")}
          </button>
        </div>

        <input
          type="hidden"
          name="type"
          value={price === "0" ? "FREE" : type}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="price" className="text-sm">
            {t("form.price")}
          </label>
          <FormInput
            id="price"
            name="price"
            placeholder={isFree ? "€ 0" : "€ Price"}
            type="number"
            step="0.01"
            required
            errors={state?.fieldErrors.price}
            defaultValue={state?.values?.price as string}
            disabled={isFree}
            value={isFree ? "0" : price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm">
            {t("form.description")}
          </label>
          <FormTextarea
            id="description"
            name="description"
            required
            errors={state?.fieldErrors.description}
          />
        </div>
      </div>

      <LocationPicker
        errors={state?.fieldErrors.location}
        onChange={({
          lat,
          lng,
          location,
          street,
          city,
          state,
          postalCode,
          countryCode,
        }) => {
          const data = {
            lat,
            lng,
            location,
            street,
            city,
            state,
            postalCode,
            countryCode,
          };

          setPosition(data);
        }}
      />
      <input type="hidden" name="location" value={position?.location ?? ""} />
      <input type="hidden" name="latitude" value={position?.lat ?? ""} />
      <input type="hidden" name="longitude" value={position?.lng ?? ""} />
      <input type="hidden" name="street" value={position?.street ?? ""} />
      <input type="hidden" name="city" value={position?.city ?? ""} />
      <input type="hidden" name="state" value={position?.state ?? ""} />
      <input
        type="hidden"
        name="postalCode"
        value={position?.postalCode ?? ""}
      />
      <input
        type="hidden"
        name="countryCode"
        value={position?.countryCode ?? ""}
      />
      <div className="flex flex-col gap-4 mt-5">
        <FormButton text={t("form.post")} />
        <button
          type="button"
          onClick={() => router.back()}
          className="h-10 text-white border border-orange-500 w-full text-center font-medium rounded-md hover:border-orange-400 transition-colors"
        >
          {t("form.cancel")}
        </button>
      </div>
    </form>
  );
}
