
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { PageViewer } from '@pearson-incubator/pxe-pageviewer';
import { Annotation } from 'pxe-annotation';
import { Wrapper } from 'pxe-wrapper';
import { PopUpInfo } from '@pearson-incubator/popup-info';

import { customAttributes, playerConstants } from './constants';

class PxePlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      urlParams: this.props.bootstrapParams.urlParams,
      currentPageDetails: {},
      annAttributes: customAttributes, // import from Mocdata
      popUpCollection: [],
      annotationData: {
        rows: [],
        total: 0
      }
    };
  }
  onPageChange = (type, data) => {
    switch (type) {
    case 'pagescroll':
      this.props.applnCallback(type, data);
      break;
    default:
      const parameters = this.state.urlParams;
      parameters.id = data.id;
      parameters.uri = encodeURIComponent(data.href);
      data.uri = data.href;
      data.label = data.title;
      this.setState({
        currentPageDetails: data,
        urlParams: parameters
      }, () => {
        if (this.props.applnCallback) {
          // eslint-disable-next-line
          // this.props.dispatch(getAnnCallService(this.state.urlParams)); // Enable when Annotation component added
          this.props.applnCallback(type, data);
        }
      });
    }
    
  };
  annotationCallDispatch = (method, data) => {
    const { pageDetails } = this.props.bootstrapParams;
    const payload = { // eslint-disable-line no-undef
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Identity-Id': this.state.urlParams.user
      }
    };
    if (data) {
      payload.body = JSON.stringify(data);
    }
    // for post url
    let requestUrl = `${pageDetails.endPoints.services}/context/${this.state.urlParams.context}/annotations`;
    switch (method) {
    case 'GET': {
      requestUrl += `?uri=${this.state.urlParams.uri}`;
      break;
    }
    case 'PUT':
    case 'DELETE':
      {
        requestUrl += `/${data.id}`;
        break;
      }
    }
    return fetch(requestUrl, payload)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      }).then(res =>
        // console.log(res);
         res).catch((error) => {
           console.log(`There has been a problem with your fetch operation: ${error.message}`);
           return false;
         });
  };
  onBookLoaded = (isBookLoaded) => {
    if (isBookLoaded) {
      const that = this;
      window.renderPopUp = function (collection) {
        that.setState({ popUpCollection: collection });
      };
      this.setState({ popUpCollection: [] });
      this.wrapper = new Wrapper({ divGlossaryRef: this.divGlossaryRef, bookDiv: 'book-container' }); // import Wrapper
      this.wrapper.bindPopUpCallBacks();
      // this.getAnnotationData();
      this.annotationCallDispatch('GET').then((res) => {
        if (res) {
          const annotationData = { ...res };
          const instrAnnotations=[];
          const studAnnotations=[];
          for (let _i=0; _i < annotationData.rows.length; _i++) {
            if (annotationData.rows[_i].shareable) {
              instrAnnotations.push(annotationData.rows[_i]);
            }
          else {
              studAnnotations.push(annotationData.rows[_i]);
            }
          }
          annotationData.rows=studAnnotations.concat(instrAnnotations);
          this.setState({ annotationData }); 
        }
      });
    }
  };

  annotationCallBack = (eventType, data) => {
    const receivedAnnotationData = data;
    receivedAnnotationData.user = this.state.urlParams.user;
    receivedAnnotationData.context = this.state.urlParams.context;
    receivedAnnotationData.source = this.state.currentPageDetails;
    receivedAnnotationData.source.baseUrl = this.props.bootstrapParams.pageDetails.baseUrl;
      // delete receivedAnnotationData.source.href;
      // delete receivedAnnotationData.source.title;
    switch (eventType) {
    case 'annotationCreated': {
      // this.createAnnotation(receivedAnnotationData).then((newAnnotation)=>{
      //   const annotationData={...this.state.annotationData};
      //   annotationData.total=annotationData.total+1;
      //   annotationData.rows.push(newAnnotation);
      //   this.setState({annotationData:annotationData});
      // });
      this.annotationCallDispatch('POST', receivedAnnotationData).then((newAnnotation) => {
        const annotationData = { ...this.state.annotationData };
        annotationData.total += 1;
        annotationData.rows.push(newAnnotation);
        this.setState({ annotationData }, () => {
            // Making empty so that Annotation component loads with new annotation created and duplicates the existing one.
          this.setState({ annotationData: {
            rows: [],
            total: 0
          } });
        });
        this.props.applnCallback(playerConstants.ANNOTATION_CREATED, newAnnotation);
      });
      break;
    }
    case 'annotationUpdated': {
      // this.updateAnnotation(receivedAnnotationData);
      this.annotationCallDispatch('PUT', receivedAnnotationData).then((updatedAnnotation) => {
        this.props.applnCallback(playerConstants.ANNOTATION_UPDATED, updatedAnnotation);
      });
      break;
    }
    case 'annotationDeleted': {
      // receivedAnnotationData.annId    = data.id;
      // this.deleteAnnotation(receivedAnnotationData);
      this.annotationCallDispatch('DELETE', receivedAnnotationData).then((deletedAnnotation) => {
        this.props.applnCallback(playerConstants.ANNOTATION_DELETED, deletedAnnotation);
      });
      break;
    }
    default : {
      return eventType;
    }
    }
  }
  render() {
    const { bootstrapParams } = this.props;
    const { annotationData } = this.state;
    return (<div>
      <PageViewer src={bootstrapParams.pageDetails} sendPageDetails={this.onPageChange} onBookLoaded={bload => this.onBookLoaded(bload)} applnCallback={this.props.applnCallback} />
      {this.state.popUpCollection.length > 0 ? <PopUpInfo popUpCollection={this.state.popUpCollection} bookId="book-container" /> : ''}
      <div id="divGlossary" ref={(dom) => { this.divGlossaryRef = dom; }} style={{ display: 'none' }} />
      <Annotation
        annAttributes={this.state.annAttributes} shareableAnnotations={bootstrapParams.pageDetails.annotationShareable} annotationData={annotationData.rows} contentId={bootstrapParams.pageDetails.contentId}
        annotationEventHandler={this.annotationCallBack}
            />
    </div>);
  }
}

PxePlayer.PropTypes = {
  bootstrapParams: PropTypes.object.isRequired
};
export default PxePlayer;
