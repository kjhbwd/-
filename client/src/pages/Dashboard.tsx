import { useItineraries } from "@/hooks/use-itineraries";
import { ItineraryCard } from "@/components/ItineraryCard";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Plane } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: itineraries, isLoading, isError } = useItineraries();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Trips</h2>
        <p className="text-muted-foreground mb-4">Something went wrong while fetching your itineraries.</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold font-jp text-foreground">My Journeys</h1>
          <p className="text-muted-foreground mt-1">Manage your upcoming adventures to Japan.</p>
        </div>
        <Link href="/create">
          <Button className="shadow-lg shadow-primary/25 rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" /> Plan New Trip
          </Button>
        </Link>
      </div>

      {itineraries && itineraries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.map((itinerary, index) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} index={index} />
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
            <Plane className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No trips planned yet</h3>
          <p className="text-muted-foreground max-w-sm text-center mb-8">
            Ready to explore the Land of the Rising Sun? Start planning your first itinerary now.
          </p>
          <Link href="/create">
            <Button size="lg" className="rounded-full">Create my first itinerary</Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
