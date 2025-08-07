import React from "react";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <NavBar />
      {children}
      <Footer />
    </div>
  );
};

export default MarketingLayout;
