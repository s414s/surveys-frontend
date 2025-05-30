'use client';

import { PageProps } from "@/.next/types/app/layout";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "@/components/common/loader";
import { Truck, UpdateTruckRequest } from "@/appTypes";
import { dateFormatter, dateStringToUnix, isDateInFuture } from "@/utils/utils";
import { updateTruck } from "@/utils/endpoints/trucksEndpoints";

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

const fallbackValues: TruckFormValues = {
    plate: "",
    mileage: 100,
    maxWeight: 200,
    mark: "",
    consumption: 0,
    manufactoringDate: "",
    lastMaintenenceDate: "",
};

export default function Page({ params }: PageProps) {
    const truckId = params.slug;

    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const { data, error, loading } = useFetch<Truck>("GET", `/trucks/${truckId}`);

    // Initialize form with empty defaults first
    const form = useForm<TruckFormValues>({
        resolver: zodResolver(truckFormSchema),
        defaultValues: fallbackValues,
    });

    // Update form values when data is loaded
    useEffect(() => {
        if (data) {
            // Reset the form with values from the API
            // Convert Unix timestamps to date strings for the form
            form.reset({
                plate: data.plate,
                mileage: data.mileage,
                mark: data.mark,
                maxWeight: data.maxWeight,
                consumption: data.consumption,
                // manufactoringDate: unixToDateString(data.manufactoringDateUnix),
                manufactoringDate: dateFormatter.format(data.manufactoringDateUnix),
                // lastMaintenenceDate: unixToDateString(data.lastMaintenenceDateUnix),
                lastMaintenenceDate: dateFormatter.format(data.lastMaintenenceDateUnix),
            });
        }
    }, [data, form]);

    async function onSubmit(formData: TruckFormValues) {
        setIsSaving(true);
        try {
            // Convert date strings back to Unix timestamps
            const request: UpdateTruckRequest = {
                plate: formData.plate,
                mileage: formData.mileage,
                mark: formData.mark,
                maxWeight: formData.maxWeight,
                consumption: formData.consumption,
                manufactoringDateUnix: dateStringToUnix(formData.manufactoringDate), // TODO
                lastMaintenenceDateUnix: dateStringToUnix(formData.lastMaintenenceDate), // TODO
            };

            await updateTruck(truckId, request);

            toast({
                title: "Truck updated",
                description: "The truck information has been updated successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update truck. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-10 px-4">
                <LoadingComponent isAdminOnly={false} />
            </div>
        );
    }

    if (error) {
        // Show error state but still render form with fallback values
        toast({
            title: "Error fetching truck",
            description: "Unable to load truck information. You can still update the fields.",
            variant: "destructive",
        });

        // TODO 
        throw new Error();
    }

    return (
        <div className="container mx-auto py-4 px-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Truck</CardTitle>
                    <CardDescription>Update the truck information and maintenance records.</CardDescription>
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
                                        <FormDescription>The truck license plate number.</FormDescription>
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

                            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            </div> */}

                        </CardContent>

                        <CardFooter>
                            <Button type="submit" className="ml-auto flex items-center gap-2" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        <span>Save Changes</span>
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
