import { 
  LayoutDashboard, 
  Database, 
  Settings,
  LineChart,
  BarChart3,
  FileText,
  Shield,
  DollarSign,
  FileCheck,
  FileSpreadsheet,
  Wallet
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Sidebar = () => {
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
    <div className="h-full bg-sidebar-DEFAULT text-sidebar-foreground pt-16">
      <nav className="mt-8 flex-1 flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <div key={item.label} className={cn("mb-2", item.type === "section" && "mt-4")}>
              {item.type === "section" ? (
                <>
                  <span className="px-4 text-xs font-medium text-gray-900">
                    {item.label}
                  </span>
                  <div className="mt-2">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.label}
                        to={subItem.href}
                        className={cn(
                          "flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors rounded-md",
                          location.pathname === subItem.href && "bg-white text-primary"
                        )}
                      >
                        <subItem.icon className="h-5 w-5" />
                        <span className="ml-4">{subItem.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors rounded-md",
                    location.pathname === item.href && "bg-white text-primary"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-4">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
        <Link
          to="/settings"
          className={cn(
            "flex items-center px-4 py-2 text-gray-700 hover:text-primary transition-colors rounded-md mb-4",
            location.pathname === "/settings" && "bg-white text-primary"
          )}
        >
          <Settings className="h-5 w-5" />
          <span className="ml-4">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;