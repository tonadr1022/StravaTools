"use client";
import { signIn } from "next-auth/react";
import React from "react";

const SignInButton = () => {
  return (
    <button className="btn" onClick={() => signIn()}>
      Sign in
    </button>
  );
};

export default SignInButton;
