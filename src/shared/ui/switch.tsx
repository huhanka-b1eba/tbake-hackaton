import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/shared/lib/utils";

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-black transition-colors data-[state=checked]:bg-black data-[state=unchecked]:bg-white",
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full border border-black bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;
