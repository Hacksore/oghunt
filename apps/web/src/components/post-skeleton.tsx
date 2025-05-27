export const PostSkeleton = () => {
  return (
    <div className="group flex w-full flex-row items-center rounded-2xl duration-300 md:gap-8 md:p-8">
      {/* Desktop iamge */}
      <div className="hidden md:flex md:self-start lg:self-center">
        <div className="relative size-10 object-contain lg:size-24">
          <svg
            className="text-[#88888820]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
      </div>

      {/* Phone image */}
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full gap-x-2 md:hidden">
          <div className="relative block size-10 object-contain md:hidden md:size-24">
            <svg
              className="text-[#88888820]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div className="flex w-full gap-2">
            <div className="mb-3 h-8 w-1/2 rounded-full bg-[#88888820] md:w-2/5" />
          </div>
        </div>

        <div className="mb-2 hidden h-10 w-2/5 rounded-full bg-[#88888820] md:block" />

        <div className="mb-2 h-3 w-11/12 rounded-full bg-[#88888820] md:h-5 md:w-3/5" />

        <div className="mb-2 flex w-full flex-wrap gap-x-2 md:mb-2">
          {Array.from({ length: 3 }).map(() => (
            <div
              key={`post-skeleton-pill-${crypto.randomUUID()}`}
              className="h-5 w-2/12 rounded-full bg-[#88888820] md:h-7 md:w-2/12"
            />
          ))}
        </div>

        <div className="mb-1 h-3 w-11/12 rounded-full bg-[#88888820] md:h-5" />
        <div className="mb-1 h-3 w-10/12 rounded-full bg-[#88888820] md:h-5" />
        <div className="mb-1 h-3 w-11/12 rounded-full bg-[#88888820] md:h-5" />
      </div>

      <div className="ml-auto hidden px-4 py-2 md:block">
        <div className="mb-6 size-10 rounded-full bg-[#88888820]" />

        <div className="mb-6 h-4 w-10 rounded-full bg-[#88888820]" />
      </div>
    </div>
  );
};
