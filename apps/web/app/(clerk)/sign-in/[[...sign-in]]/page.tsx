import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-neutral-50">
      <SignIn
        appearance={{
          elements: {
            rootBox:
              "transform scale-90 sm:scale-95 md:scale-100 lg:scale-105 transition-transform duration-300",
          },
        }}
      />
    </div>
  );
}
