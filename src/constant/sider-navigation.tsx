import {
  type LucideIcon,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

interface ISidebarItem {
  title: string;
  icon: LucideIcon;
  href: string;
}

export const sidebarItems: ISidebarItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/" },
  { title: "Products", icon: Package, href: "/products" },
  { title: "Orders", icon: ShoppingCart, href: "/orders" },
  { title: "Users", icon: Users, href: "/users" },
  { title: "Settings", icon: Settings, href: "/settings" },
];
