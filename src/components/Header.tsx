import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

export function Header() {

    return <div className="relative z-10 border-b py-4 bg-gray-50">
        <div className="container mx-auto flex justify-between items-center">
            <Link href={'/'} className="flex gap-2 items-center font-semibold tracking-widest">
                <Image src="/logo.png" width={40} height={40} alt="file drive logo" />
                FileDrive
            </Link>
            <SignedIn>
                <Button variant={'outline'}>
                    <Link href={'/dashboard/files'}>Your Files</Link>
                </Button>
            </SignedIn>
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