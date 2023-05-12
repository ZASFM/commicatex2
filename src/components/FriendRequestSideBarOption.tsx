'use client'

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

type FriendRequestSideBarOptionProps={
   sessionId:string,
   initialUnseenRequestsCount:number
}

const FriendRequestSideBarOption:FC<FriendRequestSideBarOptionProps>=({
   sessionId,
   initialUnseenRequestsCount
})=>{
   const [unseenRequestCount,setUnseenRequestCount]=useState<number>(initialUnseenRequestsCount)

   useEffect(()=>{
      pusherClient.subscribe(toPusherKey(`use:${sessionId}:incoming_friend_request`));
      const friendRequestHandler=()=>{
         setUnseenRequestCount(preVal=>preVal+1);
      }
      pusherClient.bind('incoming_friend_request',friendRequestHandler);
      return ()=>{
         pusherClient.unsubscribe(toPusherKey(`use:${sessionId}:incoming_friend_request`));
         pusherClient.unbind('incoming_friend_request',friendRequestHandler);
      }
   },[]);

   return (
      <Link href='/dashboard/requests' className="text-gray-600 hover:text-indigo-700 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2  text-sm leading-6 font-semibold ">
         <div className="border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] bg-white font-medium">
            <User className="w-6 h-6"/>
         </div>
         <p className="truncate">Friend Requests</p>
         {
            unseenRequestCount>0?(
               <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">
                  {unseenRequestCount}
               </div>
            ):null
         }
      </Link>
   )
}

export default FriendRequestSideBarOption;