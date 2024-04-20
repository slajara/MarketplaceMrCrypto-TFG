import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  classNameToOverride?: string;
  disabled?: boolean;
}

const Button = ({
  children,
  onClick,
  className,
  classNameToOverride,
  disabled,
}: ButtonProps) => {
  return (
    <button
      className={
        classNameToOverride ??
        `btn-primary btn mx-auto flex items-center
      rounded-full border-0 bg-primary bg-opacity-80 bg-gradient-to-tr 
      px-6 py-2 font-bold text-light
      hover:scale-105 ${className}`
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
