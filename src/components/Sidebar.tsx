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
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
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
    }
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
          className="p-2 rounded-lg hover:text-primary transition-colors"
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </button>
      </div>
      <nav className="mt-8 flex-1 flex flex-col">
        <div className="flex-1">
          {navItems.map((item, index) => (
            <div key={item.label} className={cn("mb-2", item.type === "section" && "mt-4")}>
              {item.type === "section" ? (
                <>
                  {isOpen && (
                    <span className="px-4 text-xs font-medium text-gray-900">
                      {item.label}
                    </span>
                  )}
                  <div className="mt-2">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors rounded-md",
                          location.pathname === subItem.href && "bg-gray-100"
                        )}
                      >
                        <subItem.icon className="h-5 w-5" />
                        {isOpen && <span className="ml-4">{subItem.label}</span>}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors rounded-md",
                    location.pathname === item.href && "bg-gray-100"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {isOpen && <span className="ml-4">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </div>
        <Link
          to="/settings"
          className={cn(
            "flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors rounded-md mb-4",
            location.pathname === "/settings" && "bg-gray-100"
          )}
        >
          <Settings className="h-5 w-5" />
          {isOpen && <span className="ml-4">Settings</span>}
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;