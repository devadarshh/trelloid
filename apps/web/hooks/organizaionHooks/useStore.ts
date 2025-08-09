import { create } from "zustand";

interface OrganizationID {
  orgId: string;
  setOrgId: (newOrgId: string) => void;
}

export const useOrganizationIdStore = create<OrganizationID>((set) => ({
  orgId: "",
  setOrgId: (newOrgId) => set({ orgId: newOrgId }),
}));
