"use client";

import { useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { User2 } from "lucide-react";

import { useLoadingStore, useRefreshBoard } from "hooks/boardHooks/useStore";
import { useGetBoardStore } from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import CreateBoardPopover from "./CreateBoardPopover";

export const BoardList = ({ organizationId }: { organizationId: string }) => {
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { orgId, setOrgId } = useOrganizationIdStore();
  const { resetRefresh, shouldRefresh } = useRefreshBoard();
  const { boards, setBoards, setCurrentBoard } = useGetBoardStore();

  useEffect(() => {
    if (organizationId) setOrgId(organizationId);
    setBoards([]);
  }, [organizationId, setOrgId]);

  useEffect(() => {
    if (!orgId) return;

    const fetchAllBoards = async () => {
      try {
        const token = await getToken();
        setLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/boards`,
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
        resetRefresh();
      }
    };

    if (boards.length === 0 || shouldRefresh) fetchAllBoards();
  }, [orgId, shouldRefresh]);

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
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

        <CreateBoardPopover />
      </div>
    </div>
  );
};

BoardList.Skeleton = function Skeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="aspect-video bg-gray-200 animate-pulse rounded-sm"
        />
      ))}
    </div>
  );
};
