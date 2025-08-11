"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useGetBoardStore, useLoadingStore } from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { User2 } from "lucide-react";
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
  const { boards, setBoards, setCurrentBoard } = useGetBoardStore();
  useEffect(() => {
    console.log("BoardList mounted. orgId:", orgId);
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
  }, [orgId]);

  return (
    <div>
      <div>
        <User2 />
        Your boards
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <p> is loading</p>
        ) : (
          boards.map((board) => (
            <Link
              key={board.id}
              href={`/board/${board.id}`}
              onClick={() => setCurrentBoard(board)}
            >
              <div />
              <p className="relative font-semibold text-black">{board.title}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default BoardList;
