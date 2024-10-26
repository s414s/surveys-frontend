import { ShiftStatus, type Shift } from "@/appTypes";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./statusBadge";

export default function DeliveriesTable({ shifts }: { shifts: Shift[]; }) {
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Conductor
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                        Acompañante
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
                {shifts.map(x => {
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
                                {x.copilot.name}
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
                                            disabled={x.status === ShiftStatus.Planned}
                                        >
                                            Editar
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            disabled={x.status === ShiftStatus.Planned}
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
        </Table>
    );
}