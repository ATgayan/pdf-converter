"use client";

// app/components/CropImage.tsx
import dynamic from "next/dynamic";

const CropPopup = dynamic(() => import("./CropImage"), { ssr: false });

export default CropPopup;
