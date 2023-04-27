import { FC } from "react"
import Button from '../components/ui/Button';
import { db } from "@/lib/db";
import {authOptions} from '../lib/auth';
import { getServerSession } from "next-auth";

export default async function Home() {
  await db.set('hello','hello');

  return (
    <div className='text-red-500'>
      <Button>
         Hello
      </Button>
    </div>
  )
}
