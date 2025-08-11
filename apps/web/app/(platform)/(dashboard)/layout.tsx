import OrgNavBar from "components/organization/OrgNavBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      {/* <OrgNavBar /> */}
      {children}
    </div>
  );
};

export default DashboardLayout;
