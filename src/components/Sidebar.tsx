import { 
  LayoutDashboard, 
  Database, 
  Settings,
  LineChart,
  BarChart3,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  DollarSign,
  FileCheck,
  FileSpreadsheet,
  Wallet
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
    { 
      label: "Pre-Trade",
      type: "section",
      items: [
        { icon: LineChart, label: "Monitor", href: "/monitor" },
        { icon: BarChart3, label: "Exposure", href: "/exposure" },
        { icon: FileText, label: "Forecast", href: "/forecast" },
        { icon: Shield, label: "Hedge Request", href: "/hedge-request" },
      ]
    },
    {
      label: "Trade",
      type: "section",
      items: [
        { icon: FileText, label: "Review", href: "/review" },
        { icon: Shield, label: "Control", href: "/control" },
        { icon: FileCheck, label: "Execution", href: "/execution" },
      ]
    },
    {
      label: "Post-Trade",
      type: "section",
      items: [
        { icon: FileSpreadsheet, label: "Confirmation", href: "/confirmation" },
        { icon: DollarSign, label: "Settlement", href: "/settlement" },
        { icon: Wallet, label: "Hedge Accounting", href: "/hedge-accounting" },
      ]
    },
    { icon: Settings, label: "Settings", href: "/settings", isBottom: true },
  ];

  return (
    <div
      className={cn(
        "bg-sidebar-DEFAULT text-sidebar-foreground h-screen transition-all duration-300 flex flex-col",
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
      <nav className="mt-8 flex-1">
        {navItems.map((item, index) => (
          <div key={item.label} className={cn("mb-2", item.type === "section" && "mt-4")}>
            {item.type === "section" ? (
              <>
                {isOpen && (
                  <span className="px-4 text-xs text-gray-500 font-medium">
                    {item.label}
                  </span>
                )}
                <div className="mt-2">
                  {item.items?.map((subItem) => (
                    <a
                      key={subItem.label}
                      href={subItem.href}
                      className="flex items-center px-4 py-2 text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors"
                    >
                      <subItem.icon className="h-5 w-5" />
                      {isOpen && <span className="ml-4">{subItem.label}</span>}
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <a
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-gray-300 hover:bg-sidebar-hover hover:text-white transition-colors",
                  item.isBottom && "mt-auto"
                )}
              >
                <item.icon className="h-5 w-5" />
                {isOpen && <span className="ml-4">{item.label}</span>}
              </a>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;