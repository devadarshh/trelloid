// app/(boards)/board/[boardId]/page.tsx
"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { AddListButton } from "components/List/AddList";
import RenderAllLists from "components/List/RenderAllLists";
import { useBoardIdStore, useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateListStore } from "hooks/listHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";
import { useEffect, useState } from "react";
import ListContainer from "./_components/ListContainer";
import { useRefreshCards } from "hooks/cardHooks/useStore";

interface BoardIdProps {
  params: { boardId: string };
}

export default function BoardIdPage({ params }: BoardIdProps) {
  const { getToken } = useAuth();
  const { boardId } = params;
  const { BoardId, setBoardId } = useBoardIdStore();
  const { setLoading } = useLoadingStore();
  const { refreshLists } = useRefreshList();
  const { lists, setLists } = useCreateListStore();
  const { refreshCards } = useRefreshCards();

  useEffect(() => {
    setBoardId(boardId);
  }, []);
  useEffect(() => {
    const fetchAllLists = async () => {
      if (!boardId) return;
      try {
        const token = await getToken();
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/v1/lists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { boardId },
          withCredentials: true,
        });
        console.log("data of all the cards", response.data.data);
        setLists(response.data.data);
      } catch (error: any) {
        console.error(error.message || "Error Fetching All Lists");
      } finally {
        setLoading(false);
      }
    };
    fetchAllLists();
  }, [boardId, refreshLists, refreshCards]);


  return (
    <div className="flex items-start gap-4 px-6 overflow-x-auto h-full mt-6">
      <ListContainer data={lists} />
      {/* <RenderAllLists /> */}
    </div>
  );
}
