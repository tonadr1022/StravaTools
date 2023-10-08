import { SettingsFields } from "@/utils/types";
import { Settings } from "@prisma/client";

export const updateSettings = async (settings: Partial<SettingsFields>) => {
  console.log(settings, "client update api");
  if (!settings?.id) {
    throw new Error("Missing id");
  }
  const response = await fetch(`/api/settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to update settings");
  }
  const updatedSettings = await response.json();
  return updatedSettings;
};

export const fetchSettings = async (userId: string) => {
  console.log("client fetching settings");
  if (!userId) {
    throw new Error("Missing userId");
  }
  const response = await fetch(`/api/settings?userId=${userId}`);
  if (!response.ok) {
    console.error(response);
    throw new Error("Failed to fetch settings");
  }
  const settings: Settings = await response.json();
  return settings;
};
