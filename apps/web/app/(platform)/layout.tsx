import { Toaster } from "sonner";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

export default PlatformLayout;
