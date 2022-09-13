import redis from 'redis';

const redisClient = redis.createClient();
redisClient.on('error', (err) => console.log('Redis Client Error', err));

export default redisClient