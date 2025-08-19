"use client";

import React, { Suspense } from "react";
import { BoardList } from "app/(platform)/(dashboard)/board/[boardId]/_components/BoardList";
import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/Info";

interface OrganizationIdProps {
  params: { organizationId: string };
}

const OrganizationIdPage: React.FC<OrganizationIdProps> = ({ params }) => {
  const { organizationId } = params;

  return (
    <div className="w-full mb-20">
      {/* Optional Info component at the top */}
      <Info organizationId={organizationId} />

      {/* Separator */}
      <Separator className="my-4" />

      {/* Board list */}
      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList organizationId={organizationId} />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
