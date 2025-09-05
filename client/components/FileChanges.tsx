import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface FileChangesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicationData?: any;
  onSave?: (data: any) => void;
}

interface FileData {
  file: File | null;
  coverImage: File | null;
  importNativeEnrichments: boolean;
  importTableOfContents: boolean;
}

const stepperSteps = [
  { number: "01", active: true },
  { number: "02", active: true },
  { number: "03", active: false },
  { number: "04", active: false },
];

export function FileChanges({ open, onOpenChange, publicationData, onSave }: FileChangesProps) {
  const [fileData, setFileData] = useState<FileData>({
    file: null,
    coverImage: null,
    importNativeEnrichments: false,
    importTableOfContents: false,
  });

  const [isDragging, setIsDragging] = useState({ file: false, cover: false });

  const handleFileChange = (type: 'file' | 'coverImage', file: File | null) => {
    setFileData(prev => ({ ...prev, [type]: file }));
  };

  const handleCheckboxChange = (field: keyof FileData, checked: boolean) => {
    setFileData(prev => ({ ...prev, [field]: checked }));
  };

  const handleDragOver = (e: React.DragEvent, type: 'file' | 'cover') => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e: React.DragEvent, type: 'file' | 'cover') => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e: React.DragEvent, type: 'file' | 'cover') => {
    e.preventDefault();
    setIsDragging(prev => ({ ...prev, [type]: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const fieldName = type === 'file' ? 'file' : 'coverImage';
      handleFileChange(fieldName, files[0]);
    }
  };

  const handleSave = () => {
    onSave?.(fileData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-[1680px] max-h-[90vh] mx-4 bg-[#F5F5F5] rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-white shadow-sm">
          <h2 className="text-promag-body font-manrope text-base font-semibold">File changes</h2>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-5">
            <div className="text-black font-inter text-sm font-medium">
              <span className="text-black/60">Collections / Publications </span>
              <span className="text-black">/ Selected Publication Name</span>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-center items-center gap-2.5 mb-5">
            {stepperSteps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "flex w-10 h-10 items-center justify-center rounded-full border-2 text-center font-medium",
                  step.active 
                    ? "border-promag-primary bg-promag-primary text-white" 
                    : "border-[#ABB7C2] text-[#ABB7C2]"
                )}>
                  {step.number}
                </div>
                {index < stepperSteps.length - 1 && (
                  <div className={cn(
                    "w-[300px] h-[3px] mx-2.5",
                    index === 0 ? "bg-promag-primary" : "bg-[#ABB7C2]"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-10">
            {/* File Upload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
              {/* File Upload */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-black">File</Label>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    isDragging.file ? "border-promag-primary bg-promag-primary/5" : "border-black/50"
                  )}
                  onDragOver={(e) => handleDragOver(e, 'file')}
                  onDragLeave={(e) => handleDragLeave(e, 'file')}
                  onDrop={(e) => handleDrop(e, 'file')}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileChange('file', file);
                    };
                    input.click();
                  }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex p-5 items-center justify-center border-2 border-black rounded-lg">
                      <svg width="48" height="45" viewBox="0 0 48 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.0078 30.4976L24.0078 22.4976L16.0078 30.4976" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24.0078 22.4976V40.4976" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M40.7887 35.2775C42.7394 34.2141 44.2804 32.5313 45.1685 30.4948C46.0565 28.4583 46.2411 26.184 45.6931 24.0309C45.1451 21.8778 43.8957 19.9686 42.142 18.6044C40.3884 17.2403 38.2304 16.499 36.0087 16.4975H33.4887C32.8833 14.156 31.755 11.9822 30.1886 10.1395C28.6222 8.29683 26.6584 6.83323 24.4449 5.85874C22.2314 4.88426 19.8258 4.42424 17.4089 4.51329C14.9921 4.60234 12.6268 5.23813 10.4911 6.37286C8.35528 7.50759 6.50453 9.11173 5.07795 11.0647C3.65137 13.0176 2.68609 15.2686 2.25467 17.6483C1.82325 20.028 1.93692 22.4746 2.58714 24.804C3.23735 27.1335 4.40719 29.2853 6.00871 31.0975" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M32.0078 30.4976L24.0078 22.4976L16.0078 30.4976" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-black font-inter text-base font-semibold mb-2">
                        Drag and drop file here
                      </div>
                      <div className="text-black/60 font-inter text-sm">
                        Browse Files
                      </div>
                    </div>
                  </div>
                </div>
                {fileData.file && (
                  <div className="text-sm text-promag-primary mt-2">
                    Selected: {fileData.file.name}
                  </div>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium text-black">Cover Image</Label>
                <div
                  className={cn(
                    "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                    isDragging.cover ? "border-promag-primary bg-promag-primary/5" : "border-black/50"
                  )}
                  onDragOver={(e) => handleDragOver(e, 'cover')}
                  onDragLeave={(e) => handleDragLeave(e, 'cover')}
                  onDrop={(e) => handleDrop(e, 'cover')}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/png,image/jpeg';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileChange('coverImage', file);
                    };
                    input.click();
                  }}
                >
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex p-5 items-center justify-center border-2 border-black rounded-lg">
                      <svg width="48" height="44" viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M32.0078 29.9976L24.0078 21.9976L16.0078 29.9976" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M24.0078 21.9976V39.9976" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M40.7887 34.7775C42.7394 33.7141 44.2804 32.0313 45.1685 29.9948C46.0565 27.9583 46.2411 25.684 45.6931 23.5309C45.1451 21.3778 43.8957 19.4686 42.142 18.1044C40.3884 16.7403 38.2304 15.999 36.0087 15.9975H33.4887C32.8833 13.656 31.755 11.4822 30.1886 9.63951C28.6222 7.79683 26.6584 6.33323 24.4449 5.35874C22.2314 4.38426 19.8258 3.92424 17.4089 4.01329C14.9921 4.10234 12.6268 4.73813 10.4911 5.87286C8.35528 7.00759 6.50453 8.61173 5.07795 10.5647C3.65137 12.5176 2.68609 14.7686 2.25467 17.1483C1.82325 19.528 1.93692 21.9746 2.58714 24.304C3.23735 26.6335 4.40719 28.7853 6.00871 30.5975" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M32.0078 29.9976L24.0078 21.9976L16.0078 29.9976" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="text-center">
                      <div className="text-black font-inter text-base font-semibold mb-2">
                        Drag and drop file here
                      </div>
                      <div className="text-black/60 font-inter text-sm text-center">
                        The cover must be PNG or JPEG, up to 8 MB, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840 px.
                      </div>
                    </div>
                  </div>
                </div>
                {fileData.coverImage && (
                  <div className="text-sm text-promag-primary mt-2">
                    Selected: {fileData.coverImage.name}
                  </div>
                )}
              </div>
            </div>

            {/* Options Section */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="importNativeEnrichments"
                  checked={fileData.importNativeEnrichments}
                  onCheckedChange={(checked) => handleCheckboxChange('importNativeEnrichments', !!checked)}
                />
                <Label htmlFor="importNativeEnrichments" className="text-sm text-promag-body">
                  Import native enrichments (old enrichments will be deleted if present)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="importTableOfContents"
                  checked={fileData.importTableOfContents}
                  onCheckedChange={(checked) => handleCheckboxChange('importTableOfContents', !!checked)}
                />
                <Label htmlFor="importTableOfContents" className="text-sm text-promag-body">
                  Import table of contents (removing existing index)
                </Label>
              </div>
            </div>

            {/* Info Text */}
            <div className="mb-5">
              <p className="text-promag-body font-inter text-sm mb-3">
                Upload your PDF file here to convert it into a digital publication. It may take a while for the process to complete. You can learn more about its status under My Publications.
              </p>
              
              <div className="text-promag-body font-inter text-sm leading-6 mb-3">
                Your PDF must be v1.0-1.5 and less than 300 Mb / 1000 pages.<br/>
                Do not simulate a double-page spread on one page.<br/>
                Get the best results by making every page the same size.
              </div>

              <p className="text-red-500 font-inter text-sm font-semibold">
                Note: Don't use Promag to upload documents you do not have permission or own the copyright too.
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={handleSave}
                className="bg-promag-primary hover:bg-promag-primary/90"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
