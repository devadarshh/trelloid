import { OrgControl } from "./_components/OrgControl";
import { ProModal } from "components/modals/pro-modal";
import { ProStatusProvider } from "./_components/ProStatusProvider";

interface LayoutProps {
  children: React.ReactNode;
  params: { organizationId: string };
}

const OrganizationIdLayout: React.FC<LayoutProps> = ({ children, params }) => {
  const { organizationId } = params;

  return (
    <>
      <ProStatusProvider organizationId={organizationId} />
      <OrgControl />
      {children}
      <ProModal />
    </>
  );
};

export default OrganizationIdLayout;
