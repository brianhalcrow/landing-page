import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showHelpLinks, setShowHelpLinks] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      setResetError("Please enter a valid email address");
      return;
    }

    // Show success message
    setResetSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex items-center justify-center">
      <Card className="w-[400px]">
        <div className="flex justify-center mt-6">
          <img
            src="/sensefx-logo.svg"
            alt="SenseFX Logo"
            className="h-12 w-auto"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-center text-lg">
            {showForgotPassword ? "Reset Password" : "Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {showForgotPassword && !resetSuccess
              ? "Enter your email address and we'll send you instructions to reset your password."
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showForgotPassword ? (
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              {!resetSuccess ? (
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                    {resetError && (
                      <p className="text-sm text-red-500 mt-1">{resetError}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-green-600 py-4">
                  Password reset instructions have been sent to your email
                  address. Please check your inbox and follow the instructions
                  to reset your password.
                </div>
              )}
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {!showForgotPassword ? (
            <>
              <Button className="w-full bg-[#206d69] hover:bg-[#206d69]/90">
                Login
              </Button>
              <p className="text-sm text-muted-foreground text-left w-full">
                <button
                  onClick={() => setShowHelpLinks(!showHelpLinks)}
                  className="text-[#206d69] hover:underline"
                >
                  Need help logging in?
                </button>
              </p>
              {showHelpLinks && (
                <div className="flex flex-col items-start gap-2 text-sm w-full">
                  <button
                    onClick={() => setShowForgotPassword(true)}
                    className="text-[#206d69] hover:underline"
                  >
                    Forgot Password
                  </button>
                  <Link
                    to="/contact-us"
                    className="text-[#206d69] hover:underline"
                  >
                    Contact us
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              {!resetSuccess ? (
                <Button
                  type="submit"
                  onClick={handleResetPassword}
                  className="w-full bg-[#206d69] hover:bg-[#206d69]/90"
                >
                  Reset Password
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowHelpLinks(false);
                    setResetSuccess(false);
                    setResetEmail("");
                  }}
                  className="w-full bg-[#206d69] hover:bg-[#206d69]/90"
                >
                  Return to Login
                </Button>
              )}
              {!resetSuccess && (
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowHelpLinks(false);
                    setResetEmail("");
                    setResetError("");
                  }}
                  className="text-sm text-[#206d69] hover:underline"
                >
                  Back to Login
                </button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
