"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "#1E293B",
          "--normal-text": "#F8FAFC",
          "--normal-border": "#334155",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
