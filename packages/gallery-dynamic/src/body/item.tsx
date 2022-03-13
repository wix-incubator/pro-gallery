import React, { CSSProperties, memo } from 'react';
import { useItem } from '../controller/item';
import { ItemProps } from '../types/item';
import { motion } from 'framer-motion';
import { getDistanceToViewport } from '../logic/viewport';
import { isNew } from '../utils/memo';

function ItemBody(props: ItemProps): JSX.Element {
  const item = useItem(props);
  const { containerMotion, contentMotion, image, isInViewport, setHover } =
    item;

  if (!isInViewport) {
    return <></>;
  }

  const {
    engine: containerEngine,
    transitionDuration: containerTransitionDuration,
  } = props.styling.elements.container;
  const {
    engine: contentEngine,
    transitionDuration: contentTransitionDuration,
  } = props.styling.elements.content;

  const Container = containerEngine === 'framer-motion' ? motion.div : 'div';
  const Content = contentEngine === 'framer-motion' ? motion.div : 'img';

  const containerStyle =
    containerEngine === 'framer-motion'
      ? {
          ...containerMotion.transform,
          ...containerMotion.style,
        }
      : (containerMotion.style as CSSProperties);

  const contentStyle = {
    ...(contentEngine === 'framer-motion'
      ? {
          ...contentMotion.transform,
        }
      : {}),
    ...contentMotion.style,
    backgroundImage: `url(${image.backgroundSrc})`,
    backgroundSize: 'cover',
  };

  const containerProps =
    containerEngine === 'framer-motion'
      ? {
          style: containerStyle,
          animate: containerStyle,
          transition: {
            type: 'keyframes' as const,
            duration: containerTransitionDuration / 1000,
          },
        }
      : {
          style: {
            ...containerStyle,
            transition: `all ${containerTransitionDuration}ms linear, z-index 0s`,
          },
        };
  const contentProps =
    contentEngine === 'framer-motion'
      ? {
          style: contentStyle,
          animate: contentStyle,
          transition: {
            type: 'keyframes' as const,
            duration: contentTransitionDuration / 1000,
          },
        }
      : {
          style: {
            ...contentStyle,
            transition: `all ${contentTransitionDuration}ms linear, z-index 0s`,
          },
        };

  return (
    <Container
      {...(containerProps as any)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Content
        {...(contentProps as any)}
        src={image.src}
        loading={image.isLazy ? 'lazy' : 'eager'}
      />
    </Container>
  );
}

export const Item = memo(ItemBody, (prev, next) => {
  const { distance, placement } = getDistanceToViewport(next);
  return (
    next.settings.layoutParams.viewportThreshold < distance &&
    !isNew(prev, next, placement) &&
    prev.galleryStructure === next.galleryStructure
  );
});
