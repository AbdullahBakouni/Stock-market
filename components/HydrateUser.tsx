"use client";

import { useUserStore } from "@/lib/store/user-store";
import { useEffect } from "react";

export default function HydrateUser({ session }: { session: any }) {
  const setSession = useUserStore((state) => state.setSession);

  useEffect(() => {
    if (session) {
      setSession(session);
    }
  }, [session, setSession]);

  return null;
}
