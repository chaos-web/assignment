import { ConfigModule } from '@nestjs/config';

export const testConfig = {
  database: {
    url: process.env.TEST_MONGO_URI || 'mongodb://root:root@localhost:27017/',
  },
  rabbit: {
    uri: process.env.TEST_RABBIT_URI || 'amqp://guest:guest@localhost:5672',
  },
};

export const createTestModule = () => {
  return ConfigModule.forRoot({
    envFilePath: ['.env.test', '.env.test.local'],
    load: [() => testConfig],
  });
};

export const waitForAsync = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const clearDatabase = async (model: any) => {
  try {
    await model.deleteMany({});
  } catch (error) {
    console.warn('Failed to clear database:', error);
  }
}; 