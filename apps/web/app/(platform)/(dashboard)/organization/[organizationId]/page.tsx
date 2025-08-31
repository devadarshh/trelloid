"use client";

import React, { Suspense } from "react";
import { BoardList } from "app/(platform)/(dashboard)/board/[boardId]/_components/BoardList";
import { Separator } from "@/components/ui/separator";
import { Info } from "./_components/Info";

const OrganizationIdPage: React.FC = () => {
  return (
    <div className="w-full mb-20">
      <Info />

      <Separator className="my-4" />

      <div className="px-2 md:px-4">
        <Suspense fallback={<BoardList.Skeleton />}>
          <BoardList />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
