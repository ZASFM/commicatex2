'use client'

import { FC, useState } from "react";
import Button from '../components/ui/Button'
import { addFriendValidator } from "@/lib/validations/add-friend";
import axios, { AxiosError } from "axios";
import {z} from 'zod';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

interface AddFriendButtonProps{

}

//making from addFriendValidator a typeScript type and passing it to FormData
type FormData=z.infer<typeof addFriendValidator>;

const AddFriendButton:FC=({})=>{
   const [successMessage,setSuccessMessage]=useState<boolean>(false);
   const {
      register,
      handleSubmit,
      setError,
      formState:{errors }
   }=useForm<FormData>({
      resolver:zodResolver(addFriendValidator)
   })

   const addFriend=async(email:string)=>{
      try{
         const validatedEmail=addFriendValidator.parse({email});

         await axios.post('/api/friends/add',{
            email:validatedEmail
         });
         setSuccessMessage(true);
      }catch(err){
         if(err instanceof z.ZodError){
            setError('email',{message:err.message});
            return;
         }
         if(err instanceof AxiosError){
            setError('email',{message:err.response?.data});
            return;
         }
         setError('email',{message:'Something went wrong'});
      }
   }

   const onSubmit=(data:FormData)=>{
      addFriend(data.email);
   }
 
   return (
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
         <label
            htmlFor="email"
            className="text-sm font-medium block leading-6 text-gray-900"
         >
             Insert Email
         </label>
         <div className="mt-2 flex gap-4">
            <input 
               {...register('email')}
               className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
               placeholder="name@email.com"
               type='text'
            />
            <Button>Add</Button>
         </div>
         <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
         {
            successMessage?(
               <p className="mt-1 text-sm text-green-600">Friend request sent!</p>
            ):null
         }
      </form>
   )
}

export default AddFriendButton;