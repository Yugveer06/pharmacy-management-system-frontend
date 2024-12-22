"use client";

import React, { useRef, useState } from "react";
import "./ripple-button.css";
import { Button, ButtonProps } from "@/components/ui/button";
import { AnimatePresence, motion as m } from "motion/react";
import { cn } from "@/lib/utils";

// RippleButton component now extends ButtonProps for type safety
interface RippleButtonProps extends ButtonProps {
  tooltip?: string | null;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, children, tooltip, variant, size, ...props }, ref) => {
    const [ripple, setRipple] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    const TOOLTIP_OFFSET = 16;

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const button = e.currentTarget;
      const rippleEffect = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const rippleClasses = ["bg-slate-500/50", "dark:bg-slate-500/50"];
      rippleEffect.classList.add(...rippleClasses);

      rippleEffect.style.width = `${size}px`;
      rippleEffect.style.height = `${size}px`;
      rippleEffect.style.left = `${x}px`;
      rippleEffect.style.top = `${y}px`;

      button.appendChild(rippleEffect);

      const animationDuration = Math.log2(size + 1) * 150;
      rippleEffect.style.animationDuration = `${animationDuration}ms`;

      setRipple(true);

      setTimeout(() => {
        setRipple(false);
        button.removeChild(rippleEffect);
      }, animationDuration);
    };

    const mouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const isTooltipOverflowing = () => {
      const OVERFLOW_THRESHOLD = 24;
      let x = false;
      let y = false;
      if (
        window.innerWidth -
          (mousePos.x +
            TOOLTIP_OFFSET +
            (tooltipRef.current?.getBoundingClientRect().width || 0)) <
        OVERFLOW_THRESHOLD
      ) {
        x = true;
      }

      if (
        window.innerHeight -
          (mousePos.y +
            TOOLTIP_OFFSET +
            (tooltipRef.current?.getBoundingClientRect().height || 0)) <
        OVERFLOW_THRESHOLD
      ) {
        y = true;
      }

      return { x, y };
    };

    return (
      <>
        <Button
          {...props}
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            `ripple-btn active:[&>.overlay]:bg-neutral-400/50 active:[&>.overlay]:dark:bg-neutral-300/50`,
            className,
            ripple ? "ripple" : null,
          )}
          onMouseDown={handleButtonClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={mouseMove}
        >
          <div className="overlay"></div>
          {children}
        </Button>
        {tooltip && (
          <AnimatePresence>
            {isHovering && (
              <m.div
                transition={{ duration: 0.1 }}
                ref={tooltipRef}
                style={{
                  opacity: tooltipRef.current ? 1 : 0,
                  top: isTooltipOverflowing().y
                    ? mousePos.y -
                      (tooltipRef.current?.getBoundingClientRect().height ||
                        0) -
                      TOOLTIP_OFFSET
                    : mousePos.y + TOOLTIP_OFFSET,
                  left: isTooltipOverflowing().x
                    ? mousePos.x -
                      (tooltipRef.current?.getBoundingClientRect().width || 0) -
                      TOOLTIP_OFFSET
                    : mousePos.x + TOOLTIP_OFFSET,
                }}
                className="tooltip tooltip-text rounded border border-slate-300 bg-slate-100 px-2 py-1 text-left text-slate-600 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
              >
                <span>{tooltip}</span>
              </m.div>
            )}
          </AnimatePresence>
        )}
      </>
    );
  },
);

RippleButton.displayName = "RippleButton";

const MotionRippleButton = m.create(RippleButton);
export { RippleButton, MotionRippleButton };
