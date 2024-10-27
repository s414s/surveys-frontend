"use client";

import { Truck } from "@/appTypes";
import { useFetch } from "@/hooks/useFetch";

export default function Page() {
    const { data, error, loading } = useFetch<Truck[]>("GET", "/trucks");

    if (loading) {
        return (<div>Cargando...</div>);
    }

    if (error) {
        return (<div>{error.message}...</div>);
    }

    return (
        <div className="flex w-full flex-col">
            <h2>Hola desde fleet</h2>
            {
                data?.map(x => (
                    <div key={x.id}>{x.plate}</div>))
            }
        </div>
    );
}