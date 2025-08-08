import { OrganizationList } from "@clerk/nextjs";

const SelectOrgPage = () => {
  return (
    <div>
      SelectOrgPage
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={"/organization/:id"}
        afterSelectOrganizationUrl={"/organization/:id"}
      />
    </div>
  );
};

export default SelectOrgPage;
