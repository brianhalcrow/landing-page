import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-screen bg-white flex overflow-hidden">
      <div className="w-64 border-r border-gray-200 dark:border-gray-700">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 dark:border-gray-700 flex items-center px-6 sticky top-0 z-10">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex-1 flex justify-center">
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
          </div>
        </header>
        <main className="flex-1 bg-white p-6 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;