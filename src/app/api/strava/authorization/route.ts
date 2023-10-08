import { NextRequest } from "next/server";
// import prisma from "../../../../../prisma/db";
import { prisma } from "../../../../../prisma/db";
import { redirect } from "next/navigation";
export async function GET(req: NextRequest) {
  const client_id = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!;
  const client_secret = process.env.STRAVA_CLIENT_SECRET!;
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  const user_id = JSON.parse(params.get("state") || "{}")?.user_id;

  if (params.get("error")) {
    return Response.json(
      { error: params.get("error_description") },
      { status: 400 }
    );
  }
  if (!code || !user_id) {
    return Response.json({ error: "Missing code or user_id" }, { status: 400 });
  }
  const authResponse = await fetch(
    `https://www.strava.com/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`,
    {
      method: "POST",
    }
  );
  if (!authResponse.ok) {
    return Response.json(await authResponse.json(), { status: 400 });
  }

  const authData = await authResponse.json();
  const { expires_at, refresh_token, access_token } = authData;
  const user = await prisma.user.update({
    where: { id: user_id },
    data: {
      stravaAuthorized: true,
      stravaRefreshToken: refresh_token,
      stravaAccessToken: access_token,
      stravaExpiresAt: expires_at,
    },
  });
  // console.log({ user });
  redirect("/");
  // if (athleteResponse.ok)
  // const athleteJSON = await athleteResponse.json();
  // return Response.json(athleteJSON);

  // console.log({ authData });
}
