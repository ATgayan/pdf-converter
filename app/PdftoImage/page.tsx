"use client";

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/nav";
import JSZip from "jszip";
import { saveAs } from "file-saver";

// FIXED PDF.JS (Next.js compatible)
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "pdfjs-dist/legacy/build/pdf.worker";


export default function PdfToImage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const convertPdfToImages = async () => {
    if (!pdfFile) return alert("Upload a PDF first 😭");
    setLoading(true);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;

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
    if (images.length === 0) return;

    const zip = new JSZip();
    images.forEach((img, i) => {
      const base64 = img.split(",")[1];
      zip.file(`page-${i + 1}.png`, base64, { base64: true });
    });

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "pdf-images.zip");
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Only PDF allowed bro");
      return;
    }

    setPdfFile(file);
    setImages([]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [] },
    multiple: false,
    noKeyboard: true,
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

          <div className="max-w-3xl mx-auto">
            <div
             
              className=" h-[100px] w-[200px] border-2 border-dashed border-slate-300 rounded-lg p-6 flex items-center justify-center bg-slate-50 cursor-pointer"
            >
              <input {...getInputProps()} />
              {!pdfFile ? (
                <span className="text-slate-400">Drop your PDF here, or click to upload.</span>
              ) : (
                <span className="text-slate-600 font-medium">{pdfFile.name}</span>
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
                disabled={images.length === 0}
                className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50"
              >
                Download ZIP
              </button>
            </div>

            {/* Preview Images */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              {images.map((src, i) => (
                <div key={i} className="border rounded-lg overflow-hidden bg-white p-1 shadow">
                  <img src={src} alt={`Page ${i + 1}`} className="w-full object-cover" />
                  <p className="text-xs text-center mt-1 text-slate-500">
                    Page {i + 1}
                  </p>
                </div>
              ))}
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
