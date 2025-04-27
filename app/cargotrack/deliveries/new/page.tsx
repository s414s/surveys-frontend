"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import type { City } from "@/appTypes";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { getCities } from "@/utils/endpoints/routesEndpoints";
import { createFreight } from "@/utils/endpoints/freightsEndpoints";

const formSchema = z
  .object({
    origin: z.string().min(1, {
      message: "Please select an origin location.",
    }),
    destination: z.string().min(1, {
      message: "Please select a destination location.",
    }),
    date: z.date({
      required_error: "Please select a date for the freight.",
    }),
  })
  .refine((data) => data.origin !== data.destination, {
    message: "Origin and destination cannot be the same location.",
    path: ["destination"],
  });

export default function RouteForm() {
  const [origins, setOrigins] = useState<City[]>([]);
  const [destinations, setDestinations] = useState<City[]>([]);

  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // const origin = form.watch("origin");
  // const destination = form.watch("destination");

  // Fetch origins
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingCities(true);
        const originCitiesData = await getCities();
        setOrigins(originCitiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setFetchError(error instanceof Error ? error.message : "Failed to fetch locations");
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchLocations();
  }, []);

  // Mine
  // Add validation trigger when origin changes
  useEffect(() => {
    const fetchDestinations = async (originId: number) => {
      try {
        setIsLoadingCities(true);
        const destinationCitiesData = await getCities(originId);
        setDestinations(destinationCitiesData);
        // Clear the destination field when origin changes
        form.setValue("destination", "");
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setFetchError(error instanceof Error ? error.message : "Failed to fetch destinations");
      } finally {
        setIsLoadingCities(false);
      }
    };

    const subscription = form.watch((value, { name }) => {
      if (name === "origin" && value.origin) {
        const selectedOrigin = origins.find((city) => city.name === value.origin);
        if (selectedOrigin?.id) {
          fetchDestinations(selectedOrigin.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, origins]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    const originId = origins.find((x) => x.name === values.origin)?.id;
    const destinationId = origins.find((x) => x.name === values.destination)?.id;

    if (!originId || !destinationId) {
      setFetchError("Invalid origin or destination");
      setIsSubmitting(false);
      return;
    }

    try {
      await createFreight(originId, destinationId, values.date);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      setFetchError(error instanceof Error ? error.message : "Failed to create route");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fetchError && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                Error: {fetchError}. Please try refreshing the page.
              </div>
            )}

            {/* Origin Selection */}
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Origin</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                          disabled={isLoadingCities}
                        >
                          {isLoadingCities
                            ? "Loading origins..."
                            : field.value
                              ? origins.find((location) => location.name === field.value)?.name
                              : "Select origin location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandList>
                          {isLoadingCities ? (
                            <div className="py-6 text-center text-sm">Loading origins...</div>
                          ) : origins.length === 0 ? (
                            <CommandEmpty>No origins available.</CommandEmpty>
                          ) : (
                            <>
                              <CommandEmpty>No location found.</CommandEmpty>
                              <CommandGroup>
                                {origins.map((location) => (
                                  <CommandItem
                                    value={location.name}
                                    key={location.id}
                                    onSelect={() => {
                                      form.setValue("origin", location.name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        location.name === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {location.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Destination Selection */}
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Destination</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("justify-between", !field.value && "text-muted-foreground")}
                          disabled={isLoadingCities}
                        >
                          {isLoadingCities
                            ? "Loading destinations..."
                            : field.value
                              ? destinations.find((location) => location.name === field.value)?.name
                              : "Select destination location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandList>
                          {isLoadingCities ? (
                            <div className="py-6 text-center text-sm">Loading destinations...</div>
                          ) : destinations.length === 0 ? (
                            <CommandEmpty>No destinations available.</CommandEmpty>
                          ) : (
                            <>
                              <CommandEmpty>No location found.</CommandEmpty>
                              <CommandGroup>
                                {destinations.map((location) => (
                                  <CommandItem
                                    value={location.name}
                                    key={location.id}
                                    onSelect={() => {
                                      form.setValue("destination", location.name);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        location.name === field.value ? "opacity-100" : "opacity-0",
                                      )}
                                    />
                                    {location.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Freight Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSuccess &&
              <div className="bg-green-100 text-green-800 p-3 rounded-md">
                Route created successfully!
              </div>}

            <Button type="submit" className="w-full" disabled={isSubmitting || isSuccess}>
              {isSubmitting ? "Creating..." : "Create Route"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
