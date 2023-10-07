"use client";
// import { providers, getSession, csrfToken } from "next-auth/client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import React from "react";

const SignInButton = () => {
  return (
    <button
      className="btn btn-outline w-32 flex text-xl p-0 normal-case"
      onClick={() => signIn("google")}>
      Sign in
      <Image src="/google.svg" width={24} height={24} alt="Google logo" />
    </button>
  );
};

export default SignInButton;
