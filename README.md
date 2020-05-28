# Origo Citizens' Dialogue plugin

**PLEASE NOTE THAT THIS IS A WORK-IN-PROGRESS VERSION NOT YET OFFICIALLY RELEASED**

A plugin for rapid deployment of a map based citizens' dialogue tool.

This plugin includes two different modes - **view** and **edit**. It is recommended to use different configs for each mode.

## Example usage

### index.html
```html
<!DOCTYPE html>
<html lang="sv">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge;chrome=1">
	<title>Origo exempel</title>
	<link href="css/style.css" rel="stylesheet">
	<link href="plugins/dialogue/css/dialogue.css" rel="stylesheet">
	<link rel="shortcut icon" href="img/png/logo.png">
</head>
```

#### Edit mode
```html
<body>
<div id="app-wrapper">
</div>
<script src="js/origo.js"></script>
<script src="plugins/dialogue/js/dialogue.js"></script>
<script type="text/javascript">
	var origo = Origo('index_edit.json');
	origo.on('load', function(viewer) {
			var dialogue = Dialogue({
				mode: 'edit',
				autoForm: true,
				defaultBackgroundColor: '#fff',
				defaultTextColor: '#333',
				goToLink: 'https://github.com/origo-map/origo',
				snap: false
			});
			viewer.addComponent(dialogue);
	});
</script>
</body>
</html>
```

#### View mode
```html
<body>
<div id="app-wrapper">
</div>
<script src="js/origo.js"></script>
<script src="plugins/dialogue/dialogue.js"></script>
<script type="text/javascript">
	var origo = Origo('index_view.json');
	origo.on('load', function(viewer) {
			var dialogue = Dialogue({
				mode: 'view',
				autoForm: true,
				defaultBackgroundColor: '#fff',
				defaultTextColor: '#333',
				goToLink: 'https://github.com/origo-map/origo',
				voter: {
					active: true,
					options: {
						layers: {
							editor_polygon: 'highlight',
							editor_line: 'highlight'
						}
					}
				}
			});
			viewer.addComponent(dialogue);
	});
</script>
</body>
</html>
```

##### *PRO TIP!*
By utilizing URL search parameters, you can use the same HTML file for both modes. Use an URL like `https://mydialogue.example.com?mode=view` (for view mode) and replace any references to the mode in the startup script with the URL search parameter 'mode'. *Please note that `URLSearchParams` is not compatible with IE*.

Example for non-crappy browsers:
```javascript
var dialogue = Dialogue({
  mode: new URLSearchParams(document.location.search).get('mode'),
  defaultBackgroundColor: '#333',
  goToLink: 'https://github.com/origo-map/origo'
});
```

Example for IE:
```javascript
var urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results == null){
		return null;
	}
	else {
		return decodeURI(results[1]) || 0;
	}
};

var mode = urlParam('mode');
var dialogue = Dialogue({
  mode,
  defaultBackgroundColor: '#333',
  goToLink: 'https://github.com/origo-map/origo'
});
```

## Settings
### Dialogue component settings (in html file)
Option | Type | Description
---|---|---
`mode` | string | Sets the current dialogue mode. Accepted values are `view` and `edit`. Default is `edit`.
`autoForm` | boolean | Sets if the edit form should open automatically when adding an object to the map. Only applicable in *edit* mode. Default is `true`.
`defaultBackgroundColor` | string | Default background color code of the dialogue layer controls. Default is `#333`.
`snap` | Boolean | Sets if snapping should be active in edit mode. Only applicable in *edit* mode. Default is `true`.
`goToLink` | string | URL to be loaded after completed edit session. Optional.
`voter` | object | A control that allows the user to vote for or "like" a dialogue object. Only applicable in *view* mode. See settings below.

```js
voter: {
	active: true,
	options: {
		layers: { // List of layers for which the voter control should be active
			editor_polygon: 'highlight', // Name of layer and the attribute used for storing the vote count
			editor_line: 'highlight'
		}
	}
}
```

### Layer Settings (in config file)
#### *View/Edit mode*
*Please note that only plugin specific settings are documented here. Standard Origo layer settings still apply.*

Option | Type | Description
---|---|---
`inCustomLegend` | boolean | Sets if the layer should be present in the custom layer control. Default is `false`. Please note that the layer will still be visible in the map and in the standard Origo legend (if present) if set to `false`.
`customLegendIcon` | string | Path to the icon shown in the custom layer control. Optional.
`customLegendColor` | string | Color (RGB/HEX etc.) associated with the layer. Can be used in popup/sidebar headers and such. Optional.
`buttonHelpText` | string | Tooltip text for custom layer control buttons.

#### *Edit mode*
This plugin comes with a few extra editor attribute types.

**timestamp**
Used for setting a timestamp on added features. Sets current date and/or time. This field is hidden by default.

```js
{
  "name": "AttributeName",
  "type": "timestamp",
  "timestampFormat": "date" // Accepted values are "date" and "time". If omitted, the default format is "datetime".
}
```

**checkbox**
Used to set up multiple choice type checkbox questions.

```js
{
  "name": "AttributeName",
  "title": "Title in the edit form",
  "type": "checkbox",
  "options": [ // Selectable checkbox options
    "Option 1",
    "Option 2",
    "Option 3",
    "OtherOption:textbox" // By adding the ":textbox" suffix, a textbox is attached to the option, enabled only if the option is checked. Used as an "other"/"miscellaneous" free text option.
  ]
}
```

**storage**
Used for setting attribute values based on values set in sessionStorage (localStorage is currently not supported). Particularly useful if the dialogue tool is used in combination with traditional web forms and surveys. If the specified sessionStorage key is available, the corresponding attribute will be set automatically when saving attributes. This field is hidden by default.

```js
{
  "name": "AttributeName",
  "type": "storage"
}
```
