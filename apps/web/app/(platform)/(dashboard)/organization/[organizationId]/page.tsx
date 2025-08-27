"use client";

import React, { Suspense, use, useEffect } from "react";
import { BoardList } from "app/(platform)/(dashboard)/board/[boardId]/_components/BoardList";
import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/Info";
import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";

interface OrganizationIdProps {
  params: Promise<{ organizationId: string }>;
}

const OrganizationIdPage: React.FC<OrganizationIdProps> = ({ params }) => {
  const { organizationId } = use(params);
  const { setOrgId } = useOrganizationIdStore();

  useEffect(() => {
    setOrgId(organizationId);
  }, [organizationId]);

  return (
    <div className="w-full mb-20">
      <Info />

      <Separator className="my-4" />

      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList organizationId={organizationId} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
