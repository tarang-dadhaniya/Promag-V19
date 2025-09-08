import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FileChangesFormData {
  file?: File | null;
  coverImage?: File | null;
  importNativeEnrichments: boolean;
  importTableOfContents: boolean;
}

interface FileChangesFormProps {
  onSave: (data: FileChangesFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<FileChangesFormData>;
  className?: string;
}

export function FileChangesForm({
  onSave,
  onCancel,
  initialData,
  className,
}: FileChangesFormProps) {
  const [file, setFile] = useState<File | null>(initialData?.file || null);
  const [coverImage, setCoverImage] = useState<File | null>(
    initialData?.coverImage || null
  );
  const [importNativeEnrichments, setImportNativeEnrichments] = useState(
    initialData?.importNativeEnrichments || false
  );
  const [importTableOfContents, setImportTableOfContents] = useState(
    initialData?.importTableOfContents || false
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "file" | "cover"
  ) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (type === "file") {
        setFile(selectedFile);
      } else {
        setCoverImage(selectedFile);
      }
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
    type: "file" | "cover"
  ) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (type === "file") {
        setFile(droppedFile);
      } else {
        setCoverImage(droppedFile);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleSave = () => {
    onSave({
      file,
      coverImage,
      importNativeEnrichments,
      importTableOfContents,
    });
  };

  const renderUploadArea = (
    type: "file" | "cover",
    title: string,
    description: string,
    currentFile: File | null,
    inputRef: React.RefObject<HTMLInputElement>
  ) => (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="text-sm font-medium text-black font-inter">{title}</div>
      <div className="flex flex-col items-center gap-7 self-stretch rounded-[10px] bg-white">
        <div
          className="flex flex-1 self-stretch flex-col justify-center items-center gap-6 p-10 rounded-[10px] border-2 border-dashed border-black/50 cursor-pointer hover:border-black/70 transition-colors"
          onDrop={(e) => handleDrop(e, type)}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-[84px] p-5 flex-col justify-between items-center rounded-[10px] border-3 border-black">
              <svg
                width="48"
                height="44"
                viewBox="0 0 48 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex h-11 flex-col justify-center items-center gap-2.5 flex-shrink-0"
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
                <div className="text-black font-inter text-base font-semibold">
                  {currentFile ? currentFile.name : "Drag and drop file here"}
                </div>
                <div className="text-black/60 text-center font-inter text-sm font-medium">
                  {description}
                </div>
              </div>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => handleFileUpload(e, type)}
            accept={type === "file" ? ".pdf" : "image/*"}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-5 self-stretch rounded-[10px] bg-white",
        className
      )}
    >
      <div className="flex pt-10 px-10 pb-5 flex-col items-start gap-5 self-stretch">
        {/* File Upload Areas */}
        <div className="flex w-full justify-between items-center">
          {renderUploadArea(
            "file",
            "File",
            "Browse Files",
            file,
            fileInputRef
          )}
          {renderUploadArea(
            "cover",
            "Cover Image",
            "The cover must be PNG or JPEG, up to 8 MB, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.",
            coverImage,
            coverInputRef
          )}
        </div>

        {/* Import Options */}
        <div className="flex flex-col items-start gap-3">
          {/* Import native enrichments checkbox */}
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div
                className={cn(
                  "w-[18px] h-[18px] rounded-[3px] border border-[#B4B4B4] bg-white flex items-center justify-center cursor-pointer",
                  importNativeEnrichments && "bg-promag-primary border-promag-primary"
                )}
                onClick={() => setImportNativeEnrichments(!importNativeEnrichments)}
              >
                {importNativeEnrichments && (
                  <svg
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4.5L4.5 8L11 1.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-[#212121] font-inter text-sm font-medium">
                Import native enrichments (old enrichments will be deleted if present)
              </div>
            </div>
          </div>

          {/* Import table of contents checkbox */}
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div
                className={cn(
                  "w-[18px] h-[18px] rounded-[3px] border border-[#B4B4B4] bg-white flex items-center justify-center cursor-pointer",
                  importTableOfContents && "bg-promag-primary border-promag-primary"
                )}
                onClick={() => setImportTableOfContents(!importTableOfContents)}
              >
                {importTableOfContents && (
                  <svg
                    width="12"
                    height="9"
                    viewBox="0 0 12 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 4.5L4.5 8L11 1.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 text-[#212121] font-inter text-sm font-medium">
                Import table of contents (removing existing index)!
              </div>
            </div>
          </div>

          {/* Description text */}
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div className="flex-1 text-[#212121] font-inter text-sm font-medium">
                Upload your PDF file here to convert it into a digital publication. It may take a while for the process to complete. You can learn more about its status under My Publications.
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="flex w-[440px] h-[72px] justify-center items-center">
            <div className="w-[440px] h-[102px] flex-shrink-0 text-[#212121] font-inter text-sm font-medium leading-6">
              Your PDF must be v1.0-1.5 and less than 300 Mb / 1000 pages.
              <br />
              Do not simulate a double-page spread on one page.
              <br />
              Get the best results by making every page the same size.
            </div>
          </div>

          {/* Copyright notice */}
          <div className="flex w-full flex-col items-start gap-2">
            <div className="flex justify-center items-center gap-2 self-stretch">
              <div className="flex-1 text-[#FF3A3A] font-inter text-sm font-semibold">
                Note: Don't use Promag to upload documents you do not have permission or own the copyright too.
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end items-center gap-2.5 self-stretch">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-gray-300 bg-gray-100 text-gray-700 font-inter text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
