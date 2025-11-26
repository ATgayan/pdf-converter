"use client"

import React, { useState, ChangeEvent, useCallback,useRef } from "react";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/nav"
import CropPopup from "../components/cropimageHook";

// TypeScript version of Image → PDF converter

export default function PdftoImage() {
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [imageindex, setImageIndex] = useState<boolean>(false);

    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    
    const inputRef = React.useRef<HTMLInputElement | null>(null);


    const handleClickImage = (src: string) => {
        setSelectedImage(src);
        setOpen(true);
    };


    const convertToPdf = async () => {
        if (!files.length) return alert("Pick at least one image");
        setLoading(true);

        try {
            const pdf = new jsPDF({ unit: "mm", format: "a4" });

            for (let i = 0; i < previews.length; i++) {
                const img = await loadImage(previews[i]);

                const pageWidth = 210;
                const pageHeight = 297;

                const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
                const imgW = img.width * ratio;
                const imgH = img.height * ratio;

                const x = (pageWidth - imgW) / 2;
                const y = (pageHeight - imgH) / 2;

                pdf.addImage(previews[i], getImageType(previews[i]), x, y, imgW, imgH, undefined, "FAST");

                if (i < previews.length - 1) pdf.addPage();
            }

            pdf.save("images-to-pdf.pdf");
        } catch (err) {
            console.error(err);
            alert("Something went wrong while creating the PDF.");
        } finally {
            setLoading(false);
        }
    };

    const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
        return new Promise((res, rej) => {
            const img = new Image();
            img.onload = () => res(img);
            img.onerror = rej;
            img.src = dataUrl;
        });
    };
  console.log('select image',selectedImage);
  
    const getImageType = (dataUrl: string): "JPEG" | "PNG" => {
        if (dataUrl.startsWith("data:image/jpeg")) return "JPEG";
        if (dataUrl.startsWith("data:image/png")) return "PNG";
        return "JPEG";
    };


    const onDrop = useCallback((acceptedFiles: File[]) => {
        const mapped = acceptedFiles.map(file => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...mapped]);
        setFiles((prev) => [...prev, ...acceptedFiles]);

    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { "image/*": [] },
        multiple: true,
        noClick: true,
        noKeyboard: true,
        onDrop,
    });


    const clearAll = () => {
        setFiles([]);
        setPreviews([]);
    };

    return (
        <div className="flex flex-col min-h-screen ">
  <Navbar />

  <div {...getRootProps()} className="flex flex-col items-center justify-center px-4 py-6 w-full">
    <div className="w-full max-w-4xl bg-white rounded-2xl  p-4 sm:p-6 overflow-y-auto">

      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-2">Image to PDF Converter</h1>
        <p className="text-sm sm:text-base text-slate-500 mb-6">
          Convert your images into a high-quality PDF in just a few clicks. Upload multiple photos, reorder them, and generate a single polished PDF instantly — no login, no stress.
        </p>
      </div>

      {/* Upload & Preview Box */}
      <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
        <div className="h-auto flex flex-wrap gap-3 mb-4 relative p-4 sm:p-6 border-2 border-dashed border-slate-300 rounded-lg min-h-[200px] w-full justify-center overflow-auto">
          <input {...getInputProps()} />
          <input {...getInputProps({ refKey: "ref" })} ref={inputRef} />

          {/* Placeholder when no images */}
          {previews.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center px-2">
              <span className="text-slate-400 text-sm sm:text-base">
                No images selected. Please upload images to see previews.
              </span>
             
            </div>
          )}

          {/* Preview images */}
          {previews.map((src, idx) => (
            <div key={idx} className="relative w-24 sm:w-28 h-24 sm:h-28">
              <div onClick={() => handleClickImage(src)} className="w-full h-full rounded overflow-hidden border p-1 bg-white cursor-pointer">
                <img src={src} title={files[idx]?.name} alt={`image :${files[idx]?.name}`} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs text-center mt-1 text-slate-500 truncate">
                {imageindex ? idx + 1 : files[idx]?.name.length > 12 ? files[idx].name.slice(0, 12) + "…" : files[idx]?.name}
              </p>
            </div>
          ))}

          

          {/* Floating Add Button */}
          <button
            onClick={() => inputRef.current?.click()}
            className="fixed bottom-65 right-100 p-3 w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 shadow flex justify-center items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4" />
            </svg>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center items-center w-full">
          <button
            onClick={convertToPdf}
            disabled={loading || previews.length === 0}
            className=" cursor-pointer px-4 py-2 rounded-lg shadow-sm bg-indigo-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? "Converting..." : "Convert to PDF"}
          </button>

          <button
            onClick={clearAll}
            className="cursor-pointer px-4 py-2 rounded-lg shadow-sm bg-slate-100 text-slate-700 font-medium w-full sm:w-auto"
          >
            Clear
          </button>

          {/* Show Image Index Checkbox */}
          <div className="flex justify-center items-center gap-2 mt-2 sm:mt-0">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={imageindex}
                onChange={() => setImageIndex(!imageindex)}
                className="hidden peer"
              />
              <span className="w-5 h-5 rounded border border-gray-500 flex items-center justify-center
                peer-checked:bg-blue-600 peer-checked:border-blue-600
                peer-checked:before:content-['✔'] peer-checked:before:text-white text-xs"
              ></span>
              <span className="italic font-semibold text-sm">Show Image Index</span>
            </label>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 w-full text-center sm:text-left">
        <hr className="my-6" />
        <div className="text-xs sm:text-sm text-slate-400">
          Runs fully in your browser. Upload high‑quality images for best results.
        </div>
      </div>

    </div>
  </div>

  {/* Crop Popup */}
  {open && selectedImage && (
    <CropPopup
      image={selectedImage}
      onClose={() => setOpen(false)}
      onSave={(croppedImg: string) => {
        const updated = previews.map(img => img === selectedImage ? croppedImg : img);
        setPreviews(updated);
        setOpen(false);
      }}
    />
  )}
</div>

    );
}
