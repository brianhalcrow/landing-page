import { Search, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ChatBot from "./ChatBot";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Toaster position="top-right" richColors />
      <header className="h-16 bg-white border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 w-full z-20">
        <div className="flex-1 flex items-center">
          <img 
            src="/lovable-uploads/a53c0673-147d-4736-ab57-107f49a70d72.png" 
            alt="SenseFX Logo" 
            className="h-8"
          />
        </div>
        <div className="flex items-center gap-4 mr-[5cm]">
          <div className="relative w-64">
            <Search 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" 
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 w-full bg-gray-50"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-transparent"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-transparent"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-gray-200 dark:border-gray-700">
          <Sidebar />
        </div>
        <main className="flex-1 bg-white overflow-y-auto">
          {children}
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Layout;