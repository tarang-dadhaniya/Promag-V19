import { cn } from "@/lib/utils";

export type Step = "upload" | "issue-details" | "author-details";

export interface StepValidation {
  upload: boolean;
  "issue-details": boolean;
  "author-details": boolean;
}

interface StepNavigationProps {
  currentStep: Step;
  onStepChange: (step: Step) => void; // kept for API compatibility (not used here)
  validation: StepValidation; // not used for visuals in this design
  className?: string;
}

const steps: Array<{ id: Step; label: string }> = [
  { id: "upload", label: "Upload PDF" },
  { id: "issue-details", label: "Issue Details" },
  { id: "author-details", label: "Author Details" },
];

type StepStatus = "completed" | "current" | "upcoming";

function getStatus(index: number, currentStep: Step): StepStatus {
  const order: Step[] = ["upload", "issue-details", "author-details"];
  const currentIndex = order.indexOf(currentStep);
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "current";
  return "upcoming";
}

function Circle({ index, status }: { index: number; status: StepStatus }) {
  const number = String(index + 1);
  return (
    <div
      className={cn(
        "flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-semibold transition-colors",
        status === "current" && "bg-promag-primary text-white",
        status === "completed" && "bg-promag-primary text-white",
        status === "upcoming" && "bg-gray-200 text-gray-600",
      )}
    >
      {number}
    </div>
  );
}

export function StepNavigation({
  currentStep,
  className,
}: StepNavigationProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  return (
    <div className={cn("flex w-full flex-col gap-5 py-2", className)}>
      <div className="w-full px-4 sm:px-5">
        <div className="flex items-center justify-center w-full">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <Circle index={i} status={getStatus(i, currentStep)} />
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 sm:mx-3 flex-1 h-[3px] min-w-[120px] sm:min-w-[220px] rounded-lg",
                    i < currentIndex ? "bg-promag-primary" : "bg-gray-300",
                  )}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
