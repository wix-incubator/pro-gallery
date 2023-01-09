/**
 *
 * @param dimensions {`x${float}y${float}z${float}`}
 */
export const parse3DDimensions = (dimensions) => {
  const x = parseFloat(dimensions.split('x')[1].split('y')[0]);
  const y = parseFloat(dimensions.split('y')[1].split('z')[0]);
  const z = parseFloat(dimensions.split('z')[1]);
  return { x, y, z };
};
