"use client";
import { Separator } from "@/components/ui/separator";
import { Info } from "../_components/Info";
import { SubscriptionButton } from "./_components/SubscribeButton";

const BillingPage = () => {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-2" />
      <SubscriptionButton />
    </div>
  );
};

export default BillingPage;
