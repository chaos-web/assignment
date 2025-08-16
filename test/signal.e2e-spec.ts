import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Signal, SignalModel } from '../src/signal/entities/signal.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { clearDatabase, waitForAsync } from './setup';

describe('SignalController (e2e)', () => {
  let app: INestApplication;
  let signalModel: Model<Signal>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    signalModel = moduleFixture.get<Model<Signal>>(getModelToken(Signal.name));
  });

  afterEach(async () => {
    await clearDatabase(signalModel);
    await app.close();
  });

  describe('POST /signal', () => {
    const validCreateSignalDto = {
      deviceId: 'test-device-123',
      time: Date.now(),
      payload: [
        {
          time: Date.now(),
          latitude: 40.7128,
          longitude: -74.006,
          speed: 25.5,
        },
        {
          time: Date.now() + 1000,
          latitude: 40.713,
          longitude: -74.0062,
          speed: 30.2,
        },
      ],
    };

    it('should create a new signal successfully', async () => {
      const response = await request(app.getHttpServer())
        .post('/signal')
        .send(validCreateSignalDto)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.deviceId).toBe(validCreateSignalDto.deviceId);
      expect(response.body.totalItems).toBe(
        validCreateSignalDto.payload.length,
      );
      expect(response.body.state).toBe('fetched');
      expect(response.body.payload).toHaveLength(2);
      expect(response.body.payload[0]).toEqual([
        validCreateSignalDto.payload[0].time,
        [
          validCreateSignalDto.payload[0].latitude,
          validCreateSignalDto.payload[0].longitude,
          validCreateSignalDto.payload[0].speed,
        ],
      ]);
    });

    it('should return 400 when deviceId is missing', async () => {
      const invalidDto = { ...validCreateSignalDto };
      delete invalidDto.deviceId;

      await request(app.getHttpServer())
        .post('/signal')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when time is missing', async () => {
      const invalidDto = { ...validCreateSignalDto };
      delete invalidDto.time;

      await request(app.getHttpServer())
        .post('/signal')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when payload is missing', async () => {
      const invalidDto = { ...validCreateSignalDto };
      delete invalidDto.payload;

      await request(app.getHttpServer())
        .post('/signal')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when payload is empty', async () => {
      const invalidDto = { ...validCreateSignalDto, payload: [] };

      await request(app.getHttpServer())
        .post('/signal')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when payload item is missing required fields', async () => {
      const invalidDto = {
        ...validCreateSignalDto,
        payload: [
          {
            time: Date.now(),
            latitude: 40.7128,
            // missing longitude and speed
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/signal')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 when payload item has invalid data types', async () => {
      const invalidDto = {
        ...validCreateSignalDto,
        payload: [
          {
            time: 'invalid-time',
            latitude: 'invalid-latitude',
            longitude: 'invalid-longitude',
            speed: 'invalid-speed',
          },
        ],
      };

      await request(app.getHttpServer())
        .post('/signal')
        .send(invalidDto)
        .expect(400);
    });

    it('should handle multiple signals for the same device', async () => {
      const signal1 = { ...validCreateSignalDto, time: Date.now() };
      const signal2 = { ...validCreateSignalDto, time: Date.now() + 1000 };

      const response1 = await request(app.getHttpServer())
        .post('/signal')
        .send(signal1)
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post('/signal')
        .send(signal2)
        .expect(201);

      expect(response1.body._id).not.toBe(response2.body._id);
      expect(response1.body.deviceId).toBe(response2.body.deviceId);
    });
  });

  describe('GET /signal', () => {
    beforeEach(async () => {
      const signals = [
        {
          deviceId: 'device-1',
          time: Date.now() - 5000,
          payload: [
            {
              time: Date.now() - 5000,
              latitude: 40.7128,
              longitude: -74.006,
              speed: 25.5,
            },
          ],
        },
        {
          deviceId: 'device-2',
          time: Date.now() - 3000,
          payload: [
            {
              time: Date.now() - 3000,
              latitude: 40.713,
              longitude: -74.0062,
              speed: 30.2,
            },
          ],
        },
        {
          deviceId: 'device-1',
          time: Date.now() - 1000,
          payload: [
            {
              time: Date.now() - 1000,
              latitude: 40.7132,
              longitude: -74.0064,
              speed: 35.0,
            },
          ],
        },
      ];

      for (const signal of signals) {
        await request(app.getHttpServer()).post('/signal').send(signal);
      }

      await waitForAsync(100);
    });

    it('should return all signals when no filters are applied', async () => {
      const response = await request(app.getHttpServer())
        .get('/signal')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });

    it('should filter signals by deviceId', async () => {
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ deviceId: 'device-1' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      response.body.forEach((signal: any) => {
        expect(signal.deviceId).toBe('device-1');
      });
    });

    it('should filter signals by startTime', async () => {
      const startTime = Date.now() - 4000;
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ startTime })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((signal: any) => {
        expect(new Date(signal.createdAt).getTime()).toBeGreaterThanOrEqual(
          startTime,
        );
      });
    });

    it('should filter signals by endTime', async () => {
      const endTime = Date.now() - 2000;
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ endTime })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((signal: any) => {
        expect(new Date(signal.createdAt).getTime()).toBeLessThanOrEqual(
          endTime,
        );
      });
    });

    it('should filter signals by both startTime and endTime', async () => {
      const startTime = Date.now() - 4000;
      const endTime = Date.now() - 2000;
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ startTime, endTime })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((signal: any) => {
        const signalTime = new Date(signal.createdAt).getTime();
        expect(signalTime).toBeGreaterThanOrEqual(startTime);
        expect(signalTime).toBeLessThanOrEqual(endTime);
      });
    });

    it('should filter signals by deviceId and time range', async () => {
      const startTime = Date.now() - 4000;
      const endTime = Date.now() - 2000;
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ deviceId: 'device-1', startTime, endTime })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((signal: any) => {
        expect(signal.deviceId).toBe('device-1');
        const signalTime = new Date(signal.createdAt).getTime();
        expect(signalTime).toBeGreaterThanOrEqual(startTime);
        expect(signalTime).toBeLessThanOrEqual(endTime);
      });
    });

    it('should return empty array when no signals match the filter', async () => {
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ deviceId: 'non-existent-device' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should handle invalid query parameters gracefully', async () => {
      const response = await request(app.getHttpServer())
        .get('/signal')
        .query({ startTime: 'invalid-time', endTime: 'invalid-time' })
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Signal data structure validation', () => {
    it('should properly transform payload data structure', async () => {
      const createDto = {
        deviceId: 'test-device',
        time: Date.now(),
        payload: [
          {
            time: 1234567890,
            latitude: 40.7128,
            longitude: -74.006,
            speed: 25.5,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/signal')
        .send(createDto)
        .expect(201);

      expect(response.body.payload).toHaveLength(1);
      expect(response.body.payload[0]).toEqual([
        1234567890,
        [40.7128, -74.006, 25.5],
      ]);
    });

    it('should set correct default values', async () => {
      const createDto = {
        deviceId: 'test-device',
        time: Date.now(),
        payload: [
          {
            time: Date.now(),
            latitude: 40.7128,
            longitude: -74.006,
            speed: 25.5,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/signal')
        .send(createDto)
        .expect(201);

      expect(response.body.state).toBe('fetched');
      expect(response.body.totalItems).toBe(1);
      expect(response.body.createdAt).toBeDefined();
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle very large payload arrays', async () => {
      const largePayload = Array.from({ length: 100 }, (_, index) => ({
        time: Date.now() + index,
        latitude: 40.7128 + index * 0.0001,
        longitude: -74.006 + index * 0.0001,
        speed: 25.5 + index * 0.1,
      }));

      const createDto = {
        deviceId: 'test-device',
        time: Date.now(),
        payload: largePayload,
      };

      const response = await request(app.getHttpServer())
        .post('/signal')
        .send(createDto)
        .expect(201);

      expect(response.body.totalItems).toBe(100);
      expect(response.body.payload).toHaveLength(100);
    });

    it('should handle special characters in deviceId', async () => {
      const createDto = {
        deviceId: 'device-with-special-chars-!@#$%^&*()',
        time: Date.now(),
        payload: [
          {
            time: Date.now(),
            latitude: 40.7128,
            longitude: -74.006,
            speed: 25.5,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/signal')
        .send(createDto)
        .expect(201);

      expect(response.body.deviceId).toBe(createDto.deviceId);
    });

    it('should handle extreme coordinate values', async () => {
      const createDto = {
        deviceId: 'test-device',
        time: Date.now(),
        payload: [
          {
            time: Date.now(),
            latitude: 90.0,
            longitude: 180.0,
            speed: 999.9,
          },
        ],
      };

      const response = await request(app.getHttpServer())
        .post('/signal')
        .send(createDto)
        .expect(201);

      expect(response.body.payload[0]).toEqual([
        createDto.payload[0].time,
        [90.0, 180.0, 999.9],
      ]);
    });
  });
});
