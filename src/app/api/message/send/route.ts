import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Message, messageValidator } from "@/lib/validations/message";
import { User } from "@/types/db";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";

export default async function POST(req:Request){
   try{
      const {text,chatId}=await req.json();
      const session=await getServerSession(authOptions);
      if(!session){
         return new Response('Unauthorized',{status:401});
      }
      const [user1,user2]=chatId.split('--');
      if(session.user.id!==user1 && session.user.id!==user2){
         return new Response('Unauthorized',{status:401})
      }
      const friendId=session.user.id===user1?user2:user1;
      const friendList=await fetchRedis('smembers',`user:${session.user.id}:friends`) as string[];
      const isFriend=friendList.includes(friendId);
      if(!isFriend){
         return new Response('Not friends',{status:400});
      }
      const sender=await fetchRedis('get',`user:${session.user.id}`) as string;
      const parsedSender=JSON.parse(sender) as User;

      //validation completed
      const timestamp=Date.now();
      const messageData:Message={
         id:nanoid(),
         senderId:session.user.id,
         text,
         timestamp,
      }
      const message=messageValidator.parse(messageData);
      await db.zadd(`user:${chatId}:message`,{
         score:timestamp,
         member:JSON.stringify(message)
      })
   }catch(err){ 
      if(err instanceof Error){
         return new Response(err.message,{status:500});
      }
      return new Response('Internal Error',{status:500});
   }
}