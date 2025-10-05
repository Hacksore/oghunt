"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface DateSelectorProps {
  currentDate: Date;
  className?: string;
}

export function DateSelector({ currentDate, className = "" }: DateSelectorProps) {
  const searchParams = useSearchParams();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  
  // Get the number of days in the current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Create array of days for the month
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Get previous and next month dates
  const prevMonth = new Date(year, month - 1, 1);
  const nextMonth = new Date(year, month + 1, 1);
  
  // Create URL with current search params but update date
  const createDateUrl = (targetDate: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', targetDate.toISOString().split('T')[0]); // YYYY-MM-DD format
    return `/list?${params.toString()}`;
  };
  
  // Create URL for previous/next month
  const createMonthUrl = (targetMonth: Date) => {
    const params = new URLSearchParams(searchParams);
    params.set('date', targetMonth.toISOString().split('T')[0]);
    return `/list?${params.toString()}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous month button */}
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="p-2"
      >
        <Link href={createMonthUrl(prevMonth)}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>
      
      {/* Days of the month */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {days.map((dayNum) => {
          const isSelected = dayNum === day;
          const dayDate = new Date(year, month, dayNum);
          const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0));
          
          return (
            <Button
              key={dayNum}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              asChild
              className={`min-w-[2.5rem] h-8 text-sm ${
                isSelected 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : isPast 
                    ? "text-gray-700 hover:text-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Link href={createDateUrl(dayDate)}>
                {dayNum}
              </Link>
            </Button>
          );
        })}
      </div>
      
      {/* Next month button */}
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="p-2"
      >
        <Link href={createMonthUrl(nextMonth)}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
