import React, { useState, Suspense } from "react";
import { LayoutPicker } from "../LayoutPicker";
import { JsonEditor } from "../JsonEditor";
import { useGalleryContext } from "../../hooks/useGalleryContext";
import { CodePanel } from "../CodePanel";
import { Benchmarks } from "../Benchmarks";
import {
  ArrowRightOutlined,
  BugOutlined,
  CloseOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Form } from 'antd';

import {
  List,
  Switch,
  Select,
  InputNumber,
  Collapse,
  AutoComplete,
  Input,
  Button,
  Card,
} from "antd";
import { SECTIONS, settingsManager } from '../../constants/settings';
import {
  INPUT_TYPES,
  flattenObject,
} from 'pro-gallery-lib';
import { Divider, Alert } from 'antd';
import comments from './comments';
import { throttle } from '../../utils/utils';
import { isValidOption } from '../../constants/options';
import s from './SideBar.module.scss';
import { GALLERY_CONSTS } from 'pro-gallery';
// import { notEligibleReasons, isEligibleForLeanGallery } from 'lean-gallery';

import 'antd/dist/antd.css';
import { getContainerUrlParams } from "./helper";
import {utils} from 'pro-gallery-lib';
import {StylesList} from './StyleList';

const Community = React.lazy(() => import('../Community'));

