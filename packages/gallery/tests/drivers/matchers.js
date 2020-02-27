import { configureToMatchImageSnapshot } from 'jest-image-snapshot';

export const toMatchImageSnapshot = configureToMatchImageSnapshot({
  noColors: true,
  failureThreshold: 0.01,
  failureThresholdType: 'percent',
  // blur: 1
});
