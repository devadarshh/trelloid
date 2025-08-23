"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateCard, useRefreshCards } from "hooks/cardHooks/useStore";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import * as Yup from "yup";
import { CardFormSchema } from "schema/validationSchema";

interface CardFormProps {
  listId: string;
}

const CardForm = ({ listId }: CardFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const { getToken } = useAuth();
  const { title, setTitle } = useCreateCard();
  const { isLoading, setLoading } = useLoadingStore();
  const { triggerRefreshCards } = useRefreshCards();

  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const disableEditing = () => {
    setIsEditing(false);
    setError("");
    setTitle("");
  };

  const validateTitle = async (value: string) => {
    try {
      await CardFormSchema.validate({ title: value });
      setError("");
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const handleCreateCard = async () => {
    const isValid = await validateTitle(title);
    if (!isValid) return;

    setLoading(true);
    try {
      const token = await getToken();
      await axios.post(
        "http://localhost:5000/api/v1/create-card",
        { listId, title },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      toast.success(`Card "${title}" created`);
      triggerRefreshCards();
      setTitle("");
      disableEditing();
    } catch {
      toast.error("Error creating card");
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
      <div
        ref={formRef}
        className={cn(
          "m-1 py-0.5 px-1 space-y-2 transition-opacity duration-200",
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        )}
      >
        <Textarea
          ref={inputRef}
          placeholder="Enter a title for this card"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleCreateCard();
            }
          }}
          disabled={isLoading}
          className="resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex items-center gap-x-1">
          <Button
            onClick={handleCreateCard}
            size="sm"
            variant="primary"
            disabled={isLoading || !!error}
            className="cursor-pointer"
          >
            Add card
          </Button>
          <Button
            onClick={disableEditing}
            size="sm"
            variant="ghost"
            disabled={isLoading}
            className="cursor-pointer"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-2 px-2">
      <Button
        onClick={enableEditing}
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm cursor-pointer"
        size="sm"
        variant="ghost"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
    </div>
  );
};

export default CardForm;
