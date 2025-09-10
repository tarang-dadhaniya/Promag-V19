import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dropdown } from "./ui/dropdown";
import { useTranslation } from "react-i18next";

interface DropdownOption {
  value: string;
  label: string;
}

interface IssueDetailsFormData {
  name: string;
  topicsCategory: string;
  collection: string;
  edition: string;
  teaser: string;
  description: string;
}

interface IssueDetailsFormProps {
  onSubmit?: (data: IssueDetailsFormData) => void;
  onValidationChange?: (isValid: boolean) => void;
  onPreview?: () => void;
  onDataChange?: (data: IssueDetailsFormData) => void;
  initialData?: Partial<IssueDetailsFormData> | null;
  className?: string;
  categoriesOptions: DropdownOption[];
  collectionOptions: DropdownOption[];
}

const ChevronDown = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L5 5L9 1" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

function FormField({ label, required = false, children, className }: FormFieldProps) {
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

function InputField({ placeholder, value, onChange, className }: InputFieldProps) {
  return (
    <div className={cn(
      "flex h-[42px] px-[14px] py-2.5 items-center gap-2.5 self-stretch",
      "rounded border border-promag-input-border bg-white",
      className
    )}>
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

interface TextareaFieldProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function TextareaField({ placeholder, value, onChange, className }: TextareaFieldProps) {
  return (
    <div className={cn(
      "flex px-[14px] py-2.5 items-start gap-2.5 flex-1 self-stretch",
      "rounded border border-promag-input-border bg-white",
      className
    )}>
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

export function IssueDetailsForm({ onSubmit, onValidationChange, onPreview, onDataChange, initialData, className, categoriesOptions, collectionOptions }: IssueDetailsFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<IssueDetailsFormData>({
    name: initialData?.name ?? "",
    topicsCategory: initialData?.topicsCategory ?? "",
    collection: initialData?.collection ?? "",
    edition: initialData?.edition ?? "",
    teaser: initialData?.teaser ?? "",
    description: initialData?.description ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }
    if (!formData.topicsCategory.trim()) {
      alert("Topics/Category is required");
      return;
    }
    if (!formData.collection.trim()) {
      alert("Collection is required");
      return;
    }
    if (!formData.description.trim()) {
      alert("Description is required");
      return;
    }

    onSubmit?.(formData);
  };

  const updateField = (field: keyof IssueDetailsFormData) => (value: string) => {
    const newData = {
      ...formData,
      [field]: value
    };
    setFormData(newData);

    // Check validation after update
    const isValid = validateFormData(newData);
    onValidationChange?.(isValid);
    onDataChange?.(newData);
  };

  const validateFormData = (data: IssueDetailsFormData): boolean => {
    return !!(data.name.trim() && data.topicsCategory.trim() && data.collection.trim() && data.description.trim());
  };

  return (
    <div className={cn("flex w-full", className)}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
        {/* Form Content */}
        <div className="flex p-3 sm:p-5 items-start content-start gap-4 sm:gap-[30px] gap-y-4 sm:gap-y-5 self-stretch flex-wrap rounded-[10px] bg-white">
          {/* Row 1: Name and Topics/Category */}
          <FormField
            label="Name"
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder="Enter Issue Name"
              value={formData.name}
              onChange={updateField("name")}
            />
          </FormField>

          <FormField
            label="Topics/Category"
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder="Select Category"
              value={formData.topicsCategory}
              onChange={updateField("topicsCategory")}
              options={categoriesOptions}
            />
          </FormField>

          {/* Row 2: Collection and Edition */}
          <FormField
            label="Collection"
            required
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <Dropdown
              placeholder="Select Collection"
              value={formData.collection}
              onChange={updateField("collection")}
              options={collectionOptions}
            />
          </FormField>

          <FormField
            label="Edition(Optional)"
            className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
          >
            <InputField
              placeholder="Enter Edition"
              value={formData.edition}
              onChange={updateField("edition")}
            />
          </FormField>

          {/* Row 3: Teaser - Full Width */}
          <FormField
            label="Teaser"
            className="w-full"
          >
            <TextareaField
              placeholder="Enter Teaser"
              value={formData.teaser}
              onChange={updateField("teaser")}
            />
          </FormField>

          {/* Row 4: Description - Full Width */}
          <FormField
            label="Description"
            required
            className="w-full"
          >
            <TextareaField
              placeholder="Enter Description"
              value={formData.description}
              onChange={updateField("description")}
            />
          </FormField>
          <div className="flex justify-end items-center gap-2.5 w-full pt-2">
            <button type="button" onClick={onPreview} className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary/40 text-promag-primary bg-white hover:bg-promag-primary/5 transition-colors">{t("common.previous")}</button>
            <button type="submit" className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors">{t("common.next")}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
