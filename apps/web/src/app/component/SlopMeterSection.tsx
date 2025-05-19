import { SlopMeter } from "./SlopMeter";

interface SlopMeterSectionProps {
  aiPostsCount: number;
  nonAiPostsCount: number;
}

export function SlopMeterSection({ aiPostsCount, nonAiPostsCount }: SlopMeterSectionProps) {
  return (
    <div className="w-full">
      <h2 className="text-mg pb-2 font-bold md:text-lg">SlopMeter™</h2>
      <div className="mx-auto w-full">
        <SlopMeter
          propA={aiPostsCount}
          propB={nonAiPostsCount}
          nameA="AI"
          nameB="No AI"
          height={32}
        />
      </div>
      <div className="pt-2 opacity-60">projects launched today</div>
    </div>
  );
} 