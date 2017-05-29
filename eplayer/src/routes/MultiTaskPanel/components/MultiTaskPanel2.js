  /* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {resources , domain ,typeConstants} from '../../../../const/Settings';
import find from 'lodash/find';
import WidgetManager from '../../../components/widget-integration/widgetManager';
import { browserHistory } from 'react-router';
import { getTotalAnnCallService, getAnnCallService, postAnnCallService, putAnnCallService,deleteAnnCallService, getTotalAnnotationData, deleteAnnotationData, annStructureChange } from '../../../actions/annotation';
import { Annotation } from 'pxe-annotation';
import { Wrapper } from 'pxe-wrapper';
import { PopUpInfo } from '@pearson-incubator/popup-info';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import { PxePlayer } from 'pxe-player';


import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationFullscreen from 'material-ui/svg-icons/navigation/fullscreen';
import NavigationClose  from 'material-ui/svg-icons/navigation/close';

export class MultiTaskPanel extends Component {
  constructor(props) {
      super(props);
      this.state = {
      multipanelBootValues : props.bootValues
    }
  }
  onPageChange = (type, data) => {
      console.log(type, data);
  } 
  componentWillReceiveProps(newProps){
    console.log("componentWillReceiveProps called");
    const bval = (newProps.bootValues)?newProps.bootValues:this.state.multipanelBootValues;
      this.setState({
        multipanelBootValues:bval
      })
  }
  componentDidMount() {
    console.log("componentDidMount called");
      this.refs.iframe.getDOMNode().addEventListener('load', this.handleIframe);
      // $("#pxe-multipanel .book-container").css({'float': 'right','overflow-x': 'hidden','overflow-y': 'scroll','height': '535px','width':'100%','padding': '30px'});
  }
  componentWillMount(){
    console.log("componentWillMount called");
  }
  componentWillUnMount(){
    console.log("componentWillUnMount called  ")
  }
  onMultipanelPageChange = (type, data) => {
    switch(type){
      case 'continue':{
        if(data){
          this.setState({isPanelOpen:true},()=>{
              const pageDetails={...this.state.pageDetails};
              pageDetails.currentPageURL = data;
              pageDetails.applnCallback = function(){console.log('applnCallback');};
              const frameData = {
                  pageDetails,
                  urlParams:this.state.urlParams
              }
              this.setState({
                  multipanelData :frameData
              });
              $(".viewerContent").css({"float":"left",'width':'50%'});
              $("#book-container").css({'float': 'left','overflow-y': 'scroll','height': '600px'});
              $("#pxe-viewer").css({'width': '82.5%','margin-left': '55px'});
              $('.navigation').css({'width': '52%'});
          });
        }
        break;
      }
      case typeConstants.ANNOTATION_CREATED:{
         const annList = annStructureChange([data]);
         this.props.dispatch(getTotalAnnotationData(annList));
         break;
      }
      case typeConstants.ANNOTATION_UPDATED:{
        const annList=annStructureChange([data]);
        this.props.dispatch(deleteAnnotationData(data));
        this.props.dispatch(getTotalAnnotationData(annList));
        break;
      }
      case typeConstants.ANNOTATION_DELETED:{
        this.props.dispatch(deleteAnnotationData(data));
        break;
      }
      case 'pagescroll':
        $("#pageNum").val(data);
        break;
      default:{
        // other than continue
        // if(data){
        //   const parameters = this.props.urlParams;
        //   parameters.id    = data.id,
        //   parameters.uri   = encodeURIComponent(data.href),
        //   data.uri         = data.href;
        //   data.label       = data.title;
        //   this.setState({ 
        //     currentPageDetails :data,
        //     currentPageTitle   :data.title, 
        //     urlParams:parameters
        //   },function(){
        //     // eslint-disable-next-line
        //     // browserHistory.replace(`/eplayer/ETbook/${this.props.params.bookId}/page/${data.id}`);
        //     // setTimeout(()=>{
        //     //   this.props.dispatch(getBookmarkCallService(this.state.urlParams));
        //     //   // this.props.dispatch(getAnnCallService(this.state.urlParams));
        //     // },2000)
        //   });
        // }
        break;
      }
    }
  }
  componentDidUpdate(){
    console.log("componentDidUpdate called");
  }
  componentWillUpdate(){
    console.log("componentWillUpdate called");
  }
  handleClose = () =>{
    $("#multiport-panel").fadeOut(1000,function(){
      $(".viewerContent").removeAttr("style");
      $(".book-container").removeAttr("style");
      $("#pxe-viewer").removeAttr("style");
      $('.navigation').removeAttr("style");
      $(".printBlock").removeAttr("style");
    });
  }
  handleIframe = () =>{
    console.log("handleIframe called")
    const iframeContext = $(window.parent.document.getElementById("mtframe").contentWindow.document.body);
    iframeContext.find('.headerBar').remove();
    setTimeout(function(){
      debugger;
      iframeContext.find('.navigation').remove();
       iframeContext.find('.printBlock').remove();
      iframeContext.find('.viewerContent').css({
        'margin-top':'0px',
        'padding-top':'0px'
      });
      iframeContext.find('#pxe-viewer').css({
        'margin-left':'82px'
      });
      iframeContext.find('#book-container').css({
        'width' : '100%'
      });
    },2500)
    


  }
  render() {
     const iframeStyle = {
        float: 'right',
        height:'600px',
        position:'absolute',
        left:'87%',
        border: '1px solid #757575'
      }
       const iframeStyle2 = {
        float: 'right',
        height:'600px',
        left:'87%',
        border: '1px solid #757575'
      }
      const pageTitle = this.state.multipanelBootValues.pageDetails.currentPageURL.id;
      const pageURL = "http://localhost:3000/eplayer/ETbook/1QG0TM2LL33/page/"+pageTitle;
        return(                    
        <div id="multiport-panel" style={iframeStyle}>
        <AppBar
              title={this.state.multipanelBootValues.pageDetails.currentPageURL.title}
              titleStyle={{fontSize:'13px','lineHeight':'50px','height':'47px'}}
              style={{ width:'650px',backgroundColor:'#757575','z-index':0}}
              iconElementRight={<IconButton><NavigationClose /></IconButton>}
              iconElementLeft={<IconButton><NavigationFullscreen /></IconButton>}
              iconStyleLeft ={{'height':'47px','marginTop':'1px'}}
              iconStyleRight = {{'height':'47px','marginTop':'1px'}}
              zDepth={2}
              onRightIconButtonTouchTap = {this.handleClose}
            />
            {this.state.multipanelBootValues?<div>           
            <iframe id="mtframe" ref="iframe" style={iframeStyle2} src={pageURL} onLoad={this.handleIframe}></iframe>
          </div>:''}
          
      </div>
          
        ) 
     }
}
export default MultiTaskPanel;