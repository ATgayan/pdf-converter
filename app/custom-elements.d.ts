// custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    "cropper-canvas": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      ref?: React.Ref<any>;
      background?: boolean;
    };
    "cropper-image": React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLElement>, HTMLElement> & {
      rotatable?: boolean;
      scalable?: boolean;
      skewable?: boolean;
      translatable?: boolean;
      src: string;
      alt?: string;
    };
    "cropper-shade": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      hidden?: boolean;
    };
    "cropper-selection": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      initialCoverage?: string;
      movable?: boolean;
      resizable?: boolean;
    };
    "cropper-grid": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      role?: string;
      covered?: boolean;
    };
    "cropper-crosshair": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      centered?: boolean;
    };
    "cropper-handle": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      action?: string;
      plain?: boolean;
      "theme-color"?: string;
    };
  }
}
