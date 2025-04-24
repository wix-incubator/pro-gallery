/* eslint-disable */
export interface CreateMediaUrl {
  (args: {
    item: Record<string, any>;
    originalUrl: string;
    resizeMethod: ResizeMethods;
    requiredWidth: number;
    requiredHeight: number;
    sharpParams?: Record<string, any>;
    focalPoint?: [number, number];
    createMultiple?: boolean;
  }): string;
}

type ResizeMethods = 'fill' | 'fit' | 'full' | 'video';

// interface CreateMediaUrlItemData {
//   idx: number;
//   url: string;
//   mediaUrl: string;
//   dto: {
//     mediaUrl: string;
//     metaData: {
//       type: string;
//       posters?: any[];
//     };
//     imageToken?: string;
//     token?: string;
//   };
//   metaData: {
//     watermarkStr: string;
//   }
//   ratio: number;
//   maxHeight: number;
//   maxWidth: number;
//   isDimensionless: boolean;
//   poster?: {
//     height: number;
//     width: number;
//   };
//   qualities?: Record<string, any>[];
// }
/* eslint-enable */
