"use client";

import BoardList from "components/board/BoardList";
import CreateBoard from "components/board/CreateBoard";
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
          <BoardList />
        </Suspense>
      </div>

      <CreateBoard organizationId={organizationId} />
    </div>
  );
};

export default OrganizationIdPage;
