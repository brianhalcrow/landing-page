import { useState } from "react";
import { Search, Moon, Sun, MessageSquare, Minimize2, ChevronLeft, ChevronRight } from "lucide-react";
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
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      <div className={`transition-all duration-300 border-r border-gray-200 dark:border-gray-700 ${sidebarOpen ? 'w-52' : 'w-16'}`}>
        <div className="flex flex-col h-16">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
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
          <div className="flex justify-end px-4 py-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 sticky top-0 z-10 w-full">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-white dark:bg-gray-900 p-6">
          {children}
        </main>
        <div 
          className={`fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg transition-all duration-300 ${
            chatExpanded 
              ? 'w-96 h-[500px]' 
              : 'w-12 h-12'
          }`}
        >
          {chatExpanded ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <span className="font-medium">Chat</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setChatExpanded(false)}
                  className="hover:bg-transparent"
                >
                  <Minimize2 className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {/* Chat messages will go here */}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Input 
                  placeholder="Type your message..." 
                  className="w-full dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChatExpanded(true)}
              className="w-full h-full hover:bg-transparent flex items-center justify-center"
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;