import { ConfigModule } from '@nestjs/config';

export const signalTestConfig = {
  database: {
    url: process.env.TEST_MONGO_URI || 'mongodb://root:root@localhost:27017/signal-test',
  },
  rabbit: {
    uri: process.env.TEST_RABBIT_URI || 'amqp://guest:guest@localhost:5672',
  },
};

export const createSignalTestModule = () => {
  return ConfigModule.forRoot({
    envFilePath: ['.env.test', '.env.test.local'],
    load: [() => signalTestConfig],
  });
};

export const mockDeviceTrackingData = {
  'test-device-1': {
    time: Date.now(),
    data: [
      [Date.now(), [40.7128, -74.0060, 25.5]],
      [Date.now() + 1000, [40.7130, -74.0062, 30.2]],
    ],
  },
  'test-device-2': {
    time: Date.now() + 2000,
    data: [
      [Date.now() + 2000, [40.7140, -74.0070, 35.0]],
    ],
  },
};

export const createTestSignalData = (deviceId: string, payloadCount: number = 1) => ({
  deviceId,
  time: Date.now(),
  payload: Array.from({ length: payloadCount }, (_, index) => ({
    time: Date.now() + index * 1000,
    latitude: 40.7128 + (index * 0.0001),
    longitude: -74.0060 + (index * 0.0001),
    speed: 25.5 + (index * 2),
  })),
}); 