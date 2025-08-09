import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <div className="flex items-center">
      <p>navbar</p>
      <OrganizationSwitcher hidePersonal />
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default NavBar;
