import React from 'react';

export default function MouseCursor() {
  return (
    <div className="custom-cursor">
      <div className="left" style={{ opacity: '0' }}>
        left
      </div>
      <div className="right" style={{ opacity: '0' }}>
        right
      </div>
    </div>
  );
}
