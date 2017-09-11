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
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import WidgetFactory from './widgetFactory';
import Widget from './widgets/component/widget';


export default class WidgetManager {
  static loadComponents(nodesArr, context) {
    window.setTimeout(() => {
      const widgetFactory = new WidgetFactory();
      const figures = document.getElementsByTagName('figure');

      if (figures.length) {
        for (let i = 0; i < figures.length; i += 1) {
          const figure = figures[i];
          const componentElement = figure.getElementsByClassName('pearson-component')[0];
          const container = document.createElement('div');
          let wrapper;
          if (componentElement) {
            const type = componentElement.getAttribute('data-type');
            const typeArray = ['audio', 'video', 'image', 'flashcards',
              'vid slideshow', 'timeline', 'img slideshow', 'tinyquiz',
              'ImageIdentifier', 'mcq', 'mti', 'uca', 'tia'];
            const noPreviewComponents = ['flashcards', 'timeline'];
            if (typeArray.includes(type)) {
              nodesArr.push(componentElement);
              const widgetData = widgetFactory.getData(figure);
              if (widgetData) {
                widgetData.muiTheme = context.muiTheme;
                widgetData.store = context.store;
                if (noPreviewComponents.includes(type)) {
                  componentElement.appendChild(container);
                  wrapper = container;
                  widgetData.node = componentElement;
                } else {
                  wrapper = componentElement;
                }
                ReactDOM.render(
                  <MuiThemeProvider muiTheme={context.muiTheme}>
                    <Widget data={widgetData} muiTheme={context.muiTheme} store={context.store} />
                  </MuiThemeProvider>, wrapper);
              }
            }
          }
        }
      }
    });
  }

  static navChanged(nodesArr) {
    nodesArr.forEach((node) => {
      ReactDOM.unmountComponentAtNode(node);
    });
  }

}
