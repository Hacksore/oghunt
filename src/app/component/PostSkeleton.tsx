export const PostSkeleton = () => {
  return (
    <div className="group flex w-full cursor-pointer flex-row items-center rounded-2xl duration-300 hover:bg-neutral-300/50 md:gap-8 md:p-8 dark:hover:bg-neutral-900">
      <div className="hidden lg:flex lg:items-center lg:gap-x-8">
        <div className="rounded-lg bg-neutral-700 lg:size-12 dark:bg-gray-700"></div>

        <div className="relative object-contain lg:size-24">
          <svg
            className="text-neutral-700 dark:text-gray-700"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
          </svg>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full gap-x-2 lg:hidden">
          <div className="relative block size-10 object-contain lg:hidden lg:size-24">
            <svg
              className="text-neutral-700 dark:text-gray-700"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
          <div className="flex w-full gap-2">
            <div className="mb-3 h-8 w-1/2 rounded-full bg-neutral-700 md:w-2/5 dark:bg-gray-700"></div>
          </div>
        </div>

        <div className="mb-2 hidden h-10 w-2/5 rounded-full bg-neutral-700 lg:block dark:bg-gray-700"></div>

        <div className="mb-2 h-3 w-11/12 rounded-full bg-neutral-700 md:h-5 md:w-3/5 dark:bg-gray-700"></div>

        <div className="mb-2 flex w-full flex-wrap gap-x-2 md:mb-4">
          {new Array(3).fill('').map((_, i) => (
            <div
              key={i}
              className="h-5 w-2/12 rounded-full bg-neutral-700 md:h-7 md:w-1/12 dark:bg-gray-700"
            ></div>
          ))}
        </div>

        <div className="mb-1 h-3 w-11/12 rounded-full bg-neutral-700 md:h-5 dark:bg-gray-700"></div>
        <div className="mb-1 h-3 w-10/12 rounded-full bg-neutral-700 md:h-5 dark:bg-gray-700"></div>
        <div className="mb-1 h-3 w-11/12 rounded-full bg-neutral-700 md:h-5 dark:bg-gray-700"></div>
      </div>

      <div className="ml-auto hidden rounded-lg bg-neutral-700 px-4 py-2 lg:block dark:bg-gray-700">
        <div className="mb-6 h-10 w-10 rounded-full bg-neutral-700 dark:bg-gray-700"></div>
      </div>
    </div>
  );
};
