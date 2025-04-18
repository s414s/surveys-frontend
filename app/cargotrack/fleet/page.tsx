import TrucksTable from "@/components/tables/trucksTable";

export default function Page() {
    return (
        <div className="flex w-full flex-col">
            <h2 className="text-3xl font-bold tracking-tight">
                Fleet
            </h2>
            <TrucksTable />
        </div>
    );
}