import { mockTrucks, Truck } from "@/appTypes";

export default function Page() {
    const trucks: Truck[] = mockTrucks;

    return (
        <div className="flex w-full flex-col bg-muted/40">
            Hola desde fleet
            {trucks.map(x => <div key={x.plate}>{x.plate}</div>)}
        </div>
    );
}