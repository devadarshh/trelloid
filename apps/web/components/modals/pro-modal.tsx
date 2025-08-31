"use client";

import Image from "next/image";
import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { useProModal } from "hooks/use-pro-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUser, useAuth } from "@clerk/nextjs";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { redirectToStripe } from "utils/stripeRedirect";

interface AxiosErrorLike {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
}

export const ProModal = (): JSX.Element => {
  const proModal = useProModal();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { orgId } = useOrganizationIdStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleUpgrade = async (): Promise<void> => {
    if (!user || !orgId) {
      toast.error("User or Organization not found!");
      return;
    }

    try {
      setIsLoading(true);

      const token = await getToken();
      if (!token) throw new Error("Missing token");

      await redirectToStripe(orgId, token);
    } catch (err: unknown) {
      const error = err as AxiosErrorLike | Error;
      const message =
        (error as AxiosErrorLike)?.response?.data?.error ||
        error.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={proModal.isOpen}
      onOpenChange={(open: boolean) =>
        open ? proModal.onOpen() : proModal.onClose()
      }
    >
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image
            src="/hero.svg"
            alt="Hero"
            className="object-cover"
            fill
            priority
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <DialogTitle className="font-semibold text-xl">
            Upgrade to Trelloid Pro Today!
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold text-neutral-600">
            Explore the best of Trelloid
          </DialogDescription>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            disabled={isLoading}
            onClick={handleUpgrade}
            className="w-full cursor-pointer"
            variant="primary"
          >
            {isLoading ? "Redirecting..." : "Upgrade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
