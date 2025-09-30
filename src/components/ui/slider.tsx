"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { trackClassName?: string; thumbClassName?: string }
>(({ className, trackClassName, thumbClassName, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center group",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className={cn("relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", trackClassName)}>
      <SliderPrimitive.Range className="absolute h-full bg-primary group-hover:bg-secondary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className={cn("hidden h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-transform group-hover:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-hover:scale-110 group-hover:border-secondary", thumbClassName)} />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
