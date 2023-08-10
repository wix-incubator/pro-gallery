import React from 'react';
import { clickable } from 'pro-gallery';
interface RotateArrowProps {
  size: number;
}
// eslint-disable-next-line no-undef
export const RotateArrow = ({ size }: RotateArrowProps): JSX.Element => (
  <clickable.div
    style={{
      cursor: 'pointer',
    }}
    className="playground-play-button"
  >
    <div
      style={{
        zIndex: 11,
        color: 'black',
        fontSize: `${size}px`,
        bottom: '15px',
        left: '15px',
        position: 'absolute',
        display: 'flex',
        textRendering: 'auto',
        height: `${size}px`,
        width: `${size}px`,
        textAlign: 'center',
        background: 'GhostWhite',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {' '}
      <div
        style={{
          verticalAlign: 'baseline',
        }}
      >
        {'↻'}
      </div>
    </div>
  </clickable.div>
);

export default RotateArrow;
