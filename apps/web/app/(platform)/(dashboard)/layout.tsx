import { OrgNavBar } from "app/(platform)/(dashboard)/_components/OrgNavBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <OrgNavBar />
      {children}
    </div>
  );
};

export default DashboardLayout;
