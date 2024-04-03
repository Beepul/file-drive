import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Protect } from "@clerk/nextjs"
import { useMutation, useQuery } from "convex/react"
import { FileIcon, MoreVertical, StarIcon, TrashIcon, UndoIcon } from "lucide-react"
import { useState } from "react"
import { api } from "../../convex/_generated/api"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useToast } from "./ui/use-toast"

type Props = {
    file: Doc<'files'>
    favorites?: Doc<'favorites'>[]
    isFavorited?: (fileId: Id<'files'>) => boolean
}

export function FileCardActions({file, isFavorited}: Props) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const { toast } = useToast()

    const deleteFile = useMutation(api.files.deleteFile)
    const restoreFile = useMutation(api.files.restoreFile)
    const toggleFavorite = useMutation(api.files.toggleFavorite)
    const me = useQuery(api.users.getMe)
    

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
                        This action will mark the file for our deletion process. Files are deleted periodically.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            deleteFile({fileId: file._id})
                            toast({
                                variant: 'default',
                                title: 'File marked for deletion',
                                description: 'Your file will be deleted soon.'
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
                            window.open(getFileUrl(file.fileId), '_blank')
                        }}
                    >
                        <FileIcon className="w-4 h-4 mr-1"/> Download
                    </DropdownMenuItem>
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
                    
                    <Protect
                        condition={(check) => {
                            return check({
                                role: 'org:admin',
                            }) || file.userId === me?._id
                        }}
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                            onClick={() => {
                                if(file.shouldDelete){
                                    restoreFile({
                                        fileId: file._id
                                    })
                                }else {
                                    setIsConfirmOpen(true)
                                }
                            }}
                            className="flex items-center gap-1  cursor-pointer">
                            {file.shouldDelete ?  <> <UndoIcon className="w-4 h-4 text-green-600"  /> <span className="text-green-600">Restore</span></> :
                                <>
                                    <TrashIcon className="w-4 h-4 text-red-600" />
                                    <span className="text-red-600">Delete</span>
                                </>
                            }
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export function getFileUrl(fileId:Id<'_storage'>):string {
    // https://impressive-peccary-425.convex.cloud/api/storage/0570ed13-9604-4d02-bf91-af42acac3703
    // console.log(fileId)
    return `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${fileId}`
}

