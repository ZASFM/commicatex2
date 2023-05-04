import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req:Request){
   try{
      const session=await getServerSession(authOptions);
      const body=await req.json();
      const {id:idToDeny}=z.object({id:z.string()}).parse(body);
      
      if(!session){
         return new Response('Not authorized',{status:401});
      }

      await db.srem(`user:${session.user.id}:incoming_friend_request`,idToDeny);
      return new Response('OK');
   }catch(err){
      if(err instanceof z.ZodError){
         return new Response('Invalid friend payload',{status:422});
      }
      return new Response('Error ocurred!',{status:400});
   }
}