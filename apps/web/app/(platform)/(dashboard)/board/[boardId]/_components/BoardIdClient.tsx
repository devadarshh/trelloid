"use client";

import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useBoardIdStore } from "hooks/boardHooks/useStore";
import { useCreateListStore, useRefreshList } from "hooks/listHooks/useStore";
import { useRefreshCards } from "hooks/cardHooks/useStore";
import { useEffect, useState } from "react";
import { CardModal } from "components/modals/card-modal/index";
import { toast } from "sonner";
import ListContainer from "./ListContainer";

import { ListWithCards } from "types";

interface BoardIdClientProps {
  boardId: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

export default function BoardIdClient({ boardId }: BoardIdClientProps) {
  const { getToken } = useAuth();
  const { setBoardId } = useBoardIdStore();
  const [isLoading, setLoading] = useState<boolean>(false);

  const { refreshLists } = useRefreshList();
  const { lists, setLists } = useCreateListStore();
  const { refreshCards } = useRefreshCards();

  useEffect(() => {
    if (boardId) setBoardId(boardId);
  }, [boardId, setBoardId]);

  useEffect(() => {
    if (!boardId) return;

    const fetchAllLists = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const response = await axios.get<ApiResponse<ListWithCards[]>>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/lists`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { boardId },
            withCredentials: true,
          }
        );

        setLists(response.data.data);
      } catch (error: unknown) {
        const message =
          (axios.isAxiosError(error) && error.response?.data?.message) ||
          (error instanceof Error ? error.message : "Error fetching lists");

        toast.error(message);
        console.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLists();
  }, [boardId, refreshLists, refreshCards, getToken, setLists]);

  return (
    <div className="w-full h-[calc(100vh-7rem)] overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
      <div className="flex items-start gap-4 px-6 h-full">
        <ListContainer boardId={boardId} data={lists} />
        <CardModal />
      </div>
    </div>
  );
}
