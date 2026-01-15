import { SidebarNavigation } from "@/shared/components/sidebar-navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative">
      {/* Decorative accent blobs */}
      <div className="fixed top-0 left-0 w-125 h-125 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none z-1" />
      <div className="fixed bottom-0 right-0 w-125 h-125 bg-secondary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none z-1" />

      <SidebarNavigation />

      <main className="pl-72.5 pr-8 py-8 min-h-screen relative z-10 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
