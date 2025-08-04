import { Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model, SortOrder , UpdateQuery} from 'mongoose';

export type SelectQuery =
  | string
  | string[]
  | Record<string, number | boolean | object>;
@Injectable()
export abstract class MongoRepo<T> {
  private readonly model: Model<T & Document>;
  constructor(model: Model<T & Document>) {
    Object.assign(this, { model });
  }

  create(createDto: T) {
    const newItem = new this.model({
      ...createDto,
    });
    return newItem.save() 
  }

  getOne(id: string, select?: SelectQuery): Promise<T> {
    const queryBuilder = this.model.findById(id);
    if (select) queryBuilder.select(select);
    return queryBuilder.exec();
  }
  getAll(
    page: number,
    query?: FilterQuery<T>,
    select?: SelectQuery,
    sort?: { [key: string]: SortOrder },
  ): Promise<T[]> {
    const skip = page < 2 ? 0 : (page - 1) * 10;
    const queryBuilder = this.model.find({ ...query });
    if (select) queryBuilder.select(select);
    if (sort) queryBuilder.sort(sort);
    return queryBuilder.skip(skip).limit(10).exec();
  }
  update(id: string, upData: UpdateQuery<T & Document<any>>) {
    return this.model.findByIdAndUpdate(id, upData).exec();
  }
  remove(id: string): Promise<T> {
    return this.model.findByIdAndDelete(id).exec();
  }
  findOne(query: FilterQuery<T>, select?: SelectQuery): Promise<T> {
    const queryBuilder = this.model.findOne({ ...query });
    if (select) queryBuilder.select(select);
    return queryBuilder.exec();
  }
  findEvery(query: FilterQuery<T>, select?: SelectQuery): Promise<T[]> {
    const queryBuilder = this.model.find({ ...query });
    if (select) queryBuilder.select(select);
    return queryBuilder.exec();
  }
  count(query: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(query).exec();
  }
}
