import { Button } from "@/components/ui/button";
import BoardList from "components/board/BoardList";
import CreateBoard from "components/board/CreateBoard";
import NavBar from "components/organization/NavBar";
import Link from "next/link";

import { useOrganizationIdStore } from "hooks/organizaionHooks/useStore";
import React from "react";

interface OrganizationIdProps {
  params: Promise<{ organizationId: string }>;
}
const OrganizationIdPage = async ({ params }: OrganizationIdProps) => {
  const { organizationId } = await params;

  return (
    <div>
      <NavBar />
      <p>{organizationId}</p>
      <BoardList />
      <CreateBoard organizationId={organizationId} />
      <div className="flex items-center flex-col">
        <BoardList />

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <Button variant={"default"}>
          <Link href={"/board"}>Boards</Link>
        </Button>
        <Button variant={"default"}>
          <Link href={"/activity"}>Activity</Link>
        </Button>
        <Button variant={"default"}>
          <Link href={"/setting"}>Settings</Link>
        </Button>
        <Button variant={"default"}>
          <Link href={"/billing"}>Billings</Link>
        </Button>
      </div>
    </div>
  );
};

export default OrganizationIdPage;
