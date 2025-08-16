import Redis from 'ioredis';

export const redisdb = {
  provide: 'REDISDB',
  useFactory: async (): Promise<Redis> => {
    try {
      return new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: +process.env?.REDIS_PORT || 6379,
      });
    } catch (error) {}
  },
};
