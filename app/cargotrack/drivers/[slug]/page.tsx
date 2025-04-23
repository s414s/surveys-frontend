'use client';

import { PageProps } from "@/.next/types/app/layout";
import { User, UserUpdateRequest } from "@/appTypes";
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
import { updateDriver } from "@/utils/endpoints/userEndpoints";
import { capitalizeWord } from "@/utils/utils";

const userFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters").max(50, "Surname cannot exceed 50 characters"),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const fallbackValues: UserFormValues = {
    name: "",
    surname: "",
};

// export default function Page({ userId }: { userId: string; }) {
export default function Page({ params }: PageProps) {
    const userId = params.slug;

    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const { data, error, loading } = useFetch<User>("GET", `/users/${userId}`);

    // Initialize form with empty defaults first
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: fallbackValues,
    });

    // Update form values when data is loaded
    useEffect(() => {
        if (data) {
            // Reset the form with values from the API
            form.reset({
                name: capitalizeWord(data.name),
                surname: capitalizeWord(data.surname),
            });
        }
    }, [data, form]);

    async function onSubmit(formData: UserFormValues) {
        setIsSaving(true);
        try {
            const request: UserUpdateRequest = {
                name: formData.name,
                surname: formData.surname,
            };

            await updateDriver(Number(userId), request);

            toast({
                title: "User updated",
                description: "The user information has been updated successfully.",
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update user. Please try again.",
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
            title: "Error fetching user",
            description: "Unable to load user information. You can still update the fields.",
            variant: "destructive",
        });

        // TODO - infinite re-renders
        throw new Error();
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Edit Driver</CardTitle>
                    <CardDescription>Update the drivers name and surname.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter name" {...field} />
                                        </FormControl>
                                        <FormDescription>The drivers first name.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="surname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Surname</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter surname" {...field} />
                                        </FormControl>
                                        <FormDescription>The drivers last name or family name.</FormDescription>
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