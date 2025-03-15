"use client";

import { LineChart, Package, Truck, Users, MessageSquare, WaypointsIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const adminRoutes = [
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
        href: "/cargotrack/clients",
        description: "Clientes",
    },
];

const driverRoutes = [
    {
        label: "Routes",
        href: "/cargotrack/routes",
        icon: WaypointsIcon,
        description: "Routes",
    },
    {
        label: "Messages",
        icon: MessageSquare,
        href: "/cargotrack/messages",
        description: "Messages",
    },
];

export default function SidebarItems() {
    const pathname = usePathname();
    const menuItems = true ? adminRoutes : driverRoutes;

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {menuItems.map((route) => {
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