"use client";
import React from "react";

type Props = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
};

const Button = ({ children, onClick, className }: Props) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
