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
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <header className="h-16 bg-white border-b border-gray-200 dark:border-gray-700 flex items-center justify-end px-6 w-full z-20">
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
    </div>
  );
};

export default Layout;