import {baseUtils} from 'photography-client-lib';

export const utils = baseUtils;

if (process.env.NODE_ENV === 'development') {
  window.utils = baseUtils;
}
