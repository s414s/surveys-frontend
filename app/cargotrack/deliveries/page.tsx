'use client';

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import DeliveriesTable from "@/components/tables/deliveriesTable";
import { FreightStatus } from "@/appTypes";
import { useState } from "react";

export default function Page() {
    const [page,] = useState(1);

    return (
        // <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex w-full flex-col bg-muted/40">
            {/* <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"> */}
            <Tabs defaultValue="active">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="active">Active</TabsTrigger>
                        <TabsTrigger value="planned">Planned</TabsTrigger>
                        <TabsTrigger value="completed" className="hidden sm:flex">Completed</TabsTrigger>
                        <TabsTrigger value="all">All</TabsTrigger>
                    </TabsList>

                    <div className="ml-auto flex items-center gap-2">
                        {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button> */}
                        <Button size="sm" className="h-8 gap-1" asChild>
                            <Link href={"/cargotrack/deliveries/new"}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                    New Freight
                                </span>
                            </Link>
                        </Button>
                    </div>

                </div>

                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={null} page={page} />
                        </CardContent>
                        <CardFooter></CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="planned">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Planned Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={FreightStatus.Scheduled} page={page} />
                        </CardContent>
                        {/* <CardFooter></CardFooter> */}
                    </Card>
                </TabsContent>
                <TabsContent value="completed">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Completed Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={FreightStatus.Completed} page={page} />
                        </CardContent>
                        {/* <CardFooter></CardFooter> */}
                    </Card>
                </TabsContent>
                <TabsContent value="active">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Active Deliveries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DeliveriesTable freightStatus={FreightStatus.Active} page={page} />
                        </CardContent>
                        {/* <CardFooter></CardFooter> */}
                    </Card>
                </TabsContent>
            </Tabs>
            {/* <DeliveriesTable freightStatus={null} page={page} /> */}
        </div>
    );
}