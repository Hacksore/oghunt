export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100 px-4 py-16 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgb(255_73_91_/_0.18),_transparent_32%),radial-gradient(circle_at_bottom,_rgb(59_130_246_/_0.14),_transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      <section className="relative w-full max-w-3xl">
        <div className="rounded-[2rem] border border-neutral-200/80 bg-white/85 p-8 text-center shadow-2xl shadow-neutral-950/10 backdrop-blur sm:p-12 dark:border-neutral-800/80 dark:bg-neutral-900/80 dark:shadow-black/30">
          <div className="mx-auto mb-6 w-fit rounded-full border border-accent/20 bg-accent/10 px-4 py-1 text-sm font-medium tracking-[0.2em] text-accent uppercase">
            oghunt shutdown
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium tracking-[0.3em] text-neutral-500 uppercase dark:text-neutral-400">
              Effective July 2, 2026
            </p>
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
              <span className="bg-gradient-to-br from-accent via-accent to-blue-500 bg-clip-text text-transparent">
                Goodbye.
              </span>
            </h1>
          </div>

          <div className="mt-8 space-y-6 text-left text-lg leading-8 text-neutral-700 sm:text-xl dark:text-neutral-200">
            <p>
              This website was meant to show you useful things that happened on Product Hunt, but
              today is the day that we must take it down. Slop is affecting everything, but not all
              products are slop. We tried to fight the slop with slop and it obviously didn't work.
              It is very hard to tell something is high quality when so much of it is slop or uses
              AI.
            </p>
            <p>
              Effective July 2, 2026, this website is no longer in operation. Please pay your
              respects by pressing{" "}
              <span className="inline-flex items-center rounded-md border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-base font-semibold text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50">
                F
              </span>
              .
            </p>
            <p>
              We learned a lot during this project, but it can&apos;t go on forever. There are
              obviously things we could&apos;ve done to improve the product and make it less harmful
              to people&apos;s products, but that will not be happening at this point in time, and I
              am going to archive the repo. Bye.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
