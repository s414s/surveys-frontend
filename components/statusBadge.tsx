import { FreightStatus } from "@/appTypes";
import { Badge } from "./ui/badge";

export default function StatusBadge({ status }: { status: FreightStatus; }) {
    switch (status) {
        case FreightStatus.Scheduled:
            return <Badge variant="outline">Planificado</Badge>;

        case FreightStatus.Active:
            return <Badge variant="outline">En Curso</Badge>;

        case FreightStatus.Completed:
            return <Badge variant="outline">Completado</Badge>;

        default:
            return <Badge variant="outline">Archivado</Badge>;
    }
}