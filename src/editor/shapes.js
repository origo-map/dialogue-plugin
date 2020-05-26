import Origo from 'Origo';

export default (drawType) => {
  const types = {
    box: {
      type: 'Circle',
      geometryFunction: Origo.ol.interaction.Draw().createBox()
    }
  };

  if (Object.prototype.hasOwnProperty.call(types, drawType)) {
    return types[drawType];
  }
  return {};
};
