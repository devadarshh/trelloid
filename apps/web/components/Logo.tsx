import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
  display: "swap",
});

export const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="Trelloid Home"
      data-testid="logo"
      className="flex items-center gap-x-2 transition hover:opacity-80"
    >
      <Image
        src="/logo.svg"
        alt="Trelloid Logo"
        width={40}
        height={14}
        priority
      />
      <span
        className={cn(
          "text-lg font-semibold text-neutral-800 tracking-tight",
          headingFont.className
        )}
      >
        Trelloid
      </span>
    </Link>
  );
};
