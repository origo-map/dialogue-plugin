import $ from 'jquery';
import Origo from 'Origo';
import editortemplate from './editortemplate';
import dispatcher from './editdispatcher';
import editHandler from './edithandler';
import editorLayers from './editorlayers';
import drawTools from './drawtools';

const createElement = Origo.Utils.default.createElement;
const createSvg = Origo.Utils.default.createSvg;

const activeClass = 'o-dialogue-active';
const disableClass = 'o-disabled';
let attributeHelpText;
let deleteHelpText;
let doneHelpText;
let defaultBackgroundColor;
let defaultTextColor;
let currentLayer;
let toolbarOptions;
let editableLayers;
let goToLink;
let $editAttribute;
let $editDraw;
let $editDelete;
let $editSave;
let $editDone;
let $layerButtons;

function render(viewer) {
  $('#o-tools-bottom').append(editortemplate(toolbarOptions));
  $editAttribute = $('#o-editor-attribute');
  $editDraw = $('#o-editor-draw');
  $editDelete = $('#o-editor-delete');
  $editSave = $('#o-editor-save');
  $editDone = $('#o-editor-done');

  $layerButtons = $('.o-dialogue-layer-button');

  $layerButtons.each((index, element) => {
    const layerName = $(element).attr('id').split('-').pop();
    const content = viewer.getLayer(layerName).get('buttonHelpText');
    const color = viewer.getLayer(layerName).get('customLegendColor') || '#ccc';
    let popover;

    if (content) {
      popover = createElement('div', content, {
        id: `o-editor-popover-${layerName}`,
        cls: 'o-popover',
        style: `border: 2px solid ${color}`
      });
      $(element).after(popover);
      document.getElementById(`o-editor-popover-${layerName}`).style.setProperty('--before-border-top-color', color);
    }
  });

  const attributeHelp = createElement('div', `<p>${attributeHelpText}</p>`, {
    id: 'o-editor-attribute-popover',
    cls: 'o-popover',
    style: 'border: 2px solid #ccc'
  });
  $editAttribute.after(attributeHelp);

  const deleteHelp = createElement('div', `<p>${deleteHelpText}</p>`, {
    id: 'o-editor-delete-popover',
    cls: 'o-popover',
    style: 'border: 2px solid #ccc'
  });
  $editDelete.after(deleteHelp);

  const doneHelp = createElement('div', `<p>${doneHelpText}</p>`, {
    id: 'o-editor-done-popover',
    cls: 'o-popover',
    style: 'border: 2px solid #ccc'
  });
  $editDone.after(doneHelp);
}

function toggleToolbar(state) {
  if (state) {
    $('.o-map').first().trigger({
      type: 'enableInteraction',
      interaction: 'editor'
    });
  } else {
    $('.o-map').first().trigger({
      type: 'enableInteraction',
      interaction: 'featureInfo'
    });
  }
}

function bindUIActions() {
  $layerButtons.on('click', (e) => {
    const layerName = $(e.currentTarget).attr('id').split('-').pop();

    if ($(e.currentTarget).hasClass('o-dialogue-active')) {
      $(e.currentTarget).removeClass('o-dialogue-active');
      dispatcher.emitToggleEdit('draw');
    } else {
      $('.o-dialogue-layer-button').removeClass('o-dialogue-active');
      $(`#o-dialogue-layer-${layerName}`).addClass('o-dialogue-active');
      dispatcher.emitToggleEdit('edit', {
        currentLayer: layerName
      });
      dispatcher.emitToggleEdit('draw');
    }
  });

  $editAttribute.on('click', (e) => {
    dispatcher.emitToggleEdit('attribute');
    $editAttribute.blur();
    e.preventDefault();
  });
  $editDelete.on('click', (e) => {
    $editDelete.blur();
    dispatcher.emitToggleEdit('delete');
    e.preventDefault();
  });
  $editDone.on('click', (e) => {
    window.open(goToLink, '_self');
    $editDelete.blur();
    e.preventDefault();
  });

  $('#o-dialogue-hide').on('click', (e) => {
    $('.o-dialogue').first().toggleClass('o-dialogue-hide');
    $(e.currentTarget).trigger('blur');
  });

  $('.o-popover-container').on('mouseenter', (e) => {
    $(e.currentTarget).find('.o-popover').addClass('o-active');
  }).on('mouseleave', (e) => {
    $(e.currentTarget).find('.o-popover').removeClass('o-active');
  });
}

