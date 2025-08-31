"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProModal } from "hooks/use-pro-modal";
import { useOrgProStore } from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useAuth } from "@clerk/nextjs";
import { redirectToStripe } from "utils/stripeRedirect";

export const SubscriptionButton: React.FC = () => {
  const { isPro } = useOrgProStore();
  const proModal = useProModal();
  const { orgId } = useOrganizationIdStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getToken } = useAuth();

  const handleClick = async () => {
    if (!orgId) return toast.error("Organization ID not found");

    if (isPro) {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) throw new Error("Missing token");
        await redirectToStripe(orgId, token);
      } catch (err) {
        let message = "Something went wrong!";
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.error ?? err.message;
        } else if (err instanceof Error) {
          message = err.message;
        }
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
