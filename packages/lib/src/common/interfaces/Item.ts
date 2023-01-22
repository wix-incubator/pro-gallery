/* eslint-disable */
export type Item = PhotoItem | VideoItem | TextItem | Object3DItem;

export interface PhotoItem extends GenericItem {
  [key: string]: any;
  // metadata: PhotoMetadata;
  // token?: string;
  // imageToken?: string;
}

export interface VideoItem extends GenericItem {
  [key: string]: any;
  // metadata: VideoMetadata;
}

export interface TextItem extends GenericItem {
  [key: string]: any;
  // metadata: TextMetadata;
}

export interface Object3DItem extends GenericItem {
  [key: string]: any;
  // metadata: Object3DMetadata;
}

export interface GenericItem {
  // itemId: string;
  // mediaUrl?: string;
  // url?: string;
  // orderIndex?: number;
  // isSecure?: boolean; // not in use in the core
}

// interface PhotoMetadata extends GenericMetadata {
//   type?: string;
//   focalPoint?: number[];
//   sharpParams?: SharpParams;
//   tags?: any[]; // in use only for galleryItem->isDemo
//   wm?: any; // not in use in the core
//   isDemo?: boolean; // in use only in galleryItem
// }
//
// interface VideoMetadata extends GenericMetadata {
//   type: string;
//   videoUrl?: string;
//   poster?: VideoPoster;
//   posters?: VideoPoster[];
//   customPoster?: VideoPoster;
//   focalPoint?: [number, number];
//   isDemo?: boolean; // in use only in galleryItem
//   isExternal?: boolean;
//   qualities?:
//       | []
//       | {
//     height: number;
//     width: number;
//     quality: string;
//     formats: string[];
//   }[];
//   duration?: number; // not in use in PG core
//   source?: string; // not in use in PG core
//   videoId?: string; // not in use in PG core
// }
//
// interface TextMetadata extends GenericMetadata {
//   type: string;
//   html: string;
//   editorHtml?: string; // in use in blueprint newItemsParams, maybe can be removed from there (as not in use in PG core)
//   textStyle: {
//     backgroundColor: string;
//     // [key: string]: any;
//   };
//   fontPickerStyleParamName?: any; // not in use in PG core
// }
//
/// interface Object3DMetadata extends GenericMetadata {
//   type: string;
//   url: string;
//   focalPoint?: [number, number];
//  scene?: ThreeDimensionalScene;
//}
//
// interface GenericMetadata {
//   height: number;
//   width: number;
//   title?: string;
//   description?: string;
//   alt?: string;
//   name?: string; // not in use in PG core
//   fileName?: string;
//   sourceName?: string; // in use only for galleryItem->isDemo
//   lastModified?: number; // in use only in galleryItem
//   link?: ProGalleryLink;
//   size?: number; // not in use in PG core
// }
//
// interface ProGalleryLink {
//   target: string;
//   type?: string;
//   url?: string;
//   text?: string;
//   data?: {
//     type: string;
//     target?: string;
//     url?: string;
//     pageName?: string;
//     pageId?: string;
//     anchorName?: string;
//     anchorDataId?: string;
//     name?: string;
//     docId?: string;
//     indexable?: boolean;
//     recipient?: string;
//     subject?: string;
//     phoneNumber?: string;
//   };
// }
//
// interface SharpParams {
//   L: {
//     overrideQuality?: boolean;
//     overrideUsm?: boolean;
//     quality?: number;
//     usm?: {
//       usm_a: number;
//       usm_r: number;
//       usm_t: number;
//     };
//   };
// }
//
// interface VideoPoster {
//   height: number;
//   width: number;
//   url: string;
// }
/* eslint-enable */
