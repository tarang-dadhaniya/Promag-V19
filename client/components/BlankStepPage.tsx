import { Stepper } from "./ui/stepper";
import { cn } from "@/lib/utils";

interface BlankStepPageProps {
  currentStep: 1 | 2 | 3 | 4;
  onCancel: () => void;
  onPrev?: () => void;
  onSave: () => void;
  onGoToCollections?: () => void;
  onGoToPublications?: () => void;
  publicationName?: string;
  className?: string;
}

export function BlankStepPage({ currentStep, onCancel, onPrev, onSave, onGoToCollections, onGoToPublications, publicationName, className }: BlankStepPageProps) {
  const steps = [1, 2, 3, 4].map((n) => ({
    id: `step${n}`,
    number: n.toString().padStart(2, "0"),
    current: n === currentStep,
    completed: n < currentStep,
  }));

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Breadcrumb - consistent with step 1 */}
      <div className="flex items-center gap-2 text-sm font-inter font-medium">
        <button
          type="button"
          onClick={onGoToCollections}
          className="text-promag-body/70 hover:text-promag-primary hover:underline underline-offset-4"
        >
          Collections
        </button>
        <span className="text-promag-body/70">/</span>
        <button
          type="button"
          onClick={onGoToPublications}
          className="text-promag-body/70 hover:text-promag-primary hover:underline underline-offset-4"
        >
          Publications
        </button>
        <span className="text-promag-body/70">/</span>
        <span className="text-black">{publicationName || "Selected Publication Name"}</span>
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
          onClick={currentStep > 1 ? onPrev : onCancel}
          className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded bg-[#D9D9D9] text-promag-body font-inter text-sm font-medium hover:bg-[#D9D9D9]/80 transition-colors"
        >
          {currentStep > 1 ? "Previous" : "Cancel"}
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
