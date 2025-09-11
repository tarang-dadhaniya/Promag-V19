import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface TranslationEntry {
  id: string;
  element: string;
  content: string;
  language: string;
}

interface CompanyTranslationTableProps {
  className?: string;
}

const mockTranslationData: TranslationEntry[] = [
  {
    id: "1",
    element: "header_register",
    content:
      "Create it free and you will always have thee desired document griffeltingal",
    language: "English",
  },
  {
    id: "2",
    element: "test_register",
    content: "Kanto enstellen Password zurukartzen",
    language: "English",
  },
  {
    id: "3",
    element: "button.register",
    content:
      "Create it free and you will always have thee desired document griffeltingal",
    language: "English",
  },
  {
    id: "4",
    element: "header_forgot",
    content: "Reset password",
    language: "English",
  },
];

const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.66797 3.33325H3.83464C3.39261 3.33325 2.96868 3.50885 2.65612 3.82141C2.34356 4.13397 2.16797 4.55789 2.16797 4.99992V16.6666C2.16797 17.1086 2.34356 17.5325 2.65612 17.8451C2.96868 18.1577 3.39261 18.3333 3.83464 18.3333H15.5013C15.9433 18.3333 16.3673 18.1577 16.6798 17.8451C16.9924 17.5325 17.168 17.1086 17.168 16.6666V10.8333"
      stroke="#722555"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.918 2.08344C16.2495 1.75192 16.6991 1.56567 17.168 1.56567C17.6368 1.56567 18.0864 1.75192 18.418 2.08344C18.7495 2.41496 18.9357 2.8646 18.9357 3.33344C18.9357 3.80228 18.7495 4.25192 18.418 4.58344L10.5013 12.5001L7.16797 13.3334L8.0013 10.0001L15.918 2.08344Z"
      stroke="#722555"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 5H4.66667H18"
      stroke="#D9534F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.16797 5.00008V3.33341C7.16797 2.89139 7.34356 2.46746 7.65612 2.1549C7.96868 1.84234 8.39261 1.66675 8.83464 1.66675H12.168C12.61 1.66675 13.0339 1.84234 13.3465 2.1549C13.659 2.46746 13.8346 2.89139 13.8346 3.33341V5.00008M16.3346 5.00008V16.6667C16.3346 17.1088 16.159 17.5327 15.8465 17.8453C15.5339 18.1578 15.11 18.3334 14.668 18.3334H6.33464C5.89261 18.3334 5.46868 18.1578 5.15612 17.8453C4.84356 17.5327 4.66797 17.1088 4.66797 16.6667V5.00008H16.3346Z"
      stroke="#D9534F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.83203 9.16675V14.1667"
      stroke="#D9534F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.168 9.16675V14.1667"
      stroke="#D9534F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.1526 7.83332H11.8506C12.4253 7.83332 12.7306 7.15332 12.3486 6.72332L8.49993 2.39331C8.4375 2.32285 8.36083 2.26644 8.27499 2.2278C8.18914 2.18917 8.09607 2.16919 8.00193 2.16919C7.90779 2.16919 7.81472 2.18917 7.72888 2.2278C7.64303 2.26644 7.56636 2.32285 7.50393 2.39331L3.65393 6.72332C3.27193 7.15332 3.57726 7.83332 4.1526 7.83332ZM7.50326 14.606C7.56569 14.6764 7.64236 14.7329 7.72821 14.7715C7.81406 14.8101 7.90712 14.8301 8.00126 14.8301C8.0954 14.8301 8.18847 14.8101 8.27432 14.7715C8.36017 14.7329 8.43684 14.6764 8.49926 14.606L12.3479 10.276C12.7306 9.84665 12.4253 9.16665 11.8499 9.16665H4.1526C3.57793 9.16665 3.2726 9.84665 3.6546 10.2766L7.50326 14.606Z"
      fill="#9E9E9E"
    />
  </svg>
);

