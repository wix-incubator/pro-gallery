export interface VirtualizationSettings {
  /**
   * @description enable item virtualization and only load items that are visible on the screen or in the screen margin
   * @default false
   */
  enabled?: boolean;
  /**
   * @description how many item margins (item / gallery-screen-size) to load as a buffer to the right
   * @default 3
   */
  forwardItemMargin?: number;
  /**
   * @description how many item margins (item / gallery-screen-size) to load as a buffer to the left
   * @default 3
   * */
  backwardItemMargin?: number;
  /**
   * @description how many item margins (item / gallery-screen-size) to load as a buffer to the right when in scroll slideshow mode
   * @default 10
   */
  forwardItemScrollMargin?: number;
  /**
   * @description how many item margins (item / gallery-screen-size) to load as a buffer to the left when in scroll slideshow mode
   * @default 10
   */
  backwardItemScrollMargin?: number;
  /**
   * @description should load dummy items until the real items are loaded
   * @default true
   * @ignore not implemented - always true
   * */
  useDummyItems?: boolean;
}
