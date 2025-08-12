import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "./MobileSideBar";
import CreateBoardPopover from "components/board/CreateBoardPopover";
import { Logo } from "components/Logo";
import { Plus } from "lucide-react"; // Trello-like icon
import React from "react";

const OrgNavBar = () => {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"primary"}
              size="sm"
              className="rounded-sm hidden md:block h-auto py-1.5 px-2 "
            >
              Create
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64">
            <CreateBoardPopover />
          </PopoverContent>
        </Popover>
        <Button size="sm" className="rounded-sm block md:hidden">
          <Plus className="h-4 w-4 " />
        </Button>
      </div>

      <div className="flex-1" />

      {/* Right: Org switcher + Avatar */}
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default OrgNavBar;
