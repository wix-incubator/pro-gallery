import React from "react";
// import { LayoutPicker } from "../LayoutPicker";
import { JsonEditor } from "../JsonEditor";
import { useGalleryContext } from "../../hooks/useGalleryContext";
import { CodePanel } from "../CodePanel";
import { Benchmarks } from "../Benchmarks";
import { Collapse } from "antd";
import { SUB_SECTIONS, SECTIONS } from '../../utils/settingsManager';
import { Alert } from 'antd';
import s from './SideBar.module.scss';

function SideBar() {
  const {
    // preset,
    // setPreset,
    setStyleParams,
    styleParams,
  } = useGalleryContext();

  const conclusions =
  // eslint-disable-next-line no-sparse-arrays
  ['setting that now we save in "appSettings" storage but can be converted to styleParams \n'+
  'watermarkOpacity\n'+
  'watermarkSize\n'+
  'watermarkDock\n'
  ,
  '--> properties to support when building settings:\n'+
  'Font \\ Color picker: \n'+
  'INPUT_TYPES.TEXT - maxLength\n'+
  'INPUT_TYPES.NUMBER - step\n'
  ,
  '--> settings that are in styleParamBuilder but can not be changed form playground interface: \n'+
  'fullscreen\n'+
  'collageAmount\n'+
  'gallerySizeType - wixers\n'+
  'groupSize\n'+
  'chooseBestGroup - wixers\n'+
  'groupTypes - wixers\n'+
  'rotatingGroupTypes - wixers\n'+
  'rotatingCropRatios - wixers\n'+
  'cubeImages - wixers\n'+
  'smartCrop - wixers\n'+
  'cubeRatio - wixers\n'+
  'fixedColumns - wixers\n'+
  'groupsPerStrip - wixers\n'+
  'placeGroupsLtr - wixers\n'+
  'galleryType - check that all layout define this property\n',
  ,
  '--> Mobile: \n'+
  '*) in mobile the default are deferent\n'+
  '*) context.isMobile - itemClick option is responsive to mobile \n'+
  '*) I saw that mobile properties are generated with \'m_\' in settings-controller \n'+
  '*) properties that are not implemented  - mobile needs to be checked - this is not a complete list \n'+
  'm_numberOfImagesPerRow\n'+
  'mobilePanorama\n'+
  'm_isAutoSlideshow\n'+
  'm_galleryLayout\n'+
  'm_slideshowLoop - defined but I don\'t see where we use it\n'+
  'm_playButtonForAutoSlideShow - defined but I don\'t see where we use it\n'+
  'mobileSwipeAnimation\n'];

  console.log({SUB_SECTIONS});

  return (
    <>
    <h3 className={s.title}>Gallery Settings</h3>
    <div className={s.controls}>
    <Collapse bordered={true} defaultActiveKey={[]} onChange={() => {}} expandIconPosition={'right'}>
      <Collapse.Panel header="Layout" key="1">
        {/* <LayoutPicker selectedLayout={preset} onSelectLayout={setPreset} />
        <Divider /> */}
        <JsonEditor 
          onChange={setStyleParams} 
          styleParams={styleParams}
          section={SECTIONS.LAYOUT}
        />
      </Collapse.Panel>
      {Object.values(SECTIONS).map((section, idx) => {
        if (section !== SECTIONS.LAYOUT) {
          if (!SUB_SECTIONS[section.toUpperCase()]) {
            return (
              <Collapse.Panel header={section} key={idx + 1}>
                <JsonEditor
                  section={section}
                  onChange={setStyleParams}
                  styleParams={styleParams}
                />
              </Collapse.Panel>
            )
          } else {
            return Object.values(SUB_SECTIONS[section.toUpperCase()]).map((subSection, subIdx) => {
              return (
                <Collapse.Panel header={`${section} > ${subSection}`} key={subIdx * 100 + idx + 1}>
                  <JsonEditor
                    section={section}
                    subSection={subSection}
                    onChange={setStyleParams}
                    styleParams={styleParams}
                  />
                </Collapse.Panel>                
              );
            });
          }
        }
        return null;
      })}
    </Collapse>
    </div>
    <h3 className={s.title}>Playground Gizmos</h3>
    <div className={s.controls}>
      <Collapse bordered={true} defaultActiveKey={[]} onChange={() => {}}>
        <Collapse.Panel header="Benchmarks" key="13">
          <Benchmarks />
        </Collapse.Panel>
        <Collapse.Panel header="Code Generator" key="14">
          <CodePanel />
        </Collapse.Panel>
        <Collapse.Panel header="ToDos" key="15">
          {conclusions.map((conclusion, idx) => <Alert key={idx} message={conclusion} type="info"/>)}
        </Collapse.Panel>
      </Collapse>
    </div>
    </>
  );
}

export { SideBar };
