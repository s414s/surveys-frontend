"use client";

import { PagedResult, FreightStatus, type Freight } from "@/appTypes";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "../statusBadge";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";

export default function DeliveriesTable({ shiftStatus }: { shiftStatus: FreightStatus | null; }) {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const { data, error, loading } = useFetch<PagedResult<Freight>>("GET", `/shifts?shiftStatus=${shiftStatus}`);

    if (error) { return (<div>{error.message}</div>); }
    if (loading) return <LoadingComponent isAdminOnly={false} />;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Conductor
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Distancia
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Duración
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Fecha Creación
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.data.map(x => {
                    return (
                        <TableRow key={x.id}>
                            <TableCell className="font-medium">
                                {x.id}
                            </TableCell>
                            <TableCell>
                                <StatusBadge status={x.status} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.pilot.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.totalDistance} Km
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.expectedDuration} Hr
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {dateFormatter.format(x.expectedFinishTime)}
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
                                        <DropdownMenuItem
                                            disabled={x.status !== FreightStatus.Planned}
                                        >
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            disabled={x.status !== FreightStatus.Planned}
                                        >
                                            Cancelar
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
            <TableFooter>
                {/* <div className="text-xs text-muted-foreground">
                    Mostrando <strong>1-10</strong> de <strong>32</strong>{" "}envios
                </div> */}

                {
                    data &&
                    <div className="text-xs text-muted-foreground">
                        Mostrando <strong>
                            {((data.pageIndex - 1) * data.pageSize + 1)}-
                            {Math.min(data.pageIndex * data.pageSize, data.totalResults)}
                        </strong> de <strong>{data.totalResults ?? 0}</strong>{" "}envios
                    </div>
                }
            </TableFooter>
        </Table>
    );
}