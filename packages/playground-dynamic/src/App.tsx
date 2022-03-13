import { Gallery, SizeProvider, Types } from "pro-gallery-dynamic";
import { useEffect, useState } from "react";
import { Editor } from "./editor";
import { deepDiff } from "./utils/diff";
// @ts-ignore
import _ from "lodash";

const items = Array(500)
  .fill(0)
  .map((_, i) => ({
    id: String(i),
    metaData: {
      width: Math.round(Math.random() * 400) + 200,
      height: Math.round(Math.random() * 500) + 200,
    },
    order: i,
  }));

const baseStyle: Types.Gallery.IItemStyling = {
  elements: {
    container: {
      animations: [],
      intialStyle: {},
      inViewStyle: {},
      spring: {
        stiffness: 10,
        velocity: 1,
        mass: 1,
        duration: 0.3,
      },
      engine: "transition",
      transitionDuration: 200,
    },
    content: {
      animations: [],
      intialStyle: {},
      inViewStyle: {},
      spring: {},
      engine: "transition",
      transitionDuration: 200,
    },
  },
  animationMergeStrategy: "replace",
};

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const exisitingStyling = queryParams.get("styling");
  const [styling, setStyling] = useState<Types.Gallery.IItemStyling>(() =>
    exisitingStyling
      ? _.merge({}, baseStyle, JSON.parse(exisitingStyling))
      : { ...baseStyle }
  );
  useEffect(() => {
    queryParams.set("styling", JSON.stringify(deepDiff(baseStyle, styling)));
    history.pushState(null, "", "?" + queryParams.toString());
  }, [styling]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
      }}
    >
      <div style={{ width: "calc(100% - 400px)", height: "100%" }}>
        <SizeProvider>
          {({ width, height }) => (
            <Gallery
              items={items}
              settings={{
                layoutParams: {
                  viewportThreshold: 3600,
                  imageForceLoadThreshold: 1500,
                  imageLoadThreshold: 2500,
                },
                animationParams: {
                  loadAnimationDistanceFromViewport: 650,
                },
              }}
              baseItemStyling={styling}
              layoutParams={{
                container: {
                  width,
                  height,
                },
                items: items.map((item) => ({
                  height: item.metaData.height,
                  width: item.metaData.width,
                  maxHeight: 700,
                  maxWidth: 700,
                  id: item.id,
                })),
                styleParams: {

                },
              }}
            />
          )}
        </SizeProvider>
      </div>
      <div style={{ width: "350px", height: "100%" }}>
        <Editor onChange={setStyling} styling={styling} />
      </div>
    </div>
  );
}

export default App;
