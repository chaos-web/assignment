import { Module } from '@nestjs/common';
import { OfferService } from './offer.service';
import { OfferController } from './offer.controller';
import { Offer, OfferRepository, OfferSchema } from './entities/offer.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: Offer.name, schema: OfferSchema }])],
  controllers: [OfferController],
  providers: [OfferService, OfferRepository],
})
export class OfferModule {}
