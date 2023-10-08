import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "../../../prisma/db";
import SettingsOptions from "@/components/settings/SettingsOptions";
import { SettingsFields } from "@/utils/types";

export default async function Settings() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  let settings = await prisma.settings.findUnique({
    where: { userId: session.user.id },
  });
  if (!settings) redirect("/");

  return (
    <main className="bg-base-300 p-24 pt-32 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl md:text-5xl mb-4">Settings</h1>
      <SettingsOptions settings={settings} />
    </main>
  );
}