export function CompanyTranslationTable({
  className,
}: CompanyTranslationTableProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [translations, setTranslations] =
    useState<TranslationEntry[]>(mockTranslationData);
  const [sortField, setSortField] = useState<keyof TranslationEntry | null>(
    null,
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredTranslations = translations.filter(
    (translation) =>
      translation.element.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.language.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSort = (field: keyof TranslationEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTranslations = [...filteredTranslations].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleEdit = (translation: TranslationEntry) => {
    console.log("Edit translation:", translation);
    // TODO: Open edit dialog/modal
  };

  const handleDelete = (translation: TranslationEntry) => {
    setTranslations((prev) => prev.filter((t) => t.id !== translation.id));
  };

  const handleAddNew = () => {
    const newTranslation: TranslationEntry = {
      id: Date.now().toString(),
      element: "new_element",
      content: "New content to translate",
      language: "English",
    };
    setTranslations((prev) => [...prev, newTranslation]);
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-inter font-medium">
        <span className="text-promag-body/70">{t("menu.manageCompany")}</span>
        <span className="text-promag-body/70">/</span>
        <span className="text-promag-primary">
          {t("translation.table.title")}
        </span>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <div className="flex w-full max-w-[497px] h-[42px] px-[15px] items-center gap-3 rounded-lg border border-[#DDD] bg-white">
          <Input
            type="text"
            placeholder={t("translation.table.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-0 p-0 text-black/50 font-inter text-sm font-normal outline-none placeholder:text-black/50 focus-visible:ring-0"
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
          <Button
            variant="outline"
            size="icon"
            className="w-[42px] h-[42px] border-promag-primary text-promag-primary hover:bg-promag-primary/5"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          {/* Add New Translation Button */}
          <Button
            onClick={handleAddNew}
            className="h-[42px] px-5 bg-promag-primary hover:bg-promag-primary/90 text-white font-inter text-sm font-medium"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
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
            {t("translation.table.addNew")}
          </Button>
        </div>
      </div>

      {/* Translation Table */}
      <div className="w-full rounded-lg border border-[rgba(222,230,237,0.87)] bg-white overflow-hidden">
        <Table>
          <TableHeader className="bg-promag-primary">
            <TableRow className="border-white hover:bg-promag-primary">
              <TableHead
                className="text-white font-inter text-sm font-bold uppercase cursor-pointer"
                onClick={() => handleSort("element")}
              >
                <div className="flex items-center gap-2 px-5 py-4">
                  <span className="pl-5">{t("translation.table.element")}</span>
                </div>
              </TableHead>
              <TableHead
                className="text-white font-inter text-sm font-bold uppercase cursor-pointer"
                onClick={() => handleSort("content")}
              >
                <div className="flex items-center gap-1">
                  <span>{t("translation.table.content")}</span>
                  <SortIcon />
                </div>
              </TableHead>
              <TableHead
                className="text-white font-inter text-sm font-bold uppercase cursor-pointer"
                onClick={() => handleSort("language")}
              >
                <div className="flex items-center gap-2">
                  <span>{t("translation.table.language")}</span>
                </div>
              </TableHead>
              <TableHead className="text-white font-inter text-sm font-bold uppercase text-center">
                <span>{t("translation.table.options")}</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTranslations.map((translation, index) => (
              <TableRow
                key={translation.id}
                className={cn(
                  "border-0",
                  index % 2 === 0 ? "bg-promag-background" : "bg-white",
                )}
              >
                <TableCell className="font-inter text-sm text-black px-6 py-4">
                  <div className="pl-5">{translation.element}</div>
                </TableCell>
                <TableCell className="font-inter text-sm text-black px-4 py-4">
                  <div className="max-w-md truncate">{translation.content}</div>
                </TableCell>
                <TableCell className="font-inter text-sm text-black px-4 py-4">
                  {translation.language}
                </TableCell>
                <TableCell className="px-4 py-4">
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(translation)}
                      className="h-8 w-8 p-0 hover:bg-transparent"
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(translation)}
                      className="h-8 w-8 p-0 hover:bg-transparent"
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Empty State */}
      {sortedTranslations.length === 0 && searchQuery && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-black/60 font-inter text-lg">
            {t("translation.table.noTranslationsFound", { query: searchQuery })}
          </p>
          <p className="text-black/40 font-inter text-sm mt-2">
            {t("common.tryAdjustingSearch")}
          </p>
        </div>
      )}
    </div>
  );
}
