import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ServiceEventsRabbitAddress } from '../src/common.interface';
import { IHarvesterData } from '../src/harvester/harvester.service';
import { getModelToken } from '@nestjs/mongoose';
import { Offer } from '../src/offer/entities/offer.entity';

const testOffers = [
  {
    name: 'Software Engineer',
    description: 'Full-stack developer position',
    company: 'Tech Corp',
    location: 'San Francisco',
    salary: { min: 80000, max: 120000 },
    issuedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Data Scientist',
    description: 'Machine learning specialist',
    company: 'Data Inc',
    location: 'New York',
    salary: { min: 90000, max: 140000 },
    issuedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('OfferController (e2e)', () => {
  let app: INestApplication;
  let amqpConnection: AmqpConnection;
  let offerModel: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    amqpConnection = moduleFixture.get<AmqpConnection>(AmqpConnection);
    offerModel = moduleFixture.get(getModelToken(Offer.name));
  });

  beforeEach(async () => {
    await offerModel.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /offer', () => {
    it('should return empty array when no offers exist', () => {
      return request(app.getHttpServer()).get('/offer').expect(200).expect([]);
    });

    it('should return all offers when no filters are applied', async () => {
      await offerModel.insertMany(testOffers);

      return request(app.getHttpServer())
        .get('/offer')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(2);
          expect(res.body.data[1].name).toBe('Data Scientist');
          expect(res.body.data[0].name).toBe('Software Engineer');
        });
    });

    it('should filter offers by minimum salary', async () => {
      await offerModel.insertMany(testOffers);

      return request(app.getHttpServer())
        .get('/offer?minSalary=100000')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].name).toBe('Senior Developer');
        });
    });

    it('should filter offers by maximum salary', async () => {
      await offerModel.insertMany(testOffers);

      return request(app.getHttpServer())
        .get('/offer?maxSalary=80000')
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toHaveLength(1);
          expect(res.body.data[0].name).toBe('Junior Developer');
        });
    });
  });
});
