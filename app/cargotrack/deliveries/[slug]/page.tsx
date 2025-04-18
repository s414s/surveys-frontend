// import { PageProps } from "@/.next/types/app/layout";

import { ParcelDetails } from "@/components/parcel/parcel-details";

// export default function Page({ params }: PageProps) {
//     return (
//         <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//             Hello from {params.slug}
//         </div>
//     );
// }

// Sample parcel data
const sampleParcel = {
    id: 12345,
    weight: 5.2,
    origin: "New York, NY",
    destination: "San Francisco, CA",
    contactEmail: "shipper@example.com",
    eta: "2025-04-25T14:30:00",
    etd: "2025-04-18T09:00:00",
    guid: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
};

export default function Page() {
    return (
        <div className="container mx-auto py-10 px-4">
            {/* <h1 className="text-3xl font-bold mb-8">Parcel Tracking</h1> */}
            <ParcelDetails parcel={sampleParcel} />
        </div>
    );
}
