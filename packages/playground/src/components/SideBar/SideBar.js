import React, { useState } from "react";
import { LayoutPicker } from "../LayoutPicker";
import { JsonEditor } from "../JsonEditor";
import { useGalleryContext } from "../../hooks/useGalleryContext";
import { CodePanel } from "../CodePanel";
import { Benchmarks } from "../Benchmarks";
import { List, Switch, Select, Form, InputNumber, Collapse, AutoComplete, Input, Button, Icon, Card } from "antd";
import { SECTIONS, settingsManager } from '../../constants/settings';
import { INPUT_TYPES } from 'pro-gallery-lib';
import { Divider, Alert } from 'antd';
import comments from './comments';
import { throttle } from "../../utils/utils";
import { isValidStyleParam } from "../../constants/styleParams";
import s from './SideBar.module.scss';
import { GALLERY_CONSTS, notEligibleReasons, isEligibleForLeanGallery } from 'pro-gallery';
import 'antd/dist/antd.css';
import { getContainerUrlParams } from "./helper";
import {utils} from 'pro-gallery-lib';

function SideBar({ items, blueprintsManager, visible }) {
  const {
    // preset,
    // setPreset,
    gallerySettings,
    setGallerySettings,
    setStyleParams,
    styleParams,
  } = useGalleryContext(blueprintsManager);

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
    res = res.join('|').toLowerCase().replace(/ /g, '');
    return res;
  };

  const dataSource = Object.entries(settingsManager)
    .filter(([styleParam]) => createSearchString(styleParam, searchTerm).indexOf(searchTerm.toLowerCase().replace(/ /g, '')) >= 0)
    .sort(([styleParam, props], [styleParam2, props2]) => props.title > props2.title ? 1 : -1)
    .map(([styleParam, props]) => (
      <AutoComplete.Option key={styleParam}>{props.title}</AutoComplete.Option>
    )); //`(${styleParam}) ${props.title}`);

  const resetSearch = () => {
    setSearchResult('');
    setSearchTerm('');
  };

  const changedStyleParams = Object.entries(styleParams).filter(([styleParam, value]) => styleParam !== 'galleryLayout' && isValidStyleParam(styleParam, value, styleParams)).reduce((obj, [styleParam, value]) => ({ ...obj, [styleParam]: value }), {});
  const didChangeStyleParams = Object.keys(changedStyleParams).length > 0;

  return (
    <>
      <div className="global-search-wrapper" style={{ width: 'calc(100% - 16px)', margin: '0 8px' }}>
        <AutoComplete
          size="large"
          style={{ width: '100%', margin: '10px 1px' }}
          dataSource={dataSource}
          onSelect={setSearchResult}
          onSearch={setSearchTerm}
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
              allStyleParams={styleParams}
              styleParams={styleParams}
              section={settingsManager[searchResult].section}
              styleParam={searchResult}
              expandIcon={() => <Icon onClick={() => resetSearch()} type="close" />}
              showAllStyles={true}
            />
          </Card>
        }
      </div>
      <h3 className={s.title}>Gallery Settings</h3>
      <div className={s.controls}>
        <Collapse accordion={true} bordered={true} defaultActiveKey={[1]} onChange={() => { }} expandIconPosition={'right'}>
          {didChangeStyleParams ?
            <Collapse.Panel header={'* Changed Settings'} key="-1">
              <JsonEditor
                onChange={_setStyleParams}
                allStyleParams={styleParams}
                styleParams={changedStyleParams}
                showAllStyles={true}
              />
            </Collapse.Panel> : null}
          <Collapse.Panel header={SECTIONS.PRESET} key="1">
            <LayoutPicker selectedLayout={styleParams.galleryLayout} onSelectLayout={galleryLayout => setStyleParams('galleryLayout', galleryLayout)} />
            <Divider />
            <JsonEditor
              onChange={_setStyleParams}
              allStyleParams={styleParams}
              styleParams={styleParams}
              section={SECTIONS.PRESET}
              showAllStyles={gallerySettings.showAllStyles}
            />
          </Collapse.Panel>
          {Object.values(SECTIONS).map((section, idx) => {
            if (section !== SECTIONS.PRESET) {
              return (
                <Collapse.Panel header={section} key={idx + 1}>
                  <JsonEditor
                    section={section}
                    onChange={_setStyleParams}
                    allStyleParams={styleParams}
                    styleParams={styleParams}
                    showAllStyles={gallerySettings.showAllStyles}
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
          <Collapse.Panel header="Media" key="media">
            <Form layout="vertical">
              <Form.Item label="Number of Items" help="Set to 0 for Infinite items">
                <InputNumber min={0} max={100} defaultValue={gallerySettings.numberOfItems || 0} onChange={val => setGallerySettings({ numberOfItems: val })} />
              </Form.Item>
              <Form.Item label="Media Type">
                <Select defaultValue={gallerySettings.mediaType || 'mixed'} onChange={val => setGallerySettings({ mediaType: val })}>
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
                <Switch checked={!!gallerySettings.showAllStyles} onChange={e => setGallerySettings({ showAllStyles: e })} />
              </Form.Item>
              <Form.Item label="Reset to Default Gallery" labelAlign="left">
                <Button icon="delete" shape="circle" size="large" onClick={() => window.location.search = ''} />
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="Benchmarks" key="benchmarks">
            <Benchmarks />
          </Collapse.Panel>
          <Collapse.Panel header="Simulators" key="simulators">
            <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
              <Form.Item label="Unknown dimension" labelAlign="left">
                <Switch checked={!!gallerySettings.isUnknownDimensions} onChange={e => setGallerySettings({ isUnknownDimensions: e })} />
              </Form.Item>
              <Form.Item label="Use Blueprints" labelAlign="left">
                <Switch checked={!!gallerySettings.useBlueprints} onChange={e => setGallerySettings({ useBlueprints: e })} />
              </Form.Item>
              <Form.Item label="Use Layout Fixer" labelAlign="left">
                <Switch checked={!!gallerySettings.useLayoutFixer} onChange={e => setGallerySettings({ useLayoutFixer: e })} />
              </Form.Item>
            </Form>
            <Form layout="vertical">
              <Form.Item label="View Mode">
                <Select defaultValue={gallerySettings.viewMode || GALLERY_CONSTS.viewMode.SITE} onChange={val => setGallerySettings({ viewMode: val })}>
                  {Object.entries(GALLERY_CONSTS.viewMode).map(([key, val]) => <Select.Option key={key} value={key}>{val}</Select.Option>)}
                </Select>
              </Form.Item>
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="Develop" key="develop">
            <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
              <Form.Item label="Local Playground" labelAlign="left">
                <Button shape="circle" icon="arrow-right" target="_self" href={`http://localhost:3000/${window.location.search}`} />
              </Form.Item>
              <Form.Item label="Master Playground" labelAlign="left">
                <Button shape="circle" icon="arrow-right" target="_self" href={`https://pro-gallery-master.surge.sh/${window.location.search}`} />
              </Form.Item>
              <Form.Item label="Live Playground" labelAlign="left">
                <Button shape="circle" icon="arrow-right" target="_self" href={`https://pro-gallery.surge.sh/${window.location.search}`} />
              </Form.Item>
              {(window.location.hostname.indexOf('localhost') >= 0) && <Form.Item label="Simulate Local SSR" labelAlign="left">
                <Button shape="circle" icon="bug" target="_blank" href={`http://localhost:3001/?seed=${Math.floor(Math.random() * 10000)}&allowLeanGallery=true&allowSSR=true&useBlueprints=${gallerySettings.useBlueprints}&useLayoutFixer=${gallerySettings.useLayoutFixer}${getContainerUrlParams(gallerySettings)}&${Object.entries(styleParams).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')}`} />
              </Form.Item>}
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="Lean Gallery" key="lean">
            <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
              <Form.Item label="Allow Lean Gallery" labelAlign="left">
                <Switch checked={!!styleParams.allowLeanGallery} onChange={e => setStyleParams('allowLeanGallery', !!e)} />
              </Form.Item>
              {
                isEligibleForLeanGallery({ items, styles: styleParams }) ?
                  <Alert key={'leanGalleryAllowed'} message={'RENDERING LEAN GALLERY'} type="success" />
                  :
                  <List
                    size="small"
                    header="CAN NOT RENDER LEAN GALLERY"
                    bordered
                    dataSource={notEligibleReasons({ items, styles: styleParams })}
                    renderItem={item => <List.Item>{item}</List.Item>}
                  />
              }
            </Form>
          </Collapse.Panel>
          <Collapse.Panel header="ToDos" key="todos">
            {comments.map((comment, idx) => <Alert key={idx} message={comment} type="info" />)}
          </Collapse.Panel>
        </Collapse>

      {!utils.isMobile() && !!visible && <>
          <div style={{ height: 120 }} />

          <div className={s.code}>
            <CodePanel />
            <a className={s.report} target="_blank" rel="noreferrer" href="https://github.com/wix/pro-gallery/issues">report an issue</a>
          </div>
        </>
      }
      </div>
    </>
  );
}

export { SideBar };
