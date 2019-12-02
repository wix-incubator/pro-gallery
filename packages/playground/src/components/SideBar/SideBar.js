import React, { useState } from "react";
import { LayoutPicker } from "../LayoutPicker";
import { JsonEditor } from "../JsonEditor";
import { useGalleryContext } from "../../hooks/useGalleryContext";
import { CodePanel } from "../CodePanel";
import { Benchmarks } from "../Benchmarks";
import { Switch, Select, Form, InputNumber, Collapse, AutoComplete, Input, Button, Icon, Card } from "antd";
import { SECTIONS, settingsManager } from '../../settings/settingsManager';
import { INPUT_TYPES } from '../../settings/consts';
import { Divider, Alert } from 'antd';
import comments from './comments';
import { throttle } from "../../utils/utils";
import s from './SideBar.module.scss';

function SideBar() {
  const {
    // preset,
    // setPreset,
    setGallerySettings,
    setStyleParams,
    styleParams,
    isUnknownDimensions,
    isAvoidGallerySelfMeasure,
    setIsUnknownDimensions,
    setIsAvoidGallerySelfMeasure,
    setShowAllStyles,
    showAllStyles
  } = useGalleryContext();

  const [searchResult, setSearchResult] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const _setStyleParams = throttle(setStyleParams, 1000);
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
        {searchResult &&
          <Card style={{
            padding: 0,
            margin: '2px -17px',
            background: 'transparent',
            border: 'none',
          }}>
            <JsonEditor
              onChange={_setStyleParams}
              styleParams={{ [searchResult]: styleParams[searchResult] }}
              section={settingsManager[searchResult].section}
              styleParam={searchResult}
              expandIcon={() => <Icon onClick={() => resetSearch()} type="close" />}
            />
          </Card>
        }
      </div>
      <h3 className={s.title}>Gallery Settings</h3>
      <div className={s.controls}>
        <Collapse accordion={true} bordered={true} defaultActiveKey={[1]} onChange={() => { }} expandIconPosition={'right'}>
          <Collapse.Panel header={SECTIONS.PRESET} key="1">
            <LayoutPicker selectedLayout={styleParams.galleryLayout} onSelectLayout={galleryLayout => setStyleParams('galleryLayout', galleryLayout)} />
            <Divider />
            <JsonEditor
              onChange={_setStyleParams}
              styleParams={styleParams}
              section={SECTIONS.PRESET}
              showAllStyles={showAllStyles}
            />
          </Collapse.Panel>
          {Object.values(SECTIONS).map((section, idx) => {
            if (section !== SECTIONS.PRESET) {
              return (
                <Collapse.Panel header={section} key={idx + 1}>
                  <JsonEditor
                    section={section}
                    onChange={_setStyleParams}
                    styleParams={styleParams}
                    showAllStyles={showAllStyles}
                  />
                </Collapse.Panel>
              )
            }
            return null;
          })}
        </Collapse>
      </div>
      <h3 className={s.title}>Playground Gizmos</h3>
      <div className={s.controls}>
        <Collapse accordion={true} bordered={true} defaultActiveKey={[]} onChange={() => { }}>
          <Collapse.Panel header="Media Types" key="media">
            <Form layout="vertical">
              <Form.Item label="Number of Items" help="Set to 0 for Infinite items">
                <InputNumber min={0} max={100} defaultValue={0} onChange={val => setGallerySettings({ numberOfItems: val })} />
              </Form.Item>
              <Form.Item label="Media Type">
                <Select defaultValue="mixed" onChange={val => setGallerySettings({ mediaType: val })}>
                  <Select.Option value="mixed">Images, Videos and Texts</Select.Option>
                  <Select.Option value="images">Images Only</Select.Option>
                  <Select.Option value="videos">Videos Only</Select.Option>
                  <Select.Option value="texts">Texts Only</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="Gallery Styles" key="styles">
            <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
              <Form.Item label="Show all Styles" labelAlign="left">
                <Switch checked={showAllStyles} onChange={e => setShowAllStyles(e)} />
              </Form.Item>
              <Form.Item label="Reset to Default Gallery" labelAlign="left">
                <Button icon="delete" shape="circle" size="large" onClick={() => window.location.search = ''} />
              </Form.Item>
              <Form.Item label="Lean Gallery" labelAlign="left">
                <Button icon="interaction" shape="circle" size="large" onClick={() => window.location.search = 'gridStyle=1&allowHover=false&galleryLayout=2'} />
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="Simulators" key="simulators">
            <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
              <Form.Item label="Unknown dimension" labelAlign="left">
                <Switch checked={isUnknownDimensions} onChange={e => setIsUnknownDimensions(e)} />
              </Form.Item>
              <Form.Item label="Avoid Pro-Gallery self measure" labelAlign="left">
                <Switch checked={isAvoidGallerySelfMeasure} onChange={e => setIsAvoidGallerySelfMeasure(e)} />
              </Form.Item>
              {(window.location.hostname.indexOf('localhost') >= 0) && <Form.Item label="Simulate Local SSR" labelAlign="left">
                <Button shape="circle" icon="bug" target="_blank" href={`http://localhost:3001/?seed=${Math.floor(Math.random() * 10000)}&${Object.entries(styleParams).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')}`} />
              </Form.Item>}
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="Benchmarks" key="benchmarks">
            <Benchmarks />
          </Collapse.Panel>
          <Collapse.Panel header="ToDos" key="todos">
            {comments.map((comment, idx) => <Alert key={idx} message={comment} type="info" />)}
          </Collapse.Panel>
        </Collapse>

        <div style={{height:100}} />

        <div className={s.code}>
          <CodePanel />
        </div>

      </div>
    </>
  );
}

export { SideBar };
