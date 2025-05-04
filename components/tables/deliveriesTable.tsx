"use client";

import { PagedResult, FreightStatus, type Freight } from "@/appTypes";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import StatusBadge from "../statusBadge";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";
import { formatDate } from "date-fns";
import { capitalizeWord } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";

export default function DeliveriesTable({ freightStatus }: { freightStatus: FreightStatus | null; }) {
    const pageSize = 10;
    const [pageIndex, setPageIndex] = useState(1);
    // const [pageIndex, setPageIndex] = useState<number>(props.searchParams?.pageIndex ?? 1);

    const url = `/freights?status=${freightStatus}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
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

            <TableFooter className="w-full flex justify-between items-center">
                <div>
                    {
                        data &&
                        <div className="text-xs text-muted-foreground">
                            Showing <strong>
                                {((data.pageIndex - 1) * data.pageSize + 1)}-
                                {Math.min(data.pageIndex * data.pageSize, data.totalResults)}
                            </strong> of <strong>{data.totalResults ?? 0}</strong>{" "}trucks
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
        </Table>
    );
}