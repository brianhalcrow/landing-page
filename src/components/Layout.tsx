
import { Search, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import ChatBot from "./ChatBot";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

const Layout = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth", { replace: true });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      <Toaster position="top-right" richColors />
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 w-full z-20">
        <div className="flex-1 flex items-center">
          <Link to="/">
            <img 
              src="/lovable-uploads/a53c0673-147d-4736-ab57-107f49a70d72.png" 
              alt="SenseFX Logo" 
              className="h-8"
            />
          </Link>
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
          {/* Theme toggle button temporarily hidden */}
          {/* Temporarily hide logout button for POC
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-transparent"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </Button>
          */}
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r border-gray-200">
          <Sidebar />
        </div>
        <main className="flex-1 bg-white overflow-y-auto px-4">
          <Outlet />
        </main>
      </div>
      <ChatBot />
    </div>
  );
};

export default Layout;

