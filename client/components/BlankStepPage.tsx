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

export function BlankStepPage({
  currentStep,
  onCancel,
  onPrev,
  onSave,
  onGoToCollections,
  onGoToPublications,
  publicationName,
  className,
}: BlankStepPageProps) {
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
        <span className="text-black">
          {publicationName || "Selected Publication Name"}
        </span>
      </div>

      {/* Stepper */}
      <div className="flex flex-col justify-center items-center gap-2.5 self-stretch">
        <Stepper steps={steps} />
      </div>

      {/* File Upload Form */}
      <div className="rounded-[10px] bg-white p-6 md:p-8 lg:p-10 border border-gray-200">
        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 xl:gap-16 w-full">
          {/* File Upload Section */}
          <div className="flex flex-col flex-1 gap-2">
            <label className="text-black font-inter text-sm font-medium">
              File
            </label>
            <div className="flex flex-col items-center gap-7 bg-white rounded-[10px]">
              <div className="flex flex-col justify-center items-center gap-6 flex-1 self-stretch border-2 border-dashed border-black/50 rounded-[10px] p-8 md:p-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex h-[84px] p-5 flex-col justify-between items-center border-3 border-black rounded-[10px]">
                    <svg
                      className="flex h-11 flex-col justify-center items-center gap-2.5 flex-shrink-0"
                      width="48"
                      height="45"
                      viewBox="0 0 48 45"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32.0078 30.4976L24.0078 22.4976L16.0078 30.4976"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24.0078 22.4976V40.4976"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M40.7887 35.2775C42.7394 34.2141 44.2804 32.5313 45.1685 30.4948C46.0565 28.4583 46.2411 26.184 45.6931 24.0309C45.1451 21.8778 43.8957 19.9686 42.142 18.6044C40.3884 17.2403 38.2304 16.499 36.0087 16.4975H33.4887C32.8833 14.156 31.755 11.9822 30.1886 10.1395C28.6222 8.29683 26.6584 6.83323 24.4449 5.85874C22.2314 4.88426 19.8258 4.42424 17.4089 4.51329C14.9921 4.60234 12.6268 5.23813 10.4911 6.37286C8.35528 7.50759 6.50453 9.11173 5.07795 11.0647C3.65137 13.0176 2.68609 15.2686 2.25467 17.6483C1.82325 20.028 1.93692 22.4746 2.58714 24.804C3.23735 27.1335 4.40719 29.2853 6.00871 31.0975"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M32.0078 30.4976L24.0078 22.4976L16.0078 30.4976"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="text-black font-inter text-base font-bold">
                        Drag and drop file here
                      </div>
                      <div className="text-black/60 font-inter text-sm font-medium">
                        Browse Files
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image Upload Section */}
          <div className="flex flex-col flex-1 gap-2">
            <label className="text-black font-inter text-sm font-medium">
              Cover Image
            </label>
            <div className="flex flex-col items-center gap-7 self-stretch bg-white rounded-[10px]">
              <div className="flex flex-col justify-center items-center gap-6 self-stretch border-2 border-dashed border-black/50 rounded-[10px] p-8 md:p-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex p-5 flex-col items-start gap-2.5 border-3 border-black rounded-[10px]">
                    <svg
                      className="flex h-11 flex-col justify-center items-center gap-2.5"
                      width="48"
                      height="44"
                      viewBox="0 0 48 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32.0078 29.9976L24.0078 21.9976L16.0078 29.9976"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24.0078 21.9976V39.9976"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M40.7887 34.7775C42.7394 33.7141 44.2804 32.0313 45.1685 29.9948C46.0565 27.9583 46.2411 25.684 45.6931 23.5309C45.1451 21.3778 43.8957 19.4686 42.142 18.1044C40.3884 16.7403 38.2304 15.999 36.0087 15.9975H33.4887C32.8833 13.656 31.755 11.4822 30.1886 9.63951C28.6222 7.79683 26.6584 6.33323 24.4449 5.35874C22.2314 4.38426 19.8258 3.92424 17.4089 4.01329C14.9921 4.10234 12.6268 4.73813 10.4911 5.87286C8.35528 7.00759 6.50453 8.61173 5.07795 10.5647C3.65137 12.5176 2.68609 14.7686 2.25467 17.1483C1.82325 19.528 1.93692 21.9746 2.58714 24.304C3.23735 26.6335 4.40719 28.7853 6.00871 30.5975"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M32.0078 29.9976L24.0078 21.9976L16.0078 29.9976"
                        stroke="black"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center items-center gap-6">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div className="text-black font-inter text-base font-bold">
                        Drag and drop file here
                      </div>
                      <div className="text-black/60 text-center font-inter text-sm font-medium">
                        The cover must be PNG or JPEG, up to 8 MB, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkboxes and Options */}
        <div className="flex flex-col items-start gap-3 mt-6">
          {/* Import native enrichments */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div className="w-[18px] h-[18px] border border-[#B4B4B4] bg-white rounded-[3px]"></div>
              <div className="flex-1 text-promag-body font-inter text-sm font-medium">
                Import native enrichments (old enrichments will be deleted if present)
              </div>
            </div>
          </div>

          {/* Import table of contents */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div className="w-[18px] h-[18px] border border-[#B4B4B4] bg-white rounded-[3px]"></div>
              <div className="flex-1 text-promag-body font-inter text-sm font-medium">
                Import table of contents (removing existing index)!
              </div>
            </div>
          </div>

          {/* Description text */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div className="flex-1 text-promag-body font-inter text-sm font-medium">
                Upload your PDF file here to convert it into a digital publication. It may take a while for the process to complete. You can learn more about its status under My Publications.
              </div>
            </div>
          </div>

          {/* Requirements list */}
          <div className="flex justify-center items-center w-full max-w-[440px]">
            <div className="text-promag-body font-inter text-sm font-medium leading-6">
              Your PDF must be v1.0-1.5 and less than 300 Mb / 1000 pages.<br />
              Do not simulate a double-page spread on one page.<br />
              Get the best results by making every page the same size.
            </div>
          </div>

          {/* Warning note */}
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div className="flex-1 text-promag-error font-inter text-sm font-bold">
                Note: Don't use Promag to upload documents you do not have permission or own the copyright too.
              </div>
            </div>
          </div>
        </div>
      </div>

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
