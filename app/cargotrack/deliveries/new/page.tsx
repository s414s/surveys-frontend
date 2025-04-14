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
import { AddParcelToFreightRequest, City, Freight } from "@/appTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDate } from "date-fns";
import { capitalizeWord } from "@/utils/utils";
import { addParcelToFreight, getCities, getFreights } from "@/utils/endpoints";

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
  freightId: z.string().optional(),
})
  .refine((data) => data.origin !== data.destination || data.destination === "" || data.origin === "", {
    message: "Origin and destination cannot be the same location.",
    path: ["destination"], // Show the error on the destination field
  })
  .refine(
    (data) => {
      // If we have freights available, a freight must be selected
      return !data.origin || !data.destination || data.freightId;
    },
    {
      message: "Please select a freight.",
      path: ["freightId"],
    },
  );

// Add these state variables at the beginning of the DeliveryForm component:
export default function DeliveryForm() {
  const [cities, setCities] = useState<City[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [freights, setFreights] = useState<Freight[]>([]);
  const [isLoadingFreights, setIsLoadingFreights] = useState(false);
  const [freightError, setFreightError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: "", // weight: "" as unknown as number,
    },
  });

  const origin = form.watch("origin");
  const destination = form.watch("destination");

  // Add this useEffect after the state variables
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setIsLoadingCities(true);

        const citiesData = await getCities();
        setCities(citiesData);
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

  // Fetch freights when both origin and destination are set
  useEffect(() => {
    const fetchFreights = async () => {
      // Clear previous freights and errors
      setFreights([]);
      setFreightError(null);
      form.setValue("freightId", undefined);

      // Only fetch if both origin and destination are set and different
      if (origin && destination && origin !== destination) {
        setIsLoadingFreights(true);

        try {
          const originId = cities.find(x => x.name === origin)?.id;
          const destinationId = cities.find(x => x.name === destination)?.id;

          if (!originId || !destinationId)
            return;

          const responseData = await getFreights(originId, destinationId);

          const freightsWithDates = responseData.data.map((freight) => ({
            ...freight,
            dueStart: new Date(freight.dueStart),
          }));

          setFreights(freightsWithDates);

          // If there are freights, select the first one by default
          if (freightsWithDates.length > 0) {
            form.setValue("freightId", freightsWithDates[0].id.toString());
          } else {
            setFreightError("No freights available for the selected locations.");
          }
        } catch (error) {
          console.error("Error fetching freights:", error);
          setFreightError(error instanceof Error ? error.message : "Failed to fetch freights");
        } finally {
          setIsLoadingFreights(false);
        }
      }
    };

    fetchFreights();
  }, [origin, destination, form]);

  // Add validation trigger when origin or destination changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "origin" || name === "destination") {
        // Trigger validation on the destination field when either origin or destination changes
        form.trigger("destination");
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const selectedFreightId = values.freightId;
    const originId = cities.find(x => x.name === values.origin)?.id;
    const destinationId = cities.find(x => x.name === values.destination)?.id;

    if (!originId || !destinationId || !selectedFreightId)
      throw new Error();

    const request: AddParcelToFreightRequest = {
      originId: originId,
      destinationId: destinationId,
      parcelWeight: values.weight === "" ? 0 : Number(values.weight),
    };

    try {
      await addParcelToFreight(Number(selectedFreightId), request);
      setIsSuccess(true);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Failed to fetch locations");
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
    // Convert weight to number for submission
    // const formData = {
    //   ...values,
    //   weight: values.weight === "" ? 0 : Number(values.weight),
    //   freight: selectedFreight,
    // };
    // const freightsData = await freightsResponse.json() as PagedResult<Freight>;
    // setTimeout(() => setIsSuccess(false), 3000); // Reset success message after 3 seconds
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

            {/* Freights Section */}
            {origin && destination && origin !== destination && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Available Freights</h3>

                {isLoadingFreights && (
                  <div className="space-y-2">
                    <Skeleton className="h-[60px] w-full rounded-md" />
                    <Skeleton className="h-[60px] w-full rounded-md" />
                  </div>
                )}

                {freightError && <div className="bg-amber-100 text-amber-800 p-3 rounded-md">{freightError}</div>}

                {!isLoadingFreights && freights.length > 0 && (
                  <FormField
                    control={form.control}
                    name="freightId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                            {freights.map((freight) => (
                              <div
                                key={freight.id}
                                className={cn(
                                  "flex items-center justify-between rounded-lg border p-4",
                                  freight.id.toString() === field.value
                                    ? "border-primary bg-primary/5"
                                    : "border-input",
                                )}
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={freight.id.toString()} id={freight.id.toString()} />
                                  <div>
                                    <label
                                      htmlFor={freight.id.toString()}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {capitalizeWord(freight.origin)} - {capitalizeWord(freight.destination)}
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      Date: {formatDate(freight.dueStart, "dd-MM-yyyy")} • Driver: {capitalizeWord(freight.driver.name)}
                                    </p>
                                  </div>
                                </div>
                                {/* <div className="text-sm font-medium">ID: {freight.id}</div> */}
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md">Delivery created successfully!</div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Delivery"}
            </Button>

          </form >
        </Form >
      </CardContent >
    </Card >
  );
}
