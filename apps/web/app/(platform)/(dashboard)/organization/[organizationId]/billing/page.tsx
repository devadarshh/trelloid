"use client";
import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/Info";
import { SubscriptionButton } from "./_components/SubscribeButton";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { useEffect } from "react";

const BillingPage = ({ params }: any) => {
  const { organizationId } = params;
  const { setOrgId } = useOrganizationIdStore();

  useEffect(() => {
    setOrgId(organizationId);
  }, [organizationId, setOrgId]);
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <SubscriptionButton />
    </div>
  );
};

export default BillingPage;
