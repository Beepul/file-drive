import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

export function Header() {
    return <div className="border-b py-4 bg-gray-50">
        <div className="container mx-auto flex justify-between items-center">
            <div>FileDrive</div>
            <div className="flex gap-2 items-center">
                <OrganizationSwitcher />
                <UserButton />
                 <SignedIn>
                    <SignOutButton>
                    <Button>Sign Out</Button>
                    </SignOutButton>
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal">
                    <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </div>
    </div>
}