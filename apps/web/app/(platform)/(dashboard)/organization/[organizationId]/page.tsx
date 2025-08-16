"use client";

import BoardList from "app/(platform)/(dashboard)/board/[boardId]/_components/BoardList";
import { Separator } from "@/components/ui/separator";

import React, { Suspense } from "react";
import { Info } from "./_components/Info";

interface OrganizationIdProps {
  params: { organizationId: string };
}
const OrganizationIdPage = ({ params }: OrganizationIdProps) => {
  const { organizationId } = params;

  return (
    <div className="w-full mb-20">
      {/* <Info isPro={} /> */}
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
