export interface Settings {
  disableSSROpacity?: boolean;
  avoidInlineStyles?: boolean;
  imageProps?: (id: string) => { [key: string]: any }; //eslint-disable-line
}
