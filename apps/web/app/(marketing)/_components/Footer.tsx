import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-slate-100 p-4">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between max-w-screen-2xl">
        {/* Logo */}
        <div className="mb-4 md:mb-0">
          <Logo aria-label="Company Logo" />
        </div>

        {/* Links */}
        <nav className="flex space-x-4">
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Privacy Policy
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Terms of Service
          </Button>
        </nav>
      </div>
    </footer>
  );
};
