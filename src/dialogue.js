import Origo from 'Origo';
import editorToolbar from './editor/editortoolbar';
import ViewModeLegend from './customlegend/viewmodelegend';
import voter from './controls/voter';

const Dialogue = function Dialogue(options = {}) {
  const {
    mode = 'edit',
    autoForm = true,
    autoSave = true
  } = options;
  let viewer;

  return Origo.ui.Component({
    name: 'dialogue',
    onAdd(evt) {
      viewer = evt.target;
      const editableLayers = viewer.getLayersByProperty('editable', true, true);
      const currentLayer = options.defaultLayer || editableLayers[0];
      const allLayersSelectable = true;
      const toolbarOptions = Object.assign({}, options, {
        autoForm,
        autoSave,
        currentLayer,
        editableLayers,
        allLayersSelectable
      });
      this.on('render', this.onRender);
      this.render();

      if (mode === 'edit') {
        viewer.dispatch('toggleClickInteraction', {
          name: 'editor',
          active: true
        });
        editorToolbar.init(toolbarOptions, viewer);
      } else {
        const legendOptions = Object.assign({}, options, {
          viewer
        });

        const customlegend = ViewModeLegend(legendOptions);

        this.addComponent(customlegend);
      }
    },
    render() {
      this.dispatch('render');

      if (options.voter && options.voter.active) {
        voter.init(options.voter.options, viewer);
      }
    }
  });
};

export default Dialogue;
