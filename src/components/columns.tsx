"use client"

import { ColumnDef } from "@tanstack/react-table"
import { formatRelative } from 'date-fns'
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { FileCardActions } from "./FileActions"

function UserCell({userId} : { userId: Id<"users">}) {
    const userProfile = useQuery(api.users.getUserProfile, {
        userId
    })

    return <div className="flex items-center gap-2 text-xs text-gray-700">
        <Avatar className="w-8 h-8">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>{userProfile?.name}</AvatarFallback>
        </Avatar>
        {userProfile?.name}
    </div>
}

export const columns: ColumnDef<Doc<"files"> & {isFavorited: boolean}>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    header: 'User',
    cell({row}) {
        
        return <UserCell userId={row.original.userId} />
    },
  },
  {
    header: 'Uploaded On',
    cell({row}) {
        return <div>{formatRelative(new Date(row.original._creationTime), new Date())}</div>
    },
  },
  {
    header: 'Actions',
    cell({row}) {
        
        return <div>
            <FileCardActions file={row.original} isFavorited={() => row.original.isFavorited} />
        </div>
    },
  }
]
