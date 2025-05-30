"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, User } from "lucide-react";
import LoadingComponent from "@/components/common/loader";
import { searchParcelById } from "@/utils/endpoints/parcelsEndpoint";
import { Parcel } from "@/appTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { numberFormatter } from "@/utils/utils";
import { Badge } from "@/components/ui/badge";
import { parseISO, isBefore, isAfter } from 'date-fns';

export default function Page() {
    const [parcelId, setParcelId] = useState<string>("");
    const [parcel, setParcel] = useState<Parcel | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setParcel(null);
        if (!parcelId) {
            setError("Please enter a parcel ID");
            return;
        }
        setLoading(true);

        try {
            const result = await searchParcelById(Number(parcelId));
            setParcel(result);
        } catch (err: unknown) {
            console.error(err);
            setError("No parcel was found");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Enter Parcel ID"
                            className="pl-10"
                            value={parcelId}
                            onChange={(e) => setParcelId(e.target.value)}
                        />
                    </div>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            <div className="mt-6">
                {loading && <LoadingComponent isAdminOnly={false} />}

                {error && <p className="text-center">{error}</p>}

                {parcel && <ParcelDetails parcel={parcel} />}
            </div>
        </div>
    );
}

function ParcelDetails({ parcel }: { parcel: Parcel; }) {
    const numFormatter = numberFormatter(2, 2);
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <Card className="w-full max-w-3xl mx-auto p-4">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Parcel #{parcel.id}</CardTitle>
                    <Badge variant="outline" className="px-3 py-1">
                        {getIntervalStatus(parcel.etd, parcel.eta)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6 print:text-black print:bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:text-black print:bg-white">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground  print:text-black print:bg-white">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>Origin</span>
                            </div>
                            <p className="font-medium">{parcel.origin}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Departure (ETD)</span>
                            </div>
                            <p className="font-medium">{formatDate(parcel.etd)}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Price</span>
                            </div>
                            <p className="font-medium">
                                {numFormatter.format(parcel.price)} $
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <User className="h-4 w-4 mr-2" />
                                <span>Contact Email</span>
                            </div>
                            <p className="font-medium">
                                {parcel.contactEmail}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>Destination</span>
                            </div>
                            <p className="font-medium">{parcel.destination}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Arrival (ETA)</span>
                            </div>
                            <p className="font-medium">{formatDate(parcel.eta)}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <User className="h-4 w-4 mr-2" />
                                <span>Weight</span>
                            </div>
                            <p className="font-medium">
                                {parcel.weight} Kg
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function getIntervalStatus(startISO: string, endISO: string): string {
    const start = parseISO(startISO);
    const end = parseISO(endISO);
    const now = new Date();

    if (isBefore(now, start)) return 'Scheduled';
    if (isAfter(now, end)) return 'Delivered';
    return 'Ongoing';
}