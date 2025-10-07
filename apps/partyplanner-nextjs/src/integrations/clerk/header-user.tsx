import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HeaderUser() {
  return (
    <div className="w-vw bg-white shadow-md">
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </div>
  );
}
