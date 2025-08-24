import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";
import { useLoadingStore, useRefreshBoard } from "hooks/boardHooks/useStore";
import { useRefreshCards, useCardModal } from "hooks/cardHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";

interface ActionsProps {
  data: {
    id: string;
    [key: string]: any;
  };
}

export const Actions: React.FC<ActionsProps> & { Skeleton: React.FC } = ({
  data,
}) => {
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
      await axios.post(
        `${process.env.BACKEND_URL}/api/v1/copy-card`,
        { cardId },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      toast.success("Card copied successfully");
      triggerRefreshLists();
      triggerRefreshBoards();
      triggerRefreshCards();
      onClose();
    } catch {
      toast.error("Error copying card");
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

      await axios.delete(`${process.env.BACKEND_URL}/api/v1/delete-card`, {
        data: { cardId },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success("Card deleted successfully");
      triggerRefreshLists();
      triggerRefreshBoards();
      triggerRefreshCards();
      onClose();
    } catch {
      toast.error("Error deleting card");
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
        className="w-full justify-start cursor-pointer"
        size="inline"
      >
        <Copy className="h-4 w-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={handleDeleteCard}
        disabled={isLoading}
        variant="gray"
        className="w-full justify-start text-red-500 hover:bg-red-600 hover:text-white cursor-pointer"
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
