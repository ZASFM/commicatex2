'use client'

import axios from "axios";
import { Check, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

interface FriendRequestsProps{
   incomingFriendRequests:IncomingFriendRequests[],
   sessionId:string
}

const FriendRequests:FC<FriendRequestsProps>=({
   incomingFriendRequests,
   sessionId
})=>{
   const [friendRequests,setFriendRequests]=useState<IncomingFriendRequests[]>(incomingFriendRequests);
   const router=useRouter();

   const acceptFriend=async(senderId:string)=>{
      await axios.post('api/requests/accept',{id:senderId});
      setFriendRequests(preVal=>preVal.filter(request=>request.senderId!==senderId));
      router.refresh();
   }

   const denyFriend=async(senderId:string)=>{
      await axios.post('api/requests/deny',{id:senderId});
      setFriendRequests(preVal=>preVal.filter(request=>request.senderId!==senderId));
      router.refresh();
   }


   return (
      <>
         {friendRequests.length===0?(
            <p className="text-sm text-zinc-500">Nothing to show here</p>
         ):(
            friendRequests.map(request=>{
               return (
                  <div key={request.senderId} className='flex gap-4 items-center '>
                     <UserPlus/>
                     <p className="font-medium text-lg">{request.senderEmail}</p>
                     <button className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md" aria-label="accept request">
                        <Check className="font-semibold text-white w-3/4 h-3/4"/>
                     </button>
                     <button className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md" aria-label="deny request">
                        <Check className="font-semibold text-white w-3/4 h-3/4"/>
                     </button>
                  </div>
               )
            })
         )}
      </>
   ) 
}

export default FriendRequests;