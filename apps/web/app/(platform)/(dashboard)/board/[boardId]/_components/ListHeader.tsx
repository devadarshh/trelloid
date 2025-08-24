"use client";

import React, { ElementRef, useRef, useState } from "react";
import ListOptions from "./ListOptions";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useLoadingStore } from "hooks/boardHooks/useStore";
import axios from "axios";
import { useCreateListStore } from "hooks/listHooks/useStore";
import { List } from "types";

interface ListHeaderProps {
  data: List;
}

const ListHeader = ({ data }: ListHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(data.title || "");

  const { getToken } = useAuth();
  const { setLoading } = useLoadingStore();
  const { setLists } = useCreateListStore();

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    if (isEditing) return;
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
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

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/update-list`,
        { listId: data.id, title: updatedTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === data.id ? { ...list, title: updatedTitle } : list
        )
      );

      toast.success("List renamed successfully");
    } catch {
      toast.error("Error renaming list");
    } finally {
      setLoading(false);
      disableEditing();
    }
  };

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form
          ref={formRef}
          onSubmit={handleRenameTitle}
          className="flex-1 px-[2px]"
        >
          <Input
            ref={inputRef}
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            onBlur={onBlur}
            id="title"
            placeholder="Enter list title..."
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent focus:border-input bg-transparent focus:bg-white truncate cursor-pointer"
          />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent cursor-pointer hover:bg-gray-100 rounded"
        >
          {data.title}
        </div>
      )}
      <ListOptions data={data} />
    </div>
  );
};

export default ListHeader;
