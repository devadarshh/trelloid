"use client";

import { useEffect } from "react";
import { useOrgProStore } from "hooks/boardHooks/useStore";
import { useAuth } from "@clerk/nextjs";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import { api } from "@/lib/api";

export const ProStatusProvider: React.FC = () => {
  const { setIsPro } = useOrgProStore();
  const { getToken } = useAuth();
  const { orgId } = useOrganizationIdStore();

  useEffect(() => {
    if (!orgId) return;

    const fetchProStatus = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await api.get<{ isSubscribed: boolean }>(
          "/api/v1/subscription-status",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { orgId },
          }
        );

        setIsPro(res.data.isSubscribed);
      } catch {
        setIsPro(false);
      }
    };

    fetchProStatus();
  }, [orgId, getToken, setIsPro]);

  return null;
};
