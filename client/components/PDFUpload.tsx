import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  name: string;
  size: number;
  file?: File | null;
}

interface PDFUploadProps {
  onFileUpload?: (file: UploadedFile | null) => void;
  className?: string;
  initialFile?: { name: string; size: number } | null;
}

type UploadStatus = 'idle' | 'dragover' | 'uploading' | 'completed' | 'error';

const UploadIcon = () => (
  <svg width="48" height="44" viewBox="0 0 48 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32.0088 29.9976L24.0088 21.9976L16.0088 29.9976" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24.0088 21.9976V39.9976" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M40.7887 34.7775C42.7394 33.7141 44.2804 32.0313 45.1685 29.9948C46.0565 27.9583 46.2411 25.684 45.6931 23.5309C45.1451 21.3778 43.8957 19.4686 42.142 18.1044C40.3884 16.7403 38.2304 15.999 36.0087 15.9975H33.4887C32.8833 13.656 31.755 11.4822 30.1886 9.63951C28.6222 7.79683 26.6584 6.33323 24.4449 5.35874C22.2314 4.38426 19.8258 3.92424 17.4089 4.01329C14.9921 4.10234 12.6268 4.73813 10.4911 5.87286C8.35528 7.00759 6.50453 8.61173 5.07795 10.5647C3.65137 12.5176 2.68609 14.7686 2.25467 17.1483C1.82325 19.528 1.93692 21.9746 2.58714 24.304C3.23735 26.6335 4.40719 28.7853 6.00871 30.5975" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32.0088 29.9976L24.0088 21.9976L16.0088 29.9976" stroke="#722555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="14" stroke="#722555" strokeWidth="2"/>
    <path d="M16 8v8l4 4" stroke="#722555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" fill="#10B981"/>
    <path d="M16 24l6 6 12-12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
    <circle cx="16" cy="16" r="12" stroke="#722555" strokeWidth="3" strokeOpacity="0.3"/>
    <path d="M28 16c0-6.627-5.373-12-12-12" stroke="#722555" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

const FileIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_72_3407)">
      <path d="M9.75293 11C10.0484 11 10.341 10.9418 10.614 10.8287C10.887 10.7157 11.135 10.5499 11.3439 10.341C11.5529 10.1321 11.7186 9.88402 11.8317 9.61104C11.9447 9.33806 12.0029 9.04547 12.0029 8.75C12.0029 8.45453 11.9447 8.16194 11.8317 7.88896C11.7186 7.61598 11.5529 7.36794 11.3439 7.15901C11.135 6.95008 10.887 6.78434 10.614 6.67127C10.341 6.5582 10.0484 6.5 9.75293 6.5C9.15619 6.5 8.5839 6.73705 8.16194 7.15901C7.73998 7.58097 7.50293 8.15326 7.50293 8.75C7.50293 9.34674 7.73998 9.91903 8.16194 10.341C8.5839 10.7629 9.15619 11 9.75293 11V11Z" fill="#722555"/>
      <path d="M21 21.5C21 22.2956 20.6839 23.0587 20.1213 23.6213C19.5587 24.1839 18.7956 24.5 18 24.5H6C5.20435 24.5 4.44129 24.1839 3.87868 23.6213C3.31607 23.0587 3 22.2956 3 21.5V3.5C3 2.70435 3.31607 1.94129 3.87868 1.37868C4.44129 0.816071 5.20435 0.5 6 0.5L14.25 0.5L21 7.25V21.5ZM6 2C5.60218 2 5.22064 2.15804 4.93934 2.43934C4.65804 2.72064 4.5 3.10218 4.5 3.5V18.5L7.836 15.164C7.95422 15.0461 8.10843 14.9709 8.27417 14.9506C8.43992 14.9302 8.60773 14.9657 8.751 15.0515L12 17L15.2355 12.47C15.2988 12.3815 15.3806 12.3078 15.4753 12.254C15.5699 12.2003 15.6751 12.1678 15.7836 12.1588C15.8921 12.1498 16.0012 12.1645 16.1034 12.202C16.2056 12.2394 16.2985 12.2986 16.3755 12.3755L19.5 15.5V7.25H16.5C15.9033 7.25 15.331 7.01295 14.909 6.59099C14.4871 6.16903 14.25 5.59674 14.25 5V2H6Z" fill="#722555"/>
    </g>
    <defs>
      <clipPath id="clip0_72_3407">
        <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
      </clipPath>
    </defs>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.62676 8.49995L11.8668 5.25995C11.9396 5.17493 11.9776 5.06556 11.9733 4.95371C11.969 4.84185 11.9226 4.73575 11.8435 4.65659C11.7643 4.57744 11.6582 4.53107 11.5463 4.52675C11.4345 4.52243 11.3251 4.56048 11.2401 4.63329L8.0001 7.87329L4.7601 4.62884C4.67507 4.55603 4.56571 4.51798 4.45385 4.5223C4.34199 4.52662 4.23589 4.57299 4.15674 4.65215C4.07758 4.7313 4.03121 4.83741 4.02689 4.94926C4.02257 5.06112 4.06062 5.17049 4.13343 5.25551L7.37343 8.49995L4.12899 11.74C4.08246 11.7798 4.04467 11.8288 4.018 11.884C3.99132 11.9391 3.97633 11.9992 3.97396 12.0604C3.9716 12.1216 3.98191 12.1826 4.00426 12.2397C4.0266 12.2967 4.06049 12.3485 4.10381 12.3918C4.14712 12.4351 4.19892 12.469 4.25595 12.4913C4.31299 12.5137 4.37402 12.524 4.43523 12.5216C4.49644 12.5193 4.5565 12.5043 4.61164 12.4776C4.66678 12.4509 4.71581 12.4131 4.75565 12.3666L8.0001 9.12662L11.2401 12.3666C11.3251 12.4394 11.4345 12.4775 11.5463 12.4732C11.6582 12.4688 11.7643 12.4225 11.8435 12.3433C11.9226 12.2642 11.969 12.1581 11.9733 12.0462C11.9776 11.9343 11.9396 11.825 11.8668 11.74L8.62676 8.49995Z" fill="white"/>
  </svg>
);

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function formatTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
}

