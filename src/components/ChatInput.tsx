'use client'

import { User } from "@/types/db";
import axios from "axios";
import { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ReactTextArea from 'react-textarea-autosize';
import Button from "./ui/Button";

interface ChatInputProps{
   chatPartner:User,
   chatId:string
}

const ChatInput:FC<ChatInputProps>=({chatPartner,chatId})=>{
   const textAreaRef=useRef<HTMLTextAreaElement>(null);
   const [input,setInput]=useState<string>('');
   const [isLoading,setIsLoading]=useState(false);
   const sendMessage=async()=>{
      if(!input) return;
      setIsLoading(true);
      try{
         await axios.post('/api/message/send',{text:input,chatId});
         setInput('');
         textAreaRef.current?.focus();
      }catch(err){
         console.log(err);
         toast.error('Something went wrong!!')
      }finally{
         setIsLoading(false);
      }
   }

   return (
      <div className="border-t border-gray-200 px-4 py-4 mb-2 sm:mb-0">
         <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-400 focus-within:ring-2 focus-within:ring-indigo-600">
            <ReactTextArea
               ref={textAreaRef}
               onKeyDown={(e)=>{
                  if(e.key==='Enter' && !e.shiftKey){
                     e.preventDefault();
                     sendMessage();
                  }
               }}
               rows={1}
               value={input}
               onChange={(e)=>setInput(e.target.value)}
               placeholder={`Message ${chatPartner.name}`}
               className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6'
            />
            <div className="py-2"
               onClick={()=>textAreaRef.current?.focus()}
               aria-hidden='true'
            >
               <div className="px-py">
                  <div className="h-9"/>
               </div>
            </div>
            <div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
               <div className="flex-shrink-0">
                  <Button
                     onClick={sendMessage}
                     type='submit'
                     isLoading={isLoading}
                  >
                     Post
                  </Button>
               </div>
            </div>
         </div>
      </div>
   )
}

export default ChatInput;