import {NextAuthOptions} from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { db } from './db';
import GoogleProvider from 'next-auth/providers/google';
import {User} from '../types/db';

//Important: checking that the variables are provided before displaying login page
const getGoogleCredentials=()=>{
   const clientId=process.env.GOOGLE_CLIENT_ID;
   const googleSecret=process.env.GOOGLE_CLIENT_SECRET;

   if(!clientId || clientId.length===0){
      throw new Error('ClientId if missing');
   }

   if(!googleSecret || googleSecret.length===0){
      throw new Error('Secret if missing');
   }

   return {
      clientId,
      googleSecret
   }
}

export const authOptions:NextAuthOptions={
   //adapter takes care to save the client data automatically to redis upon logging in, here upstash takes care of it as simple as that
   adapter:UpstashRedisAdapter(db),
   session:{
      //jwt token need for auth middleware
      strategy:'jwt'
   },
   pages:{
      //setting the page route
      signIn:'/login'
   },
   providers:[
      //google provider as an auth gate
      GoogleProvider({
         clientId:getGoogleCredentials().clientId,
         clientSecret:getGoogleCredentials().googleSecret,
      })
   ],
   //callbacks take care of a handler when the user successfully logs in
   callbacks:{
      //grabbing the jwt token and checking that the user does not exists already
      async jwt({token,user}){
         const dbUser=(await db.get(`user:${token.id}`)) as User | null;

         if(!dbUser){
            token.id=user!.id;
            return token;
         }

         //if user already exists, returning it:
         return {
            name:dbUser.name,
            email:dbUser.email,
            picture:dbUser.image,
            id:dbUser.id
         }
      },
      //this callback takes care of addressing session whenever i navigate through the webpage, and checks there is a session.user to protect the pages
      async session({session,token}){
         if(token){
            session.user.id=token.id
            session.user.name=token.name
            session.user.email=token.email
            session.user.image=token.picture
         }

      //if there is no token return session
      return session
      },
      //upon logging in redirect to dashboard
      redirect(){
         return '/dashboard'
      }
   }
}
