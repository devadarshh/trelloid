"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import { List } from "@prisma/client";
import axios from "axios";
import {
  useBoardIdStore,
  useLoadingStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import { useRefreshCards } from "hooks/cardHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
  data: List;
}

const ListOptions = ({ data }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { triggerRefreshBoards } = useRefreshBoard();
  const { triggerRefreshCards } = useRefreshCards();
  const { triggerRefreshLists } = useRefreshList();
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { BoardId } = useBoardIdStore();
  const listId = data.id;

  const handleCopyList = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/copy-list`,
        { listId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("List copied successfully");
      triggerRefreshLists();
      triggerRefreshBoards();
      triggerRefreshCards();
      closeRef.current?.click();
    } catch {
      toast.error("Error copying list");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteList = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/delete-list`,
        {
          data: { boardId: BoardId, listId },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("List deleted successfully");
      triggerRefreshLists();
      closeRef.current?.click();
    } catch {
      toast.error("Error deleting list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2 cursor-pointer" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>

        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 cursor-pointer"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <div>
          <Button
            variant="ghost"
            disabled={isLoading}
            onClick={handleCopyList}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm cursor-pointer"
          >
            Copy list...
          </Button>
        </div>

        <Separator />

        <div>
          <Button
            variant="ghost"
            onClick={handleDeleteList}
            className={`rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer ${
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>Delete this list</span>
              <Trash2 className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
