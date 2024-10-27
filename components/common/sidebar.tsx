"use client";

import { LineChart, Package, Truck, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// const driverRoutes = [
//     {
//         label: "Ruta Actual",
//         href: "/cargotrack/currentroute",
//         icon: LineChart,
//         description: "Ruta Actual",
//     },
//     {
//         label: "Historial",
//         icon: Package,
//         href: "/cargotrack/history",
//         description: "Historial",
//     },
//     {
//         label: "Documentos",
//         icon: LineChart,
//         href: "/cargotrack/documents",
//         description: "Documentos",
//     },
//     {
//         label: "Chat",
//         icon: Package,
//         href: "/cargotrack/chat",
//         description: "Chat",
//     },
// ];

const routes = [
    {
        label: "Dashboard",
        href: "/cargotrack/dashboard",
        icon: LineChart,
        description: "Dashboard",
    },
    {
        label: "Flota",
        icon: Truck,
        href: "/cargotrack/fleet",
        description: "fleet",
    },
    {
        label: "Envios",
        icon: Package,
        href: "/cargotrack/deliveries",
        description: "Envios",
    },
    {
        label: "Clientes",
        icon: Users,
        href: "/cargotrack/clientes",
        description: "Clientes",
    },
];

export default function SidebarItems() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {routes.map((route) => {
                return (
                    <Link
                        prefetch={true}
                        key={route.href}
                        href={route.href}
                        className={cn("flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                            pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground"
                        )}
                    >
                        <route.icon className="h-4 w-4" />
                        {route.label}
                        <span className="sr-only">{route.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
};;