export interface CreateMediaUrl {
  (args: {
    item: unknown; //GalleryItem
    originalUrl: string;
    resizeMethod: ResizeMethods;
    requiredWidth: number;
    requiredHeight: number;
    sharpParams?: Record<string, any>;
    focalPoint?: [number, number];
    createMultiple?: boolean;
    imageToken?: string;
    watermark?: string;
  }): string;
}

type ResizeMethods = 'fill' | 'fit' | 'full' | 'video';
