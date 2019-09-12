import React, {useState} from "react";
// import { LayoutPicker } from "../LayoutPicker";
import { JsonEditor } from "../JsonEditor";
import { useGalleryContext } from "../../hooks/useGalleryContext";
import { CodePanel } from "../CodePanel";
import { Benchmarks } from "../Benchmarks";
import { Checkbox, Collapse, AutoComplete, Input, Button, Icon, Card } from "antd";
import { settingsManager } from '../../settings/settingsManager';
import { SUB_SECTIONS, SECTIONS, INPUT_TYPES } from '../../settings/consts';
import { Alert } from 'antd';
import comments from './comments';
import s from './SideBar.module.scss';

function SideBar() {
  const {
    // preset,
    // setPreset,
    setStyleParams,
    styleParams,
    setIsFullWidth,
    isFullWidth
  } = useGalleryContext();

  const [searchResult, setSearchResult] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const createSearchString = (styleParam, searchTerm) => {
    let res = [styleParam];
    const props = settingsManager[styleParam];
    res.push(props.title || '');
    res.push(props.description || '');
    if (props.type === INPUT_TYPES.OPTIONS) {
      res = res.concat(props.options.map(option => option.title));
    };
    res = res.join('|').toLowerCase();
    return res;
  };
  // const dataSource = Object.entries(settingsManager)
  //   .filter(([styleParam]) => createSearchString(styleParam, searchTerm).indexOf(searchTerm.toLowerCase()) >= 0)
  //   .sort(([styleParam, props], [styleParam2, props2]) => props.title > props2.title ? 1 : -1)
  //   .map(([styleParam, props]) => (
  //     <AutoComplete.Option key={styleParam}>
  //       <Card size="small" title={props.title} type="inner" style={{
  //         whiteSpace: 'pre-wrap'
  //       }}>
  //         <p><b>Key: </b>{styleParam}</p>
  //         {props.description && <p><b>Description: </b>{props.description}</p>}
  //         <p><b>Section: </b>{props.section}</p>
  //         <p><b>Relevant in current configuration: </b>{props.isRelevant(styleParams, false) ? 'Yes' : 'No'}</p>
  //       </Card>
  //     </AutoComplete.Option>
  //   ));

  // console.log({dataSource, searchResult, styleParams});

  const dataSource = Object.entries(settingsManager)
  .filter(([styleParam]) => createSearchString(styleParam, searchTerm).indexOf(searchTerm.toLowerCase()) >= 0)
  .sort(([styleParam, props], [styleParam2, props2]) => props.title > props2.title ? 1 : -1)
  .map(([styleParam, props]) => (
      <AutoComplete.Option key={styleParam}>{props.title}</AutoComplete.Option>
  )); //`(${styleParam}) ${props.title}`);

  const resetSearch = () => {
    setSearchResult('');
    setSearchTerm('');
  };

  return (
    <>
    <div className="global-search-wrapper" style={{ width: 'calc(100% - 16px)', margin: '0 8px' }}>
      <AutoComplete
        size="large"
        style={{ width: '100%', margin: '10px 1px' }}
        dataSource={dataSource}
        onSelect={(val) => setSearchResult(val)}
        onSearch={(val) => setSearchTerm(val)}
        placeholder="Search Style Params"
        value={searchTerm}
      >
        <Input
          suffix={
            <Button
              className="search-btn"
              style={{ marginRight: -12 }}
              size="large"
              type="primary"
            >
              <Icon type="search" />
            </Button>
          }
        />
      </AutoComplete>
      { searchResult && 
        <Card style={{
          padding: 0,
          margin: '2px -17px',
          background: 'transparent',
          border: 'none',
        }}>
          <JsonEditor 
            onChange={setStyleParams} 
            styleParams={{[searchResult]: styleParams[searchResult]}}
            section={settingsManager[searchResult].section}
            styleParam={searchResult}
            expandIcon={() => <Icon onClick={() => resetSearch()} type="close"/>}
          />
        </Card>
      }
    </div>
    <h3 className={s.title}>Gallery Settings</h3>
    <div className={s.controls}>
      <Collapse accordion={true} bordered={true} defaultActiveKey={[]} onChange={() => {}} expandIconPosition={'right'}>
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
      <Collapse accordion={true} bordered={true} defaultActiveKey={[]} onChange={() => {}}>
        <Collapse.Panel header="Simulate Full Width" key="12">
          <Checkbox checked={isFullWidth} onChange={e => setIsFullWidth(e.target.checked)}>Simulate Full Width (SSR)</Checkbox>
        </Collapse.Panel>
        <Collapse.Panel header="Benchmarks" key="13">
          <Benchmarks />
        </Collapse.Panel>
        <Collapse.Panel header="Code Generator" key="14">
          <CodePanel />
        </Collapse.Panel>
        <Collapse.Panel header="ToDos" key="15">
          {comments.map((comment, idx) => <Alert key={idx} message={comment} type="info"/>)}
        </Collapse.Panel>
      </Collapse>
    </div>
    </>
  );
}

export { SideBar };
