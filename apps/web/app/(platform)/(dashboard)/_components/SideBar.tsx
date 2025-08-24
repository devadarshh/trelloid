"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";

import { NavItem, Organization } from "./NavItem";

interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>(
    storageKey,
    {}
  );

  const { organization: activeOrganization, isLoaded: isLoadedOrg } =
    useOrganization();

  const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const { addListener } = useClerk();

  const [organizations, setOrganizations] = useLocalStorage<Organization[]>(
    "t-sidebar-orgs",
    []
  );
  const [optimisticCreates, setOptimisticCreates] = useLocalStorage<string[]>(
    "t-sidebar-orgs-creates",
    []
  );
  const [tombstones, setTombstones] = useLocalStorage<string[]>(
    "t-sidebar-orgs-tombstones",
    []
  );

  useEffect(() => {
    if (!isLoadedOrgList || !userMemberships?.data) return;

    // Map server organizations safely
    const serverOrgs: Organization[] =
      userMemberships.data.map(({ organization }) => ({
        id: organization.id,
        slug: organization.slug ?? "",
        imageUrl: organization.imageUrl,
        name: organization.name,
      })) ?? [];

    let next: any[] = serverOrgs.filter((o) => !tombstones.includes(o.id));

    const optimisticOrgs = organizations.filter((o) =>
      optimisticCreates.includes(o.id)
    );
    next = [...next, ...optimisticOrgs];

    if (isLoadedOrg && activeOrganization) {
      const ao: Organization = {
        id: activeOrganization.id,
        slug: activeOrganization.slug ?? "",
        imageUrl: activeOrganization.imageUrl,
        name: activeOrganization.name,
      };
      if (!tombstones.includes(ao.id) && !next.some((o) => o.id === ao.id)) {
        next = [...next, ao];
      }
    }

    const same =
      organizations.length === next.length &&
      organizations.every((o, i) => o.id === next[i].id);

    if (!same) setOrganizations(next);

    if (tombstones.length) {
      const stillOnServer = new Set(serverOrgs.map((o) => o.id));
      const cleaned = tombstones.filter((id) => stillOnServer.has(id));
      const confirmedGone = tombstones.filter((id) => !stillOnServer.has(id));
      if (confirmedGone.length) {
        setTombstones((prev) =>
          prev.filter((id) => !confirmedGone.includes(id))
        );
      }
    }

    // Clean optimistic creates
    if (optimisticCreates.length) {
      const onServer = new Set(serverOrgs.map((o) => o.id));
      const cleanedCreates = optimisticCreates.filter(
        (id) => !onServer.has(id)
      );
      if (cleanedCreates.length !== optimisticCreates.length) {
        setOptimisticCreates(cleanedCreates);
      }
    }
  }, [
    isLoadedOrgList,
    userMemberships?.data,
    tombstones,
    optimisticCreates,
    organizations,
    isLoadedOrg,
    activeOrganization,
    setOrganizations,
    setOptimisticCreates,
    setTombstones,
  ]);

  useEffect(() => {
    const unsubscribe = addListener((event: any) => {
      if (event.type === "organization.created") {
        const newOrg: Organization = {
          id: event.data.id,
          slug: event.data.slug ?? "",
          imageUrl: event.data.imageUrl,
          name: event.data.name,
        };
        setOrganizations((prev) =>
          prev.some((o) => o.id === newOrg.id) ? prev : [...prev, newOrg]
        );
        setOptimisticCreates((prev) =>
          prev.includes(newOrg.id) ? prev : [...prev, newOrg.id]
        );
        setTombstones((prev) => prev.filter((id) => id !== newOrg.id));
      }

      if (event.type === "organization.deleted") {
        const deletedId: string = event.data.id;
        setOrganizations((prev) => prev.filter((o) => o.id !== deletedId));
        setTombstones((prev) =>
          prev.includes(deletedId) ? prev : [...prev, deletedId]
        );
        setOptimisticCreates((prev) => prev.filter((id) => id !== deletedId));
      }
    });

    return () => unsubscribe();
  }, [addListener, setOrganizations, setOptimisticCreates, setTombstones]);

  const defaultAccordionValue: string[] = Object.keys(expanded).filter(
    (key) => expanded[key]
  );

  const onExpand = (id: string) =>
    setExpanded((curr) => ({ ...curr, [id]: !curr[id] }));

  if (!isLoadedOrg || !isLoadedOrgList) {
    return (
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-10 w-[50%]" />
          <Skeleton className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
          <NavItem.Skeleton />
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto cursor-pointer"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {organizations.map((org) => (
          <NavItem
            key={org.id}
            isActive={activeOrganization?.id === org.id}
            isExpanded={!!expanded[org.id]}
            organization={org}
            onExpand={onExpand}
          />
        ))}
      </Accordion>
    </>
  );
};
