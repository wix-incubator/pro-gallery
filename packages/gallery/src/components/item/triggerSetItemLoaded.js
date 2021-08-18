export default triggerSetItemLoaded;
function triggerSetItemLoaded(props) {
  try {
    if (typeof props.actions.setItemLoaded === 'function') {
      props.actions.setItemLoaded();
    }
  } catch (e) {
    console.error(e);
  }
}
