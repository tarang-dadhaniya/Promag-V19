import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DeleteCollectionDialog } from "./DeleteCollectionDialog";
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
  status?: "draft" | "published" | "pending";
}

interface PublicationsPageProps {
  collection: Collection;
  publications: Publication[];
  onNewIssue: () => void;
  onBackToCollections: () => void;
  onDeleteCollection?: (collectionId: string) => void;
  className?: string;
  onEditPublication?: (publication: Publication) => void;
  onEditCollectionSettings?: () => void;
}

const NewIssueCard = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className="flex w-full h-[285px] flex-col items-center justify-center border border-dashed border-[#DEE6ED] rounded-lg bg-white cursor-pointer hover:border-promag-primary/50 transition-colors group"
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
};

const PublicationCard = ({
  publication,
  onEdit,
}: {
  publication: Publication;
  onEdit: () => void;
}) => (
  <div className="relative w-full h-[285px]">
    <div className="flex w-full h-full flex-col items-center rounded-lg bg-white overflow-hidden border border-[#DEE6ED] relative">
      <div className="w-full h-full relative">
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
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 rounded-b-lg">
          <h3 className="text-white font-inter text-lg font-medium text-center truncate">
            {publication.title}
          </h3>
        </div>
      </div>
    </div>

    {publication.status && (
      <div
        className={cn(
          "absolute top-2.5 left-2.5 px-2.5 py-1.5 rounded text-white text-sm font-medium z-10",
          publication.status === "draft" && "bg-red-500",
          publication.status === "published" && "bg-green-500",
          publication.status === "pending" && "bg-yellow-500",
        )}
      >
        {publication.status === "draft"
          ? "Draft"
          : publication.status === "published"
            ? "Published"
            : "Pending"}
      </div>
    )}

    <div className="absolute top-2.5 right-2.5 flex flex-col gap-2.5 z-10">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="flex w-[30px] h-[30px] p-1.5 items-center justify-center rounded bg-white hover:bg-gray-50 transition-colors"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="2" stroke="#722555" strokeWidth="1.5" />
          <circle cx="4" cy="12" r="2" stroke="#722555" strokeWidth="1.5" />
          <circle cx="20" cy="12" r="2" stroke="#722555" strokeWidth="1.5" />
        </svg>
      </button>
      {/* Edit icon (visual only, no click) */}
      <button className="flex w-[30px] h-[30px] p-1.5 items-center justify-center rounded bg-white hover:bg-gray-50 transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
            stroke="#722555"
            strokeWidth="1.5"
            fill="none"
          />
          <path d="M14.06 7.19l3.75 3.75" stroke="#722555" strokeWidth="1.5" />
        </svg>
      </button>
      <button className="flex w-[30px] h-[30px] p-1.5 items-center justify-center rounded bg-white hover:bg-gray-50 transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="18" cy="5" r="3" stroke="#722555" strokeWidth="1.5" />
          <circle cx="6" cy="12" r="3" stroke="#722555" strokeWidth="1.5" />
          <circle cx="18" cy="19" r="3" stroke="#722555" strokeWidth="1.5" />
          <path
            d="M8.7 11.1l4.6-2.2M8.7 12.9l4.6 2.2"
            stroke="#722555"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    </div>
  </div>
);

