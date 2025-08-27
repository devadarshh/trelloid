import { OrganizationProfile } from "@clerk/nextjs";

const SettingsPage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <OrganizationProfile
          routing="hash"
          appearance={{
            elements: {
              rootBox: {
                boxShadow: "none",
                width: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "0.5rem",
              },
              card: {
                border: "1px solid #e5e5e5",
                boxShadow: "none",
                width: "100%",
                borderRadius: "0.5rem",
                padding: "1.5rem",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
