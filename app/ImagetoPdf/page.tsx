"use client"

import React, { useState, ChangeEvent, useCallback,useRef } from "react";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/nav"
import { file } from "jszip";
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
        <div>
            <Navbar />
            <div {...getRootProps()} className="min-h-screen  flex items-center justify-center bg-slate-50 ">
                <div className="w-full h-screen   bg-white rounded-2xl shadow-lg p-6">
                    <div className="mb-6 flex flex-col items-center justify-center">
                        <h1 className="text-4xl font-bold mb-2 ">Image to PDF Converter</h1>
                        <p className="text-sm text-slate-500 mb-6">Convert your images into a high-quality PDF in just a few clicks. Upload multiple photos, reorder them, and generate a single polished PDF instantly — no login, no stress.</p>
                    </div>

                    <div className="max-w-3xl flex flex-col items-center mx-auto">

                        <div className="mb-4 pt-10">
                        </div>


                        <div  className=" h-[300px] flex gap-3 flex-wrap mb-4 relative p-6 border-2 border-dashed border-slate-300 rounded-lg min-h-[200px] w-full justify-center overflow-scroll">

                            <input {...getInputProps()} />
                            <input {...getInputProps({ refKey: "ref" })} ref={inputRef} />

                            {previews.length === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-slate-400">No images selected. Please upload images to see previews.</span>

                                </div>
                            )}
                            {previews.map((src, idx) => (
                                <div key={idx} className="relative">
                                    <div onClick={() => handleClickImage(src)}  key={idx} className="w-28 h-28 rounded overflow-hidden border p-1 bg-white">
                                        <img src={src} title={files[idx]?.name} alt={`image :${files[idx]?.name}`} className="w-full h-full object-cover" />
                                    </div>
                                    {imageindex === true ? <p className="text-gray-600 text-xs px-1 rounded flex justify-center"> {idx + 1} </p> : <p className="flex items-center justify-center text-shadow-gray-600">
                                        {files[idx]?.name.length > 15
                                            ? files[idx].name.slice(0, 15) + "…"
                                            : files[idx]?.name}
                                    </p>
                                    }
                                </div>

                            ))}
                             <div className="flex justify-end mb-2">
  <button
     onClick={() => inputRef.current?.click()}
    className="fixed right-100 bottom-40 p-2 w-15 h-15 rounded-full bg-slate-200 hover:bg-slate-300 shadow cursor-pointer flex justify-center items-center"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4"
      />
    </svg>
  </button>
</div>

                        </div>


                        <div className="flex gap-3">
                            <button
                                onClick={convertToPdf}
                                disabled={loading || previews.length === 0}
                                className="px-4 py-2 rounded-lg shadow-sm bg-indigo-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Converting..." : "Convert to PDF"}
                            </button>

                            <button
                                onClick={clearAll}
                                className="px-4 py-2 rounded-lg shadow-sm bg-slate-100 text-slate-700 font-medium"
                            >
                                Clear
                            </button>

                            <div className="pl-5 flex justify-center items-center gap-2">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={imageindex}
                                        onChange={() => setImageIndex(!imageindex)}
                                        className="hidden peer"
                                    />

                                    {/* Custom big checkbox */}
                                    <span className="
      w-5 h-5 rounded border border-gray-500 
      flex items-center justify-center
      peer-checked:bg-blue-600
      peer-checked:border-blue-600
      peer-checked:before:content-['✔']
      peer-checked:before:text-white
      text-xs
    "></span>

                                    {/* Text */}
                                    <span className="italic font-semibold">Show Image Index</span>
                                </label>
                            </div>

                        </div>

                    </div>


                    <div className="mt w-full">
                        <hr className="my-6" />
                        <div className="text-xs text-slate-400">Runs fully in your browser. Upload high‑quality images for best results.</div>
                    </div>


                </div>

            </div>

            

            {open && selectedImage && (
  <CropPopup
    image={selectedImage}
    onClose={() => setOpen(false)}
    onSave={(croppedImg : string) => {
      // Update your previews array with cropped image
      const updated = previews.map(img =>
        img === selectedImage ? croppedImg : img
      );
      setPreviews(updated);

      setOpen(false);
    }}
  />
)}

        </div>
    );
}
