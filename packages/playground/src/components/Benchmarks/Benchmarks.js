import React from "react";
import {
  Divider,
  Button,
  InputNumber,
  Form,
  Card,
  Row,
  Col,
  Slider
} from "antd";
import s from "./Benchmarks.module.scss";
import { useGalleryContext } from "../../hooks/useGalleryContext";
import { createLayout } from "pro-gallery-layouter";
import { testImages as images } from "../App/images";
import { mixAndSlice } from "../../utils/utils";

function Benchmarks() {
  const { styleParams } = useGalleryContext();

  const [numberOfRuns, setNumberOfRuns] = React.useState(100);
  const [numberOfImages, setNumberOfImages] = React.useState(50);
  const [results, setResults] = React.useState(null);
  const [status, setStatus] = React.useState(false);

  const convertDtoToLayoutItem = dto => {
    const isLayoutItem = !!(dto.id && dto.width > 0 && dto.height > 0);
    if (isLayoutItem) {
      return dto;
    } else {
      const metadata = dto.metadata || dto.metaData;
      return {
        id: dto.itemId || dto.photoId,
        width: metadata.width,
        height: metadata.height,
        ...dto
      };
    }
  };

  const prepareImages = () => {
    let layouts = [];
    for (let i = 0; i < numberOfRuns; i++) {
      layouts[i] = {
        layoutParams: {
          items: mixAndSlice(images, numberOfImages).map(item => convertDtoToLayoutItem(item)),
          container: {
            height: 1000,
            width: 1000
          },
          styleParams
        }
      };
    }
    return layouts;
  };

  const createLayouts = layouts => {
    createLayout(layouts[0].layoutParams); //warmup
    console.time(
      `Created ${numberOfRuns} Layouts with ${numberOfImages} images. It took: `
    );
    const startTime = Date.now();
    for (let i = 0; i < numberOfRuns; i++) {
      createLayout(layouts[i].layoutParams);
    }
    const duration = Date.now() - startTime;
    console.timeEnd(
      `Created ${numberOfRuns} Layouts with ${numberOfImages} images. It took: `
    );
    return duration;
  };

  const runBenchmarks = () => {
    setStatus("Preparing Images");
    setResults(null);
    setTimeout(() => {
      const layouts = prepareImages();
      setStatus("Creating Layouts");
      setTimeout(() => {
        const duration = createLayouts(layouts);
        setResults(
          <ul>
            <li>
              Created {numberOfRuns} Layouts with {numberOfImages} images.
            </li>
            <li>Total duration was {duration}ms</li>
            <li>Average layout creation took {Math.round((1000 * duration) / numberOfRuns) / 1000}ms</li>
            <li>
              Average duration per image is{" "}
              {Math.round((1000 * duration) / numberOfRuns / numberOfImages) /
                1000}
              ms
            </li>
          </ul>
        );
        setStatus(false);
      }, 0);
    }, 0);
  };

  const renderSlider = (min, max, value, onChange) => (
    <Row>
      <Col span={18}>
        <Slider
          min={min}
          max={max}
          value={value}
          step={1}
          onChange={onChange}
        />
      </Col>
      <Col span={2}>
        <InputNumber
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={onChange}
          style={{ marginLeft: 5, width: 80 }}
        />
      </Col>
    </Row>
  );

  return (
    <div className={s.wrapper}>
      <Form layout="vertical">
        <Form.Item key={"runs"} label="Number of Runs" labelPlacement={"top"}>
          {renderSlider(0, 1000, numberOfRuns, val => setNumberOfRuns(val))}
        </Form.Item>
        <Form.Item
          key={"images"}
          label="Number of Images"
          labelPlacement={"top"}
        >
          {renderSlider(0, 1000, numberOfImages, val =>
            setNumberOfImages(val)
          )}
        </Form.Item>

        <Button block onClick={runBenchmarks} loading={!!status}>
          {status || "Create Layouts"}
        </Button>

        {results && (
          <div>
            <Divider />
            <Card size="small" title="Results">
              {results}
            </Card>
          </div>
        )}

        <Button block type="link" href="https://bundlephobia.com/result?p=pro-gallery-layouter@latest" target="_blank">
          Layouter Bundle Size
        </Button>
    
      </Form>
    </div>
  );
}

export { Benchmarks };
