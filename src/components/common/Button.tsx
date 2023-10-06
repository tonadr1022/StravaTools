"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};

const Button = ({ children, onClick }: Props) => {
  return (
    <button className="btn" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
