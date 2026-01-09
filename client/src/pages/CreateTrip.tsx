import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGenerateItinerary, useCreateItinerary } from "@/hooks/use-itineraries";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  location: z.string().min(2, "City name is required"),
  days: z.number().min(1).max(14),
  startDate: z.date({ required_error: "Start date is required" }),
  preferences: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CreateTrip() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState<"form" | "generating" | "preview">("form");
  const [generatedData, setGeneratedData] = useState<any>(null);
  
  const generateMutation = useGenerateItinerary();
  const createMutation = useCreateItinerary();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      days: 3,
      preferences: "",
    }
  });

  const onSubmit = (data: FormData) => {
    setStep("generating");
    generateMutation.mutate({
      ...data,
      startDate: data.startDate.toISOString(),
    }, {
      onSuccess: (result) => {
        setGeneratedData({ ...result, startDate: data.startDate });
        setStep("preview");
      },
      onError: () => {
        setStep("form");
      }
    });
  };

  const handleSave = () => {
    if (!generatedData) return;
    
    // Calculate endDate based on startDate + days
    const startDate = new Date(generatedData.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + generatedData.items.length);

    createMutation.mutate({
      title: generatedData.title,
      location: form.getValues().location,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      items: generatedData.items,
    }, {
      onSuccess: () => {
        setLocation("/");
      }
    });
  };

  return (
    <div className="container max-w-3xl py-12 px-4">
      <AnimatePresence mode="wait">
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold font-jp mb-2">Plan Your Adventure</h1>
              <p className="text-muted-foreground">Tell our AI where you want to go and what you love.</p>
            </div>

            <Card className="p-8 shadow-xl border-border/60">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Where to?</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input 
                        {...form.register("location")}
                        placeholder="e.g. Tokyo, Kyoto, Osaka" 
                        className="pl-10 h-12 text-lg"
                      />
                    </div>
                    {form.formState.errors.location && (
                      <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Duration (Days)</Label>
                      <Select 
                        onValueChange={(val) => form.setValue("days", parseInt(val))}
                        defaultValue={String(form.getValues("days"))}
                      >
                        <SelectTrigger className="h-12 text-lg">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,10,14].map(day => (
                            <SelectItem key={day} value={String(day)}>{day} Days</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 flex flex-col">
                      <Label className="text-base font-semibold">Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-12 w-full pl-3 text-left font-normal text-lg",
                              !form.watch("startDate") && "text-muted-foreground"
                            )}
                          >
                            {form.watch("startDate") ? (
                              format(form.watch("startDate"), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={form.watch("startDate")}
                            onSelect={(date) => date && form.setValue("startDate", date)}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {form.formState.errors.startDate && (
                        <p className="text-sm text-destructive">{form.formState.errors.startDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Interests / Theme</Label>
                    <Select 
                      onValueChange={(val) => form.setValue("preferences", val)}
                    >
                      <SelectTrigger className="h-12 text-lg">
                        <SelectValue placeholder="What's your vibe?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Foodie">🍜 Foodie Adventure</SelectItem>
                        <SelectItem value="History & Culture">⛩️ History & Culture</SelectItem>
                        <SelectItem value="Anime & Pop Culture">🤖 Anime & Pop Culture</SelectItem>
                        <SelectItem value="Nature & Relaxation">🌸 Nature & Relaxation</SelectItem>
                        <SelectItem value="Shopping">🛍️ Shopping Spree</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full h-14 text-lg font-semibold shadow-lg shadow-primary/25 rounded-xl mt-4"
                  disabled={generateMutation.isPending}
                >
                  {generateMutation.isPending ? "Connecting to Guide..." : "Generate Itinerary"}
                  {!generateMutation.isPending && <Sparkles className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </Card>
          </motion.div>
        )}

        {step === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[400px] text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-2">Crafting your perfect trip...</h2>
            <p className="text-muted-foreground max-w-md">
              Our AI is analyzing the best routes, hidden gems, and local favorites for {form.getValues("location")}.
            </p>
          </motion.div>
        )}

        {step === "preview" && generatedData && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold font-jp">{generatedData.title}</h1>
              <p className="text-muted-foreground mt-2">Does this look good to you?</p>
            </div>

            <div className="space-y-6">
              {generatedData.items.map((item: any, idx: number) => (
                <Card key={idx} className="p-6 border-l-4 border-l-primary hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="min-w-[100px] flex flex-col justify-center">
                      <span className="text-sm font-bold text-primary uppercase tracking-wider">Day {item.day}</span>
                      <span className="text-2xl font-light text-foreground">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{item.activity}</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" /> {item.location}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed bg-muted/30 p-3 rounded-lg">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex gap-4 pt-4 sticky bottom-8 justify-center">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => setStep("form")}
                className="bg-white/80 backdrop-blur"
              >
                Back to Edit
              </Button>
              <Button 
                size="lg" 
                onClick={handleSave} 
                disabled={createMutation.isPending}
                className="shadow-xl shadow-primary/20 min-w-[200px]"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Save Itinerary"
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
