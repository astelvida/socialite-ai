import { PrismaClient } from "../src/app/generated/prisma";
import prisma from "./prisma";

/**
 * Database utility functions for optimizing query performance
 */

/**
 * Reusable transaction wrapper with automatic error handling and retry logic
 */
export async function withTransaction<T>(callback: (tx: PrismaClient) => Promise<T>, retryCount = 3): Promise<T> {
  let attempts = 0;

  while (attempts < retryCount) {
    try {
      return await prisma.$transaction(async (tx) => {
        return await callback(tx as PrismaClient);
      });
    } catch (error: unknown) {
      attempts++;

      // If this was the last attempt, throw the error
      if (attempts >= retryCount) {
        throw error;
      }

      // If error is a retryable database error, wait and retry
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error.code === "P2034" || error.code === "P2028" || error.code === "P1002")
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
        continue;
      }

      // For non-retryable errors, throw immediately
      throw error;
    }
  }

  // This should never happen due to the throw in the loop
  throw new Error("Unexpected end of transaction retry loop");
}

/**
 * Batched query executor for efficiently processing large datasets
 */
export async function batchQuery<T, R>(
  items: T[],
  batchSize = 100,
  processor: (batch: T[]) => Promise<R[]>
): Promise<R[]> {
  const results: R[] = [];

  // Process in batches to avoid memory issues
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await processor(batch);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Check database connection and query performance
 */
export async function checkDbHealth(): Promise<{
  connected: boolean;
  responseTimeMs: number;
  version: string | null;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    // Simple query to check connection
    const result = await prisma.$queryRaw<[{ version: string }]>`SELECT version()`;
    const endTime = Date.now();

    return {
      connected: true,
      responseTimeMs: endTime - startTime,
      version: result[0]?.version || null,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      connected: false,
      responseTimeMs: Date.now() - startTime,
      version: null,
      error: errorMessage,
    };
  }
}