export function PDFUpload({ onFileUpload, className, initialFile }: PDFUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(formatTime());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const removeBtnRef = useRef<HTMLButtonElement>(null);
  const checkIconRef = useRef<HTMLDivElement>(null);
  const [orbVisible, setOrbVisible] = useState(false);
  const [orbStyle, setOrbStyle] = useState<{ left: number; top: number; size: number; opacity?: number }>({ left: 0, top: 0, size: 0, opacity: 1 });
  const [btnPulse, setBtnPulse] = useState(false);
  const [checkPulse, setCheckPulse] = useState(false);

  // helpers to avoid TypeScript narrowing inside switch branches
  const isUploading = uploadStatus === 'uploading';
  const isDragover = uploadStatus === 'dragover';
  const isCompleted = uploadStatus === 'completed';

  // Hydrate from initialFile if provided (persistence)
  useEffect(() => {
    if (initialFile && !uploadedFile) {
      setUploadedFile({ name: initialFile.name, size: initialFile.size, file: null });
      setUploadStatus('completed');
    }
  }, [initialFile]);

  // Update time every second when dragging
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (uploadStatus === 'dragover') {
      interval = setInterval(() => {
        setCurrentTime(formatTime());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [uploadStatus]);

  const validateFile = (file: File): boolean => {
    if (file.type !== "application/pdf") {
      alert("Please select a PDF file.");
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 10MB.");
      return false;
    }

    return true;
  };

  const simulateUpload = useCallback(async (file: File) => {
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setUploadProgress(i);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setUploadStatus('completed');

    const fileData: UploadedFile = {
      name: file.name,
      size: file.size,
      file,
    };
    setUploadedFile(fileData);
    onFileUpload?.(fileData);
  }, [onFileUpload]);

  const handleFileUpload = useCallback((file: File) => {
    if (validateFile(file)) {
      simulateUpload(file);
    }
  }, [simulateUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadStatus('idle');
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (uploadStatus === 'idle' || uploadStatus === 'completed') {
      setUploadStatus('dragover');
      setCurrentTime(formatTime());
    }
  }, [uploadStatus]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (uploadStatus === 'dragover') {
      setUploadStatus(uploadedFile ? 'completed' : 'idle');
    }
  }, [uploadStatus, uploadedFile]);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setUploadProgress(0);
    onFileUpload?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onFileUpload]);

  const handleButtonClick = useCallback(() => {
    if (uploadStatus !== 'uploading') {
      fileInputRef.current?.click();
    }
  }, [uploadStatus]);

  // On complete, animate orb from center to the check icon (fallback: remove button)
  useEffect(() => {
    if (uploadStatus !== 'completed') return;

    const container = containerRef.current;
    if (!container) return;

    const run = (attempt = 0) => {
      const target = checkIconRef.current || removeBtnRef.current;
      if (!target) {
        if (attempt < 8) {
          setTimeout(() => run(attempt + 1), 80);
        }
        return;
      }

      const cRect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();

      const centerX = cRect.width / 2;
      const centerY = cRect.height / 2;
      const startSize = Math.min(cRect.width, cRect.height, 220);

      setOrbVisible(true);
      setOrbStyle({
        left: centerX - startSize / 2,
        top: centerY - startSize / 2,
        size: startSize,
        opacity: 1,
      });

      // next frame -> move to target center and shrink
      requestAnimationFrame(() => {
        const tCenterX = tRect.left - cRect.left + tRect.width / 2;
        const tCenterY = tRect.top - cRect.top + tRect.height / 2;
        const endSize = Math.max(18, Math.min(tRect.width, tRect.height));
        setOrbStyle({
          left: tCenterX - endSize / 2,
          top: tCenterY - endSize / 2,
          size: endSize,
          opacity: 0.95,
        });
      });
    };

    // kick it off slightly after render to ensure layout is ready
    const t = setTimeout(() => run(), 60);
    return () => clearTimeout(t);
  }, [uploadStatus]);

  const renderUploadArea = () => {
    switch (uploadStatus) {
      case 'dragover':
        return (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="relative flex items-center justify-center">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="orbit">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="flex p-5 flex-col items-center gap-2.5 rounded-[10px] border-3 border-promag-primary animate-bounce-scale animate-icon-bob bg-white/60 backdrop-blur-sm shadow-sm">
                <ClockIcon />
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <h3 className="text-promag-primary font-inter text-lg font-bold animate-pulse">
                Drop your file here
              </h3>
              <div className="flex flex-col items-center gap-2">
                <p className="text-black/60 font-inter text-sm font-medium">
                  Release to upload your PDF file
                </p>
                <div className="text-promag-primary font-inter text-2xl font-bold font-mono">
                  {currentTime}
                </div>
              </div>
            </div>
          </div>
        );

      case 'uploading':
        return (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <div className="flex p-5 flex-col items-center gap-2.5 rounded-[10px] border-3 border-promag-primary">
              <LoadingSpinner />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <h3 className="text-promag-primary font-inter text-lg font-bold">
                Uploading...
              </h3>
              <div className="w-full max-w-[300px]">
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-promag-primary h-2 rounded-full transition-all duration-300 ease-out progress-shimmer"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-black/60 font-inter text-sm font-medium">
                  {uploadProgress}% uploaded
                </p>
              </div>
            </div>
          </div>
        );

      case 'completed':
        return (
          <div className="flex flex-col items-center gap-6 animate-fade-in animate-pop">
            <div ref={checkIconRef} className={cn("flex p-5 flex-col items-center gap-2.5", checkPulse && "btn-pulse ring-2 ring-emerald-400/40 rounded-full")}>
              <CheckIcon />
            </div>
            <div className="flex flex-col items-center gap-4 text-center">
              <h3 className="text-green-600 font-inter text-lg font-bold">
                Upload Completed!
              </h3>
              <p className="text-black/60 font-inter text-sm font-medium">
                Your file has been successfully uploaded
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <div className="flex p-3 sm:p-5 flex-col items-center gap-2.5 rounded-[10px] border-3 border-promag-primary/40">
              <div className="scale-75 sm:scale-100">
                <UploadIcon />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 sm:gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h3 className="text-black font-inter text-sm sm:text-base font-semibold">
                  Select a file or drag and drop here
                </h3>
                <p className="text-black/60 font-inter text-xs sm:text-sm font-medium">
                  PDF, file size no more than 10MB
                </p>
              </div>

              <button
                onClick={handleButtonClick}
                disabled={isUploading}
                className="flex h-[38px] sm:h-[42px] px-4 sm:px-5 py-2 sm:py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-xs sm:text-sm font-medium hover:bg-promag-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 1V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 6H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {uploadedFile ? 'Update File' : 'Upload File'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn("flex w-full justify-center items-center bg-white rounded-[10px]", className)}>
      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden will-change-transform flex w-full p-6 sm:p-10 lg:p-14 flex-col justify-center items-center gap-4 sm:gap-6 h-full",
          "border border-dashed border-black/25 rounded-[10px] min-h-[250px] sm:min-h-[330px] transition-all duration-300",
          uploadStatus === 'dragover' && "border-promag-primary bg-promag-primary/5 animate-pulse-border ring-2 ring-promag-primary/20 scale-[1.01] sm:scale-[1.02]",
          uploadStatus === 'uploading' && "border-promag-primary bg-promag-primary/5 ring-1 ring-promag-primary/10",
          uploadStatus === 'completed' && "border-green-500 bg-green-50 animate-pop"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {renderUploadArea()}

        {uploadStatus === 'dragover' && (
          <>
            <div className="pointer-events-none absolute -inset-6 rounded-[14px] animate-border-glow" />
          </>
        )}

        {orbVisible && (
          <div
            className="upload-orb"
            style={{ left: orbStyle.left, top: orbStyle.top, width: orbStyle.size, height: orbStyle.size, opacity: orbStyle.opacity }}
            onTransitionEnd={() => {
              setOrbVisible(false);
              if (checkIconRef.current) {
                setCheckPulse(true);
                setTimeout(() => setCheckPulse(false), 400);
              } else {
                setBtnPulse(true);
                setTimeout(() => setBtnPulse(false), 400);
              }
            }}
            aria-hidden
          />
        )}

        {/* Uploaded File Display */}
        {uploadedFile && uploadStatus === 'completed' && (
          <div className="w-full max-w-[568px] flex flex-col gap-2.5 animate-fade-in">
            <p className="text-black font-inter text-sm font-normal">File uploaded successfully</p>

            <div className="flex h-[50px] sm:h-[58px] flex-col items-start gap-2 rounded border border-green-400 bg-green-50 relative">
              <div className="flex w-full justify-center items-center flex-1 px-3 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <FileIcon />
                  </div>
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-black font-inter text-xs font-medium truncate">
                        {uploadedFile.name}
                      </span>
                      <span className="text-black/70 font-inter text-[10px] font-medium flex-shrink-0">
                        {formatFileSize(uploadedFile.size)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  ref={removeBtnRef}
                  onClick={handleRemoveFile}
                  className={cn("absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-promag-error rounded-full flex items-center justify-center hover:bg-promag-error/90 transition-colors", btnPulse && "btn-pulse ring-2 ring-emerald-400/40")}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
