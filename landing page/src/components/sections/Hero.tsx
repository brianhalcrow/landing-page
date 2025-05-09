import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookDemo } from "@/components/BookDemo";

const variables = [
  "automate exposure capture",
  "monitor hedging costs",
  "optimize hedging strategies",
  "execute market trades",
  "settle cross-border payments",
  "automate hedge accounting",
  "implement real-time analytics",
];

export function Hero() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [isTypingPaused, setIsTypingPaused] = useState(false);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 1500;

    const typeText = () => {
      const currentWord = variables[wordIndex];

      if (isTypingPaused) {
        setTimeout(() => {
          setIsTypingPaused(false);
          setIsDeleting(true);
        }, pauseDuration);
        return;
      }

      if (isDeleting) {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % variables.length);
        }
      } else {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          setIsTypingPaused(true);
        }
      }
    };

    const timer = setTimeout(
      typeText,
      isDeleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, isTypingPaused]);

  return (
    <div className="relative mb-0">
      <div className="absolute inset-0 bg-[#f3f3f3] h-full" />
      <div className="absolute inset-0 bg-white top-[100%]" />
      <div className="relative px-8 pt-4">
        <div className="mx-auto max-w-screen-2xl py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h1 className="text-5xl font-normal tracking-tight text-[#1e1e1c] sm:text-7xl sm:leading-tight pt-4">
              Smart solutions for complex currency risks
            </h1>
            <p className="mt-6 text-xl sm:text-3xl leading-8 text-[#3b5a82]/80 max-w-5xl mx-auto">
              Intelligent workflows for finance teams that transform chaos into
              clarity.
              <br />
              All in one platform.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <Button
                variant="default"
                size="lg"
                className="px-8 min-w-[170px] h-14 text-lg font-semibold rounded-sm"
                asChild
              >
                <Link to="/get-access">+ Apply to get access</Link>
              </Button>
            </div>
            <div className="w-full max-w-[57.6rem] h-[25rem] border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-lg mx-auto mt-8">
              Image Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
