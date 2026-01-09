import { Link } from "wouter";
import { format } from "date-fns";
import { MapPin, Calendar, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteItinerary } from "@/hooks/use-itineraries";
import type { Itinerary } from "@shared/schema";
import { motion } from "framer-motion";

interface ItineraryCardProps {
  itinerary: Itinerary;
  index: number;
}

export function ItineraryCard({ itinerary, index }: ItineraryCardProps) {
  const deleteMutation = useDeleteItinerary();

  const cityImages: Record<string, string> = {
    "Tokyo": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop",
    "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop",
    "Osaka": "https://images.unsplash.com/photo-1590559899731-a38283956c8e?q=80&w=1000&auto=format&fit=crop",
    "Hokkaido": "https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?q=80&w=1000&auto=format&fit=crop",
    "Default": "https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop"
  };

  // Simple heuristic to pick an image based on title/location
  const bgImage = Object.keys(cityImages).find(city => 
    itinerary.location.includes(city) || itinerary.title.includes(city)
  ) || "Default";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      <div className="aspect-[16/9] w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        {/* Descriptive comment for Unsplash Image */}
        {/* Japanese landscape image based on location */}
        <img 
          src={cityImages[bgImage as keyof typeof cityImages]} 
          alt={itinerary.location}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-4 left-4 right-4 z-20 text-white">
          <h3 className="font-bold text-xl truncate">{itinerary.title}</h3>
          <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{itinerary.location}</span>
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
          <Calendar className="w-4 h-4 text-primary/80" />
          <span>
            {format(new Date(itinerary.startDate), 'MMM d, yyyy')} 
            {' - '}
            {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <Link href={`/itinerary/${itinerary.id}`}>
            <Button variant="outline" className="group/btn border-primary/20 hover:border-primary/50 hover:bg-primary/5 hover:text-primary">
              View Plan 
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your trip to {itinerary.location}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteMutation.mutate(itinerary.id)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}
