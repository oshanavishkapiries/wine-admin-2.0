import {
    type LucideIcon,
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    DiamondPercent,
} from "lucide-react";

interface ISidebarItem {
    title: string;
    icon: LucideIcon;
    href: string;
}

export const sidebarItems: ISidebarItem[] = [
    {title: "Dashboard", icon: LayoutDashboard, href: "/dashboard"},
    {title: "Products", icon: Package, href: "/products"},
    {title: "Orders", icon: ShoppingCart, href: "/orders"},
    {title: "Discount", icon: DiamondPercent, href: "/discount"},
    {title: "Users", icon: Users, href: "/users"},
    {title: "Settings", icon: Settings, href: "/settings"},
];
