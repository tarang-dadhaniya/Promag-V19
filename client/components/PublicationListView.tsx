import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DeleteCollectionDialog } from "./DeleteCollectionDialog";
import { ShareDialog } from "./ShareDialog";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { Settings as SettingsIcon, Globe as GlobeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Collection {
  id: string;
  title: string;
  coverImage?: string;
  createdAt: Date;
}

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
}

interface PublicationListViewProps {
  collection: Collection;
  publications: Publication[];
  onNewIssue: () => void;
  onBackToCollections: () => void;
  onGoToPublications?: () => void;
  onDeleteCollection?: (collectionId: string) => void;
  className?: string;
  onEditPublication?: (publication: Publication) => void;
  onOpenPublicationDetails?: (publication: Publication) => void;
  onEditCollectionSettings?: () => void;
  onDeletePublication?: (publication: Publication) => void;
  onClonePublication?: (publication: Publication) => void;
}

const NewIssueCard = ({ onClick }: { onClick: () => void }) => (
  <div
    onClick={onClick}
    className="flex w-[305px] flex-col items-center justify-center border border-dashed border-[#DEE6ED] rounded-lg bg-white cursor-pointer hover:border-promag-primary/50 transition-colors group h-[379px]"
  >
    <div className="flex flex-col items-center gap-[22px]">
      <div className="flex items-center justify-center">
        <svg
          width="118"
          height="118"
          viewBox="0 0 118 118"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M59 40V78"
            stroke="#722555"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-promag-primary/80"
          />
          <path
            d="M40 59H78"
            stroke="#722555"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-promag-primary/80"
          />
        </svg>
      </div>
      <h3 className="text-promag-primary font-inter text-lg font-semibold group-hover:text-promag-primary/80">
        {t("common.newIssue", "New Issue")}
      </h3>
    </div>
  </div>
);

