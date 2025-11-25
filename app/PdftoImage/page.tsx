"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/nav";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";

// // FIXED PDF.JS (Next.js compatible)
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
// import "pdfjs-dist/legacy/build/pdf.worker";


export default function PdfToImage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const [pdfModule, setPdfModule] = useState<any>(null);
  
   // Load pdfjs only on client
  if (typeof window !== "undefined" && !pdfModule) {
    import("pdfjs-dist/legacy/build/pdf").then((mod) => {
      setPdfModule(mod);
      mod.GlobalWorkerOptions.workerSrc =
        `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.version}/pdf.worker.min.js`;
    });
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleManualClick = () => {
    inputRef.current?.click();
  };


 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  if (file.type !== "application/pdf") return alert("Only PDF allowed bro");

  setLoadingFile(true); // start loading

  // simulate upload delay if needed, or just set file
  setTimeout(() => {
    setPdfFile(file);
    setImages([]);
    setLoadingFile(false); // stop loading
  }, 500); // 0.5s for demo
};


  const convertPdfToImages = async () => {
    if (!pdfFile) return alert("Upload a PDF first ");
    setLoading(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();

      // Ensure pdfjs module is available (use loaded pdfModule or dynamically import)
      let pdfLib = pdfModule;
      if (!pdfLib && typeof window !== "undefined") {
        const mod = await import("pdfjs-dist/legacy/build/pdf");
        mod.GlobalWorkerOptions.workerSrc =
          `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${mod.version}/pdf.worker.min.js`;
        setPdfModule(mod);
        pdfLib = mod;
      }

      if (!pdfLib) throw new Error("Failed to load pdfjs library");

      const pdf = await pdfLib.getDocument(arrayBuffer).promise;

      let imgList: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        imgList.push(canvas.toDataURL("image/png"));
      }

      setImages(imgList);
    } catch (error) {
      console.error(error);
      alert("PDF conversion failed ");
    } finally {
      setLoading(false);
    }
  };

  const downloadZip = async () => {
    setIsDownloading(true);
    try {


      if (images.length === 0) return;

      const zip = new JSZip();
      images.forEach((img, i) => {
        const base64 = img.split(",")[1];
        zip.file(`page-${i + 1}.png`, base64, { base64: true });
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "pdf-images.zip");

    } catch (error) {

      console.error("Error creating ZIP:", error);
      alert("Failed to create ZIP file.");
    } finally {
      setIsDownloading(false);
    }


  };

const onDrop = useCallback((acceptedFiles: File[]) => {
  
  const file = acceptedFiles[0];
  if (!file) {
    setLoadingFile(false);
    return;
  }

  

  setPdfFile(file);
  setImages([]);
  
}, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    noKeyboard: true,
    noClick: true, 
    onDrop,
  });

  return (
    <div>
      <Navbar />
      <div  {...getRootProps()} className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full h-screen bg-white rounded-2xl shadow-lg p-6 overflow-y-auto">
          <div className="mb-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold">PDF to Image Converter</h1>
            <p className="text-sm text-slate-500 mt-2 text-center max-w-xl">
              Upload a PDF and instantly convert each page into high-quality PNG images.
              Download all pages as a ZIP — fast, easy, clean UI.
            </p>
          </div>

          <div className="pt-10 flex flex-col justify-center items-center max-w-3xl mx-auto">
            <div
  onClick={handleManualClick} 
  className="h-[100px] w-[200px] border-2 border-dashed border-slate-300 rounded-lg p-6 
             flex flex-col items-center justify-center gap-2 bg-slate-50 cursor-pointer relative"
>
  <input {...getInputProps()} />
  <input
    type="file"
    ref={inputRef}
    onChange={handleFileChange}
    className="hidden"
    accept="application/pdf"
  />

  {loadingFile ? (
    <div className="flex flex-col items-center">
      <svg className="animate-spin h-6 w-6 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-slate-500 text-sm mt-1">Uploading...</span>
    </div>
  ) : !pdfFile ? (
    <>
      <ArrowUpTrayIcon className="h-6 w-6 text-slate-400" />
      <span className="text-slate-400 text-sm">Upload PDF</span>
    </>
  ) : (
    <span className="text-slate-600 font-medium text-sm">{pdfFile.name}</span>
  )}
</div>


            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={convertPdfToImages}
                disabled={!pdfFile || loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
              >
                {loading ? "Converting..." : "Convert to Images"}
              </button>

              <button
                onClick={() => {
                  setPdfFile(null);
                  setImages([]);
                }}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700"
              >
                Clear
              </button>

              <button
                onClick={downloadZip}
                disabled={images.length === 0 || isDownloading}
                className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
              >
                {isDownloading ? "Downloading..." : "Download ZIP"}
              </button>

            </div>

            {/* Preview Images */}
            <div className=" h-[300px] overflow-y-auto">
              <div className="w-full grid grid-cols-2 sm:grid-cols-6 gap-4 mt-8">
                {images.map((src, i) => (
                  <div key={i} className="border rounded-lg overflow-hidden  p-1 shadow">
                    <img src={src} alt={`Page ${i + 1}`} className="w-full object-cover" />
                    <p className="text-xs text-center mt-1 text-slate-500">
                      Page {i + 1}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6">
              <hr className="my-4" />
              <p className="text-xs text-slate-400">
                Fully offline. PDF processing happens in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
