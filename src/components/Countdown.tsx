"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  hours?: number;
  minutes?: number;
  seconds?: number;
  variant?: "light" | "dark" | "red";
  size?: "sm" | "md";
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Countdown({
  hours = 14,
  minutes = 32,
  seconds = 8,
  variant = "light",
  size = "md",
}: CountdownProps) {
  const [time, setTime] = useState({ hours, minutes, seconds });

  useEffect(() => {
    const id = setInterval(() => {
      setTime((prev) => {
        let { hours: h, minutes: m, seconds: s } = prev;
        if (s > 0) s -= 1;
        else if (m > 0) {
          m -= 1;
          s = 59;
        } else if (h > 0) {
          h -= 1;
          m = 59;
          s = 59;
        } else {
          h = hours;
          m = minutes;
          s = seconds;
        }
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [hours, minutes, seconds]);

  const box =
    variant === "light"
      ? "bg-white text-tasino-blue shadow-sm"
      : variant === "red"
        ? "bg-white/95 text-tasino-blue"
        : "bg-white/15 text-white backdrop-blur-sm";

  const sep =
    variant === "light" || variant === "red"
      ? "text-white"
      : "text-white/80";

  const padSize =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : "h-11 w-11 text-sm sm:h-12 sm:w-12 sm:text-base";

  const units = [
    { label: "ثانیه", value: time.seconds },
    { label: "دقیقه", value: time.minutes },
    { label: "ساعت", value: time.hours },
  ];

  return (
    <div className="flex items-center gap-1.5 sm:gap-2" dir="ltr">
      {units.map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1.5 sm:gap-2">
          {i > 0 && <span className={`text-lg font-bold ${sep}`}>:</span>}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex items-center justify-center rounded-lg font-bold tabular-nums ${box} ${padSize}`}
            >
              {pad(unit.value)}
            </div>
            {size !== "sm" && (
              <span
                className={`text-[10px] ${
                  variant === "dark" ? "text-white/70" : "text-slate-500"
                }`}
              >
                {unit.label}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
