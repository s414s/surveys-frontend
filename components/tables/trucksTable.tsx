"use client";

import { PageProps } from "@/.next/types/app/layout";
import { PagedResult, type Truck } from "@/appTypes";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";
import { capitalizeWord } from "@/utils/utils";
import { useState } from "react";

export default function TrucksTable(props: PageProps) {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const [pageIndex, setPageIndex] = useState<number>(props.searchParams?.get("pageIndex") ?? 1);
    const { data, error, loading } = useFetch<PagedResult<Truck>>("GET", `/trucks?pageIndex=${pageIndex}`);

    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Mileage <br /> (Km)
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Consumo <br /> (l/100Km)
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Conductor
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Última revisión
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading && <LoadingComponent />}
                {error && <div className="w-full text-center">{error.message}</div>}

                {data?.data.map(x => {
                    return (
                        <TableRow key={x.id}>
                            <TableCell>
                                {x.plate}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.mileage}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.consumption}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {capitalizeWord(x.driverName)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {dateFormatter.format(x.lastMaintenenceDateUnix)}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            aria-haspopup="true"
                                            size="icon"
                                            variant="ghost"
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                            <span className="sr-only">Toggle menu</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Acciones
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            Editar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter className="w-full flex justify-between items-center">
                <div>
                    {
                        data &&
                        <div className="text-xs text-muted-foreground">
                            Mostrando <strong>
                                {((data.pageIndex - 1) * data.pageSize + 1)}-
                                {Math.min(data.pageIndex * data.pageSize, data.totalResults)}
                            </strong> de <strong>{data.totalResults ?? 0}</strong>{" "}vehículos
                        </div>
                    }
                </div>
                <div className="flex gap-2">
                    <Button
                        disabled={!data?.hasPreviousPage}
                        onClick={() => setPageIndex(pageIndex - 1)}
                    >
                        <ArrowLeft />
                    </Button>
                    <Button
                        disabled={!data?.hasNextPage}
                        onClick={() => setPageIndex(pageIndex + 1)}
                    >
                        <ArrowRight />
                    </Button>
                </div>
            </TableFooter>
        </Table >
    );
}