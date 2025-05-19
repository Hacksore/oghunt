export const GithubStar = () => {
  return (
    <a
      href="https://github.com/Hacksore/oghunt"
      target="_blank"
      rel="noopener noreferrer"
      className="relative mx-auto h-[50px] w-[300px] max-w-full overflow-hidden rounded-[50px] bg-neutral-100 text-center text-white dark:bg-black"
    >
      <div className="absolute inset-0 z-10 flex items-center justify-center text-[1.25rem] font-bold text-black dark:text-white">
        ✨ Star on Github
      </div>
      <div className="absolute left-1/2 top-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 animate-[rotate_2s_linear_infinite] bg-[conic-gradient(at_top,#fda4af_0%_25%,#fb923c_75%_100%)]" />
      <div className="absolute inset-[2px] h-[calc(100%-4px)] w-[calc(100%-4px)] rounded-[inherit] bg-[inherit]" />
    </a>
  );
};
