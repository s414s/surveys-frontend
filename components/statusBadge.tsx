import { FreightStatus } from "@/appTypes";
import { Badge } from "./ui/badge";

export default function StatusBadge({ status }: { status: FreightStatus; }) {
    switch (status) {
        case FreightStatus.Scheduled:
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                >
                    Scheduled
                </Badge>);
        case FreightStatus.Active:
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                >
                    Active
                </Badge>);

        case FreightStatus.Completed:
            return (
                <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
                >
                    Completed
                </Badge>);

        default:
            return <Badge variant="outline">Canceled</Badge>;
    }
}