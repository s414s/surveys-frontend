import { mockTrucks, Truck } from "@/appTypes";

export default function Page() {
    const trucks: Truck[] = mockTrucks;

    return (
        <div className="flex w-full flex-col">
            <h2>Hola desde fleet</h2>
            {trucks.map(x => <div key={x.plate}>{x.plate}</div>)}
        </div>
    );
}