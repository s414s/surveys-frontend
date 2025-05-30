"use client";

import { PageProps } from "@/.next/types/app/layout";
import { Freight } from "@/appTypes";
import LoadingComponent from "@/components/common/loader";
import { FreightDetails } from "@/components/freights/freight-details";
import { useFetch } from "@/hooks/useFetch";

export default function Page({ params }: PageProps) {
    const { data, error, loading } = useFetch<Freight>("GET", `/freights/${params.slug}`);
    if (error) { console.log("error", error); }

    return (
        <div className="container mx-auto py-10 px-4">
            {loading
                ? <LoadingComponent isAdminOnly={false} />
                : <FreightDetails freight={data as Freight} />}
        </div>
    );
}