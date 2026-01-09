import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { z } from "zod";
import OpenAI from "openai";
import express from "express";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve data.json directly so the frontend can fetch the latest version
  app.use('/data.json', express.static(path.resolve(process.cwd(), 'data.json')));

  // Setup Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);

  // OpenAI Client for Itinerary Generation
  const openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  // === ITINERARY ROUTES ===

  app.get(api.itineraries.list.path, isAuthenticated, async (req: any, res) => {
    const userId = req.user.claims.sub;
    const itineraries = await storage.getItineraries(userId);
    res.json(itineraries);
  });

  app.get(api.itineraries.get.path, isAuthenticated, async (req: any, res) => {
    const itinerary = await storage.getItinerary(Number(req.params.id));
    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }
    // Check ownership
    if (itinerary.userId !== req.user.claims.sub) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(itinerary);
  });

  app.post(api.itineraries.create.path, isAuthenticated, async (req: any, res) => {
    try {
      const input = api.itineraries.create.input.parse(req.body);
      const userId = req.user.claims.sub;
      
      const itinerary = await storage.createItinerary({
        ...input,
        userId,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      }, input.items);
      
      res.status(201).json(itinerary);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.put(api.itineraries.update.path, isAuthenticated, async (req: any, res) => {
    const input = api.itineraries.update.input.parse(req.body);
    const itinerary = await storage.updateItinerary(Number(req.params.id), {
        ...input,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
    });
    res.json(itinerary);
  });

  app.delete(api.itineraries.delete.path, isAuthenticated, async (req, res) => {
    await storage.deleteItinerary(Number(req.params.id));
    res.status(204).send();
  });

  // === AI GENERATION ROUTE ===

  app.post(api.ai.generate.path, isAuthenticated, async (req: any, res) => {
    try {
      const { location, days, preferences, startDate } = req.body;
      
      const prompt = `
        Generate a ${days}-day travel itinerary for ${location}.
        Preferences: ${preferences || "General sightseeing"}.
        Start Date: ${startDate}.
        
        Return JSON format with:
        {
          "title": "Trip Title",
          "items": [
            {
              "day": 1,
              "time": "10:00",
              "activity": "Activity Name",
              "location": "Location Name",
              "notes": "Description",
              "type": "sightseeing"
            }
          ]
        }
        Do not include markdown formatting, just raw JSON.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0]?.message?.content || "{}");
      res.json(result);

    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ message: "Failed to generate itinerary" });
    }
  });

  return httpServer;
}
