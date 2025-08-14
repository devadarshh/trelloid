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
import { useEffect, useState } from "react";

type Board = {
  id: string;
  title: string;
};

const BoardList = () => {
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { orgId } = useOrganizationIdStore();
  const { refreshBoards } = useRefreshBoard();
  const { boards, setBoards, setCurrentBoard } = useGetBoardStore();
  useEffect(() => {
    if (!orgId) {
      console.warn("No orgId available yet. Waiting...");
      return;
    }
    const fetchAllBoards = async () => {
      try {
        const token = await getToken();
        setLoading(true);
        console.log("Fetching boards for orgId:", orgId);
        const response = await axios.get(
          "http://localhost:5000/api/v1/boards",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { orgId },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setBoards(response.data.data);
      } catch (error: any) {
        console.error(error.message || "Error Fetching All Board");
      } finally {
        setLoading(false);
      }
    };
    fetchAllBoards();
  }, [orgId, refreshBoards]);

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

        <Popover>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>
            {" "}
            <div
              role="button"
              className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
            >
              <p className="text-sm">Create new board</p>
              <span className="text-xs">
                {/* {isPro
                  ? "Unlimited"
                  : `${MAX_FREE_BOARDS - availableCount} remaining`} */}
                5 remaining
              </span>
              <Hint
                sideOffset={40}
                description={`
                Free Workspaces can have up to 5 open boards. For unlimited boards upgrade this workspace.
              `}
              >
                <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
              </Hint>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default BoardList;

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
