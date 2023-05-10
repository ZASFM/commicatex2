import { cn } from "@/lib/utils";
import { Message } from "@/types/db";
import { FC, useRef, useState } from "react";

interface MessagesProps {
   initialMessages: Message[],
   sessionId: string
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId }) => {
   const scrollDownRef = useRef<HTMLDivElement | null>(null);
   const [messages, setMessages] = useState<Message[]>(initialMessages);

   return (
      <div id="messages" className="flex flex-1 h-full flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrollbar-touch">
         <div ref={scrollDownRef} />
         {
            messages.map((message, index) => {
               const isCurrentUser = message.id === sessionId;
               //checking if there is a next message:
               const hasNextMessage = messages[index - 1].senderId === messages[index].senderId;
               return (
                  <div className="chat-message" key={message.id}>
                     <div className={cn('flex items-end', { 'justify-end': isCurrentUser })}>
                        <div className={cn('flex flex-col space-y-3 text-base max-w-sm mx-2', {
                           'order-1 items-end': isCurrentUser,
                           'order-2 items-start': !isCurrentUser
                        })}>
                           <span className={cn('px-4 py-2 rounded-lg inline-block', {
                              'bg-indigo-600 text-white': isCurrentUser,
                              'bg-gray-200 text-gray-900': !isCurrentUser,
                              'rounded-br-none':
                                 !hasNextMessage && isCurrentUser,
                              'rounded-bl-none':
                                 !hasNextMessage && !isCurrentUser,
                           })}>
                              {message.text}{' '}
                              <span className="ml-2 text-xs text-gray-400">
                                 {message.timestamp}
                              </span>
                           </span>
                        </div>
                     </div>
                  </div>
               )
            })
         }
      </div>
   )
}

export default Messages;