const PublicationCard = ({
  publication,
  onEdit,
  onShare,
  onDelete,
  onClone,
  onSettings,
}: {
  publication: Publication;
  onEdit: () => void;
  onShare: () => void;
  onDelete: () => void;
  onClone: () => void;
  onSettings: () => void;
}) => (
  <div className="flex w-[305px] h-[379px] p-3 flex-col items-start gap-[14px] rounded-lg bg-white shadow-[0px_0px_15px_-1px_rgba(12,12,13,0.08)]">
    {/* Cover Image */}
    <div className="w-[281px] h-[200px] flex-shrink-0 relative">
      {publication.coverImage ? (
        <img
          src={publication.coverImage}
          alt={publication.title}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        </div>
      )}
    </div>

    {/* Content */}
    <div className="flex flex-col items-start gap-4 self-stretch">
      {/* Title and Status Section */}
      <div className="flex pb-4 flex-col items-start gap-[7px] self-stretch border-b border-[#DDD]">
        <div className="flex justify-between items-center self-stretch">
          <div className="flex items-start gap-[5px] flex-1">
            <div className="w-[226px] text-promag-body font-inter text-lg font-normal">
              {publication.title}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center self-stretch">
          <div className="flex items-center gap-[7px] flex-1">
            {publication.status === "published" ? (
              <>
                <div className="flex px-2.5 py-[5px] justify-center items-center gap-5 rounded bg-[#29A44A]">
                  <div className="text-white font-inter text-xs font-semibold">
                    Live
                  </div>
                </div>
                <div className="text-promag-primary font-inter text-[13px] font-semibold">
                  Back to Draft
                </div>
              </>
            ) : (
              <>
                <div className="flex px-2.5 py-[5px] justify-center items-center gap-5 rounded bg-[#C7C7C7]">
                  <div className="text-[#615F5F] font-inter text-xs font-semibold">
                    Draft
                  </div>
                </div>
                <div className="flex px-2.5 py-[5px] justify-center items-center gap-5 rounded bg-promag-primary">
                  <div className="text-white font-inter text-xs font-semibold">
                    Go Live
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end items-center gap-2.5">
            {/* Google Play Store Icon */}
            <svg
              width="25"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.4701 8.57526C16.5659 6.95089 11.9046 4.34253 4.67447 0.294236C4.18701 -0.0276884 3.62617 -0.069876 3.1416 0.094138L15.5464 12.4989L19.4701 8.57526Z"
                fill="#32BBFF"
              />
              <path
                d="M3.14126 0.0942383C3.05044 0.125 2.96206 0.16211 2.87754 0.206934C2.34243 0.496388 1.94922 1.05337 1.94922 1.75782V23.2403C1.94922 23.9447 2.34238 24.5017 2.87754 24.7911C2.96192 24.8359 3.05025 24.8731 3.14097 24.9041L15.5461 12.499L3.14126 0.0942383Z"
                fill="#32BBFF"
              />
              <path
                d="M15.5457 12.499L3.14062 24.9041C3.62534 25.0693 4.18618 25.0303 4.67378 24.7037C11.6854 20.7775 16.2942 18.2 19.232 16.5618C19.3138 16.5159 19.3939 16.471 19.4731 16.4265L15.5457 12.499Z"
                fill="#32BBFF"
              />
              <path
                d="M1.94922 12.499V23.2403C1.94922 23.9447 2.34238 24.5017 2.87754 24.7911C2.96192 24.8359 3.05025 24.8731 3.14097 24.9041L15.5461 12.499H1.94922Z"
                fill="#2C9FD9"
              />
              <path
                d="M4.67452 0.294332C4.09566 -0.0878952 3.41304 -0.0770065 2.87793 0.206978L15.3582 12.6873L19.4701 8.57535C16.5659 6.95099 11.9046 4.34263 4.67452 0.294332Z"
                fill="#29CC5E"
              />
              <path
                d="M15.3583 12.3108L2.87793 24.791C3.41309 25.075 4.09566 25.0914 4.67452 24.7037C11.6862 20.7774 16.2949 18.2 19.2327 16.5618C19.3145 16.5158 19.3947 16.4709 19.4739 16.4264L15.3583 12.3108Z"
                fill="#D93F21"
              />
              <path
                d="M24.6498 12.4989C24.6498 11.9037 24.3494 11.303 23.7542 10.9699C23.7542 10.9699 22.6409 10.3488 19.2287 8.44019L15.1699 12.4989L19.2326 16.5617C22.6074 14.6668 23.7541 14.0279 23.7541 14.0279C24.3494 13.6948 24.6498 13.0942 24.6498 12.4989Z"
                fill="#FFD500"
              />
              <path
                d="M23.7542 14.028C24.3494 13.6949 24.6498 13.0942 24.6498 12.499H15.1699L19.2326 16.5618C22.6075 14.6669 23.7542 14.028 23.7542 14.028Z"
                fill="#FFAA00"
              />
            </svg>
            {/* App Store Icon */}
            <svg
              width="25"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_240_2442)">
                <path
                  d="M20.7473 0.00146484H5.84917C3.05889 0.00146484 0.799805 2.26055 0.799805 5.05083V19.9521C0.799805 22.7393 3.05889 24.9983 5.84917 24.9983H20.7504C23.5376 24.9983 25.7998 22.7393 25.7998 19.949V5.05083C25.7967 2.26055 23.5376 0.00146484 20.7473 0.00146484Z"
                  fill="url(#paint0_linear_240_2442)"
                />
                <path
                  d="M13.1922 5.74448L13.6984 4.86958C14.0108 4.32275 14.7076 4.13843 15.2544 4.45088C15.8013 4.76333 15.9856 5.46011 15.6731 6.00693L10.7956 14.4497H14.3233C15.4669 14.4497 16.1074 15.7933 15.6106 16.7244H5.26821C4.63706 16.7244 4.13086 16.2182 4.13086 15.587C4.13086 14.9559 4.63706 14.4497 5.26821 14.4497H8.16787L11.8799 8.01607L10.7207 6.00381C10.4083 5.45698 10.5926 4.76646 11.1394 4.44775C11.6862 4.1353 12.3768 4.31963 12.6955 4.86646L13.1922 5.74448Z"
                  fill="white"
                />
                <path
                  d="M8.80518 17.8962L7.71157 19.7928C7.39912 20.3396 6.70234 20.524 6.15552 20.2115C5.60869 19.8991 5.42437 19.2023 5.73682 18.6555L6.54922 17.2494C7.46782 16.9651 8.2146 17.1838 8.80518 17.8962Z"
                  fill="white"
                />
                <path
                  d="M18.2224 14.4558H21.1813C21.8125 14.4558 22.3187 14.962 22.3187 15.5932C22.3187 16.2243 21.8125 16.7305 21.1813 16.7305H19.5378L20.647 18.6553C20.9595 19.2021 20.7751 19.8926 20.2283 20.2113C19.6815 20.5238 18.991 20.3395 18.6723 19.7926C16.8038 16.5524 15.4008 14.1277 14.4697 12.5123C13.5166 10.8688 14.1978 9.21895 14.8696 8.65967C15.6164 9.94077 16.7319 11.8749 18.2224 14.4558Z"
                  fill="white"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_240_2442"
                  x1="13.2998"
                  y1="0.00146484"
                  x2="13.2998"
                  y2="24.9983"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#00BFFC" />
                  <stop offset="1" stopColor="#0073F6" />
                </linearGradient>
                <clipPath id="clip0_240_2442">
                  <rect
                    width="25"
                    height="25"
                    fill="white"
                    transform="translate(0.799805)"
                  />
                </clipPath>
              </defs>
            </svg>
            {/* Globe Icon (lucide) */}
            <GlobeIcon size={25} strokeWidth={1.6} color="#00A1E2" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-start gap-5 self-stretch">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSettings();
          }}
          className="w-[18px] h-[18px] group hover:scale-110 transition-transform"
          title="Settings"
          aria-label="Open publication settings"
        >
          <SettingsIcon
            size={18}
            strokeWidth={1.5}
            color="#722555"
            className="group-hover:text-promag-primary/80"
          />
        </button>

        {/* Edit Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="group hover:scale-110 transition-transform"
          aria-label="Edit publication"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.25 3H3C2.6 3 2.22 3.16 1.94 3.44C1.66 3.72 1.5 4.1 1.5 4.5V15C1.5 15.4 1.66 15.78 1.94 16.06C2.22 16.34 2.6 16.5 3 16.5H13.5C13.9 16.5 14.28 16.34 14.56 16.06C14.84 15.78 15 15.4 15 15V9.75"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.875 1.875C14.173 1.577 14.578 1.409 15 1.409C15.422 1.409 15.826 1.577 16.125 1.875C16.423 2.173 16.591 2.578 16.591 3C16.591 3.422 16.423 3.827 16.125 4.125L9 11.25L6 12L6.75 9L13.875 1.875Z"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Share Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="group"
          aria-label="Share publication"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="group-hover:scale-110 transition-transform"
          >
            <circle
              cx="13.5"
              cy="3.75"
              r="2.25"
              stroke="#722555"
              strokeWidth="1.5"
            />
            <circle
              cx="4.5"
              cy="9"
              r="2.25"
              stroke="#722555"
              strokeWidth="1.5"
            />
            <circle
              cx="13.5"
              cy="14.25"
              r="2.25"
              stroke="#722555"
              strokeWidth="1.5"
            />
            <path
              d="M6.44 10.13L11.56 13.12"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M11.56 4.88L6.44 7.87"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Dollar Icon */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 0.75V17.25"
            stroke="#722555"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12.75 3.75H7.125C6.428 3.75 5.761 4.027 5.269 4.519C4.777 5.011 4.5 5.679 4.5 6.375C4.5 7.071 4.777 7.739 5.269 8.231C5.761 8.723 6.428 9 7.125 9H10.875C11.571 9 12.239 9.277 12.731 9.769C13.223 10.261 13.5 10.929 13.5 11.625C13.5 12.321 13.223 12.989 12.731 13.481C12.239 13.973 11.571 14.25 10.875 14.25H4.5"
            stroke="#722555"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        {/* Copy Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClone();
          }}
          className="group hover:scale-110 transition-transform"
          aria-label="Clone publication"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="6.75"
              y="6.75"
              width="9.75"
              height="9.75"
              rx="2.25"
              stroke="#722555"
              strokeWidth="1.5"
            />
            <rect
              x="1.5"
              y="1.5"
              width="9.75"
              height="9.75"
              rx="2.25"
              stroke="#722555"
              strokeWidth="1.5"
            />
          </svg>
        </button>

        {/* Trash Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="group hover:scale-110 transition-transform"
          aria-label="Delete publication"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.25 4.5H15.75"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M14.25 4.5V15C14.25 15.398 14.092 15.779 13.811 16.061C13.529 16.342 13.148 16.5 12.75 16.5H5.25C4.852 16.5 4.471 16.342 4.189 16.061C3.908 15.779 3.75 15.398 3.75 15V4.5M6 4.5V3C6 2.602 6.158 2.221 6.439 1.939C6.721 1.658 7.102 1.5 7.5 1.5H10.5C10.898 1.5 11.279 1.658 11.561 1.939C11.842 2.221 12 2.602 12 3V4.5"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M7.5 8.25V12.75"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10.5 8.25V12.75"
              stroke="#722555"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export function PublicationListView({
  collection,
  publications,
  onNewIssue,
  onBackToCollections,
  onGoToPublications,
  onDeleteCollection,
  className,
  onEditPublication,
  onOpenPublicationDetails,
  onEditCollectionSettings,
  onDeletePublication,
  onClonePublication,
}: PublicationListViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCloneConfirmation, setShowCloneConfirmation] = useState(false);
  const [sharePublication, setSharePublication] = useState<Publication | null>(
    null,
  );
  const [targetPublication, setTargetPublication] =
    useState<Publication | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowActionDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredPublications = publications.filter((publication) =>
    publication.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleShare = (publication: Publication) => {
    setSharePublication(publication);
    setShowShareDialog(true);
  };

  const handleDelete = (publication: Publication) => {
    setTargetPublication(publication);
    setShowDeleteConfirmation(true);
  };

  const handleClone = (publication: Publication) => {
    setTargetPublication(publication);
    setShowCloneConfirmation(true);
  };

  // NOTE: opening details is handled by parent via onOpenPublicationDetails prop

  const confirmDelete = () => {
    if (targetPublication) {
      // Invoke parent handler to perform deletion and persist changes
      onDeletePublication?.(targetPublication);
      setShowDeleteConfirmation(false);
      setTargetPublication(null);
    }
  };

  const confirmClone = () => {
    if (targetPublication) {
      // Invoke parent handler to perform cloning and persist changes
      onClonePublication?.(targetPublication);
      setShowCloneConfirmation(false);
      setTargetPublication(null);
    }
  };

  const cancelAction = () => {
    setTargetPublication(null);
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-inter font-medium">
        <button
          type="button"
          onClick={onBackToCollections}
          className="text-promag-body/70 hover:text-promag-primary hover:underline underline-offset-4"
          aria-label={t("common.backToCollections")}
        >
          {t("common.collections")}
        </button>
        <span className="text-promag-body/70">/</span>
        <button
          type="button"
          onClick={onGoToPublications}
          className="text-promag-body/70 hover:text-promag-primary hover:underline underline-offset-4"
        >
          {t("common.publications")}
        </button>
      </div>

      {/* Search and Actions */}
      <div className="flex w-full h-[44px] justify-between items-start">
        {/* Search */}
        <div className="flex w-[497px] h-[42px] px-[15px] justify-between items-center rounded-lg border border-[#DDD] bg-white">
          <input
            type="text"
            placeholder={t("common.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-promag-body/50 font-inter text-sm outline-none placeholder:text-promag-body/50"
          />
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="9"
              cy="9"
              r="8"
              stroke="#212121"
              strokeOpacity="0.5"
              strokeWidth="1.5"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#212121"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-2.5">
          {/* Filter Button */}
          <div className="flex w-[42px] h-[42px] p-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-white">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                stroke="#722555"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Sort Button */}
          <div className="flex w-[42px] h-[42px] p-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-white">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.016 17.973C1.669 18.31 1.66 18.864 1.997 19.211L5.362 22.679C5.522 22.844 5.743 22.948 5.99 22.948C6.237 22.948 6.458 22.844 6.617 22.679L9.984 19.211C10.321 18.864 10.312 18.31 9.965 17.973C9.618 17.637 9.064 17.645 8.728 17.992L6.865 19.912V5.927C6.865 5.443 6.474 5.052 5.99 5.052C5.506 5.052 5.115 5.443 5.115 5.927V19.912L3.253 17.992C2.916 17.645 2.363 17.637 2.016 17.973Z"
                fill="#722555"
              />
              <path
                d="M23.519 11.308C23.519 10.824 23.128 10.433 22.644 10.433H13.149C12.666 10.433 12.274 10.824 12.274 11.308C12.274 11.791 12.666 12.183 13.149 12.183H22.644C23.128 12.183 23.519 11.791 23.519 11.308Z"
                fill="#722555"
              />
              <path
                d="M20.789 16.689C20.789 16.205 20.398 15.814 19.914 15.814H13.149C12.666 15.814 12.274 16.205 12.274 16.689C12.274 17.173 12.666 17.564 13.149 17.564H19.914C20.398 17.564 20.789 17.173 20.789 16.689Z"
                fill="#722555"
              />
              <path
                d="M13.149 21.198C12.666 21.198 12.274 21.59 12.274 22.073C12.274 22.557 12.666 22.948 13.149 22.948H17.184C17.668 22.948 18.059 22.557 18.059 22.073C18.059 21.59 17.668 21.198 17.184 21.198H13.149Z"
                fill="#722555"
              />
              <path
                d="M25.375 5.052H13.149C12.666 5.052 12.274 5.443 12.274 5.927C12.274 6.41 12.666 6.802 13.149 6.802H25.375C25.858 6.802 26.25 6.41 26.25 5.927C26.25 5.443 25.858 5.052 25.375 5.052Z"
                fill="#722555"
              />
            </svg>
          </div>

          {/* Action Button with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowActionDropdown(!showActionDropdown)}
              className="flex h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 1V11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M1 6H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              Action
            </button>

            {showActionDropdown && (
              <div className="absolute right-0 top-[44px] z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-2">
                <button
                  onClick={() => {
                    setShowActionDropdown(false);
                    onEditCollectionSettings?.();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  {/* Settings icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="3.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M9 1.75V3.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9 14.75V16.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M1.75 9H3.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14.75 9H16.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Settings
                </button>
                <button
                  onClick={() => {
                    setShowActionDropdown(false);
                    setShowDeleteDialog(true);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 4H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M12.667 4V13.333C12.667 13.687 12.527 14.026 12.277 14.276C12.027 14.526 11.688 14.667 11.334 14.667H4.667C4.314 14.667 3.975 14.526 3.725 14.276C3.474 14.026 3.334 13.687 3.334 13.333V4M5.334 4V2.667C5.334 2.313 5.475 1.974 5.725 1.724C5.975 1.474 6.314 1.333 6.667 1.333H9.334C9.688 1.333 10.027 1.474 10.277 1.724C10.527 1.974 10.667 2.313 10.667 2.667V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.667 7.333V11.333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M9.333 7.333V11.333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  {t("common.deleteCollection", "Delete Collection")}
                </button>
              </div>
            )}
          </div>

          {/* New Issue Button */}
          <button
            onClick={onNewIssue}
            className="flex h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1V11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M1 6H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {t("common.newIssue", "New Issue")}
          </button>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="flex w-full items-center gap-[30px] flex-wrap">
        <NewIssueCard onClick={onNewIssue} />
        {filteredPublications.map((publication) => (
          <PublicationCard
            key={publication.id}
            publication={publication}
            onEdit={() => onEditPublication?.(publication)}
            onShare={() => handleShare(publication)}
            onDelete={() => handleDelete(publication)}
            onClone={() => handleClone(publication)}
            onSettings={() => onOpenPublicationDetails?.(publication)}
          />
        ))}
      </div>

      {filteredPublications.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-black/60 font-inter text-lg">
            No publications found matching "{searchQuery}"
          </p>
          <p className="text-black/40 font-inter text-sm mt-2">
            Try adjusting your search terms
          </p>
        </div>
      )}

      <DeleteCollectionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDeleteCollection?.(collection.id);
        }}
        collectionName={collection.title}
      />

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl={
          sharePublication
            ? `https://example.com/publication/${sharePublication.id}`
            : undefined
        }
      />

      <ConfirmationDialog
        open={showDeleteConfirmation}
        onOpenChange={setShowDeleteConfirmation}
        type="delete"
        onConfirm={confirmDelete}
        onCancel={cancelAction}
      />

      <ConfirmationDialog
        open={showCloneConfirmation}
        onOpenChange={setShowCloneConfirmation}
        type="clone"
        onConfirm={confirmClone}
        onCancel={cancelAction}
      />
    </div>
  );
}
