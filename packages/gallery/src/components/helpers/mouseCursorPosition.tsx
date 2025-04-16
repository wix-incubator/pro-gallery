import React, { useEffect } from 'react';
import Emitter from './emitter';
import { proxy } from './proxy';
import { utils } from 'pro-gallery-lib';

type MouseFollowerEvents = {
  mouseMove: (x: number, y: number) => void;
  mouseClickInteractionEvent: (e: MouseEvent) => void;
  mouseEnterState: (mouseIn: boolean, x: number, y: number) => void;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mouseFollower(container: HTMLElement) {
  const emitter = new Emitter<MouseFollowerEvents>();
  let state = {
    mouseIn: false,
    position: [0, 0] as [number, number],
  };
  emitter.listen.mouseEnterState((mouseIn, ...position) => {
    state = {
      mouseIn,
      position,
    };
  });
  emitter.listen.mouseMove((x, y) => {
    state = {
      ...state,
      position: [x, y],
    };
  });
  const getMousePosition = (event: MouseEvent) => {
    const bounding = container.getBoundingClientRect();
    const position = [event.clientX - bounding.left, event.clientY - bounding.top] as [number, number];
    return position;
  };

  function onMouseEnter(event: MouseEvent) {
    const position = getMousePosition(event);
    emitter.call.mouseEnterState(!isHoveringClickableElement(container, event, ...position), ...position);
  }
  function onMouseMove(event: MouseEvent) {
    const position = getMousePosition(event);
    emitter.call.mouseEnterState(!isHoveringClickableElement(container, event, ...position), ...position);
    emitter.call.mouseMove(...position);
  }
  function onMouseLeave() {
    emitter.call.mouseEnterState(false, 0, 0);
  }
  function onMouseClickInteractionEvent(event: MouseEvent) {
    emitter.call.mouseClickInteractionEvent(event);
  }
  container.addEventListener('mouseenter', onMouseEnter);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseleave', onMouseLeave);
  container.addEventListener('click', onMouseClickInteractionEvent);
  container.addEventListener('mousedown', onMouseClickInteractionEvent);
  container.addEventListener('mouseup', onMouseClickInteractionEvent);
  return {
    listen: emitter.listen,
    get state() {
      return state;
    },
    destroy: () => {
      container.removeEventListener('mouseenter', onMouseEnter);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      container.removeEventListener('click', onMouseClickInteractionEvent);
      container.removeEventListener('mousedown', onMouseClickInteractionEvent);
      container.removeEventListener('mouseup', onMouseClickInteractionEvent);
    },
  };
}

interface MouseCursorProps {
  render: (x: number, y: number) => React.ReactNode;
  onClick: (e: MouseEvent) => void;
  onMouseDownOrUp: (e: MouseEvent) => void;
  onEnterState?: (mouseIn: boolean) => void;
  getElement: () => HTMLElement;
  shouldRenderAtPosition: (x: number, y: number) => boolean;
  throttle: number;
}

interface MouseCursorState {
  position: [number, number];
  mouseIn: boolean;
}

const getContainerById = (id: string) => document.getElementById(`pro-gallery-container-${id}`) as HTMLElement;

const MouseFollowerContext = React.createContext<ReturnType<typeof mouseFollower> | undefined>(undefined);

export const MouseFollowerProvider = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const [mouseFollowerValue, setMouseFollowerValue] = React.useState<ReturnType<typeof mouseFollower>>();
  useEffect(() => {
    const container = getContainerById(id);
    const mouseFollowerValue = mouseFollower(container);
    setMouseFollowerValue(mouseFollowerValue);
    return () => {
      mouseFollowerValue.destroy();
    };
  }, [id]);

  return (
    <MouseFollowerContext.Provider value={mouseFollowerValue}>
      {mouseFollowerValue && children}
    </MouseFollowerContext.Provider>
  );
};

export class MouseCursor extends React.Component<MouseCursorProps, MouseCursorState> {
  declare context: NonNullable<React.ContextType<typeof MouseFollowerContext>>;

  static contextType = MouseFollowerContext;

