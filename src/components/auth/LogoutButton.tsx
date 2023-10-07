"use client";
import { signOut } from "next-auth/react";
import React from "react";

const LogoutButton = () => {
  return (
    <button onClick={() => signOut()} className="btn btn-outline btn-secondary">
      Logout
    </button>
  );
};

export default LogoutButton;
