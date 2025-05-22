import { SlopMeter } from "./slop-meter";

interface SlopMeterSectionProps {
  aiPostsCount: number;
  nonAiPostsCount: number;
}

export function SlopMeterSection({ aiPostsCount, nonAiPostsCount }: SlopMeterSectionProps) {
  return (
    <div className="w-full mt-12 flex flex-col items-center justify-center">
      <div className="mx-auto mb-2 w-full">
        <SlopMeter
          propA={aiPostsCount}
          propB={nonAiPostsCount}
          nameA="AI"
          nameB="No AI"
          height={32}
        />
      </div>
      <div className="text-sm dark:text-gray-500">SlopMeter™</div>
    </div>
  );
}
