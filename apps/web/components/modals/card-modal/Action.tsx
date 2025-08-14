import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore, useRefreshBoard } from "hooks/boardHooks/useStore";
import { Copy, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useCardModal, useRefreshCards } from "hooks/cardHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";

export const Actions = ({ data }: any) => {
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const { triggerRefreshCards } = useRefreshCards();
  const { triggerRefreshLists } = useRefreshList();
  const { onClose } = useCardModal();
  const cardId = data.id;

  const handleCopyCard = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:5000/api/v1/copy-card",
        { cardId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("Card copied successfully");
      triggerRefreshLists(true);
      triggerRefreshBoards(true);
      triggerRefreshCards(true);
      onClose();
    } catch (error: any) {
      toast.error("Error Copying List");
      console.error(error.message || "Error Copying List");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCard = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.delete("http://localhost:5000/api/v1/delete-card", {
        data: { cardId },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success("Card Deleted Successfully");
      triggerRefreshBoards(true);
      triggerRefreshCards(true);
      triggerRefreshLists(true);
      onClose();
    } catch (error: any) {
      toast.error("Error Deleting Card");
      console.error(error.message || "Error Deleting Card");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        disabled={isLoading}
        onClick={handleCopyCard}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={handleDeleteCard}
        disabled={isLoading}
        variant="gray"
        className="w-full justify-start text-red-500 hover:bg-red-600 hover:text-white"
        size="inline"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};
Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
