"use client";

import { PagedResult, Truck } from "@/appTypes";
import LoadingComponent from "@/components/common/loader";
import { useFetch } from "@/hooks/useFetch";

export default function Page() {
    const { data, error, loading } = useFetch<PagedResult<Truck>>("GET", "/trucks");

    if (error) { return (<div>{error.message}</div>); }

    return (
        <div className="flex w-full flex-col">
            <h2 className="text-3xl font-bold tracking-tight">Flota</h2>
            {loading && <LoadingComponent />}

            {
                data?.data && data.data?.map(x => (
                    <div key={x.id}>
                        {x.id}-{x.plate}-{x.mileage}
                    </div>))
            }
        </div>
    );
}