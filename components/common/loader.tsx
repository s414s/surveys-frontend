import { useAppStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";

export default function LoadingComponent() {
    // TODO - meter un check for auth in the loader
    // TODO - meter el role que necesita para acceder

    const store = useAppStore();
    if (!store.isUserLoggedIn()) {
        // router.push("/login");
        console.log("user not logged");
    }

    return (
        <div className="flex justify-center align-middle w-full h-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
    );
}