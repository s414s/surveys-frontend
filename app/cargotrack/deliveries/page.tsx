import {
    File,
    PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { mockShifts, Shift, ShiftStatus } from "@/appTypes";
import DeliveriesTable from "@/components/deliveriesTable";

export default function Page() {
    const shifts: Shift[] = mockShifts;

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {/* <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"> */}
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Todas</TabsTrigger>
                        <TabsTrigger value="active">Activas</TabsTrigger>
                        <TabsTrigger value="draft">Borradores</TabsTrigger>
                        <TabsTrigger value="archived" className="hidden sm:flex">
                            Archivadas
                        </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Exportar
                            </span>
                        </Button>
                        <Button size="sm" className="h-8 gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Crear Envio
                            </span>
                        </Button>
                    </div>
                </div>

                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios</CardTitle>
                            <CardDescription>
                                Organiza tus encuestas y consulta sus resultados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shifts={shifts} />
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}encuestas
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="draft">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios Borrador</CardTitle>
                            <CardDescription>
                                Organiza tus encuestas borrador
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shifts={shifts.filter(x => x.status === ShiftStatus.Ongoing) ?? []} />
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}encuestas
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="archived">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios Activos</CardTitle>
                            <CardDescription>
                                Organiza tus encuestas archivadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shifts={shifts.filter(x => x.status === ShiftStatus.Ongoing) ?? []} />
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}encuestas
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="active">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Envios Completos</CardTitle>
                            <CardDescription>
                                Organiza tus encuestas archivadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable shifts={shifts.filter(x => x.status === ShiftStatus.Completed) ?? []} />
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}envios
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
            {/* </main> */}
            {/* </div> */}
        </div>
    );
}