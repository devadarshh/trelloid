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
import { Header } from "./Header";
import { Actions } from "./Action";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const { isLoading, setLoading } = useLoadingStore();
  const { getToken } = useAuth();

  const [cardData, setCardData] = useState<any>(null);

  useEffect(() => {
    if (!id || !isOpen) return;

    const fetchCardDetails = async () => {
      try {
        const token = await getToken();

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
        setCardData(response.data.data);
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
        {isLoading ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {/* {!auditLogsData ? (
              <Activity.Skeleton />
            ) : (
              <Activity items={auditLogsData} />
            )} */}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
