import { Injectable } from '@nestjs/common';
import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, Schema as mgSchema } from 'mongoose';
import { MongoRepo } from '../../utils/mongo.repository.helper';

export enum State {
  FETCHED = 'fetched',
  SAVED = 'saved',
}

// Set collection to timeseries for better performance
export type SignalDocument = Signal & Document;
@Schema({
  timestamps: { createdAt: true , updatedAt: false },
  timeseries: {
    timeField: 'createdAt',
    metaField: 'state',
    granularity: 'seconds',
  },
  autoIndex: true,
})
export class Signal {
  @Prop({ type: mgSchema.Types.ObjectId, auto: true })
  _id?: string;

  @Prop({ type: 'string' })
  deviceId: string;

  @Prop({ type: 'number'  })
  totalItems: number;

  //  Meta Field Is The Only Updatable Field In Timeseries
  @Prop({ type: 'string', enum: State, default: State.FETCHED })
  state: State;

  @Prop({ type: 'object' })
  payload: Array<[
    time: number,
    [latitude: number, longitude: number, speed: number]
  ]>;

  @Prop({ type: 'date' , default: Date.now })
  createdAt: Date;
}

export const SignalSchema = SchemaFactory.createForClass(Signal);
export const SignalModel = {
  name: Signal.name,
  schema: SignalSchema,
};

@Injectable()
export class SignalRepository extends MongoRepo<Signal> {
  constructor(
    @InjectModel(Signal.name)
    readonly SignalModel: Model<SignalDocument>,
  ) {
    super(SignalModel);
  }
}
