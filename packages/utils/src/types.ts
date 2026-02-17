/**
 * Shared TypeScript types used across the monorepo.
 */

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  error?: string;
  meta?: {
    page?: number;
    totalPages?: number;
    totalCount?: number;
  };
}

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Common entity with timestamps */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}
