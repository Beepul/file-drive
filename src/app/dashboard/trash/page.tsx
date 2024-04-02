'use client'

import FileBrowser from "@/components/FileBrowser";

const page = () => {

    return(
       <div>
            <FileBrowser title="Your Favorites" deleteOnly />
       </div>
    )
}

export default page;