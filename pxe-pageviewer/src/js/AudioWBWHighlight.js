/* global $ */
let isGetAudioJson= false;
let audio = '';
let audioJsonData = '';
let astPlayBtn = '';

const audioWbWHighlight = (getRef) => {
  const getAudioHighlightClass = getRef.bookContainerRef.getElementsByClassName('ast-icon-play-button');
  const getAudioHighlightClass_length = getAudioHighlightClass.length;
  const allAudioObj = [];
  for (let i = 0; i < getAudioHighlightClass_length ; i++) {
    isGetAudioJson = false;
    allAudioObj.push( document.getElementById($(getAudioHighlightClass[i]).attr('data-astaudioid')) );
    getAudioHighlightClass[i].onclick = audioCallBack(getAudioHighlightClass[i], getRef, allAudioObj);

  } 
};

function audioCallBack(currentEle, ref) {
  return function() {
    const audioId = $(currentEle).attr('data-astaudioid');
    $(currentEle).attr('disabled', 'disabled');
    audio = document.getElementById(audioId);
    const audioJson = $('#'+audioId).attr('data-astjson');
    pauseOtherAudios(audio);
    initAudio(ref, audioJson, currentEle, audio);
  };
};

const pauseOtherAudios = (audio) => {
  const audios = document.getElementsByTagName('audio');
  const audioslen = audios.length;
  for (let i = 0; i < audioslen;i++) {
    if (audios[i] !== audio) {
      audios[i].pause();
      const attrId = $(audios[i]).attr('id');
      $('button[data-astaudioid="'+ attrId +'"]').removeClass('ast-icon-pause-button').addClass('ast-icon-play-button');
    };
  }
};

const audioPlay = (getAudioId) => {
  getAudioId.play();
};
const audioPause = (getAudioId) => {
  getAudioId.pause();
};

const initAudio = (thisObj, jsonAttr, currentEle, audio) => {
  const audioUrl = thisObj.props.src.baseUrl + thisObj.state.currentStatePlayListUrl.href;
  const audioJsonUrl = audioUrl.substring(0, audioUrl.lastIndexOf('/') + 1) + jsonAttr;
  fetch(audioJsonUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // console.log('data', data);
      isGetAudioJson = true;
      $(currentEle).removeAttr('disabled');
      audioJsonData = data.words;

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

    });
};
export default audioWbWHighlight;
