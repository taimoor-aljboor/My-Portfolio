import prisma from '../lib/db';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

/**
 * Custom error type for database operations
 */
export class DatabaseError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Default pagination configuration
 */
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

/**
 * Pagination options type
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Paginated response type
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * Process pagination options and return Prisma-compatible parameters
 */
export function getPaginationParams(options: PaginationOptions = {}) {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, options.pageSize || DEFAULT_PAGE_SIZE));
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    page,
    pageSize,
  };
}

/**
 * Error handler for database operations
 */
export function handleDatabaseError(error: unknown, defaultMessage: string): never {
  console.error('Database error:', error);

  if (error instanceof PrismaClientKnownRequestError) {
    const prismaError = error as PrismaClientKnownRequestError;
    switch (prismaError.code) {
      case 'P2002':
        throw new DatabaseError('A unique constraint would be violated.');
      case 'P2025':
        throw new DatabaseError('Record not found.');
      case 'P2014':
        throw new DatabaseError('Invalid ID provided.');
      default:
        throw new DatabaseError(defaultMessage, error);
    }
  }

  if (error instanceof PrismaClientValidationError) {
    throw new DatabaseError('Invalid data provided.', error);
  }

  throw new DatabaseError(defaultMessage, error);
}

/**
 * Add audit info to data before create/update
 */
export function addAuditInfo(data: any, userId: string | undefined, isCreate = true) {
  const now = new Date();
  const auditInfo = {
    ...(isCreate ? { createdAt: now, createdBy: userId } : {}),
    updatedAt: now,
    updatedBy: userId,
  };
  return { ...data, ...auditInfo };
}

/**
 * Create audit log entry
 */
export async function createAuditLog(params: {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        ...params,
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error for audit log failures
  }
}