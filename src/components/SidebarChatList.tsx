'use client'

import { Message } from "@/types/db";
import { User } from "@/types/db";
import { FC, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { pusherClient } from "@/lib/pusher";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";

type SideBarChatListProps = {
   friends: User[] | undefined,
   session: string
}

interface ExtendedMessage extends Message{
   senderImg:string,
   sederName:string
}

const SidebarChatList: FC<SideBarChatListProps> = ({ friends, session }) => {
   const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
   const router = useRouter();
   const pathname = usePathname();

   useEffect(()=>{
      pusherClient.subscribe(toPusherKey(`user:${session}:chats`));
      pusherClient.subscribe(toPusherKey(`user:${session}:friends`));
 
      const messageHandler=(message:ExtendedMessage)=>{
         const shouldNotify=pathname!==`/dashboard/chat/${chatHrefConstructor(session,message.senderId)}`;
         if(!shouldNotify) return;

         toast.custom((t)=>(
            <UnseenChatToast
               t={t}
               senderId={message.senderId}
               sessionId={session}
               senderName={message.sederName}
               senderMessage={message.text}
               senderImg={message.senderImg}
            />
         ));

         setUnseenMessages(preVal=>[...preVal,message]);
      }

      const friendHandler=()=>{
         router.refresh();
      }
      
      pusherClient.bind('new_message',messageHandler);
      pusherClient.bind('new_friend',friendHandler);
      return ()=>{
         pusherClient.unsubscribe(toPusherKey(`user:${session}:chats`));
         pusherClient.unsubscribe(toPusherKey(`user:${session}:friends`));
      }
   },[pathname, router, session])

   //method to see if the user has seen the message, getting my current pathname (chat id) and taking it out of the unseen messages
   useEffect(() => {
      if (pathname?.includes('chat')) {
         setUnseenMessages(preVal => {
            return preVal.filter(msg => !pathname.includes(msg.senderId));
         })
      }
   }, [pathname])

   return (
      <ul className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1" role='list'>
         {friends !== undefined && friends.sort().map(friend => {
            //how many messages do I have from my current friend:
            const unseenMessagesCount = unseenMessages.filter(msg => {
               return msg.senderId === friend.id;
            }).length;
            return (
               <li key={friend.id}>
                  <a
                     className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                     href={`/dashboard/chat/${chatHrefConstructor(
                        session,
                        friend.id
                     )}`}>
                     {friend.name}
                     {unseenMessagesCount > 0 ? (
                        <div className="bg-indigo-600 font-medium text-xs text-white h-4 w-4 rounded-full flex justify-center items-center">
                           {
                              unseenMessagesCount
                           }
                        </div>
                     ) : null}
                  </a>
               </li>
            )
         })}
      </ul>
   )
}

export default SidebarChatList;