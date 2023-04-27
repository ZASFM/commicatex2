'use client'

import {ReactNode, FC} from 'react';
import { Toaster } from 'react-hot-toast';

type ProvidersProps={
   children:ReactNode
}

const Providers:FC<ProvidersProps>=({children})=>{
   return (
      <>
         <Toaster position='top-center' reverseOrder={false}/>
         {children}
      </>
   )
}

export default Providers;