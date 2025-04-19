"use client";

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
import type { Settings } from "@/appTypes";
import LoadingComponent from "@/components/common/loader";

const settingsFormSchema = z.object({
    pricePerKilogram: z.coerce.number().positive("Price must be a positive number").max(1000, "Price cannot exceed 1000"),
    pricePerLiterFuel: z.coerce.number().positive("Price must be a positive number").max(100, "Price cannot exceed 100"),
    pricePerHourDriver: z.coerce.number().positive("Price must be a positive number").max(100, "Price cannot exceed 100"),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

const fallbackValues: SettingsFormValues = {
    pricePerKilogram: 2.5,
    pricePerLiterFuel: 1.75,
    pricePerHourDriver: 25.0,
};

export default function SettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const { data, error, loading } = useFetch<Settings>("GET", `/settings`);

    // Initialize form with empty defaults first
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: fallbackValues,
    });

    // Update form values when data is loaded
    useEffect(() => {
        if (data) {
            // Reset the form with values from the API
            form.reset({
                pricePerKilogram: data.pricePerKilogram,
                pricePerLiterFuel: data.pricePerLiterFuel,
                pricePerHourDriver: data.pricePerHourDriver,
            });
        }
    }, [data, form]);

    // Handle form submission
    async function onSubmit(formData: SettingsFormValues) {
        setIsSaving(true);

        try {
            // Make API call to save settings
            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to save settings");
            }

            toast({
                title: "Settings updated",
                description: "Your pricing settings have been saved successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to save settings. Please try again.",
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
            title: "Error fetching settings",
            description: "Using default values. You can still update settings.",
            variant: "destructive",
        });
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Pricing Parameters</CardTitle>
                    <CardDescription>Configure the pricing parameters used for calculating shipping costs.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="pricePerKilogram"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Kilogram ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormDescription>The base price charged per kilogram of package weight.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pricePerLiterFuel"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Liter of Fuel ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormDescription>The cost of fuel used for calculating distance-based charges.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pricePerHourDriver"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Hour of Worker ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            The hourly rate for labor costs associated with handling packages.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                        <span>Save Settings</span>
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
