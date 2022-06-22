import React
//{useEffect, Suspense, useState}
from 'react';
import { 
  // red,
  green
  } from '@ant-design/colors';

import {
  // List,
  // Switch,
  // Select,
  // InputNumber,
  // Collapse,
  // AutoComplete,
  // Input,
  Button,
  Progress,
  // Card,
} from "antd";

export function NavigationPanel(props) {
  const renderNavigationPanel = (props) => {
    const activeIdx = props.navigationPanelAPI.getActiveItemIndex();
    const percent = (activeIdx + 1 )/ props.totalItemsCount
    const totalForProgress = props.totalItemsCount === Infinity ? 100 : props.totalItemsCount
    return  <>
      {getAllKindsOfButtons(props.navigationPanelAPI)}
      <Progress percent={Math.round(percent*100)} steps={totalForProgress} size="medium" strokeColor={green[6]} />
    </>
    ;
  };
  const createButton = (buttonName, func, disabled) => {
    return <Button onClick={func} disabled={disabled}>{buttonName}</Button>
  }
  const getAllKindsOfButtons = ({next,triggerItemAction,back,isAbleToNavigateBack, isAbleToNavigateNext, previousItem, previousGroup, toIndex, getCurrentActiveItemIndex, getCurrentActiveGroupIndex}) => {
    const buttonConfig = [
      ['Previous item', back, !isAbleToNavigateBack()],
      ['Next item', async ()=>{
        console.time('SCROLLING NEXT')
        await next(); //Scrolling functions are async. 
        console.timeEnd('SCROLLING NEXT')
      }, !isAbleToNavigateNext()],
      ['toIndex 3', async ()=>{
        console.time('SCROLLING to item 3')
        await toIndex(3); //Scrolling functions are async. 
        console.timeEnd('SCROLLING to item 3')
      }, false],
      ['toIndex 0', ()=>toIndex(0), false],
      ['toIndex 10', ()=>toIndex(10), false],
      ['ItemAction', (e)=>triggerItemAction(e), false],
      ['Item 3 action', (e)=>triggerItemAction(e, {itemIndex: 3}), false],
    ]
    return (
      <div class="navigation-panel-buttons">
        {buttonConfig.map(elem=>{
          return (createButton(...elem))
        })}
      </div>
    )
  }
  return renderNavigationPanel(props)
}
