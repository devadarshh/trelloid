import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import CreateBoardPopover from "components/board/CreateBoardPopover";
import { Logo } from "components/Logo";
import { Plus } from "lucide-react"; // Trello-like icon
import React from "react";

const OrgNavBar = () => {
  return (
    <nav className="fixed z-50 top-0 left-0 w-full h-14 border-b shadow-sm bg-white px-4 flex items-center">
      {/* Left: Logo + Create */}
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="primary"
              size="icon"
              className="hidden md:inline-flex h-9 w-16 rounded-sm"
            >
              create
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64">
            <CreateBoardPopover />
          </PopoverContent>
        </Popover>
      </div>

      {/* Spacer pushes right side content */}
      <div className="flex-1" />

      {/* Right: Org switcher + Avatar */}
      <div className="flex items-center gap-x-3">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: "flex items-center",
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-[30px] w-[30px]",
            },
          }}
        />
      </div>
    </nav>
  );
};

export default OrgNavBar;
