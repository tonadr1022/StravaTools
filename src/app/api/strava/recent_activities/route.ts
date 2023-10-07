import { getTimeAfterString } from "@/utils/dateTimeUtils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const num_days = params.get("num_days");
  const access_token = params.get("access_token");
  if (!num_days)
    return Response.json({ error: "Missing num_days param" }, { status: 400 });
  if (!access_token)
    return Response.json(
      { error: "Missing access_token param" },
      { status: 400 }
    );

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${getTimeAfterString(
      Number(num_days)
    )}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  if (!response.ok) {
    console.error(response);
    return Response.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
  const activities = await response.json();
  return Response.json(activities, { status: 200 });
}
