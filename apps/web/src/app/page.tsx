"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

type CounterResponse = {
  count: number;
};

const POLL_INTERVAL_MS = 3_000;
const RETRY_DELAYS_MS = [0, 500, 1_000];
const COUNT_ANIMATION_MS = 420;

const FRIENDS = [
  { domain: "seanboult.dev", href: "https://seanboult.dev" },
  { domain: "bidwatch.app", href: "https://bidwatch.app" },
  { domain: "overlayed.dev", href: "https://overlayed.dev" },
  { domain: "flosa.app", href: "https://flosa.app" },
  { domain: "seattlesafeeats.com", href: "https://seattlesafeeats.com" },
  { domain: "splist.fm", href: "https://splist.fm" },
  {
    domain: "cook-around-find-out-v2.vercel.app",
    href: "https://cook-around-find-out-v2.vercel.app",
  },
];

type CountTransition = {
  from: number;
  to: number;
};

function RollingCount({ isLoading, value }: { isLoading: boolean; value: number }) {
  const visibleValueRef = useRef(value);
  const [transition, setTransition] = useState<CountTransition | null>(null);

  useEffect(() => {
    if (value === visibleValueRef.current) {
      return;
    }

    const from = visibleValueRef.current;
    visibleValueRef.current = value;
    setTransition({ from, to: value });

    const timeout = window.setTimeout(() => setTransition(null), COUNT_ANIMATION_MS);
    return () => window.clearTimeout(timeout);
  }, [value]);

  const restingValue = transition?.to ?? visibleValueRef.current;
  const direction = transition && transition.to > transition.from ? "up" : "down";

  return (
    <span className="rolling-count relative inline-block h-6 w-[9ch] shrink-0 overflow-hidden align-middle leading-6">
      {isLoading ? (
        <output
          aria-label="Loading respect count"
          className="absolute top-1/2 left-0 h-4 w-[4ch] -translate-y-1/2 animate-pulse rounded-sm bg-neutral-300 motion-reduce:animate-none dark:bg-neutral-700"
        />
      ) : transition ? (
        <>
          <span
            key={`old-${transition.from}-${transition.to}`}
            aria-hidden="true"
            className={`absolute inset-0 block text-left counter-roll-old-${direction}`}
          >
            {transition.from.toLocaleString()}
          </span>
          <span
            key={`new-${transition.from}-${transition.to}`}
            className={`absolute inset-0 block text-left counter-roll-new-${direction}`}
          >
            {transition.to.toLocaleString()}
          </span>
        </>
      ) : (
        <span className="block text-left">{restingValue.toLocaleString()}</span>
      )}
    </span>
  );
}

export default function Page() {
  const [celebration, setCelebration] = useState(0);
  const [showBidwatch, setShowBidwatch] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [confirmedCount, setConfirmedCount] = useState<number | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const submittingRef = useRef(false);

  const celebrate = useCallback(() => {
    setShowBidwatch(true);
    setCelebration((count) => count + 1);
    setPendingCount((count) => count + 1);
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "f" ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      celebrate();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [celebrate]);

  useEffect(() => {
    const refreshCount = async () => {
      if (document.visibilityState !== "visible" || submittingRef.current) {
        return;
      }

      try {
        const response = await fetch("/api/f");
        if (!response.ok) {
          throw new Error(`Counter request failed with ${response.status}`);
        }

        const data = (await response.json()) as CounterResponse;
        setConfirmedCount((count) => Math.max(count ?? 0, data.count));
      } catch {}
    };

    void refreshCount();
    const interval = window.setInterval(refreshCount, POLL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (pendingCount === 0 || submittingRef.current) {
      return;
    }

    submittingRef.current = true;

    const submitNextCount = async () => {
      for (const retryDelay of RETRY_DELAYS_MS) {
        if (retryDelay > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, retryDelay));
        }

        try {
          const response = await fetch("/api/f", { method: "POST" });
          if (!response.ok) {
            throw new Error(`Counter request failed with ${response.status}`);
          }

          const data = (await response.json()) as CounterResponse;
          setConfirmedCount((count) => Math.max(count ?? 0, data.count));
          setPendingCount((count) => Math.max(0, count - 1));
          submittingRef.current = false;
          return;
        } catch {
          // Retry brief network and service failures before dropping this queued press.
        }
      }

      setPendingCount((count) => Math.max(0, count - 1));
      submittingRef.current = false;
    };

    void submitNextCount();
  }, [pendingCount]);

  const displayedCount = (confirmedCount ?? 0) + pendingCount;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-100 px-4 py-16 text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50">
      {celebration > 0 && (
        <Confetti
          key={celebration}
          className="pointer-events-none fixed inset-0 z-50"
          width={viewport.width}
          height={viewport.height}
          numberOfPieces={500}
          recycle={false}
          gravity={0.18}
        />
      )}

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
              products are slop. We tried to fight the slop with slop and it obviously didn&apos;t
              work. It is very hard to tell something is high quality when so much of it is slop or
              uses AI.
            </p>
            <p>
              Effective July 2, 2026, this website is no longer in operation. Please pay your
              respects by pressing{" "}
              <button
                type="button"
                onClick={celebrate}
                className="inline-flex cursor-pointer items-center rounded-md border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-base font-semibold text-neutral-900 shadow-sm transition hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-50"
                aria-label="Press F to pay respects"
              >
                F
              </button>
              .
            </p>
            <p
              aria-live="polite"
              aria-atomic="true"
              className="text-center text-base text-neutral-500 tabular-nums dark:text-neutral-400"
            >
              <span className="inline-flex items-center gap-2">
                <span>Respects paid:</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  <RollingCount isLoading={confirmedCount === null} value={displayedCount} />
                </span>
              </span>
            </p>
            <p>
              We learned a lot during this project, but it can&apos;t go on forever. There are
              obviously things we could&apos;ve done to improve the product and make it less harmful
              to people&apos;s products, but that will not be happening at this point in time, and I
              am going to archive the repo. Bye.
            </p>
          </div>

          <div
            aria-live="polite"
            className={`grid transition-all duration-700 ${
              showBidwatch ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-500/10 via-white/70 to-accent/10 p-6 text-left dark:via-neutral-900/70">
                <p className="text-xs font-semibold tracking-[0.22em] text-blue-600 uppercase dark:text-blue-400">
                  One more thing
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  I launched{" "}
                  <a
                    className="text-accent underline decoration-accent/30 underline-offset-4"
                    href="https://bidwatch.app"
                  >
                    bidwatch.app
                  </a>
                </h2>
                <p className="mt-2 text-base leading-7 text-neutral-600 sm:text-lg dark:text-neutral-300">
                  Find and snipe all the things you want on eBay. The hunt continues over there.
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav aria-label="Friends of oghunt" className="mt-8 text-center">
          <p className="text-xs font-semibold tracking-[0.24em] text-neutral-500 uppercase dark:text-neutral-400">
            The homies &amp; what&apos;s next
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm">
            {FRIENDS.map((friend) => (
              <li key={friend.domain}>
                <a
                  href={friend.href}
                  className="text-neutral-600 underline decoration-neutral-400/50 underline-offset-4 transition hover:text-accent hover:decoration-accent dark:text-neutral-300"
                >
                  {friend.domain}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>
    </main>
  );
}
