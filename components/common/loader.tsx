import { Loader2 } from "lucide-react";

export default function LoadingComponent() {
    return (
        <div className="flex justify-center align-middle w-full h-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
    );
}