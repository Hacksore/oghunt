import { PostSkeleton } from "../components/post-skeleton";

export default function Loading() {
  return (
    <main className="flex min-h-screen w-full animate-pulse flex-col items-center">
      {/* Hero Section */}
      <header className="w-full flex flex-col justify-center items-center pt-4 pb-8 sm:py-20 px-4 relative overflow-clip">
        {/* Pill */}
        <div className="mb-5 w-32 h-6 rounded-full bg-[#88888820]" />

        {/* Heading */}
        <div className="flex flex-col items-center w-full mb-6">
          <div className="mb-2 h-10 w-3/4 rounded-full bg-[#88888820] sm:w-1/3 md:w-8/11 lg:w-3xl"/>
          <div className="mb-2 h-10 w-11/12 rounded-full bg-[#88888820] sm:w-2/3 md:w-1/3 lg:hidden" />
          <div className="h-10 w-4/5 rounded-full bg-[#88888820] sm:w-2/5 md:hidden" />
        </div>

        {/* Subheading */}
        <div className="flex flex-col items-center w-full max-w-2xl mb-8">
          <div className="mb-2 h-5 w-11/12 rounded-full bg-[#88888820] sm:w-4/6 md:w-11/12" />
          <div className="mb-2 h-5 w-9/12 rounded-full bg-[#88888820] sm:w-5/6 md:w-3/5" />
          <div className="mb-2 h-5 w-10/12 rounded-full bg-[#88888820] sm:hidden" />
          <div className="h-5 w-3/5 rounded-full bg-[#88888820] sm:hidden" />
        </div>

        {/* CTA Buttons */}
        <div className="w-full flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="h-10 w-[190px] rounded-md bg-[#88888820]"/>
          <div className="h-10 w-[154px] rounded-md bg-[#88888820]"/>
        </div>
      </header>

      <section className="mx-auto w-full flex flex-col items-center justify-center border-t border-neutral-500/40 px-4 pt-16 pb-12 bg-neutral-100 rounded-b-3xl dark:bg-neutral-950">
        <div className="h-[30px] mb-8 w-11/12 rounded-full bg-[#88888820] sm:w-2/3 md:w-[360px]"/>
        <div className="w-full max-w-4xl flex flex-col gap-10 overflow-hidden md:gap-4">
          {Array.from({ length: 3 }).map(() => (
            <PostSkeleton key={`post-skeleton-${crypto.randomUUID()}`} />
          ))}
        </div>

        <div className="w-full flex flex-col items-center mt-8">
          <div className="h-10 w-[163px] rounded-md bg-[#88888820]"/>
        </div>
      </section>
    </main>
  );
}
