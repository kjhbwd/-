export * from "./models/auth";
export * from "./models/chat";

import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Links to auth users.id (which is varchar)
  title: text("title").notNull(),
  location: text("location").notNull(), // e.g., "Tokyo, Osaka"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const itineraryItems = pgTable("itinerary_items", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id").notNull().references(() => itineraries.id, { onDelete: "cascade" }),
  day: integer("day").notNull(), // Day 1, Day 2...
  time: text("time"), // "10:00", "Morning"
  activity: text("activity").notNull(),
  location: text("location"),
  notes: text("notes"),
  type: text("type").default("sightseeing"), // sightseeing, food, transport, lodging
});

// === RELATIONS ===

export const itinerariesRelations = relations(itineraries, ({ many }) => ({
  items: many(itineraryItems),
}));

export const itineraryItemsRelations = relations(itineraryItems, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [itineraryItems.itineraryId],
    references: [itineraries.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertItinerarySchema = createInsertSchema(itineraries).omit({ id: true, createdAt: true });
export const insertItineraryItemSchema = createInsertSchema(itineraryItems).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

// Base types
export type Itinerary = typeof itineraries.$inferSelect;
export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type ItineraryItem = typeof itineraryItems.$inferSelect;
export type InsertItineraryItem = z.infer<typeof insertItineraryItemSchema>;

// Request types
export type CreateItineraryRequest = InsertItinerary & { items?: InsertItineraryItem[] };
export type UpdateItineraryRequest = Partial<InsertItinerary>;
export type CreateItineraryItemRequest = InsertItineraryItem;
export type UpdateItineraryItemRequest = Partial<InsertItineraryItem>;

// Generator Request
export interface GenerateItineraryRequest {
  location: string;
  days: number;
  preferences: string; // "Foodie", "History", "Anime"
}

// Response types
export type ItineraryWithItems = Itinerary & { items: ItineraryItem[] };
