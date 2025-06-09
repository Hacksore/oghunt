import { Info } from "lucide-react";
import { SlopMeter } from "./slop-meter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface SlopMeterSectionProps {
  aiPostsCount: number;
  nonAiPostsCount: number;
}

export function SlopMeterSection({ aiPostsCount, nonAiPostsCount }: SlopMeterSectionProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mx-auto mb-2 w-full">
        <SlopMeter
          propA={aiPostsCount}
          propB={nonAiPostsCount}
          nameA="AI"
          nameB="No AI"
          height={32}
        />
      </div>
      <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
        SlopMeter
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[160px] text-center">
                The SlopMeter shows the ratio of AI slop products vs products that don't us AI.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
