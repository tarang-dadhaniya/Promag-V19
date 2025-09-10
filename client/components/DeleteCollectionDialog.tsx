import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface DeleteCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  collectionName: string;
}

const AnimatedTrashIcon = () => (
  <div className="relative flex items-center justify-center w-16 h-16 mx-auto mb-4">
    <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse"></div>
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 text-red-500 animate-bounce"
    >
      <path
        d="M3 6H5H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 11V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export function DeleteCollectionDialog({
  open,
  onOpenChange,
  onConfirm,
  collectionName,
}: DeleteCollectionDialogProps) {
  const { t } = useTranslation();
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        {/* Header */}
        <div className="flex w-full h-[60px] px-6 justify-between items-center border-b border-black/10">
          <DialogTitle className="text-black font-inter text-lg font-semibold">
            {t("common.deleteCollection")}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="w-4 h-4 flex items-center justify-center text-[#FF5656] hover:text-[#FF5656]/80 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.30626 7.95596L15.7863 1.47596C15.9319 1.30592 16.008 1.08718 15.9993 0.863469C15.9907 0.639757 15.898 0.427545 15.7397 0.269239C15.5813 0.110933 15.3691 0.0181922 15.1454 0.00955117C14.9217 0.000910139 14.703 0.0770048 14.5329 0.222628L8.05293 6.70263L1.57293 0.213739C1.40288 0.0681158 1.18415 -0.00797811 0.960436 0.00066292C0.736724 0.00930395 0.524512 0.102043 0.366205 0.26035C0.207899 0.418656 0.115159 0.630868 0.106518 0.85458C0.0978767 1.07829 0.173971 1.29703 0.319595 1.46707L6.79959 7.95596L0.310706 14.436C0.217655 14.5156 0.142082 14.6137 0.0887276 14.724C0.0353736 14.8343 0.00539082 14.9544 0.000662382 15.0768C-0.00406606 15.1992 0.0165614 15.3213 0.0612499 15.4354C0.105938 15.5494 0.173724 15.653 0.26035 15.7397C0.346976 15.8263 0.450574 15.8941 0.564641 15.9387C0.678708 15.9834 0.800781 16.0041 0.923198 15.9993C1.04561 15.9946 1.16573 15.9646 1.27601 15.9113C1.38629 15.8579 1.48435 15.7823 1.56404 15.6893L8.05293 9.20929L14.5329 15.6893C14.703 15.8349 14.9217 15.911 15.1454 15.9024C15.3691 15.8937 15.5813 15.801 15.7397 15.6427C15.898 15.4844 15.9907 15.2722 15.9993 15.0485C16.008 14.8247 15.9319 14.606 15.7863 14.436L9.30626 7.95596Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center gap-6 p-8 text-center">
          {/* Animated Icon */}
          <AnimatedTrashIcon />

          {/* Warning Message */}
          <div className="flex flex-col gap-3">
            <h3 className="text-black font-inter text-xl font-semibold">
              {t("dialog.areYouSure")}
            </h3>
            <div className="max-w-md">
              <p className="text-black/70 font-inter text-sm leading-relaxed">
                {t("dialog.deleteCollectionDescription", {
                  name: collectionName,
                })}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 w-full max-w-sm">
            <button
              onClick={handleCancel}
              className="flex-1 h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-gray-300 bg-white text-gray-700 font-inter text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-red-500 bg-red-500 text-white font-inter text-sm font-medium hover:bg-red-600 transition-colors"
            >
              {t("common.deleteCollection")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
