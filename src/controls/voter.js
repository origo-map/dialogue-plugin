import $ from 'jquery';
import transactionHandler from '../editor/transactionhandler';

let storageArr = [];
let options;
let currentItem;
let buttonDefaultText;
let buttonAlreadyVotedText;
let type;
let viewer;

// FIXME: Make it work with votedown as well
function setVote(voteStatus) {
  if (voteStatus) {
    $(`#o-editor-voteup-${currentItem.layer.get('name')}`).addClass('o-voter-true');
  } else {
    $(`#o-editor-voteup-${currentItem.layer.get('name')}`).removeClass('o-voter-true');
  }
}

function getVoteStatus(featureId) {
  const storage = localStorage.dialogueVotes ? JSON.parse(localStorage.dialogueVotes) : [];
  storageArr = storage;
  const match = storageArr.filter((element) => element === featureId).shift();
  const hasVote = match;
  return hasVote;
}

function voteHandler(vote) {
  const features = [];
  const feature = currentItem.feature;
  const layerName = currentItem.layer.get('name');
  const voterAttribute = options.layers[layerName];
  const transaction = {
    update: null
  };

  feature.set(voterAttribute, feature.get(voterAttribute) * 1 + vote);
  $('.o-voter-container span').text(`${feature.get(voterAttribute)} ${buttonDefaultText}`);
  feature.unset('bbox');
  features.push(feature);
  transaction.update = features;
  transactionHandler(transaction, layerName, viewer);
}

function render() {
  const votes = currentItem.feature.get(options.layers[currentItem.layer.get('name')]) || 0;
  let el = `<li><div class="o-voter-container">
  <button id="o-editor-voteup-${currentItem.layer.get('name')}" class="o-button-lg o-voter-button" type="button" name="button">
  <svg class="o-icon-24">
  <use href="#dialogue_ic_thumb_up_24px"></use>
  </svg>
  </button>`;
  if (type === 'upAndDown') {
    el += `<button id="o-editor-votedown-${currentItem.layer.get('name')}" class="o-button-lg o-voter-button" type="button" name="button">
      <svg class="o-icon-24">
      <use href="#dialogue_ic_thumb_down_24px"></use>
      </svg>
      </button>`;
  }

  el += `<span>${votes} ${buttonDefaultText}</span>
    </div></li>`;

  $('#o-identify ul').append(el);
}

function bindUIAction() {
  const featureId = `${currentItem.layer.get('name')}.${currentItem.feature.getId()}`;
  let prevText;
  let timer;

  $('.o-voter-button').on('mousedown', (evt) => {
    $(evt.currentTarget).addClass('o-less-shadow');

    $('.o-voter-button').on('mouseup', () => {
      $(evt.currentTarget).removeClass('o-less-shadow');
    });
  });

  $('.o-voter-button').on('click', (evt) => {
    if (getVoteStatus(featureId)) {
      prevText = prevText || $('.o-voter-container > span:first').text();
      $('.o-voter-container > span:first').text(buttonAlreadyVotedText);
      clearTimeout(timer);
      timer = setTimeout(() => {
        $('.o-voter-container > span:first').text(prevText);
        prevText = null;
      }, 5000);
    } else {
      storageArr.push(featureId);
      localStorage.dialogueVotes = JSON.stringify(storageArr);
      $(evt.currentTarget).addClass('o-voter-true');
      if ($(evt.currentTarget).attr('id').indexOf('voteup') > 0) {
        voteHandler(1);
      } else {
        voteHandler(-1);
      }
    }
  });
}

function onToggleFeatureinfo(evt) {
  currentItem = evt.detail.currentItem;

  if (currentItem) {
    const featureId = `${currentItem.layer.get('name')}.${currentItem.feature.getId()}`;

    $('.o-voter-container').parent('li').remove();

    render();
    bindUIAction();

    const voteStatus = getVoteStatus(featureId);

    if (voteStatus) {
      setVote(voteStatus);
    }
  }
}

function init(optOptions, vw) {
  viewer = vw;
  options = optOptions;
  buttonDefaultText = options.defaultText || 'likes';
  buttonAlreadyVotedText = options.alreadyVotedText || 'You have already voted!';
  type = options.type || 'upOnly';

  document.addEventListener('toggleFeatureinfo', onToggleFeatureinfo);
}

export default {
  init
};
