import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as mgSchema } from 'mongoose';
import { MongoRepo } from '../../utils/mongo.repository.helper';

export enum State {
  FETCHED = 'fetched',
  PARSED = 'parsed',
  PUBLISHED = 'published',
  SAVED = 'saved',
  FAILED = 'failed',
}

export type HarvesterLogDocument = HarvesterLog & Document;
@Schema({
  timestamps: { createdAt: true , updatedAt: false },
  timeseries: {
    timeField: 'createdAt',
    metaField: 'state',
    granularity: 'seconds',
  },
  autoIndex: true,
})
export class HarvesterLog {
  @Prop({ type: mgSchema.Types.ObjectId, auto: true })
  _id?: string;

  @Prop({ type: 'number'  })
  totalItems: number;

  @Prop()
  strategy: string;

  //  Meta Field Is The Only Updatable Field In Timeseries
  @Prop({ type: 'string', enum: State, default: State.FETCHED })
  state: State;

  @Prop({ type: 'object' })
  payload: any;

  @Prop({ type: 'date' , default: new Date() })
  createdAt?: Date;
}

export const HarvesterLogSchema = SchemaFactory.createForClass(HarvesterLog);
export const HarvesterLogModel = {
  name: HarvesterLog.name,
  schema: HarvesterLogSchema,
};

@Injectable()
export class HarvesterLogRepository extends MongoRepo<HarvesterLog> {
  constructor(
    @InjectModel(HarvesterLog.name)
    readonly HarvesterLogModel: Model<HarvesterLogDocument>,
  ) {
    super(HarvesterLogModel);
  }
}
