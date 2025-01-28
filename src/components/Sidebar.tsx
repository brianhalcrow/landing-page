import { 
  LayoutDashboard, 
  Database, 
  Settings,
  MonitorPlay,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Database, label: "Data Sources", href: "/data-sources" },
    { icon: Settings, label: "Configuration", href: "/configuration" },
    { icon: MonitorPlay, label: "Monitor", href: "/monitor" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: FileText, label: "Reports", href: "/reports" },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar-DEFAULT text-sidebar-foreground h-screen transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <h1 className={cn("font-bold text-xl", !isOpen && "hidden")}>
          Dashboard
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
      <nav className="mt-8">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5" />
            {isOpen && <span className="ml-4">{item.label}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;