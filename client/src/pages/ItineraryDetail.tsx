import { useRoute, Link, useLocation } from "wouter";
import { useItinerary, useDeleteItinerary } from "@/hooks/use-itineraries";
import { format } from "date-fns";
import { MapPin, Calendar, Clock, ArrowLeft, Trash2, Utensils, Train, Camera, BedDouble, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
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
import type { ItineraryItem } from "@shared/schema";

// Map types to icons
const TypeIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'food': return <Utensils className="w-4 h-4" />;
    case 'transport': return <Train className="w-4 h-4" />;
    case 'lodging': return <BedDouble className="w-4 h-4" />;
    default: return <Camera className="w-4 h-4" />;
  }
};

const TypeBadge = ({ type }: { type: string }) => {
  const variants: Record<string, string> = {
    food: "bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200",
    transport: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
    lodging: "bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200",
    sightseeing: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  };
  
  const className = variants[type.toLowerCase()] || variants.sightseeing;

  return (
    <Badge variant="outline" className={`gap-1.5 ${className}`}>
      <TypeIcon type={type} />
      <span className="capitalize">{type}</span>
    </Badge>
  );
};

export default function ItineraryDetail() {
  const [_, params] = useRoute("/itinerary/:id");
  const [__, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  const { data: itinerary, isLoading, isError } = useItinerary(id);
  const deleteMutation = useDeleteItinerary();
  const [activeDay, setActiveDay] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !itinerary) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Itinerary Not Found</h2>
        <p className="text-muted-foreground mb-6">The trip you are looking for does not exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => setLocation("/")
    });
  };

  // Group items by day
  const itemsByDay = itinerary.items.reduce((acc, item) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {} as Record<number, ItineraryItem[]>);

  // Get total days to iterate
  const totalDays = Math.max(...itinerary.items.map(i => i.day), 1);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

  const currentItems = itemsByDay[activeDay] || [];
  const activeDate = new Date(itinerary.startDate);
  activeDate.setDate(activeDate.getDate() + (activeDay - 1));

  return (
    <div className="container px-4 sm:px-8 py-10 max-w-4xl">
      <Link href="/">
        <Button variant="ghost" className="mb-6 pl-0 text-muted-foreground hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8 border-b pb-8">
        <div>
          <h1 className="text-4xl font-bold font-jp mb-3">{itinerary.title}</h1>
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{itinerary.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <span>
                {format(new Date(itinerary.startDate), 'MMM d, yyyy')} - {format(new Date(itinerary.endDate), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/5">
              <Trash2 className="w-4 h-4 mr-2" /> Delete Trip
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Itinerary?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Are you sure you want to remove this trip?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Day Selection Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-2 no-scrollbar">
        {daysArray.map((day) => (
          <Button
            key={day}
            variant={activeDay === day ? "default" : "outline"}
            onClick={() => setActiveDay(day)}
            className={`rounded-full px-6 transition-all ${activeDay === day ? 'shadow-md shadow-primary/20' : ''}`}
          >
            Day {day}
          </Button>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-2xl font-bold font-jp text-primary">Day {activeDay}</h3>
            <p className="text-muted-foreground font-medium">{format(activeDate, 'EEEE, MMMM do')}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              size="icon" 
              variant="outline" 
              disabled={activeDay === 1}
              onClick={() => setActiveDay(prev => prev - 1)}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              disabled={activeDay === totalDays}
              onClick={() => setActiveDay(prev => prev + 1)}
              className="rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4"
          >
            {currentItems.length === 0 ? (
              <div className="bg-muted/30 border border-dashed rounded-xl p-12 text-center">
                <Camera className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground italic text-lg">Free day for exploration.</p>
                <p className="text-sm text-muted-foreground/60 mt-2">No scheduled activities for today.</p>
              </div>
            ) : (
              currentItems.sort((a, b) => (a.time || "").localeCompare(b.time || "")).map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-card rounded-xl border border-border/50 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:items-start"
                >
                  <div className="min-w-[80px] pt-1">
                    <div className="flex items-center text-sm font-semibold text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      {item.time}
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="text-lg font-semibold">{item.activity}</h4>
                      <TypeBadge type={item.type || 'sightseeing'} />
                    </div>
                    
                    {item.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
                        {item.location}
                      </div>
                    )}

                    {item.notes && (
                      <p className="text-sm text-muted-foreground/80 mt-2 bg-muted/50 p-3 rounded-lg leading-relaxed whitespace-pre-wrap">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

