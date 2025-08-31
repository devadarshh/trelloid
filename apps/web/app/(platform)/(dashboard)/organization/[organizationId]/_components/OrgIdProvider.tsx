"use client";

import { useEffect } from "react";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";

interface OrgIdProviderProps {
  organizationId: string;
}

export const OrgIdProvider: React.FC<OrgIdProviderProps> = ({
  organizationId,
}) => {
  const { setOrgId } = useOrganizationIdStore();

  useEffect(() => {
    setOrgId(organizationId);
  }, [organizationId, setOrgId]);

  return null;
};
