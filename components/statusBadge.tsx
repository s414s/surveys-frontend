import { ShiftStatus } from "@/appTypes";
import { Badge } from "./ui/badge";

export default function StatusBadge({ status }: { status: ShiftStatus; }) {
    switch (status) {
        case ShiftStatus.Planned:
            return <Badge variant="outline">Planificado</Badge>;

        case ShiftStatus.Ongoing:
            return <Badge variant="outline">En Curso</Badge>;

        case ShiftStatus.Completed:
            return <Badge variant="outline">Completado</Badge>;

        default:
            return <Badge variant="outline">Archivado</Badge>;
    }
}