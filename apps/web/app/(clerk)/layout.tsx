const ClerkLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
};

export default ClerkLayout;
