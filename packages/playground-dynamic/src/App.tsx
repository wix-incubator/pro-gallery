import { Gallery } from "pro-gallery-dynamic";

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

function App() {
  return (
    <Gallery
      items={items}
      settings={{
        layoutParams: {
          viewportThreshold: 400,
          imageForceLoadThreshold: 600,
          imageLoadThreshold: 5000,
        },
        animationParams: {
          loadAnimationDistanceFromViewport: 150,
        },
      }}
      baseItemStyling={{
        elements: {
          container: {
            animations: [
              {
                on: "enter",
                data: {
                  keep: true,
                  frames: [
                    {
                      after: 0,
                      css: {
                        transform: {
                          scale: 1,
                        },
                        // opacity: 1,
                      },
                    },
                  ],
                },
              },
            ],
            intialStyle: {
              borderRadius: {
                bottomLeft: 5,
                bottomRight: 5,
                topLeft: 5,
                topRight: 5,
              },
              transform: {
                scale: 0.5,
              },
            },
            spring: {
              stiffness: 10,
              velocity: 1,
              mass: 1,
              duration: 0.3,
            },
          },
          content: {
            animations: [
              {
                on: "enter",
                data: {
                  keep: true,
                  frames: [
                    {
                      after: 0,
                      css: {
                        transform: {
                          scale: 2,
                        },
                      },
                    },
                    {
                      after: 100,
                      css: {
                        transform: {
                          scale: 1,
                        },
                      },
                    },
                  ],
                },
              },
            ],
            intialStyle: {
              transform: {
                scale: 1,
              },
            },
            spring: {},
          },
        },
      }}
      layoutParams={{
        container: {
          width: 1920,
          height: 1050,
        },
        items: items.map((item) => ({
          height: item.metaData.height,
          width: item.metaData.width,
          maxHeight: 700,
          maxWidth: 700,
          id: item.id,
        })),
        styleParams: {},
      }}
    />
  );
}

export default App;