function SideBar({ items, blueprintsManager, visible }) {
  const {
    gallerySettings,
    setGallerySettings,
    setOptions,
    options,
  } = useGalleryContext(blueprintsManager);

  const flatOptions = flattenObject(options)
  const [searchResult, setSearchResult] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const _setOptions = throttle(setOptions, 1000);
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
    .map(([styleParam, props]) => ({
      value: styleParam,
      label: (<span>{props.title}</span>)
    })); //`(${styleParam}) ${props.title}`);

  const resetSearch = () => {
    setSearchResult('');
    setSearchTerm('');
  };
  const changedOptions = Object.entries(flatOptions).filter(([styleParam, value]) => styleParam !== 'galleryLayout' && isValidOption(styleParam, value, flatOptions)).reduce((obj, [styleParam, value]) => ({ ...obj, [styleParam]: value }), {});
  const didChangeStyleParams = Object.keys(changedOptions).length > 0;

  const isDev = (window.location.hostname.indexOf('localhost') >= 0) || null;
  return <>
    <div className="global-search-wrapper" style={{ width: 'calc(100% - 16px)', margin: '0 8px' }}>
      <AutoComplete
        style={{ width: '100%', margin: '10px 1px' }}
        options={dataSource}
        onSelect={setSearchResult}
        onSearch={setSearchTerm}
        value={searchTerm}
      >
        <Input.Search size="large" placeholder="Search Style Param" enterButton />
      </AutoComplete>
      {searchResult &&
        <Card style={{
          padding: 0,
          margin: '2px -17px',
          background: 'transparent',
          border: 'none',
        }}>
          <JsonEditor
            onChange={_setOptions}
            allOptions={flatOptions}
            options={flatOptions}
            section={settingsManager[searchResult].section}
            option={searchResult}
            expandIcon={() => <CloseOutlined onClick={() => resetSearch()} />}
            showAllOptions={true}
          />
        </Card>
      }
    </div>
    <h3 className={s.title}>Gallery Settings</h3>
    <div className={s.controls}>
      <Collapse accordion={true} bordered={true} defaultActiveKey={[]} onChange={() => { }} expandIconPosition={'right'}>
        {didChangeStyleParams ?
          <Collapse.Panel header={'* Changed Settings'} key="-1">
            <JsonEditor
              onChange={_setOptions}
              allOptions={flatOptions}
              options={changedOptions}
              showAllOptions={true}
            />
          </Collapse.Panel> : null}
        <Collapse.Panel header={SECTIONS.PRESET} key="1">
          <LayoutPicker selectedLayout={flatOptions.galleryLayout} onSelectLayout={galleryLayout => setOptions('galleryLayout', galleryLayout)} />
          <Divider />
          <JsonEditor
            onChange={_setOptions}
            allOptions={flatOptions}
            options={flatOptions}
            section={SECTIONS.PRESET}
            showAllOptions={gallerySettings.showAllStyles}
          />
        </Collapse.Panel>
        {Object.values(SECTIONS).map((section, idx) => {
          if (section !== SECTIONS.PRESET) {
            return (
              <Collapse.Panel header={section} key={idx + 1}>
                <JsonEditor
                  section={section}
                  onChange={_setOptions}
                  allOptions={flatOptions}
                  options={flatOptions}
                  showAllOptions={gallerySettings.showAllStyles}
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
              <InputNumber min={0} max={1000} defaultValue={gallerySettings.numberOfItems || 0} onChange={val => setGallerySettings({ numberOfItems: val })} />
            </Form.Item>
            <Form.Item label="Initial Item">
              <InputNumber min={0} max={gallerySettings.numberOfItems || Infinity} defaultValue={gallerySettings.initialIdx || 0} onChange={val => setGallerySettings({ initialIdx: val })} />
            </Form.Item>
            <Form.Item label="Media Type">
              <Select defaultValue={gallerySettings.mediaTypes || 'media'} onChange={val => setGallerySettings({ mediaTypes: val })}>
                <Select.Option value="media">Images & Videos</Select.Option>
                <Select.Option value="mixed">Images, Videos & Texts</Select.Option>
                <Select.Option value="images">Images Only</Select.Option>
                <Select.Option value="videos">Videos Only</Select.Option>
                <Select.Option value="texts">Texts Only</Select.Option>
                <Select.Option value="itemsWithSecondaryMedia">Items with Secondary Media</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel header="Title & Description" key="info">
          <Form layout="vertical">
            <Form.Item label="Custom Title" help="use the # symbol for the item index">
              <Input defaultValue={gallerySettings.customTitle || ''} onChange={e => setGallerySettings({ customTitle: e.target.value }) } />
            </Form.Item>
            <Form.Item label="Custom Description" help="use the # symbol for the item index">
              <Input.TextArea defaultValue={gallerySettings.customDescription || ''} rows="4" onChange={e => setGallerySettings({ customDescription: e.target.value })} />
            </Form.Item>
            <Form.Item label="Generate Random Description" labelAlign="left">
              <Switch checked={!!gallerySettings.loremDescription} onChange={e => setGallerySettings({ loremDescription: e })} />
            </Form.Item>
            <Form.Item label="Custom Alt" help="use the # symbol for the item index">
            <Input defaultValue={gallerySettings.customAlt || ''} onChange={e => setGallerySettings({ customAlt: e.target.value }) } />
            </Form.Item>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel header="Styles" key="styles">
          <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
            <Form.Item label="Show all Styles" labelAlign="left">
              <Switch checked={!!gallerySettings.showAllStyles} onChange={e => setGallerySettings({ showAllStyles: e })} />
            </Form.Item>
            <Form.Item label="Responsive Preview" labelAlign="left">
              <Switch checked={!!gallerySettings.responsivePreview} onChange={e => {setGallerySettings({ responsivePreview: e }); window.location.reload()}} />
            </Form.Item>
            <Form.Item label="Reset to Default Gallery" labelAlign="left">
              <Button icon={<DeleteOutlined />} shape="circle" onClick={() => window.location.search = ''} />
            </Form.Item>
            <Form.Item label="Full Styles List" labelAlign="left">
              <StylesList />
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
            <Form.Item label="Use Custom Navigation Panel" labelAlign="left">
              <Switch checked={!!gallerySettings.useCustomNavigationPanel} onChange={e => setGallerySettings({ useCustomNavigationPanel: e })} />
            </Form.Item>
            <Form.Item label="Use Server Blueprints" labelAlign="left">
              <Switch checked={!!gallerySettings.shouldUseBlueprintsFromServer} onChange={e => setGallerySettings({ shouldUseBlueprintsFromServer: e })} />
            </Form.Item>
            <Form.Item label="Use Inline Styles" labelAlign="left">
              <Switch checked={!!gallerySettings.useInlineStyles} onChange={e => setGallerySettings({ useInlineStyles: e })} />
            </Form.Item>
            <Form.Item label="Click to Expand" labelAlign="left">
              <Switch checked={!!gallerySettings.clickToExpand} onChange={e => setGallerySettings({ clickToExpand: e })} />
            </Form.Item>
          </Form>
          <Form layout="vertical">
            <Form.Item label="View Mode">
              <Select defaultValue={gallerySettings.viewMode || GALLERY_CONSTS.viewMode.SITE} onChange={val => setGallerySettings({ viewMode: val })}>
                {Object.entries(GALLERY_CONSTS.viewMode).map(([key, val]) => <Select.Option key={key} value={key}>{val}</Select.Option>)}
              </Select>
            </Form.Item>
          </Form>
          <Form layout="vertical">
            <Form.Item label="Navigation Panel Type">
              <Select defaultValue={gallerySettings.navPanelType || 'circles'} onChange={val => setGallerySettings({ navPanelType: val })}>
                {['api', 'steps', 'circles'].map((val) => <Select.Option key={val} value={val}>{val}</Select.Option>)}
              </Select>
            </Form.Item>
          </Form>
        </Collapse.Panel>
        <Collapse.Panel header="Develop" key="develop">
          <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
            <Form.Item label="Local Playground" labelAlign="left">
              <Button shape="circle" icon={<ArrowRightOutlined />} target="_blank" href={`http://localhost:3006/${window.location.search}`} />
            </Form.Item>
            <Form.Item label="Master Playground" labelAlign="left">
              <Button shape="circle" icon={<ArrowRightOutlined />} target="_blank" href={`https://pro-gallery-master.surge.sh/${window.location.search}`} />
            </Form.Item>
            <Form.Item label="Live Playground" labelAlign="left">
              <Button shape="circle" icon={<ArrowRightOutlined />} target="_blank" href={`https://pro-gallery.surge.sh/${window.location.search}`} />
            </Form.Item>
            {isDev && <Form.Item label="Simulate Local SSR" labelAlign="left">
              <Button shape="circle" icon={<BugOutlined />} target="_blank" href={`http://localhost:3001/?seed=${Math.floor(Math.random() * 10000)}&allowLeanGallery=true&allowSSR=true&useCustomNavigationPanel=${gallerySettings.useCustomNavigationPanel}&useBlueprints=${gallerySettings.useBlueprints}&${getContainerUrlParams(gallerySettings)}&${Object.entries(flatOptions).reduce((arr, [styleParam, value]) => arr.concat(`${styleParam}=${value}`), []).join('&')}`} />
            </Form.Item>}
          </Form>
        </Collapse.Panel>
        <Collapse.Panel header="Community" key="community">
        <Suspense fallback={<div>Loading...</div>}>
          <Community/>
        </Suspense>
        </Collapse.Panel>
        {isDev && <Collapse.Panel header="Lean Gallery" key="lean">
          <Form labelCol={{ span: 17 }} wrapperCol={{ span: 3 }}>
            <Form.Item label="Allow Lean Gallery" labelAlign="left">
              <Switch checked={!!flatOptions.allowLeanGallery} onChange={e => setOptions('allowLeanGallery', !!e)} />
            </Form.Item>
            {
              // isEligibleForLeanGallery({ items, styles: flatOptions }) ?
              //   <Alert key={'leanGalleryAllowed'} message={'RENDERING LEAN GALLERY'} type="success" />  
              //   :
                <List
                  size="small"
                  header="CAN NOT RENDER LEAN GALLERY"
                  bordered
                  // dataSource={notEligibleReasons({ items, styles: flatOptions })}
                  renderItem={item => <List.Item>{item}</List.Item>}
                />
            }
          </Form>
        </Collapse.Panel>}
        {isDev && <Collapse.Panel header="ToDos" key="todos">
          {comments.map((comment, idx) => <Alert key={idx} message={comment} type="info" />)}
          </Collapse.Panel>}
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
  </>;
}

export { SideBar };
