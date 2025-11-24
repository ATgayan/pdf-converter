"use client";

import React, { useEffect, useRef, useState } from "react";
import "@cropper/element-canvas";
import "@cropper/element-image";
import "@cropper/element-handle";
import "@cropper/element-selection";
import "@cropper/element-grid";
import "@cropper/element-crosshair";
import "@cropper/element-shade";

interface CropPopupProps {
  image: string; // blob URL or normal URL
  onClose: () => void;
  onSave: (croppedImg: string) => void;
}

interface CropperCanvasElement extends HTMLElement {
  getCroppedCanvas: () => HTMLCanvasElement;
}

const CropPopup: React.FC<CropPopupProps> = ({ image, onClose, onSave }) => {
  const cropperRef = useRef<CropperCanvasElement | null>(null);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure this runs only on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  

 useEffect(() => {
  if (!image) return;

  if (image.startsWith("blob:")) {
    fetch(image)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => setLoadedSrc(reader.result as string);
        reader.readAsDataURL(blob);
      });
  } else {
    setLoadedSrc(image);
  }
}, [image]);

 
  console.log("Loaded Src:", loadedSrc);
  
  const handleSave = () => {
    if (!cropperRef.current) return;
    const canvas = cropperRef.current.getCroppedCanvas();
    onSave(canvas.toDataURL("image/jpeg"));
    onClose();
  };

  if (!isClient || !loadedSrc) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Crop Image</h2>

        <div className="relative w-full h-80 rounded ">
          <cropper-canvas
            ref={cropperRef}
            style={{ width: "100%", height: "100%" }}
            background
          >
            <cropper-image
              src={loadedSrc}
              alt="Picture"
              rotatable
              scalable
              skewable
              translatable
            />
            <cropper-shade />
            <cropper-selection initial-coverage="0.5" movable resizable>
              <cropper-grid role="grid" covered />
              <cropper-crosshair centered />
              <cropper-handle action="move" theme-color="rgba(255,255,255,0.35)" />
              <cropper-handle action="n-resize" />
              <cropper-handle action="e-resize" />
              <cropper-handle action="s-resize" />
              <cropper-handle action="w-resize" />
              <cropper-handle action="ne-resize" />
              <cropper-handle action="nw-resize" />
              <cropper-handle action="se-resize" />
              <cropper-handle action="sw-resize" />
            </cropper-selection>
          </cropper-canvas>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropPopup;