  cleanup: (() => void) | undefined;
  componentDidMount(): void {
    if (!this.context) {
      throw new Error('MouseFollowerContext is undefined');
    }
    const removeMoveListener = this.context.listen.mouseMove(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (utils as any).throttle(() => {
        this.setState({
          position: this.context.state.position,
        });
      }, this.props.throttle)
    );
    const removeEnterListener = this.context.listen.mouseEnterState(() => {
      const { mouseIn, position } = this.context.state;
      if (this.state.mouseIn !== mouseIn) {
        this.setState({
          mouseIn: mouseIn,
          position,
        });
        if (this.props.onEnterState) {
          this.props.onEnterState(mouseIn);
        }
      }
    });
    const removeClickListener = this.context.listen.mouseClickInteractionEvent((e) => {
      if (!this.state.mouseIn) {
        return;
      }
      const [x, y] = this.state.position;
      if (!this.props.shouldRenderAtPosition(x, y)) {
        return;
      }
      if (e.type === 'mousedown' || e.type === 'mouseup') {
        this.props.onMouseDownOrUp(e);
        return;
      }
      this.props.onClick(e);
    });
    this.cleanup = () => {
      removeMoveListener();
      removeEnterListener();
      removeClickListener();
    };
  }
  componentWillUnmount(): void {
    this.cleanup?.();
  }

  state: MouseCursorState = {
    position: this.context?.state.position || [0, 0],
    mouseIn: this.context?.state.mouseIn || false,
  };
  render(): React.ReactNode {
    if (!this.state.mouseIn) {
      return null;
    }
    const [x, y] = this.state.position;
    if (!this.props.shouldRenderAtPosition(x, y)) {
      return null;
    }
    return this.props.render(this.state.position[0], this.state.position[1]);
  }
}

const CLICKABLE_ATTR = 'pg-clickable';
interface ArrowFollowerProps {
  children: (x: number, y: number) => React.ReactNode;
  onNavigate: () => void;
  mouseCursorContainerMaxWidth: number;
  id: string;
  direction: 'right' | 'left';
  isTheOnlyArrow: boolean;
}

const isHoveringClickableElement = (element: HTMLElement, e: MouseEvent, x: number, y: number) => {
  // cancel the click event
  for (const ele of e.composedPath() as HTMLElement[]) {
    if (ele instanceof HTMLElement && ele.getAttribute(CLICKABLE_ATTR) === 'true') {
      return true;
    }
  }
  const bounding = element.getBoundingClientRect();
  const elementUnderMouse = document.elementFromPoint(x + bounding.left, y + bounding.top) as HTMLElement | null;
  if (!elementUnderMouse) {
    return false;
  }
  let parent = elementUnderMouse as HTMLElement | null;
  while (parent) {
    if (parent.getAttribute(CLICKABLE_ATTR) === 'true') {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
};

export class ArrowFollower extends React.Component<ArrowFollowerProps> {
  shouldRender = (x: number): boolean => {
    const element = getContainerById(this.props.id);
    const containerWidth = element.offsetWidth;
    const realMaxWidth = Math.min(this.props.mouseCursorContainerMaxWidth, this.props.isTheOnlyArrow ? 100 : 50);
    const amountOfPixelsNeeded = containerWidth * (realMaxWidth / 100);
    const isLeft = amountOfPixelsNeeded >= x;
    const isRight = x > containerWidth - amountOfPixelsNeeded;

    return this.props.direction === 'left' ? isLeft : isRight;
  };

  onNavigation = (e: MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onNavigate();
  };

  render(): React.ReactNode {
    return (
      <MouseCursor
        getElement={() => getContainerById(this.props.id)}
        render={(x, y) => {
          return (
            <>
              {this.props.children(x, y)}
              <style>
                {`
                  #${getContainerById(this.props.id)?.id} * {
                    cursor: none !important;
                  }
              `}
              </style>
            </>
          );
        }}
        shouldRenderAtPosition={this.shouldRender}
        onClick={this.onNavigation}
        onMouseDownOrUp={(e) => e.stopPropagation()}
        throttle={50}
      />
    );
  }
}

export function clickableFactory(): React.ReactHTML {
  const instances = new Map<string, React.FC>();
  return proxy<React.ReactHTML>((name) => {
    if (!instances.get(name)) {
      instances.set(name, (props) => {
        return React.createElement(name, {
          ...props,
          [CLICKABLE_ATTR]: 'true',
        });
      });
    }
    return instances.get(name) as React.ReactHTML[keyof React.ReactHTML];
  });
}

export const clickable = clickableFactory();
