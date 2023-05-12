import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import {z} from 'zod';

export async function POST(req:Request){
   try{
      const body=await req.json();
      const {email:emailToAdd}=addFriendValidator.parse(body.email);
      const idToAdd=await fetchRedis('get',`user:email:${emailToAdd}`) as string;

      if(!idToAdd){
         return new Response('No such a user found',{status:400});
      }

      const session=await getServerSession(authOptions);

      if(!session){
         return new Response('Unauthorized',{status:401});
      }

      if(idToAdd===session.user.id){
         return new Response('You can not add yourself as a friend',{status:400});
      }

      //check if the user is already logged in a member of the friend request request we are trying to add
      const isAlreadyAdded=await fetchRedis('sismemeber',`user:${idToAdd}:incoming_friend_request`,session.user.id) as 0 | 1 ; 
      if(isAlreadyAdded){
         return new Response('Friend request already sent',{status:400});
      }

      //checking if the user is already my friend:
      const isAlreadyFriend=await fetchRedis('sismemeber',`user:${session.user.id}:friends`,idToAdd) as 0 | 1 ; 
      if(isAlreadyFriend){
         return new Response('User already added ad friend',{status:400});
      }

      //accessing my event from the client:
      pusherServer.trigger(
         toPusherKey(`user:${idToAdd}:incoming_friend_request`),
         'incoming_friend_request',
         {  
             senderId:session.user.id,
             senderEmail:session.user.email
         }
      )

      await db.sadd(`user:${idToAdd}:incoming_friend_request`,session.user.id);
      return new Response('OK');
   }catch(err){
      console.log(err);
      if(err instanceof z.ZodError){
         return new Response('Invalid payload',{status:400});
      }
      return new Response('Invalid request',{status:400});
   }
}
