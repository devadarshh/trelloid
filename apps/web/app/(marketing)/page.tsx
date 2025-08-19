import Link from "next/link";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { Medal } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const headingFont = localFont({
  src: "../../public/fonts/font.woff2",
  display: "swap",
});

const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const MarketingPage = () => {
  return (
    <main className="flex flex-col items-center justify-center px-4 py-8">
      <section
        className={cn(
          "flex flex-col items-center justify-center text-center",
          headingFont.className
        )}
      >
        <div
          className="mb-4 flex items-center rounded-full border bg-amber-100 p-4 text-amber-700 shadow-sm uppercase"
          data-testid="main_award"
          aria-label="Top award badge"
        >
          <Medal className="mr-2 h-6 w-6" aria-hidden="true" />
          No. 1 Task Management
        </div>

        <h1 className="mb-6 text-3xl text-neutral-800 md:text-6xl">
          Trelloid helps teams move
        </h1>

        <p
          className="w-fit rounded-md bg-gradient-to-r from-fuchsia-600 to-pink-600 px-4 py-2 text-3xl text-white md:text-6xl"
          data-testid="main_subtitle"
        >
          work forward.
        </p>
      </section>

      <p
        className={cn(
          "mx-auto mt-4 max-w-xs text-center text-sm text-neutral-400 md:max-w-2xl md:text-xl",
          textFont.className
        )}
        data-testid="main_description"
      >
        Collaborate, manage projects, and reach new productivity peaks. From
        high-rises to the home office, the way your team works is unique —
        accomplish it all with Trelloid.
      </p>

      <Button className="mt-6" size="lg" asChild data-testid="main_button">
        <Link href="/sign-up" aria-label="Get Trelloid for free">
          Get Trelloid for free
        </Link>
      </Button>
    </main>
  );
};

export default MarketingPage;
