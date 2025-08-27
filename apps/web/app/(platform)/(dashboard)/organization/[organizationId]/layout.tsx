import { OrgControl } from "./_components/OrgControl";
import { ProModal } from "components/modals/pro-modal";
import { ProStatusProvider } from "./_components/ProStatusProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const OrganizationIdLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <ProStatusProvider />
      <OrgControl />
      {children}
      <ProModal />
    </>
  );
};

export default OrganizationIdLayout;
