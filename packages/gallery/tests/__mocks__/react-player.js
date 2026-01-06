// __mocks__/react-player.js
import React from 'react';

// Mock for ReactPlayer that renders a <video> element for test selectors
const ReactPlayer = (props) => {
  // If the test expects multiple videos, allow count override via props (for flexibility)
  const videoCount = props['data-video-count'] || 1;
  return (
    <div data-testid="mock-react-player" {...props}>
      {Array.from({ length: videoCount }).map((_, i) => (
        <video key={i} data-testid="mock-video-element" />
      ))}
    </div>
  );
};
ReactPlayer.displayName = 'ReactPlayer';
ReactPlayer.default = ReactPlayer;
export default ReactPlayer;
