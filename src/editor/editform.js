const createForm = function createForm(obj) {
  const id = obj.elId.slice(1);
  let cls = obj.cls || '';
  cls += id;
  cls += obj.isVisible ? '' : ' o-hidden';
  const label = obj.title;
  let val = obj.isVisible && obj.val != null ? obj.val : '';
  const type = obj.type;
  const name = obj.name;
  const maxLength = obj.maxLength ? ` maxlength="${obj.maxLength}"` : '';
  const options = obj.options || [];
  const today = new Date();
  const isoDate = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString();
  const readonly = obj.readonly ? ' readonly' : '';
  const disabled = obj.readonly ? ' disabled' : '';
  let el;
  let checked;
  let firstOption;
  switch (type) {
    case 'text':
      el = `<div><label>${label}</label><br><input type="text" id="${id}" value="${val}"${maxLength}${readonly}></div>`;
      break;
    case 'textarea':
      el = `<div><label>${label}</label><br><textarea id="${id}" rows="3"${maxLength}${readonly}>${val}</textarea></div>`;
      break;
    case 'number':
      el = `<div><label>${label}</label><br><input type="number" id="${id}" value="${val}"${maxLength}${readonly}></div>`;
      break;
    case 'checkbox':
      if (options.length) {
        el = `<div class="o-form-checkbox"><label>${label}</label><br>`;
        options.forEach((opt, index) => {
          const option = opt.split(':')[0];
          const subtype = opt.split(':')[1];
          let textboxVal;
          let disable;

          if (subtype === 'textbox') {
            checked = val[val.length - 1] && options.indexOf(val[val.length - 1]) === -1 ? ' checked' : '';
            textboxVal = checked ? val[val.length - 1] : '';
            disable = checked ? '' : ' disabled';
            el += `<input id="${id}-${index}" type="checkbox" name="${name}" data-index="${index}" value="${option}"${checked}> ${option}: `;
            el += `<input type="text" value="${textboxVal}"${maxLength} style="width: auto; padding:0; margin:0; line-height:1.3rem;" ${disable} autocomplete="off">`;
            el += '<br>';
          } else {
            checked = val.indexOf(option) > -1 ? ' checked' : '';
            el += `<input id="${id}-${index}" type="checkbox" name="${name}" data-index="${index}" value="${option}"${checked}> ${option}<br>`;
          }
        });
        el += '<br></div>';
      } else {
        checked = val ? ' checked' : '';
        el = `<div class="o-form-checkbox"><label>${label}</label><input id="${id} type="checkbox" value="${val}"${checked}></div>`;
      }
      break;
    case 'dropdown':
      if (val) {
        firstOption = `<option value="${val}" selected>${val}</option>`;
      } else {
        firstOption = '<option value="" selected>Välj</option>';
      }
      el = `<div class="${cls}"><label>${label}</label><br><select id=${id}${disabled}>${firstOption}`;
      for (let i = 0; i < options.length; i += 1) {
        el += `<option value="${options[i]}">${options[i]}</option>`;
      }
      el += '</select></div>';
      break;
    case 'image': {
      const imageClass = val ? '' : 'o-hidden';
      el = `<div class="${cls}"><label>${label}</label><br>`;
      el += `<img src="${val}" id="image-upload" class="${imageClass}"/>`;
      el += `<input type="file" id="${id}" value="${val}" accept="image/*"${disabled}>`;
      el += `<input id="o-delete-image-button" class="${imageClass}" type="button" value="Ta bort bild"${disabled}>`;
      el += '</div>';
      break;
    }
    case 'date':
      if (!val) {
        if (obj.defaultDate === false) {
          val = '';
        } else if (obj.defaultDate) {
          val = obj.defaultDate;
        } else {
          val = isoDate.slice(0, 10);
        }
      }
      el = `<div><label>${label}</label><br><input type="date" id="${id}" placeholder="ÅÅÅÅ-MM-DD" value="${val}"${readonly}></div>`;
      break;
    case 'time':
      if (!val) {
        if (obj.defaultTime === false) {
          val = '';
        } else if (obj.defaultTime) {
          val = obj.defaultTime;
        } else {
          val = isoDate.slice(11, 16);
        }
      }
      el = `<div><label>${label}</label><br><input type="time" id="${id}" placeholder="tt:mm" value="${val}"${readonly}></div>`;
      break;
    case 'datetime':
      if (!val) {
        if (obj.defaultDatetime === false) {
          val = '';
        } else if (obj.defaultDatetime) {
          val = obj.defaultDatetime;
        } else {
          val = isoDate.slice(0, 16);
        }
      }
      el = `<div><label>${label}</label><br><input type="datetime-local" id="${id}" placeholder="ÅÅÅÅ-MM-DDTtt:mm" value="${val}"${readonly}></div>`;
      break;
    case 'timestamp':
      switch (obj.format) {
        case 'date':
          val = isoDate.slice(0, 10);
          break;
        case 'time':
          val = isoDate.slice(11, 16);
          break;
        default:
          val = `${isoDate.slice(0, 10)} ${isoDate.slice(11, 16)}`;
      }
      el = `<input type="hidden" id="${id}" value="${val}"${readonly}>`;
      break;
    case 'color':
      if (!val) {
        val = obj.defaultColor ? obj.defaultColor : '';
      }
      el = `<div><label>${label}</label><br><input type="color" id="${id}" value="${val}"${readonly}></div>`;
      break;
    case 'hidden':
      el = `<input type="hidden" id="${id}" value="${val}">`;
      break;
    case 'storage':
      el = `<input type="hidden" id="${id}" value="${val}">`;
      break;
    default:
      break;
  }
  return el;
};

export default createForm;
