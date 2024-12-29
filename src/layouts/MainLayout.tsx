import {ResponsiveSidebar} from "@/components/common/sidebar";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {sidebarItems} from "@/constants/sider-navigation";
import {useLocation} from "react-router-dom";

const MainLayout = ({children}: { children?: React.ReactNode }) => {
    const location = useLocation();
    const pathname = location.pathname;


    return (
        <SidebarProvider>
            <div className="flex flex-row h-screen w-full">
                <ResponsiveSidebar/>
                <div className="w-full">
                    <div
                        className="p-4 sticky top-0 flex flex-row items-center gap-2 bg-background border-b border-gray-200 z-10 print:hidden">
                        <SidebarTrigger/>
                        <h1 className="text-xl font-bold">
                            {sidebarItems.find((item) => pathname.includes(item.href))?.title}
                        </h1>
                    </div>
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
};

export default MainLayout;
