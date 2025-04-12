import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BookDemo } from "@/components/BookDemo";
import { Link } from "react-router-dom";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Why SenseFX?", href: "#whysensefx" },
    { label: "Solution", href: "#solution" },
    { label: "About", href: "#pricing" },
    { label: "Blog", href: "#blog" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-[#f3f3f3] border-transparent"
      )}
    >
      <div className="max-w-[80rem] mx-auto px-6">
        <div className="flex h-20 items-center">
          <div className="flex items-center">
            <Link className="flex items-center" to="/">
              <div
                className={cn(
                  "p-2 rounded-md transition-colors",
                  scrolled ? "bg-white" : "bg-[#f3f3f3]"
                )}
              >
                <img
                  src="/sensefx-logo.svg"
                  alt="SenseFX Logo"
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>
          <div className="flex-1 flex justify-center">
            <nav className="flex items-center gap-10 text-sm">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="transition-colors hover:text-foreground/80 text-foreground/60 font-semibold"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <nav className="flex items-center">
              <Link to="/login">
                <Button
                  size="lg"
                  variant="ghost"
                  className={cn(
                    "px-6 min-w-[140px] font-medium text-[#3b5a82]",
                    scrolled ? "hover:bg-gray-50" : "hover:bg-[#e9e9e9]"
                  )}
                >
                  Login
                </Button>
              </Link>
              <BookDemo
                size="lg"
                className="ml-4 px-6 min-w-[140px] font-medium"
              />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
