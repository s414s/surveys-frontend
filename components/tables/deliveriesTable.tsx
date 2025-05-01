"use client";

import { PagedResult, FreightStatus, type Freight } from "@/appTypes";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "../statusBadge";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";
import { formatDate } from "date-fns";
import { capitalizeWord } from "@/utils/utils";
import Link from "next/link";

export default function DeliveriesTable({ freightStatus, page }: { freightStatus: FreightStatus | null; page: number; }) {
    const pageSize = 10;
    const url = `/freights?status=${freightStatus}&pageIndex=${page}&pageSize=${pageSize}`;

    const { data, error, loading } = useFetch<PagedResult<Freight>>("GET", url);
    if (error) return <div>{error.message}</div>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Driver
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Distance
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Origin
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Destination
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Departure
                    </TableHead>
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading && <LoadingComponent isAdminOnly={false} />}

                {data?.data.map(x => {
                    return (
                        <TableRow key={x.id}>
                            <TableCell>{x.id}</TableCell>
                            <TableCell>
                                <StatusBadge status={x.status} />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {`${capitalizeWord(x.driver.name)} ${capitalizeWord(x.driver.surname)}`}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.totalDistance} Km
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.origin}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {x.destination}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {formatDate(x.etd, "dd-MM-yyyy")}
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
                                            Actions
                                        </DropdownMenuLabel>
                                        {/* <DropdownMenuItem disabled={x.status !== FreightStatus.Scheduled}> */}
                                        <DropdownMenuItem>
                                            Edit
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem disabled={x.status !== FreightStatus.Scheduled}> */}
                                        <DropdownMenuItem>
                                            Cancel
                                        </DropdownMenuItem>
                                        {/* <DropdownMenuItem disabled={x.status !== FreightStatus.Scheduled}> */}
                                        <DropdownMenuItem>
                                            {/* <Link href="/cargotrack" target="_blank" rel="noreferrer"> */}
                                            <Link href={`/cargotrack/deliveries/${x.id}`}>
                                                Details
                                            </Link>
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
                {data &&
                    <div className="text-xs text-muted-foreground">
                        Mostrando <strong>
                            {((data.pageIndex - 1) * data.pageSize + 1)}-
                            {Math.min(data.pageIndex * data.pageSize, data.totalResults)}
                        </strong> de <strong>{data.totalResults ?? 0}</strong>{" "}envios
                    </div>}
            </TableFooter>
        </Table>
    );
}