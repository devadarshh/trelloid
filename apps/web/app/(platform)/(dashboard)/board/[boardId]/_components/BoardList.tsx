"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { Hint } from "components/Hint";
import {
  useGetBoardStore,
  useLoadingStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { HelpCircle, User2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import CreateBoardPopover from "./CreateBoardPopover";

const BoardList = ({ organizationId }: any) => {
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { orgId, setOrgId } = useOrganizationIdStore();
  const { resetRefresh, shouldRefresh } = useRefreshBoard();
  const { boards, setBoards, setCurrentBoard } = useGetBoardStore();

  // ✅ Set orgId once
  useEffect(() => {
    if (organizationId) {
      setOrgId(organizationId);
    }
  }, [organizationId, setOrgId]);

  // ✅ Fetch boards only on mount + when shouldRefresh === true
  useEffect(() => {
    if (!orgId) return;

    const fetchAllBoards = async () => {
      try {
        const token = await getToken();
        setLoading(true);

        const response = await axios.get(
          "http://localhost:5000/api/v1/boards",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { orgId },
            withCredentials: true,
          }
        );

        setBoards(response.data.data);
      } catch (error: any) {
        console.error(error.message || "Error fetching boards");
      } finally {
        setLoading(false);
        resetRefresh(); // ✅ clear refresh flag only after refetch
      }
    };

    if ((boards.length === 0 && !isLoading) || shouldRefresh) {
      fetchAllBoards();
    }
  }, [orgId, shouldRefresh]); // ✅ only these deps

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700 ">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <BoardList.Skeleton />
        ) : (
          boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              onClick={() => setCurrentBoard(board)}
              className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
              style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white">{board.title}</p>
            </Link>
          ))
        )}

        {/* ✅ Create board popover */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
              <span className="text-xs">5 remaining</span>
              <Hint
                sideOffset={40}
                description={`
          Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
        `}
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="center"
            sideOffset={18}
            side="bottom"
            avoidCollisions={false}
            className="w-80 max-h-[80vh] overflow-y-auto"
          >
            <CreateBoardPopover />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BoardList;

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="aspect-video h-full w-full p-2" />
      ))}
    </div>
  );
};
