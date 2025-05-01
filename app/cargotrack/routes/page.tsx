"use client";

import { Freight, FreightStatus, PagedResult } from "@/appTypes";
import LoadingComponent from "@/components/common/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { useAppStore } from "@/store/userStore";
import { differenceInHours, format } from "date-fns";
import { CalendarClock, MapPin, Navigation, Timer } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
    const store = useAppStore();
    const userId = store.getUserInfo()?.id ?? null;
    const url = `/freights?status=${FreightStatus.Scheduled}&driverId=${userId}&pageIndex=1&pageSize=100`;
    const { data, error, loading } = useFetch<PagedResult<Freight>>("GET", url);
    if (error) return <div>{error.message}</div>;

    return (
        <div className="flex w-full flex-col space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Routes</h2>
                {/* <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Route className="mr-2 h-4 w-4" />
                        View All Routes
                    </Button>
                    <Button size="sm">
                        <Navigation className="mr-2 h-4 w-4" />
                        Start Navigation
                    </Button>
                </div> */}
            </div>

            {loading && <LoadingComponent isAdminOnly={false} />}

            {data?.data.map((route) => <RouteCard key={route.id} route={route} />)}


            {/* <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="all">All Routes</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming" className="space-y-4">
                    {routes.map((route) => (
                        <RouteCard key={route.id} route={route} />
                    ))}
                </TabsContent>
                <TabsContent value="completed">
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                        <p className="text-muted-foreground">No completed routes yet</p>
                    </div>
                </TabsContent>
                <TabsContent value="all">
                    {routes.map((route) => (
                        <RouteCard key={route.id} route={route} />
                    ))}
                </TabsContent>
            </Tabs> */}

        </div>
    );
}

function RouteCard({ route }: { route: Freight; }) {
    const router = useRouter();

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">ID - {route.id}</h3>
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                        upcoming
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
                {/* <Button size="sm">Start Route</Button> */}
            </CardFooter>
        </Card>
    );
}
