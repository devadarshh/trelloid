"use client";

import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import CreateBoardPopover from "./CreateBoardPopover";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";
const CreateBoard = ({ organizationId }: any) => {
  const { setOrgId } = useOrganizationIdStore();
  useEffect(() => {
    setOrgId(organizationId);
  }, []);
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <CreateBoardPopover />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CreateBoard;
