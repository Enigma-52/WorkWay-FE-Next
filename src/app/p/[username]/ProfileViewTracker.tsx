"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type Props = {
  username: string;
  category: string | null;
  experienceLevel: string | null;
};

export function ProfileViewTracker({ username, category, experienceLevel }: Props) {
  useEffect(() => {
    track("Talent Profile Viewed", { username, category, experience_level: experienceLevel });
    // Fire once per mount (profile navigation), not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  return null;
}
