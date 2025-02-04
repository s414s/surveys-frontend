import Link from "next/link";
import { Package2, } from "lucide-react";
import Header from "@/components/common/header";
import SidebarItems from "@/components/common/sidebar";
import { Toaster } from "@/components/ui/toaster";

// https://nextjs.org/docs/app/api-reference/functions/use-selected-layout-segment
export default function ViewerLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">

            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">Cargo Track</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <SidebarItems />
                    </div>
                </div>
            </div>

            <div className="flex flex-col">
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
                <Toaster />
            </div>
        </div>
    );
}