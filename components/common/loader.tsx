'use client';

import { useAppStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoadingComponent({ isAdminOnly }: { isAdminOnly: boolean; }) {
    const store = useAppStore();
    const router = useRouter();

    if (isAdminOnly) {
        console.log("is admin only");

        if (!store.isUserLoggedIn() || !store.isAdmin()) {
            router.push("/login");
        }
    }

    return (
        <div className="flex justify-center align-middle w-full h-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
    );
}