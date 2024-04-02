'use client'

import Link from "next/link";
import { Button } from "./ui/button";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const SideNav = () => {

    const pathname = usePathname()

    return(
        <div className="w-40 flex flex-col gap-3 justify-start">
            <Link href={'/dashboard/files'}>
            <Button variant={'link'} 
                className={clsx("flex items-center gap-2", {
                    'text-blue-600' : pathname.includes('/dashboard/files')
                })}>
                <FileIcon /> All Files
            </Button>
            </Link>
            <Link href={'/dashboard/favorites'}>
            <Button variant={'link'}
                className={clsx("flex items-center gap-2", {
                    'text-blue-600' : pathname.includes('/dashboard/favorites')
                })}
            >
                <StarIcon /> Favorities
            </Button>
            </Link>
            <Link href={'/dashboard/trash'}>
            <Button variant={'link'}
                className={clsx("flex items-center gap-2", {
                    'text-blue-600' : pathname.includes('/dashboard/trash')
                })}
            >
                <TrashIcon /> Trash
            </Button>
            </Link>
        </div>
    )
}

export default SideNav;