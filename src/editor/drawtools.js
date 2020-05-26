import $ from 'jquery';
import utils from '../utils';

const createElement = utils.createElement;

let viewer;

const drawToolsSelector = function drawToolsSelector(tools, defaultLayer, v) {
  viewer = v;
  const defaultTools = tools || {};
  let drawTools;
  let currentLayer = defaultLayer;
  const map = viewer.getMap();
  let active = false;
  const activeCls = 'o-active';
  const target = 'editor-toolbar-draw-dropdown';

  function close() {
    if (active) {
      setActive(false);
    }
  }

  function setActive(state) {
    if (state) {
      if (drawTools.length > 1) {
        active = true;
        $(`#${target} ul`).remove();
        $(`#${target}`).addClass(activeCls);
        map.once('click', close);
      }
    } else {
      active = false;
      $(`#${target}`).removeClass(activeCls);
      map.un('click', close);
    }
  }

  function render() {
    const popover = createElement('div', '', {
      id: target,
      cls: 'o-popover'
    });
    $('#o-editor-draw').after(popover);
    setActive(false);
  }

  function setDrawTools(layerName) {
    const layer = viewer.getLayer(layerName);
    let geometryType;
    drawTools = layer.get('drawTools') || [];
    if (layer.get('drawTools')) {
      drawTools = layer.get('drawTools');
    } else {
      geometryType = layer.get('geometryType');
      drawTools = defaultTools[geometryType] ? defaultTools[geometryType].slice(0) : [];
      drawTools.unshift(geometryType);
    }
  }

  function onChangeEdit(e) {
    if (e.tool === 'draw' && e.active === true) {
      setDrawTools(currentLayer);
      setActive(true);
    } else if (e.tool === 'draw' && e.active === false) {
      setActive(false);
    }
    e.stopPropagation();
  }

  function onToggleEdit(e) {
    if (e.tool === 'edit' && e.currentLayer) {
      currentLayer = e.currentLayer;
    }
    e.stopPropagation();
  }

  function addListener() {
    $(document).on('changeEdit', onChangeEdit);
    $(document).on('toggleEdit', onToggleEdit);
  }

  function init() {
    render();
    addListener();
  }

  init();
};

export default drawToolsSelector;
