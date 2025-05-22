import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-neutral-300 bg-white dark:border-neutral-900 dark:bg-primary">
      <div className="container mx-auto px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="Oghunt Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">oghunt</span>
        </Link>
      </div>
    </header>
  );
}
