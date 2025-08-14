import React, { ElementRef, useRef, useState } from "react";
import { ListWrapper } from "./ListWrapper";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useBoardIdStore, useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateList, useRefreshList } from "hooks/listHooks/useStore";
import axios from "axios";
import { toast } from "sonner";

export const ListForm = () => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { getToken } = useAuth();
  const { BoardId } = useBoardIdStore();
  const { title, setTitle } = useCreateList();
  const { isLoading, setLoading } = useLoadingStore();
  const { triggerRefreshLists } = useRefreshList();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const handleCreateList = async () => {
    try {
      setLoading(true);
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
      triggerRefreshLists(true);
      toast.success(`List ${title} created`);
      disableEditing();
      setTitle("");
    } catch (error: any) {
      toast.error("Error Creating List");
    } finally {
      setLoading(false);
    }
  };
  if (isEditing) {
    return (
      <ListWrapper>
        <div
          ref={formRef}
          className={`w-full p-3 rounded-md bg-white space-y-4 shadow-md transition-opacity ${
            isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <Input
            ref={inputRef}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreateList();
              }
            }}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
          />
          <input hidden name="boardId" readOnly />
          <div className="flex items-center gap-x-1">
            <Button variant={"primary"} onClick={handleCreateList}>
              Add list
            </Button>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </ListWrapper>
    );
  }
  return (
    <ListWrapper>
      <Button
        variant="ghost"
        className="w-full flex items-center justify-start rounded-md bg-white/80 hover:bg-white/50 transition p-3 py-5 font-medium text-sm text-left cursor-pointer"
        onClick={enableEditing}
      >
        <Plus className="h-4 w-4 mr-4" />
        Add a list
      </Button>
    </ListWrapper>
  );
};
