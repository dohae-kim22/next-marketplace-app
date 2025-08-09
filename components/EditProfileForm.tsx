"use client";

import {
  useActionState,
  useEffect,
  useState,
  ChangeEvent,
  useTransition,
} from "react";
import FormInput from "@/components/FormInput";
import FormButton from "@/components/FormButton";
import { UserIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import LocationAutocomplete from "./LocationAutocomplete";
import { useRouter } from "next/navigation";
import {
  getUploadURL,
  updateProfile,
  clearLocation,
} from "@/app/[locale]/(headers)/profile/edit/actions";
import { useTranslations } from "next-intl";

const RADIUS_OPTIONS = [5, 10, 30, 50];

export default function EditProfileForm({ user }: { user: any }) {
  const t = useTranslations("editProfile");

  const [preview, setPreview] = useState<string | null>(user.avatar ?? null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(
    user.avatar ?? null
  );
  const [imageError, setImageError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState(user.location ?? "");
  const [radius, setRadius] = useState<number>(user.radius ?? 5);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    user.latitude && user.longitude
      ? { lat: user.latitude, lng: user.longitude }
      : null
  );

  const [addressDetails, setAddressDetails] = useState({
    street: user.street ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    postalCode: user.postalCode ?? "",
    countryCode: user.countryCode ?? "",
  });

  const router = useRouter();
  const [isClearing, startClearing] = useTransition();

  const [state, formAction] = useActionState(
    async (_: any, formData: FormData) => {
      formData.set("avatar", uploadUrl ?? "");
      formData.set("location", location);
      formData.set("latitude", String(latLng?.lat ?? ""));
      formData.set("longitude", String(latLng?.lng ?? ""));
      formData.set("radius", String(radius));
      formData.set("street", addressDetails.street);
      formData.set("city", addressDetails.city);
      formData.set("state", addressDetails.state);
      formData.set("postalCode", addressDetails.postalCode);
      formData.set("countryCode", addressDetails.countryCode);
      return updateProfile(formData);
    },
    null
  );

  const [locationError, setLocationError] = useState(
    state?.fieldErrors?.location ?? ""
  );

  useEffect(() => {
    setLocationError(state?.fieldErrors?.location ?? "");
  }, [state?.fieldErrors?.location]);

  useEffect(() => {
    const avatar = state?.values?.avatar;
    if (typeof avatar === "string") {
      setPreview(avatar);
      setUploadUrl(avatar);
    }
    if (state && !state.fieldErrors) {
      router.back();
    }
  }, [state, router]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setImageError(t("avatar.errors.tooLarge"));
      return;
    }

    setIsUploading(true);
    setImageError("");

    const { success, result } = await getUploadURL();
    if (!success) {
      setImageError(t("avatar.errors.getUrlFail"));
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
      setImageError(t("avatar.errors.uploadFail"));
      setIsUploading(false);
      return;
    }

    const cfUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGE_DELIVERY_URL}/${result.id}/avatar`;
    setPreview(URL.createObjectURL(file));
    setUploadUrl(cfUrl);
    setIsUploading(false);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setUploadUrl(null);
  };

  const handleClearLocation = () => {
    startClearing(async () => {
      await clearLocation();
      setLocation("");
      setLatLng(null);
      setAddressDetails({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        countryCode: "",
      });
      setRadius(5);
      window.location.reload();
    });
  };

  return (
    <form
      action={formAction}
      className="p-6 flex flex-col gap-6 max-w-md mx-auto bg-neutral-900 rounded-xl shadow-md"
    >
      <h1 className="text-2xl font-bold text-white text-center">
        {t("title")}
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
              aria-label="Remove avatar"
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
            <>
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span>{t("avatar.uploading")}</span>
            </>
          ) : (
            <>
              <PhotoIcon className="w-4 h-4 text-orange-500" />
              <span className="underline">{t("avatar.change")}</span>
            </>
          )}
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
          {t("labels.nickname")}
        </label>
        <FormInput
          id="userName"
          name="userName"
          placeholder={t("labels.nickname")}
          type="text"
          defaultValue={user.userName}
          required
          errors={state?.fieldErrors?.userName}
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm text-white font-medium">
            {t("labels.neighborhood")}
          </label>
          <button
            type="button"
            onClick={handleClearLocation}
            disabled={isClearing}
            className="text-xs text-neutral-300 hover:text-white transition-colors underline disabled:opacity-50"
          >
            {isClearing ? t("buttons.clearing") : t("buttons.clear")}
          </button>
        </div>

        <LocationAutocomplete
          location={location}
          onSelect={({
            location: address,
            lat,
            lng,
            street,
            city,
            state,
            postalCode,
            countryCode,
          }) => {
            setLocation(address);
            setLatLng({ lat, lng });
            setAddressDetails({ street, city, state, postalCode, countryCode });
          }}
          onChange={() => {
            if (locationError) setLocationError("");
          }}
        />
        {locationError && (
          <p className="text-red-500 text-sm">
            {locationError || t("locationErrorFallback")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm text-white font-medium">
          {t("labels.searchRadius")}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRadius(option)}
              className={`py-2 rounded-md text-sm cursor-pointer font-semibold border transition ${
                radius === option
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-neutral-800 text-neutral-300 border-neutral-600 hover:border-neutral-400 transition-colors"
              }`}
            >
              {option}km
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-5">
        <FormButton text={t("buttons.save")} />
        <button
          type="button"
          className="bg-neutral-700 cursor-pointer h-10 rounded-md text-center hover:bg-neutral-600 transition-colors"
          onClick={() => router.back()}
        >
          {t("buttons.cancel")}
        </button>
      </div>
    </form>
  );
}
