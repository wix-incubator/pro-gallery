import {  INPUT_TYPES } from '../utils/constants';

export default {
  title: 'Allow Social Button',
  description: `Add a social share icon to each item. Triggers the SHARE_BUTTON_CLICKED event. When the icon is clicked,
  several social network icons will appear on the item (currently available Facebook, Pinterest, Twitter, Tumblr and Email).
  Note that the consumer has to handle the event triggered by this button.
  You can use the eventListener property of the ProGallery to listen to this event and create your own implementation.`,
  isRelevant: () => true,
  type: INPUT_TYPES.BOOLEAN,
  default: false,
}