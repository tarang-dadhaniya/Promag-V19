import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Dropdown } from "./ui/dropdown";
import { DatePicker } from "./ui/datepicker";

interface AuthorDetailsFormData {
  author: string;
  editor: string;
  language: string;
  releaseDate: string;
  isbnIssn: string;
  presentation: boolean;
  indexOffset: string;
  documentPrintAllowed: boolean;
  status: string;
  previewPages: string;
  orientation: string;
}

interface AuthorDetailsFormProps {
  onSubmit?: (data: AuthorDetailsFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  onPreview?: () => void;
  onDataChange?: (data: AuthorDetailsFormData) => void;
  initialData?: Partial<AuthorDetailsFormData> | null;
  className?: string;
}

// Dropdown options
const languageOptions = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
];

const statusOptions = [
  { value: "done", label: "Done" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
];

const orientationOptions = [
  { value: "test1", label: "Test1" },
  { value: "test2", label: "Test2" },
  { value: "test3", label: "Test3" },
];

const ChevronDown = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5 5L9 1"
      stroke="#212121"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.111 4.4446H2.889C1.846 4.4446 1 5.2903 1 6.3335V15.5557C1 16.5989 1.846 17.4446 2.889 17.4446H14.111C15.154 17.4446 16 16.5989 16 15.5557V6.3335C16 5.2903 15.154 4.4446 14.111 4.4446Z"
      stroke="#212121"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.277 2.5557V6.3334"
      stroke="#212121"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.723 2.5557V6.3334"
      stroke="#212121"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 10.1113H16"
      stroke="#212121"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

interface SelectFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  className?: string;
}

// Remove the old SelectField component as we'll use Dropdown instead

interface DateFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Remove the old DateField component as we'll use DatePicker instead

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
          "w-[18px] h-[18px] rounded border border-[#B4B4B4] bg-white cursor-pointer flex items-center justify-center",
          checked && "bg-promag-primary border-promag-primary",
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
              d="M10.5 1.5L4.125 7.875L1.5 5.25"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <span
        className="text-promag-body font-inter text-sm font-normal cursor-pointer"
        onClick={() => onChange(!checked)}
      >
        {label}
      </span>
    </div>
  );
}

export function AuthorDetailsForm({
  onSubmit,
  onValidationChange,
  onPreview,
  onDataChange,
  initialData,
  className,
}: AuthorDetailsFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AuthorDetailsFormData>({
    author: initialData?.author ?? "",
    editor: initialData?.editor ?? "",
    language: initialData?.language ?? "",
    releaseDate: initialData?.releaseDate ?? "",
    isbnIssn: initialData?.isbnIssn ?? "",
    presentation: initialData?.presentation ?? false,
    indexOffset: initialData?.indexOffset ?? "0",
    documentPrintAllowed: initialData?.documentPrintAllowed ?? false,
    status: initialData?.status ?? "",
    previewPages: initialData?.previewPages ?? "",
    orientation: initialData?.orientation ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const requiredFields = [
      { field: "author", label: t("forms.author") },
      { field: "editor", label: t("forms.editor") },
      { field: "language", label: t("forms.language") },
      { field: "releaseDate", label: t("forms.releaseDate") },
      { field: "isbnIssn", label: t("forms.isbnIssn") },
      { field: "indexOffset", label: t("forms.indexOffset") },
      { field: "status", label: t("forms.status") },
      { field: "previewPages", label: t("forms.previewPages") },
      { field: "orientation", label: t("forms.orientation") },
    ];

    for (const { field, label } of requiredFields) {
      if (!formData[field as keyof AuthorDetailsFormData]) {
        alert(t("forms.validation.fieldRequired", { field: label }));
        return;
      }
    }

    onSubmit?.(formData);
  };

  const updateField =
    (field: keyof AuthorDetailsFormData) => (value: string | boolean) => {
      const newData = {
        ...formData,
        [field]: value,
      };
      setFormData(newData);

      // Check validation after update
      const isValid = validateFormData(newData);
      onValidationChange?.(isValid);
      onDataChange?.(newData as AuthorDetailsFormData);
    };

  const validateFormData = (data: AuthorDetailsFormData): boolean => {
    const requiredStringFields = [
      "author",
      "editor",
      "language",
      "releaseDate",
      "isbnIssn",
      "indexOffset",
      "status",
      "previewPages",
      "orientation",
    ];
    return requiredStringFields.every(
      (field) =>
        data[field as keyof AuthorDetailsFormData] &&
        String(data[field as keyof AuthorDetailsFormData]).trim(),
    );
  };

  return (
    <div className={cn("flex w-full", className)}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        {/* Form Content */}
        <div className="flex p-3 sm:p-5 items-start content-start gap-4 sm:gap-[30px] gap-y-4 sm:gap-y-5 self-stretch flex-wrap rounded-[10px] bg-white">
          {/* Row 1: Author and Editor */}
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

          {/* Row 2: Language and Release Date */}
          <FormField
            label={t("forms.language")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder={t("forms.placeholders.language")}
              value={formData.language}
              onChange={updateField("language")}
              options={languageOptions}
            />
          </FormField>

          <FormField
            label={t("forms.releaseDate")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <DatePicker
              placeholder={t("forms.placeholders.date")}
              value={formData.releaseDate}
              onChange={updateField("releaseDate")}
            />
          </FormField>

          {/* Row 3: ISBN/ISSN with Checkbox and Index Offset with Checkbox */}
          <div className="flex w-full lg:w-[calc(50%-15px)] lg:max-w-[775px] flex-col items-start gap-2">
            <FormField label={t("forms.isbnIssn")} required className="w-full">
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
          </div>

          <div className="flex w-full lg:w-[calc(50%-15px)] lg:max-w-[775px] flex-col items-start gap-2">
            <FormField
              label={t("forms.indexOffset")}
              required
              className="w-full"
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
          </div>

          {/* Row 4: Status and Preview Pages */}
          <FormField
            label={t("forms.status")}
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder={t("forms.placeholders.selectStatus")}
              value={formData.status}
              onChange={updateField("status")}
              options={statusOptions}
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

          {/* Row 5: Orientation - Full Width */}
          <FormField label={t("forms.orientation")} required className="w-full">
            <Dropdown
              placeholder={t("forms.placeholders.selectOrientation")}
              value={formData.orientation}
              onChange={updateField("orientation")}
              options={orientationOptions}
            />
          </FormField>
          <div className="flex justify-end items-center gap-2.5 w-full pt-2">
            <button
              type="button"
              onClick={onPreview}
              className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary/40 text-promag-primary bg-white hover:bg-promag-primary/5 transition-colors"
            >
              {t("common.previous")}
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
