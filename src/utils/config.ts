import { config } from 'dotenv';
config();

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.MONGO_URI || 'mongodb://root:root@localhost:27017',
  },
  rabbit: {
    uri: RABBIT_URI(),
  },
  harvester: {
    ttl: +process.env.HARVESTER_TTL_SECONDS || 60,
  },
});

export const CACHE_TIMEOUT: number = +process.env.CACHE_TIMEOUT || 120;

export const RABBIT_URI = (): string[] => {
  const rabbitUri = process.env.RABBIT_URI || 'amqp://127.0.0.1:5672';
  if (rabbitUri.includes('@')) {
    const [creadential, hosts] = rabbitUri.split('@');
    const hostList = hosts.split(',');
    return hostList.map((host, index) => {
      return `${creadential}@${host}`;
    });
  }
  return [rabbitUri];
};


export const secondsToCronExpression = (seconds: number): string => {
  if (!Number.isInteger(seconds) || seconds <= 0) {
    throw new Error('Input must be a positive integer representing seconds.');
  }

  const SECONDS_PER_MINUTE = 60;
  const SECONDS_PER_HOUR = 3600; 
  const SECONDS_PER_DAY = 86400; 

  if (seconds >= SECONDS_PER_DAY && seconds % SECONDS_PER_DAY === 0) {
    const days = seconds / SECONDS_PER_DAY;
    return `0 0 0 */${days} * *`;
  }

  if (seconds >= SECONDS_PER_HOUR && seconds % SECONDS_PER_HOUR === 0) {
    const hours = seconds / SECONDS_PER_HOUR;
    return `0 0 */${hours} * * *`;
  }

  if (seconds >= SECONDS_PER_MINUTE && seconds % SECONDS_PER_MINUTE === 0) {
    const minutes = seconds / SECONDS_PER_MINUTE;
    return `0 */${minutes} * * * *`;
  }
  
  return `*/${seconds} * * * * *`;
};


