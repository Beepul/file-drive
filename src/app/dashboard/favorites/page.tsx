'use client'

import FileBrowser from "@/components/FileBrowser";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const page = () => {

    return(
       <div>
            <FileBrowser title="Your Favorites" favoritesOnly />
       </div>
    )
}

export default page;