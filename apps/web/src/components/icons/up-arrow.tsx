type UpArrowProps = {
  className: string;
  gradient?: boolean;
};

export const UpArrow = ({ className }: UpArrowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <title>Up Arrow</title>
      <defs>
        {/** biome-ignore lint/correctness/useUniqueElementIds: shut up lil bro */}
        <linearGradient id="gradient" x1="0%" x2="100%" y1="0%" y2="0%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>

      <path d="M9 18v-6H5l7-7 7 7h-4v6H9z" className="fill-accent" />
    </svg>
  );
};
