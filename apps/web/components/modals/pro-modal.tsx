"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProModal } from "hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import { useUser } from "@clerk/nextjs"; // fetch user info
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useAuth } from "@clerk/nextjs";

export const ProModal = () => {
  const proModal = useProModal();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { orgId } = useOrganizationIdStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user || !orgId) {
      toast.error("User or Organization not found!");
      return;
    }

    try {
      const token = await getToken();
      setIsLoading(true);

      const res = await axios.post(
        `http://localhost:5000/api/stripe/redirect`,
        { orgId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const url = res.data.data;
      if (!url) throw new Error("No Stripe URL returned");
      window.location.href = url; // redirect to Stripe Checkout/Billing Portal
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error || err.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Trelloid Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            Explore the best of Trelloid
          </p>
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
            className="w-full"
            variant="primary"
          >
            {isLoading ? "Redirecting..." : "Upgrade"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
