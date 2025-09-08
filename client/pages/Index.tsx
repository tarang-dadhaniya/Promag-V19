import { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import {
  StepNavigation,
  Step,
  type StepValidation,
} from "../components/StepNavigation";
import { PDFUpload } from "../components/PDFUpload";
import { IssueDetailsForm } from "../components/IssueDetailsForm";
import { AuthorDetailsForm } from "../components/AuthorDetailsForm";
import { CollectionsPage } from "../components/CollectionsPage";
import { PublicationsPage } from "../components/PublicationsPage";
import { PublicationListView } from "../components/PublicationListView";
import { CreateCollectionDialog } from "../components/CreateCollectionDialog";
import { EditPublicationForm } from "../components/EditPublicationForm";
import { PublicationDetailsForm } from "../components/PublicationDetailsForm";
import { FileChangesForm } from "../components/FileChangesForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../components/ui/dialog";

interface UploadedFile {
  name: string;
  size: number;
  file?: File | null;
}

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
  // Additional metadata
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

type ViewMode =
  | "collections"
  | "publications"
  | "publication-list"
  | "upload"
  | "edit-publication"
  | "publication-details"
  | "file-changes";

export default function Index() {
  const STORAGE_KEY = "promag:publication";
  const COLLECTIONS_STORAGE_KEY = "promag:collections";
  const PUBLICATIONS_STORAGE_KEY = "promag:publications";

  // View state
  const [currentView, setCurrentView] = useState<ViewMode>("collections");
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  // Collections and Publications
  const [collections, setCollections] = useState<Collection[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [showCreateCollectionDialog, setShowCreateCollectionDialog] =
    useState(false);
  const [showEditCollectionDialog, setShowEditCollectionDialog] =
    useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null,
  );

  // Sidebar filters
  const [sidebarCategory, setSidebarCategory] = useState<string>("");
  const [sidebarCollectionId, setSidebarCollectionId] = useState<string>("");

  // Edit publication state
  const [editingPublication, setEditingPublication] =
    useState<Publication | null>(null);

  // Upload flow state (existing)
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [issueData, setIssueData] = useState<any>(null);
  const [authorData, setAuthorData] = useState<any>(null);
  const [validation, setValidation] = useState<StepValidation>({
    upload: false,
    "issue-details": false,
    "author-details": false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const resetUploadFlow = () => {
    setCurrentStep("upload");
    setUploadedFile(null);
    setIssueData(null);
    setAuthorData(null);
    setValidation({
      upload: false,
      "issue-details": false,
      "author-details": false,
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const resetAll = () => {
    resetUploadFlow();
    setCurrentView("collections");
    setSelectedCollection(null);
  };

  const handleBackToPublications = () => {
    setCurrentView("publication-list");
  };

  const handleDeleteCollection = (collectionId: string) => {
    // Remove the collection
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));

    // Remove all publications in this collection
    setPublications((prev) =>
      prev.filter((p) => p.collectionId !== collectionId),
    );

    // Navigate back to collections
    setSelectedCollection(null);
    setCurrentView("collections");

    // Clear sidebar selection if it was the deleted collection
    if (sidebarCollectionId === collectionId) {
      setSidebarCollectionId("");
    }
  };

  const handleEditPublication = (publication: Publication) => {
    // Open multi-step editor with prefilled data
    setEditingPublication(publication);
    const collection =
      collections.find((c) => c.id === publication.collectionId) || null;
    if (collection) setSelectedCollection(collection);

    setIssueData({
      name: publication.title || "",
      topicsCategory: publication.category || "",
      collection: publication.collectionId || "",
      edition: publication.edition || "",
      teaser: publication.teaser || "",
      description: publication.description || "",
    });
    setAuthorData(authorData); // keep whatever was last used; no extra data added
    setValidation((prev) => ({ ...prev, upload: true })); // allow proceeding without forcing re-upload
    setCurrentStep("upload");
    setCurrentView("upload");
  };

  const handleOpenPublicationDetails = (publication: Publication) => {
    // Open the full screen details form (not a dialog)
    setEditingPublication(publication);
    const collection =
      collections.find((c) => c.id === publication.collectionId) || null;
    if (collection) setSelectedCollection(collection);
    setCurrentView("publication-details");
  };

  const handleFileChanges = (publication: Publication) => {
    // Open the file changes form for updating files
    setEditingPublication(publication);
    const collection =
      collections.find((c) => c.id === publication.collectionId) || null;
    if (collection) setSelectedCollection(collection);
    setCurrentView("file-changes");
  };

  const handleSaveFromDetails = (data: any) => {
    if (!editingPublication) return;
    const updated: Publication = {
      ...editingPublication,
      title: data.name || editingPublication.title,
      category: data.topicsCategory || editingPublication.category,
      edition: data.edition || editingPublication.edition,
      teaser: data.teaser || editingPublication.teaser,
      description: data.description || editingPublication.description,
      status: data.status || editingPublication.status,
    };

    setPublications((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p)),
    );
    setEditingPublication(null);
    setCurrentView("publication-list");
  };

  const handleSavePublication = (updatedPublication: Publication) => {
    setPublications((prev) =>
      prev.map((p) =>
        p.id === updatedPublication.id ? updatedPublication : p,
      ),
    );
    setEditingPublication(null);
    // Ensure the UI shows the collection where the publication now belongs
    const updatedCollection = collections.find(
      (c) => c.id === updatedPublication.collectionId,
    );
    if (updatedCollection) {
      setSelectedCollection(updatedCollection);
    }
    setCurrentView("publication-list");
  };

  const handleCancelEdit = () => {
    setEditingPublication(null);
    setCurrentView("publication-list");
  };

  // Auto-close success popup after 5s and reset
  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => {
      setShowSuccess(false);
      resetAll();
    }, 5000);
    return () => clearTimeout(t);
  }, [showSuccess]);

  // Load persisted data
  useEffect(() => {
    try {
      // Load collections
      const collectionsRaw = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
      if (collectionsRaw) {
        const savedCollections = JSON.parse(collectionsRaw);
        setCollections(
          savedCollections.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
          })),
        );
      }

      // Load publications
      const publicationsRaw = localStorage.getItem(PUBLICATIONS_STORAGE_KEY);
      const uploadRaw = localStorage.getItem(STORAGE_KEY);
      let savedUpload: any = null;

      if (uploadRaw) {
        try {
          savedUpload = JSON.parse(uploadRaw);
        } catch {}
      }

      if (publicationsRaw) {
        try {
          const savedPublications = JSON.parse(publicationsRaw);
          const enriched = savedPublications.map((p: any) => {
            // normalize createdAt
            const base = { ...p, createdAt: new Date(p.createdAt) };

            // If publication is missing certain metadata but matches the last saved upload (by title), merge it
            if (
              savedUpload &&
              savedUpload.issueData &&
              savedUpload.issueData.name &&
              base.title === savedUpload.issueData.name
            ) {
              const authorData = savedUpload.authorData || {};
              return {
                ...base,
                author: base.author ?? authorData.author,
                editor: base.editor ?? authorData.editor,
                language: base.language ?? authorData.language,
                releaseDate: base.releaseDate ?? authorData.releaseDate,
                isbnIssn: base.isbnIssn ?? authorData.isbnIssn,
                indexOffset: base.indexOffset ?? authorData.indexOffset,
                documentPrintAllowed:
                  base.documentPrintAllowed ??
                  !!authorData.documentPrintAllowed,
                previewPages: base.previewPages ?? authorData.previewPages,
                orientation: base.orientation ?? authorData.orientation,
                presentation: base.presentation ?? !!authorData.presentation,
              };
            }

            return base;
          });

          setPublications(enriched);
        } catch (e) {
          console.warn("Failed parsing publications", e);
        }
      }

      // Load upload flow data only if in upload mode
      if (uploadRaw) {
        const saved = savedUpload;
        if (saved) {
          if (saved.currentStep) setCurrentStep(saved.currentStep);
          if (saved.uploadedFile)
            setUploadedFile({ ...saved.uploadedFile, file: null });
          if (saved.issueData) setIssueData(saved.issueData);
          if (saved.authorData) setAuthorData(saved.authorData);
          if (saved.validation) setValidation(saved.validation);
          // Do not restore currentView or selectedCollection on load to land on Collections screen
        }
      }
    } catch (e) {
      console.warn("Failed to load saved data", e);
    }
  }, []);

  // Persist collections data
  useEffect(() => {
    try {
      localStorage.setItem(
        COLLECTIONS_STORAGE_KEY,
        JSON.stringify(collections),
      );
    } catch (e) {
      console.warn("Failed to save collections", e);
    }
  }, [collections]);

  // Persist publications data
  useEffect(() => {
    try {
      localStorage.setItem(
        PUBLICATIONS_STORAGE_KEY,
        JSON.stringify(publications),
      );
    } catch (e) {
      console.warn("Failed to save publications", e);
    }
  }, [publications]);

  // Persist upload flow data
  useEffect(() => {
    if (currentView === "upload") {
      const data = {
        currentStep,
        uploadedFile: uploadedFile
          ? { name: uploadedFile.name, size: uploadedFile.size }
          : null,
        issueData,
        authorData,
        validation,
        currentView,
        selectedCollection,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.warn("Failed to save publication", e);
      }
    }
  }, [
    currentStep,
    uploadedFile,
    issueData,
    authorData,
    validation,
    currentView,
    selectedCollection,
  ]);

  const handleCreateCollection = (data: {
    title: string;
    coverImage?: string;
  }) => {
    const newCollection: Collection = {
      id: Date.now().toString(),
      title: data.title,
      coverImage: data.coverImage, // Now using base64 data URL directly
      createdAt: new Date(),
    };

    setCollections((prev) => [...prev, newCollection]);
    setShowCreateCollectionDialog(false);
  };

  const handleUpdateCollection = (data: {
    title: string;
    coverImage?: string;
  }) => {
    if (!editingCollection) return;
    setCollections((prev) =>
      prev.map((c) =>
        c.id === editingCollection.id
          ? {
              ...c,
              title: data.title,
              coverImage: data.coverImage ?? c.coverImage,
            }
          : c,
      ),
    );
    setSelectedCollection((prev) => {
      if (prev && prev.id === editingCollection.id) {
        return {
          ...prev,
          title: data.title,
          coverImage: data.coverImage ?? prev.coverImage,
        } as Collection;
      }
      return prev;
    });
    setShowEditCollectionDialog(false);
    setEditingCollection(null);
  };

  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setCurrentView("publication-list");
  };

  const handleNewIssue = () => {
    resetUploadFlow();
    setCurrentView("upload");
  };

  const handleBackToCollections = () => {
    setCurrentView("collections");
    setSelectedCollection(null);
  };

  const handleStepChange = (step: Step) => {
    const stepOrder: Step[] = ["upload", "issue-details", "author-details"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (stepIndex <= currentIndex) {
      setCurrentStep(step);
      return;
    }

    for (let i = 0; i < stepIndex; i++) {
      if (!validation[stepOrder[i]]) {
        return;
      }
    }

    setCurrentStep(step);
  };

  const handleFileUpload = (file: UploadedFile | null) => {
    setUploadedFile(file);
    setValidation((prev) => ({ ...prev, upload: !!file }));
  };

  const handleIssueValidationChange = (isValid: boolean) => {
    setValidation((prev) => ({ ...prev, "issue-details": isValid }));
  };

  const handleAuthorValidationChange = (isValid: boolean) => {
    setValidation((prev) => ({ ...prev, "author-details": isValid }));
  };

  const handleIssueSubmit = (data: any) => {
    setIssueData(data);
    setCurrentStep("author-details");
  };

  const handleAuthorSubmit = async (data: any) => {
    setAuthorData(data);

    // Determine the collection selected in the Issue step (fallback to currently selected)
    const targetCollectionId = issueData?.collection || selectedCollection?.id;
    const targetCollection =
      collections.find((c) => c.id === targetCollectionId) || null;

    // Prepare cover image: use first page thumbnail if a PDF was uploaded
    let coverImageUrl: string | undefined = undefined;
    try {
      if (uploadedFile?.file) {
        if ((uploadedFile.file.type || "").includes("pdf")) {
          const { generatePdfThumbnail } = await import("@/lib/pdfThumbnail");
          coverImageUrl = await generatePdfThumbnail(uploadedFile.file, 236);
        } else {
          coverImageUrl = URL.createObjectURL(uploadedFile.file);
        }
      }
    } catch (e) {
      console.warn("Failed generating PDF thumbnail, falling back", e);
    }

    if (targetCollectionId) {
      if (editingPublication) {
        // Update existing publication
        const updated: Publication = {
          ...editingPublication,
          title: issueData?.name || editingPublication.title,
          collectionId: targetCollectionId,
          category: issueData?.topicsCategory || editingPublication.category,
          edition: issueData?.edition || editingPublication.edition,
          teaser: issueData?.teaser || editingPublication.teaser,
          description: issueData?.description || editingPublication.description,
          coverImage: coverImageUrl ?? editingPublication.coverImage,
          // persist author/metadata
          author: data?.author || editingPublication.author,
          editor: data?.editor || editingPublication.editor,
          language: data?.language || editingPublication.language,
          releaseDate: data?.releaseDate || editingPublication.releaseDate,
          isbnIssn: data?.isbnIssn || editingPublication.isbnIssn,
          indexOffset: data?.indexOffset ?? editingPublication.indexOffset,
          documentPrintAllowed: !!(
            data?.documentPrintAllowed ??
            editingPublication.documentPrintAllowed
          ),
          previewPages: data?.previewPages || editingPublication.previewPages,
          orientation: data?.orientation || editingPublication.orientation,
          presentation: !!(
            data?.presentation ?? editingPublication.presentation
          ),
        };
        setPublications((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        setEditingPublication(null);
      } else {
        // Create new
        const newPublication: Publication = {
          id: Date.now().toString(),
          title: issueData?.name || "Untitled Publication",
          coverImage: coverImageUrl,
          createdAt: new Date(),
          collectionId: targetCollectionId,
          status: "draft",
          category: issueData?.topicsCategory || "",
          edition: issueData?.edition || "",
          teaser: issueData?.teaser || "",
          description: issueData?.description || "",
          // persist author/metadata
          author: data?.author || "",
          editor: data?.editor || "",
          language: data?.language || "",
          releaseDate: data?.releaseDate || "",
          isbnIssn: data?.isbnIssn || "",
          indexOffset: data?.indexOffset ?? "0",
          documentPrintAllowed: !!data?.documentPrintAllowed,
          previewPages: data?.previewPages || "",
          orientation: data?.orientation || "",
          presentation: !!data?.presentation,
        };
        setPublications((prev) => [...prev, newPublication]);
      }

      if (targetCollection) setSelectedCollection(targetCollection);
      setCurrentView("publication-list");
      return;
    }

    console.log("Final submission:", {
      file: uploadedFile,
      issue: issueData,
      author: data,
      collection: selectedCollection,
    });
    setShowSuccess(true);
  };

  const renderUploadStepContent = () => {
    switch (currentStep) {
      case "upload":
        return (
          <div className="flex w-full bg-white rounded-[10px] p-4 sm:p-6 lg:p-8 h-full">
            <div className="flex flex-col gap-4 sm:gap-6 w-full">
              <PDFUpload
                className="h-full"
                onFileUpload={handleFileUpload}
                initialFile={
                  uploadedFile
                    ? { name: uploadedFile.name, size: uploadedFile.size }
                    : null
                }
              />
              <div className="flex justify-end items-center gap-2.5 self-stretch">
                <button
                  onClick={() =>
                    validation.upload && setCurrentStep("issue-details")
                  }
                  disabled={!validation.upload}
                  className={`flex h-[42px] px-5 py-2.5 justify-center items-center gap-[7px] rounded-lg border font-inter text-sm font-medium transition-colors ${
                    validation.upload
                      ? "border-promag-primary bg-promag-primary text-white hover:bg-promag-primary/90"
                      : "border-promag-primary/50 bg-promag-primary/50 text-white cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        );

      case "issue-details":
        return (
          <IssueDetailsForm
            onSubmit={handleIssueSubmit}
            onValidationChange={handleIssueValidationChange}
            onPreview={() => setCurrentStep("upload")}
            onDataChange={setIssueData}
            initialData={{
              ...issueData,
              collection: issueData?.collection ?? selectedCollection?.id ?? "",
            }}
            categoriesOptions={[
              { value: "action", label: "Action" },
              { value: "cinematic", label: "Cinematic" },
              { value: "comic", label: "Comic" },
              { value: "drama", label: "Drama" },
              { value: "education", label: "Education" },
            ]}
            collectionOptions={collections.map((c) => ({
              value: c.id,
              label: c.title,
            }))}
          />
        );

      case "author-details":
        return (
          <AuthorDetailsForm
            onSubmit={handleAuthorSubmit}
            onValidationChange={handleAuthorValidationChange}
            onPreview={() => setCurrentStep("issue-details")}
            onDataChange={setAuthorData}
            initialData={authorData}
          />
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case "collections":
        return (
          <CollectionsPage
            collections={collections}
            onCreateCollection={() => setShowCreateCollectionDialog(true)}
            onSelectCollection={handleSelectCollection}
            className="flex-1"
          />
        );

      case "publications":
        if (!selectedCollection) {
          setCurrentView("collections");
          return null;
        }
        return (
          <PublicationListView
            collection={selectedCollection}
            publications={publications.filter(
              (p) => p.collectionId === selectedCollection.id,
            )}
            onNewIssue={handleNewIssue}
            onBackToCollections={handleBackToCollections}
            onDeleteCollection={handleDeleteCollection}
            onEditPublication={handleEditPublication}
            onOpenPublicationDetails={handleOpenPublicationDetails}
            onFileChanges={handleFileChanges}
            onEditCollectionSettings={() => {
              setEditingCollection(selectedCollection);
              setShowEditCollectionDialog(true);
            }}
            className="flex-1"
          />
        );

      case "publication-list":
        if (!selectedCollection) {
          setCurrentView("collections");
          return null;
        }
        return (
          <PublicationListView
            collection={selectedCollection}
            publications={publications.filter(
              (p) => p.collectionId === selectedCollection.id,
            )}
            onNewIssue={handleNewIssue}
            onBackToCollections={handleBackToCollections}
            onDeleteCollection={handleDeleteCollection}
            onEditPublication={handleEditPublication}
            onOpenPublicationDetails={handleOpenPublicationDetails}
            onEditCollectionSettings={() => {
              setEditingCollection(selectedCollection);
              setShowEditCollectionDialog(true);
            }}
            className="flex-1"
          />
        );

      case "edit-publication":
        if (!editingPublication || !selectedCollection) {
          setCurrentView("publication-list");
          return null;
        }
        return (
          <EditPublicationForm
            publication={editingPublication}
            collections={collections}
            categoriesOptions={[
              { value: "action", label: "Action" },
              { value: "cinematic", label: "Cinematic" },
              { value: "comic", label: "Comic" },
              { value: "drama", label: "Drama" },
              { value: "education", label: "Education" },
            ]}
            onSave={handleSavePublication}
            onCancel={handleCancelEdit}
            className="flex-1"
          />
        );

      case "publication-details":
        if (!editingPublication || !selectedCollection) {
          setCurrentView("publication-list");
          return null;
        }
        return (
          <div className="flex-1">
            <PublicationDetailsForm
              initialData={{
                name: editingPublication.title,
                topicsCategory: editingPublication.category || "",
                collection: editingPublication.collectionId,
                edition: editingPublication.edition || "",
                teaser: editingPublication.teaser || "",
                description: editingPublication.description || "",
                author: editingPublication.author || "",
                editor: editingPublication.editor || "",
                language: editingPublication.language || "",
                releaseDate: editingPublication.releaseDate || "",
                isbnIssn: editingPublication.isbnIssn || "",
                indexOffset: String(editingPublication.indexOffset ?? "0"),
                documentPrintAllowed: !!editingPublication.documentPrintAllowed,
                status: editingPublication.status || "draft",
                previewPages: editingPublication.previewPages || "",
                orientation: editingPublication.orientation || "",
                presentation: !!editingPublication.presentation,
              }}
              onSubmit={handleSaveFromDetails}
              onCancel={() => setCurrentView("publication-list")}
              onGoToCollections={() => {
                setSelectedCollection(null);
                setCurrentView("collections");
              }}
              onGoToPublications={() => setCurrentView("publication-list")}
              collectionOptions={collections.map((c) => ({
                value: c.id,
                label: c.title,
              }))}
            />
          </div>
        );

      case "file-changes":
        if (!editingPublication || !selectedCollection) {
          setCurrentView("publication-list");
          return null;
        }
        return (
          <div className="flex flex-1 flex-col gap-3 sm:gap-4 lg:gap-5">
            {/* Back Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView("publication-list")}
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
                <span className="font-inter text-sm">Back to Publications</span>
              </button>
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm font-inter text-black/60">
                  Collections / Publications{" "}
                  <span className="text-black">/ Selected Publication Name</span>
                </div>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex flex-col justify-center items-center gap-2.5 self-stretch">
              <div className="flex h-10 justify-center items-center gap-2.5">
                {/* Step 01 - Completed */}
                <div className="flex w-10 h-10 flex-col justify-center items-center gap-2.5 rounded-[20px] border-2 border-promag-primary bg-promag-primary">
                  <div className="text-white text-center font-roboto text-base font-medium">01</div>
                </div>
                <div className="w-[304px] h-[3px] bg-promag-primary"></div>

                {/* Step 02 - Current/Completed */}
                <div className="flex w-10 h-10 flex-col justify-center items-center gap-2.5 rounded-[20px] border-2 border-promag-primary bg-promag-primary">
                  <div className="text-white text-center font-roboto text-base font-medium">02</div>
                </div>
                <div className="w-[302px] h-[3px] bg-[#ABB7C2]"></div>

                {/* Step 03 - Upcoming */}
                <div className="flex w-10 h-10 flex-col justify-center items-center gap-2.5 rounded-[20px] border-2 border-[#ABB7C2]">
                  <div className="text-[#ABB7C2] text-center font-roboto text-base font-medium">03</div>
                </div>
                <div className="w-[302px] h-[3px] bg-[#ABB7C2]"></div>

                {/* Step 04 - Upcoming */}
                <div className="flex w-10 h-10 flex-col justify-center items-center gap-2.5 rounded-[20px] border-2 border-[#ABB7C2]">
                  <div className="text-[#ABB7C2] text-center font-roboto text-base font-medium">04</div>
                </div>
              </div>
            </div>

            {/* File Changes Form */}
            <FileChangesForm
              onSave={(data) => {
                // Handle file changes save
                if (editingPublication) {
                  const updated: Publication = {
                    ...editingPublication,
                    // Update with new file data if needed
                    // For now, just mark as updated
                  };
                  setPublications((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                  );
                  setEditingPublication(null);
                  setCurrentView("publication-list");
                }
              }}
              onCancel={() => setCurrentView("publication-list")}
              className="flex-1"
            />
          </div>
        );

      case "upload":
        return (
          <div className="flex flex-1 flex-col gap-3 sm:gap-4 lg:gap-5">
            {/* Back Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (selectedCollection) {
                    setCurrentView("publication-list");
                  } else {
                    setCurrentView("collections");
                  }
                }}
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
                <span className="font-inter text-sm">
                  Back to {selectedCollection ? "Publications" : "Collections"}
                </span>
              </button>
            </div>

            {/* Step Navigation */}
            <StepNavigation
              currentStep={currentStep}
              onStepChange={handleStepChange}
              validation={validation}
            />

            {/* Step Content */}
            {renderUploadStepContent()}
          </div>
        );

      default:
        return null;
    }
  };

  const getPageTitle = () => {
    // If the user selected a collection from the sidebar and we're on the
    // publication list view, show "Publications - <Collection>" in header.
    if (
      currentView === "publication-list" &&
      sidebarCollectionId &&
      selectedCollection
    ) {
      return `Publications - ${selectedCollection.title}`;
    }

    // For all other inner views, keep the stable section title and rely on
    // the breadcrumb to show detailed navigation context.
    return "Manage Publications";
  };

  return (
    <div className="flex flex-col lg:flex-row w-screen h-screen bg-promag-background">
      {/* Sidebar - Hidden on mobile, shown on desktop */}
      <div className="hidden lg:block">
        <Sidebar
          onManagePublicationsClick={() => {
            setSelectedCollection(null);
            setCurrentView("collections");
          }}
          collections={collections}
          selectedCollectionId={
            sidebarCollectionId || (selectedCollection?.id ?? "")
          }
          onSelectCollection={(id) => {
            const coll = collections.find((c) => c.id === id);
            setSidebarCollectionId(id ?? "");
            if (coll) {
              setSelectedCollection(coll);
              setCurrentView("publication-list");
            } else {
              setSelectedCollection(null);
              setCurrentView("collections");
            }
          }}
          selectedCategory={sidebarCategory}
          onSelectCategory={(val) => setSidebarCategory(val ?? "")}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-h-0">
        {/* Header */}
        <Header title={getPageTitle()} />

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-2 sm:p-4 lg:p-5 gap-3 sm:gap-4 lg:gap-5 overflow-auto">
          {renderContent()}
        </div>
      </div>

      {/* Create Collection Dialog */}
      <CreateCollectionDialog
        open={showCreateCollectionDialog}
        onOpenChange={setShowCreateCollectionDialog}
        onSave={handleCreateCollection}
        mode="create"
      />

      {/* Edit Collection Dialog */}
      <CreateCollectionDialog
        open={showEditCollectionDialog}
        onOpenChange={setShowEditCollectionDialog}
        onSave={handleUpdateCollection}
        mode="edit"
        initialData={
          editingCollection
            ? {
                title: editingCollection.title,
                coverImage: editingCollection.coverImage,
              }
            : null
        }
      />

      {/* Success Dialog */}
      <Dialog
        open={showSuccess}
        onOpenChange={(open) => {
          setShowSuccess(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-promag-primary">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-promag-primary text-white animate-bounce-scale">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Upload Completed!
            </DialogTitle>
            <DialogDescription>
              Your publication has been successfully uploaded to the collection.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button
              onClick={() => {
                setShowSuccess(false);
                resetAll();
              }}
              className="inline-flex items-center justify-center h-10 px-4 rounded-md bg-promag-primary text-white hover:bg-promag-primary/90 transition-colors"
            >
              OK
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
