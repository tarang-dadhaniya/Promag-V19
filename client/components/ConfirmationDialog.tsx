import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "delete" | "clone";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  type,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  const isDelete = type === "delete";

  const config = {
    delete: {
      title: "Confirmation",
      message: "Are you sure you want to remove this publication?",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5Z"
            stroke="#212121"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 12V9"
            stroke="#212121"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 6H9.00708"
            stroke="#212121"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    clone: {
      title: "Cloning Confirmation",
      message: "Are you sure you want to clone this publication?",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 6.75H8.25C7.42157 6.75 6.75 7.42157 6.75 8.25V15C6.75 15.8284 7.42157 16.5 8.25 16.5H15C15.8284 16.5 16.5 15.8284 16.5 15V8.25C16.5 7.42157 15.8284 6.75 15 6.75Z"
            stroke="#212121"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3.75 11.25H3C2.60218 11.25 2.22064 11.092 1.93934 10.8107C1.65804 10.5294 1.5 10.1478 1.5 9.75V3C1.5 2.60218 1.65804 2.22064 1.93934 1.93934C2.22064 1.65804 2.60218 1.5 3 1.5H9.75C10.1478 1.5 10.5294 1.65804 10.8107 1.93934C11.092 2.22064 11.25 2.60218 11.25 3V3.75"
            stroke="#212121"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  };

  const currentConfig = config[type];

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0",
          isDelete ? "sm:max-w-[400px]" : "sm:max-w-[600px]",
        )}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-5 border-b border-black/20">
          <div className="flex items-center gap-2">
            {currentConfig.icon}
            <DialogTitle className="text-lg font-semibold text-promag-body">
              {currentConfig.title}
            </DialogTitle>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 5L15 15"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </DialogHeader>

        {/* Content */}
        <div className="px-5 py-2.5">
          <p className="text-sm font-medium text-promag-body">
            {currentConfig.message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2.5 p-5 border-t border-black/20">
          <button
            onClick={handleCancel}
            className="px-5 py-3 rounded bg-gray-300 text-promag-body text-sm font-medium hover:bg-gray-400 transition-colors flex-1 sm:flex-initial"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-3 rounded bg-promag-primary text-white text-sm font-medium hover:bg-promag-primary/90 transition-colors border border-promag-primary flex-1 sm:flex-initial"
          >
            Yes
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
