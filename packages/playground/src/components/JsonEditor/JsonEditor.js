import React from 'react';
import {Select, Menu, Icon, Collapse, Switch, Input, Slider, InputNumber, Row, Col, Button, Divider} from 'antd';
import {settingsManager} from '../../settings/settingsManager';
import {INPUT_TYPES} from '../../settings/consts';
import ColorPicker from '../ColorPicker/ColorPicker';

class JsonEditor extends React.Component {
  constructor() {
    super();

    this.state = {
      json: undefined /*  setup here or load elsewhere */,
    };
  }

  onFieldChanged(key, value) {
    debugger;
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
        const modKey = key => String(key) + (settings.repeat === true ? `|${Math.random()}` : '|');
        const createOptions = ({value, title}) => (
          <Select.Option key={modKey(value)}>{title}</Select.Option>
        );
        return (
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Please select"
            defaultValue={unescape(theValue || '').split(',').filter(Boolean) || []}
            onChange={val => this.onFieldChanged(key, val.map(v => v.substr(0, v.indexOf('|'))).join(','))}
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
                  step={1}
                  onChange={val => this.onFieldChanged(key, val)}
                />
              </Col>
              <Col span={1}>
                <InputNumber
                  min={settings.min}
                  max={settings.max}
                  step={1}
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
            colorChanged={val => this.onFieldChanged(key, val)}
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
    const {section, subSection, styleParams, styleParam, expandIcon} = this.props;
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
    ([key, settings]) => settings.section === section && settings.subSection === subSection && settings.isRelevant(styleParams, context)

    const activeKey = styleParam ? {activeKey: 'collapse' + styleParam} : {defaultActiveKey: []};

    const json = Object.entries(settingsManager)
      .filter(filterFunction)
      .reduce((acc, [key]) => {
        acc[key] = settingsManager[key];
        acc[key].value = styleParams[key];
        return acc;
      }, {});

    const isSingleItem = !!styleParam;
  
    return (
      // <Form layout="vertical">
      <Collapse accordion={true} bordered={false} onChange={() => {}} style={{margin: '-17px -15px'}} expandIconPosition={expandIcon ? 'right' : 'left'} {...activeKey} expandIcon={expandIcon}>
        {Object.entries(json).map(([styleParam, settings]) => (
          <Collapse.Panel header={settings.title || styleParam} key={'collapse' + styleParam} >
              {/* <Form.Item key={styleParam} label={settings.title || styleParam} labelPlacement={'top'} style={{display: 'block', width: '100%'}}> */}
                {this.renderEntryEditor(styleParam, settings)}
                {
                  <div>
                    <Divider/>
                    <p><b>Key: </b><code>{styleParam}</code></p>
                    <p><b>Value: </b><code>{String(settings.value)}</code></p>
                    {!!settings.description && (<><Divider/><p>{settings.description}</p></>)}
                    {!!settings.alert && (<><Divider/><p>{settings.alert}</p></>)}
                    {isSingleItem && <p><b>Section: </b>{settings.section + (settings.subSection ? ` > ${settings.subSection}` : '')}</p>}
                    {isSingleItem && <p><b>Relevant in current configuration: </b>{settings.isRelevant(styleParams, false) ? 'Yes' : 'No'}</p>}
                  </div>
                  // <Alert message={settings.alert} type="warning"/> : null
                }
              {/* </Form.Item> */}
          </Collapse.Panel>
        ))}
      {/* </Form> */}
      </Collapse>
    );
  }
}

export default JsonEditor;
