import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AppointmentsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider defaultOpen={true}>
            <AppSidebar />
            <main className="flex flex-col flex-1 h-screen w-full overflow-hidden bg-background transition-all duration-300 ease-in-out">
                <div className="p-4 md:hidden">
                    <SidebarTrigger />
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}
