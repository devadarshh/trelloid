import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore, useRefreshBoard } from "hooks/boardHooks/useStore";
import { useRefreshCards } from "hooks/cardHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";
import { Layout } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

export const Header = ({ data }: any) => {
  const [updatedTitle, setUpdatedTitle] = useState(data?.title || "");
  const { setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const { triggerRefreshCards } = useRefreshCards();
  const { triggerRefreshLists } = useRefreshList();
  const inputRef = useRef<ElementRef<"input">>(null);

  if (!data) return <Header.Skeleton />;

  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  const handleRenameTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updatedTitle === data.title) {
      toast("No changes detected");
      return;
    }

    if (!updatedTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/update-card`,
        { cardId: data?.id, title: updatedTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      data.title = updatedTitle;
      toast.success("Title updated successfully");

      triggerRefreshLists();
      triggerRefreshBoards();
      triggerRefreshCards();
    } catch (error: any) {
      toast.error("Error renaming title");
      console.error(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form onSubmit={handleRenameTitle}>
          <Input
            ref={inputRef}
            onBlur={onBlur}
            id="title"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data?.list?.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};
