import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//utility function for conditional classNames
export const cn=(...inputs:ClassValue[])=>{
   return twMerge(clsx(inputs))
}