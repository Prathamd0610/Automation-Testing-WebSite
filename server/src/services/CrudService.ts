import type { BaseRepository } from '../repositories/BaseRepository';
import { parseListQuery, type ListQueryOptions } from '../utils/queryFeatures';
import { buildPaginationMeta, type PaginationMeta } from '../utils/response';
import { AppError } from '../utils/AppError';

export interface ListResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Reusable application service implementing the standard list/get/create/update/
 * delete use-cases on top of a repository, with pagination, sorting and search.
 */
export class CrudService<T> {
  protected readonly repository: BaseRepository<T>;

  protected readonly listOptions: ListQueryOptions;

  protected readonly entityName: string;

  constructor(repository: BaseRepository<T>, entityName: string, listOptions: ListQueryOptions = {}) {
    this.repository = repository;
    this.entityName = entityName;
    this.listOptions = listOptions;
  }

  async list(query: Record<string, unknown>): Promise<ListResult<unknown>> {
    const { filter, sort, page, limit, skip } = parseListQuery<T>(query, this.listOptions);
    const { items, total } = await this.repository.paginate(filter, sort, skip, limit);
    return { items, meta: buildPaginationMeta(total, page, limit) };
  }

  async getById(id: string): Promise<unknown> {
    const doc = await this.repository.findById(id);
    if (!doc) throw AppError.notFound(`${this.entityName} not found`);
    return doc;
  }

  async create(data: Partial<T>): Promise<unknown> {
    return this.repository.create(data);
  }

  async update(id: string, data: Partial<T>): Promise<unknown> {
    const updated = await this.repository.updateById(id, data as never);
    if (!updated) throw AppError.notFound(`${this.entityName} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.repository.deleteById(id);
    if (!deleted) throw AppError.notFound(`${this.entityName} not found`);
  }
}
