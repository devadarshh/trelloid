import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetBoardStore } from "hooks/boardHooks/useStore";
import React, { ElementRef, useRef, useState } from "react";

const BoardTitleForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const { currentBoard } = useGetBoardStore();
  const title = currentBoard?.title;

  function enableEditing() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  }
  const disableEditing = () => {
    setIsEditing(false);
  };
  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const handleRenameTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("renamed");
    disableEditing();
  };
  console.log(currentBoard);

  if (isEditing) {
    return (
      <form ref={formRef} onSubmit={handleRenameTitle}>
        <Input
          ref={inputRef}
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
      variant={"transparent"}
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;
