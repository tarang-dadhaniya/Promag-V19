import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl?: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  shareUrl = "https://example.com/share",
}: ShareDialogProps) {
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [accessType, setAccessType] = useState<
    "anyone" | "link" | "choose" | "password"
  >("anyone");
  const [pendingAccessType, setPendingAccessType] =
    useState<typeof accessType>(accessType);

  const copyToClipboard = async () => {
    const text = shareUrl;
    // Try modern Clipboard API first when available & allowed
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        toast.success("Link copied to clipboard");
        return;
      }
      throw new Error("Clipboard API unavailable");
    } catch (err) {
      // Fallback: use a temporary textarea and execCommand("copy")
      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (successful) {
          toast.success("Link copied to clipboard");
          return;
        }
        throw new Error("execCommand copy failed");
      } catch (fallbackErr) {
        // Final fallback: show prompt so user can copy manually without errors
        try {
          window.prompt("Copy link", text);
          toast.message("Copy the link shown in the prompt");
        } catch {
          toast.error("Unable to copy. Please copy the link manually.");
        }
      }
    }
  };

  const handlePrivacyChange = (type: typeof accessType) => {
    setPendingAccessType(type);
  };

  const getAccessText = () => {
    switch (accessType) {
      case "anyone":
        return {
          title: "Anyone",
          description:
            "Anyone on the internet can find and access. Search engine indexing will be enabled.",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7">
                <path
                  d="M10.0003 18.3333C14.6027 18.3333 18.3337 14.6023 18.3337 9.99996C18.3337 5.39759 14.6027 1.66663 10.0003 1.66663C5.39795 1.66663 1.66699 5.39759 1.66699 9.99996C1.66699 14.6023 5.39795 18.3333 10.0003 18.3333Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1.66699 10H18.3337"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.0003 1.66663C12.0847 3.94859 13.2693 6.90999 13.3337 9.99996C13.2693 13.0899 12.0847 16.0513 10.0003 18.3333C7.91593 16.0513 6.73136 13.0899 6.66699 9.99996C6.73136 6.90999 7.91593 3.94859 10.0003 1.66663Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          ),
        };
      case "link":
        return {
          title: "Anyone with the link",
          description:
            "Anyone who has the link can access. Search engine indexing will be turned off.",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7">
                <path
                  d="M12.6667 6H15.1667C15.7138 6 16.2557 6.10777 16.7612 6.31717C17.2667 6.52656 17.726 6.83348 18.1129 7.22039C18.4999 7.6073 18.8068 8.06663 19.0162 8.57215C19.2256 9.07768 19.3333 9.61949 19.3333 10.1667C19.3333 10.7138 19.2256 11.2557 19.0162 11.7612C18.8068 12.2667 18.4999 12.726 18.1129 13.1129C17.726 13.4999 17.2667 13.8068 16.7612 14.0162C16.2557 14.2256 15.7138 14.3333 15.1667 14.3333H12.6667M7.66667 14.3333H5.16667C4.61949 14.3333 4.07768 14.2256 3.57215 14.0162C3.06663 13.8068 2.6073 13.4999 2.22039 13.1129C1.43899 12.3315 1 11.2717 1 10.1667C1 9.0616 1.43899 8.00179 2.22039 7.22039C3.00179 6.43899 4.0616 6 5.16667 6H7.66667"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.66699 10H13.3337"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          ),
        };
      case "choose":
        return {
          title: "Only people I choose",
          description:
            "Only people on the access list can access. Search engine indexing will be turned off.",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7">
                <path
                  d="M14.1663 17.5V15.8333C14.1663 14.9493 13.8152 14.1014 13.19 13.4763C12.5649 12.8512 11.7171 12.5 10.833 12.5H4.16634C3.28229 12.5 2.43444 12.8512 1.80932 13.4763C1.1842 14.1014 0.833008 14.9493 0.833008 15.8333V17.5"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.50033 9.16667C9.34127 9.16667 10.8337 7.67428 10.8337 5.83333C10.8337 3.99238 9.34127 2.5 7.50033 2.5C5.65938 2.5 4.16699 3.99238 4.16699 5.83333C4.16699 7.67428 5.65938 9.16667 7.50033 9.16667Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.167 17.5001V15.8334C19.1664 15.0948 18.9206 14.3774 18.4681 13.7937C18.0156 13.2099 17.3821 12.793 16.667 12.6084"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 3C13.717 3.18358 14.3525 3.60058 14.8064 4.18526C15.2602 4.76993 15.5065 5.48902 15.5065 6.22917C15.5065 6.96931 15.2602 7.6884 14.8064 8.27307C14.3525 8.85775 13.717 9.27475 13 9.45833"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          ),
        };
      case "password":
        return {
          title: "Only people with the password",
          description:
            "Anyone with the password can access. Search engine indexing will be turned off.",
          icon: (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g opacity="0.7">
                <path
                  d="M5.83301 9.1665V5.83317C5.83301 4.7281 6.27199 3.66829 7.0534 2.88689C7.8348 2.10549 8.89461 1.6665 9.99967 1.6665C11.1047 1.6665 12.1646 2.10549 12.946 2.88689C13.7274 3.66829 14.1663 4.7281 14.1663 5.83317V9.1665"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.8333 9.16675H4.16667C3.24619 9.16675 2.5 9.91294 2.5 10.8334V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V10.8334C17.5 9.91294 16.7538 9.16675 15.8333 9.16675Z"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          ),
        };
    }
  };

  const accessInfo = getAccessText();

  if (showPrivacySettings) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] p-0">
          {/* Header */}
          <DialogHeader className="flex flex-row items-center justify-between p-5 border-b border-black/20">
            <div className="flex items-center gap-2">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="3.25"
                  stroke="#212121"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 1.75V3.25"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M9 14.75V16.25"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1.75 9H3.25"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M14.75 9H16.25"
                  stroke="#212121"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <DialogTitle className="text-lg font-semibold text-promag-body">
                Privacy settings
              </DialogTitle>
            </div>
            <button
              onClick={() => setShowPrivacySettings(false)}
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
          <div className="p-5 space-y-6">
            <h3 className="text-sm font-semibold text-promag-body/70">
              Who has access
            </h3>

            <div className="space-y-4">
              {/* Anyone */}
              <label className="flex items-start gap-3.5 cursor-pointer">
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="access"
                    checked={pendingAccessType === "anyone"}
                    onChange={() => handlePrivacyChange("anyone")}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-promag-body flex items-center justify-center",
                      pendingAccessType === "anyone" && "border-promag-primary",
                    )}
                  >
                    {pendingAccessType === "anyone" && (
                      <div className="w-3 h-3 rounded-full bg-promag-primary"></div>
                    )}
                  </div>
                </div>
                <div
                  className="flex-1"
                  onClick={() => handlePrivacyChange("anyone")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M10.0003 18.3333C14.6027 18.3333 18.3337 14.6023 18.3337 9.99996C18.3337 5.39759 14.6027 1.66663 10.0003 1.66663C5.39795 1.66663 1.66699 5.39759 1.66699 9.99996C1.66699 14.6023 5.39795 18.3333 10.0003 18.3333Z"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M1.66699 10H18.3337"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10.0003 1.66663C12.0847 3.94859 13.2693 6.90999 13.3337 9.99996C13.2693 13.0899 12.0847 16.0513 10.0003 18.3333C7.91593 16.0513 6.73136 13.0899 6.66699 9.99996C6.73136 6.90999 7.91593 3.94859 10.0003 1.66663Z"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    <span className="text-sm font-semibold text-promag-body">
                      Anyone
                    </span>
                  </div>
                  <p className="text-sm text-promag-body/70 leading-5">
                    Anyone on the internet can find and access. Search engine
                    indexing will be enabled.
                  </p>
                </div>
              </label>

              {/* Anyone with the link */}
              <label className="flex items-start gap-3.5 cursor-pointer">
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="access"
                    checked={pendingAccessType === "link"}
                    onChange={() => handlePrivacyChange("link")}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-promag-body flex items-center justify-center",
                      pendingAccessType === "link" && "border-promag-primary",
                    )}
                  >
                    {pendingAccessType === "link" && (
                      <div className="w-3 h-3 rounded-full bg-promag-primary"></div>
                    )}
                  </div>
                </div>
                <div
                  className="flex-1"
                  onClick={() => handlePrivacyChange("link")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M12.6667 6H15.1667C15.7138 6 16.2557 6.10777 16.7612 6.31717C17.2667 6.52656 17.726 6.83348 18.1129 7.22039C18.4999 7.6073 18.8068 8.06663 19.0162 8.57215C19.2256 9.07768 19.3333 9.61949 19.3333 10.1667C19.3333 10.7138 19.2256 11.2557 19.0162 11.7612C18.8068 12.2667 18.4999 12.726 18.1129 13.1129C17.726 13.4999 17.2667 13.8068 16.7612 14.0162C16.2557 14.2256 15.7138 14.3333 15.1667 14.3333H12.6667M7.66667 14.3333H5.16667C4.61949 14.3333 4.07768 14.2256 3.57215 14.0162C3.06663 13.8068 2.6073 13.4999 2.22039 13.1129C1.43899 12.3315 1 11.2717 1 10.1667C1 9.0616 1.43899 8.00179 2.22039 7.22039C3.00179 6.43899 4.0616 6 5.16667 6H7.66667"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M6.66699 10H13.3337"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    <span className="text-sm font-semibold text-promag-body">
                      Anyone with the link
                    </span>
                  </div>
                  <p className="text-sm text-promag-body/70">
                    Anyone who has the link can access. Search engine indexing
                    will be turned off.
                  </p>
                </div>
              </label>

              {/* Only people I choose */}
              <label className="flex items-start gap-3.5 cursor-pointer">
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="access"
                    checked={pendingAccessType === "choose"}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-promag-body flex items-center justify-center",
                      pendingAccessType === "choose" && "border-promag-primary",
                    )}
                  >
                    {pendingAccessType === "choose" && (
                      <div className="w-3 h-3 rounded-full bg-promag-primary"></div>
                    )}
                  </div>
                </div>
                <div
                  className="flex-1"
                  onClick={() => handlePrivacyChange("choose")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M14.1663 17.5V15.8333C14.1663 14.9493 13.8152 14.1014 13.19 13.4763C12.5649 12.8512 11.7171 12.5 10.833 12.5H4.16634C3.28229 12.5 2.43444 12.8512 1.80932 13.4763C1.1842 14.1014 0.833008 14.9493 0.833008 15.8333V17.5"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7.50033 9.16667C9.34127 9.16667 10.8337 7.67428 10.8337 5.83333C10.8337 3.99238 9.34127 2.5 7.50033 2.5C5.65938 2.5 4.16699 3.99238 4.16699 5.83333C4.16699 7.67428 5.65938 9.16667 7.50033 9.16667Z"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M19.167 17.5001V15.8334C19.1664 15.0948 18.9206 14.3774 18.4681 13.7937C18.0156 13.2099 17.3821 12.793 16.667 12.6084"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M13 3C13.717 3.18358 14.3525 3.60058 14.8064 4.18526C15.2602 4.76993 15.5065 5.48902 15.5065 6.22917C15.5065 6.96931 15.2602 7.6884 14.8064 8.27307C14.3525 8.85775 13.717 9.27475 13 9.45833"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    <span className="text-sm font-semibold text-promag-body">
                      Only people I choose
                    </span>
                  </div>
                  <p className="text-sm text-promag-body/70 leading-5">
                    Only people on the access list can access. Search engine
                    indexing will be turned off.
                  </p>
                </div>
              </label>

              {/* Only people with the password */}
              <label className="flex items-start gap-3.5 cursor-pointer">
                <div className="relative mt-1">
                  <input
                    type="radio"
                    name="access"
                    checked={pendingAccessType === "password"}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 border-promag-body flex items-center justify-center",
                      pendingAccessType === "password" &&
                        "border-promag-primary",
                    )}
                  >
                    {pendingAccessType === "password" && (
                      <div className="w-3 h-3 rounded-full bg-promag-primary"></div>
                    )}
                  </div>
                </div>
                <div
                  className="flex-1"
                  onClick={() => handlePrivacyChange("password")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.7">
                        <path
                          d="M5.83301 9.1665V5.83317C5.83301 4.7281 6.27199 3.66829 7.0534 2.88689C7.8348 2.10549 8.89461 1.6665 9.99967 1.6665C11.1047 1.6665 12.1646 2.10549 12.946 2.88689C13.7274 3.66829 14.1663 4.7281 14.1663 5.83317V9.1665"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.8333 9.16675H4.16667C3.24619 9.16675 2.5 9.91294 2.5 10.8334V16.6667C2.5 17.5872 3.24619 18.3334 4.16667 18.3334H15.8333C16.7538 18.3334 17.5 17.5872 17.5 16.6667V10.8334C17.5 9.91294 16.7538 9.16675 15.8333 9.16675Z"
                          stroke="#212121"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </svg>
                    <span className="text-sm font-semibold text-promag-body">
                      Only people with the password
                    </span>
                  </div>
                  <p className="text-sm text-promag-body/70 leading-5">
                    Anyone with the password can access. Search engine indexing
                    will be turned off.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end items-center gap-2.5 p-5 border-t border-black/20">
            <button
              onClick={() => setShowPrivacySettings(false)}
              className="px-5 py-3 rounded bg-gray-200 text-promag-body text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setAccessType(pendingAccessType);
                setShowPrivacySettings(false);
              }}
              className="px-5 py-3 rounded bg-promag-primary text-white text-sm font-medium hover:bg-promag-primary/90 transition-colors border border-promag-primary"
            >
              Save Settings
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-5 border-b border-black/20">
          <div className="flex items-center gap-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="13.5"
                cy="3.75"
                r="2.25"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="4.5"
                cy="9"
                r="2.25"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="13.5"
                cy="14.25"
                r="2.25"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.44 10.13L11.56 13.12"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11.56 4.88L6.44 7.87"
                stroke="#212121"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <DialogTitle className="text-lg font-semibold text-promag-body">
              Share
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
        <div className="flex p-5 gap-7">
          {/* Left side - Share options */}
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-semibold text-promag-body/70">
              Share the link
            </h3>

            {/* Social media icons */}
            <div className="flex gap-2.5">
              {/* Facebook */}
              <div className="w-9 h-9 rounded-lg border border-input-border flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 0H2.5C1.12125 0 0 1.12125 0 2.5V17.5C0 18.8787 1.12125 20 2.5 20H17.5C18.8787 20 20 18.8787 20 17.5V2.5C20 1.12125 18.8787 0 17.5 0Z"
                    fill="#1976D2"
                  />
                  <path
                    d="M16.875 10H13.75V7.5C13.75 6.81 14.31 6.875 15 6.875H16.25V3.75H13.75C11.6788 3.75 10 5.42875 10 7.5V10H7.5V13.125H10V20H13.75V13.125H15.625L16.875 10Z"
                    fill="#FAFAFA"
                  />
                </svg>
              </div>

              {/* Instagram */}
              <div className="w-9 h-9 rounded-lg border border-input-border flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="instagram-gradient"
                      x1="1.28811"
                      y1="18.7226"
                      x2="19.876"
                      y2="2.63497"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#FFDD55" />
                      <stop offset="0.5" stopColor="#FF543E" />
                      <stop offset="1" stopColor="#C837AB" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M1.24976 1.36083C-0.321908 2.99333 -0.000240844 4.7275 -0.000240844 9.99583C-0.000240844 14.3708 -0.763574 18.7567 3.23143 19.7892C4.47893 20.11 15.5323 20.11 16.7781 19.7875C18.4414 19.3583 19.7948 18.0092 19.9798 15.6567C20.0056 15.3283 20.0056 4.66916 19.9789 4.33416C19.7823 1.82833 18.2398 0.384165 16.2073 0.0916646C15.7414 0.0241646 15.6481 0.00416464 13.2581 -2.03028e-06C4.78059 0.00416464 2.92226 -0.373335 1.24976 1.36083Z"
                    fill="url(#instagram-gradient)"
                  />
                  <path
                    d="M9.99785 2.61589C6.97202 2.61589 4.09869 2.34672 3.00119 5.16339C2.54785 6.32673 2.61369 7.83756 2.61369 10.0009C2.61369 11.8992 2.55285 13.6834 3.00119 14.8376C4.09619 17.6559 6.99285 17.3859 9.99619 17.3859C12.8937 17.3859 15.8812 17.6876 16.992 14.8376C17.4462 13.6626 17.3795 12.1742 17.3795 10.0009C17.3795 7.11589 17.5387 5.25339 16.1395 3.85506C14.7229 2.43839 12.807 2.61589 9.99452 2.61589H9.99785ZM9.33619 3.94672C15.6479 3.93672 16.4512 3.23506 16.0079 12.9826C15.8504 16.4301 13.2254 16.0517 9.99869 16.0517C4.11535 16.0517 3.94619 15.8834 3.94619 9.99756C3.94619 4.04339 4.41285 3.95006 9.33619 3.94506V3.94672ZM13.9395 5.17256C13.4504 5.17256 13.0537 5.56922 13.0537 6.05839C13.0537 6.54756 13.4504 6.94423 13.9395 6.94423C14.4287 6.94423 14.8254 6.54756 14.8254 6.05839C14.8254 5.56922 14.4287 5.17256 13.9395 5.17256ZM9.99785 6.20839C7.90369 6.20839 6.20619 7.90673 6.20619 10.0009C6.20619 12.0951 7.90369 13.7926 9.99785 13.7926C12.092 13.7926 13.7887 12.0951 13.7887 10.0009C13.7887 7.90673 12.092 6.20839 9.99785 6.20839ZM9.99785 7.53923C13.252 7.53923 13.2562 12.4626 9.99785 12.4626C6.74452 12.4626 6.73952 7.53923 9.99785 7.53923Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* LinkedIn */}
              <div className="w-9 h-9 rounded-lg border border-input-border flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.1908 0H1.80916C0.81 0 0 0.81 0 1.80916V18.1908C0 19.19 0.81 20 1.80916 20H18.1908C19.19 20 20 19.19 20 18.1908V1.80916C20 0.81 19.19 0 18.1908 0ZM6.18885 17.2693C6.18885 17.5601 5.95314 17.7958 5.66236 17.7958H3.4212C3.13042 17.7958 2.89471 17.5601 2.89471 17.2693V7.8745C2.89471 7.58372 3.13042 7.34801 3.4212 7.34801H5.66236C5.95314 7.34801 6.18885 7.58372 6.18885 7.8745V17.2693ZM4.54178 6.46241C3.36592 6.46241 2.41267 5.50916 2.41267 4.3333C2.41267 3.15743 3.36592 2.20419 4.54178 2.20419C5.71764 2.20419 6.67089 3.15743 6.67089 4.3333C6.67089 5.50916 5.7177 6.46241 4.54178 6.46241ZM17.901 17.3117C17.901 17.5791 17.6843 17.7958 17.417 17.7958H15.012C14.7447 17.7958 14.528 17.5791 14.528 17.3117V12.905C14.528 12.2476 14.7208 10.0243 12.81 10.0243C11.3279 10.0243 11.0272 11.5461 10.9669 12.2291V17.3117C10.9669 17.5791 10.7502 17.7958 10.4828 17.7958H8.15681C7.88948 17.7958 7.67272 17.5791 7.67272 17.3117V7.83209C7.67272 7.56476 7.88948 7.34801 8.15681 7.34801H10.4828C10.7501 7.34801 10.9669 7.56476 10.9669 7.83209V8.65173C11.5164 7.82696 12.3332 7.19037 14.0722 7.19037C17.9231 7.19037 17.901 10.7881 17.901 12.7648V17.3117Z"
                    fill="#0077B7"
                  />
                </svg>
              </div>

              {/* WhatsApp */}
              <div className="w-9 h-9 rounded-lg border border-input-border flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.2727 0H2.72727C1.22104 0 0 1.22104 0 2.72727V17.2727C0 18.779 1.22104 20 2.72727 20H17.2727C18.779 20 20 18.779 20 17.2727V2.72727C20 1.22104 18.779 0 17.2727 0Z"
                    fill="#29A71A"
                  />
                  <path
                    d="M14.4095 5.59091C13.3691 4.54011 11.9874 3.89569 10.5137 3.77389C9.03999 3.65209 7.57127 4.06092 6.37245 4.92664C5.17363 5.79236 4.32363 7.05798 3.97578 8.49522C3.62793 9.93245 3.80512 11.4467 4.47539 12.7648L3.81744 15.9591C3.81061 15.9909 3.81042 16.0237 3.81687 16.0556C3.82332 16.0875 3.83628 16.1177 3.85494 16.1443C3.88227 16.1847 3.92128 16.2159 3.96676 16.2335C4.01224 16.2512 4.06203 16.2546 4.10948 16.2432L7.24016 15.5011C8.55455 16.1544 10.0581 16.3202 11.4833 15.969C12.9084 15.6178 14.1627 14.7724 15.0231 13.5831C15.8834 12.3939 16.2939 10.938 16.1815 9.47453C16.0692 8.01105 15.4412 6.63488 14.4095 5.59091ZM13.4333 13.3818C12.7135 14.0997 11.7865 14.5735 10.7831 14.7366C9.77963 14.8997 8.75031 14.7438 7.84016 14.2909L7.4038 14.075L5.48448 14.5295L5.49016 14.5057L5.88789 12.5739L5.67425 12.1523C5.20921 11.2389 5.04516 10.2019 5.2056 9.18959C5.36605 8.17732 5.84275 7.2418 6.56744 6.51705C7.47801 5.60675 8.71284 5.09538 10.0004 5.09538C11.2879 5.09538 12.5228 5.60675 13.4333 6.51705C13.4411 6.52594 13.4495 6.53429 13.4583 6.54205C14.3576 7.45468 14.8597 8.68583 14.855 9.96708C14.8503 11.2483 14.3393 12.4758 13.4333 13.3818Z"
                    fill="white"
                  />
                  <path
                    d="M13.263 11.9648C13.0277 12.3352 12.6561 12.7887 12.1891 12.9012C11.3709 13.0989 10.1152 12.908 8.55273 11.4512L8.53341 11.4341C7.15954 10.1602 6.80273 9.10002 6.88909 8.25911C6.93682 7.78184 7.33454 7.35002 7.66977 7.0682C7.72277 7.02297 7.78562 6.99077 7.85329 6.97416C7.92096 6.95756 7.99158 6.95703 8.05949 6.9726C8.12741 6.98817 8.19073 7.01941 8.24441 7.06384C8.29809 7.10826 8.34063 7.16463 8.36864 7.22843L8.87432 8.36479C8.90718 8.43848 8.91936 8.51971 8.90955 8.59979C8.89974 8.67987 8.86831 8.75577 8.81863 8.81934L8.56295 9.15116C8.50809 9.21967 8.47499 9.30304 8.4679 9.39052C8.46081 9.47801 8.48006 9.56561 8.52318 9.64207C8.66636 9.8932 9.00954 10.2625 9.39023 10.6046C9.8175 10.9909 10.2914 11.3443 10.5914 11.4648C10.6716 11.4976 10.7599 11.5056 10.8448 11.4878C10.9296 11.4699 11.0072 11.4271 11.0675 11.3648L11.3641 11.0659C11.4213 11.0095 11.4925 10.9693 11.5703 10.9493C11.6482 10.9293 11.7299 10.9304 11.8073 10.9523L13.0084 11.2932C13.0747 11.3135 13.1354 11.3487 13.186 11.3961C13.2365 11.4435 13.2756 11.5019 13.3001 11.5667C13.3247 11.6315 13.3341 11.701 13.3277 11.77C13.3212 11.839 13.2991 11.9057 13.263 11.9648Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Twitter */}
              <div className="w-9 h-9 rounded-lg border border-input-border flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.4211 0H1.57895C0.706919 0 0 0.706919 0 1.57895V18.4211C0 19.2931 0.706919 20 1.57895 20H18.4211C19.2931 20 20 19.2931 20 18.4211V1.57895C20 0.706919 19.2931 0 18.4211 0Z"
                    fill="#03A9F4"
                  />
                  <path
                    d="M16.4777 5.98285C15.9904 6.19564 15.475 6.33701 14.9474 6.40258C15.5036 6.07276 15.9194 5.55023 16.1158 4.93416C15.5953 5.24316 15.0256 5.46077 14.4316 5.57758C14.0676 5.18831 13.5949 4.91757 13.075 4.80059C12.555 4.68361 12.0119 4.72581 11.5163 4.92168C11.0206 5.11755 10.5954 5.45804 10.2959 5.89886C9.99637 6.33968 9.83644 6.86043 9.83689 7.39337C9.83503 7.59679 9.85577 7.79979 9.89874 7.99863C8.84212 7.94674 7.80834 7.67252 6.86492 7.19389C5.9215 6.71527 5.08966 6.043 4.42374 5.221C4.08145 5.80575 3.9754 6.49915 4.12728 7.15947C4.27915 7.81979 4.67748 8.39719 5.24084 8.77363C4.82035 8.7623 4.40876 8.64992 4.04084 8.446V8.47495C4.04202 9.08788 4.25418 9.68172 4.64164 10.1566C5.02911 10.6316 5.56826 10.9586 6.16847 11.0828C5.94133 11.1425 5.70726 11.1717 5.47242 11.1697C5.30332 11.1728 5.13438 11.1578 4.96847 11.1249C5.14043 11.6521 5.47149 12.113 5.91611 12.4443C6.36073 12.7756 6.89707 12.961 7.45137 12.9749C6.51206 13.7091 5.3541 14.1079 4.16189 14.1078C3.94947 14.1096 3.73716 14.0973 3.52637 14.071C4.74199 14.8548 6.15895 15.2689 7.60531 15.2631C12.4935 15.2631 15.1658 11.2144 15.1658 7.70521C15.1658 7.58811 15.1658 7.47495 15.1566 7.36179C15.6771 6.98619 16.1247 6.51891 16.4777 5.98285Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>

            {/* URL input and copy button */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 p-3 rounded border border-promag-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 9.74997C7.82209 10.1806 8.23302 10.5369 8.70491 10.7947C9.17681 11.0525 9.69863 11.2058 10.235 11.2442C10.7713 11.2826 11.3097 11.2052 11.8135 11.0173C12.3173 10.8294 12.7748 10.5353 13.155 10.155L15.405 7.90497C16.0881 7.19772 16.4661 6.25046 16.4575 5.26722C16.449 4.28398 16.0546 3.34343 15.3593 2.64815C14.664 1.95287 13.7235 1.55849 12.7403 1.54995C11.757 1.5414 10.8098 1.91938 10.1025 2.60247L8.8125 3.88497"
                    stroke="#722555"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.4997 8.24992C10.1776 7.81933 9.76664 7.46304 9.29475 7.20522C8.82285 6.9474 8.30103 6.79409 7.76467 6.75567C7.22832 6.71726 6.68997 6.79465 6.18615 6.98259C5.68233 7.17053 5.22483 7.46462 4.84466 7.84492L2.59466 10.0949C1.91157 10.8022 1.53359 11.7494 1.54213 12.7327C1.55068 13.7159 1.94506 14.6565 2.64034 15.3517C3.33562 16.047 4.27617 16.4414 5.25941 16.45C6.24264 16.4585 7.1899 16.0805 7.89716 15.3974L9.17966 14.1149"
                    stroke="#722555"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm text-promag-primary font-medium flex-1">
                  {shareUrl}
                </span>
              </div>

              <button
                onClick={copyToClipboard}
                className="w-full py-3 px-3 rounded bg-promag-primary text-white text-sm font-medium hover:bg-promag-primary/90 transition-colors border border-promag-primary"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px bg-gray-300"></div>

          {/* Right side - Access settings */}
          <div className="flex-1 space-y-2.5">
            <h3 className="text-sm font-semibold text-promag-body/70">
              Who has access
            </h3>

            <div className="flex items-start gap-2">
              {accessInfo.icon}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-promag-body">
                  {accessInfo.title}
                </h4>
                <p className="text-sm text-promag-body/70 leading-5 mt-2.5">
                  {accessInfo.description}
                </p>
                <button
                  onClick={() => {
                    setPendingAccessType(accessType);
                    setShowPrivacySettings(true);
                  }}
                  className="text-sm font-semibold text-promag-primary mt-2.5 hover:underline"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-3.5 border-t border-black/20">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-3 rounded bg-promag-primary text-white text-sm font-medium hover:bg-promag-primary/90 transition-colors border border-promag-primary"
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
