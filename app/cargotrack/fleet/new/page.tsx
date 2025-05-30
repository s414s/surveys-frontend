"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { CreateNewTruckRequest } from "@/appTypes";
import { createNewTruck } from "@/utils/endpoints/trucksEndpoints";
import { delay, isDateInFuture } from "@/utils/utils";

// Helper function to convert date string to Unix timestamp
// const dateStringToUnix = (dateString: string): number => {
//     return Math.floor(new Date(dateString).getTime() / 1000);
// };

const getTodayDateString = (): string => {
    return new Date().toISOString().split("T")[0];
};

// Create a schema for form validation
const truckFormSchema = z.object({
    plate: z.string().min(2, "Plate must be at least 2 characters").max(20, "Plate cannot exceed 20 characters"),
    mileage: z.coerce.number().nonnegative("Mileage must be a non-negative number"),
    mark: z.string().min(1, "Mark is required").max(50, "Mark cannot exceed 50 characters"),
    consumption: z.coerce
        .number()
        .positive("Consumption must be a positive number")
        .max(100, "Consumption seems too high"),
    maxWeight: z.coerce
        .number()
        .positive("Maximum weight must be a positive number")
        .max(100000, "Maximum weight cannot exceed 100,000 kg"),
    manufactoringDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Please enter a valid manufacturing date",
        })
        .refine((date) => !isDateInFuture(date), {
            message: "Manufacturing date cannot be in the future",
        }),
    lastMaintenenceDate: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Please enter a valid maintenance date",
        })
        .refine((date) => !isDateInFuture(date), {
            message: "Maintenance date cannot be in the future",
        }),
});

type TruckFormValues = z.infer<typeof truckFormSchema>;

// Default values for a new truck
const defaultValues: TruckFormValues = {
    plate: "",
    mileage: 0,
    mark: "",
    consumption: 0,
    maxWeight: 0,
    manufactoringDate: getTodayDateString(),
    lastMaintenenceDate: getTodayDateString(),
};

export default function Page() {
    const { toast } = useToast();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with default values
    const form = useForm<TruckFormValues>({
        resolver: zodResolver(truckFormSchema),
        defaultValues,
    });

    async function redirectToAddress(url: string) {
        await delay(2000);
        router.push(url);
    }

    async function onSubmit(formData: TruckFormValues) {
        setIsSubmitting(true);
        try {
            // Convert date strings to Unix timestamps
            const request: CreateNewTruckRequest = {
                plate: formData.plate,
                mileage: formData.mileage,
                mark: formData.mark,
                consumption: formData.consumption,
                maxWeight: formData.maxWeight,
                manufacturingDate: new Date(formData.manufactoringDate),
                lastMaintenance: new Date(formData.lastMaintenenceDate),
                // manufactoringDateUnix: dateStringToUnix(formData.manufactoringDate),
                // lastMaintenenceDateUnix: dateStringToUnix(formData.lastMaintenenceDate),
            };

            await createNewTruck(request);

            toast({
                title: "Truck created",
                description: "The new truck has been added successfully.",
            });

            await redirectToAddress("/cargotrack/fleet");
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to create truck. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container mx-auto py-4 px-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Add New Truck</CardTitle>
                    <CardDescription>Enter the details to register a new truck in the system.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="plate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>License Plate</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter license plate" {...field} />
                                        </FormControl>
                                        <FormDescription>The trucks license plate number.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="mark"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make/Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter make and model" {...field} />
                                        </FormControl>
                                        <FormDescription>The manufacturer and model of the truck.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="mileage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mileage (km)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="0" {...field} />
                                            </FormControl>
                                            <FormDescription>Current mileage in kilometers.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="consumption"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fuel Consumption (l/km)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormDescription>Average fuel consumption in liters per kilometer.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="maxWeight"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum Weight Capacity (kg)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="0" {...field} />
                                        </FormControl>
                                        <FormDescription>The maximum weight the truck can carry in kilograms.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="manufactoringDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Manufacturing Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormDescription>When the truck was manufactured.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lastMaintenenceDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Last Maintenance Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormDescription>When the truck last received maintenance.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Button type="submit" className="ml-auto flex items-center gap-2" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        <span>Creating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="h-4 w-4" />
                                        <span>Create Truck</span>
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
}