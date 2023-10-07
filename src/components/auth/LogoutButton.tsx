"use client";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    signOut();
    redirect("/");
  };
  return (
    <button onClick={handleLogout} className="btn btn-outline btn-secondary">
      Logout
    </button>
  );
};

export default LogoutButton;
