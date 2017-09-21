/* global $ */
import React, { PropTypes, Component } from 'react';
import { mapKeys } from 'lodash';


class Annotation extends Component {
 constructor(props) {
   super(props);   
   this.annotationEventHandler = this.annotationEventHandler.bind(this);
   this.annotationEvent = this.annotationEvent.bind(this);
   this.onDocumentClick=this.onDocumentClick.bind(this);
    //$('#' + props.contentId).annotator().annotator('loadAnnotations', props.annotationData);
   $(document).on('mousedown', this.onDocumentClick);
   $(document).keyup(this.onDocumentClick);
   this.state = {'updated':false}
 }

  onDocumentClick(e) {
    if ((e.keyCode === 27 ||!$(e.target).closest('.annotator-editor').length) && !$('.annotator-editor').hasClass('annotator-hide')) {
      $('.' + this.props.contentId).data('annotator').editor.hide();
    }
    if ($(e.target).closest('.annotator-panel-1').length) {
      return false;
    }
  }
  componentDidMount() { 
    this.annotationEventHandler();
    $('.' + this.props.contentId).annotator('shareAnnotations', this.props.shareableAnnotations);
    const contentWid = $('.' + this.props.contentId).width()+40
    $('.annotator-editor').css({'left':contentWid});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.annotationData && nextProps.annotationData.length) {
      console.log('componentWillReceiveProps', nextProps);
      let flag = 'loadAnnotations';
      if (this.state.updated) {
        flag = 'updateAnnotationId';
        this.setState({'updated':false});
      }
      const annData = (flag==='updateAnnotationId')?nextProps.annotationData[0]:nextProps.annotationData;
      if (flag === 'updateAnnotationId') {
        $('.' + nextProps.contentId).annotator().annotator(flag, annData);
      }
      else {
        setTimeout(function() {
          $('.' + nextProps.contentId).annotator().annotator(flag, annData);
        }, 4500);
      }
    }
  } 


  annotationEventHandler() {
    const annotation = $('.' + this.props.contentId).annotator();
    if (this.props.isComponent) {
      $('.' + this.props.contentId).annotator().annotator('loadAnnotations', this.props.annotationData);
    }
    // annotation.data('annotator').on('beforeAnnotationCreated', this.annotationEvent.bind(null, 'beforeAnnotationCreated'));
    // annotation.data('annotator').on('annotationCreated', this.annotationEvent.bind(null, 'annotationCreated'));
    // annotation.data('annotator').on('beforeAnnotationUpdated', this.annotationEvent.bind(null, 'beforeAnnotationUpdated'));
    // annotation.data('annotator').on('annotationUpdated', this.annotationEvent.bind(null, 'annotationUpdated'));
    annotation.data('annotator').on('annotationDeleted', this.annotationEvent.bind(null, 'annotationDeleted'));
    // annotation.data('annotator').on('annotationEditorShown', this.annotationEvent.bind(null, 'annotationEditorShown'));
    // annotation.data('annotator').on('annotationEditorHidden', this.annotationEvent.bind(null, 'annotationEditorHidden'));
    annotation.data('annotator').on('annotationEditorSubmit', this.annotationEvent.bind(null, 'annotationEditorSubmit'));
    // annotation.data('annotator').on('annotationViewerShown', this.annotationEvent.bind(null, 'annotationViewerShown'));
    // annotation.data('annotator').on('annotationViewerTextField', this.annotationEvent.bind(null, 'annotationViewerTextField'));
  }

  annotationEvent(eventType, data, viewer) {    
    const customAttributes = this.props.annAttributes;
    if (data.annotation||data) {
      const annData             =   data.annotation||data;
      annData.text              =   annData.text||'';
      annData.createdTimestamp  =   new Date().toISOString();
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
      if (eventType==='annotationCreated') {
        this.setState({'updated':true});
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
