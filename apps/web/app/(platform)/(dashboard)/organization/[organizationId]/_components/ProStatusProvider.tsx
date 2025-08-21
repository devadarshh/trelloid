"use client";

import { useEffect } from "react";
import axios from "axios";
import { useOrgProStore } from "hooks/boardHooks/useStore";
import { useAuth } from "@clerk/nextjs";

interface Props {
  organizationId: string;
}

export const ProStatusProvider: React.FC<Props> = ({ organizationId }) => {
  const { setIsPro } = useOrgProStore();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!organizationId) return;

    const fetchProStatus = async () => {
      try {
        const token = await getToken();
        const res = await axios.get(
          `http://localhost:5000/api/v1/subscription-status?orgId=${organizationId}`,
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
  }, [organizationId, getToken, setIsPro]);

  return null;
};
