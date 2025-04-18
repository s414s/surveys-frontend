import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Mail, Calendar } from "lucide-react";
import { Parcel } from "@/appTypes";

interface ParcelDetailsProps {
    parcel: Parcel;
}

export function ParcelDetails({ parcel }: ParcelDetailsProps) {
    // Format dates for better readability
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
        <Card className="w-full max-w-3xl mx-auto">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">Parcel #{parcel.id}</CardTitle>
                    <Badge variant="outline" className="px-3 py-1">
                        {parcel.weight} kg
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>Origin</span>
                            </div>
                            <p className="font-medium">{parcel.origin}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Departure (ETD)</span>
                            </div>
                            <p className="font-medium">{formatDate(parcel.etd)}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>Destination</span>
                            </div>
                            <p className="font-medium">{parcel.destination}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Arrival (ETA)</span>
                            </div>
                            <p className="font-medium">{formatDate(parcel.eta)}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Contact Email</span>
                        </div>
                        <p className="font-medium">{parcel.contactEmail}</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Package className="h-4 w-4 mr-2" />
                            <span>Tracking ID</span>
                        </div>
                        <p className="font-medium text-xs md:text-sm font-mono">{parcel.guid}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
