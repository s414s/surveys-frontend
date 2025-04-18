"use client";

import { PageProps } from "@/.next/types/app/layout";
import { type PagedResult, type Truck } from "@/appTypes";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import LoadingComponent from "../common/loader";
import { capitalizeWord, dateFormatter, numberFormatter } from "@/utils/utils";
import { useState } from "react";

export default function TrucksTable(props: PageProps) {
    const [pageIndex, setPageIndex] = useState<number>(props.searchParams?.pageIndex ?? 1);
    const { data, error, loading } = useFetch<PagedResult<Truck>>("GET", `/trucks?pageIndex=${pageIndex}&pageSize=10`);

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
                        Marca
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
                {loading && <LoadingComponent isAdminOnly={false} />}
                {error && <div className="w-full text-center">{error.message}</div>}

                {data?.data.map(x => {
                    return (
                        <TableRow key={x.id}>
                            <TableCell>
                                {x.plate}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {numberFormatter(0, 0).format(x.mileage)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {numberFormatter(2, 2).format(x.consumption)}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                {capitalizeWord("TODO - marca")}
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
                                            Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuItem>
                                            Edit
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
        </Table >
    );
}