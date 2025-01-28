import { Search, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ChatBot from "./ChatBot";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="h-16 bg-white border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 w-full z-20">
        <div className="flex-1"></div>
        <div className="flex items-center gap-4 mr-[5cm]">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full bg-gray-50"
            />
          </div>
        </div>
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
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>
        <main className="flex-1 bg-white overflow-hidden">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Layout;