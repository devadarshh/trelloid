import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore } from "hooks/boardHooks/useStore";
import { useCreateCard, useRefreshCards } from "hooks/cardHooks/useStore";
import { Plus, X } from "lucide-react";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
interface CardFormProps {
  listId: string;
}
const CardForm = ({ listId }: CardFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { getToken } = useAuth();
  const { title, setTitle } = useCreateCard();
  const { isLoading, setLoading } = useLoadingStore();
  const { triggerRefreshCards } = useRefreshCards();

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
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

  const handleCreateCard = async () => {
    if (!title?.trim()) return;
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
      toast.success(`Card ${title} Created`);
      triggerRefreshCards(true);
      setTitle("");
      disableEditing();
    } catch (err: any) {
      console.error("Error Creating Card");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div
        ref={formRef}
        className={cn(
          "m-1 py-0.5 px-1 space-y-4 transition-opacity duration-200",
          isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
        )}
      >
        <div className="space-y-2 w-full">
          <div className="space-y-1 w-full">
            <Textarea
              placeholder="Enter a title for this card"
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCard();
                }
              }}
              disabled={isLoading} // prevent typing while loading
              className={cn(
                "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm"
              )}
            />
          </div>
        </div>

        <input hidden id="listId" name="listId" readOnly />
        <div className="flex items-center gap-x-1">
          <Button
            onClick={handleCreateCard}
            size="sm"
            variant={"primary"}
            disabled={isLoading}
          >
            Add card
          </Button>
          <Button
            onClick={disableEditing}
            size="sm"
            variant={"ghost"}
            disabled={isLoading}
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
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
        size={"sm"}
        variant={"ghost"}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
    </div>
  );
};

export default CardForm;
