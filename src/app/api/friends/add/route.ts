import { authOptions } from "@/lib/auth";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";

export async function POST(req:Request){
   try{
      const body=await req.json();
      const {email:emailToAdd}=addFriendValidator.parse(body.email);
      const RESTresponse=await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email:${emailToAdd}`,{
         headers:{
            Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
         },
         cache:'no-store'
      });
      const json=await RESTresponse.json() as {result:string | null};
      const idToAdd=json.result;

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

      console.log(json);
   }catch(err){
      console.log(err);
   }
}
