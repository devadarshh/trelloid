import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import {
  useGetBoardStore,
  useLoadingStore,
  useRefreshBoard,
} from "hooks/boardHooks/useStore";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const BoardTitleForm = () => {
  const { currentBoard, setCurrentBoard, boards, setBoards } =
    useGetBoardStore();
  const boardId = currentBoard?.id;
  const title = currentBoard?.title || "";

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const { getToken } = useAuth();
  const { setLoading } = useLoadingStore();
  const { triggerRefreshBoards } = useRefreshBoard();

  // Sync state with current board title whenever it changes
  useEffect(() => {
    setUpdatedTitle(title);
  }, [title]);

  // Update both the boards array and currentBoard

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const handleRenameTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!updatedTitle.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.put(
        "http://localhost:5000/api/v1/update-board",
        { boardId, title: updatedTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setBoards(
        boards.map((b) =>
          b.id === boardId ? { ...b, title: updatedTitle } : b
        )
      );
      if (currentBoard?.id === boardId) {
        setCurrentBoard({
          ...currentBoard,
          title: updatedTitle,
          id: currentBoard?.id,
          imageThumbUrl: currentBoard?.imageThumbUrl ?? "",
          imageFullUrl: currentBoard?.imageFullUrl ?? "",
        });
      }

      triggerRefreshBoards(true);
      toast.success("Board Renamed Successfully");
      console.log("Board Renamed successfully", response.data);
    } catch (error: any) {
      toast.error("Error Renaming Board");
      console.error(error.message || "Error Renaming Board");
    } finally {
      setLoading(false);
    }

    disableEditing();
  };

  if (isEditing) {
    return (
      <form ref={formRef} onSubmit={handleRenameTitle}>
        <Input
          ref={inputRef}
          value={updatedTitle}
          onChange={(e) => {
            const newTitle = e.target.value;
            setUpdatedTitle(newTitle);
          }}
          onBlur={onBlur}
          placeholder="Enter board title..."
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;
