"use client";

import { PageProps } from "@/.next/types/app/layout";
import { Freight } from "@/appTypes";
import LoadingComponent from "@/components/common/loader";
import { FreightDetails } from "@/components/freights/freight-details";
import { useFetch } from "@/hooks/useFetch";

// export default function Page({ params }: PageProps) {
//     return (
//         <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//             Hello from {params.slug}
//         </div>
//     );
// }

export default function Page({ params }: PageProps) {
    const { data, error, loading } = useFetch<Freight>("GET", `/freights/${params.slug}`);
    if (error) { console.log("error", error); }

    return (
        <div className="container mx-auto py-10 px-4">
            {/* <h1 className="text-3xl font-bold mb-8">Parcel Tracking</h1> */}
            {loading
                ? <LoadingComponent isAdminOnly={false} />
                : <FreightDetails freight={data as Freight} />}
        </div>
    );
}