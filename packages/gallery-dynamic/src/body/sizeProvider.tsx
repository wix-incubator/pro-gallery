import React from 'react';
import _ from 'lodash';

export function SizeProvider(props: {
  children: (size: { width: number; height: number }) => JSX.Element;
}) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    const updateSize = _.debounce(() => {
      if (container) {
        setWidth(container.clientWidth);
        setHeight(container.clientHeight);
      }
    }, 60);
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, [container]);

  return (
    <div ref={setContainer} style={{ height: '100%', width: '100%' }}>
      {container && props.children({ width, height })}
    </div>
  );
}
