"use client";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FiltersSectionProps {
  selectedDate: Date;
}

export function FiltersSection({ selectedDate }: FiltersSectionProps) {
  const searchParams = useSearchParams();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Create URL with current search params but update date
  const createDateUrl = (date: Date) => {
    const params = new URLSearchParams(searchParams);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    params.set('date', `${year}-${month}-${day}`);
    return `/list?${params.toString()}`;
  };

  // Get today's date for comparison (in PST)
  const now = new Date();
  const pstOffset = 8 * 60 * 60 * 1000; // PST is UTC-8
  const pstDate = new Date(now.getTime() - pstOffset);
  const today = new Date(pstDate.getUTCFullYear(), pstDate.getUTCMonth(), pstDate.getUTCDate());

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">Filters</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Select a date to view Product Hunt launches
          </p>
        </div>
        
        <div className="flex gap-2">
          {/* Date Filter */}
          <div className="relative">
            <Button
              variant="outline"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Button>
            
            {isCalendarOpen && (
              <div className="absolute top-full right-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-lg" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      setIsCalendarOpen(false);
                      // Navigate to the selected date
                      window.location.href = createDateUrl(date);
                    }
                  }}
                  disabled={(date) => {
                    // Disable future dates
                    return date > today;
                  }}
                  className="rounded-md"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Close calendar when clicking outside */}
      {isCalendarOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsCalendarOpen(false)}
        />
      )}
    </div>
  );
}
