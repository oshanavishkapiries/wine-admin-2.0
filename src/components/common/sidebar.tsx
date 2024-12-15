import { useLocation, Link } from "react-router-dom"; 

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/constant/sider-navigation";
import { LogOut } from "lucide-react";

export function ResponsiveSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  
  

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-2 py-4">
        <h2 className="text-lg font-semibold tracking-tight">Wine</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {sidebarItems.map((item) => (
            <SidebarMenuItem className="px-2 py-1" key={item.href}>
              <SidebarMenuButton className={pathname === item.href ? "bg-primary hover:bg-primary/50 text-white" : "hover:bg-primary/75 hover:text-white"} asChild >
                <Link
                  to={item.href} 
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                    
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/logout" className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
