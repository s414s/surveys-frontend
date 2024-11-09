"use client";

import { PagedResult, Shift, ShiftStatus } from "@/appTypes";
import DeliveriesTable from "./deliveriesTable";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import LoadingComponent from "./common/loader";
import { useFetch } from "@/hooks/useFetch";

export default function ShiftCardContent({ shiftStatus }: { shiftStatus: ShiftStatus | null; }) {
    const { data, error, loading } = useFetch<PagedResult<Shift>>("GET", `/shifts?shiftStatus=${shiftStatus}`);

    if (error) { return (<div>{error.message}</div>); }
    if (loading) return <LoadingComponent />;

    return (
        <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
                <CardTitle>Envios Planificados</CardTitle>
            </CardHeader>
            <CardContent>
                <DeliveriesTable shifts={data?.data ?? []} />
            </CardContent>
            <CardFooter>
                {/* <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}envios
                </div> */}

                {
                    data &&
                    <div className="text-xs text-muted-foreground">
                        Mostrando <strong>
                            {((data.pageIndex - 1) * data.pageSize + 1)}-
                            {Math.min(data.pageIndex * data.pageSize, data.totalResults)}
                        </strong> de <strong>{data.totalResults ?? 0}</strong>{" "}envios
                    </div>
                }
            </CardFooter>
        </Card>
    );
}