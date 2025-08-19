import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import {
  useGetBoardStore,
  useLoadingStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import { MoreHorizontal, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

const BoardOptions = () => {
  const { currentBoard } = useGetBoardStore();
  const { triggerRefreshBoards } = useRefreshBoard();
  const { setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const router = useRouter();

  const boardId = currentBoard?.id;
  const organizationId = currentBoard?.organizationId;

  const handleDeleteBoard = async () => {
    if (!boardId || !organizationId) return;

    try {
      setLoading(true);
      const token = await getToken();

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/delete-board`,
        {
          data: { boardId },
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Board Deleted Successfully");
      triggerRefreshBoards();

      setTimeout(() => {
        router.push(`/organization/${organizationId}`);
      }, 1500);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error Deleting Board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="h-auto w-auto p-2 cursor-pointer"
          variant="transparent"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-3">
          Board actions
        </div>

        <Separator className="mb-1" />

        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 cursor-pointer"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          onClick={handleDeleteBoard}
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div>Delete this board</div>
            <Trash2 className="h-4 w-4" />
          </div>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;
