import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Delete, FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarHalf, StarIcon, TrashIcon } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useToast } from "./ui/use-toast"
import Image from "next/image"
import { Protect } from "@clerk/nextjs"


type Props = {
    file: Doc<'files'>
    favorites?: Doc<'favorites'>[]
    isFavorited?: (fileId: Id<'files'>) => boolean
}

function FileCardActions({file, isFavorited}: Props) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { toast } = useToast()

    const deleteFile = useMutation(api.files.deleteFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)

    let isFav = false 

    if(isFavorited){
        isFav = isFavorited(file._id)
    }
    return (
        <>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your file.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            deleteFile({fileId: file._id})
                            toast({
                                variant: 'default',
                                title: 'File Deleted',
                                description: 'Your file has been deleted.'
                            })
                        }}
                    >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem 
                        onClick={() => {
                            toggleFavorite({
                                fileId: file._id
                            })
                        }}
                        className="flex items-center gap-1 cursor-pointer">
                        {
                            isFav ? 
                            <>
                                <StarIcon  className="w-4 h-4 fill-yellow-600 stroke-yellow-600"/> Unfavorite
                            </>
                            : <>
                                <StarIcon className="w-4 h-4" /> Favorite
                            </>
                        }
                    </DropdownMenuItem>
                    {/* <Protect
                        role={'org:admin'}
                        fallback={<></>}
                    > */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => setIsConfirmOpen(true)}
                            className="flex items-center gap-1 text-red-600 cursor-pointer">
                            <TrashIcon className="w-4 h-4" />
                            Delete
                        </DropdownMenuItem>
                    {/* </Protect> */}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

function getFileUrl(fileId:Id<'_storage'>):string {
    // https://impressive-peccary-425.convex.cloud/api/storage/0570ed13-9604-4d02-bf91-af42acac3703
    // console.log(fileId)
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

const FileCard = ({file, favorites}: Props) => {

    const typeIcons = {
        'image': <ImageIcon />,
        'pdf': <FileTextIcon />,
        'csv': <GanttChartIcon />
    } as Record<Doc<'files'>['type'], ReactNode>


    const isFavorited = (fileId: Id<'files'>) => {
        if(!favorites){
            return false
        }                   
        return favorites.some(favorite => favorite.fileId === fileId)
    }

  return (
    <Card>
        <CardHeader className="relative">
            <CardTitle className="flex gap-2"><p>{typeIcons[file.type]}</p>{file.name} </CardTitle>
            <div className="absolute top-2 right-2"><FileCardActions isFavorited={isFavorited} file={file} /></div>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
            {
                file.type === 'image' && <Image alt={file.name} width={200} height={200} src={getFileUrl(file.fileId)} />
            }
            {
                file.type === 'csv' && <GanttChartIcon className="w-20 h-20" />
            }
            {
                file.type === 'pdf' && <FileTextIcon className="w-20 h-20" />
            }
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button onClick={() => {
                window.open(getFileUrl(file.fileId), '_blank')
            }}>Download</Button>
        </CardFooter>
    </Card>
  )
}

export default FileCard;