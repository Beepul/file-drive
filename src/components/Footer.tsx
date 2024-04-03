import Link from "next/link";

const Footer = () => {
    return(
       <div className=" py-4 bg-gray-100 mt-12 flex items-center">
        <div className="container mx-auto flex items-center justify-between">
            <div className="font-semibold text-lg">FileDrive</div>
            <div className="flex items-center gap-4 text-sm">
                <Link className="text-gray-700 hover:text-blue-400 transition-all duration-300" href={'#'}>Privacy Policy</Link>
                <Link className="text-gray-700 hover:text-blue-400 transition-all duration-300" href={'#'}>Terms of Service</Link>
                <Link className="text-gray-700 hover:text-blue-400 transition-all duration-300" href={'#'}>About</Link>
            </div>
        </div>
       </div>
    )
}

export default Footer;