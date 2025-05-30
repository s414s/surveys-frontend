import TrucksTable from "@/components/tables/trucksTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="flex w-full flex-col">
            <h2 className="text-3xl font-bold tracking-tight">
                Fleet
            </h2>
            <div className="ml-auto flex gap-2">
                <Button size="sm" className="h-8 gap-1" asChild>
                    <Link href={"/cargotrack/fleet/new"}>
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            New Truck
                        </span>
                    </Link>
                </Button>
            </div>
            <TrucksTable />
        </div>
    );
}