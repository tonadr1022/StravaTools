"use client";
import React from "react";
import Button from "./common/Button";
import { redirect } from "next/navigation";
import { IoSettingsSharp } from "react-icons/io5";
import LogoutButton from "./auth/LogoutButton";

const HeaderButtons = () => {
  const test = () => {
    redirect("/settings");
  };

  return (
    <div className="flex gap-4">
      <Button className="btn-outline rounded-full" onClick={test}>
        <IoSettingsSharp className="w-5 h-5" />
      </Button>
      <LogoutButton />
    </div>
  );
};

export default HeaderButtons;
