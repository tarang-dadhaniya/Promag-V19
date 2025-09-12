import { useTranslation } from "react-i18next";
import { X, Settings, Share2, DollarSign, Copy, Trash2 } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface Publication {
  id: string;
  title: string;
  coverImage?: string;
  createdAt: Date;
  collectionId: string;
  status?: "draft" | "published" | "pending";
  category?: string;
  description?: string;
  edition?: string;
  teaser?: string;
  author?: string;
  editor?: string;
  language?: string;
  releaseDate?: string;
  isbnIssn?: string;
  indexOffset?: string | number;
  documentPrintAllowed?: boolean;
  previewPages?: string;
  orientation?: string;
  presentation?: boolean;
}

interface PublicationViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication: Publication | null;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onClone?: () => void;
  onSettings?: () => void;
  onStatusChange?: (status: "draft" | "published") => void;
  className?: string;
}

export function PublicationViewModal({
  open,
  onOpenChange,
  publication,
  onEdit,
  onShare,
  onDelete,
  onClone,
  onSettings,
  onStatusChange,
  className,
}: PublicationViewModalProps) {
  const { t, i18n } = useTranslation();

  if (!publication) return null;

  const isLive = publication.status === "published";

  const handleStatusToggle = () => {
    const newStatus = isLive ? "draft" : "published";
    onStatusChange?.(newStatus);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getLanguageDisplay = (lang?: string) => {
    if (!lang) return "";
    const languageMap: Record<string, string> = {
      en: t("languages.english"),
      de: t("languages.german"),
      es: t("languages.spanish"),
      fr: t("languages.french"),
      it: t("languages.italian"),
      hi: t("languages.hindi"),
    };
    return languageMap[lang] || lang;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[1000px] w-full h-[540px] p-0 gap-0 bg-white rounded-lg overflow-hidden">
        <div className="relative w-full h-full">
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-2.5 right-2.5 z-10 flex items-center justify-center w-5 h-5 rounded hover:bg-black/5 transition-colors"
          >
            <X className="w-4 h-4 text-promag-body" />
          </button>

          {/* Main Content */}
          <div className="flex h-full">
            {/* Left Side - Image (50%) */}
            <div className="flex w-1/2 relative">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                {publication.coverImage ? (
                  <img
                    src={publication.coverImage}
                    alt={publication.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto mb-2"
                      >
                        <path
                          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="14,2 14,8 20,8"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="16"
                          y1="13"
                          x2="8"
                          y2="13"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="16"
                          y1="17"
                          x2="8"
                          y2="17"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <polyline
                          points="10,9 9,9 8,9"
                          stroke="#9CA3AF"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <p className="text-gray-500 text-sm">
                        {t("forms.coverImage")}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Icons Overlay */}
              <div className="absolute top-4 right-1 flex flex-col gap-1">
                {/* Platform Icons (simulated) */}
                <div className="w-12 h-12 bg-black/80 rounded flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect
                      width="28"
                      height="28"
                      rx="8"
                      fill="url(#gradient1)"
                    />
                    <path
                      d="M14 8L15 12H19L16 15L17 19L14 17L11 19L12 15L9 12H13L14 8Z"
                      fill="white"
                    />
                    <defs>
                      <linearGradient
                        id="gradient1"
                        x1="0"
                        y1="0"
                        x2="28"
                        y2="28"
                      >
                        <stop stopColor="#00BFFC" />
                        <stop offset="1" stopColor="#0073F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="w-12 h-12 bg-black/80 rounded flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect width="28" height="28" rx="8" fill="#32BBFF" />
                    <path d="M8 8L20 14L8 20V8Z" fill="white" />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-black/80 rounded flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="14" fill="url(#gradient2)" />
                    <path d="M10 10H18V18H10V10Z" fill="white" />
                    <defs>
                      <linearGradient
                        id="gradient2"
                        x1="0"
                        y1="0"
                        x2="28"
                        y2="28"
                      >
                        <stop stopColor="#00A1E2" />
                        <stop offset="1" stopColor="#00E0A5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right Side - Details (50%) */}
            <div className="flex w-1/2 flex-col justify-between p-10 bg-white">
              {/* Content Section */}
              <div className="flex flex-col gap-4">
                {/* Title */}
                <h1 className="text-promag-body font-inter text-[28px] font-medium leading-normal">
                  {publication.title}
                </h1>

                {/* Publication Meta */}
                <div className="text-promag-body font-inter text-lg font-normal leading-[26px]">
                  <p>
                    {t("forms.placeholders.publicationTitle")}{" "}
                    {formatDate(publication.createdAt)}{" "}
                    {t("common.publications").toLowerCase()} "
                    {publication.category || t("categories.education")}",
                    {getLanguageDisplay(publication.language) &&
                      ` ${t("forms.language").toLowerCase()}: ${getLanguageDisplay(publication.language)}.`}{" "}
                    {publication.previewPages || "30"}{" "}
                    {t("forms.previewPages").toLowerCase()}.
                  </p>
                  {publication.author && (
                    <p className="mt-2">
                      {t("forms.author")}: {publication.author}
                      {publication.editor && `/${publication.editor}`}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="text-promag-body font-inter text-sm font-normal leading-6">
                  <p className="font-medium text-base mb-1">
                    {t("forms.description")}:
                  </p>
                  <p className="text-sm">
                    {publication.description ||
                      publication.teaser ||
                      t("publication.selectedNameFallback")}
                  </p>
                </div>

                {/* Status Buttons */}
                <div className="flex items-center gap-2">
                  {isLive ? (
                    <button className="flex px-5 py-2 justify-center items-center rounded-md bg-green-600 text-white font-inter text-sm font-semibold">
                      {t("publication.status.live")}
                    </button>
                  ) : (
                    <button
                      onClick={handleStatusToggle}
                      className="flex px-5 py-2 justify-center items-center rounded-md border border-promag-primary text-promag-primary font-inter text-sm font-semibold hover:bg-promag-primary/5 transition-colors"
                    >
                      {t("publication.action.goLive")}
                    </button>
                  )}

                  {isLive && (
                    <button
                      onClick={handleStatusToggle}
                      className="flex px-5 py-2 justify-center items-center rounded-md border border-promag-primary text-promag-primary font-inter text-sm font-semibold hover:bg-promag-primary/5 transition-colors"
                    >
                      {t("publication.action.backToDraft")}
                    </button>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="flex items-center justify-between">
                {/* Action Icons */}
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={onSettings}
                    className="flex w-11 h-11 justify-center items-center rounded-md border-2 border-input hover:border-promag-primary/50 transition-colors"
                  >
                    <Settings className="w-6 h-6 text-promag-primary" />
                  </button>
                  <button
                    onClick={onShare}
                    className="flex w-11 h-11 justify-center items-center rounded-md border-2 border-input hover:border-promag-primary/50 transition-colors"
                  >
                    <Share2 className="w-6 h-6 text-promag-primary" />
                  </button>
                  <button className="flex w-11 h-11 justify-center items-center rounded-md border-2 border-input hover:border-promag-primary/50 transition-colors">
                    <DollarSign className="w-6 h-6 text-promag-primary" />
                  </button>
                  <button
                    onClick={onClone}
                    className="flex w-11 h-11 justify-center items-center rounded-md border-2 border-input hover:border-promag-primary/50 transition-colors"
                  >
                    <Copy className="w-6 h-6 text-promag-primary" />
                  </button>
                  <button
                    onClick={onDelete}
                    className="flex w-11 h-11 justify-center items-center rounded-md border-2 border-input hover:border-red-400 transition-colors"
                  >
                    <Trash2 className="w-6 h-6 text-promag-primary hover:text-red-500" />
                  </button>
                </div>

                {/* Edit Button */}
                <button
                  onClick={onEdit}
                  className="flex h-11 px-4 justify-center items-center gap-2.5 rounded-md bg-promag-primary text-white font-inter text-base font-semibold hover:bg-promag-primary/90 transition-colors"
                >
                  {t("forms.editPublication")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
