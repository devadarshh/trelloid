import { startCase } from "lodash";
import { auth } from "@clerk/nextjs/server";

import { OrgControl } from "./_components/OrgControl";
import { ProModal } from "components/modals/pro-modal";

export async function generateMetadata() {
  const { orgSlug } = await auth();

  return {
    title: startCase(orgSlug || "organization"),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
      <ProModal />
    </>
  );
};

export default OrganizationIdLayout;
