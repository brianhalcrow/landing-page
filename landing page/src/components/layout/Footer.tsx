import { FC } from "react";
import { Link } from "react-router-dom";
import logoInverse from "@/assets/images/sensefx-logo-inverse.svg";
import { BookDemo } from "@/components/BookDemo";

export const Footer: FC = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-gray-400 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/solutions"
                  className="text-gray-400 hover:text-white"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/why-sensefx"
                  className="text-gray-400 hover:text-white"
                >
                  Why
                </Link>
              </li>
              <li>
                <BookDemo
                  variant="link"
                  className="text-gray-400 hover:text-white"
                >
                  Book a Demo
                </BookDemo>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/documentation"
                  className="text-gray-400 hover:text-white"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/policies/privacy-policy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/terms"
                  className="text-gray-400 hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/cookies"
                  className="text-gray-400 hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src={logoInverse} alt="SenseFX" className="h-8 w-auto" />
              <p className="text-gray-400">
                © {new Date().getFullYear()} SenseFX. All rights reserved
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://twitter.com/sensefx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/sensefx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