export function PublicationsPage({
  collection,
  publications,
  onNewIssue,
  onBackToCollections,
  onDeleteCollection,
  className,
  onEditPublication,
  onEditCollectionSettings,
}: PublicationsPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBackToCollections}
          className="text-black/60 font-inter text-sm font-normal hover:text-black/80 transition-colors"
        >
          {t("common.collections")}
        </button>
        <span className="text-black/60 font-inter text-sm font-normal">/</span>
        <span className="text-black font-inter text-sm font-normal">
          {t("common.publications")}
        </span>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <div className="flex w-full max-w-[497px] h-[42px] px-[15px] items-center gap-3 rounded-lg border border-[#DDD] bg-white">
          <input
            type="text"
            placeholder={t("common.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-black/50 font-inter text-sm font-normal outline-none placeholder:text-black/50"
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
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="#212121"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-[10px]">
          {/* Filter Button */}
          <button className="flex w-[42px] h-[42px] p-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-white hover:bg-promag-primary/5 transition-colors">
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
          </button>

          {/* Sort Button */}
          <button className="flex w-[42px] h-[42px] p-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-white hover:bg-promag-primary/5 transition-colors">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.01576 17.9734C1.66883 18.3101 1.66029 18.8638 1.99696 19.2107L5.36195 22.6791C5.36216 22.6793 5.36248 22.6794 5.3627 22.6796C5.52174 22.8442 5.74273 22.9482 5.99 22.9482C6.23727 22.9482 6.45826 22.8442 6.6173 22.6796C6.61752 22.6794 6.61784 22.6793 6.61805 22.6791L9.9839 19.2107C10.3206 18.8638 10.312 18.3101 9.9651 17.9734C9.61817 17.6367 9.06446 17.6453 8.72779 17.9922L6.865 19.912V5.92676C6.865 5.44312 6.47364 5.05176 5.99 5.05176C5.50636 5.05176 5.115 5.44312 5.115 5.92676V19.9117L3.25306 17.9922C2.91639 17.6453 2.36268 17.6367 2.01576 17.9734Z"
                fill="#722555"
              />
              <path
                d="M23.5195 11.3076C23.5195 10.824 23.1282 10.4326 22.6445 10.4326H13.1494C12.6658 10.4326 12.2744 10.824 12.2744 11.3076C12.2744 11.7913 12.6658 12.1826 13.1494 12.1826H22.6445C23.1282 12.1826 23.5195 11.7913 23.5195 11.3076Z"
                fill="#722555"
              />
              <path
                d="M20.7894 16.689C20.7894 16.2053 20.3981 15.814 19.9144 15.814H13.1494C12.6658 15.814 12.2744 16.2053 12.2744 16.689C12.2744 17.1726 12.6658 17.564 13.1494 17.564H19.9144C20.3981 17.564 20.7894 17.1726 20.7894 16.689Z"
                fill="#722555"
              />
              <path
                d="M13.1494 21.1982C12.6658 21.1982 12.2744 21.5896 12.2744 22.0732C12.2744 22.5569 12.6658 22.9482 13.1494 22.9482H17.1843C17.668 22.9482 18.0593 22.5569 18.0593 22.0732C18.0593 21.5896 17.668 21.1982 17.1843 21.1982H13.1494Z"
                fill="#722555"
              />
              <path
                d="M25.3746 5.05176H13.1494C12.6658 5.05176 12.2744 5.44312 12.2744 5.92676C12.2744 6.4104 12.6658 6.80176 13.1494 6.80176H25.3746C25.8583 6.80176 26.2496 6.4104 26.2496 5.92676C26.2496 5.44312 25.8583 5.05176 25.3746 5.05176Z"
                fill="#722555"
              />
            </svg>
          </button>

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
                  strokeLinejoin="round"
                />
                <path
                  d="M1 6H11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t("common.action", "Action")}
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  "transition-transform duration-200",
                  showActionDropdown && "rotate-180",
                )}
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showActionDropdown && (
              <div className="absolute right-0 top-[44px] z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] py-2">
                <button
                  onClick={() => {
                    setShowActionDropdown(false);
                    onEditCollectionSettings?.();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.9333 10C12.8444 10.2122 12.8185 10.4441 12.8596 10.6698C12.9007 10.8954 13.0074 11.1044 13.1689 11.2733L13.2067 11.3111C13.3378 11.4421 13.4414 11.5969 13.5116 11.7667C13.5819 11.9364 13.6174 12.1179 13.6174 12.301C13.6174 12.4841 13.5819 12.6656 13.5116 12.8354C13.4414 13.0051 13.3378 13.1599 13.2067 13.2909C13.0757 13.422 12.9208 13.5256 12.7511 13.5959C12.5814 13.6661 12.3999 13.7016 12.2168 13.7016C12.0337 13.7016 11.8522 13.6661 11.6824 13.5959C11.5127 13.5256 11.3579 13.422 11.2268 13.2909L11.189 13.2531C11.0201 13.0916 10.8111 12.9849 10.5855 12.9438C10.3598 12.9027 10.1279 12.9286 9.91556 13.0175C9.70711 13.1023 9.53246 13.2476 9.40961 13.4357C9.28676 13.6238 9.22054 13.846 9.22 14.0733V14.1333C9.22 14.5017 9.07357 14.8549 8.81103 15.1175C8.54849 15.38 8.19535 15.5264 7.82667 15.5264C7.45799 15.5264 7.10485 15.38 6.84231 15.1175C6.57977 14.8549 6.43333 14.5017 6.43333 14.1333V14.0533C6.42817 13.8194 6.35162 13.5926 6.21398 13.4014C6.07634 13.2103 5.88413 13.0639 5.66 12.98C5.44767 12.8911 5.21578 12.8652 4.99014 12.9063C4.7645 12.9474 4.55548 13.0541 4.38667 13.2156L4.34889 13.2533C4.21783 13.3845 4.06301 13.4881 3.89327 13.5583C3.72354 13.6286 3.54203 13.6641 3.35889 13.6641C3.17575 13.6641 2.99424 13.6286 2.82451 13.5583C2.65477 13.4881 2.49995 13.3845 2.36889 13.2533C2.23773 13.1223 2.13413 12.9675 2.06388 12.7977C1.99363 12.628 1.95814 12.4465 1.95814 12.2633C1.95814 12.0802 1.99363 11.8987 2.06388 11.729C2.13413 11.5592 2.23773 11.4044 2.36889 11.2733L2.40667 11.2356C2.56818 11.0667 2.67489 10.8577 2.71598 10.632C2.75707 10.4064 2.73117 10.1745 2.64222 9.96219C2.55742 9.75374 2.4121 9.57908 2.224 9.45624C2.0359 9.33339 1.81368 9.26717 1.58622 9.26663H1.52622C1.15785 9.26663 0.804709 9.1202 0.542169 8.85766C0.279629 8.59512 0.133224 8.24198 0.133224 7.8733C0.133224 7.50462 0.279629 7.15148 0.542169 6.88894C0.804709 6.6264 1.15785 6.47997 1.52622 6.47997H1.60622C1.84016 6.47481 2.06697 6.39826 2.25812 6.26062C2.44927 6.12298 2.59566 5.93077 2.67956 5.70663C2.76849 5.4943 2.79439 5.26241 2.7533 5.03677C2.71221 4.81113 2.6055 4.60211 2.444 4.4333L2.40622 4.39552C2.27506 4.26446 2.17146 4.10964 2.10121 3.9399C2.03096 3.77017 1.99547 3.58866 1.99547 3.40552C1.99547 3.22238 2.03096 3.04087 2.10121 2.87114C2.17146 2.7014 2.27506 2.54658 2.40622 2.41552C2.53728 2.28436 2.6921 2.18076 2.86184 2.11051C3.03157 2.04026 3.21308 2.00477 3.39622 2.00477C3.57936 2.00477 3.76087 2.04026 3.9306 2.11051C4.10034 2.18076 4.25516 2.28436 4.38622 2.41552L4.424 2.4533C4.59281 2.61481 4.80183 2.72152 5.02747 2.76261C5.25311 2.8037 5.485 2.7778 5.69733 2.68885H5.73333C5.94178 2.60405 6.11644 2.45873 6.23929 2.27063C6.36214 2.08253 6.42836 1.86031 6.42889 1.63285V1.57285C6.42889 1.20448 6.57532 0.851338 6.83786 0.588798C7.1004 0.326258 7.45354 0.179834 7.82222 0.179834C8.1909 0.179834 8.54404 0.326258 8.80658 0.588798C9.06912 0.851338 9.21556 1.20448 9.21556 1.57285V1.65285C9.21609 1.88031 9.28231 2.10253 9.40516 2.29063C9.52801 2.47873 9.70267 2.62405 9.91111 2.70885C10.1234 2.7978 10.3553 2.8237 10.581 2.78261C10.8066 2.74152 11.0156 2.63481 11.1844 2.4733L11.2222 2.43552C11.3533 2.30436 11.5081 2.20076 11.6778 2.13051C11.8476 2.06026 12.0291 2.02477 12.2122 2.02477C12.3954 2.02477 12.5769 2.06026 12.7466 2.13051C12.9164 2.20076 13.0712 2.30436 13.2022 2.43552C13.3334 2.56658 13.437 2.7214 13.5072 2.89114C13.5775 3.06087 13.613 3.24238 13.613 3.42552C13.613 3.60866 13.5775 3.79017 13.5072 3.9599C13.437 4.12964 13.3334 4.28446 13.2022 4.41552L13.1644 4.4533C13.0029 4.62211 12.8962 4.83113 12.8551 5.05677C12.814 5.28241 12.8399 5.5143 12.9289 5.72663V5.76263C13.0137 5.97108 13.159 6.14574 13.3471 6.26859C13.5352 6.39144 13.7574 6.45766 13.9849 6.45819H14.0449C14.4132 6.45819 14.7664 6.60462 15.0289 6.86716C15.2915 7.1297 15.4379 7.48284 15.4379 7.85152C15.4379 8.2202 15.2915 8.57334 15.0289 8.83588C14.7664 9.09842 14.4132 9.24485 14.0449 9.24485H13.9649C13.7374 9.24538 13.5152 9.3116 13.3271 9.43445C13.139 9.5573 12.9937 9.73196 12.9089 9.9404C12.82 10.1527 12.7941 10.3846 12.8352 10.6103C12.8763 10.8359 12.983 11.0449 13.1444 11.2137L13.1822 11.2515C13.3134 11.3825 13.417 11.5374 13.4872 11.7071C13.5575 11.8768 13.593 12.0583 13.593 12.2415C13.593 12.4246 13.5575 12.6061 13.4872 12.7759C13.417 12.9456 13.3134 13.1004 13.1822 13.2315C13.0512 13.3626 12.8964 13.4662 12.7266 13.5365C12.5569 13.6067 12.3754 13.6422 12.1922 13.6422C12.0091 13.6422 11.8276 13.6067 11.6579 13.5365C11.4881 13.4662 11.3333 13.3626 11.2022 13.2315L11.1644 13.1937C10.9956 13.0322 10.7866 12.9255 10.5609 12.8844C10.3353 12.8433 10.1034 12.8692 9.89111 12.9582C9.68266 13.043 9.508 13.1883 9.38515 13.3764C9.2623 13.5645 9.19608 13.7867 9.19556 14.0142V14.0742C9.19556 14.4426 9.04913 14.7957 8.78659 15.0583C8.52405 15.3208 8.17091 15.4672 7.80222 15.4672C7.43354 15.4672 7.0804 15.3208 6.81786 15.0583C6.55532 14.7957 6.40889 14.4426 6.40889 14.0742V14.0142C6.40836 13.7867 6.34214 13.5645 6.21929 13.3764C6.09644 13.1883 5.92178 13.043 5.71333 12.9582C5.501 12.8692 5.26911 12.8433 5.04347 12.8844C4.81783 12.9255 4.60881 13.0322 4.44 13.1937L4.40222 13.2315C4.27116 13.3626 4.11634 13.4662 3.9466 13.5365C3.77687 13.6067 3.59536 13.6422 3.41222 13.6422C3.22908 13.6422 3.04757 13.6067 2.87784 13.5365C2.7081 13.4662 2.55328 13.3626 2.42222 13.2315C2.29106 13.1004 2.18746 12.9456 2.11721 12.7759C2.04696 12.6061 2.01147 12.4246 2.01147 12.2415C2.01147 12.0583 2.04696 11.8768 2.11721 11.7071C2.18746 11.5374 2.29106 11.3825 2.42222 11.2515L2.46 11.2137C2.62151 11.0449 2.72822 10.8359 2.76931 10.6103C2.8104 10.3846 2.7845 10.1527 2.69556 9.9404C2.61076 9.73196 2.46544 9.5573 2.27734 9.43445C2.08924 9.3116 1.86702 9.24538 1.63956 9.24485H1.57956C1.21118 9.24485 0.858043 9.09842 0.595503 8.83588C0.332963 8.57334 0.186538 8.2202 0.186538 7.85152C0.186538 7.48284 0.332963 7.1297 0.595503 6.86716C0.858043 6.60462 1.21118 6.45819 1.57956 6.45819H1.65956C1.88702 6.45766 2.10924 6.39144 2.29734 6.26859C2.48544 6.14574 2.63076 5.97108 2.71556 5.76263V5.72663C2.8045 5.5143 2.8304 5.28241 2.78931 5.05677C2.74822 4.83113 2.64151 4.62211 2.48 4.4533L2.44222 4.41552C2.31106 4.28446 2.20746 4.12964 2.13721 3.9599C2.06696 3.79017 2.03147 3.60866 2.03147 3.42552C2.03147 3.24238 2.06696 3.06087 2.13721 2.89114C2.20746 2.7214 2.31106 2.56658 2.44222 2.43552C2.57328 2.30436 2.7281 2.20076 2.89784 2.13051C3.06757 2.06026 3.24908 2.02477 3.43222 2.02477C3.61536 2.02477 3.79687 2.06026 3.9666 2.13051C4.13634 2.20076 4.29116 2.30436 4.42222 2.43552L4.46 2.4733C4.62881 2.63481 4.83783 2.74152 5.06347 2.78261C5.28911 2.8237 5.521 2.7978 5.73333 2.70885C5.94178 2.62405 6.11644 2.47873 6.23929 2.29063C6.36214 2.10253 6.42836 1.88031 6.42889 1.65285V1.59285C6.42889 1.22448 6.57532 0.871338 6.83786 0.608798C7.1004 0.346258 7.45354 0.199834 7.82222 0.199834C8.1909 0.199834 8.54404 0.346258 8.80658 0.608798C9.06912 0.871338 9.21556 1.22448 9.21556 1.59285V1.67285C9.21609 1.90031 9.28231 2.12253 9.40516 2.31063C9.52801 2.49873 9.70267 2.64405 9.91111 2.72885C10.1234 2.8178 10.3553 2.8437 10.581 2.80261C10.8066 2.76152 11.0156 2.65481 11.1844 2.4933L11.2222 2.45552C11.3533 2.32436 11.5081 2.22076 11.6778 2.15051C11.8476 2.08026 12.0291 2.04477 12.2122 2.04477C12.3954 2.04477 12.5769 2.08026 12.7466 2.15051C12.9164 2.22076 13.0712 2.32436 13.2022 2.45552C13.3334 2.58658 13.437 2.7414 13.5072 2.91114C13.5775 3.08087 13.613 3.26238 13.613 3.44552C13.613 3.62866 13.5775 3.81017 13.5072 3.9799C13.437 4.14964 13.3334 4.30446 13.2022 4.43552L13.1644 4.4733C13.0029 4.64211 12.8962 4.85113 12.8551 5.07677C12.814 5.30241 12.8399 5.5343 12.9289 5.74663V5.78263C13.0137 5.99108 13.159 6.16574 13.3471 6.28859C13.5352 6.41144 13.7574 6.47766 13.9849 6.47819H14.0449C14.4132 6.47819 14.7664 6.62462 15.0289 6.88716C15.2915 7.1497 15.4379 7.50284 15.4379 7.87152C15.4379 8.2402 15.2915 8.59334 15.0289 8.85588C14.7664 9.11842 14.4132 9.26485 14.0449 9.26485H13.9849C13.7574 9.26538 13.5352 9.3316 13.3471 9.45445C13.159 9.5773 13.0137 9.75196 12.9289 9.9604"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      d="M2 4H3.33333H14"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.6673 4V13.3333C12.6673 13.687 12.5268 14.0261 12.2768 14.2761C12.0268 14.5262 11.6877 14.6667 11.334 14.6667H4.66732C4.31361 14.6667 3.97456 14.5262 3.72451 14.2761C3.47446 14.0261 3.33398 13.687 3.33398 13.3333V4M5.33398 4V2.66667C5.33398 2.31296 5.47446 1.97391 5.72451 1.72386C5.97456 1.47381 6.31361 1.33333 6.66732 1.33333H9.33398C9.68769 1.33333 10.0267 1.47381 10.2768 1.72386C10.5268 1.97391 10.6673 2.31296 10.6673 2.66667V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.66699 7.33325V11.3333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.33301 7.33325V11.3333"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                strokeLinejoin="round"
              />
              <path
                d="M1 6H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("common.newIssue", "New Issue")}
          </button>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
        {/* New Issue Card - Always First */}
        <NewIssueCard onClick={onNewIssue} />

        {/* Publication Cards */}
        {filteredPublications.map((publication) => (
          <PublicationCard
            key={publication.id}
            publication={publication}
            onEdit={() => onEditPublication?.(publication)}
          />
        ))}
      </div>

      {/* Empty State */}
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

      {/* Empty State for no publications */}
      {filteredPublications.length === 0 && !searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-black/60 font-inter text-lg">
            {t("common.noPublicationsInCollection")}
          </p>
          <p className="text-black/40 font-inter text-sm mt-2">
            {t("common.clickNewIssue")}
          </p>
        </div>
      )}

      {/* Delete Collection Dialog */}
      <DeleteCollectionDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={() => {
          onDeleteCollection?.(collection.id);
        }}
        collectionName={collection.title}
      />
    </div>
  );
}
