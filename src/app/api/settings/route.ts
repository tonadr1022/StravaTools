import { NextRequest } from "next/server";
import { prisma } from "../../../../prisma/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.id) {
      Response.json({ error: "Missing id" }, { status: 400 });
    }

    console.log({ body });
    // return Response.json(body, { status: 200 });
    const updatedSettings = await prisma.settings.update({
      where: { id: body.id },
      data: body,
    });
    console.log({ updatedSettings });
    return Response.json(updatedSettings, { status: 200 });
    // return Response.json(settings, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
