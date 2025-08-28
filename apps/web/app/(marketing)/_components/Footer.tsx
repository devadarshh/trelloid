import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full border-t bg-slate-100 p-4">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-3 items-center max-w-screen-2xl text-center md:text-left gap-4">
        {/* Logo (Left) */}
        <div className="flex justify-center md:justify-start">
          <Logo aria-label="Company Logo" />
        </div>

        {/* Credit (Middle) */}
        <div className="flex justify-center">
          <p className="flex items-center gap-1 text-sm text-slate-600">
            Made with <Heart className="w-3 h-3 text-red-500" /> by{" "}
            <a
              href="https://github.com/devadarshh"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline hover:text-slate-900"
            >
              Adarsh Singh
            </a>
          </p>
        </div>

        {/* Links (Right) */}
        <nav className="flex justify-center md:justify-end space-x-4">
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
