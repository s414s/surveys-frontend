import { File, PlusCircle, } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveriesTable from "@/components/tables/deliveriesTable";
import { ShiftStatus } from "@/appTypes";

export default function Page() {
    return (
        // <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex w-full flex-col bg-muted/40">
            {/* <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"> */}
            <Tabs defaultValue="active">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="active">Activos</TabsTrigger>
                        <TabsTrigger value="planned">Planificados</TabsTrigger>
                        <TabsTrigger value="completed" className="hidden sm:flex">
                            Completados
                        </TabsTrigger>
                        <TabsTrigger value="all">Todos</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Exportar
                            </span>
                        </Button>
                        <Button size="sm" className="h-8 gap-1" asChild>
                            <Link href={"/cargotrack/deliveries/new"}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Crear Envio
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <TabsContent value="all">
                    {/* <ShiftCardContent shiftStatus={null} /> */}
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shiftStatus={null} />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="planned">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios Planificados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shiftStatus={ShiftStatus.Planned} />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="completed">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios Completados</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shiftStatus={ShiftStatus.Completed} />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="active">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios Activos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shiftStatus={ShiftStatus.Ongoing} />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}