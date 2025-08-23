"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "components/Logo";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 flex h-14 w-full items-center border-b bg-white px-4 shadow-sm z-50">
      <div className="mx-auto flex w-full items-center justify-between md:max-w-screen-2xl">
        {/* Logo */}
        <Logo />

        <div className="hidden md:flex items-center space-x-4">
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

        <button
          className="md:hidden flex items-center"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white shadow-md flex flex-col space-y-2 px-4 py-3 md:hidden">
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
      )}
    </nav>
  );
};
