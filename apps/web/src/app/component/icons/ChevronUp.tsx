type ChevronUpProps = { className: string };

export const ChevronUp = ({ className }: ChevronUpProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <title>Chevron Up</title>
    <path d="m18 15-6-6-6 6" />
  </svg>
);
