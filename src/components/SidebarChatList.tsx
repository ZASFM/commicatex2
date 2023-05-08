import { User } from "@/types/db";
import { FC } from "react";

type SideBarChatListProps={
   friends:User[]|undefined
}

const SidebarChatList:FC<SideBarChatListProps>=({friends})=>{
   return (
      <ul className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1" role='list'>
         {friends!==undefined && friends.sort().map(friend=>[

         ])}
      </ul>
   )
}

export default SidebarChatList;