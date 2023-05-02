'use client'

import { User } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

type FriendRequestSideBarOptionProps={
   sessionId:string,
   initialUnseenRequestsCount:number
}

const FriendRequestSideBarOption:FC<FriendRequestSideBarOptionProps>=({
   sessionId,
   initialUnseenRequestsCount
})=>{
   const [unseenRequestCount,setUnseenRequestCount]=useState<number>(initialUnseenRequestsCount)

   return (
      <Link href='/dashboard/requests' className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2  text-sm leading-6 font-semibold ">
         <div className="border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] bg-white font-medium">
            <User className="w-6 h-6"/>
         </div>
         <p className="truncate">Friend Requests</p>
         {
            unseenRequestCount>0?(
               <div className="rounded-full w-5 h-5 flex text-xs justify-content items-center text-white bg-indigo-600">
                  {unseenRequestCount}
               </div>
            ):null
         }
      </Link>
   )
}

export default FriendRequestSideBarOption;