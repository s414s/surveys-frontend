"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";

// TODO - validate origin and destination are not the same
const locations = [
  { label: "New York", value: "new-york" },
  { label: "Los Angeles", value: "los-angeles" },
  { label: "Chicago", value: "chicago" },
  { label: "Houston", value: "houston" },
  { label: "Phoenix", value: "phoenix" },
  { label: "Philadelphia", value: "philadelphia" },
  { label: "San Antonio", value: "san-antonio" },
  { label: "San Diego", value: "san-diego" },
];

const formSchema = z.object({
  origin: z.string({
    required_error: "Please select an origin location.",
  }),
  destination: z.string({
    required_error: "Please select a destination location.",
  }),
  weight: z.coerce
    .number({
      required_error: "Please enter the weight.",
      invalid_type_error: "Weight must be a number.",
    })
    .positive("Weight must be greater than 0."),
});

export default function DeliveryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
    },
  });

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
                        >
                          {field.value
                            ? locations.find((location) => location.value === field.value)?.label
                            : "Select origin location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandList>
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((location) => (
                              <CommandItem
                                value={location.label}
                                key={location.value}
                                onSelect={() => {
                                  form.setValue("origin", location.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    location.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {location.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
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
                        >
                          {field.value
                            ? locations.find((location) => location.value === field.value)?.label
                            : "Select destination location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandList>
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((location) => (
                              <CommandItem
                                value={location.label}
                                key={location.value}
                                onSelect={() => {
                                  form.setValue("destination", location.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    location.value === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {location.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
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
                  <FormDescription>Enter the weight of your package in kilograms.</FormDescription>
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
