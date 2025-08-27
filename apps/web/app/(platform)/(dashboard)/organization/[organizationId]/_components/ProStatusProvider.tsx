"use client";

import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
import { useOrgProStore } from "hooks/boardHooks/useStore";
import { useAuth } from "@clerk/nextjs";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";

interface SubscriptionStatusResponse {
  isSubscribed: boolean;
}

export const ProStatusProvider: React.FC = () => {
  const { setIsPro } = useOrgProStore();
  const { getToken } = useAuth();
  const { orgId } = useOrganizationIdStore();

  useEffect(() => {
    if (!orgId) return;

    const fetchProStatus = async () => {
      try {
        const token = await getToken();
        const res: AxiosResponse<SubscriptionStatusResponse> = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/subscription-status?orgId=${orgId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setIsPro(res.data.isSubscribed);
      } catch (err) {
        console.error("Failed to fetch Pro status", err);
        setIsPro(false);
      }
    };

    fetchProStatus();
  }, [orgId, getToken, setIsPro]);

  return null;
};
