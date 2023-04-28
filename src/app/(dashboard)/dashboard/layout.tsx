import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

interface LayoutProps{
   children:ReactNode
}

const Layout=async({children}:LayoutProps)=>{
   const session=await getServerSession(authOptions);
   if(!session) notFound()

   return (
      <div className="w-full flex h-screen">
         <div className="w-full h-full flex max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <Link href='/dashboard' className="flex h-6 shrink-0 items-center">Logo</Link>
            {children}
         </div>
      </div>
   )
}

export default Layout;