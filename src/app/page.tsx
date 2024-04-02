'use client'

import { SignInButton, SignedOut, useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

import UploadFileDialog from "@/components/UploadFileDialog";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function PlaceHolder() {
  return <div className="flex flex-col justify-center items-center gap-6 min-h-[450px]">
  <Image alt="an image of a picture and directory icon" width={300} height={300} src={'/empty.svg'} />
  <p className="text-2xl mb-6">Your Have no files, upload one now</p>
  <UploadFileDialog />
</div>
}
 

export default function Home() {

  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")


  let orgId:string | undefined = undefined 

  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(
    api.files.getFiles, 
    orgId ? { orgId, query } : 'skip'
  )

  const isLoading = files === undefined


  return (
    <main className="container mx-auto py-12">
      <div className="flex gap-8">
        <div className="w-40 flex flex-col gap-3 justify-start">
          <Link href={'/dashboard/files'}>
            <Button variant={'link'} className="flex items-center gap-2">
              <FileIcon /> All Files
            </Button>
          </Link>
          <Link href={'/dashboard/favorites'}>
            <Button variant={'link'} className="flex items-center gap-2">
              <StarIcon /> Favorities
            </Button>
          </Link>
        </div>

        <div className="w-full">
          {!user.user && isLoading && (
            <div className="min-h-[450px] flex flex-col items-center justify-center text-center">
              <SignedOut>
                    <SignInButton mode="modal">
                    <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
                <p className="text-2xl mt-4 text-gray-600">Get started by signing in to upload files</p>
            </div>
          )}
          {(isLoading && user.user) && (
            <div className="min-h-[450px] flex flex-col items-center justify-center text-center">
              <Loader2 className="h-24 w-24 animate-spin text-gray-500" />
              <p className="text-2xl mt-4 text-gray-600">Loading...</p>
            </div>
          )}
          {
            !isLoading && (
              <>
                <div className="flex justify-between items-center mb-8">
                  <h1 className="text-4xl font-bold">Your Files</h1>
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
                    <FileCard key={file._id} file={file}/>
                  ))}
                </div>
              </>
            )
          }
        </div>
      </div>

    </main>
  );
}
