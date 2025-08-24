"use client";

import React, { ElementRef, useRef, useState, useEffect } from "react";
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
import { ListFormschema } from "schema/validationSchema";

export const ListForm = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const { getToken } = useAuth();
  const { BoardId } = useBoardIdStore();
  const { title, setTitle } = useCreateList();
  const { isLoading, setLoading } = useLoadingStore();
  const { triggerRefreshLists } = useRefreshList();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
    setError("");
    setTitle("");
  };

  const validateTitle = async (value: string) => {
    try {
      await ListFormschema.validate({ title: value });
      setError("");
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const handleCreateList = async () => {
    const isValid = await validateTitle(title);
    if (!isValid) return;

    try {
      setLoading(true);
      const token = await getToken();
      await axios.post(
        `${process.env.BACKEND_URL}/api/v1/create-list`,
        { boardId: BoardId, title },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      triggerRefreshLists();
      toast.success(`List "${title}" created`);
      disableEditing();
    } catch {
      toast.error("Error creating list");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  useEffect(() => {
    if (title) validateTitle(title);
  }, [title]);

  if (isEditing) {
    return (
      <ListWrapper>
        <div
          ref={formRef}
          className={`w-full p-3 rounded-md bg-white space-y-2 shadow-md transition-opacity ${
            isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter list title..."
            className="text-sm px-2 py-1 h-8 font-medium border border-gray-300 rounded focus:border-indigo-500 transition cursor-pointer"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-x-2">
            <Button
              variant="primary"
              onClick={handleCreateList}
              disabled={isLoading || !!error}
              className="cursor-pointer"
            >
              Add list
            </Button>
            <Button
              onClick={disableEditing}
              size="sm"
              variant="ghost"
              className="cursor-pointer"
            >
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
