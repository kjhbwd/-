import { db } from "./db";
import {
  itineraries,
  itineraryItems,
  type InsertItinerary,
  type Itinerary,
  type InsertItineraryItem,
  type ItineraryItem,
  type ItineraryWithItems
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Itineraries
  getItineraries(userId: string): Promise<Itinerary[]>;
  getItinerary(id: number): Promise<ItineraryWithItems | undefined>;
  createItinerary(itinerary: InsertItinerary, items?: InsertItineraryItem[]): Promise<Itinerary>;
  updateItinerary(id: number, updates: Partial<InsertItinerary>): Promise<Itinerary>;
  deleteItinerary(id: number): Promise<void>;
  
  // Items
  createItineraryItem(item: InsertItineraryItem): Promise<ItineraryItem>;
  deleteItineraryItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getItineraries(userId: string): Promise<Itinerary[]> {
    return await db.select().from(itineraries)
      .where(eq(itineraries.userId, userId))
      .orderBy(desc(itineraries.startDate));
  }

  async getItinerary(id: number): Promise<ItineraryWithItems | undefined> {
    const [itinerary] = await db.select().from(itineraries).where(eq(itineraries.id, id));
    if (!itinerary) return undefined;

    const items = await db.select().from(itineraryItems)
      .where(eq(itineraryItems.itineraryId, id))
      .orderBy(itineraryItems.day, itineraryItems.time);

    return { ...itinerary, items };
  }

  async createItinerary(itinerary: InsertItinerary, items: InsertItineraryItem[] = []): Promise<Itinerary> {
    return await db.transaction(async (tx) => {
      const [newItinerary] = await tx.insert(itineraries).values(itinerary).returning();
      
      if (items.length > 0) {
        const itemsWithId = items.map(item => ({ ...item, itineraryId: newItinerary.id }));
        await tx.insert(itineraryItems).values(itemsWithId);
      }
      
      return newItinerary;
    });
  }

  async updateItinerary(id: number, updates: Partial<InsertItinerary>): Promise<Itinerary> {
    const [updated] = await db.update(itineraries)
      .set(updates)
      .where(eq(itineraries.id, id))
      .returning();
    return updated;
  }

  async deleteItinerary(id: number): Promise<void> {
    await db.delete(itineraries).where(eq(itineraries.id, id));
  }

  async createItineraryItem(item: InsertItineraryItem): Promise<ItineraryItem> {
    const [newItem] = await db.insert(itineraryItems).values(item).returning();
    return newItem;
  }

  async deleteItineraryItem(id: number): Promise<void> {
    await db.delete(itineraryItems).where(eq(itineraryItems.id, id));
  }
}

export const storage = new DatabaseStorage();
