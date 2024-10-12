"use client";

import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const routes = [
    {
        label: "Dashboard",
        href: "/surveys/dashboard",
        icon: Home,
        description: "Dashboard",
    },
    {
        label: "Encuestas",
        icon: ShoppingCart,
        href: "/surveys/encuestas",
        description: "Encuestas",
    },
    {
        label: "Productos",
        icon: Package,
        href: "/surveys/products",
        description: "Productos",
    },
    {
        label: "Clientes",
        icon: Users,
        href: "/viewer/clientes",
        description: "Clientes",
    },
    {
        label: "Analytics",
        icon: LineChart,
        href: "/viewer/analytics",
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

                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                            6
                        </Badge>
                    </Link>
                );
            })}
        </nav>
    );
};;