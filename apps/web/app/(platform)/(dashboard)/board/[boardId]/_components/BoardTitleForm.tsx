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
import { boardTitleSchema } from "schema/validationSchema";
import { toast } from "sonner";

const BoardTitleForm = () => {
  const { currentBoard, setCurrentBoard, boards, setBoards } =
    useGetBoardStore();
  const boardId = currentBoard?.id ?? "";
  const title = currentBoard?.title ?? "";

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [errorMessage, setErrorMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const { getToken } = useAuth();
  const { setLoading } = useLoadingStore();
  const { triggerRefreshBoards } = useRefreshBoard();

  useEffect(() => {
    setUpdatedTitle(title);
    setErrorMessage("");
  }, [title]);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus());
  };

  const disableEditing = () => {
    setIsEditing(false);
    setErrorMessage("");
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const handleRenameTitle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await boardTitleSchema.validate({ title: updatedTitle });

      setLoading(true);
      const token = await getToken();
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/update-board`,
        { boardId, title: updatedTitle },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
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
          id: currentBoard.id,
          imageThumbUrl: currentBoard.imageThumbUrl ?? "",
          imageFullUrl: currentBoard.imageFullUrl ?? "",
        });
      }

      triggerRefreshBoards();
      toast.success("Board Renamed Successfully");
      setErrorMessage("");
    } catch (error: any) {
      if (error.name === "ValidationError") {
        setErrorMessage(error.message);
        toast.error(error.message);
      } else {
        setErrorMessage("Error Renaming Board");
        toast.error("Error Renaming Board");
      }
    } finally {
      setLoading(false);
      disableEditing();
    }
  };

  if (isEditing) {
    return (
      <form
        ref={formRef}
        onSubmit={handleRenameTitle}
        className="flex flex-col"
      >
        <Input
          ref={inputRef}
          value={updatedTitle}
          onChange={(e) => setUpdatedTitle(e.target.value)}
          onBlur={onBlur}
          placeholder="Enter board title..."
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
        {errorMessage && (
          <span className="text-red-500 text-sm mt-1">{errorMessage}</span>
        )}
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2 cursor-pointer"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;
