import ChatInput from '@/components/ChatInput';
import Messages from '@/components/Messages';
import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageArrayValidator } from '@/lib/validations/message';
import { Message } from '@/types/db';
import { getServerSession, User } from 'next-auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {FC} from 'react';

type PageProps={
   params:{
      chatId:string
   }
}

const getChatMessages=async(chatId:string)=>{
   try{
      const results:string[]=await fetchRedis('zrange',`chat:${chatId}:messages`,0,-1);
      const dbMessages=results.map(message=>JSON.parse(message) as Message);
      //I want to show the newest messages at the bottom of the page
      const reversedMessages=dbMessages.reverse();
      const messages=messageArrayValidator.parse(reversedMessages);
      return messages;
   }catch(err){
      notFound();
   }
}

const page=async({params}:PageProps)=>{
   const session=await getServerSession(authOptions);
   if(!session) notFound();
   const {user}=session;
   const {chatId}=params;
   const [user1, user2]=chatId.split('--');

   if(user.id!==user1 && user.id !==user2){
      notFound();
   }

   const chatPartnerId=user.id===user1?user2:user1;
   const getChatPartner=(await db.get(`user:${chatPartnerId}`)) as string;
   const chatPartner=JSON.parse(getChatPartner);
   const initialMessages=await getChatMessages(chatId)
 
   return (
      <div className='flex-1 flex flex-col justify-between h-full max-h-[calc(100vh-6rem)]'>
         <div className='flex sm:justify-center justify-between py-3 border-b-2 border-gray-200'>
            <div className='relative flex items-center space-x-4'>
               <div className='relative'>
                  <div className='relative sm>w-8 w-12 h-8 sm:h-12'>
                     <Image
                        fill
                        referrerPolicy='no-referrer'
                        src={chatPartner.image}
                        alt={`partner image`}
                     />
                  </div>
               </div>
               <div className='flex flex-col leading-tight'>
                  <div className='text-xl items-center flex'>
                     <span className='text-gray-400 mr-3 font-semibold'>
                        {
                           chatPartner.name
                        }
                     </span>
                  </div>
                  <span className='text-xs text-gray-400'>{chatPartner.email}</span>
               </div>
            </div>
         </div>
         <Messages
            initialMessages={initialMessages}
            sessionId={session.user.id}
            chatPartner={chatPartner}
            sessionImg={session.user.image}
         />
         <ChatInput
            chatPartner={chatPartner}
            chatId={chatId}
         />
      </div>
   )
}

export default page;