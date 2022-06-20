import React, {useEffect, Suspense, useState} from 'react';


export function NavigationPanel(props) {
  const renderNavigationPanel = (props) => {
    
    return  <>
      {getAllKindsOfButtons(props.navigationPanelAPI)}
      {props.navigationPanelAPI.getActiveItemIndex()}
    </>
    ;
  };
  const createButton = (buttonName, func, disabled) => {
    return <button onClick={func} disabled={disabled}>{buttonName}</button>
  }
  const getAllKindsOfButtons = ({next,back,isAbleToNavigateBack, isAbleToNavigateNext, previousItem, previousGroup, toIndex, getCurrentActiveItemIndex, getCurrentActiveGroupIndex}) => {
    const buttonConfig = [
      ['Next item', async ()=>{
        console.time('SCROLLING NEXT')
        await next(); //Scrolling functions are async. 
        console.timeEnd('SCROLLING NEXT')
      }, !isAbleToNavigateNext()],
      ['Previous item', back, !isAbleToNavigateBack()],
      ['toIndex 3', async ()=>{
        console.time('SCROLLING to item 3')
        await toIndex(3); //Scrolling functions are async. 
        console.timeEnd('SCROLLING to item 3')
      }, false],
      ['toIndex 0', ()=>toIndex(0), false],
      ['toIndex 10', ()=>toIndex(10), false],
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
