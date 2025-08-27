"use client";

import { useState } from "react";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useProModal } from "hooks/use-pro-modal";
import { useOrgProStore } from "hooks/boardHooks/useStore";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useAuth } from "@clerk/nextjs";

interface StripeRedirectResponse {
  data: string;
}

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
        const res: AxiosResponse<StripeRedirectResponse> = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/stripe/redirect`,
          { orgId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        window.location.href = res.data.data;
      } catch (err: unknown) {
        const message =
          (err as any)?.response?.data?.error ||
          (err as Error).message ||
          "Something went wrong!";
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
