
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
  Wallet,
  Coins
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Database, label: "Data Sources", href: "/data-sources" },
    { icon: Settings, label: "Configuration", href: "/configuration" },
    { 
      label: "Pre-Trade",
      type: "section",
      items: [
        { icon: LineChart, label: "Monitor", href: "/monitor" },
        { icon: Coins, label: "Cash Management", href: "/cash-management" },
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
    <div className="h-full bg-sidebar-DEFAULT text-gray-400 pt-16">
      <nav className="mt-8 flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto">
          {navItems.map((item, index) => (
            <div key={item.label} className={cn("mb-2", item.type === "section" && "mt-4")}>
              {item.type === "section" ? (
                <>
                  <span className="px-4 text-xs font-medium text-gray-500">
                    {item.label}
                  </span>
                  <div className="mt-2">
                    {item.items?.map((subItem) => (
                      <NavLink
                        key={subItem.label}
                        to={subItem.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-4 py-2 text-gray-400 hover:text-primary transition-colors rounded-md",
                            isActive && "bg-white text-primary"
                          )
                        }
                        end
                      >
                        <subItem.icon className="h-5 w-5" />
                        <span className="ml-4">{subItem.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2 text-gray-400 hover:text-primary transition-colors rounded-md",
                      isActive && "bg-white text-primary"
                    )
                  }
                  end
                >
                  <item.icon className="h-5 w-5" />
                  <span className="ml-4">{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </div>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center px-4 py-2 text-gray-400 hover:text-primary transition-colors rounded-md mb-4",
              isActive && "bg-white text-primary"
            )
          }
          end
        >
          <Settings className="h-5 w-5" />
          <span className="ml-4">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
