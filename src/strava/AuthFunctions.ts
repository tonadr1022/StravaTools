import { User } from "@prisma/client";
// import prisma from "../../prisma/db";
import { prisma } from "../../prisma/db";
export const handleAuthRedirect = (user_id: string) => {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID as string,
    redirect_uri: process.env.NEXT_PUBLIC_STRAVA_REDIRECT_URI as string,
    response_type: "code",
    approval_prompt: "force",
    scope: "read_all,activity:read_all,profile:read_all",
    state: JSON.stringify({ user_id }),
  });

  window.location.href = `https://www.strava.com/oauth/authorize/?${params.toString()}`;
};

export const checkAndRefreshStravaAuth = async (user: User) => {
  console.log("checking refresh auth");
  if (
    !user.stravaAuthorized ||
    !user.stravaExpiresAt ||
    !user.stravaRefreshToken
  )
    throw new Error("User not authorized with Strava");
  // console.log(
  //   user.stravaExpiresAt,
  //   new Date(user.stravaExpiresAt * 1000),
  //   new Date()
  // );
  // console.log(new Date(user.stravaExpiresAt * 1000) > new Date());
  if (new Date(user.stravaExpiresAt * 1000) > new Date()) return;
  try {
    console.log("refreshing auth");
    await refreshAuth(user);
  } catch (e) {
    console.error(e);
  }
};

const refreshAuth = async (user: User) => {
  const client_id = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!;
  const client_secret = process.env.STRAVA_CLIENT_SECRET!;

  const authResponse = await fetch(
    `https://www.strava.com/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&refresh_token=${user.stravaRefreshToken}&grant_type=refresh_token`,
    {
      method: "POST",
    }
  );

  if (!authResponse.ok) {
    throw new Error("Failed to refresh Strava auth");
  }

  const authData = await authResponse.json();
  const { expires_at, refresh_token, access_token } = authData;
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      stravaRefreshToken: refresh_token,
      stravaAccessToken: access_token,
      stravaExpiresAt: expires_at,
    },
  });
  console.log(updatedUser);
};
