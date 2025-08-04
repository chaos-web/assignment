import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as mgSchema } from 'mongoose';
import { MongoRepo } from '../../utils/mongo.repository.helper';

export type OfferDocument = Offer & Document;
@Schema({
  timestamps: { createdAt: true, updatedAt: true },
  autoIndex: true,
})
export class Offer {
  @Prop({ type: mgSchema.Types.ObjectId, auto: true })
  _id?: string;

  @Prop({ type: 'string' , index:"text" })
  name: string;

  @Prop({ type: 'string' , index:"text" })
  description: string;

  @Prop()
  company: string;

  @Prop()
  location: string;

  @Prop({ type: 'object' })
  salary: {
    min: number;
    max: number;
  };

  @Prop({ type: 'date' })
  issuedAt: Date;

  @Prop({ type: 'date' })
  createdAt: Date;

  @Prop({ type: 'date' })
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
export const OfferModel = {
  name: Offer.name,
  schema: OfferSchema,
};

@Injectable()
export class OfferRepository extends MongoRepo<Offer> {
  constructor(
    @InjectModel(Offer.name)
    readonly OfferModel: Model<OfferDocument>,
  ) {
    super(OfferModel);
  }
}
