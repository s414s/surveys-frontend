"use client";

import { Freight, FreightStatus, PagedResult } from "@/appTypes";
import LoadingComponent from "@/components/common/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { useFetch } from "@/hooks/useFetch";
import { useAppStore } from "@/store/userStore";
import { TabsList } from "@radix-ui/react-tabs";
import { differenceInHours, format } from "date-fns";
import { CalendarClock, MapPin, Navigation, Timer } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
    return (
        <div className="flex w-full flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Routes</h2>
            </div>
            <Tabs defaultValue="upcoming">
                <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4">
                    <RouteCard status={FreightStatus.Scheduled} />
                </TabsContent>
                <TabsContent value="completed">
                    <RouteCard status={FreightStatus.Completed} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function RouteCard({ status }: { status: FreightStatus; }) {
    const router = useRouter();
    const store = useAppStore();
    const userId = store.getUserInfo()?.id ?? null;
    const url = `/freights?status=${status}&driverId=${userId}&pageIndex=1&pageSize=500`;

    const { data, error, loading } = useFetch<PagedResult<Freight>>("GET", url);
    if (error) return <div>{error.message}</div>;

    return (
        <Card>
            {loading && <LoadingComponent isAdminOnly={false} />}

            {!data?.data.length && !loading && (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <p className="text-muted-foreground">
                        No routes to show yet
                    </p>
                </div>
            )}

            {data?.data.map((route) => (
                <>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">ID - {route.id}</h3>
                            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                                {status == FreightStatus.Scheduled ? "Upcoming" : "Completed"}
                            </Badge>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Timer className="h-4 w-4" />
                            <span>{differenceInHours(new Date(route.eta), new Date(route.etd))} Hours</span>
                            <span className="mx-1">•</span>
                            <span>{route.totalDistance} Km</span>
                        </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-muted-foreground">Pickup</p>
                                    <p className="text-sm">{route.origin}</p>
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
                                    {/* <p className="text-sm">{new Date(route.eta).toISOString()}</p> */}
                                    <p className="text-sm">{format(new Date(route.eta), 'dd-MM-yyyy HH:mm')}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`routes/${route.id}`)}>
                            View Details
                        </Button>
                    </CardFooter>
                </>
            ))}
        </Card>
    );
}
