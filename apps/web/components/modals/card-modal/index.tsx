import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Description from "./Description";
import { useCardModal } from "hooks/cardHooks/useStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLoadingStore } from "hooks/boardHooks/useStore";
import { useAuth } from "@clerk/nextjs";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const { setLoading } = useLoadingStore();
  const { getToken } = useAuth();

  const [cardData, setCardData] = useState<any>(null);

  useEffect(() => {
    console.log("Effect triggered with id:", id, "isOpen:", isOpen);

    // Run only if modal is open and id exists
    if (!id || !isOpen) return;

    const fetchCardDetails = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.error("No auth token found");
          return;
        }

        setLoading(true);
        console.log(`Fetching card details for ID: ${id}`);

        const response = await axios.get(
          `http://localhost:5000/api/v1/card/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        console.log("Raw response:", response.data.data);
        setCardData(response.data.data); // Make sure `data.data` exists
      } catch (error: any) {
        console.error("Error fetching card:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>{cardData?.title || "Card Details"}</DialogTitle>
        <DialogDescription>
          Update or view the details for this card.
        </DialogDescription>

        {cardData ? (
          <div className="space-y-4">
            <div>
              <strong>Title:</strong> {cardData.title}
            </div>
            <div>
              <strong>Description:</strong>{" "}
              {cardData.description || "No description yet"}
            </div>
            <div>
              <strong>List:</strong> {cardData.list?.title || "No list found"}
            </div>
          </div>
        ) : (
          <p>Loading card details...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
