"use client";

import { PageProps } from "@/.next/types/app/layout";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Package, User } from "lucide-react";
import { Parcel } from "@/appTypes";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "@/components/common/loader";

export default function Page({ params }: PageProps) {
    const freightId = params.slug;
    const [activeTab, setActiveTab] = useState("parcels");

    const url = `/freights/${freightId}/parcels`;
    const { data, error, loading } = useFetch<Parcel[]>("GET", url);
    if (error) console.log(error);

    console.log("DATA", data);

    return (
        <div className="flex w-full flex-col space-y-6">
            <div className="flex items-center space-x-2">
                <h2 className="text-3xl font-bold tracking-tight">Freight {freightId}</h2>
                {/* <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                    {route.status}
                </Badge> */}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="parcels">Parcels ({data?.length ?? 0})</TabsTrigger>
                </TabsList>

                {loading && <LoadingComponent isAdminOnly={false} />}

                <TabsContent value="parcels" className="space-y-4">
                    {data?.map((parcel) => <ParcelCard key={parcel.id} parcel={parcel} />)}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ParcelCard({ parcel }: { parcel: Parcel; }) {
    return (
        <Card key={parcel.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">ID - {parcel.id}</h3>
                </div>
                {/* <Badge variant="outline">In transit</Badge> */}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-start space-x-3">
                        <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Recipient</p>
                            <p className="text-sm">{parcel.contactEmail}</p>
                        </div>
                    </div>

                    {/* <div className="flex items-start space-x-3">
                        <Phone className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Contact</p>
                            <p className="text-sm">{parcel.phone}</p>
                        </div>
                    </div> */}

                    <div className="flex items-start space-x-3">
                        <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Address</p>
                            <p className="text-sm">{parcel.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <Package className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Package Details</p>
                            <p className="text-sm">{parcel.weight} Kg</p>
                        </div>
                    </div>
                </div>
                {/* {parcel.deliveryNotes && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Delivery Notes</p>
                        <p className="text-sm">{parcel.deliveryNotes}</p>
                    </div>
                )} */}
            </CardContent>
        </Card>
    );
}