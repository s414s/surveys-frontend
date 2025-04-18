import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Parcel } from "@/appTypes";

interface ParcelListProps {
    parcels: Parcel[];
}

export function ParcelList({ parcels }: ParcelListProps) {
    // Format dates for better readability
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead className="hidden md:table-cell">Origin</TableHead>
                        <TableHead className="hidden md:table-cell">Destination</TableHead>
                        <TableHead>ETD</TableHead>
                        <TableHead>ETA</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parcels.map((parcel) => (
                        <TableRow key={parcel.id}>
                            <TableCell className="font-medium">{parcel.id}</TableCell>
                            <TableCell>
                                <Badge variant="outline">{parcel.weight} kg</Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{parcel.origin}</TableCell>
                            <TableCell className="hidden md:table-cell">{parcel.destination}</TableCell>
                            <TableCell>{formatDate(parcel.etd)}</TableCell>
                            <TableCell>{formatDate(parcel.eta)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
