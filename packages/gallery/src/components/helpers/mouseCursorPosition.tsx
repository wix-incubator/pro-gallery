import React from 'react';
import Emitter from './emitter';
import { proxy } from './proxy';
import { utils } from 'pro-gallery-lib';

export function mouseFollower(container: HTMLElement) {
  const emitter = new Emitter<{
    mouseMove: (x: number, y: number) => void;
    mouseClick: (x: number, y: number, e: MouseEvent) => void;
    mouseEnterState: (mouseIn: boolean) => void;
  }>();
  function onMouseEnter() {
    emitter.call.mouseEnterState(true);
  }
  function onMouseMove(event: MouseEvent) {
    const bounding = container.getBoundingClientRect();
    const position = [
      event.clientX - bounding.left,
      event.clientY - bounding.top,
    ];
    emitter.call.mouseMove(position[0], position[1]);
  }
  function onMouseLeave() {
    emitter.call.mouseEnterState(false);
  }
  function onClick(event: MouseEvent) {
    emitter.call.mouseClick(event.offsetX, event.offsetY, event);
  }
  container.addEventListener('mouseenter', onMouseEnter);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseleave', onMouseLeave);
  container.addEventListener('click', onClick);
  return {
    listen: emitter.listen,
    destroy: () => {
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click', onClick);
    },
  };
}

interface MouseCursorProps {
  render: (x: number, y: number) => React.ReactNode;
  onClick: (x: number, y: number, e: MouseEvent) => void;
  onEnterState?: (mouseIn: boolean) => void;
  element: () => HTMLElement;
  throttle: number;
}

interface MouseCursorState {
  position: [number, number];
  mouseIn: boolean;
}

export class MouseCursor extends React.Component<
  MouseCursorProps,
  MouseCursorState
> {
  private mouseFollower?: ReturnType<typeof mouseFollower>;
  componentDidMount() {
    this.mouseFollower = mouseFollower(this.props.element());
    this.mouseFollower.listen.mouseMove(
      (utils as any).throttle((x, y) => {
        this.setState({
          position: [x, y],
        });
      }, this.props.throttle)
    );
    this.mouseFollower.listen.mouseEnterState((mouseIn) => {
      this.setState({
        mouseIn: mouseIn,
        position: mouseIn ? this.state.position : [0, 0],
      });
      if (this.props.onEnterState) {
        this.props.onEnterState(mouseIn);
      }
    });
    this.mouseFollower.listen.mouseClick(this.props.onClick);
  }
  state: MouseCursorState = {
    position: [0, 0],
    mouseIn: false,
  };
  render() {
    if (!this.state.mouseIn) {
      return null;
    }
    return this.props.render(this.state.position[0], this.state.position[1]);
  }
}

const CLICKABLE_ATTR = 'pg-clickable';

const getCssSelector = (element: HTMLElement) => {
  const path: string[] = [];
  let parent: HTMLElement;
  let currentElement: HTMLElement = element;
  while (currentElement.parentNode) {
    parent = currentElement.parentNode as HTMLElement;
    path.unshift(
      `${currentElement.tagName}:nth-child(${
        Array.from(parent.children).indexOf(currentElement) + 1
      })`
    );
    currentElement = parent;
  }
  return `${path.join(' > ')}`.toLowerCase();
};

interface ArrowFollowerProps {
  children: (
    x: number,
    y: number,
    direction: 'right' | 'left'
  ) => React.ReactNode;
  onNavigate: (direction: 'right' | 'left') => void;
  mouseCursorContainerMaxWidth: number;
  gallery: () => HTMLElement;
}

export class ArrowFollower extends React.Component<ArrowFollowerProps> {
  getDirection = (x: number) => {
    const containerWidth = this.props.gallery().offsetWidth;
    const amountOfPixelsNeeded =
      containerWidth * (this.props.mouseCursorContainerMaxWidth / 100);
    const isLeft = x < amountOfPixelsNeeded;
    const isRight = x > containerWidth - amountOfPixelsNeeded;
    const direction = isRight ? 'right' : 'left';

    return {
      isLeft,
      isRight,
      direction,
    } as const;
  };
  render() {
    return (
      <MouseCursor
        element={this.props.gallery}
        render={(x, y) => {
          const { isLeft, isRight, direction } = this.getDirection(x);
          const bounding = this.props.gallery().getBoundingClientRect();
          const elementUnderMouse = document.elementFromPoint(
            x + bounding.left,
            y + bounding.top
          ) as HTMLElement | null;
          if (!isLeft && !isRight) {
            return null;
          }

          return (
            <>
              {this.props.children(x, y, direction)}
              <style>
                {elementUnderMouse &&
                  `
                ${getCssSelector(elementUnderMouse)} {
                  cursor: none !important;
                }
              `}
              </style>
            </>
          );
        }}
        onClick={(x, y, e) => {
          // cancel the click event
          for (const ele of (e as any).path as HTMLElement[]) {
            if (
              ele instanceof HTMLElement &&
              ele.getAttribute(CLICKABLE_ATTR) === 'true'
            ) {
              return;
            }
          }
          e.preventDefault();
          e.stopPropagation();
          this.props.onNavigate(
            x < this.props.gallery().offsetWidth / 2 ? 'right' : 'left'
          );
        }}
        throttle={50}
      />
    );
  }
}

type NativeHTMLElement = {
  [Ele in keyof React.ReactHTML]: React.ReactHTML[Ele];
};

export function clickableFactory(): NativeHTMLElement {
  return proxy<NativeHTMLElement>((name) => {
    return (props: any) =>
      React.createElement(name, {
        ...props,
        [CLICKABLE_ATTR]: 'true',
      }) as any;
  });
}

export const clickable = clickableFactory();
