
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { PageViewer } from '@pearson-incubator/pxe-pageviewer';
import { Annotation } from 'pxe-annotation';
import { Wrapper } from 'pxe-wrapper';
import { PopUpInfo } from '@pearson-incubator/popup-info';

import {apiConstants, customAttributes} from './constants';

class PxePlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      urlParams:this.props.bootstrapParams.urlParams,
      currentPageDetails:{},
      annAttributes:customAttributes, // import from Mocdata
      popUpCollection:[],
      annotationData:{}
    };
  }
  onPageChange = (type, data) => {
    const parameters = this.state.urlParams;
    parameters.id    = data.id;
    parameters.uri   = encodeURIComponent(data.href);
    data.uri         = data.href;
    data.label       = data.title;
    this.setState({
      currentPageDetails :data,  
      urlParams:parameters
    }, function() {
      if (this.props.applnCallback) {
      // eslint-disable-next-line
      // this.props.dispatch(getAnnCallService(this.state.urlParams)); // Enable when Annotation component added
        this.props.applnCallback(type, data);
      }
    });
  };
  annotationCallDispatch = (method, data) => {
    const payload={ // eslint-disable-line no-undef
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Identity-Id':this.state.urlParams.user
      }
    };
    if (data) {
      payload.body=JSON.stringify(data);
    }
    //for post url
    let requestUrl=`${apiConstants.PXESERVICE}/context/${this.state.urlParams.context}/annotations`;
    switch (method) {
    case 'GET': {
      requestUrl=requestUrl+`?uri=${this.state.urlParams.uri}`;
      break;
    }
    case 'PUT': 
    case 'DELETE':
      {
        requestUrl=requestUrl+`/${data.id}`;
        break;
      }
    }
    return fetch(requestUrl, payload)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      }).then((res) => { 
        // console.log(res);
        // return res;
        if (method!=='GET') {
          this.annotationCallDispatch('GET');
        }else if (method==='GET') {
          let annotationData=this.state.annotationData;
          annotationData=res;
          this.setState({annotationData:annotationData});
        }
        this.forceUpdate();
      }).catch((error) => {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        return false;
      });
  };
  /*getAnnotationData = () => {
    return fetch(`${apiConstants.PXESERVICE}/context/${this.state.urlParams.context}/annotations?uri=${this.state.urlParams.uri}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Identity-Id':this.state.urlParams.user
        }
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      }).then((res) => { 
        console.log(res);
        // return res;
        const annotationData={...res};
        this.setState({annotationData:annotationData});
      }).catch((error) => {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        return false;
      });
  };*/
  onBookLoaded = (isBookLoaded) => {
    if (isBookLoaded) {
      const that = this;  
      window.renderPopUp = function(collection) {
        that.setState({ popUpCollection : collection });
      };
      this.setState({ popUpCollection : [] });
      this.wrapper = new Wrapper({'divGlossaryRef' : this.divGlossaryRef, 'bookDiv' : 'book-container'}); // import Wrapper
      this.wrapper.bindPopUpCallBacks();
      // this.props.applnCallback(type, data);
      // setTimeout(()=>{
      //   this.props.dispatch(getAnnCallService(this.state.urlParams)); // Enable when Annotation component added
      // },0);
      // this.getAnnotationData().then((responseAnnotaionData)=>{
      //   const annotationData={...responseAnnotaionData};
      //   this.setState({annotationData:annotationData});
      // });
      //this.getAnnotationData();
      this.annotationCallDispatch('GET');
    }
  };
  /*createAnnotation = (data) => {
    return fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations`, 
      { // eslint-disable-line no-undef
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Identity-Id':data.user
        },
        body: JSON.stringify(data)
      }).then(function(response) {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      }).then(function(res) { 
                    // console.log(res);
        return res;
      }).catch(function(error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        return false;
      });
  };*/
  /*updateAnnotation = (data) => {
    return fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations/${data.id}`, {// eslint-disable-line no-undef
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Identity-Id':data.user
      },
      body: JSON.stringify(data)
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(res) { 
                    // console.log(res);
      return res;
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      return false;
    });
  };*/
  /*deleteAnnotation = (data) => {
    return fetch(`${apiConstants.PXESERVICE}/context/${data.context}/annotations/${data.id}`, {// eslint-disable-line no-undef
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Identity-Id':data.user
      }
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(res) { 
                    // console.log(res);
      return res;
    }).catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
      return false;
    });
  };*/
  annotationCallBack = (eventType, data) => {
    const receivedAnnotationData    = data;
    receivedAnnotationData.user     = 'epluser';
    receivedAnnotationData.context  = this.state.urlParams.context;
    receivedAnnotationData.source   = this.state.currentPageDetails;
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
      this.annotationCallDispatch('POST', receivedAnnotationData);
      break;
    }
    case 'annotationUpdated': {
      // this.updateAnnotation(receivedAnnotationData).then((updatedAnnotation)=>{
      //   const annotationData={...this.state.annotationData};
      //   for (let i=0;i<annotationData.rows.length;i++) {
      //     let dest=annotationData.rows[i];
      //     if (dest.id===updatedAnnotation.id) {
      //       dest=Object.assign(dest, updatedAnnotation);
      //     }
      //   }
      //   this.setState({annotationData:annotationData});
      // });
      this.annotationCallDispatch('PUT', receivedAnnotationData);
      break;
    }
    case 'annotationDeleted': {
      // receivedAnnotationData.annId    = data.id;
      // this.deleteAnnotation(receivedAnnotationData).then((deletedAnnotation)=>{
      //   const annotationData={...this.state.annotationData};
      //   for (let i=0;i<annotationData.rows.length;i++) {
      //     const dest=annotationData.rows[i];
      //     if (dest.id===deletedAnnotation.id) {
      //       annotationData.splice(i, 1);
      //     }
      //   }
      //   this.setState({annotationData:annotationData});
      // });
      this.annotationCallDispatch('DELETE', receivedAnnotationData);
      break;
    }
    default : {
      return eventType;
    }
    }
  }
  render() {
    const {bootstrapParams} = this.props;
    const {annotationData}=this.state;
    return(<div>
            <PageViewer src={bootstrapParams.pageDetails} sendPageDetails={this.onPageChange} onBookLoaded = {(bload) => this.onBookLoaded(bload)} applnCallback={this.props.applnCallback}/>    
            {this.state.popUpCollection.length > 0 ? <PopUpInfo popUpCollection = {this.state.popUpCollection} bookId = "book-container"/> : ''}
            <div id= "divGlossary" ref = {(dom) => { this.divGlossaryRef = dom; }} style = {{ display: 'none' }}>  </div>
            <Annotation annAttributes = {this.state.annAttributes} shareableAnnotations={bootstrapParams.pageDetails.annotationShareable} annotationData={annotationData.rows} contentId="pxe-viewer"
            annotationEventHandler={this.annotationCallBack} />
          </div>);
  }
};

PxePlayer.PropTypes = {
  bootstrapParams:PropTypes.object.isRequired
};
export default PxePlayer;
