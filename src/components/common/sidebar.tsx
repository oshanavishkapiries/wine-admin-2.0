import {useLocation, Link, useNavigate} from "react-router-dom";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {Button} from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import {cn} from "@/lib/utils";
import {sidebarItems} from "@/constant/sider-navigation";
import {LogOut} from "lucide-react";
import {useDispatch} from "react-redux";
import {clearUser} from "@/features/reducer/authSlice.ts";
import {useState} from "react";

export function ResponsiveSidebar() {
    const location = useLocation();
    const pathname = location.pathname;
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearUser());
        setIsDialogOpen(false);
        navigate("/");
    };

    return (
        <>
            <Sidebar>
                <SidebarHeader className="border-b px-2 py-4">
                    <h2 className="text-lg font-semibold tracking-tight">Wine</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {sidebarItems.map((item) => (
                            <SidebarMenuItem className="px-2 py-1" key={item.href}>
                                <SidebarMenuButton
                                    className={
                                        pathname.includes(item.href)
                                            ? "bg-primary hover:bg-primary/50 text-white"
                                            : "hover:bg-primary/75 hover:text-white"
                                    }
                                    asChild
                                >
                                    <Link
                                        to={item.href}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5"/>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setIsDialogOpen(true)}
                    >
                        <div className="flex items-center gap-3">
                            <LogOut className="h-5 w-5"/>
                            <span>Logout</span>
                        </div>
                    </Button>
                </SidebarFooter>
            </Sidebar>

            {/* Logout Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Logout</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to log out? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            Logout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
