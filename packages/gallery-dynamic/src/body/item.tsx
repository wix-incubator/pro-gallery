import React from 'react';
import { useItem } from '../controller/item';
import { ItemProps } from '../types/item';
import { motion } from 'framer-motion';

export function Item(props: ItemProps): JSX.Element {
  const item = useItem(props);
  const { containerMotion, contentMotion, image } = item;

  return (
    <motion.div
      style={{
        ...containerMotion.transform,
        ...containerMotion.style,
      }}
      animate={{
        ...containerMotion.transform,
        ...(containerMotion.style as any),
      }}
      // transition={containerMotion.transition}
      transition={{
        type: 'keyframes',
        duration: 0.1,
      }}
    >
      <motion.img
        src={image.src}
        loading={image.isLazy ? 'lazy' : 'eager'}
        style={{
          ...contentMotion.transform,
          ...contentMotion.style,
          backgroundImage: `url(${image.backgroundSrc})`,
          backgroundSize: 'cover',
        }}
        animate={{
          ...(contentMotion.style as any),
          ...contentMotion.transform,
        }}
        transition={{
          type: 'keyframes',
          duration: 0.1,
        }}
      />
    </motion.div>
  );
}
