import Link from "next/link";
import Image from "next/image";

export default function Component() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted p-1 text-center">
			<h1 className="text-9xl font-extrabold text-primary">404</h1>
			<button
				type="button"
				className="animate-pulse text-white bg-gradient-to-r from-pink-400 to-orange-400 py-3 px-2 rounded 2 text-gray-900"
			>
				<Link href="/">Escape to Safety (Homepage)</Link>
			</button>
			<p className="text-2xl font-semibold mt-4 mb-8 ">
				Oops! Looks like this page took an unexpected vacation.
			</p>
			<div className="relative w-full max-w-md aspect-square mb-8 rounded-lg overflow-hidden shadow-xl transform hover:rotate-180 transition-transform duration-[3s]">
				<Image
					src="/your_cooked.gif"
					alt="Funny 404 GIF"
					layout="fill"
					objectFit="cover"
					className="rounded-lg x-10"
				/>
			</div>
			<p className="text-xl mb-8 max-w-md">
				Don't worry, our team of highly trained sandwich artists are on it!
			</p>
		</div>
	);
}
