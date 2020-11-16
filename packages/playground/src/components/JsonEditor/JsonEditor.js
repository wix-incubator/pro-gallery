import React from 'react';
import {Alert, Popover, Select, Menu, Icon, Collapse, Switch, Input, Slider, InputNumber, Row, Col, Button, Divider} from 'antd';
import {INPUT_TYPES, isInPreset} from 'pro-gallery-lib';
import ColorPicker from '../ColorPicker/ColorPicker';
import { settingsManager } from '../../constants/settings';

class JsonEditor extends React.Component {
  constructor() {
    super();

    this.state = {
      json: undefined /*  setup here or load elsewhere */,
    };
  }

  onFieldChanged(key, value) {
    console.log(`[PLAYGROUND] StyleParams changed: ${key} Changed to ${value}`);
    this.props.onChange(key, value);
  }

  formatValue(val) {
    if (Number(val) === parseInt(val)) {
      return Number(val);
     } else if (val === 'true') {
       return true;
     } else if (val === 'false') {
       return false;
     } else {
       return String(val);
     }
  }

  renderEntryEditor(key, settings) {

    const theValue = settings.value;

    switch (settings.type) {
      case INPUT_TYPES.BOOLEAN:
        return (
          <Switch
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={theValue}
          onChange={e => this.onFieldChanged(key, e)}
          />
          //     <Checkbox
          // style={{float: 'right'}}
          // checked={theValue}
          //   onChange={e => this.onFieldChanged(key, e.target.checked)}
          // />
        );
      case INPUT_TYPES.OPTIONS:
        return (
          <Menu
            onClick={val => {this.onFieldChanged(key, this.formatValue(val.key))}}
            style={{ width: 367, borderRight: 'none' }}
            defaultSelectedKeys={[String(theValue)]}
            mode="vertical"
          >
            {settings.options.map(({value, title}) => (
              <Menu.Item key={String(value)}>{title}</Menu.Item>
            ))}
          </Menu>
        );
      case INPUT_TYPES.MULTISELECT:
        return (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={unescape(theValue || '').split(',').filter(Boolean) || []}
            onChange={val => this.onFieldChanged(key, val.join(','))}
          >
            {settings.options.map(({value, title}) => (
              <Select.Option key={String(value)}>{title}</Select.Option>
            ))}
          </Select>
        );
      case INPUT_TYPES.MULTIREPEAT:
        const modKey = key => String(key) + `|${Math.random()}`;
        const createOptions = ({value, title}) => (
          <Select.Option key={modKey(value)}>{title}</Select.Option>
        );
        return (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={unescape(theValue || '').split(',').filter(Boolean) || []}
            onChange={val => this.onFieldChanged(key, val.map(v => v.substr(0, v.indexOf('|') >= 0 ? v.indexOf('|') : v.length)).join(','))}
          >
            {settings.options.map(createOptions)}
          </Select>
        );
      case INPUT_TYPES.NUMBER:
        if (settings.min >= 0 && settings.max > 0) {
          return (
            <Row>
              <Col span={19}>
                <Slider
                  min={settings.min}
                  max={settings.max}
                  value={theValue}
                  step={settings.step || 1}
                  onChange={val => this.onFieldChanged(key, val)}
                />
              </Col>
              <Col span={1}>
                <InputNumber
                  min={settings.min}
                  max={settings.max}
                  step={settings.step || 1}
                  value={theValue}
                  onChange={val => this.onFieldChanged(key, val)}
                  style={{ marginLeft: 5, width: 50 }}
                />
              </Col>
            </Row>
    
          );
        } else {
          return (
            <InputNumber
              value={theValue}
              onChange={val => this.onFieldChanged(key, val)}
            />
          );
        }
      case INPUT_TYPES.COLOR_PICKER:
        return (
          <ColorPicker 
            style={{float: 'right'}}
            color={theValue} 
            colorChanged={({value}) => this.onFieldChanged(key, value)}
          />
        );
      case INPUT_TYPES.BUTTON:
        return (
          <Button onClick={() => {
            const val = settings.action();
            val && this.onFieldChanged(key, val)
          }}>
            {settings.text}
          </Button>
        )
      case INPUT_TYPES.TEXT:
      default:
        return (
          <Input
            value={theValue || ''}
            onChange={e => this.onFieldChanged(key, e.target.value)}
          />
        );

    }
  }



