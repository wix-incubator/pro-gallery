import { Types } from "pro-gallery-dynamic";
import { IItemStyling } from "pro-gallery-dynamic/dist/esm-types/types/gallery";
import { useState } from "react";
import { CssEditor } from "./css";
import { Tabs, Form, InputNumber, Switch } from "antd";

export interface EditorProps {
  styling: Types.Gallery.IItemStyling;
  onChange: (styling: Types.Gallery.IItemStyling) => void;
}

const states = ["initial", "loaded", "enter", "leave", "hover"] as const;

export function Editor(props: EditorProps) {
  const [element, setElement] =
    useState<keyof Types.Gallery.IItemStyling["elements"]>("container");
  const [state, setState] = useState<typeof states[number]>("initial");

  const cssMap = {
    enter:
      props.styling.elements[element].animations.find(
        (animation) => animation.on === "enter"
      )?.data.frames[0].css || {},
    leave:
      props.styling.elements[element].animations.find(
        (animation) => animation.on === "leave"
      )?.data.frames[0].css || {},
    hover:
      props.styling.elements[element].animations.find(
        (animation) => animation.on === "hover"
      )?.data.frames[0].css || {},
    initial: props.styling.elements[element].intialStyle || {},
    loaded: props.styling.elements[element].inViewStyle || {},
  };

  const css = cssMap[state];

  const onChange = (newCss: Types.CSS.IItemCss) => {
    Object.assign(css, newCss);
    const itemStyling = {
      ...props.styling,
      elements: {
        ...props.styling.elements,
        [element]: {
          ...props.styling.elements[element],
          intialStyle: cssMap.initial,
          inViewStyle: cssMap.loaded,
        },
      },
    } as IItemStyling;
    if (!itemStyling.elements[element].animations) {
      itemStyling.elements[element].animations = [];
    }
    if (
      state !== "initial" &&
      state !== "loaded" &&
      !itemStyling.elements[element].animations.find(
        (animation) => animation.on === state
      )
    ) {
      itemStyling.elements[element].animations.push({
        on: state,
        data: {
          keep: true,
          frames: [
            {
              after: 0,
              css: cssMap[state],
            },
          ],
        },
      });
    }
    props.onChange(itemStyling);
  };
  return (
    <div>
      <div>
        <Tabs
          title="Element"
          onChange={(value) => setElement(value as typeof element)}
          activeKey={element}
        >
          {(["container", "content"] as const).map((currentElement) => (
            <Tabs.TabPane tab={currentElement} key={currentElement} />
          ))}
        </Tabs>
      </div>
      <div>
        <Tabs
          title="Animation"
          activeKey={state}
          onChange={(value) => setState(value as typeof state)}
        >
          {states.map((currrentState) => (
            <Tabs.TabPane key={currrentState} tab={currrentState} />
          ))}
        </Tabs>
      </div>
      <div>
        <CssEditor css={css || {}} onChange={onChange} />
        <Form key="duration">
          <Form.Item label="Duration">
            <InputNumber
              min={0}
              max={1500}
              value={props.styling.elements[element].transitionDuration}
              onChange={(value) => {
                props.onChange({
                  ...props.styling,
                  elements: {
                    ...props.styling.elements,
                    [element]: {
                      ...props.styling.elements[element],
                      transitionDuration: value as number,
                    },
                  },
                });
              }}
            />
          </Form.Item>
        </Form>
        <Form key="engine">
          <Form.Item label="Use JS Animations">
            <Switch
              checked={
                props.styling.elements[element].engine === "framer-motion"
              }
              onChange={(value) => {
                props.onChange({
                  ...props.styling,
                  elements: {
                    ...props.styling.elements,
                    [element]: {
                      ...props.styling.elements[element],
                      engine: value ? "framer-motion" : "transition",
                    },
                  },
                });
              }}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
