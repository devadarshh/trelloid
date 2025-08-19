import Link from "next/link";
import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";

export const NavBar = () => {
  return (
    <nav className="fixed top-0 flex h-14 w-full items-center border-b bg-white px-4 shadow-sm">
      <div className="mx-auto flex w-full items-center justify-between md:max-w-screen-2xl">
        <Logo />
        <div className="flex w-full items-center justify-between space-x-4 md:block md:w-auto">
          <Button size="sm" variant="outline" asChild>
            <Link href="/sign-in" aria-label="Login">
              Login
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up" aria-label="Get Trelloid for free">
              Get Trelloid for free
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};
