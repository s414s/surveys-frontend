"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { City } from "@/appTypes";

const formSchema = z.object({
  origin: z.string().min(1, {
    message: "Please select an origin location.",
  }),
  destination: z.string().min(1, {
    message: "Please select a destination location.",
  }),
  weight: z.union([
    z.string().refine((val) => val === "", {
      message: "Please enter a weight.",
    }),
    z.coerce.number().min(0.1, {
      message: "Weight must be at least 0.1 kg.",
    }),
  ]),
});

// Add these state variables at the beginning of the DeliveryForm component:
export default function DeliveryForm() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "", // weight: "" as unknown as number,
    },
  });

  // Add this useEffect after the state variables
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingCities(true);

        const BASE_URL = process.env.API_URL || 'http://localhost:5097';
        const citiesResponse = await fetch(`${BASE_URL}/cities`);
        if (!citiesResponse.ok) {
          throw new Error("Failed to fetch origins");
        }

        const originsData = await citiesResponse.json();
        setCities(originsData);
        setIsLoadingCities(false);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setFetchError(error instanceof Error ? error.message : "Failed to fetch locations");
      } finally {
        setIsLoadingCities(false);
      }
    };

    fetchLocations();
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    console.log("Form values:", values);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset success message after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {fetchError && (
              <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
                Error: {fetchError}. Please try refreshing the page.
              </div>
            )}
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
                              ? cities.find((location) => location.name === field.value)?.name
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
                          ) : cities.length === 0 ? (
                            <CommandEmpty>No origins available.</CommandEmpty>
                          ) : (
                            <>
                              <CommandEmpty>No location found.</CommandEmpty>
                              <CommandGroup>
                                {cities.map((location) => (
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
                              ? cities.find((location) => location.name === field.value)?.name
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
                          ) : cities.length === 0 ? (
                            <CommandEmpty>No destinations available.</CommandEmpty>
                          ) : (
                            <>
                              <CommandEmpty>No location found.</CommandEmpty>
                              <CommandGroup>
                                {cities.map((location) => (
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

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md">Delivery created successfully!</div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Delivery"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
