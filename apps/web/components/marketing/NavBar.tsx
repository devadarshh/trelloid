import Link from "next/link";
import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <nav
      className="sticky top-0 z-50 w-full h-14 px-4 border-b shadow-sm bg-white flex items-center"
      data-testid="navbar_wrapper"
    >
      <div className="max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" asChild>
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button
            size="sm"
            className="bg-fuchsia-600 text-white hover:bg-fuchsia-700"
            asChild
          >
            <Link href="/sign-up">Get Taskify for free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
