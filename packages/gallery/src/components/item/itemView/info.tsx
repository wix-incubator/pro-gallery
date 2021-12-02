import { GALLERY_CONSTS } from 'pro-gallery-lib';
import React, { CSSProperties } from 'react';
import { IItemViewProps } from '../itemView';
import { getInnerInfoStyle, getOuterInfoStyle } from '../itemViewStyleProvider';
import { getCustomInfoRendererProps } from '../pure';

interface ItemViewInfoProps extends IItemViewProps {
  hasRequiredMediaUrl: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface ExternalInfoElement extends ItemViewInfoProps {
  palcement: string;
  elementName: string;
}

function ExternalInfoElement({
  placement,
  elementName,
  ...props
}): JSX.Element {
  const { options, customComponents, style } = props;
  if (!customComponents.customInfoRenderer) {
    return <></>;
  }
  let info = <></>;
  //if there is no url for videos and images, we will not render the itemWrapper
  //but will render the info element if exists, with the whole size of the item
  const infoHeight =
    options.textBoxHeight + (props.hasRequiredMediaUrl ? 0 : style.height);
  const infoWidth =
    style.infoWidth + (props.hasRequiredMediaUrl ? 0 : style.width);

  const itemExternalInfo = customComponents.customInfoRenderer(
    getCustomInfoRendererProps(props),
    placement
  );

  info = (
    <div
      style={
        getOuterInfoStyle(
          placement,
          options,
          style.height,
          options.textBoxHeight
        ) as CSSProperties
      }
    >
      <div
        style={
          getInnerInfoStyle(
            placement,
            options,
            infoHeight,
            infoWidth
          ) as CSSProperties
        }
        className={'gallery-item-common-info ' + elementName}
        onClick={props.onClick}
      >
        {itemExternalInfo}
      </div>
    </div>
  );

  return info;
}

export function ItemViewTopInfo(props: ItemViewInfoProps): JSX.Element {
  if (
    GALLERY_CONSTS.hasExternalAbovePlacement(
      props.options.titlePlacement,
      props.idx
    )
  ) {
    return (
      <ExternalInfoElement
        {...props}
        placement={GALLERY_CONSTS.placements.SHOW_ABOVE}
        elementName={'gallery-item-top-info'}
      />
    );
  } else {
    return <></>;
  }
}

export function ItemViewLeftInfo(props: ItemViewInfoProps): JSX.Element {
  if (
    GALLERY_CONSTS.hasExternalLeftPlacement(
      props.options.titlePlacement,
      props.idx
    )
  ) {
    return (
      <ExternalInfoElement
        {...props}
        placement={GALLERY_CONSTS.placements.SHOW_ON_THE_LEFT}
        elementName={'gallery-item-left-info'}
      />
    );
  } else {
    return <></>;
  }
}

export function ItemViewRightInfo(props: ItemViewInfoProps): JSX.Element {
  if (
    GALLERY_CONSTS.hasExternalRightPlacement(
      props.options.titlePlacement,
      props.idx
    )
  ) {
    return (
      <ExternalInfoElement
        {...props}
        placement={GALLERY_CONSTS.placements.SHOW_ON_THE_RIGHT}
        elementName={'gallery-item-right-info'}
      />
    );
  } else {
    return <></>;
  }
}

export function ItemViewBottomInfo(props: ItemViewInfoProps): JSX.Element {
  if (
    GALLERY_CONSTS.hasExternalBelowPlacement(
      props.options.titlePlacement,
      props.idx
    )
  ) {
    return (
      <ExternalInfoElement
        {...props}
        placement={GALLERY_CONSTS.placements.SHOW_BELOW}
        elementName={'gallery-item-bottom-info'}
      />
    );
  } else {
    return <></>;
  }
}
