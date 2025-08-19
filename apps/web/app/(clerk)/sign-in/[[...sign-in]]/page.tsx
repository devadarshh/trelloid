import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox:
            "transform scale-95 sm:scale-100 md:scale-105 lg:scale-110 transition-transform duration-300",
        },
      }}
    />
  );
}
