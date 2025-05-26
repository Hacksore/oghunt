import { Link } from "./link";

export const Footer = () => {
  return (
    <footer className="mx-auto w-full py-8 text-center md:py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            aria-label="github"
            target="_blank"
            rel="noreferrer"
            className="text-white hover:text-white"
            href="https://github.com/Hacksore/oghunt"
          >
            Source code on Github
          </Link>
        </div>
        <p className="text-sm opacity-60">
          OGHUNT is an independent application and is not affiliated with or endorsed by{" "}
          <Link href="https://www.producthunt.com" className="font-bold">
            Product Hunt
          </Link>
        </p>
        <p className="text-sm opacity-60">
          © {new Date().getFullYear()} OGHUNT. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
