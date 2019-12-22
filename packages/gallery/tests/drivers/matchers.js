import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

export const toMatchImageSnapshot = configureToMatchImageSnapshot({
  noColors: true,
  failureThreshold: 1,
  failureThresholdType: 'percent',
  blur: 1
});
