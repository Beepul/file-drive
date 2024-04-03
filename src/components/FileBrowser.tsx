'use client'

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadFileDialog from "@/components/UploadFileDialog";
import FileCard from "@/components/FileCard";
import Image from "next/image";
import { GridIcon, Loader2, RowsIcon, TableIcon } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { DataTable } from "./FileTabel";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Doc } from "../../convex/_generated/dataModel";
import { Label } from "./ui/label";


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
    deleteOnly?: boolean
}

export default function FileBrowser({title,favoritesOnly, deleteOnly}: Props) {

  const organization = useOrganization()
  const user = useUser()
  const [query, setQuery] = useState("")
  const [type, setType] = useState<Doc<'files'>['type'] | 'all'>('all')


  let orgId:string | undefined = undefined 

  if(organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const favorites = useQuery(api.files.getAllFavorites, 
    orgId ? {orgId} : 'skip'
  )

  const files = useQuery(
    api.files.getFiles, 
    orgId ? { 
      orgId,
      type: type === 'all' ? undefined : type, 
      query, 
      favorites: favoritesOnly, 
      deleteOnly 
    } : 'skip'
  )

  const isLoading = files === undefined

  const modifiedFiles = files?.map(file => ({
    ...file,
    isFavorited: (favorites ?? []).some((favorite) => favorite.fileId === file._id)
  })) ?? []

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>
        <SearchBar setQuery={setQuery} query={query} />
        <UploadFileDialog />
      </div>
      <Tabs defaultValue="grid" >
        <div className="flex justify-between items-center">
          <TabsList className="mb-4">
            <TabsTrigger value="grid"><GridIcon /></TabsTrigger>
            <TabsTrigger value="table"><RowsIcon /></TabsTrigger>
          </TabsList>
          <div className="flex gap-2 items-center">
            <Label className="text-sm text-gray-700" htmlFor="type">Type Filter</Label>
            <Select  value={type} onValueChange={(newType) => {
                setType(newType as any)
              }}>
              <SelectTrigger id="type" className="w-[120px]" >
                <SelectValue  />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">Csv</SelectItem>
                <SelectItem value="pdf">Pdf</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {isLoading && (
          <div className="min-h-[450px] flex flex-col items-center justify-center text-center">
            <Loader2 className="h-24 w-24 animate-spin text-gray-500" />
            <p className="text-2xl mt-4 text-gray-600">Loading...</p>
          </div>
        )}
        <TabsContent value="grid">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {modifiedFiles?.map((file) => (
            <FileCard key={file._id} file={file}/>
          ))}
        </div>
        </TabsContent>
        <TabsContent value="table">
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
      </Tabs>
      {
        files?.length === 0 && (
          <PlaceHolder />
        )
      }
    </div>
  );
}
