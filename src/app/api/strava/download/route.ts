import { fetchAllActivities } from "@/strava/fetchActivities";
import { NextRequest } from "next/server";
import { json2csv } from "json-2-csv";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  //   const num_days = params.get("num_days");
  const file_type = params.get("file_type");
  const access_token = params.get("access_token");
  //   if (!num_days)
  //     return Response.json(
  //       { error: "Missing num_days param" },
  //       { status: 400 }
  //     );
  if (!access_token)
    return Response.json(
      { error: "Missing access_token param" },
      { status: 400 }
    );
  if (!file_type)
    return Response.json({ error: "Missing file_type param" }, { status: 400 });
  if (file_type !== "json" && file_type !== "csv")
    return Response.json(
      { error: "Invalid file_type param, must be 'json' or 'csv'" },
      { status: 400 }
    );
  const activities = await fetchAllActivities(access_token);
  if (file_type === "json") {
    return Response.json(activities, { status: 200 });
  } else {
    const csv = await json2csv(activities);
    return Response.json(csv, { status: 200 });
  }
}
