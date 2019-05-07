export const SET_SLIDE = 'SET_SLIDE';

export function setSlide(slideIdx) {
  return {
    type: SET_SLIDE,
    slideIdx,
  };
}
