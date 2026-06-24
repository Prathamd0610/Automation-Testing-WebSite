import type { FilterQuery } from 'mongoose';

export interface ListQueryOptions {
  /** Fields a free-text `search` term is matched against (case-insensitive regex). */
  searchableFields?: string[];
  /** Whitelisted fields that may be used as exact-match filters. */
  filterableFields?: string[];
  defaultSort?: string;
  maxLimit?: number;
}

export interface ParsedListQuery<T> {
  filter: FilterQuery<T>;
  sort: Record<string, 1 | -1>;
  page: number;
  limit: number;
  skip: number;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Translates `?page&limit&sort&search&<field>=` query strings into a safe
 * Mongoose filter/sort/pagination triple. Only whitelisted fields are honored,
 * which prevents query-shape injection.
 */
export function parseListQuery<T>(
  query: Record<string, unknown>,
  options: ListQueryOptions = {},
): ParsedListQuery<T> {
  const {
    searchableFields = [],
    filterableFields = [],
    defaultSort = '-createdAt',
    maxLimit = 100,
  } = options;

  const page = Math.max(1, Number.parseInt(String(query.page ?? '1'), 10) || 1);
  const rawLimit = Number.parseInt(String(query.limit ?? '10'), 10) || 10;
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  const filter: FilterQuery<T> = {};

  // Exact-match filters from whitelisted fields.
  for (const field of filterableFields) {
    const value = query[field];
    if (value !== undefined && value !== '') {
      (filter as Record<string, unknown>)[field] = value;
    }
  }

  // Free-text search across whitelisted fields.
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  if (search && searchableFields.length > 0) {
    const regex = new RegExp(escapeRegex(search), 'i');
    (filter as Record<string, unknown>).$or = searchableFields.map((field) => ({
      [field]: regex,
    }));
  }

  // Sorting: `sort=field` ascending, `sort=-field` descending. Comma-separated.
  const sortParam = typeof query.sort === 'string' && query.sort ? query.sort : defaultSort;
  const sort: Record<string, 1 | -1> = {};
  for (const token of sortParam.split(',')) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('-')) {
      sort[trimmed.slice(1)] = -1;
    } else {
      sort[trimmed] = 1;
    }
  }

  return { filter, sort, page, limit, skip };
}
