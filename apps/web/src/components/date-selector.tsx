"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DateSelectorProps {
  currentDate: Date;
  className?: string;
}

export function DateSelector({ currentDate, className = "" }: DateSelectorProps) {
  const searchParams = useSearchParams();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();

  // Get today's date for comparison (in PST)
  // Product Hunt operates in PST, so we need to get the current PST date
  const now = new Date();
  const pstOffset = 8 * 60 * 60 * 1000; // PST is UTC-8
  const pstDate = new Date(now.getTime() - pstOffset);

  const todayYear = pstDate.getUTCFullYear();
  const todayMonth = pstDate.getUTCMonth();
  const todayDay = pstDate.getUTCDate();

  // Get the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create array of days for the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get previous and next month dates
  const prevMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);

  // Check if next month is in the future
  const isNextMonthFuture =
    nextMonth.getFullYear() > todayYear ||
    (nextMonth.getFullYear() === todayYear && nextMonth.getMonth() > todayMonth);

  // Create URL with current search params but update date
  const createDateUrl = (targetDate: Date) => {
    const params = new URLSearchParams(searchParams);
    // Format date as YYYY-MM-DD without timezone conversion
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    params.set("date", `${year}-${month}-${day}`);
    return `/list?${params.toString()}`;
  };

  // Create URL for previous/next month
  const createMonthUrl = (targetMonth: Date) => {
    const params = new URLSearchParams(searchParams);
    const year = targetMonth.getFullYear();
    const month = String(targetMonth.getMonth() + 1).padStart(2, "0");
    const day = String(targetMonth.getDate()).padStart(2, "0");
    params.set("date", `${year}-${month}-${day}`);
    return `/list?${params.toString()}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous month button */}
      <Button variant="ghost" size="sm" asChild className="p-2">
        <Link href={createMonthUrl(prevMonth)}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {/* Days of the month */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {days.map((dayNum) => {
          const isSelected = dayNum === day;
          const dayDate = new Date(year, month, dayNum);

          // Check if this day is in the future
          const isFuture =
            year > todayYear ||
            (year === todayYear && month > todayMonth) ||
            (year === todayYear && month === todayMonth && dayNum > todayDay);

          // Check if this day is today
          const isToday = year === todayYear && month === todayMonth && dayNum === todayDay;

          const isPast = !isFuture && !isToday;

          return (
            <Button
              key={dayNum}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              asChild={!isFuture}
              disabled={isFuture}
              className={`min-w-[2.5rem] h-8 text-sm ${
                isSelected
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : isFuture
                    ? "text-gray-300 cursor-not-allowed opacity-50"
                    : isPast
                      ? "text-gray-700 hover:text-gray-900"
                      : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {isFuture ? (
                <span>{dayNum}</span>
              ) : (
                <Link href={createDateUrl(dayDate)}>{dayNum}</Link>
              )}
            </Button>
          );
        })}
      </div>

      {/* Next month button */}
      <Button
        variant="ghost"
        size="sm"
        asChild={!isNextMonthFuture}
        disabled={isNextMonthFuture}
        className={`p-2 ${isNextMonthFuture ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isNextMonthFuture ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <Link href={createMonthUrl(nextMonth)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </Button>
    </div>
  );
}
