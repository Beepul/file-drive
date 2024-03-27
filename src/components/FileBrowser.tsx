'use client'

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadFileDialog from "@/components/UploadFileDialog";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { api } from "../../convex/_generated/api";


function PlaceHolder() {
  return <div className="flex flex-col justify-center items-center gap-6 min-h-[450px]">
  <Image alt="an image of a picture and directory icon" width={300} height={300} src={'/empty.svg'} />
  <p className="text-2xl mb-6">Your Have no files, upload one now</p>
  <UploadFileDialog />
</div>
}
 
type Props = {
    title: string
    favoritesOnly?: boolean
}

export default function FileBrowser({title,favoritesOnly}: Props) {

  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")


  let orgId:string | undefined = undefined 

  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? {orgId} : 'skip'
  )

  const files = useQuery(
    api.files.getFiles, 
    orgId ? { orgId, query, favorites: favoritesOnly } : 'skip'
  )

  const isLoading = files === undefined


  return (
    <div className="w-full">
          {isLoading && (
            <div className="min-h-[450px] flex flex-col items-center justify-center text-center">
              <Loader2 className="h-24 w-24 animate-spin text-gray-500" />
              <p className="text-2xl mt-4 text-gray-600">Loading...</p>
            </div>
          )}
          {
            !isLoading && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold">{title}</h1>
                  <SearchBar setQuery={setQuery} query={query} />
                  <UploadFileDialog />
                </div>
                {
                  files?.length === 0 && (
                    <PlaceHolder />
                  )
                }
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
                  {files?.map((file) => (
                    <FileCard favorites={favorites} key={file._id} file={file}/>
                  ))}
                </div>
              </>
            )
          }
        </div>
  );
}
