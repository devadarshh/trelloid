"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProModal } from "hooks/use-pro-modal";
import { useOrgProStore } from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useAuth } from "@clerk/nextjs";

export const SubscriptionButton: React.FC = () => {
  const { isPro } = useOrgProStore();
  const proModal = useProModal();
  const { orgId } = useOrganizationIdStore();
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();

  const handleClick = async () => {
    if (isPro) {
      setIsLoading(true);
      try {
        const token = await getToken();
        const { data } = await axios.post(
          `${process.env.BACKEND_URL}/stripe/redirect`,
          { orgId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        window.location.href = data.data;
      } catch (err: any) {
        const message =
          err.response?.data?.error || err.message || "Something went wrong!";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    } else {
      proModal.onOpen();
    }
  };
  return (
    <Button
      variant="primary"
      onClick={handleClick}
      disabled={isLoading}
      className="cursor-pointer"
    >
      {isPro ? "Manage subscription" : "Upgrade to pro"}
    </Button>
  );
};
