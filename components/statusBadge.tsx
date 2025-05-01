import { FreightStatus } from "@/appTypes";
import { Badge } from "./ui/badge";

export default function StatusBadge({ status }: { status: FreightStatus; }) {
    switch (status) {
        case FreightStatus.Scheduled:
            return <Badge variant="outline">Scheduled</Badge>;

        case FreightStatus.Active:
            return <Badge variant="outline">Active</Badge>;

        case FreightStatus.Completed:
            return <Badge variant="outline">Completed</Badge>;

        default:
            return <Badge variant="outline">Canceled</Badge>;
    }
}