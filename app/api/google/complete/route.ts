import db from "@/lib/db";
import {getSession} from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const tokenURL = "https://oauth2.googleapis.com/token";
  const params = {
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    grant_type: "authorization_code",
    code,
  };

  const accessTokenResponse = await fetch(tokenURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
  });
  const { access_token } = await accessTokenResponse.json();
  if (!access_token) {
    return new Response(null, {
      status: 400,
    });
  }

  const userProfileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    }
  );

  const { id, name, picture } = await userProfileResponse.json();

  const user = await db.user.findUnique({
    where: {
      googleId: id + "",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/products");
  }

  const newUser = await db.user.create({
    data: {
      userName: name,
      googleId: id + "",
      avatar: picture ?? "/default-user.png",
    },
    select: {
      id: true,
    },
  });

  const session = await getSession();
  session.id = newUser.id;
  await session.save();

  return redirect("/products");
}
