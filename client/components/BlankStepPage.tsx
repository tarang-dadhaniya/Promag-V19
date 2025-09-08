import { Stepper } from "./ui/stepper";
import { cn } from "@/lib/utils";

interface BlankStepPageProps {
  currentStep: 1 | 2 | 3 | 4;
  onCancel: () => void;
  onSave: () => void;
  className?: string;
}

export function BlankStepPage({ currentStep, onCancel, onSave, className }: BlankStepPageProps) {
  const steps = [1, 2, 3, 4].map((n) => ({
    id: `step${n}`,
    number: n.toString().padStart(2, "0"),
    current: n === currentStep,
    completed: n < currentStep,
  }));

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Breadcrumb */}
      <div className="text-sm font-inter text-black/60">
        Collections / Publications <span className="text-black">/ Selected Publication Name</span>
      </div>

      {/* Stepper */}
      <div className="flex flex-col justify-center items-center gap-2.5 self-stretch">
        <Stepper steps={steps} />
      </div>

      {/* Blank content card */}
      <div className="rounded-[10px] bg-white min-h-[320px] border border-gray-200" />

      {/* Footer buttons */}
      <div className="flex justify-end items-center gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded bg-[#D9D9D9] text-promag-body font-inter text-sm font-medium hover:bg-[#D9D9D9]/80 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
