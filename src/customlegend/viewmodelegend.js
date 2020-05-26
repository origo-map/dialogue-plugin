import Origo from 'Origo';
import utils from '../utils';

const legendItems = [];
let legendElement;
let viewer;

function onToggleFeatureinfo() {
  const layerTitle = document.getElementById('o-card-title').textContent;
  const color = viewer.getLayersByProperty('title', layerTitle)[0].get('customLegendColor');
  document.getElementById('o-card-title').parentElement.style.backgroundColor = color;
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
    icon = utils.createElement('img', '', {
      src: path
    });
  } else if (iconName === 'none') {
    icon = '';
  } else {
    icon = utils.createSvg(props);
  }

  return icon;
}

function toggleLegend() {
  legendElement.classList.toggle('o-dialogue-hide');
}

const ViewModeLegend = function ViewModeLegend(options = {}) {
  return Origo.ui.Component({
    name: 'viewModeLegend',
    onInit() {

    },
    onAdd() {
      viewer = options.viewer;
      const layers = viewer.getLayersByProperty('inCustomLegend', true);

      layers.forEach((layer) => {
        const style = viewer.getStyle(layer.get('styleName'));
        const legendStyle = layer.get('customLegendIcon') ? getCustomIcon(layer.get('customLegendIcon')) : Origo.renderSvgIcon(style[0]);
        const bgColor = options.defaultBackgroundColor || layer.get('customLegendColor');
        const textColor = options.defaultTextColor || layer.get('buttonTextColor');
        const legendItem = {};

        legendItem.name = layer.get('name');
        legendItem.title = layer.get('title');
        legendItem.visible = layer.getVisible();
        legendItem.bgColor = bgColor;
        legendItem.textColor = textColor;
        legendItem.icon = legendStyle;

        legendItems.unshift(legendItem);
      });

      this.render();

      document.addEventListener('toggleFeatureinfo', onToggleFeatureinfo);
    },
    onRender() {

    },
    render() {
      const target = document.getElementById(viewer.getMain().getBottomTools().getId());
      const layerButtons = [];

      const hideLegendButton = Origo.ui.Button({
        icon: '#ic_menu_24px',
        cls: 'o-dialogue-hide-button padding-small icon-smaller round light o-no-boxshadow',
        style: 'opacity: 0.7',
        click() {
          toggleLegend();
        }
      });

      const hideLegendButtonContainer = Origo.ui.Element({
        tagName: 'div',
        cls: 'flex justify-center',
        style: 'margin-bottom: .5em;',
        components: [hideLegendButton]
      });

      layerButtons.push(hideLegendButtonContainer);

      legendItems.forEach((legendItem) => {
        const unchecked = !legendItem.visible ? 'dialogue-unchecked' : '';
        const buttonIconComponent = Origo.ui.Icon({
          icon: `${legendItem.icon}`
        });

        const buttonContent = `<span class="flex row no-margin width-full">
                  <span class="icon">${buttonIconComponent.render()}</span>
                  <span class="o-button-text flex grow justify-center text-weight-bold">${legendItem.title}</span>
                </span>`;

        const layerButton = Origo.ui.Element({
          attributes: { name: legendItem.name },
          tagName: 'button',
          cls: `o-dialogue-button o-dialogue-layer-button margin-right-small rounded-larger icon-small text-white flex ${unchecked}`,
          style: `background-color: ${legendItem.bgColor}; color: ${legendItem.textColor}`,
          innerHTML: buttonContent,
          click() {
            const layer = viewer.getLayer(this.data.name);
            layer.setVisible(!layer.getVisible());
          }
        });

        layerButton.on('render', () => {
          const layerButtonEl = document.getElementById(layerButton.getId());
          layerButtonEl.addEventListener('click', (e) => {
            const layer = viewer.getLayer(layerButtonEl.name);
            layer.setVisible(!layer.getVisible());
            e.preventDefault();
          });
        });

        const layer = viewer.getLayer(legendItem.name);
        layer.on('change:visible', () => {
          document.getElementById(layerButton.getId()).classList.toggle('dialogue-unchecked');
        });

        layerButtons.push(layerButton);
      });

      const legendContainer = Origo.ui.Element({
        cls: 'o-dialogue absolute bottom-center no-margin flex justify-center width-full',
        components: layerButtons
      });


      this.addComponent(legendContainer);
      const el = Origo.ui.dom.html(legendContainer.render());
      target.appendChild(el);
      legendElement = document.getElementById(legendContainer.getId());

      this.dispatch('render');
    }
  });
};

export default ViewModeLegend;
