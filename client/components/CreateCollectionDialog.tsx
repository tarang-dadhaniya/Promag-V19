import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { title: string; coverImage?: string }) => void;
  mode?: "create" | "edit";
  initialData?: { title: string; coverImage?: string } | null;
}

interface UploadedImage {
  name: string;
  size: number;
  dataUrl: string;
}

export function CreateCollectionDialog({ open, onOpenChange, onSave, mode = "create", initialData }: CreateCollectionDialogProps) {
  const [title, setTitle] = useState("");
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [initialCoverImage, setInitialCoverImage] = useState<string | undefined>(undefined);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Prefill when opening in edit mode
  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? "");
      setInitialCoverImage(initialData?.coverImage);
    } else {
      // reset when closed to avoid leaking state between usages
      setUploadedImage(null);
      setIsDragOver(false);
    }
  }, [open, initialData]);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert("Please select a PNG or JPEG image file.");
      return false;
    }

    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      alert("File size must be less than 8MB.");
      return false;
    }

    return true;
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (validateFile(file)) {
      try {
        const dataUrl = await convertFileToBase64(file);
        setUploadedImage({
          name: file.name,
          size: file.size,
          dataUrl,
        });
      } catch (error) {
        console.error('Error converting file to base64:', error);
        alert('Failed to process the image. Please try again.');
      }
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUploadedImage(null);
    setInitialCoverImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title for the collection.");
      return;
    }

    onSave({
      title: title.trim(),
      coverImage: uploadedImage?.dataUrl ?? initialCoverImage,
    });

    // Reset form
    setTitle("");
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancel = () => {
    if (mode === "create") setTitle("");
    setUploadedImage(null);
    setInitialCoverImage(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="flex w-full h-[50px] px-5 justify-between items-center border-b border-black/20">
          <DialogTitle className="text-black font-inter text-lg font-semibold">
            {mode === "edit" ? "Edit Collection" : "Add Collection"}
          </DialogTitle>
          <button 
            onClick={() => onOpenChange(false)}
            className="w-4 h-4 flex items-center justify-center text-[#FF5656] hover:text-[#FF5656]/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.30626 7.95596L15.7863 1.47596C15.9319 1.30592 16.008 1.08718 15.9993 0.863469C15.9907 0.639757 15.898 0.427545 15.7397 0.269239C15.5813 0.110933 15.3691 0.0181922 15.1454 0.00955117C14.9217 0.000910139 14.703 0.0770048 14.5329 0.222628L8.05293 6.70263L1.57293 0.213739C1.40288 0.0681158 1.18415 -0.00797811 0.960436 0.00066292C0.736724 0.00930395 0.524512 0.102043 0.366205 0.26035C0.207899 0.418656 0.115159 0.630868 0.106518 0.85458C0.0978767 1.07829 0.173971 1.29703 0.319595 1.46707L6.79959 7.95596L0.310706 14.436C0.217655 14.5156 0.142082 14.6137 0.0887276 14.724C0.0353736 14.8343 0.00539082 14.9544 0.000662382 15.0768C-0.00406606 15.1992 0.0165614 15.3213 0.0612499 15.4354C0.105938 15.5494 0.173724 15.653 0.26035 15.7397C0.346976 15.8263 0.450574 15.8941 0.564641 15.9387C0.678708 15.9834 0.800781 16.0041 0.923198 15.9993C1.04561 15.9946 1.16573 15.9646 1.27601 15.9113C1.38629 15.8579 1.48435 15.7823 1.56404 15.6893L8.05293 9.20929L14.5329 15.6893C14.703 15.8349 14.9217 15.911 15.1454 15.9024C15.3691 15.8937 15.5813 15.801 15.7397 15.6427C15.898 15.4844 15.9907 15.2722 15.9993 15.0485C16.008 14.8247 15.9319 14.606 15.7863 14.436L9.30626 7.95596Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex w-full flex-col gap-5 p-[30px]">
          {/* Title Field */}
          <div className="flex flex-col gap-2">
            <label className="text-black font-inter text-sm font-medium">
              Title
            </label>
            <div className="flex h-[42px] px-[14px] py-[10px] items-center gap-[10px] rounded-[5px] border border-[#DDD] bg-white">
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 text-black font-inter text-sm font-normal outline-none placeholder:text-black/50"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-black font-inter text-sm font-medium">
              Cover Image
            </label>
            
            <div 
              className={cn(
                "flex flex-col items-center gap-6 p-[30px] border border-dashed border-black/25 rounded-[10px] transition-all duration-300",
                isDragOver && "border-promag-primary bg-promag-primary/5"
              )}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileSelect}
                className="hidden"
              />

              {(uploadedImage || initialCoverImage) ? (
                /* Image Preview */
                <div className="relative">
                  <img
                    src={uploadedImage?.dataUrl ?? initialCoverImage}
                    alt="Collection cover preview"
                    className="w-[160px] h-[200px] object-cover rounded-[10px]"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-[#FF2525] rounded-full flex items-center justify-center hover:bg-[#FF2525]/90 transition-colors"
                  >
                    <svg className="flex flex-col items-start justify-start" width="24" height="24" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.89147 12.9834C7.73314 12.9834 7.5748 12.925 7.4498 12.8C7.20814 12.5584 7.20814 12.1584 7.4498 11.9167L12.1665 7.20005C12.4081 6.95838 12.8081 6.95838 13.0498 7.20005C13.2915 7.44172 13.2915 7.84172 13.0498 8.08338L8.33314 12.8C8.21647 12.925 8.0498 12.9834 7.89147 12.9834Z" fill="white"/>
                      <path d="M12.6081 12.9834C12.4498 12.9834 12.2915 12.925 12.1665 12.8L7.4498 8.08338C7.20814 7.84172 7.20814 7.44172 7.4498 7.20005C7.69147 6.95838 8.09147 6.95838 8.33314 7.20005L13.0498 11.9167C13.2915 12.1584 13.2915 12.5584 13.0498 12.8C12.9248 12.925 12.7665 12.9834 12.6081 12.9834Z" fill="white"/>
                    </svg>
                  </button>
                </div>
              ) : (
                /* Upload Area */
                <div className="flex flex-col items-center gap-6">
                  {/* Upload Icon */}
                  <div className="flex p-[10px] flex-col justify-center items-center gap-[10px] rounded-[10px] border-3 border-promag-primary">
                    <svg width="40" height="40" viewBox="0 0 47 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M31.5088 27.9976L23.5088 19.9976L15.5088 27.9976" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23.5088 19.9976V37.9976" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M40.2887 32.7775C42.2394 31.7141 43.7804 30.0313 44.6685 27.9948C45.5565 25.9583 45.7411 23.684 45.1931 21.5309C44.6451 19.3778 43.3957 17.4686 41.642 16.1044C39.8884 14.7403 37.7304 13.999 35.5087 13.9975H32.9887C32.3833 11.656 31.255 9.4822 29.6886 7.63951C28.1222 5.79683 26.1584 4.33323 23.9449 3.35874C21.7314 2.38426 19.3258 1.92424 16.9089 2.01329C14.4921 2.10234 12.1268 2.73813 9.99106 3.87286C7.85528 5.00759 6.00453 6.61173 4.57795 8.56469C3.15137 10.5176 2.18609 12.7686 1.75467 15.1483C1.32325 17.528 1.43692 19.9746 2.08714 22.304C2.73735 24.6335 3.90719 26.7853 5.50871 28.5975" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-black font-inter text-base font-semibold">
                      Drag and drop file here
                    </h3>
                    <p className="text-black/60 font-inter text-xs font-medium max-w-md">
                      The cover must be PNG or JPEG, up to 8 MB, 16:9 or 9:16 aspect ratio, with each side between 320 px and 3,840
                    </p>
                  </div>

                  {/* Select File Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Select File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex h-[60px] px-[30px] justify-end items-center gap-5 border-t border-black/20">
          <button
            onClick={handleCancel}
            className="flex h-[41px] px-5 py-3 justify-center items-center gap-[10px] rounded-[5px] bg-[#D9D9D9] text-black font-inter text-sm font-medium hover:bg-[#D9D9D9]/80 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className={cn(
              "flex h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary font-inter text-sm font-medium transition-colors",
              title.trim()
                ? "bg-promag-primary text-white hover:bg-promag-primary/90"
                : "bg-promag-primary/50 text-white/80 cursor-not-allowed"
            )}
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
