import React from 'react';
import {svgs} from './svgs';
import style from './LayoutPicker.module.scss';

function LayoutPicker({selectedLayout, onSelectLayout}) {
  const renderLayout = layout => {
    return (
      <div
        className={`${style.layoutItem} ${
          selectedLayout === svgs[layout].key ? style.selected : ''
        }`}
        key={layout}
        onClick={() => onSelectLayout(svgs[layout].key)}
      >
        <div className={style.iconButton}>
          <div className={`${style.icon} ${style.reg}`}>
            {React.createElement(svgs[layout].reg)}
          </div>
          <div className={`${style.icon} ${style.sel}`}>
            {React.createElement(svgs[layout].sel)}
          </div>
        </div>
        <div className={style.layoutTitle}>{layout}</div>
      </div>
    );
  };

  return (
    <div className={style.wrapper}>{Object.keys(svgs).map(renderLayout)}</div>
  );
}

export {LayoutPicker};
