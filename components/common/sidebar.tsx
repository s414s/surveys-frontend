"use client";

import { LineChart, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
// import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const driveRoutes = [
    {
        label: "Ruta Actual",
        href: "/cargotrack/currentroute",
        icon: LineChart,
        description: "Ruta Actual",
    },
    {
        label: "Encuestas",
        icon: ShoppingCart,
        href: "/cargotrack/list",
        description: "Encuestas",
    },
    {
        label: "Historial",
        icon: Package,
        href: "/cargotrack/history",
        description: "Historial",
    },
    {
        label: "Clientes",
        icon: Users,
        href: "/cargotrack/clientes",
        description: "Clientes",
    },
    {
        label: "Documentos",
        icon: LineChart,
        href: "/cargotrack/docs",
        description: "Documentos",
    },
];

const routes = [
    {
        label: "Dashboard",
        href: "/cargotrack/dashboard",
        icon: LineChart,
        description: "Dashboard",
    },
    {
        label: "Gestión de flota",
        icon: ShoppingCart,
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
    {
        label: "Analytics",
        icon: LineChart,
        href: "/cargotrack/analytics",
        description: "Analytics",
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

                        {/* <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            6
                        </Badge> */}
                    </Link>
                );
            })}
        </nav>
    );
};;