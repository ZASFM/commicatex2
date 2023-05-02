'use client'

import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC, useState } from "react"
import { toast } from "react-hot-toast";
import Button from "./ui/Button"

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{

}

const SignOutButton: FC<SignOutButtonProps>=({...props})=>{
   const [isSigningOut,setIsSigningOut]=useState<boolean>(false);

   return (
      <Button variant='ghost' {...props} onClick={async()=>{
         setIsSigningOut(true);
         try{
            await signOut();
         }catch(err){
            console.log(err);
            toast.error('Problem signing out')
         }finally{
            setIsSigningOut(false);
         }
      }}>
         {isSigningOut?(
            <Loader2 className="animate-spin w-4 h-4"/>
         ):(
            <LogOut className="h-4 w-4"/>
         )}
      </Button>
   )
}

export default SignOutButton;