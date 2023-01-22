const EVENTS = {
  APP_LOADED: 'APP_LOADED',
  ITEM_CREATED: 'ITEM_CREATED',
  ITEM_LOADED: 'ITEM_LOADED',
  GALLERY_CHANGE: 'GALLERY_CHANGE',
  ITEM_ACTION_TRIGGERED: 'ITEM_ACTION_TRIGGERED',
  CURRENT_ITEM_CHANGED: 'CURRENT_ITEM_CHANGED',
  NEED_MORE_ITEMS: 'NEED_MORE_ITEMS',
  VIDEO_ENDED: 'VIDEO_ENDED',
  VIDEO_ERROR: 'VIDEO_ERROR',
  VIDEO_PAUSED: 'VIDEO_PAUSED',
  VIDEO_PLAYED: 'VIDEO_PLAYED',
  HOVER_SET: 'HOVER_SET',
  LOAD_MORE_CLICKED: 'LOAD_MORE_CLICKED',
  ITEM_CLICKED: 'ITEM_CLICKED',
  THUMBNAIL_CLICKED: 'THUMBNAIL_CLICKED',
  ITEM_FOCUSED: 'ITEM_FOCUSED',
  ITEM_LOST_FOCUS: 'ITEM_LOST_FOCUS',
  GALLERY_SCROLLED: 'GALLERY_SCROLLED',
} as const;

export default EVENTS;
