import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//utility function for conditional classNames
export const cn=(...inputs:ClassValue[])=>{
   return twMerge(clsx(inputs))
}

export const chatHrefConstructor=(id1:string,id2:string)=>{
   const sortedIds=[id1,id2].sort();
   return `${sortedIds[0]}--${sortedIds[1]}`;
}