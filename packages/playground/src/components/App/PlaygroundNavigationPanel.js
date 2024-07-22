import React, {
  useEffect, 
  // Suspense, 
  useState
} 
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
  Steps,
  // Card,
} from "antd";
const { Step } = Steps;

export function NavigationPanel(props) {
  const [activeIdx, setActiveIndex] = useState(props.navigationPanelAPI.currentIndex());
  props.navigationPanelAPI.assignIndexChangeCallback(setActiveIndex)
  useEffect(() => {
    if(props.navigationPanelAPI.currentIndex() !== activeIdx) {
      props.navigationPanelAPI.toIndex(activeIdx)
    }      
  }, [activeIdx,props.navigationPanelAPI]);

  const APINavigationPanel = (props) => {
    const activeIdx = props.navigationPanelAPI.currentIndex();
    const percent = (activeIdx + 1 )/ props.totalItemsCount
    const totalForProgress = props.totalItemsCount === Infinity ? 100 : props.totalItemsCount
    let containerStyles = {
      maxWidth: props.options.layoutParams.thumbnails.position === 'ON_GALLERY' ? '150px' : '',
    } 
    return (<div style={containerStyles}>
      {getAllKindsOfButtons(props.navigationPanelAPI)}
      <Progress percent={Math.round(percent*100)} steps={totalForProgress} size="medium" strokeColor={green[6]} />
    </div>
    )
  };
  const circlesNavigationPanel = (props) => {

    let items = props.galleryStructure.items
    let direction;
    switch (props.options.galleryThumbnailsAlignment) { // TODO use new sp when they work well with the playground
      case 'top': 
      case 'bottom':
        direction = 'horizontal';
        break;
      case 'right':
      case 'left':
      default:
        direction = 'vertical';
        break;
      }
      let containerStyles = {
        padding: '20px',
        width: direction === 'horizontal' ? props.container.width : '',
        height: direction === 'vertical' ? props.container.height : '',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
        // backgroundColor: 'rgba(255,255,255,0.6)',
      } 
      let buttonContainerStyle = {
        display:  direction === 'vertical' ? 'flex': '',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
        // backgroundColor: 'rgba(255,255,255,0.6)',
      } 
      const createCircle = (item) => {
        const size = activeIdx === item.idx ? 'large' : 'small';
        return  <Button type="primary" shape="circle" size={size} onClick={()=>setActiveIndex(item.idx)}>{item.idx}</Button>
      }
    return (<div style={containerStyles}>
      <div style={buttonContainerStyle}>
      {items.map(createCircle
        )}
        </div>
  </div>)
  };
  const stepsNavigationPanel = (props) => {
    let items = props.galleryStructure.items
    let direction;
    switch (props.options.galleryThumbnailsAlignment) { // TODO use new sp when they work well with the playground
      case 'top': 
      case 'bottom':
        direction = 'horizontal';
        break;
      case 'right':
      case 'left':
      default:
        direction = 'vertical';
        break;
    }
    let containerStyles = {
      backgroundColor: 'rgba(255,255,255,0.6)',
      minWidth: '100px',
      minHeight: '100px',
      width: direction === 'horizontal' ? props.container.width : '',
      height: direction === 'vertical' ? props.container.height : '',
    } 

    return (<div style={containerStyles}>
      <Steps direction={direction} size="small" type="navigation" onChange={setActiveIndex} current={activeIdx}>
      {items.map(createStep
      )}
  </Steps>
  </div>)
  };
  const createButton = (buttonName, func, disabled) => {
    return <Button onClick={func} disabled={disabled}>{buttonName}</Button>
  }
  const createStep = (item) => {
    return     <Step title={item.dto.metadata.title} description={item.dto.metadata.description} />

  }
  const getAllKindsOfButtons = ({next,triggerItemClick,back,navigatePreviousEnabled, navigateNextEnabled, previousItem, previousGroup, toIndex, getCurrentActiveItemIndex, getCurrentActiveGroupIndex}) => {
    const buttonConfig = [
      ['Previous item', back, !navigatePreviousEnabled()],
      ['Next item', async ()=>{
        console.time('SCROLLING NEXT')
        await next(); //Scrolling functions are async. 
        console.timeEnd('SCROLLING NEXT')
      }, !navigateNextEnabled()],
      ['toIndex 3', async ()=>{
        console.time('SCROLLING to item 3')
        await navigateToIndex(3); //Scrolling functions are async. 
        console.timeEnd('SCROLLING to item 3')
      }, false],
      ['toIndex 0', ()=> navigateToIndex(0), false],
      ['toIndex 10', ()=> navigateToIndex(10), false],
      ['ItemAction', (e)=>triggerItemClick(e), false],
      ['Item 3 action', (e)=>triggerItemClick(e, {itemIndex: 3}), false],
    ]
    return (
      <div class="navigation-panel-buttons">
        {buttonConfig.map(elem=>{
          return (createButton(...elem))
        })}
      </div>
    )
  }
  switch (props.panelType) {
    case 'steps':
      return stepsNavigationPanel(props)
    case 'circles':
      return circlesNavigationPanel(props)
    case 'api':
      return APINavigationPanel(props)
    default:
    return APINavigationPanel(props)
  }
}
