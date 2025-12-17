import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";


export default function SortableImage({
  id,
  src,
  idx,
  fileName,
  imageindex,
  removeImage,
}: {
  id: string;
  src: string;
  idx: number;
  fileName?: string;
  imageindex: boolean;
  removeImage: (index: number) => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative w-14 sm:w-18 h-14 sm:h-18 group cursor-grab active:cursor-grabbing"
    >
      {/* Close Button */}
      <button
        onClick={(e) => {
           removeImage(idx);
          e.stopPropagation(); 
          
        }}
        className="absolute -top-2 -right-2 z-10 w-5 h-5 rounded-full
                   bg-red-500 text-white text-xs
                   flex items-center justify-center
                   hover:opacity-70"
      >
        ✕
      </button>

      {/* Image */}
      <div
        {...listeners}
       className="w-full h-full rounded overflow-hidden border p-1 bg-white cursor-grab active:cursor-grabbing touch-auto">
        <img
          src={src}
          title={fileName}
          alt={fileName}
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Filename / Index */}
      <p className="text-xs text-center mt-1 text-slate-500 truncate">
        {imageindex
          ? idx + 1
          : fileName && fileName.length > 12
          ? fileName.slice(0, 12) + "…"
          : fileName}
      </p>
    </div>
  );
}
