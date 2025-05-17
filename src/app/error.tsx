"use client";
export default function Error() {
  return (
    <div className="mx-auto flex flex-col items-center gap-4 text-2xl font-bold">
      <h1>We ran out of money for the DB, please join the discord and fund us 🙏</h1>
      <a
        className="border-b border-[var(--background-start-rgb)] bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text pt-2 text-xl text-transparent duration-150 hover:border-black dark:border-black dark:from-pink-300 dark:to-orange-300 dark:hover:border-white"
        href="https://discord.com/servers/trash-devs-796594544980000808"
      >
        Trash Devs Discord
      </a>
      <img src="https://media1.tenor.com/m/dHVat9e2S38AAAAC/rat-cry-mouse-cutie.gif" />
    </div>
  );
}
