const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" min-h-screen h-full flex items-center justify-center bg-slate-100 ">
      {children}
    </div>
  );
};

export default ClerkLayout;
