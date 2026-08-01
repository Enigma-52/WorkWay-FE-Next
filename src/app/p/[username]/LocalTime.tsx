"use client";

import { useEffect, useState } from "react";

export function LocalTime({ timezone }: { timezone: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      try {
        setTime(
          new Date().toLocaleTimeString("en-US", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        );
      } catch {
        setTime("");
      }
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [timezone]);

  if (!time) return null;
  return <span>{time}</span>;
}
