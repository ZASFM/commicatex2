import AddFriendButton from "@/components/AddFriendButton";
import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { User } from "@/types/db";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";


const page=async()=>{
   const session=await getServerSession(authOptions);
   if(!session) notFound();

   const incomingSenderIds=await (fetchRedis('smembers',`user:${session.user.id}:incoming_friend_request`)) as string[];
   const incomingFriendRequests=await Promise.all(
      incomingSenderIds.map(async(id)=>{
         const sender=await fetchRedis('get',`user:${id}`) as string;
         const senderParsed=JSON.parse(sender)
         return {
            senderId:id,
            senderEmail:senderParsed.email
         }
      })
   )

   return (
      <main className="pt-8">
         <h1 className="font-bold text-3xl mb-8">Add a friend</h1>
         <div className="flex flex-col gap-4">
            <FriendRequests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
         </div>
      </main>
   )
}

export default page;