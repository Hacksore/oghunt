import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Component() {
  return (
    <div className="from-background to-muted flex min-h-screen flex-col items-center justify-center bg-gradient-to-b p-1 text-center">
      <h1 className="text-9xl font-extrabold">404</h1>
      <Button>
        <Link href="/">Escape to Safety (Homepage)</Link>
      </Button>
      <p className="mb-8 mt-4 text-2xl font-semibold">
        Oops! Looks like this page took an unexpected vacation.
      </p>
      <div className="relative mb-8 aspect-square w-full max-w-md transform overflow-hidden rounded-lg shadow-xl transition-transform duration-[3s] hover:rotate-180">
        <Image
          src="/your_cooked.gif"
          alt="Funny 404 GIF"
          layout="fill"
          objectFit="cover"
          className="x-10 rounded-lg"
        />
      </div>
      <p className="mb-8 max-w-md text-xl">
        Don't worry, our team of highly trained sandwich artists are on it!
      </p>
    </div>
  );
}
