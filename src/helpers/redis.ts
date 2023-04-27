const upstashRedisToken=process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisUrl=process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands='zrange' | 'sismemeber' | 'get' | 'smembers';

export async function fetchRedis(
   command:Commands, 
   ...args:(string|number)[]
){

}