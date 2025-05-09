import { FC } from "react";
import { Link } from "react-router-dom";
import logoInverse from "@/assets/images/sensefx-logo-inverse.svg";
import { Linkedin } from "lucide-react";

export const Footer: FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[80rem] mx-auto px-6 pt-8 pb-4">
        {/* Top row: logo left, nav right */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-6">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <img src={logoInverse} alt="SenseFX" className="h-8 w-auto" />
          </div>
          <nav className="flex flex-wrap items-center gap-8 text-gray-300 text-base font-medium">
            <Link to="/why-sensefx" className="hover:text-white">
              Why SenseFX?
            </Link>
            <Link to="/solutions" className="hover:text-white">
              Solution
            </Link>
            <Link to="/blog" className="hover:text-white">
              Blog
            </Link>
          </nav>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-800" />
        {/* Bottom row: copyright left, policies + linkedin right */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4">
          <div className="text-gray-400 text-sm">
            © 2025 SenseFX. All rights reserved
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/policies/privacy-policy"
              className="text-gray-400 hover:text-white text-sm"
            >
              Policies
            </Link>
            <a
              href="https://linkedin.com/company/sensefx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
