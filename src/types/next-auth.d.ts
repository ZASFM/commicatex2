import type {Session, User} from 'next-auth';
import {JWT} from 'next-auth/jwt';

type UserId=string;

//customizing the built in interfaces adding an id ot JWT
declare module 'next-auth/jwt'{
   interface JWT{
      id:UserId
   }
}

//customizing the built in interfaces adding a user ot Session
declare module 'next-auth'{
   interface Session{
      user:User & {
         id:UserId
      }
   }
}