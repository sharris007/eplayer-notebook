/* global $ */
import React, { PropTypes, Component } from 'react';

class Annotation extends Component {
  constructor(props) {
    super(props);   
    this.annotationEventHandler = this.annotationEventHandler.bind(this);
    this.annotationEvent = this.annotationEvent.bind(this);
    this.onDocumentClick=this.onDocumentClick.bind(this);
    $('#' + props.contentId).annotator().annotator('loadAnnotations', props.annotationData);
    $(document).on('mousedown', this.onDocumentClick);
  }

  onDocumentClick(e) {
    if (!$(e.target).closest('.annotator-editor').length && !$('.annotator-editor').hasClass('annotator-hide')) {
      $('#' + this.props.contentId).data('annotator').editor.hide();
    }
  }
  componentDidMount() { 
    this.annotationEventHandler();
    $('#' + this.props.contentId).annotator('shareAnnotations', this.props.shareableAnnotations);
  }

  componentWillReceiveProps(nextProps) {    
    $('#' + nextProps.contentId).annotator().annotator('loadAnnotations', nextProps.annotationData);
  }  

  annotationEventHandler() {
    const annotation = $('#' + this.props.contentId).annotator();
    annotation.data('annotator').on('beforeAnnotationCreated', this.annotationEvent.bind(null, 'beforeAnnotationCreated'));
    annotation.data('annotator').on('annotationCreated', this.annotationEvent.bind(null, 'annotationCreated'));
    annotation.data('annotator').on('beforeAnnotationUpdated', this.annotationEvent.bind(null, 'beforeAnnotationUpdated'));
    annotation.data('annotator').on('annotationUpdated', this.annotationEvent.bind(null, 'annotationUpdated'));
    annotation.data('annotator').on('annotationDeleted', this.annotationEvent.bind(null, 'annotationDeleted'));
    annotation.data('annotator').on('annotationEditorShown', this.annotationEvent.bind(null, 'annotationEditorShown'));
    annotation.data('annotator').on('annotationEditorHidden', this.annotationEvent.bind(null, 'annotationEditorHidden'));
    annotation.data('annotator').on('annotationEditorSubmit', this.annotationEvent.bind(null, 'annotationEditorSubmit'));
    annotation.data('annotator').on('annotationViewerShown', this.annotationEvent.bind(null, 'annotationViewerShown'));
    annotation.data('annotator').on('annotationViewerTextField', this.annotationEvent.bind(null, 'annotationViewerTextField'));
  }

  annotationEvent(eventType, data, viewer) {
    data.playOrder=this.props.currentPageDetails.playOrder;
    data.href=this.props.currentPageDetails.href;
    this.props.annotationEventHandler(eventType, data, viewer);
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
