import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req:Request) {
   try{
      const body=await req.json();

      //checking that the id im getting is a string type:
      const {id:idToAdd}=z.object({id:z.string()}).parse(body);
   
      const session=await getServerSession(authOptions);
      if(!session){
         return new Response('Not authorized',{status:401});
      }

      //checking id the friend request im receiving is not already accepted
      const isAlreadyFriend=await fetchRedis('sismemeber',`user:${idToAdd}:friends`,idToAdd);
      if(isAlreadyFriend){
         return new Response('Already added as a friends',{status:400});
      }

      //checking id the id i want to accpet the friend request , does not corresponds to the same user I have sent a friend request:
      const hasFriendRequest=await fetchRedis('sismemeber',`user:${session.user.id}:incoming_friend_request`,idToAdd);
      if(!hasFriendRequest){
         return new Response('No friend request present',{status:400});
      }

      pusherServer.trigger(toPusherKey(`user:${idToAdd}`),'new_frined',{});

      //add the request as my friend
      await db.sadd(`user:${session.user.id}:friends`,idToAdd);
      //adding my as a friend of the requester 
      await db.sadd(`user:${idToAdd}:friends`,session.user.id);
      //deleting the request from the db
      await db.srem(`user:${session.user.id}:incoming_friend_request`,idToAdd);
      
   }catch(err){
      if(err instanceof z.ZodError){
         return new Response('Invalid friend payload',{status:422});
      }
      return new Response('Error ocurred!',{status:400});
   }
}