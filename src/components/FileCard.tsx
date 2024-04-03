import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useQuery } from "convex/react"
import { formatRelative } from 'date-fns'
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react"
import Image from "next/image"
import { ReactNode } from "react"
import { api } from "../../convex/_generated/api"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { FileCardActions, getFileUrl } from "./FileActions"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

type Props = {
    file: Doc<'files'> & {isFavorited: boolean}
    favorites?: Doc<'favorites'>[]
    isFavorited?: (fileId: Id<'files'>) => boolean
}


const FileCard = ({file, favorites}: Props) => {

    const typeIcons = {
        'image': <ImageIcon className="w-5 h-5" />,
        'pdf': <FileTextIcon className="w-5 h-5" />,
        'csv': <GanttChartIcon  className="w-5 h-5"/>
    } as Record<Doc<'files'>['type'], ReactNode>


    const isFavorited = (fileId: Id<'files'>) => {
        if(!favorites){
            return false
        }                   
        return favorites.some(favorite => favorite.fileId === fileId)
    }

    const userProfile = useQuery(api.users.getUserProfile, {
        userId: file.userId
    })

  return (
    <Card>
        <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2 text-base font-normal capitalize"><p>{typeIcons[file.type]}</p>{file.name} </CardTitle>
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
        <CardFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-700">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={userProfile?.image} />
                    <AvatarFallback>{userProfile?.name}</AvatarFallback>
                </Avatar>
                {userProfile?.name}
            </div>
            <div className="flex gap-2 text-xs text-gray-700">
                Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
            </div>
            
        </CardFooter>
    </Card>
  )
}

export default FileCard;