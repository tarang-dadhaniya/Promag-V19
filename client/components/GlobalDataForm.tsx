import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface GlobalDataFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publicationData?: any;
  onSave?: (data: any) => void;
  onNext?: () => void;
}

interface FormData {
  name: string;
  topicsCategory: string;
  collection: string;
  edition: string;
  teaser: string;
  description: string;
  author: string;
  editor: string;
  language: string;
  releaseDate: Date | undefined;
  isbnIssn: string;
  presentation: boolean;
  indexOffset: string;
  documentPrintAllowed: boolean;
  status: string;
  previewPages: string;
  orientation: string;
}

const stepperSteps = [
  { number: "01", active: true },
  { number: "02", active: false },
  { number: "03", active: false },
  { number: "04", active: false },
];

export function GlobalDataForm({ open, onOpenChange, publicationData, onSave }: GlobalDataFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: publicationData?.title || "",
    topicsCategory: publicationData?.category || "",
    collection: publicationData?.collectionId || "",
    edition: publicationData?.edition || "",
    teaser: publicationData?.teaser || "",
    description: publicationData?.description || "",
    author: "",
    editor: "",
    language: "",
    releaseDate: undefined,
    isbnIssn: "",
    presentation: false,
    indexOffset: "0",
    documentPrintAllowed: false,
    status: publicationData?.status || "",
    previewPages: "",
    orientation: "",
  });


  const handleInputChange = (field: keyof FormData, value: string | boolean | Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, boolean>> = {};
    
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.topicsCategory) newErrors.topicsCategory = true;
    if (!formData.collection) newErrors.collection = true;
    if (!formData.description.trim()) newErrors.description = true;
    if (!formData.author.trim()) newErrors.author = true;
    if (!formData.editor.trim()) newErrors.editor = true;
    if (!formData.language) newErrors.language = true;
    if (!formData.releaseDate) newErrors.releaseDate = true;
    if (!formData.isbnIssn.trim()) newErrors.isbnIssn = true;
    if (!formData.status) newErrors.status = true;
    if (!formData.previewPages.trim()) newErrors.previewPages = true;
    if (!formData.orientation) newErrors.orientation = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-[1680px] max-h-[90vh] mx-4 bg-[#F5F5F5] rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 bg-white shadow-sm">
          <h2 className="text-promag-body font-manrope text-base font-semibold">Global Data</h2>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Breadcrumb */}
          <div className="flex items-center gap-4 mb-5">
            <div className="text-black font-inter text-sm font-medium">
              <span className="text-black/60">Collections / Publications </span>
              <span className="text-black">/ Selected Publication Name</span>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-center items-center gap-2.5 mb-5">
            {stepperSteps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={cn(
                  "flex w-10 h-10 items-center justify-center rounded-full border-2 text-center font-medium",
                  step.active 
                    ? "border-promag-primary bg-promag-primary text-white" 
                    : "border-[#ABB7C2] text-[#ABB7C2]"
                )}>
                  {step.number}
                </div>
                {index < stepperSteps.length - 1 && (
                  <div className="w-[300px] h-[3px] bg-[#ABB7C2] mx-2.5" />
                )}
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Name */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.name && "text-red-500")}>
                  Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Issue Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={cn("mt-2", errors.name && "border-red-500")}
                />
              </div>

              {/* Topics/Category */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.topicsCategory && "text-red-500")}>
                  Topics/Category<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.topicsCategory} onValueChange={(value) => handleInputChange('topicsCategory', value)}>
                  <SelectTrigger className={cn("mt-2", errors.topicsCategory && "border-red-500")}>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="comic">Comic</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Collection */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.collection && "text-red-500")}>
                  Collection<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.collection} onValueChange={(value) => handleInputChange('collection', value)}>
                  <SelectTrigger className={cn("mt-2", errors.collection && "border-red-500")}>
                    <SelectValue placeholder="Select Collection" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collection1">Collection 1</SelectItem>
                    <SelectItem value="collection2">Collection 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Edition */}
              <div className="lg:col-span-1">
                <Label className="text-sm font-medium">Edition(Optional)</Label>
                <Input
                  placeholder="Enter Edition"
                  value={formData.edition}
                  onChange={(e) => handleInputChange('edition', e.target.value)}
                  className="mt-2"
                />
              </div>

              {/* Teaser */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium">Teaser</Label>
                <Textarea
                  placeholder="Enter Teaser"
                  value={formData.teaser}
                  onChange={(e) => handleInputChange('teaser', e.target.value)}
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* Description */}
              <div className="lg:col-span-2">
                <Label className={cn("text-sm font-medium", errors.description && "text-red-500")}>
                  Description<span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={cn("mt-2 min-h-[100px]", errors.description && "border-red-500")}
                />
              </div>

              {/* Author */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.author && "text-red-500")}>
                  Author<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Author"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className={cn("mt-2", errors.author && "border-red-500")}
                />
              </div>

              {/* Editor */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.editor && "text-red-500")}>
                  Editor<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Editor"
                  value={formData.editor}
                  onChange={(e) => handleInputChange('editor', e.target.value)}
                  className={cn("mt-2", errors.editor && "border-red-500")}
                />
              </div>

              {/* Language */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.language && "text-red-500")}>
                  Language<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                  <SelectTrigger className={cn("mt-2", errors.language && "border-red-500")}>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Release Date */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.releaseDate && "text-red-500")}>
                  Release Date<span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-between mt-2",
                        !formData.releaseDate && "text-muted-foreground",
                        errors.releaseDate && "border-red-500"
                      )}
                    >
                      {formData.releaseDate ? format(formData.releaseDate, "dd-MM-yyyy") : "DD-MM-YYYY"}
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.releaseDate}
                      onSelect={(date) => handleInputChange('releaseDate', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* ISBN/ISSN with Presentation checkbox */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.isbnIssn && "text-red-500")}>
                  ISBN/ISSN<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter ISBN/ISSN"
                  value={formData.isbnIssn}
                  onChange={(e) => handleInputChange('isbnIssn', e.target.value)}
                  className={cn("mt-2", errors.isbnIssn && "border-red-500")}
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="presentation"
                    checked={formData.presentation}
                    onCheckedChange={(checked) => handleInputChange('presentation', !!checked)}
                  />
                  <Label htmlFor="presentation" className="text-sm">Presentation</Label>
                </div>
              </div>

              {/* Index Offset with Document Print Allowed checkbox */}
              <div className="lg:col-span-1">
                <Label className="text-sm font-medium">Index Offset<span className="text-red-500">*</span></Label>
                <Input
                  placeholder="0"
                  value={formData.indexOffset}
                  onChange={(e) => handleInputChange('indexOffset', e.target.value)}
                  className="mt-2"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="documentPrintAllowed"
                    checked={formData.documentPrintAllowed}
                    onCheckedChange={(checked) => handleInputChange('documentPrintAllowed', !!checked)}
                  />
                  <Label htmlFor="documentPrintAllowed" className="text-sm">Document Print Allowed</Label>
                </div>
              </div>

              {/* Status */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.status && "text-red-500")}>
                  Status<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger className={cn("mt-2", errors.status && "border-red-500")}>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview Pages */}
              <div className="lg:col-span-1">
                <Label className={cn("text-sm font-medium", errors.previewPages && "text-red-500")}>
                  Preview Pages<span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Enter Pages"
                  value={formData.previewPages}
                  onChange={(e) => handleInputChange('previewPages', e.target.value)}
                  className={cn("mt-2", errors.previewPages && "border-red-500")}
                />
              </div>

              {/* Orientation */}
              <div className="lg:col-span-2">
                <Label className={cn("text-sm font-medium", errors.orientation && "text-red-500")}>
                  Orientation<span className="text-red-500">*</span>
                </Label>
                <Select value={formData.orientation} onValueChange={(value) => handleInputChange('orientation', value)}>
                  <SelectTrigger className={cn("mt-2", errors.orientation && "border-red-500")}>
                    <SelectValue placeholder="Select Orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-2.5 mt-8">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="bg-[#D9D9D9] text-promag-body hover:bg-[#D9D9D9]/80"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                className="bg-promag-primary hover:bg-promag-primary/90"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
