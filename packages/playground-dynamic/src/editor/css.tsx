import { Types } from "pro-gallery-dynamic";
import { Controller, controllers, handlers } from "../controllers";
import { Form } from "antd";

export interface CSSEditorProps {
  css: Types.CSS.IItemCss;
  onChange: (css: Types.CSS.IItemCss) => void;
}

export function CssEditor(props: CSSEditorProps) {
  const { css, onChange } = props;

  const getValue = <
    T extends Types.Options.StyleOptionController<Types.Options.StyleType>
  >(
    controller: Controller<T>
  ) => {
    if (typeof controller.logic.getValue === "function") {
      return controller.logic.getValue(css);
    } else {
      const [, ...location] = controller.logic.getValue.split(".");
      return location.reduce((acc, curr) => (acc as any)?.[curr], css);
    }
  };

  const setValue =
    <T extends Types.Options.StyleOptionController<Types.Options.StyleType>>(
      controller: Controller<T>
    ) =>
    (value: any) => {
      if (typeof controller.logic.onChange === "function") {
        onChange(controller.logic.onChange(value, css));
      } else {
        const [, ...location] = controller.logic.onChange.split(".");
        const newCss = { ...css };
        const last = location.pop() as string;
        let curr: any = newCss;
        for (const loc of location) {
          if (!curr[loc]) {
            curr[loc] = {};
          }
          curr = curr[loc];
        }
        curr[last] = value;
        onChange(newCss);
      }
    };

  return (
    <div>
      {controllers.map((controller) => {
        const Handler = (handlers as any)[controller.logic.type];
        return (
          <Form key={controller.title}>
            <Form.Item label={controller.title}>
              <Handler
                {...controller}
                onChange={setValue(controller)}
                value={getValue(controller)}
              />
            </Form.Item>
          </Form>
        );
      })}
    </div>
  );
}
