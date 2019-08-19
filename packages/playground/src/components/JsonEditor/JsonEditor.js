import React from 'react';
import {Menu, Icon, Collapse, Switch, Radio, Input, Slider, Form, Checkbox, InputNumber, Row, Col, Button, Alert, Divider} from 'antd';
import {INPUT_TYPES, settingsManager} from '../../utils/settingsManager';
import ColorPicker from '../ColorPicker/ColorPicker';

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
            onClick={val => {this.onFieldChanged(key, Number(val.key))}
            style={{ width: 347 }}
            defaultSelectedKeys={[String(theValue)]}
            mode="vertical"
          >
            {settings.options.map(({value, title}) => (
              <Menu.Item key={String(value)}>{title}</Menu.Item>
            ))}
          </Menu>
          // <Radio.Group
          //   onChange={val => this.onFieldChanged(key, val.target.value)}
          //   size="medium"
          //   value={theValue}
          // >
          //   {settings.options.map(({value, title}) => (
          //     <Radio value={value}>{title}</Radio>
          //   ))}
          // </Radio.Group>
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
              color={{
                  r: '241',
                  g: '112',
                  b: '19',
                  a: '1',
                }} 
              colorChange={val => this.onFieldChanged(key, val)}
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
    const {section, subSection, styleParams} = this.props;
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

    const json = Object.entries(settingsManager)
      .filter(([key, settings]) => settings.section === section && settings.subSection === subSection && settings.isRelevant(styleParams, context))
      .reduce((acc, [key]) => {
        acc[key] = settingsManager[key];
        acc[key].value = styleParams[key];
        return acc;
      }, {});
  
    return (
      // <Form layout="vertical">
      <Collapse bordered={false} defaultActiveKey={[]} onChange={() => {}} style={{margin: '-17px -15px'}} expandIconPosition={'left'}>
        {Object.entries(json).map(([styleParam, settings]) => (
          <Collapse.Panel header={settings.title || styleParam} key={'collapse' + styleParam} >
              {/* <Form.Item key={styleParam} label={settings.title || styleParam} labelPlacement={'top'} style={{display: 'block', width: '100%'}}> */}
                {this.renderEntryEditor(styleParam, settings)}
                {
                  settings.alert ?
                  <div>
                    <Divider/>
                    <p>{settings.alert}</p>
                  </div>
                  : null
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
