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
    <div className="relative">
      <div className="absolute inset-0 bg-[#f3f3f3] h-[95%]" />
      <div className="absolute inset-0 bg-white top-[95%]" />
      <div className="relative px-6 pt-8 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-4xl font-normal tracking-tight text-[#1e1e1c] sm:text-6xl sm:leading-tight pt-4">
              Currency Risk Management Without Limits
            </h1>
            <p className="mt-6 text-xl sm:text-2xl leading-8 text-[#3b5a82]/80 max-w-3xl mx-auto whitespace-nowrap">
              Lightning fast hedging solutions for the modern finance team
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <BookDemo size="lg" className="px-6 min-w-[140px] font-medium" />
              <Button
                variant="outline"
                size="lg"
                className="border-[#cad2de] text-[#3b5a82] hover:bg-[#cad2de]/10 px-6 min-w-[140px] font-medium"
                asChild
              >
                <Link to="/get-access">+ Get access</Link>
              </Button>
            </div>

            <div className="mt-16 mb-12 text-3xl sm:text-5xl font-normal tracking-tight text-[#1e1e1c] max-w-5xl mx-auto space-y-4">
              <div>What if you could</div>
              <div className="text-blue-600 relative h-[1.5em] flex items-center justify-center">
                <span className="relative">
                  {text}
                  <span className="absolute ml-1 -mr-1 h-8 sm:h-10 w-[2px] bg-blue-600 animate-blink" />
                </span>
              </div>
              <div>on a single platform?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
