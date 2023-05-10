import {z} from 'zod';

//validating a single message:
export const messageValidator=z.object({
   id:z.string(),
   senderId:z.string(),
   receiverId:z.string(),
   timestamp:z.number()
});

//validating the whole array of messages:
export const messageArrayValidator=z.array(messageValidator);

export type Message=z.infer<typeof messageValidator>;

