"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateCard, useRefreshCards } from "hooks/cardHooks/useStore";
import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

export function AddCard({ listId }: { listId: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { getToken } = useAuth();
  const { title, setTitle } = useCreateCard();
  const { isLoading, setLoading } = useLoadingStore();
  const { triggerRefreshCards } = useRefreshCards();

  function enableEditing() {
    setIsEditing(true);
    // focus next tick after render
    setTimeout(() => inputRef.current?.focus(), 0);
  }
  function disableEditing() {
    setIsEditing(false);
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") disableEditing();
  };
  useEventListener("keydown", onKeyDown);
  useOnClickOutside(wrapperRef, disableEditing);

  const handleCreateCard = async () => {
    if (!title?.trim()) return; // don't create empty cards
    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(
        "http://localhost:5000/api/v1/create-card",
        { listId, title },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      console.log("Card Created", response.data);
      triggerRefreshCards(true);
      setTitle("");
      disableEditing();
    } catch (err: any) {
      console.error(err?.message ?? "Error Creating Card");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 min-w-[200px] p-1 flex-shrink-0">
      {isEditing ? (
        <div ref={wrapperRef} className="bg-white/80 p-3 rounded-md shadow-sm">
          <Input
            // assumes your Input forwards ref and onChange properly
            ref={inputRef}
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            onKeyDown={(e) => e.key === "Enter" && handleCreateCard()}
            placeholder="Enter a title for this card..."
            className="mb-2"
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleCreateCard} disabled={isLoading}>
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
          Add a Card
        </Button>
      )}
    </div>
  );
}
