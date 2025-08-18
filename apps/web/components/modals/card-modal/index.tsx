import { Dialog, DialogContent } from "@/components/ui/dialog";
import Description from "./Description";
import { useCardModal } from "hooks/cardHooks/useStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Header } from "./Header";
import { Actions } from "./Action";
import { Activity } from "./Activity"; // 👈 import Activity

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const { getToken } = useAuth();

  const [cardData, setCardData] = useState<any>(null);
  const [auditLogsData, setAuditLogsData] = useState<any[]>([]);
  const [isCardLoading, setCardLoading] = useState(false);
  const [isLogsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    if (!id || !isOpen) return;

    const fetchCardDetails = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        setCardLoading(true);
        const cardResponse = await axios.get(
          `http://localhost:5000/api/v1/card/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCardData(cardResponse.data.data);
      } catch (error: any) {
        console.error("Error fetching card:", error.response?.data || error);
      } finally {
        setCardLoading(false);
      }
    };

    const fetchAuditLogs = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        setLogsLoading(true);
        const auditResponse = await axios.get(
          `http://localhost:5000/api/v1/audit-logs/card/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        console.log("Audit Response data", auditResponse.data.data);
        setAuditLogsData(auditResponse.data.data);
      } catch (error: any) {
        console.error("Error fetching logs:", error.response?.data || error);
      } finally {
        setLogsLoading(false);
      }
    };

    fetchCardDetails();
    fetchAuditLogs();
  }, [id, isOpen, getToken]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {isCardLoading ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {isCardLoading ? (
                <Description.Skeleton />
              ) : (
                cardData && <Description data={cardData} />
              )}
              {isLogsLoading ? (
                <Activity.Skeleton />
              ) : (
                auditLogsData && <Activity items={auditLogsData} />
              )}
            </div>
          </div>
          {isCardLoading ? (
            <Actions.Skeleton />
          ) : (
            cardData && <Actions data={cardData} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
