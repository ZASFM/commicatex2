import { User } from "@/types/db";
import { fetchRedis } from "./redis";

export const getFriendsByUserId=async(userId:string)=>{
   try{
      const friendIds=(await fetchRedis('smembers',`user:${userId}:friends`)) as string[];
      const friends=await Promise.all(
         friendIds.map(async(friendId)=>{
            const friend=await fetchRedis('get',`user:${friendId}`) as string;
            const parsedFriend=JSON.parse(friend);
            return parsedFriend;
         })
      );
      return friends;
   }catch(err){
      console.log(err);
   }
}