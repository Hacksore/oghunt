import { SlopMeter } from "./slop-meter";

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
      <div className="text-sm text-neutral-500 dark:text-neutral-400">SlopMeter™</div>
    </div>
  );
}
