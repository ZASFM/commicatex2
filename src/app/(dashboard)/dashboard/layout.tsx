import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/components/Icons";

interface LayoutProps{
   children:ReactNode
}

interface SidebarOption{
   id:number
   name:string
   href:string
   icon:Icon
}

const sidebarOptions:SidebarOption[]=[
   {
      id:1,
      name:'Add friend',
      href:'/dashboard/add',
      icon:'UserPlus'
   }
]

const Layout=async({children}:LayoutProps)=>{
   const session=await getServerSession(authOptions);
   if(!session) notFound()

   return (
      <div className="w-full flex h-screen">
         <div className="w-full h-full flex max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <Link href='/dashboard' className="flex h-6 shrink-0 items-center">
               <p className="h-8 w-auto text-indigo-600">ZASFM</p>
            </Link>
            <div className="text-sm text-gray-600 leading-6 font-semibold">
               Your chats:
            </div>
            <nav className="flex flex-1 flex-col">
               <ul className="flex flex-1 gap-y-7 flex-col" role='list'>
                  <li>//User chats</li>
                  <li>
                     <div className="text-sx font-semibold leading-6 text-gray-400">
                        Overview
                     </div>
                     <ul className="-mx-2 mt-2 space-y-1"></ul>
                  </li>
               </ul>
            </nav>
         </div>
         {children}
      </div>
   )
}

export default Layout;