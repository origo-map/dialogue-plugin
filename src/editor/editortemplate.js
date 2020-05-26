export default (object) => {
  let el = `<div class="o-dialogue absolute bottom-center no-margin flex justify-center width-full">
    <div class="flex justify-center" style="margin-bottom: .5em;">
      <button id="o-dialogue-hide" class="o-dialogue-hide-button padding-small icon-smaller round light o-no-boxshadow" type="button" name="button" style="opacity: 0.7;">
        <svg class="icon">
            <use xlink:href="#ic_menu_24px"></use>
        </svg>
      </button>
    </div>`;

  object.forEach((obj) => {
    el += `<div class="o-popover-container">
      <button id="o-dialogue-layer-${obj.name}" class="o-dialogue-button o-dialogue-layer-button margin-right-small rounded-larger icon-small text-white flex" type="button" name="button" style="background-color: ${obj.bgColor}; color: ${obj.textColor}">
        <span class="icon">${obj.icon}</span>
        <span class="o-button-text flex grow justify-center text-weight-bold">${obj.title}</span>
      </button>
    </div>`;
  });

  el += `<div class="o-popover-block">
      <div class="o-popover-container">
        <button id="o-editor-attribute" class="o-button-lg" type="button" name="button">
          <svg class="o-icon-24">
              <use xlink:href="#ic_description_24px"></use>
          </svg>
        </button>
      </div>
      <div class="o-popover-container">
        <button id="o-editor-delete" class="o-button-lg" type="button" name="button">
          <svg class="o-icon-24">
              <use xlink:href="#ic_delete_24px"></use>
          </svg>
        </button>
      </div>
      <div class="o-popover-container">
        <button id="o-editor-done" class="o-button-lg" type="button" name="button">
          <svg class="o-icon-24">
              <use xlink:href="#ic_check_24px"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>`;

  return el;
};
