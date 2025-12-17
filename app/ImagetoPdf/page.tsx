"use client"

import React, { useState, useCallback, useRef } from "react";
import { jsPDF } from "jspdf";
import { useDropzone } from "react-dropzone";
import Navbar from "../components/nav"
import CropPopup from "../components/cropimageHook";
import { ClipLoader } from "react-spinners";



import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import SortableImage from "../components/SortableImage";



// TypeScript version of Image → PDF converter

export default function PdftoImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [imageindex, setImageIndex] = useState<boolean>(false);
  const [imageuploading, setImageUploading] = useState<boolean>(false);
  const [pdfName, setPdfName] = useState<string>("");

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);


  const inputRef = useRef<HTMLInputElement | null>(null);



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

      const safeName = pdfName.replace(/[\\/:*?"<>|]/g, "") || "pdconverter";
      pdf.save(`${safeName}.pdf`);

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

  const getImageType = (dataUrl: string): "JPEG" | "PNG" => {
    if (dataUrl.startsWith("data:image/jpeg")) return "JPEG";
    if (dataUrl.startsWith("data:image/png")) return "PNG";
    return "JPEG";
  };


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImageUploading(true);
    const mapped = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...mapped]);
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setImageUploading(false);

  }, []);


  const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5, // drag starts after 5px movement
    },
  })
);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    multiple: true,
    noClick: true,
    noKeyboard: true,
    onDrop,
  });

  const removeImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
};



  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />
      {imageuploading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <ClipLoader size={40} />
        </div>
      )}

      <div {...getRootProps()} className={`flex flex-col items-center justify-center px-4 py-6 w-full  ${imageuploading ? "pointer-events-none opacity-60" : ""}`}>
        <div className="w-screen h-screen   rounded-2xl  p-4 sm:p-6 overflow-y-auto">

          {/* Header */}
          <div className="mb-6 flex flex-col items-center text-center">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Image to PDF Converter</h1>
            <p className="text-sm sm:text-base text-slate-500 mb-6">
              Convert your images into a high-quality PDF in just a few clicks. Upload multiple photos, reorder them, and generate a single polished PDF instantly — no login, no stress.
            </p>
          </div>

          <div className="flex flex-col md:flex-row sm:flex-row  h-[70%] ">


            {/* Upload & Preview Box */}
            <div className="w-[100%] md:[60%] sm:[60%] flex flex-col items-center justify-centerrounded-lg p-4 sm:p-6">

              <div className="w-full h-full  flex flex-col items-center ">
                <div className=" flex h-full flex-wrap gap-6 mb-4 relative p-4 sm:p-6 border-2 border-dashed border-slate-300 rounded-lg min-h-[200px] w-full justify-center overflow-auto">
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
               <DndContext
               sensors={sensors}
  collisionDetection={closestCenter}
  onDragEnd={(event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = previews.indexOf(active.id as string);
    const newIndex = previews.indexOf(over.id as string);

    setPreviews((items) => arrayMove(items, oldIndex, newIndex));
    setFiles((items) => arrayMove(items, oldIndex, newIndex));
  }}
>
  <SortableContext items={previews}>
    <div className="flex flex-wrap gap-3">
      {previews.map((src, idx) => (
        <SortableImage
          key={src}
          id={src}
          src={src}
          idx={idx}
          fileName={files[idx]?.name}
          imageindex={imageindex}
          removeImage={removeImage}
        />
      ))}
    </div>
  </SortableContext>
</DndContext>





                </div>
              </div>

            </div>

            {/* Action Buttons */}

            <div className="shadow-2xl rounded-2xl w-full sm:w-[40%] p-6
                flex flex-col gap-6 items-center bg-white">

  {/*Primary Upload Button */}
  <button
    onClick={() => inputRef.current?.click()}
    disabled={imageuploading}
    className="w-full py-4 rounded-xl
               bg-green-500 hover:bg-green-600
               text-white text-xl font-semibold
               shadow-lg
               flex justify-center items-center gap-3
               disabled:opacity-70 disabled:cursor-not-allowed"
  >
    {imageuploading ? (
      <ClipLoader size={22} color="white" />
    ) : (
      <>
        <span>Upload Images</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
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
      </>
    )}
  </button>

  {/* Options */}
  <div className="w-full flex justify-between items-center">

    {/* Show Index */}
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
      />
      <span className="text-sm font-medium text-gray-700">
        Show image index
      </span>
    </label>

    {/* Clear */}
    <button
      onClick={clearAll}
      className="text-sm text-red-500 hover:text-red-600 font-medium"
    >
      Clear all
    </button>
  </div>

  {/*  PDF File Name */}
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-600 mb-1">
      PDF file name
    </label>
    <input
      className="w-full bg-gray-100 border rounded-lg
                 py-3 px-4
                 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      type="text"
      placeholder="Enter PDF file name"
      value={pdfName}
      onChange={(e) => setPdfName(e.target.value)}
    />
  </div>

  {/* Convert Button */}
  <button
    onClick={convertToPdf}
    disabled={loading || previews.length === 0}
    className="w-full py-3 rounded-xl
               bg-indigo-600 hover:bg-indigo-700
               text-white font-semibold
               shadow-md
               disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? "Converting..." : "Convert to PDF"}
  </button>

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
