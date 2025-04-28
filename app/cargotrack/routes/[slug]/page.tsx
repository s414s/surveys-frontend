"use client";

import { PageProps } from "@/.next/types/app/layout";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarClock, MapPin, Navigation, Package, Phone, Timer, Truck, User } from "lucide-react";
import Link from "next/link";

export default function Page({ params }: PageProps) {
    const freightId = params.slug;
    console.log(freightId);

    const [activeTab, setActiveTab] = useState("overview");

    // Mock data for the specific route
    const route = {
        id: "RT-1234",
        pickup: "123 Main St, Springfield",
        destination: "456 Oak Ave, Shelbyville",
        scheduledTime: "2:30 PM",
        estimatedDuration: "45 min",
        distance: "12.5 miles",
        status: "upcoming",
        driver: {
            name: "John Doe",
            phone: "(555) 123-4567",
            vehicle: "Toyota Prius",
            licensePlate: "ABC-1234"
        },
        parcels: [
            {
                id: "PCL-1001",
                recipient: "Sarah Johnson",
                address: "456 Oak Ave, Shelbyville, Apt 2B",
                phone: "(555) 234-5678",
                size: "Medium",
                weight: "3.2 lbs",
                priority: "Standard",
                deliveryNotes: "Leave at front door if no answer",
                status: "In transit"
            },
            {
                id: "PCL-1002",
                recipient: "Mark Wilson",
                address: "456 Oak Ave, Shelbyville, Apt 4C",
                phone: "(555) 345-6789",
                size: "Small",
                weight: "1.5 lbs",
                priority: "Express",
                deliveryNotes: "Signature required",
                status: "In transit"
            },
            {
                id: "PCL-1003",
                recipient: "Emma Davis",
                address: "458 Oak Ave, Shelbyville",
                phone: "(555) 456-7890",
                size: "Large",
                weight: "8.7 lbs",
                priority: "Standard",
                deliveryNotes: "Call upon arrival",
                status: "In transit"
            }
        ],
        routeNotes: "Multiple deliveries at Oak Ave apartment complex. Access code for building: 4321#"
    };

    return (
        <div className="flex w-full flex-col space-y-6">
            <div className="flex items-center space-x-2">
                <Link href="/">
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-3xl font-bold tracking-tight">Route {route.id}</h2>
                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                    {route.status}
                </Badge>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="parcels">Parcels ({route.parcels.length})</TabsTrigger>
                    <TabsTrigger value="map">Map</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <h3 className="text-lg font-semibold">Route Information</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-start space-x-3">
                                    <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Pickup</p>
                                        <p className="text-sm">{route.pickup}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Navigation className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Destination</p>
                                        <p className="text-sm">{route.destination}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <CalendarClock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Scheduled Time</p>
                                        <p className="text-sm">{route.scheduledTime}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Timer className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Duration & Distance</p>
                                        <p className="text-sm">{route.estimatedDuration} • {route.distance}</p>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="pt-2">
                                <h4 className="mb-2 text-sm font-semibold">Route Notes</h4>
                                <p className="text-sm">{route.routeNotes}</p>
                            </div> */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <h3 className="text-lg font-semibold">Driver Information</h3>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="flex items-start space-x-3">
                                    <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Driver Name</p>
                                        <p className="text-sm">{route.driver.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Contact</p>
                                        <p className="text-sm">{route.driver.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Truck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">Vehicle</p>
                                        <p className="text-sm">{route.driver.vehicle}</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-muted-foreground">License Plate</p>
                                        <p className="text-sm">{route.driver.licensePlate}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="parcels" className="space-y-4">
                    {route.parcels.map((parcel) => (
                        <Card key={parcel.id}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-semibold">{parcel.id}</h3>
                                </div>
                                <Badge variant="outline">{parcel.status}</Badge>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-start space-x-3">
                                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Recipient</p>
                                            <p className="text-sm">{parcel.recipient}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Contact</p>
                                            <p className="text-sm">{parcel.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Address</p>
                                            <p className="text-sm">{parcel.address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                        <div className="space-y-1">
                                            <p className="text-xs font-medium text-muted-foreground">Package Details</p>
                                            <p className="text-sm">{parcel.size} • {parcel.weight}</p>
                                        </div>
                                    </div>
                                </div>
                                {parcel.deliveryNotes && (
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground">Delivery Notes</p>
                                        <p className="text-sm">{parcel.deliveryNotes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="map">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex h-80 items-center justify-center rounded-md border border-dashed">
                                <div className="text-center">
                                    <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="mt-2 text-muted-foreground">Map view would be displayed here</p>
                                    <p className="text-sm text-muted-foreground">Showing route from {route.pickup} to {route.destination}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}