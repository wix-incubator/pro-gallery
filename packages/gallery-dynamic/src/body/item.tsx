import React from 'react';
import { useItem } from '../controller/item';
import { ItemProps } from '../types/item';
import { motion } from 'framer-motion';

export function Item(props: ItemProps): JSX.Element {
  const item = useItem(props);
  const { isInViewport, containerMotion, contentMotion, image } = item;

  return (
    <motion.div
      style={{ ...containerMotion.style, ...containerMotion.transform }}
      transition={containerMotion.transition}
    >
      {isInViewport && (
        <motion.img
          src={image.src}
          loading={image.isLazy ? 'lazy' : 'eager'}
          style={{
            ...contentMotion.style,
            ...contentMotion.transform,
            backgroundImage: `url(${image.backgroundSrc})`,
          }}
          transition={contentMotion.transition}
        />
      )}
    </motion.div>
  );
}
