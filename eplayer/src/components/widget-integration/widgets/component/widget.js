/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/
import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import { FlashCards } from '@pearson-incubator/aquila-js-flashcards';
import { AudioPlayer, VideoPlayerPreview, ImageViewerPreview,
        VideoPlayerSlideShow, ImageSlideshowPreview, UCAPreview } from '@pearson-incubator/aquila-js-core';
import { AquilaTimelinePreview } from '@pearson-incubator/aquila-js-timeline';
// import { TinyQuizModal, QuizPreview } from '@pearson-incubator/aquila-js-quiz';
import errorCard from '../../../common/errorCard';
import { injectReducer } from '../../../../store/reducers';
import widgetActions from '../modules/widgetActions';
import reducer from '../modules/widgetReducer';
import Utils from '../../utils';


const mapDispatchToProps = {
  fetch: widgetActions.fetch
};

const mapStateToProps = state => ({
  widget: (state.widget ? state.widget : {})
});

class Widget extends React.Component {
  componentWillMount() {
    if (this.props.data.type !== 'audio' && this.props.data.type !== 'video' && this.props.data.type !== 'image') {
      injectReducer(this.props.store, { key: 'widget', reducer });
      this.props.fetch(this.props.data.src, this.props.data.actionType);
    }
  }
  renderComponent(data) {
    let component = 'This is widget component';
    switch (this.props.data.type) {
      case 'audio':
        component = <AudioPlayer url={data.source} title={data.title} />;
        break;
      case 'video':
        component = <VideoPlayerPreview data={this.props.data} />;
        break;
      case 'image':
        component = <ImageViewerPreview data={this.props.data} />;
        break;
      case 'flashcards': {
        const parsedflashData = Utils.parseFlashcardData(data.flashcards);
        if (parsedflashData !== undefined && parsedflashData.title !== undefined) {
          component = <FlashCards content={parsedflashData} key={parsedflashData.id} node={this.props.data.node} />;
        }
        break;
      }
      case 'vid slideshow': {
        const parsedVideoData = Utils.parseVideoSlideShowData(data.videos);
        if (parsedVideoData !== undefined && parsedVideoData.title !== undefined) {
          component = <VideoPlayerSlideShow data={parsedVideoData} />;
        }
        break;
      }
      case 'img slideshow': {
        const parsedImageData = Utils.parseVideoSlideShowData(data.images);
        if (parsedImageData !== undefined && parsedImageData.title !== undefined) {
          component = <ImageSlideshowPreview data={parsedImageData} />;
        }
        break;
      }
      case 'timeline': {
        const parsedtimeData = Utils.parseTimelineData(data.timeline);
        if (parsedtimeData !== undefined && parsedtimeData.title !== undefined) {
          component = <AquilaTimelinePreview action="Explore the timeline" data={parsedtimeData} node={this.props.data.node} />;// eslint-disable-line max-len
        }
        break;
      }
      case 'tinyquiz': {
        // const parsedtinyquizData = Utils.parseTinyQuizData(data.tinyquiz);
        // if (parsedtinyquizData !== undefined && parsedtinyquizData.title !== undefined) {
        //   component = <TinyQuizModal data={parsedtinyquizData} />;
        // }
        break;
      }
      case 'ImageIdentifier': {
        const parsedImageIdentifierData = Utils.parseImageIdentifierData(data.imageIdentifier);
        if (parsedImageIdentifierData !== undefined && parsedImageIdentifierData.title !== undefined) {
          // if (parsedImageIdentifierData && parsedImageIdentifierData.type &&
          //   parsedImageIdentifierData.type.length > 0 && parsedImageIdentifierData.type[0] === 'quiz') {
          //   component = (<QuizPreview content={parsedImageIdentifierData.content} type={'ImageIdentifier'} />);
          // } else {
          //   component = (<QuizPreview
          //     content={[parsedImageIdentifierData]}
          //     type={'ImageIdentifier'} title={'Identify the Images'}
          //   />);
          // }
        }
        break;
      }
      case 'mcq': {
        const parsedMCQData = Utils.parseMCQData(data.mcq);
        if (parsedMCQData !== undefined && parsedMCQData.title !== undefined) {
          // if (parsedMCQData && parsedMCQData.type &&
          //   parsedMCQData.type.length > 0 && parsedMCQData.type[0] === 'quiz') {
          //   component = (<QuizPreview content={parsedMCQData.content} type={'MCQ'} />);
          // } else {
          //   component = (<QuizPreview content={[parsedMCQData]} type={'MCQ'} title={'RAPID PRACTICE'} />);
          // }
        }
        break;
      }
      case 'mti': {
        // const parsedMTIData = Utils.parseMTIData(data.mti);
        // if (parsedMTIData !== undefined && parsedMTIData.title !== undefined) {
        //   component = <QuizPreview content={parsedMTIData} type={'MatchGame'} />;
        // }
        break;
      }
      case 'uca': {
        const parsedUCAData = Utils.parseUCAData(data.uca);
        if (parsedUCAData !== undefined && parsedUCAData.title !== undefined) {
          component = <UCAPreview data={parsedUCAData} />;
        }
        break;
      }
      case 'tia': {
        // const parsedTIAData = Utils.parseMTIData(data.tia);
        // if (parsedTIAData !== undefined && parsedTIAData.title !== undefined) {
        //   component = <QuizPreview content={parsedTIAData} type={'TextInput'} title={'Type In Answer'} />;
        // }
        break;
      }
      default:
        component = null;
        break;
    }
    return component;
  }

  render() {
    if (this.props.data.type === 'audio' || this.props.data.type === 'video' || this.props.data.type === 'image') {
      return (<div className="main" > { this.renderComponent(this.props.data) } </div>);
    }
    const { fetched, fetching, error } = this.props.widget;
    if (fetching) {
      return (<CircularProgress
        style={{ margin: '40px auto', display: 'block' }}
      />);
    } else if (error) {
      return errorCard('Error', error.message);
    }

    return (
        fetched ?
          <div className="main" > {
          this.renderComponent(this.props.widget)
        } </div> : null
    );
  }
}

Widget.propTypes = {
  widget: React.PropTypes.object.isRequired,
  data: React.PropTypes.object.isRequired,
  store: React.PropTypes.object.isRequired,
  fetch: React.PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Widget);
