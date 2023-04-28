const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

//list if possible redis commands
type Commands = 'zrange' | 'sismemeber' | 'get' | 'smembers';

export async function fetchRedis(
   command: Commands,
   ...args: (string | number)[]
) {
   try {
      const commandUrl = `${upstashRedisUrl}/${command}/${args.join('/')}`;
      const response = await fetch(commandUrl, {
         headers: {
            Authorization: `Bearer ${token}`
         },
         cache: 'no-store'
      });
      if (!response.ok) {
         throw new Error(`Redis command failed, ${response.statusText}`);
      }
      const json = await response.json();
      return json.result;
   } catch (err) {
      console.log(err);
   }
}