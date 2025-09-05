export async function generatePdfThumbnail(
  file: File,
  maxWidth = 300,
): Promise<string> {
  if (!file) throw new Error("No file provided");
  const pdfjsLib = await ensurePdfjs();
  const data = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);

  // Determine scale based on desired width
  const viewport = page.getViewport({ scale: 1 });
  const scale = maxWidth / viewport.width;
  const scaledViewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas not supported");
  canvas.width = Math.ceil(scaledViewport.width);
  canvas.height = Math.ceil(scaledViewport.height);

  await page.render({
    canvasContext: context as any,
    viewport: scaledViewport as any,
  }).promise;
  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl;
}

async function ensurePdfjs(): Promise<any> {
  const w = window as any;
  if (w.pdfjsLib) return setupWorker(w.pdfjsLib);

  const LIB_SRC =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.min.js";
  const WORKER_SRC =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";

  await loadScript(LIB_SRC);
  const lib = (window as any).pdfjsLib;
  if (!lib) throw new Error("Failed to load pdf.js library");
  lib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
  return lib;
}

function setupWorker(lib: any) {
  if (!lib.GlobalWorkerOptions.workerSrc) {
    lib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js";
  }
  return lib;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load script ${src}`));
    document.head.appendChild(s);
  });
}
