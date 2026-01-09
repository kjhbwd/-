import { z } from 'zod';
import { insertItinerarySchema, insertItineraryItemSchema, itineraries, itineraryItems } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  itineraries: {
    list: {
      method: 'GET' as const,
      path: '/api/itineraries',
      responses: {
        200: z.array(z.custom<typeof itineraries.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/itineraries/:id',
      responses: {
        200: z.custom<typeof itineraries.$inferSelect & { items: typeof itineraryItems.$inferSelect[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/itineraries',
      input: insertItinerarySchema.extend({
        items: z.array(insertItineraryItemSchema).optional(),
      }),
      responses: {
        201: z.custom<typeof itineraries.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/itineraries/:id',
      input: insertItinerarySchema.partial(),
      responses: {
        200: z.custom<typeof itineraries.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/itineraries/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  ai: {
    generate: {
      method: 'POST' as const,
      path: '/api/ai/generate-itinerary',
      input: z.object({
        location: z.string(),
        days: z.number().min(1).max(14),
        preferences: z.string().optional(),
        startDate: z.string(), // ISO string
      }),
      responses: {
        200: z.object({
          title: z.string(),
          items: z.array(z.object({
            day: z.number(),
            time: z.string(),
            activity: z.string(),
            location: z.string(),
            notes: z.string(),
            type: z.string(),
          })),
        }),
        500: errorSchemas.internal,
      },
    },
  },
};

// ============================================
// URL BUILDER
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
