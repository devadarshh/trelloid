import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useLoadingStore, useRefreshBoard } from "hooks/boardHooks/useStore";
import { useRefreshCards } from "hooks/cardHooks/useStore";
import { useRefreshList } from "hooks/listHooks/useStore";
import { AlignLeft } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { descriptionSchema } from "schema/validationSchema";
import { toast } from "sonner";

interface DescriptionProps {
  data: {
    id: string;
    description?: string;
    [key: string]: any;
  };
}

const Description = ({ data }: DescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState(
    data.description || ""
  );
  const formRef = useRef<ElementRef<"form">>(null);
  const textareaRef = useRef<ElementRef<"textarea">>(null);

  const { setLoading } = useLoadingStore();
  const { getToken } = useAuth();
  const { triggerRefreshBoards } = useRefreshBoard();
  const { triggerRefreshCards } = useRefreshCards();
  const { triggerRefreshLists } = useRefreshList();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => setIsEditing(false);

  const handleUpdateCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updatedDescription === data.description) {
      toast("No changes detected");
      disableEditing();
      return;
    }

    try {
      await descriptionSchema.validate({ description: updatedDescription });

      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.put(
        `${process.env.BACKEND_URL}/api/v1/update-card`,
        { cardId: data.id, description: updatedDescription },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      toast.success("Description updated successfully");
      data.description = updatedDescription;

      triggerRefreshLists();
      triggerRefreshBoards();
      triggerRefreshCards();
    } catch (err: any) {
      if (err.name === "ValidationError") {
        toast.error(err.message);
      } else {
        toast.error("Error updating description");
      }
    } finally {
      setLoading(false);
      disableEditing();
    }
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form ref={formRef} onSubmit={handleUpdateCard} className="space-y-2">
            <Textarea
              id="description"
              onChange={(e) => setUpdatedDescription(e.target.value)}
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              value={updatedDescription}
              ref={textareaRef}
            />
            <div className="flex items-center gap-x-2">
              <Button className="cursor-pointer" type="submit">
                Save
              </Button>
              <Button
                className="cursor-pointer"
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md cursor-pointer hover:bg-neutral-300 transition-all"
          >
            {data.description || "Add a description..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Description;

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
