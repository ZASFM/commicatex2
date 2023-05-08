import { fetchRedis } from '@/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageArrayValidator } from '@/lib/validations/message';
import { Message } from '@/types/db';
import { getServerSession, User } from 'next-auth';
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
   const getChatPartner=(await db.get(`user:${chatPartnerId}`)) as User;
   const initialMessages=await getChatMessages(chatId)
 
   return (
      <>
         {params.chatId}
      </>
   )
}

export default page;