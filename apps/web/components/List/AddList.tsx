import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useBoardIdStore, useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateList, useRefreshList } from "hooks/listHooks/useStore";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

export function AddListButton() {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLDivElement>(null!);
  const { getToken } = useAuth();
  const { BoardId } = useBoardIdStore();
  const { title, setTitle } = useCreateList();
  const { isLoading, setLoading } = useLoadingStore();
  const { triggerRefreshLists } = useRefreshList();

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      formRef.current?.focus();
    });
  }
  function disableEditing() {
    setIsEditing(false);
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      disableEditing();
    }
  };
  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleCreateList = async () => {
    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:5000/api/v1/create-list",
        {
          boardId: BoardId,
          title,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("List Created", response.data);
      triggerRefreshLists(true);
    } catch (error: any) {
      console.log("3");
      console.error(error.message || "Error Creating List");
      console.log("4");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-64 min-w-[200px] p-1 flex-shrink-0">
      {isEditing ? (
        <div ref={formRef} className="bg-white/80 p-3 rounded-md shadow-sm">
          <Input
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="mb-2"
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleCreateList}>
              Create
            </Button>
            <Button size="sm" variant="ghost" onClick={disableEditing}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start rounded-md bg-white/80 hover:bg-white/50 transition p-3 font-medium text-sm text-left"
          onClick={enableEditing}
        >
          <Plus className="h-4 w-4 mr-4" />
          Add a list
        </Button>
      )}
    </div>
  );
}
