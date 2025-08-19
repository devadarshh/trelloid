import { ReactNode } from "react";
import { Footer } from "./_components/Footer";
import { NavBar } from "./_components/NavBar";

interface MarketingLayoutProps {
  children: ReactNode;
}

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <NavBar />
      <main className="flex-1 pt-40 pb-20 bg-slate-100">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
