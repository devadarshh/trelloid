"use client";

import { Button } from "@/components/ui/button";
import BoardList from "components/board/BoardList";
import CreateBoard from "components/board/CreateBoard";
import NavBar from "components/organization/OrgNavBar";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import React, { Suspense } from "react";
import OrgNavBar from "components/organization/OrgNavBar";

interface OrganizationIdProps {
  params: { organizationId: string };
}
const OrganizationIdPage = ({ params }: OrganizationIdProps) => {
  const { organizationId } = params;

  return (
    <div className="w-full mb-20">
      <OrgNavBar />
      <Separator className="my-4" />
      <div>
        <Suspense>
          <BoardList />
        </Suspense>
      </div>

      <CreateBoard organizationId={organizationId} />
    </div>
  );
};

export default OrganizationIdPage;