  render() {
    const {section, subSection, styleParams, allStyleParams, styleParam, expandIcon} = this.props;
    const context = {
      isMobile: false,
    }
    // const selectedProps = LayoutProps[selectedLayout];
    // let json = selectedProps ?
    //   Object.keys(selectedProps).reduce((acc, key) => {
    //     acc[key] = selectedProps[key];
    //     acc[key].value = styleParams[key];
    //     return acc;
    //   }, {}) :
    //   styleParams;

    // json = removeFieldsNotNeeded(json, selectedLayout);
    const filterFunction = styleParam ? 
    ([key]) => key === styleParam : 
    ([key, settings]) => 
      (!section || settings.section === section) && 
      (!subSection || settings.subSection === subSection) && 
      (this.props.showAllStyles || settings.isRelevant(allStyleParams, context))

    const activeKey = styleParam ? {activeKey: 'collapse' + styleParam} : {defaultActiveKey: []};

    const json = Object.entries(settingsManager)
      .filter(filterFunction)
      .reduce((acc, [key]) => {
        if (typeof styleParams[key] === 'undefined') {
          return acc
        } else {
          acc[key] = settingsManager[key];
          acc[key].value = styleParams[key];
          return acc;
        }
      }, {});

    const isSingleItem = !!styleParam;

    const Extra = settings => {
      if (settings.isRelevant(allStyleParams)) {
        return null; //<Icon type="check" style={{fontSize: 10, color: '#52c41a'}} />
      } else {
        if (settings.missing) {
          return <Icon type="warning" style={{fontSize: 14, color: 'red'}} />
        } else {
          return <Popover placement="right" title="Not Relevant" content={<p>This param is not relevant in current scope: <br/><br/><pre>{settings.isRelevant.toString()}</pre></p>}><Icon theme="twoTone" twoToneColor="#faad14" type="info-circle" /></Popover>
        }
      }
    }
    const isDev = (window.location.hostname.indexOf('localhost') >= 0) || null;
    return (
      <Collapse accordion={true} bordered={false} onChange={() => {}} style={{whiteSpace: 'pre-wrap', margin: '-17px -15px', background: '#fff'}} expandIconPosition={expandIcon ? 'right' : 'left'} {...activeKey} expandIcon={expandIcon}>
        {Object.entries(json).map(([styleParam, settings]) => (
          <Collapse.Panel header={settings.title || styleParam} key={'collapse' + styleParam} extra={Extra(settings)}>
            {this.renderEntryEditor(styleParam, settings)}
            <div>
              {!!settings.description && (<><Divider/><p>{settings.description}</p></>)}
              {isDev && <>
                <Divider/>
                <p><b>Key: </b><code>{styleParam}</code></p>
                <p><b>Value: </b><code>{String(settings.value)}</code></p>
                <p><b>Default: </b><code>{String(settings.default)}</code></p>
              </>}
              {!!settings.alert && (<><Divider/><Alert message={settings.alert} type="warning"/></>)}
              {!!isSingleItem && (<>
                <Divider/>
                <p><b>Section: </b>{settings.section + (settings.subSection ? ` > ${settings.subSection}` : '')}</p>
                <p><b>Overriden by current Preset: </b>{isInPreset(allStyleParams.galleryLayout, styleParam) ? 'Yes' : 'No'}</p>
                <p><b>Relevant in current configuration: </b>{settings.isRelevant(allStyleParams, false) ? 'Yes' : 'No'}</p>
              </>)}
              {isDev && <>
                <Divider/>
                <p><b>isRelevant: </b><pre>{settings.isRelevant.toString()}</pre></p>
              </>}
            </div>
          </Collapse.Panel>
        ))}
      </Collapse>
    );
  }
}

export default JsonEditor;
