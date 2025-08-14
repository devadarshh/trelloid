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
import { useBoardIdStore, useLoadingStore } from "hooks/boardHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ListOptionsProps {
  data: List;
}

const ListOptions = ({ data }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { triggerRefreshLists } = useRefreshList();
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { BoardId } = useBoardIdStore();
  console.log("Board id is ssdfasfasf", BoardId);
  const listId = data.id;
  console.log("list id is", listId);

  const handleDeleteList = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      await axios.delete("http://localhost:5000/api/v1/delete-list", {
        data: {
          boardId: BoardId,
          listId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      toast.success("List Deleted Successfully");
      triggerRefreshLists(true);
    } catch (error: any) {
      toast.error("Error Deleting List");
      console.error(error.message || "Error Deleting List");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2 cursor-pointer" variant="ghost">
          <MoreHorizontal className="h-4 w-4 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>
        <form>
          <input hidden />
          <input hidden />
          <Button
            variant={"ghost"}
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          >
            Copy list...
          </Button>
        </form>
        <Separator />
        <div>
          <input hidden />
          <input hidden />
          <Button
            variant="ghost"
            onClick={handleDeleteList}
            className={`rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-red-500 hover:bg-red-50 hover:text-red-600 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
          >
            <div className="flex items-center justify-between w-full">
              <div>Delete this list</div>
              <div>
                <Trash2 className="h-4 w-4" />
              </div>
            </div>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
