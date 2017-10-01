import {BaseUtils} from 'photography-client-lib';

export const utils = new BaseUtils();

if (process.env.NODE_ENV === 'development') {
  window.utils = baseUtils;
}
