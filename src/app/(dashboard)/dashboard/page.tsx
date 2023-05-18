import { getFriendsByUserId } from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db";
import { chatHrefConstructor } from "@/lib/utils";
import { Message } from "@/types/db";
import { ChevronRight } from "lucide-react";
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation";

const page=async()=>{
   const session=await getServerSession(authOptions);
   if(!session) notFound();

   const friends=await getFriendsByUserId(session.user.id);
   const friendsWithLastMessage=await Promise.all(
      friends?.map(async(friend)=>{
         const [lastmessage]=await fetchRedis('zrange',`chat:${chatHrefConstructor(session.user.id,friend.id)}:messages`,-1,-1) as Message[];
         return {
            ...friend,
            lastmessage
         }
      })
   )
   
   
   return (
      <div className="container py-12">
         <h1 className="font-bold text-5xl mb-8">Recent chats</h1>
         {
            friendsWithLastMessage.length===0?(
               <p className="text-sm text-zinc-500">Nothing to show</p>
            ):(
               friendsWithLastMessage.map(friend=>{
                  return (
                     <div key={friend.id} className='relative border border-zinc-200 bg-zinc-20 p-3 rounded-md'>
                         <div className="relative right-4 inset-y-0 flex items-center">
                           <ChevronRight/>
                         </div>
                     </div>
                  )
               })
            )
         }
      </div>
   )
}

export default page