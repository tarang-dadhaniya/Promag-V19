import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShareDialog } from "./ShareDialog";
import { useTranslation } from "react-i18next";

interface Collection {
  id: string;
  title: string;
  coverImage?: string;
  createdAt: Date;
}

interface CollectionsPageProps {
  collections: Collection[];
  onCreateCollection: () => void;
  onSelectCollection: (collection: Collection) => void;
  onBackToCollections?: () => void;
  className?: string;
}

const CreateCollectionCard = ({ onClick }: { onClick: () => void }) => {
  const { t } = useTranslation();
  return (
    <div
      onClick={onClick}
      className="flex w-full min-h-[300px] max-h-[385px] flex-col items-center justify-center border border-dashed border-[#DEE6ED] rounded-lg bg-white cursor-pointer hover:border-promag-primary/50 transition-colors group"
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
          {t("common.createCollection")}
        </h3>
      </div>
    </div>
  );
};

const CollectionCard = ({
  collection,
  onClick,
}: {
  collection: Collection;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex w-full max-h-[385px] flex-col bg-white rounded-lg border border-[#DEE6ED] overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group relative"
  >
    <div className="flex-1 bg-white flex items-center justify-center">
      {collection.coverImage ? (
        <img
          src={collection.coverImage}
          alt={collection.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21H3V3"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 10L17 6L13 10L8 5L3 10"
              stroke="#9CA3AF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* Overlay with title */}
    </div>
    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
      <h3 className="text-white font-inter text-lg font-medium text-center break-words">
        {collection.title}
      </h3>
    </div>
  </div>
);

export function CollectionsPage({
  collections,
  onCreateCollection,
  onSelectCollection,
  onBackToCollections,
  className,
}: CollectionsPageProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);

  const filteredCollections = collections.filter((collection) =>
    collection.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

          {/* Create Collection Button */}
          <button
            onClick={onCreateCollection}
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
            {t("common.createCollection")}
          </button>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 sm:gap-[30px]">
        {/* Create Collection Card - Always First */}
        <CreateCollectionCard onClick={onCreateCollection} />

        {/* Collection Cards */}
        {filteredCollections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onClick={() => onSelectCollection(collection)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCollections.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-black/60 font-inter text-lg">
            {t("common.noCollectionsFound", { query: searchQuery })}
          </p>
          <p className="text-black/40 font-inter text-sm mt-2">
            {t("common.tryAdjustingSearch")}
          </p>
        </div>
      )}

      <ShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        shareUrl="https://example.com/collections"
      />
    </div>
  );
}
