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

  // const navItems = [
  //   { label: "Why", href: "/why-sensefx" },
  //   { label: "Blog", href: "/blog" },
  //   { label: "Login", href: "/login" },
  // ];
  const navItems = [
    // { label: "Blog", href: "/blog" },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-gray-200 transition-all duration-300",
        "h-28",
        scrolled ? "bg-white shadow-sm" : "bg-[#f3f3f3] border-transparent"
      )}
    >
      <div className="max-w-[80rem] mx-auto px-6">
        <div className="flex h-28 items-center w-full">
          <div className="flex items-center h-full">
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
                  className="h-16 w-auto"
                />
              </div>
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center h-full">
            <nav className="flex items-center gap-2 h-full">
              <Link
                to="/solutions"
                className="px-6 min-w-[140px] text-lg font-semibold text-[#3b5a82] rounded-sm flex items-center justify-center transition-colors hover:bg-gray-200"
              >
                Solution
              </Link>
              <Link
                to="/why-sensefx"
                className="px-6 min-w-[140px] text-lg font-semibold text-[#3b5a82] rounded-sm flex items-center justify-center transition-colors hover:bg-gray-200"
              >
                Why SenseFX?
              </Link>
            </nav>
          </div>
          <div className="flex items-center h-full">
            <nav className="flex items-center gap-4 h-full">
              <BookDemo
                size="lg"
                variant="ghost"
                className="px-8 min-w-[170px] h-14 text-lg font-semibold bg-transparent rounded-sm text-black shadow-none transition-colors hover:!bg-gray-200"
              />
              <Button
                size="lg"
                variant="ghost"
                className="px-8 min-w-[170px] h-14 text-lg font-semibold rounded-sm ml-4 bg-transparent border border-gray-300 text-black transition-colors hover:bg-[#206d69] hover:text-white"
                asChild
              >
                <a href="/get-access">Get access</a>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
