import { useState } from "react";
import { Search, Moon, Sun, MessageSquare, Minimize2, Maximize2 } from "lucide-react";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { theme, setTheme } = useTheme();
  const [chatExpanded, setChatExpanded] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-gray-900 flex">
      <div className="border-r border-gray-200 dark:border-gray-700">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-6">
          <div className="flex-1 flex items-center justify-between">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center justify-center flex-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-transparent"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <div className="w-96" /> {/* Spacer to balance the search bar */}
          </div>
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-all duration-300 ${chatExpanded ? 'h-96' : 'h-16'}`}>
          <div className="flex items-center p-4 h-16">
            <MessageSquare className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
            <Input 
              placeholder="Type your message..." 
              className="flex-1 mr-3 dark:bg-gray-700 dark:text-white"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatExpanded(!chatExpanded)}
              className="hover:bg-transparent"
            >
              {chatExpanded ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </Button>
          </div>
          {chatExpanded && (
            <div className="h-80 p-4 overflow-auto">
              {/* Chat messages will go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;