import { OrgControl } from "./_components/OrgControl";
import { ProModal } from "components/modals/pro-modal";
import { ProStatusProvider } from "./_components/ProStatusProvider";
import { OrgIdProvider } from "./_components/OrgIdProvider";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ organizationId: string }>;
}

const OrganizationIdLayout: React.FC<LayoutProps> = async ({
  children,
  params,
}) => {
  const { organizationId } = await params;
  return (
    <>
      <ProStatusProvider />
      <OrgControl />
      <OrgIdProvider organizationId={organizationId} />
      {children}
      <ProModal />
    </>
  );
};

export default OrganizationIdLayout;
