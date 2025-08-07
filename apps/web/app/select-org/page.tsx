import { OrganizationList } from "@clerk/nextjs";

const SelectOrgPage = () => {
  return (
    <div>
      SelectOrgPage
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={"/boards"}
        afterSelectOrganizationUrl={"/boards"}
      />
    </div>
  );
};

export default SelectOrgPage;
