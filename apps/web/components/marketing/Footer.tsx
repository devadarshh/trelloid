import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer
      className="w-full p-4 border-t bg-slate-100"
      data-testid="footer_wrapper"
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <Logo />
        <div className="flex gap-4">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">
            Terms of Service
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
