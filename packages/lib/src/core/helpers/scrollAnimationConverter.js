export const advancedScrollAnimationConverter = (animation) => {
  return (
    {
      FADE: [
        {
          type: 'FADE',
          fromValue: 0,
          toValue: 1,
          fromAnchor: 'ENTRY',
          toAnchor: 'ENTRY',
          fromPosition: 0,
          toPosition: 100,
          iterations: 10,
          transitionDuration: 2000,
          ease: 'easeOutCubic',
        },
      ],
      GRAYSCALE: [
        {
          type: 'GRAYSCALE',
          fromValue: 100,
          toValue: 0,
          fromAnchor: 'ENTRY',
          toAnchor: 'ENTRY',
          fromPosition: 0,
          toPosition: 0,
          iterations: 1,
          transitionDuration: 1000,
          ease: 'easeInSine',
        },
      ],
      SLIDE_UP: [
        {
          type: 'SLIDE',
          fromValue: 250,
          toValue: 0,
          fromAnchor: 'ENTRY',
          toAnchor: 'ENTRY',
          fromPosition: 0,
          toPosition: 0,
          iterations: 1,
          ease: 'easeOutCubic',
          transitionDuration: 1000,
        },
      ],
    }[animation] || []
  );
};
