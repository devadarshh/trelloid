"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useBoardIdStore, useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateListStore, useRefreshList } from "hooks/listHooks/useStore";
import { useRefreshCards } from "hooks/cardHooks/useStore";
import { useEffect } from "react";
import ListContainer from "./_components/ListContainer";
import { CardModal } from "components/modals/card-modal/index";
import { toast } from "sonner";

interface BoardIdProps {
  params: { boardId: string };
}

export default function BoardIdPage({ params }: BoardIdProps) {
  const { getToken } = useAuth();
  const { boardId } = params;

  const { setBoardId } = useBoardIdStore();
  const { setLoading } = useLoadingStore();
  const { refreshLists } = useRefreshList();
  const { lists, setLists } = useCreateListStore();
  const { refreshCards } = useRefreshCards();

  useEffect(() => {
    setBoardId(boardId);
  }, [boardId, setBoardId]);

  useEffect(() => {
    if (!boardId) return;

    const fetchAllLists = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/lists`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { boardId },
            withCredentials: true,
          }
        );

        setLists(response.data.data);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error.message ||
          "Error fetching lists";

        toast.error(message);
        console.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLists();
  }, [boardId, refreshLists, refreshCards, getToken, setLists, setLoading]);

  return (
    <div className="w-full h-[calc(100vh-7rem)] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <div className="flex items-start gap-4 px-6 h-full">
        <ListContainer boardId={boardId} data={lists} />
        <CardModal />
      </div>
    </div>
  );
}
