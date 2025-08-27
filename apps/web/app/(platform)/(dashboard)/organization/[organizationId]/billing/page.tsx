"use client";
import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/Info";
import { SubscriptionButton } from "./_components/SubscribeButton";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { use, useEffect } from "react";

interface OrganizationIdProps {
  params: Promise<{ organizationId: string }>;
}

const BillingPage = ({ params }: OrganizationIdProps) => {
  const { organizationId } = use(params);
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
