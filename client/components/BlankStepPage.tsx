import { useRef, useState } from "react";
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
  // State for Add Solutions modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "Solutions",
    startPage: "5",
    endPage: "10",
  });

  // State for Keywords (Step 4)
  const [keywordsData, setKeywordsData] = useState("");

  // Step 3 helpers
  const [treeRefresh, setTreeRefresh] = useState(0);
  const handleReloadTree = () => setTreeRefresh((n) => n + 1);

  // Add Solutions handler
  const handleAddSolution = () => {
    console.log("Adding solution:", formData);
    setShowAddModal(false);
    setFormData({ title: "Solutions", startPage: "5", endPage: "10" });
  };

  // Keywords save handler
  const handleKeywordsSave = () => {
    console.log("Saving keywords:", keywordsData);
  };

  // Step 2 options
  const [importEnrichments, setImportEnrichments] = useState(false);
  const [importToc, setImportToc] = useState(false);

  // Step 2: working drop zones for File and Cover Image
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfDrag, setPdfDrag] = useState(false);
  const [coverDrag, setCoverDrag] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const validatePdf = (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return false;
    }
    const max = 300 * 1024 * 1024; // 300MB
    if (file.size > max) {
      alert("PDF must be less than 300MB.");
      return false;
    }
    return true;
  };

  const validateCover = (file: File) => {
    const ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
    if (!ok) {
      alert("Cover must be PNG or JPEG.");
      return false;
    }
    const max = 8 * 1024 * 1024; // 8MB
    if (file.size > max) {
      alert("Cover image must be less than 8MB.");
      return false;
    }
    return true;
  };

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
      {/* Content Area: show design only on step 2, step 3 tree structure, others blank */}
      {currentStep === 2 ? (
        <div className="rounded-[10px] bg-white p-6 md:p-8 lg:p-10 border border-gray-200">
          <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 xl:gap-16 w-full">
            {/* File Upload Section */}
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-black font-inter text-sm font-medium">
                File
              </label>
              <div className="flex flex-col items-center gap-7 bg-white rounded-[10px]">
                <div
                  className={cn(
                    "flex flex-col justify-center items-center gap-6 self-stretch border-2 border-dashed rounded-[10px] min-h-[220px] p-[20px] px-[40px] pb-[43px] cursor-pointer mb-[-3px]",
                    pdfDrag ? "border-promag-primary bg-promag-primary/5" : "border-black/50",
                  )}
                  onClick={() => pdfInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setPdfDrag(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setPdfDrag(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setPdfDrag(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && validatePdf(file)) setPdfFile(file);
                  }}
                >
                  <input
                    ref={pdfInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && validatePdf(f)) setPdfFile(f);
                    }}
                  />

                  {!pdfFile ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex p-[10px] flex-col items-center border-[3px] border-black rounded-[10px]">
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
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="text-black font-inter text-base font-bold">
                          Drag and drop file here
                        </div>
                        <div className="text-black/60 font-inter text-sm font-medium">
                          Browse Files
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="text-black font-inter text-sm font-medium">
                        {pdfFile.name}
                      </div>
                      <div className="text-black/60 font-inter text-xs">
                        PDF selected — click to change
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Image Upload Section */}
            <div className="flex flex-col flex-1 gap-2">
              <label className="text-black font-inter text-sm font-medium">
                Cover Image
              </label>
              <div className="flex flex-col items-center gap-7 self-stretch bg-white rounded-[10px]">
                <div
                  className={cn(
                    "flex flex-col justify-center items-center gap-6 self-stretch border-2 border-dashed rounded-[10px] min-h-[220px] p-[20px] px-[40px] cursor-pointer",
                    coverDrag ? "border-promag-primary bg-promag-primary/5" : "border-black/50",
                  )}
                  onClick={() => coverInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setCoverDrag(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setCoverDrag(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setCoverDrag(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && validateCover(file)) setCoverFile(file);
                  }}
                >
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] || null;
                      if (f && validateCover(f)) setCoverFile(f);
                    }}
                  />

                  {!coverFile ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="flex p-[10px] flex-col items-start gap-2.5 border-[3px] border-black rounded-[10px]">
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
                            d="M40.7887 34.7775C42.7394 33.7141 44.2804 32.0313 45.1685 29.9948C46.0565 27.9583 46.2411 25.684 45.6931 23.5309C45.1451 21.3778 43.8957 19.4686 42.142 18.1044C40.3884 16.7403 38.2304 15.999 36.0087 15.9975H33.4887C32.8833 13.656 31.755 11.4822 30.1886 9.63951C28.6222 7.79683 26.6584 6.33323 24.4449 5.35874C22.2314 4.38426 19.8258 3.92424 17.4089 4.01329C14.9921 4.10234 12.6268 4.73813 10.4911 5.87286C8.35528 7.00759 6.50453 9.11173 5.07795 10.5647C3.65137 12.5176 2.68609 14.7686 2.25467 17.1483C1.82325 19.528 1.93692 21.9746 2.58714 24.304C3.23735 26.6335 4.40719 28.7853 6.00871 30.5975"
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
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div className="text-black font-inter text-base font-bold">
                          Drag and drop file here
                        </div>
                        <div className="text-black/60 text-center font-inter text-sm font-medium">
                          The cover must be PNG or JPEG, up to 8 MB, 16:9 or
                          9:16 aspect ratio, with each side between 320 px and
                          3,840 px.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="text-black font-inter text-sm font-medium">
                        {coverFile.name}
                      </div>
                      <div className="text-black/60 font-inter text-xs">
                        Image selected — click to change
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Checkboxes and Options */}
          <div className="flex flex-col items-start gap-3 mt-6">
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="import-enrichments" className="flex items-center gap-2">
                <input
                  id="import-enrichments"
                  type="checkbox"
                  className="h-[18px] w-[18px] rounded-[3px] border border-[#B4B4B4] bg-white accent-promag-primary"
                  checked={importEnrichments}
                  onChange={(e) => setImportEnrichments(e.target.checked)}
                />
                <span className="flex-1 text-promag-body font-inter text-sm font-medium">
                  Import native enrichments (old enrichments will be deleted if present)
                </span>
              </label>
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="import-toc" className="flex items-center gap-2">
                <input
                  id="import-toc"
                  type="checkbox"
                  className="h-[18px] w-[18px] rounded-[3px] border border-[#B4B4B4] bg-white accent-promag-primary"
                  checked={importToc}
                  onChange={(e) => setImportToc(e.target.checked)}
                />
                <span className="flex-1 text-promag-body font-inter text-sm font-medium">
                  Import table of contents (removing existing index)!
                </span>
              </label>
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-center items-center gap-2 self-stretch">
                <div className="flex-1 text-promag-body font-inter text-sm font-medium">
                  Upload your PDF file here to convert it into a digital publication. It may take a while for the process to complete. You can learn more about its status under My Publications.
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center w-full max-w-[520px]">
              <ul className="list-disc pl-5 text-promag-body font-inter text-sm font-medium leading-6 space-y-1">
                <li>Your PDF must be v1.0-1.5 and less than 300 Mb / 1000 pages.</li>
                <li>Do not simulate a double-page spread on one page.</li>
                <li>Get the best results by making every page the same size.</li>
              </ul>
            </div>
            <div className="flex flex-col w-full gap-2">
              <div className="flex justify-center items-center gap-2 self-stretch">
                <div className="flex-1 text-promag-error font-inter text-sm font-bold">
                  Note: Don't use Promag to upload documents you do not have permission or own the copyright too.
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end items-center gap-2.5 pt-2.5">
            <button
              type="button"
              onClick={currentStep > 1 ? onPrev : onCancel}
              className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded border border-promag-primary text-promag-body font-inter text-sm font-medium transition-colors"
            >
              Previous
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
      ) : currentStep === 3 ? (
        <div className="rounded-[10px] bg-white p-5 border border-gray-200">
          {/* Toolbar */}
          <div className="flex items-center justify-end gap-2.5 mb-[15px]">
            <button
              type="button"
              onClick={handleReloadTree}
              className="flex h-[42px] px-5 py-2.5 justify-center items-center rounded-lg border-2 border-promag-primary text-promag-primary font-inter text-sm font-semibold"
            >
              Reload
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Add
            </button>
          </div>
          {/* Tree Structure */}
          <div key={treeRefresh} className="flex flex-col items-start p-2 border border-dashed border-[#C2C2C2] rounded-[10px] bg-white mb-5">
            {/* Main tree element */}
            <div className="flex items-center gap-1 self-stretch bg-white p-1">
              {/* Caret */}
              <div className="flex h-6 flex-col justify-center items-center">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66602 6.66675L7.99935 10.0001L11.3327 6.66675H4.66602Z"
                    fill="#707070"
                  />
                </svg>
              </div>

              {/* Text Zone */}
              <div className="h-6 flex-1 rounded-[5px] relative">
                <div className="inline-flex p-1 flex-col items-start absolute left-0 top-0">
                  <div className="text-promag-body font-inter text-sm font-normal leading-4">
                    Solutions (Pages 5-10)
                  </div>
                </div>
              </div>

              {/* Trailing Icons */}
              <div className="flex p-1 justify-center items-center">
                <div className="flex items-center gap-1.5">
                  {/* Add icon */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-3.5 h-3.5 hover:opacity-70"
                  >
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.7695 5.76953H8.23047V1.23047C8.23047 0.550894 7.67957 0 7 0C6.32043 0 5.76953 0.550894 5.76953 1.23047V5.76953H1.23047C0.550894 5.76953 0 6.32043 0 7C0 7.67957 0.550894 8.23047 1.23047 8.23047H5.76953V12.7695C5.76953 13.4491 6.32043 14 7 14C7.67957 14 8.23047 13.4491 8.23047 12.7695V8.23047H12.7695C13.4491 8.23047 14 7.67957 14 7C14 6.32043 13.4491 5.76953 12.7695 5.76953Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>

                  {/* Edit icon */}
                  <button className="w-3.5 h-3.5 hover:opacity-70">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.666 5.01677L6.77768 9.9051C6.60852 10.0743 6.38685 10.1793 6.14768 10.2026L4.43852 10.3601C4.43852 10.3601 4.39185 10.3601 4.37435 10.3601C4.18185 10.3601 3.99518 10.2843 3.86102 10.1443C3.70935 9.9926 3.63352 9.77677 3.65102 9.56093L3.80852 7.85177C3.83185 7.6126 3.93685 7.39093 4.10602 7.22177L8.98268 2.33343L11.666 5.01677ZM12.7977 1.61593L12.3835 1.20177C11.7593 0.577601 10.7385 0.577601 10.1143 1.20177L9.60102 1.7151L12.2843 4.39843L12.7977 3.8851C13.101 3.58177 13.2702 3.17927 13.2702 2.75343C13.2702 2.3276 13.101 1.91927 12.7977 1.62177V1.61593ZM12.1035 11.0893V7.7001C12.1035 7.46093 11.9052 7.2626 11.666 7.2626C11.4268 7.2626 11.2285 7.46093 11.2285 7.7001V11.0893C11.2285 11.8126 10.6393 12.4018 9.91602 12.4018H2.91602C2.19268 12.4018 1.60352 11.8126 1.60352 11.0893V4.08343C1.60352 3.3601 2.19268 2.77093 2.91602 2.77093H6.30518C6.54435 2.77093 6.74268 2.5726 6.74268 2.33343C6.74268 2.09427 6.54435 1.89593 6.30518 1.89593H2.91602C1.70852 1.89593 0.728516 2.87593 0.728516 4.08343V11.0834C0.728516 12.2909 1.70852 13.2709 2.91602 13.2709H9.91602C11.1235 13.2709 12.1035 12.2909 12.1035 11.0834V11.0893Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>

                  {/* Delete icon */}
                  <button className="w-3.5 h-3.5 hover:opacity-70">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.084 4.08325C10.9293 4.08325 10.7809 4.14471 10.6715 4.25411C10.5621 4.3635 10.5007 4.51188 10.5007 4.66659V11.1947C10.4839 11.4897 10.3513 11.7661 10.1317 11.9637C9.91208 12.1614 9.62326 12.2642 9.32815 12.2499H4.67315C4.37804 12.2642 4.08922 12.1614 3.86961 11.9637C3.65 11.7661 3.51738 11.4897 3.50065 11.1947V4.66659C3.50065 4.51188 3.43919 4.3635 3.3298 4.25411C3.2204 4.14471 3.07203 4.08325 2.91732 4.08325C2.76261 4.08325 2.61424 4.14471 2.50484 4.25411C2.39544 4.3635 2.33398 4.51188 2.33398 4.66659V11.1947C2.35064 11.7991 2.60616 12.3724 3.04459 12.7888C3.48302 13.2053 4.06863 13.431 4.67315 13.4166H9.32815C9.93268 13.431 10.5183 13.2053 10.9567 12.7888C11.3951 12.3724 11.6507 11.7991 11.6673 11.1947V4.66659C11.6673 4.51188 11.6059 4.3635 11.4965 4.25411C11.3871 4.14471 11.2387 4.08325 11.084 4.08325Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M11.6667 2.33325H9.33333V1.16659C9.33333 1.01188 9.27187 0.863503 9.16248 0.754106C9.05308 0.64471 8.90471 0.583252 8.75 0.583252H5.25C5.09529 0.583252 4.94692 0.64471 4.83752 0.754106C4.72812 0.863503 4.66667 1.01188 4.66667 1.16659V2.33325H2.33333C2.17862 2.33325 2.03025 2.39471 1.92085 2.50411C1.81146 2.6135 1.75 2.76188 1.75 2.91659C1.75 3.0713 1.81146 3.21967 1.92085 3.32906C2.03025 3.43846 2.17862 3.49992 2.33333 3.49992H11.6667C11.8214 3.49992 11.9697 3.43846 12.0791 3.32906C12.1885 3.21967 12.25 3.0713 12.25 2.91659C12.25 2.76188 12.1885 2.6135 12.0791 2.50411C11.9697 2.39471 11.8214 2.33325 11.6667 2.33325ZM5.83333 2.33325V1.74992H8.16667V2.33325H5.83333Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M6.41667 9.91667V5.83333C6.41667 5.67862 6.35521 5.53025 6.24581 5.42085C6.13642 5.31146 5.98804 5.25 5.83333 5.25C5.67862 5.25 5.53025 5.31146 5.42085 5.42085C5.31146 5.53025 5.25 5.67862 5.25 5.83333V9.91667C5.25 10.0714 5.31146 10.2197 5.42085 10.3291C5.53025 10.4385 5.67862 10.5 5.83333 10.5C5.98804 10.5 6.13642 10.4385 6.24581 10.3291C6.35521 10.2197 6.41667 10.0714 6.41667 9.91667Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M8.75065 9.91667V5.83333C8.75065 5.67862 8.68919 5.53025 8.5798 5.42085C8.4704 5.31146 8.32203 5.25 8.16732 5.25C8.01261 5.25 7.86424 5.31146 7.75484 5.42085C7.64544 5.53025 7.58398 5.67862 7.58398 5.83333V9.91667C7.58398 10.0714 7.64544 10.2197 7.75484 10.3291C7.86424 10.4385 8.01261 10.5 8.16732 10.5C8.32203 10.5 8.4704 10.4385 8.5798 10.3291C8.68919 10.2197 8.75065 10.0714 8.75065 9.91667Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>

                  {/* Move icon */}
                  <button className="w-3.5 h-3.5 hover:opacity-70">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.94545 1.79199L7.26821 0.114749C7.19218 0.0387178 7.09077 -0.000208315 6.98594 1.93231e-05C6.87918 -0.00100505 6.77549 0.0387178 6.69946 0.114749L5.05682 1.75739C4.90294 1.91127 4.90294 2.16144 5.05682 2.31521L5.26864 2.52703C5.41717 2.67556 5.67645 2.67556 5.8251 2.52703L6.45395 1.89681V4.21269C6.45395 4.21975 6.45804 4.22555 6.4593 4.23215C6.47637 4.43395 6.64562 4.59364 6.85197 4.59364H7.15132C7.36883 4.59364 7.54763 4.417 7.54763 4.19949V3.94089C7.54763 3.93975 7.54763 3.93896 7.54763 3.93804V1.93119L8.17671 2.56152C8.3306 2.7154 8.5802 2.7154 8.73397 2.56152L8.94545 2.34993C9.09933 2.19593 9.09933 1.94564 8.94545 1.79199Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M8.94341 11.6504L8.7317 11.4383C8.58317 11.2895 8.32378 11.2895 8.17502 11.4383L7.54594 12.0686V10.0706C7.54594 10.0695 7.54594 10.0688 7.54594 10.0678V9.80917C7.54594 9.59155 7.36701 9.40625 7.14973 9.40625H6.85016C6.64404 9.40625 6.47479 9.57004 6.4576 9.77206C6.45635 9.77878 6.45225 9.78902 6.45225 9.79597V12.1032L5.8234 11.473C5.67475 11.3243 5.4149 11.3243 5.26626 11.473L5.05455 11.6848C4.9009 11.8386 4.90112 12.0889 5.05501 12.2427L6.69776 13.8853C6.77185 13.9596 6.87076 14 6.97286 14H6.98766C7.09339 14 7.19207 13.9597 7.26628 13.8853L8.94341 12.2081C9.09729 12.0544 9.09729 11.8042 8.94341 11.6504Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M4.18983 6.45301H4.15614H3.92999C3.92919 6.45301 3.92839 6.45301 3.92748 6.45301H1.93906L2.56939 5.82609C2.64372 5.75188 2.68458 5.65445 2.68458 5.54894C2.68458 5.44332 2.64372 5.34509 2.56939 5.271L2.35757 5.05963C2.20369 4.90575 1.9534 4.90598 1.79975 5.05986L0.12251 6.73699C0.046479 6.8129 0.00584562 6.91477 0.00789436 7.01926C0.0057318 7.12795 0.046479 7.22971 0.12251 7.30574L1.76515 8.94849C1.84209 9.02543 1.94305 9.0639 2.04412 9.0639C2.14519 9.0639 2.24615 9.02543 2.32309 8.94849L2.53479 8.73679C2.60912 8.66258 2.65009 8.56344 2.65009 8.45793C2.65009 8.35231 2.60923 8.25215 2.53479 8.17805L1.90469 7.54681H4.20179C4.20873 7.54681 4.22011 7.5451 4.22671 7.54385C4.42863 7.52678 4.59355 7.3598 4.59355 7.15356V6.85376C4.59355 6.63648 4.40734 6.45301 4.18983 6.45301Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M13.8772 6.737L12.1999 5.05999C12.0462 4.90611 11.7959 4.90611 11.6421 5.05999L11.4305 5.27181C11.3562 5.34591 11.3152 5.44504 11.3152 5.55055C11.3152 5.65618 11.3561 5.75178 11.4305 5.82599L12.0607 6.45291H10.0596C10.0585 6.45291 10.0577 6.45291 10.0568 6.45291H9.79836C9.58085 6.45291 9.40625 6.63627 9.40625 6.85367V7.15347C9.40625 7.35971 9.56457 7.52645 9.7666 7.54364C9.77332 7.545 9.77821 7.54671 9.78504 7.54671H12.0952L11.4648 8.17784C11.3906 8.25193 11.3496 8.35187 11.3496 8.45715C11.3496 8.56289 11.3905 8.66225 11.4648 8.73646L11.6767 8.94828C11.7535 9.02522 11.8545 9.06381 11.9556 9.06381C12.0566 9.06381 12.1575 9.02533 12.2344 8.94839L13.8773 7.30564C13.9531 7.22984 13.9937 7.12797 13.9919 7.02337C13.9936 6.91467 13.953 6.81281 13.8772 6.737Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M7.00051 5.90552C6.39715 5.90552 5.90625 6.39642 5.90625 6.99989C5.90625 7.60324 6.39715 8.09426 7.00051 8.09426C7.60386 8.09426 8.09488 7.60324 8.09488 6.99989C8.09488 6.39642 7.60386 5.90552 7.00051 5.90552Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Child tree element */}
            <div className="flex items-center gap-1 self-stretch bg-white p-1">
              {/* Trail Zone */}
              <div className="flex items-start gap-1">
                <svg
                  className="w-4 h-6"
                  viewBox="0 0 23 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1L8 9C8 13.4183 11.5817 17 16 17L22 17"
                    stroke="#707070"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Caret */}
              <div className="flex h-6 flex-col justify-center items-center">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.66602 6.66675L7.99935 10.0001L11.3327 6.66675H4.66602Z"
                    fill="#707070"
                  />
                </svg>
              </div>

              {/* Text Zone */}
              <div className="h-6 flex-1 rounded-[5px] relative">
                <div className="inline-flex p-1 flex-col items-start absolute left-0 top-0">
                  <div className="text-promag-body font-inter text-sm font-normal leading-4">
                    Child Solution (Pages 8-12)
                  </div>
                </div>
              </div>

              {/* Trailing Icons */}
              <div className="flex p-1 justify-center items-center">
                <div className="flex items-center gap-1.5">
                  {/* Same action icons as parent */}
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-3.5 h-3.5 hover:opacity-70"
                  >
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.7695 5.76953H8.23047V1.23047C8.23047 0.550894 7.67957 0 7 0C6.32043 0 5.76953 0.550894 5.76953 1.23047V5.76953H1.23047C0.550894 5.76953 0 6.32043 0 7C0 7.67957 0.550894 8.23047 1.23047 8.23047H5.76953V12.7695C5.76953 13.4491 6.32043 14 7 14C7.67957 14 8.23047 13.4491 8.23047 12.7695V8.23047H12.7695C13.4491 8.23047 14 7.67957 14 7C14 6.32043 13.4491 5.76953 12.7695 5.76953Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>
                  <button className="w-3.5 h-3.5 hover:opacity-70">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.666 5.01677L6.77768 9.9051C6.60852 10.0743 6.38685 10.1793 6.14768 10.2026L4.43852 10.3601C4.43852 10.3601 4.39185 10.3601 4.37435 10.3601C4.18185 10.3601 3.99518 10.2843 3.86102 10.1443C3.70935 9.9926 3.63352 9.77677 3.65102 9.56093L3.80852 7.85177C3.83185 7.6126 3.93685 7.39093 4.10602 7.22177L8.98268 2.33343L11.666 5.01677ZM12.7977 1.61593L12.3835 1.20177C11.7593 0.577601 10.7385 0.577601 10.1143 1.20177L9.60102 1.7151L12.2843 4.39843L12.7977 3.8851C13.101 3.58177 13.2702 3.17927 13.2702 2.75343C13.2702 2.3276 13.101 1.91927 12.7977 1.62177V1.61593ZM12.1035 11.0893V7.7001C12.1035 7.46093 11.9052 7.2626 11.666 7.2626C11.4268 7.2626 11.2285 7.46093 11.2285 7.7001V11.0893C11.2285 11.8126 10.6393 12.4018 9.91602 12.4018H2.91602C2.19268 12.4018 1.60352 11.8126 1.60352 11.0893V4.08343C1.60352 3.3601 2.19268 2.77093 2.91602 2.77093H6.30518C6.54435 2.77093 6.74268 2.5726 6.74268 2.33343C6.74268 2.09427 6.54435 1.89593 6.30518 1.89593H2.91602C1.70852 1.89593 0.728516 2.87593 0.728516 4.08343V11.0834C0.728516 12.2909 1.70852 13.2709 2.91602 13.2709H9.91602C11.1235 13.2709 12.1035 12.2909 12.1035 11.0834V11.0893Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>
                  <button className="w-3.5 h-3.5 hover:opacity-70">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.084 4.08325C10.9293 4.08325 10.7809 4.14471 10.6715 4.25411C10.5621 4.3635 10.5007 4.51188 10.5007 4.66659V11.1947C10.4839 11.4897 10.3513 11.7661 10.1317 11.9637C9.91208 12.1614 9.62326 12.2642 9.32815 12.2499H4.67315C4.37804 12.2642 4.08922 12.1614 3.86961 11.9637C3.65 11.7661 3.51738 11.4897 3.50065 11.1947V4.66659C3.50065 4.51188 3.43919 4.3635 3.3298 4.25411C3.2204 4.14471 3.07203 4.08325 2.91732 4.08325C2.76261 4.08325 2.61424 4.14471 2.50484 4.25411C2.39544 4.3635 2.33398 4.51188 2.33398 4.66659V11.1947C2.35064 11.7991 2.60616 12.3724 3.04459 12.7888C3.48302 13.2053 4.06863 13.431 4.67315 13.4166H9.32815C9.93268 13.431 10.5183 13.2053 10.9567 12.7888C11.3951 12.3724 11.6507 11.7991 11.6673 11.1947V4.66659C11.6673 4.51188 11.6059 4.3635 11.4965 4.25411C11.3871 4.14471 11.2387 4.08325 11.084 4.08325Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M11.6667 2.33325H9.33333V1.16659C9.33333 1.01188 9.27187 0.863503 9.16248 0.754106C9.05308 0.64471 8.90471 0.583252 8.75 0.583252H5.25C5.09529 0.583252 4.94692 0.64471 4.83752 0.754106C4.72812 0.863503 4.66667 1.01188 4.66667 1.16659V2.33325H2.33333C2.17862 2.33325 2.03025 2.39471 1.92085 2.50411C1.81146 2.6135 1.75 2.76188 1.75 2.91659C1.75 3.0713 1.81146 3.21967 1.92085 3.32906C2.03025 3.43846 2.17862 3.49992 2.33333 3.49992H11.6667C11.8214 3.49992 11.9697 3.43846 12.0791 3.32906C12.1885 3.21967 12.25 3.0713 12.25 2.91659C12.25 2.76188 12.1885 2.6135 12.0791 2.50411C11.9697 2.39471 11.8214 2.33325 11.6667 2.33325ZM5.83333 2.33325V1.74992H8.16667V2.33325H5.83333Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M6.41667 9.91667V5.83333C6.41667 5.67862 6.35521 5.53025 6.24581 5.42085C6.13642 5.31146 5.98804 5.25 5.83333 5.25C5.67862 5.25 5.53025 5.31146 5.42085 5.42085C5.31146 5.53025 5.25 5.67862 5.25 5.83333V9.91667C5.25 10.0714 5.31146 10.2197 5.42085 10.3291C5.53025 10.4385 5.67862 10.5 5.83333 10.5C5.98804 10.5 6.13642 10.4385 6.24581 10.3291C6.35521 10.2197 6.41667 10.0714 6.41667 9.91667Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M8.75065 9.91667V5.83333C8.75065 5.67862 8.68919 5.53025 8.5798 5.42085C8.4704 5.31146 8.32203 5.25 8.16732 5.25C8.01261 5.25 7.86424 5.31146 7.75484 5.42085C7.64544 5.53025 7.58398 5.67862 7.58398 5.83333V9.91667C7.58398 10.0714 7.64544 10.2197 7.75484 10.3291C7.86424 10.4385 8.01261 10.5 8.16732 10.5C8.32203 10.5 8.4704 10.4385 8.5798 10.3291C8.68919 10.2197 8.75065 10.0714 8.75065 9.91667Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>
                  <button className="w-3.5 h-3.5 hover:opacity-70">
                    <svg
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.94545 1.79199L7.26821 0.114749C7.19218 0.0387178 7.09077 -0.000208315 6.98594 1.93231e-05C6.87918 -0.00100505 6.77549 0.0387178 6.69946 0.114749L5.05682 1.75739C4.90294 1.91127 4.90294 2.16144 5.05682 2.31521L5.26864 2.52703C5.41717 2.67556 5.67645 2.67556 5.8251 2.52703L6.45395 1.89681V4.21269C6.45395 4.21975 6.45804 4.22555 6.4593 4.23215C6.47637 4.43395 6.64562 4.59364 6.85197 4.59364H7.15132C7.36883 4.59364 7.54763 4.417 7.54763 4.19949V3.94089C7.54763 3.93975 7.54763 3.93896 7.54763 3.93804V1.93119L8.17671 2.56152C8.3306 2.7154 8.5802 2.7154 8.73397 2.56152L8.94545 2.34993C9.09933 2.19593 9.09933 1.94564 8.94545 1.79199Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M8.94341 11.6504L8.7317 11.4383C8.58317 11.2895 8.32378 11.2895 8.17502 11.4383L7.54594 12.0686V10.0706C7.54594 10.0695 7.54594 10.0688 7.54594 10.0678V9.80917C7.54594 9.59155 7.36701 9.40625 7.14973 9.40625H6.85016C6.64404 9.40625 6.47479 9.57004 6.4576 9.77206C6.45635 9.77878 6.45225 9.78902 6.45225 9.79597V12.1032L5.8234 11.473C5.67475 11.3243 5.4149 11.3243 5.26626 11.473L5.05455 11.6848C4.9009 11.8386 4.90112 12.0889 5.05501 12.2427L6.69776 13.8853C6.77185 13.9596 6.87076 14 6.97286 14H6.98766C7.09339 14 7.19207 13.9597 7.26628 13.8853L8.94341 12.2081C9.09729 12.0544 9.09729 11.8042 8.94341 11.6504Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M4.18983 6.45301H4.15614H3.92999C3.92919 6.45301 3.92839 6.45301 3.92748 6.45301H1.93906L2.56939 5.82609C2.64372 5.75188 2.68458 5.65445 2.68458 5.54894C2.68458 5.44332 2.64372 5.34509 2.56939 5.271L2.35757 5.05963C2.20369 4.90575 1.9534 4.90598 1.79975 5.05986L0.12251 6.73699C0.046479 6.8129 0.00584562 6.91477 0.00789436 7.01926C0.0057318 7.12795 0.046479 7.22971 0.12251 7.30574L1.76515 8.94849C1.84209 9.02543 1.94305 9.0639 2.04412 9.0639C2.14519 9.0639 2.24615 9.02543 2.32309 8.94849L2.53479 8.73679C2.60912 8.66258 2.65009 8.56344 2.65009 8.45793C2.65009 8.35231 2.60923 8.25215 2.53479 8.17805L1.90469 7.54681H4.20179C4.20873 7.54681 4.22011 7.5451 4.22671 7.54385C4.42863 7.52678 4.59355 7.3598 4.59355 7.15356V6.85376C4.59355 6.63648 4.40734 6.45301 4.18983 6.45301Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M13.8772 6.737L12.1999 5.05999C12.0462 4.90611 11.7959 4.90611 11.6421 5.05999L11.4305 5.27181C11.3562 5.34591 11.3152 5.44504 11.3152 5.55055C11.3152 5.65618 11.3561 5.75178 11.4305 5.82599L12.0607 6.45291H10.0596C10.0585 6.45291 10.0577 6.45291 10.0568 6.45291H9.79836C9.58085 6.45291 9.40625 6.63627 9.40625 6.85367V7.15347C9.40625 7.35971 9.56457 7.52645 9.7666 7.54364C9.77332 7.545 9.77821 7.54671 9.78504 7.54671H12.0952L11.4648 8.17784C11.3906 8.25193 11.3496 8.35187 11.3496 8.45715C11.3496 8.56289 11.3905 8.66225 11.4648 8.73646L11.6767 8.94828C11.7535 9.02522 11.8545 9.06381 11.9556 9.06381C12.0566 9.06381 12.1575 9.02533 12.2344 8.94839L13.8773 7.30564C13.9531 7.22984 13.9937 7.12797 13.9919 7.02337C13.9936 6.91467 13.953 6.81281 13.8772 6.737Z"
                        fill="#7E7E7E"
                      />
                      <path
                        d="M7.00051 5.90552C6.39715 5.90552 5.90625 6.39642 5.90625 6.99989C5.90625 7.60324 6.39715 8.09426 7.00051 8.09426C7.60386 8.09426 8.09488 7.60324 8.09488 6.99989C8.09488 6.39642 7.60386 5.90552 7.00051 5.90552Z"
                        fill="#7E7E7E"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>


          <div className="flex justify-end items-center gap-2.5 pt-2.5">
            <button
              type="button"
              onClick={currentStep > 1 ? onPrev : onCancel}
              className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded border border-promag-primary text-promag-body font-inter text-sm font-medium transition-colors"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={onSave}
              className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
            >
              Save
            </button>
          </div>

          {/* Add Solutions Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="flex flex-col justify-center items-start bg-white rounded-[10px] w-[700px] max-w-[90vw] max-h-[90vh]">
                {/* Modal Header */}
                <div className="flex w-full h-[50px] px-5 justify-between items-center border-b border-black/20 rounded-t-[10px]">
                  <div className="text-black text-center font-inter text-lg font-bold leading-[15px]">
                    Add Solutions
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="w-4 h-4 text-[#FF5656] hover:opacity-70"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.30626 7.95596L15.7863 1.47596C15.9319 1.30592 16.008 1.08718 15.9993 0.863469C15.9907 0.639757 15.898 0.427545 15.7397 0.269239C15.5813 0.110933 15.3691 0.0181922 15.1454 0.00955116C14.9217 0.000910139 14.703 0.0770048 14.5329 0.222628L8.05293 6.70263L1.57293 0.213739C1.40288 0.0681157 1.18415 -0.00797811 0.960436 0.00066292C0.736724 0.00930395 0.524512 0.102043 0.366205 0.26035C0.207899 0.418656 0.115159 0.630868 0.106518 0.85458C0.0978767 1.07829 0.173971 1.29703 0.319595 1.46707L6.79959 7.95596L0.310706 14.436C0.217655 14.5156 0.142082 14.6137 0.0887276 14.724C0.0353736 14.8343 0.00539082 14.9544 0.000662382 15.0768C-0.00406606 15.1992 0.0165614 15.3213 0.0612499 15.4354C0.105938 15.5494 0.173724 15.653 0.26035 15.7397C0.346976 15.8263 0.450574 15.8941 0.564641 15.9387C0.678708 15.9834 0.800781 16.0041 0.923198 15.9993C1.04561 15.9946 1.16573 15.9646 1.27601 15.9113C1.38629 15.8579 1.48435 15.7823 1.56404 15.6893L8.05293 9.20929L14.5329 15.6893C14.703 15.8349 14.9217 15.911 15.1454 15.9024C15.3691 15.8937 15.5813 15.801 15.7397 15.6427C15.898 15.4844 15.9907 15.2722 15.9993 15.0485C16.008 14.8247 15.9319 14.606 15.7863 14.436L9.30626 7.95596Z" />
                    </svg>
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex w-full p-[30px] flex-col items-start gap-2.5 border-b border-black/20">
                  <div className="flex flex-col items-start gap-5 self-stretch">
                    {/* Title Input */}
                    <div className="flex h-[67px] flex-col items-start gap-2 self-stretch">
                      <label className="self-stretch text-promag-body font-inter text-sm font-medium">
                        Title
                      </label>
                      <div className="flex h-[42px] px-3.5 py-2.5 items-center gap-2.5 flex-shrink-0 self-stretch rounded-[5px] border border-promag-input-border bg-white">
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          className="text-promag-body font-inter text-sm font-normal leading-4 bg-transparent border-none outline-none flex-1"
                          placeholder="Add title"
                        />
                      </div>
                    </div>

                    {/* Start Page Input */}
                    <div className="flex h-[67px] flex-col items-start gap-2 self-stretch">
                      <label className="self-stretch text-promag-body font-inter text-sm font-medium">
                        Start Page
                      </label>
                      <div className="flex h-[42px] px-3.5 py-2.5 items-center gap-2.5 flex-shrink-0 self-stretch rounded-[5px] border border-promag-input-border bg-white">
                        <input
                          type="text"
                          value={formData.startPage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startPage: e.target.value,
                            })
                          }
                          className="text-promag-body font-inter text-sm font-normal leading-4 bg-transparent border-none outline-none flex-1"
                          placeholder="Add Start Page"
                        />
                      </div>
                    </div>

                    {/* End Page Input */}
                    <div className="flex h-[67px] flex-col items-start gap-2 self-stretch">
                      <label className="self-stretch text-promag-body font-inter text-sm font-medium">
                        End Page
                      </label>
                      <div className="flex h-[42px] px-3.5 py-2.5 items-center gap-2.5 flex-shrink-0 self-stretch rounded-[5px] border border-promag-input-border bg-white">
                        <input
                          type="text"
                          value={formData.endPage}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endPage: e.target.value,
                            })
                          }
                          className="text-promag-body font-inter text-sm font-normal leading-4 bg-transparent border-none outline-none flex-1"
                            placeholder="Add End Page"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex h-[60px] px-[30px] justify-end items-center gap-5 rounded-b-[10px] w-full">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded-[5px] bg-[#D9D9D9] text-promag-body font-inter text-sm font-medium hover:bg-[#D9D9D9]/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSolution}
                    className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : currentStep === 4 ? (
        <div className="rounded-[10px] bg-white p-5 border border-gray-200">
          {/* Keywords Form */}
          <div className="flex flex-col items-start gap-5 self-stretch">
            {/* Keywords Input */}
            <div className="flex w-full h-[67px] flex-col items-start gap-2 self-stretch">
              <label className="self-stretch text-promag-body font-inter text-sm font-medium">
                KeyWords
              </label>
              <div className="flex h-[42px] px-3.5 py-2.5 items-center gap-2.5 flex-shrink-0 self-stretch rounded-[5px] border border-promag-input-border bg-white">
                <input
                  type="text"
                  value={keywordsData}
                  onChange={(e) => setKeywordsData(e.target.value)}
                  className="text-promag-placeholder font-inter text-sm font-normal bg-transparent border-none outline-none flex-1 placeholder:text-promag-placeholder"
                  placeholder="Enter KeyWords"
                />
              </div>
            </div>

            {/* Button Box */}
            <div className="flex justify-end items-center gap-2.5 flex-1 self-stretch">
              <button
                type="button"
                onClick={currentStep > 1 ? onPrev : onCancel}
                className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded border border-promag-primary text-promag-body font-inter text-sm font-medium transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  handleKeywordsSave();
                  onSave();
                }}
                className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[10px] bg-white min-h-[320px] border border-gray-200" />
      )}
      ​
      {currentStep === 1 && (
        <>
          {/* Footer buttons */}
          <div className="flex justify-end items-center gap-2.5 pt-2.5">
            <button
              type="button"
              onClick={currentStep > 1 ? onPrev : onCancel}
              className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded border border-promag-primary text-promag-body font-inter text-sm font-medium transition-colors"
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
        </>
      )}
    </div>
  );
}
