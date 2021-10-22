const LOAD_TRANSITIONS = {
  NO_EFFECT: 0,
  BLUR_OUT: 1,
};

const isLoadTransition = (layoutName) => (options) => {
  return (
    options.behaviourParams.item.loadTransition === LOAD_TRANSITIONS[layoutName]
  );
};

export default LOAD_TRANSITIONS;
export { isLoadTransition };
