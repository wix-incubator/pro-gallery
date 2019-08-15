import React from 'react';
import {Radio, Input, Slider, Form, Checkbox, Select, InputNumber, Row, Col} from 'antd';

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

  renderEntryEditor(key, value) {

    const theValue = typeof value.value !== 'undefined' ? value.value : value;

    if (value.options) {

      const options = (value.options.map(option => <Select.Option value={option.id}>{option.value}</Select.Option>));
      
      return <Select defaultValue={value.value} onChange={(value) => this.onFieldChanged(key, value)}>
                {options}
              </Select>
        // options={value.options} initialSelectedId={value.value} onSelect={option => this.onFieldChanged(key, option.id)}
      // />;
    }

    switch (typeof theValue) {
      case 'boolean':
        return (
          <Checkbox
            checked={theValue}
            onChange={e => this.onFieldChanged(key, e.target.checked)}
          />
        );
      case 'number':
        if (value.binaryOptions) {
          return (
            <Radio.Group
              onChange={val => this.onFieldChanged(key, val.target.value)}
              size="medium"
              value={theValue}
            >
              <Radio value={0}>
                {value.binaryOptions[0]}
              </Radio>
              <Radio value={1}>
                {value.binaryOptions[1]}
              </Radio>
            </Radio.Group>
          );
        } else if (value.hasOwnProperty('min') && value.hasOwnProperty('max')) {
          return (
            <Row>
              <Col span={19}>
                <Slider
                  min={value.min || 0}
                  max={value.max || 100}
                  value={theValue}
                  step={1}
                  onChange={val => this.onFieldChanged(key, val)}
                />
              </Col>
              <Col span={1}>
                <InputNumber
                  min={value.min || 0}
                  max={value.max || 100}
                  step={1}
                  value={theValue}
                  onChange={val => this.onFieldChanged(key, val)}
                  style={{ marginLeft: 5, width: 50 }}
                />
              </Col>
            </Row>
    
            // <Slider
            //   min={value.min || 0}
            //   max={value.max || 100}
            //   value={theValue}
            //   onChange={val => this.onFieldChanged(key, val)}
            // />
          );
        } else {
          return (
            <InputNumber
              value={theValue}
              onChange={val => this.onFieldChanged(key, val)}
            />
          );
        }
      default: {
        return (
          <Input
            value={theValue || ''}
            onChange={e => this.onFieldChanged(key, e.target.value)}
          />
        );
      }
    }
  }

  

  render() {
    const {json} = this.props;

    return (
      <Form>
        {Object.entries(json).map(([key, value]) => (
            <Form.Item key={key} label={value.title || key} labelPlacement={'top'}>
              {this.renderEntryEditor(key, value)}
            </Form.Item>
        ))}
      </Form>
    );
  }
}

export default JsonEditor;
