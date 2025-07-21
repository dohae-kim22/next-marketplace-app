import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    scope: "openid email profile",
    response_type: "code",
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
  };

  const formattedParams = new URLSearchParams(params).toString();

  const finalURL = `${baseURL}?${formattedParams}`;
  return redirect(finalURL);
}
