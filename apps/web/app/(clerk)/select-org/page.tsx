import { OrganizationList } from "@clerk/nextjs";

const SelectOrgPage = () => {
  return (
    <div>
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl={"/organization/:id"}
        afterSelectOrganizationUrl={"/organization/:id"}
      />
    </div>
  );
};

export default SelectOrgPage;
