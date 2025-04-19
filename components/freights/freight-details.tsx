import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package, MapPin, Calendar, File, User } from "lucide-react";
import { Freight, Parcel } from "@/appTypes";
import { capitalizeWord } from "@/utils/utils";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";
import { Button } from "../ui/button";
import { useRef } from "react";

interface FreightDetailsProps {
    freight: Freight;
}

export function FreightDetails({ freight }: FreightDetailsProps) {
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

    const parcelCardRef = useRef<HTMLDivElement>(null);

    const { data, error, loading } = useFetch<Parcel[]>("GET", `/freights/${freight.id}/parcels`);
    if (error) { console.log("error", error); }
    console.log("PARCELS", data);

    const generatePDF = async () => {
        if (!parcelCardRef.current) return;

        try {
            // Dynamically import the libraries to reduce initial bundle size
            const [jsPDF, html2canvas] = await Promise.all([import("jspdf"), import("html2canvas")]);

            const { default: JsPDF } = jsPDF;
            const { default: html2Canvas } = html2canvas;

            const doc = new JsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const canvas = await html2Canvas(parcelCardRef.current, {
                scale: 2, // Higher scale for better quality
                logging: false,
                useCORS: true,
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Add the image to the PDF
            const imgData = canvas.toDataURL("image/png");
            doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

            // Download the PDF
            doc.save(`Freight-${freight.id}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    return (
        <Card className="w-full max-w-3xl mx-auto print:text-black print:bg-white" ref={parcelCardRef} >
            <CardHeader className="pb-2 print:text-black print:bg-white">
                <div className="flex justify-between items-center print:text-black print:bg-white">
                    <CardTitle className="text-2xl">Freight #{freight.id}</CardTitle>
                    {/* <Badge variant="outline" className="px-3 py-1"> {2} kg </Badge> */}
                    <div className="print:hidden">
                        <Button size="sm" variant="outline" className="h-8 gap-1" onClick={generatePDF}>
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                    </div>
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
                            <p className="font-medium">{freight.origin}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Departure (ETD)</span>
                            </div>
                            <p className="font-medium">{formatDate(freight.etd)}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span>Destination</span>
                            </div>
                            <p className="font-medium">{freight.destination}</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Arrival (ETA)</span>
                            </div>
                            <p className="font-medium">{formatDate(freight.eta)}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground print:text-black print:bg-white">
                            <User className="h-4 w-4 mr-2" />
                            <span>Driver</span>
                        </div>
                        <p className="font-medium">
                            {`${capitalizeWord(freight.driver.name)} ${capitalizeWord(freight.driver.surname)} - ${freight.driver.email}`}
                        </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Package className="h-4 w-4 mr-2" />
                            <span>Parcels</span>
                        </div>
                        <p className="font-medium text-xs md:text-sm font-mono">
                            {loading
                                ? <LoadingComponent isAdminOnly={false} />
                                : data
                                    ? data?.map(x => (<div key={x.id}>{x.guid} - {x.weight}Kg - {x.price}€</div>))
                                    : <div>No Parcels</div>}
                        </p>
                    </div>

                </div>
            </CardContent>
        </Card>
    );
}
