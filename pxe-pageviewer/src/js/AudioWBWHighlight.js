let isGetAudioJson= false;
let audio = '';
let audioJsonData = '';
let astPlayBtn = '';

const audioWbWHighlight = (getRef) => {
  const getAudioHighlightClass = getRef.bookContainerRef.getElementsByClassName('ast-icon-play-button');
  const getAudioHighlightClass_length = getAudioHighlightClass.length;
  for (let i = 0; i < getAudioHighlightClass_length ; i++) {
    isGetAudioJson = false;
    const audioId = $(getAudioHighlightClass[i]).attr('data-astaudioid');
    $(getAudioHighlightClass[i]).attr('disabled', 'disabled');
    audio = document.getElementById(audioId);
    const audioJson = $('#'+audioId).attr('data-astjson');
    initAudio(getRef, audioJson, getAudioHighlightClass[i]);
    getAudioHighlightClass[i].onclick = audioCallBack(getAudioHighlightClass[i], audio);

  } 
};

function audioCallBack(currentEle, audio) {
  return function() {
    if ($(currentEle).hasClass('ast-icon-play-button')) {
      astPlayBtn = $(currentEle);
      $(currentEle).removeClass('ast-icon-play-button').addClass('ast-icon-pause-button');     
      if (isGetAudioJson) {
        audioPlay(audio);
        audio.addEventListener('timeupdate', function() {
          audioJsonData.forEach(function(element) {
            $('#'+element.id).removeClass('audioHighlight');
            if ( audio.currentTime >= element.start && audio.currentTime <= element.end ) {
              $('#'+element.id).addClass('audioHighlight');
            }
          });
        });
      }
    } 
    else {
      $(currentEle).removeClass('ast-icon-pause-button').addClass('ast-icon-play-button');
      if (isGetAudioJson) {
        audioPause(audio);
      }
    }
    $(audio).bind('ended', function() {
      astPlayBtn.removeClass('ast-icon-pause-button').addClass('ast-icon-play-button');
    });
  };
};

const audioPlay = (getAudioId) => {
  getAudioId.play();
};
const audioPause = (getAudioId) => {
  getAudioId.pause();
};

const initAudio = (thisObj, jsonAttr, playBtn) => {
  const audioUrl = thisObj.props.src.baseUrl + thisObj.state.currentStatePlayListUrl.href;
  const audioJsonUrl = audioUrl.substring(0, audioUrl.lastIndexOf('/') + 1) + jsonAttr;
  fetch(audioJsonUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('data', data);
      isGetAudioJson = true;
      $(playBtn).removeAttr('disabled');
      audioJsonData = data.words;
    });
};
export default audioWbWHighlight;
