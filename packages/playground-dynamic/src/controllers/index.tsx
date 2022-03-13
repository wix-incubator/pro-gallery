import { Types, Options } from "pro-gallery-dynamic";
import { Collapse, Switch, Input, Slider, InputNumber, Row, Col } from "antd";

export type Handlers = {
  [Option in Types.Options.StyleType]: (props: {
    metaData: Types.Options.StyleOptionController<Option>["metaData"];
    value: Types.Options.StyleTypesValues[Option];
    onChange: (value: Types.Options.StyleTypesValues[Option]) => void;
    title: string;
    description: string;
  }) => JSX.Element;
};

export const handlers: Handlers = {
  [Types.Options.StyleType.BOOLEAN]: (props) => {
    return (
      <Switch
        key={props.title}
        checked={props.value}
        onChange={(checked) => props.onChange(checked)}
      />
    );
  },
  [Types.Options.StyleType.NUMBER]: (props) => {
    return (
      <InputNumber
        value={props.value}
        onChange={(value) => props.onChange(value)}
        key={props.title}
      />
    );
  },
  [Types.Options.StyleType.STRING]: (props) => {
    return (
      <Input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        key={props.title}
      />
    );
  },
  [Types.Options.StyleType.ROTATION]: (props) => {
    return (
      <Slider
        min={0}
        max={360}
        value={props.value}
        onChange={(value) => props.onChange(value)}
        key={props.title}
      />
    );
  },
  [Types.Options.StyleType.BORDER_RADIUS]: ({ title, onChange, value }) => {
    const {
      bottomLeft = 0,
      bottomRight = 0,
      topLeft = 0,
      topRight = 0,
    } = value || {};
    return (
      <div key={title}>
        <Row gutter={8}>
          <Col span={12}>
            <InputNumber
              value={topLeft}
              onChange={(value) =>
                onChange({
                  topLeft: value,
                  topRight,
                  bottomLeft,
                  bottomRight,
                })
              }
            />
          </Col>
          <Col span={12}>
            <InputNumber
              value={topRight}
              onChange={(value) =>
                onChange({
                  topLeft,
                  topRight: value,
                  bottomLeft,
                  bottomRight,
                })
              }
            />
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={12}>
            <InputNumber
              value={bottomLeft}
              onChange={(value) =>
                onChange({
                  topLeft,
                  topRight,
                  bottomLeft: value,
                  bottomRight,
                })
              }
            />
          </Col>
          <Col span={12}>
            <InputNumber
              value={bottomRight}
              onChange={(value) =>
                onChange({
                  topLeft,
                  topRight,
                  bottomLeft,
                  bottomRight: value,
                })
              }
            />
          </Col>
        </Row>
      </div>
    );
  },
  [Types.Options.StyleType.LOCATION]: ({ title, onChange, value }) => {
    const { left, top } = value || {};
    return (
      <div key={title}>
        <Row gutter={8}>
          <Col span={12}>
            <InputNumber
              value={left}
              onChange={(value) => onChange({ left: value, top })}
            />
          </Col>
          <Col span={12}>
            <InputNumber
              value={top}
              onChange={(value) => onChange({ left, top: value })}
            />
          </Col>
        </Row>
      </div>
    );
  },
} as Handlers;

export type Controller<
  T extends Types.Options.StyleOptionController<Types.Options.StyleType>
> = {
  title: string;
  description: string;
  logic: T;
};

export const controllers: Controller<any>[] = [
  {
    logic: Options.rotationOption,
    title: "Rotation",
    description: "rotate the element",
  },
  {
    logic: Options.scaleOption,
    title: "Scale",
    description: "scale the element",
  },
  {
    logic: Options.opacityOption,
    title: "Opacity",
    description: "opacity the element",
  },
  {
    logic: Options.blurOption,
    title: "Blur",
    description: "blur the element",
  },
  {
    logic: Options.saturateOption,
    title: "Saturate",
    description: "saturate the element",
  },
  {
    logic: Options.grayscaleOption,
    title: "Grayscale",
    description: "grayscale the element",
  },
  {
    logic: Options.invertOption,
    title: "Invert",
    description: "invert the element",
  },
  {
    logic: Options.sepiaOption,
    title: "Sepia",
    description: "sepia the element",
  },
  {
    logic: Options.hueRotateOption,
    title: "Hue Rotate",
    description: "hue rotate the element",
  },
  {
    logic: Options.brightnessOption,
    title: "Brightness",
    description: "brightness the element",
  },
  {
    logic: Options.contrastOption,
    title: "Contrast",
    description: "contrast the element",
  },
  {
    logic: Options.borderRadiusOption,
    title: "Border Radius",
    description: "border radius the element",
  },
  {
    logic: Options.locationOption,
    title: "Location",
    description: "location the element",
  },
];
