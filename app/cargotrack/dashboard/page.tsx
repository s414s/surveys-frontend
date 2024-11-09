'use client';

import LoadingComponent from "@/components/common/loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetch } from "@/hooks/useFetch";
import { AlertCircle, Truck, User, MapPin } from 'lucide-react';

interface ResponseDTO {
    name: string;
    surname: string;
    age: number;
}

export default function Page() {
    const { data, error, loading } = useFetch<ResponseDTO>("GET", "/dashboard");

    if (loading) { return <LoadingComponent />; }

    if (error) {
        // return (<div>{error.message}...</div>);
        console.log("error");
    }

    if (data) {
        // return (<div>Data...</div>);
        console.log("data");
    }

    return (
        <div className="flex flex-1 flex-col gap-4 px-4 ">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3"> */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Trucks
                        </CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">25</div>
                        <p className="text-xs text-muted-foreground">
                            +2 from last month
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Drivers
                        </CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">18</div>
                        <p className="text-xs text-muted-foreground">
                            +3 from last week
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Trips Today</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">
                            +2 scheduled for tomorrow
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Maintenance Due
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3</div>
                        <p className="text-xs text-muted-foreground">
                            Schedule service soon
                        </p>
                    </CardContent>
                </Card>
                {/* <div className="aspect-video rounded-xl bg-muted/50"> </div> */}
            </div>

            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min aspect-video">
            </div>
        </div>
    );
}