import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const NavBar = () => {
  return (
    <div>
      <p>navbar</p>
      <div>
        <Button variant={"default"}>
          <Link href={"/sign-in"}>sign-in</Link>
        </Button>
        <Button variant={"default"}>
          <Link href={"/sign-up"}>sign-up</Link>
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
