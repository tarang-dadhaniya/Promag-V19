import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Dropdown } from "./ui/dropdown";
import { Stepper } from "./ui/stepper";
import { Calendar } from "lucide-react";

interface PublicationDetailsFormData {
  name: string;
  topicsCategory: string;
  collection: string;
  edition: string;
  teaser: string;
  description: string;
  author: string;
  editor: string;
  language: string;
  releaseDate: string;
  isbnIssn: string;
  indexOffset: string;
  documentPrintAllowed: boolean;
  status: string;
  previewPages: string;
  orientation: string;
  presentation: boolean;
}

interface DropdownOption {
  value: string;
  label: string;
}

interface PublicationDetailsFormProps {
  onSubmit?: (data: PublicationDetailsFormData) => void;
  onCancel?: () => void;
  onGoToCollections?: () => void;
  onGoToPublications?: () => void;
  initialData?: Partial<PublicationDetailsFormData> | null;
  className?: string;
  categoriesOptions?: DropdownOption[];
  collectionOptions?: DropdownOption[];
  languageOptions?: DropdownOption[];
  statusOptions?: DropdownOption[];
  orientationOptions?: DropdownOption[];
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormField({
  label,
  required = false,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <label className="self-stretch text-promag-body font-inter text-sm font-medium">
        {label}
        {required && <span className="text-promag-error">*</span>}
      </label>
      {children}
    </div>
  );
}

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function InputField({
  placeholder,
  value,
  onChange,
  className,
}: InputFieldProps) {
  return (
    <div
      className={cn(
        "flex h-[42px] px-[14px] py-2.5 items-center gap-2.5 self-stretch",
        "rounded border border-promag-input-border bg-white",
        className,
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 text-promag-body font-inter text-sm font-normal placeholder:text-promag-placeholder bg-transparent border-none outline-none"
      />
    </div>
  );
}

interface TextareaFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function TextareaField({
  placeholder,
  value,
  onChange,
  className,
}: TextareaFieldProps) {
  return (
    <div
      className={cn(
        "flex px-[14px] py-2.5 items-start gap-2.5 flex-1 self-stretch",
        "rounded border border-promag-input-border bg-white",
        className,
      )}
    >
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="flex-1 text-promag-body font-inter text-sm font-normal placeholder:text-promag-placeholder bg-transparent border-none outline-none resize-none"
      />
    </div>
  );
}

interface DatePickerFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function DatePickerField({
  placeholder,
  value,
  onChange,
  className,
}: DatePickerFieldProps) {
  return (
    <div
      className={cn(
        "flex h-[42px] px-[14px] py-2.5 justify-between items-center flex-shrink-0 self-stretch",
        "rounded border border-promag-input-border bg-white",
        className,
      )}
    >
      <span
        className={cn(
          "font-inter text-sm font-normal",
          value ? "text-promag-body" : "text-promag-placeholder",
        )}
      >
        {value || placeholder}
      </span>
      <Calendar size={18} color="#212121" />
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

function CheckboxField({
  label,
  checked,
  onChange,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={cn("flex pt-[5px] items-start gap-2", className)}>
      <div
        className={cn(
          "w-[18px] h-[18px] border rounded-[3px] cursor-pointer flex items-center justify-center",
          checked
            ? "border-promag-primary bg-promag-primary"
            : "border-[#B4B4B4] bg-white",
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && (
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4.5L4.5 8L11 1.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <label
        className="flex-1 text-promag-body font-inter text-sm font-medium cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        {label}
      </label>
    </div>
  );
}

// Localized defaults will be created inside the component using useTranslation

export function PublicationDetailsForm({
  onSubmit,
  onCancel,
  onGoToCollections,
  onGoToPublications,
  initialData,
  className,
  categoriesOptions,
  collectionOptions = [],
  languageOptions,
  statusOptions,
  orientationOptions,
}: PublicationDetailsFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<PublicationDetailsFormData>({
    name: initialData?.name ?? "",
    topicsCategory: initialData?.topicsCategory ?? "",
    collection: initialData?.collection ?? "",
    edition: initialData?.edition ?? "",
    teaser: initialData?.teaser ?? "",
    description: initialData?.description ?? "",
    author: initialData?.author ?? "",
    editor: initialData?.editor ?? "",
    language: initialData?.language ?? "",
    releaseDate: initialData?.releaseDate ?? "",
    isbnIssn: initialData?.isbnIssn ?? "",
    indexOffset: initialData?.indexOffset ?? "0",
    documentPrintAllowed: initialData?.documentPrintAllowed ?? false,
    status: initialData?.status ?? "",
    previewPages: initialData?.previewPages ?? "",
    orientation: initialData?.orientation ?? "",
    presentation: initialData?.presentation ?? false,
  });

  const stepperSteps = [
    { id: "step1", number: "01", current: true, completed: false },
    { id: "step2", number: "02", current: false, completed: false },
    { id: "step3", number: "03", current: false, completed: false },
    { id: "step4", number: "04", current: false, completed: false },
    { id: "step5", number: "05", current: false, completed: false },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation for required fields
    const requiredFields = [
      "name",
      "topicsCategory",
      "collection",
      "description",
      "author",
      "editor",
      "language",
      "releaseDate",
      "isbnIssn",
      "status",
      "previewPages",
      "orientation",
    ];

    for (const field of requiredFields) {
      if (
        !formData[field as keyof PublicationDetailsFormData]?.toString().trim()
      ) {
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return;
      }
    }

    onSubmit?.(formData);
  };

  const updateField =
    (field: keyof PublicationDetailsFormData) => (value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  // Build localized defaults if not provided
  const localizedCategories = categoriesOptions ?? [
    { value: "action", label: t("categories.action") },
    { value: "cinematic", label: t("categories.cinematic") },
    { value: "comic", label: t("categories.comic") },
    { value: "drama", label: t("categories.drama") },
    { value: "education", label: t("categories.education") },
  ];
  const localizedLanguageOptions = languageOptions ?? [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
  ];
  const localizedStatusOptions = statusOptions ?? [
    { value: "draft", label: t("publication.status.draft") },
    { value: "published", label: t("publication.status.live") },
    { value: "pending", label: t("common.pending") },
  ];
  const localizedOrientationOptions = orientationOptions ?? [
    { value: "portrait", label: "Portrait" },
    { value: "landscape", label: "Landscape" },
  ];

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-inter font-medium">
        <button
          type="button"
          onClick={() => onGoToCollections?.()}
          className="text-promag-body/70 hover:text-promag-primary hover:underline underline-offset-4"
        >
          {t("common.collections")}
        </button>
        <span className="text-promag-body/70">/</span>
        <button
          type="button"
          onClick={() => onGoToPublications?.()}
          className="text-promag-body/70 hover:text-promag-primary hover:underline underline-offset-4"
        >
          {t("common.publications")}
        </button>
        <span className="text-promag-body/70">/</span>
        <span className="text-black">
          {formData.name || initialData?.name || t("common.publications")}
        </span>
      </div>

      {/* Stepper */}
      <div className="flex flex-col justify-center items-center gap-2.5 self-stretch">
        <Stepper steps={stepperSteps} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        <div className="flex p-5 items-start content-start gap-[30px] gap-y-5 self-stretch flex-wrap rounded-[10px] bg-white">
          {/* Row 1: Name and Topics/Category */}
          <FormField
            label={t("forms.name")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.issueName")}
              value={formData.name}
              onChange={updateField("name")}
            />
          </FormField>

          <FormField
            label={t("forms.topicsCategory")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder={t("forms.placeholders.selectCategory")}
              value={formData.topicsCategory}
              onChange={updateField("topicsCategory")}
              options={localizedCategories}
            />
          </FormField>

          {/* Row 2: Collection and Edition */}
          <FormField
            label={t("forms.collection")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder={t("forms.placeholders.selectCollection")}
              value={formData.collection}
              onChange={updateField("collection")}
              options={collectionOptions}
            />
          </FormField>

          <FormField
            label={t("forms.editionOptional")}
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.edition")}
              value={formData.edition}
              onChange={updateField("edition")}
            />
          </FormField>

          {/* Row 3: Teaser - Full Width */}
          <FormField label={t("forms.teaser")} className="w-full">
            <TextareaField
              placeholder={t("forms.placeholders.teaser")}
              value={formData.teaser}
              onChange={updateField("teaser")}
            />
          </FormField>

          {/* Row 4: Description - Full Width */}
          <FormField label={t("forms.description")} required className="w-full">
            <TextareaField
              placeholder={t("forms.placeholders.description")}
              value={formData.description}
              onChange={updateField("description")}
            />
          </FormField>

          {/* Row 5: Author and Editor */}
          <FormField
            label={t("forms.author")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.author")}
              value={formData.author}
              onChange={updateField("author")}
            />
          </FormField>

          <FormField
            label={t("forms.editor")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.editor")}
              value={formData.editor}
              onChange={updateField("editor")}
            />
          </FormField>

          {/* Row 6: Language and Release Date */}
          <FormField
            label={t("forms.language")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder={t("forms.placeholders.language")}
              value={formData.language}
              onChange={updateField("language")}
              options={localizedLanguageOptions}
            />
          </FormField>

          <FormField
            label={t("forms.releaseDate")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <DatePickerField
              placeholder={t("forms.placeholders.date")}
              value={formData.releaseDate}
              onChange={updateField("releaseDate")}
            />
          </FormField>

          {/* Row 7: ISBN/ISSN with Presentation checkbox */}
          <FormField
            label={t("forms.isbnIssn")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.isbnIssn")}
              value={formData.isbnIssn}
              onChange={updateField("isbnIssn")}
            />
            <CheckboxField
              label={t("forms.presentation")}
              checked={formData.presentation}
              onChange={updateField("presentation")}
            />
          </FormField>

          {/* Row 8: Index Offset with Document Print Allowed checkbox */}
          <FormField
            label={t("forms.indexOffset")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.indexOffset")}
              value={formData.indexOffset}
              onChange={updateField("indexOffset")}
            />
            <CheckboxField
              label={t("forms.documentPrintAllowed")}
              checked={formData.documentPrintAllowed}
              onChange={updateField("documentPrintAllowed")}
            />
          </FormField>

          {/* Row 9: Status and Preview Pages */}
          <FormField
            label={t("forms.status")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder={t("forms.placeholders.selectStatus")}
              value={formData.status}
              onChange={updateField("status")}
              options={localizedStatusOptions}
            />
          </FormField>

          <FormField
            label={t("forms.previewPages")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder={t("forms.placeholders.pages")}
              value={formData.previewPages}
              onChange={updateField("previewPages")}
            />
          </FormField>

          {/* Row 10: Orientation - Full Width */}
          <FormField label={t("forms.orientation")} required className="w-full">
            <Dropdown
              placeholder={t("forms.placeholders.selectOrientation")}
              value={formData.orientation}
              onChange={updateField("orientation")}
              options={localizedOrientationOptions}
            />
          </FormField>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-2.5 w-full">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-[41px] px-5 py-3 justify-center items-center gap-2.5 rounded bg-[#D9D9D9] text-promag-body font-inter text-sm font-medium hover:bg-[#D9D9D9]/80 transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
            >
              {t("common.save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
