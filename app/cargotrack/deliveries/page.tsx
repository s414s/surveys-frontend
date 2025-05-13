'use client';

import { Package, PlusCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveriesTable from "@/components/tables/deliveriesTable";
import { FreightStatus } from "@/appTypes";

export default function Page() {
    return (
        <div className="flex w-full flex-col bg-muted/40">
            <Tabs defaultValue="active">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="planned">Planned</TabsTrigger>
                        <TabsTrigger value="completed" className="hidden sm:flex">Completed</TabsTrigger>
                    </TabsList>

                    <div className="ml-auto flex items-center gap-2">
                        {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button> */}
                        <Button size="sm" className="h-8 gap-1" asChild>
                            <Link href={"/cargotrack/deliveries/search"}>
                                <Package className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Search Parcel
                                </span>
                            </Link>
                        </Button>
                        <Button size="sm" className="h-8 gap-1" asChild>
                            <Link href={"/cargotrack/deliveries/new"}>
                                <Truck className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    New Freight
                                </span>
                            </Link>
                        </Button>
                        <Button size="sm" className="h-8 gap-1" asChild>
                            <Link href={"/cargotrack/deliveries/addParcel"}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    Add Parcel
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>

                <TabsContent value="planned">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Planned Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={FreightStatus.Scheduled} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="completed">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Completed Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={FreightStatus.Completed} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="active">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Active Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={FreightStatus.Active} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}