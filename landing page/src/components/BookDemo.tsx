import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface BookDemoProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function BookDemo({
  variant = "default",
  size = "default",
  className,
  children = "Book a demo",
}: BookDemoProps) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "sensefx" });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      data-cal-namespace="sensefx"
      data-cal-link="sensefx/demo"
      data-cal-config='{"layout":"month_view"}'
    >
      {children}
    </Button>
  );
}
