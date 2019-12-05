import {  INPUT_TYPES } from './utils/constants';
import { always } from './utils/utils';

export default {
  title: 'Toggle Social',
  description: `Add a social share icon to each item. Can be set in all layouts. When the icon is clicked
  several social network icons will appear on the item(currently available Facebook, Pinterest, Twitter, Tumbler and Email).
  Notice that the consumer has to handle the event triggered by this button.
  You can use the eventListener property of the ProGallery to listen to this event and create your own implementation.`,
  isRelevant: always,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}