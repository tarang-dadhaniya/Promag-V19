import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Dropdown } from "./ui/dropdown";

interface DropdownOption {
  value: string;
  label: string;
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

interface Collection {
  id: string;
  title: string;
  coverImage?: string;
  createdAt: Date;
}

interface EditPublicationFormProps {
  publication: Publication;
  collections: Collection[];
  categoriesOptions: DropdownOption[];
  onSave: (updatedPublication: Publication) => void;
  onCancel: () => void;
  className?: string;
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

export function EditPublicationForm({
  publication,
  collections,
  categoriesOptions,
  onSave,
  onCancel,
  className,
}: EditPublicationFormProps) {
  const [formData, setFormData] = useState({
    title: publication.title || "",
    category: publication.category || "",
    collection: publication.collectionId || "",
    edition: publication.edition || "",
    teaser: publication.teaser || "",
    description: publication.description || "",
    status: publication.status || "draft",
  });

  const [newCoverImage, setNewCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const collectionOptions = collections.map((c) => ({
    value: c.id,
    label: c.title,
  }));

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "pending", label: "Pending Review" },
  ];

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = useCallback(async (file: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a PNG or JPEG image file.");
      return;
    }

    const maxSize = 8 * 1024 * 1024; // 8MB
    if (file.size > maxSize) {
      alert("File size must be less than 8MB.");
      return;
    }

    try {
      const dataUrl = await convertFileToBase64(file);
      setNewCoverImage(dataUrl);
    } catch (error) {
      console.error("Error converting file to base64:", error);
      alert("Failed to process the image. Please try again.");
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload],
  );

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Basic validation
    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    const updatedPublication: Publication = {
      ...publication,
      title: formData.title.trim(),
      category: formData.category,
      collectionId: formData.collection,
      edition: formData.edition,
      teaser: formData.teaser,
      description: formData.description,
      status: formData.status as "draft" | "published" | "pending",
      coverImage: newCoverImage || publication.coverImage,
    };

    onSave(updatedPublication);
  };

  const displayImage = newCoverImage || publication.coverImage;

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-black/60 hover:text-black transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 12L6 8L10 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="font-inter text-sm">{t("forms.backToPublications")}</span>
          </button>
        </div>
        <h1 className="text-black font-inter text-xl font-semibold">
          Edit Publication
        </h1>
      </div>

      {/* Form */}
      <div className="flex w-full">
        <div className="flex w-full flex-col gap-5">
          {/* Cover Image Section */}
          <div className="flex p-3 sm:p-5 items-start content-start gap-4 sm:gap-[30px] gap-y-4 sm:gap-y-5 self-stretch flex-wrap rounded-[10px] bg-white">
            <FormField label="Cover Image" className="w-full">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Current Image Preview */}
                {displayImage && (
                  <div className="relative">
                    <img
                      src={displayImage}
                      alt="Publication cover"
                      className="w-[120px] h-[150px] object-cover rounded-lg border border-gray-200"
                    />
                    {newCoverImage && (
                      <button
                        onClick={() => setNewCoverImage(null)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 21 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.89147 12.9834C7.73314 12.9834 7.5748 12.925 7.4498 12.8C7.20814 12.5584 7.20814 12.1584 7.4498 11.9167L12.1665 7.20005C12.4081 6.95838 12.8081 6.95838 13.0498 7.20005C13.2915 7.44172 13.2915 7.84172 13.0498 8.08338L8.33314 12.8C8.21647 12.925 8.0498 12.9834 7.89147 12.9834Z"
                            fill="white"
                          />
                          <path
                            d="M12.6081 12.9834C12.4498 12.9834 12.2915 12.925 12.1665 12.8L7.4498 8.08338C7.20814 7.84172 7.20814 7.44172 7.4498 7.20005C7.69147 6.95838 8.09147 6.95838 8.33314 7.20005L13.0498 11.9167C13.2915 12.1584 13.2915 12.5584 13.0498 12.8C12.9248 12.925 12.7665 12.9834 12.6081 12.9834Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-[42px] px-5 py-[10px] justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-white text-promag-primary font-inter text-sm font-medium hover:bg-promag-primary/5 transition-colors"
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
                    {displayImage ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="text-black/60 font-inter text-xs">
                    PNG or JPEG, max 8MB
                  </p>
                </div>
              </div>
            </FormField>
          </div>

          {/* Form Fields */}
          <div className="flex p-3 sm:p-5 items-start content-start gap-4 sm:gap-[30px] gap-y-4 sm:gap-y-5 self-stretch flex-wrap rounded-[10px] bg-white">
            {/* Row 1: Title and Category */}
            <FormField
              label="Title"
              required
              className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
            >
              <InputField
                placeholder={t("forms.placeholders.publicationTitle")}
                value={formData.title}
                onChange={updateField("title")}
              />
            </FormField>

            <FormField
              label={t("forms.topicsCategory")}
              className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
            >
              <Dropdown
                placeholder={t("forms.placeholders.selectCategory")}
                value={formData.category}
                onChange={updateField("category")}
                options={categoriesOptions}
              />
            </FormField>

            {/* Row 2: Collection and Status */}
            <FormField
              label="Collection"
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
              label={t("forms.status")}
              className="w-full lg:w-[calc(50%-15px)] lg:max-w-[775px]"
            >
              <Dropdown
                placeholder={t("forms.placeholders.selectStatus")}
                value={formData.status}
                onChange={updateField("status")}
                options={statusOptions}
              />
            </FormField>

            {/* Row 3: Edition - Full Width */}
            <FormField label={t("forms.editionOptional")} className="w-full">
              <InputField
                placeholder={t("forms.placeholders.edition")}
                value={formData.edition}
                onChange={updateField("edition")}
              />
            </FormField>

            {/* Row 4: Teaser - Full Width */}
            <FormField label={t("forms.teaser")} className="w-full">
              <TextareaField
                placeholder={t("forms.placeholders.teaser")}
                value={formData.teaser}
                onChange={updateField("teaser")}
              />
            </FormField>

            {/* Row 5: Description - Full Width */}
            <FormField label={t("forms.description")} className="w-full">
              <TextareaField
                placeholder={t("forms.placeholders.description")}
                value={formData.description}
                onChange={updateField("description")}
              />
            </FormField>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-2.5 w-full pt-2">
              <button
                onClick={onCancel}
                className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-gray-300 bg-white text-gray-700 font-inter text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border border-promag-primary bg-promag-primary text-white font-inter text-sm font-medium hover:bg-promag-primary/90 transition-colors"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
