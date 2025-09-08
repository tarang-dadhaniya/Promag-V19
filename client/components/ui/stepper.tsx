import * as React from "react";
import { cn } from "@/lib/utils";

interface StepperStep {
  id: string;
  number: string;
  completed?: boolean;
  current?: boolean;
}

interface StepperProps {
  steps: StepperStep[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("flex justify-center items-center gap-2.5", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          {/* Step Circle */}
          <div
            className={cn(
              "flex w-10 h-10 flex-col justify-center items-center gap-2.5 rounded-full border-2",
              step.completed || step.current
                ? "border-promag-primary bg-promag-primary"
                : "border-[#ABB7C2] bg-white",
            )}
          >
            <span
              className={cn(
                "text-center font-roboto text-base font-medium leading-normal",
                step.completed || step.current
                  ? "text-white"
                  : "text-[#ABB7C2]",
              )}
            >
              {step.number}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-[304px] h-[3px]",
                steps[index].completed ? "bg-promag-primary" : "bg-[#ABB7C2]",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