function setActive(state) {
  if (state === true) {
    $('#o-editor-toolbar').removeClass('o-hidden');
  } else {
    $('#o-editor-toolbar').addClass('o-hidden');
  }
}

function onEnableInteraction(e) {
  e.stopPropagation();
  if (e.interaction === 'editor') {
    setActive(true);
    dispatcher.emitToggleEdit('edit', {
      currentLayer
    });
  } else {
    setActive(false);
    dispatcher.emitToggleEdit('cancel');
  }
}

function onChangeEdit(e) {
  if (e.tool === 'draw') {
    if (e.active === false) {
      $editDraw.removeClass(activeClass);
    } else {
      $editDraw.addClass(activeClass);
    }
  }
}

function onChangeFeature(e) {
  if ((e.action === 'insert' || e.action === 'delete') && e.status === 'finished') {
    $(`#o-dialogue-layer-${e.layerName}`).removeClass('o-dialogue-active');
  }
}

function toggleSave(e) {
  if (e.edits) {
    if ($editSave.hasClass(disableClass)) {
      $editSave.removeClass(disableClass);
    }
  } else {
    $editSave.addClass(disableClass);
  }
}

function getCustomIcon(iconName, iconClass) {
  const cls = iconClass || 'o-icon-24';
  const path = iconName.toLowerCase().match(/\.(jpg|png|gif|svg)/g) ? iconName : undefined;
  const props = {
    href: `#${iconName}`,
    cls
  };
  let icon;

  if (path) {
    icon = createElement('img', '', {
      src: path,
      width: 24,
      height: 24
    });
  } else if (iconName === 'none') {
    icon = '';
  } else {
    icon = createSvg(props);
  }

  return icon;
}

function getToolbarOptions(template, viewer) {
  const options = [];
  let layer;
  let style;

  switch (template) {
    case 'standard':
      editableLayers.forEach((editableLayer) => {
        const parameters = {};

        layer = viewer.getLayer(editableLayer);
        style = viewer.getStyle(layer.get('styleName'));
        parameters.name = layer.get('name');
        parameters.title = layer.get('title');
        parameters.icon = layer.get('customLegendIcon') ? getCustomIcon(layer.get('customLegendIcon')) : `<div class="toolbar-svg-container">${Origo.renderSvgIcon(style[0])}</div>`;
        parameters.bgColor = defaultBackgroundColor || layer.get('customLegendColor');
        parameters.textColor = defaultTextColor || layer.get('buttonTextColor');
        options.unshift(parameters);
      });
      break;
    default:
      console.log('No template assigned');
  }

  return options;
}

function init(options, viewer) {
  currentLayer = options.currentLayer;
  editableLayers = options.editableLayers;
  defaultBackgroundColor = options.defaultBackgroundColor || '#333';
  defaultTextColor = options.defaultTextColor || '#fff';
  toolbarOptions = getToolbarOptions(options.toolbarTemplate || 'standard', viewer);
  attributeHelpText = options.attributeHelpText || 'Mark an object in the map and click here to change information about the object';
  deleteHelpText = options.deleteHelpText || 'Mark an object in the map and click here to remove the object';
  doneHelpText = options.doneHelpText || 'End the edit session and move on to the next page';
  goToLink = options.goToLink;

  editHandler(options, viewer);
  render(viewer);
  editorLayers(editableLayers, {
    activeLayer: currentLayer
  }, viewer);
  drawTools(options.drawTools, currentLayer, viewer);

  $(document).on('enableInteraction', onEnableInteraction);
  $(document).on('changeEdit', onChangeEdit);
  $(document).on('editsChange', toggleSave);
  $(document).on('changeFeature', onChangeFeature);

  bindUIActions();
  setActive(true);
}

export default (function exportInit() {
  return {
    init,
    toggleToolbar
  };
}());
