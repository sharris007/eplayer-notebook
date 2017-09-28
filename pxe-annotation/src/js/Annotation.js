/* global $ */
import React, { PropTypes, Component } from 'react';
import { mapKeys } from 'lodash';
class Annotation extends Component {
 //Changes for load component in iframe
  constructor(props) {
    super(props);
    this.doc = this.props.pxeFrameRef.contentDocument;
    self = this;
    if (!window.lisLoaded) {
      window.lisLoaded=true;  
      let eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
      let eventer = window[eventMethod];
      let messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
        let callBackEvent=(e) => {
          try {
            let eventObj = e.data ? JSON.parse(e.data) : '';    
            if(eventObj.eventType && eventObj.eventType.indexOf("annotation") != -1){
              self.annotationEvent(eventObj.eventType,eventObj.data,eventObj.viewer);
            }   
          }
          catch(err) {
          }
        };
      eventer(messageEvent,callBackEvent,false);
    }
    if (this.props.annState === 'initial') {
      this.annotationEventHandler = this.annotationEventHandler.bind(this);
      this.annotationEvent = this.annotationEvent.bind(this);    
    }
    else if (this.props.annState === 'load' || this.props.annState === 'update') {
      let content = "";
      let newScript = document.createElement('script');
      if (this.props.annotationData) {
        let flag = 'loadAnnotations';
          if (this.props.annState==='update') {
            flag = 'updateAnnotationId';
          }
        const annData = (flag==='updateAnnotationId')?this.props.annotationData[0]:this.props.annotationData;
        if (flag === 'updateAnnotationId') {
            content = "$('body').annotator().annotator('"+flag+"',"+JSON.stringify(annData)+");";
        }
        else {
        // setTimeout(function() {
          content = "$('body').annotator().annotator('"+flag+"',"+JSON.stringify(annData)+");";
        }
        newScript.innerText = content;
        if (content != "")
         this.doc.head.append(newScript);
      }
    }   
 }
 
  componentDidMount() { 
    if (this.props.annState == 'initial') {
      this.annotationEventHandler();
      let content = "$('body').annotator('shareAnnotations', "+this.props.shareableAnnotations+");$('.annotator-editor').css({'left':$('body').width()+40});";
      let newScript = document.createElement('script');
      newScript.innerText = content;
      this.doc.head.append(newScript); 
    }
  }

  annotationEventHandler() {
   let newContent = "$('body').on('mousedown', this.onDocumentClick);$('body').keyup(this.onDocumentClick);";
   let method = newContent+" function onDocumentClick(e) {if ((e.keyCode === 27 ||!$(e.target).closest('.annotator-editor').length) && !$('.annotator-editor').hasClass('annotator-hide')) {$('body').data('annotator').editor.hide();}if ($(e.target).closest('.annotator-panel-1').length) {return false;}}";
   method = method + "function annIframeEvent(eventType_f, data_f, viewer_f){console.log('Event Triggered',eventType_f);var obj={eventType:eventType_f,data:data_f,viewer:viewer_f};parent.postMessage(JSON.stringify(obj),'*')};";
   newContent = method+"if(!annotation) {var annotation = $('body').annotator();} else {annotation=$('body').annotator();} annotation.data('annotator').on('annotationDeleted', annIframeEvent.bind(null, 'annotationDeleted'));annotation.data('annotator').on('annotationEditorSubmit', annIframeEvent.bind(null, 'annotationEditorSubmit'));annotation.data('annotator').on('annotationsLoaded', annIframeEvent.bind(null, 'annotationsLoaded'));";
   var newScript = document.createElement('script');
   newScript.innerText = newContent;
   this.doc.head.append(newScript);
     // annotation.data('annotator').on('annotationViewerShown', this.annotationEvent.bind(null, 'annotationViewerShown'));
    // annotation.data('annotator').on('annotationViewerTextField', this.annotationEvent.bind(null, 'annotationViewerTextField'));
  }

  annotationEvent(eventType, data, viewer) {    
    const customAttributes = this.props.annAttributes;
    if (this.props.isComponent) {
      $('.' + this.props.contentId).annotator().annotator('loadAnnotations', this.props.annotationData);
    }
    if (data || data.annotation) {
      const annData             =   data.annotation||data;
      annData.text              =   annData.text||'';
      //annData.createdTimestamp  =   new Date().toISOString();
      annData.updatedTimestamp  =   null;
      const customUnsourceObj   = mapKeys(annData, function(value, key) {
      if (customAttributes[key] ===undefined) {
        return key;
      }
      return customAttributes[key];
    });
      // change of event type on annotationEditorSubmit based on id
    if (eventType==='annotationEditorSubmit') {
      eventType=annData.id?'annotationUpdated':'annotationCreated'
    }  
      
    if (eventType==='annotationDeleted' && !annData.id) {return;}   
      this.props.annotationEventHandler(eventType, customUnsourceObj, viewer);
    }
  }
  render() {
    return (<div></div>);
  }
}

Annotation.PropTypes = {
  content: PropTypes.string.isRequired,
  annotationData: PropTypes.array.isRequired,
  annotationEventHandler:PropTypes.func
}

export default Annotation;