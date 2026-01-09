import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type GenerateItineraryRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// GET /api/itineraries
export function useItineraries() {
  return useQuery({
    queryKey: [api.itineraries.list.path],
    queryFn: async () => {
      const res = await fetch(api.itineraries.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch itineraries");
      return api.itineraries.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/itineraries/:id
export function useItinerary(id: number) {
  return useQuery({
    queryKey: [api.itineraries.get.path, id],
    enabled: !!id,
    queryFn: async () => {
      const url = buildUrl(api.itineraries.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch itinerary");
      return api.itineraries.get.responses[200].parse(await res.json());
    },
  });
}

// POST /api/itineraries (Save generated or new)
export function useCreateItinerary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(api.itineraries.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create itinerary");
      }
      return api.itineraries.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.itineraries.list.path] });
      toast({ title: "Success", description: "Itinerary saved successfully." });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// DELETE /api/itineraries/:id
export function useDeleteItinerary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.itineraries.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete itinerary");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.itineraries.list.path] });
      toast({ title: "Deleted", description: "Itinerary removed." });
    },
  });
}

// POST /api/ai/generate-itinerary
export function useGenerateItinerary() {
  return useMutation({
    mutationFn: async (data: GenerateItineraryRequest & { startDate: string }) => {
      const res = await fetch(api.ai.generate.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to generate itinerary");
      }
      return api.ai.generate.responses[200].parse(await res.json());
    },
  });
}
