export const Footer = () => {
  return (
    <footer className="mx-auto w-full py-8 text-center md:py-20 dark:text-gray-400">
      <div className="flex flex-col items-center">
        <a
          aria-label="github"
          target="_blank"
          rel="noreferrer"
          href="https://github.com/Hacksore/oghunt"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="1em"
            height="1em"
            fill="currentColor"
            className="h-6 w-6 opacity-100 duration-300 hover:opacity-60"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
          </svg>
        </a>
        <p className="mt-8 p-4">
          OGHUNT is an independent application and is not affiliated with or endorsed by{' '}
          <a
            aria-label="product-hunt"
            target="_blank"
            rel="noreferrer"
            href="https://www.producthunt.com"
            className="duration-300 hover:opacity-60"
          >
            Product Hunt
          </a>
        </p>
      </div>

      <div className="group flex flex-col items-center justify-center gap-2">
        <span className="flex items-center gap-2 dark:text-gray-400">
          <a
            target="_blank"
            className="text-sm duration-300 hover:underline"
            href="https://github.com/sponsors/Hacksore"
            rel="noreferrer"
          >
            Sponsor on the Hub
          </a>
          <div className="text-xs">|</div>
          <a
            target="_blank"
            className="text-sm duration-300 hover:underline"
            href="https://buymeacoffee.com/hacksore"
            rel="noreferrer"
          >
            Buy me a Coffee
          </a>
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap text-sm">
          Made with
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="lucide lucide-heart h-3.5 w-3.5 fill-current duration-300 ease-[cubic-bezier(0.175,0.885,0.32,2.275)] group-hover:scale-110 group-hover:text-red-500"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          by the
          <a
            target="_blank"
            className="text-sm duration-300 hover:underline"
            href="https://discord.com/servers/trash-devs-796594544980000808"
            rel="noreferrer"
          >
            Trash Devs Community
          </a>
        </span>
      </div>
    </footer>
  );
};
