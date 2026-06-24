import type {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  HydratedDocument,
} from 'mongoose';

export interface PaginatedResult<T> {
  items: HydratedDocument<T>[];
  total: number;
}

/**
 * Generic data-access layer wrapping a Mongoose model. Concrete repositories
 * extend this to add domain-specific queries while inheriting safe CRUD.
 */
export class BaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  create(data: Partial<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data) as Promise<HydratedDocument<T>>;
  }

  insertMany(docs: Partial<T>[]): Promise<unknown> {
    return this.model.insertMany(docs);
  }

  findById(id: string, projection?: ProjectionType<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id, projection).exec();
  }

  findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter, projection, options).exec();
  }

  find(filter: FilterQuery<T> = {}): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter).exec();
  }

  count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }

  async paginate(
    filter: FilterQuery<T>,
    sort: Record<string, 1 | -1>,
    skip: number,
    limit: number,
  ): Promise<PaginatedResult<T>> {
    const [items, total] = await Promise.all([
      this.model.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  updateById(id: string, update: UpdateQuery<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true }).exec();
  }

  updateMany(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<unknown> {
    return this.model.updateMany(filter, update).exec();
  }

  deleteById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  deleteMany(filter: FilterQuery<T> = {}): Promise<unknown> {
    return this.model.deleteMany(filter).exec();
  }
}
