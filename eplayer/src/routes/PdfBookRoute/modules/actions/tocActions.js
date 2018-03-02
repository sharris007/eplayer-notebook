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
import axios from 'axios';
import Hawk from 'hawk';
import find from 'lodash/find';
import { browserHistory } from 'react-router';
import { clients } from '../../../../components/common/client';
import { resources, domain } from '../../../../../const/Settings';
import { getmd5 } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';

const security = (resources.constants.secureApi === true ? 'eTSecureServiceUrl' : 'etextServiceUrl');
const etextService = resources.links[security];
const etextCourseService = resources.links['courseServiceUrl'];
const envType = domain.getEnvType();


/* Method for creating node in Toc. */
function Node() {
  this.id = '';
  this.title = '';
  this.children = [];
  this.urn = '';
}

function flatten3(input, finalChildlist) {
  let childlist = [];
  let finalChildList = finalChildlist;
  if (input.children !== undefined && input.children.length !== 0) {
    const firstNode = new Node();
    firstNode.id = input.id;
    firstNode.title = input.title;
    firstNode.urn = input.urn;
    childlist.push(firstNode);
    finalChildList = finalChildList.concat(input);
    input.children.forEach((node) => {
      const templist = flatten3(node, finalChildList);
      if (templist instanceof Array) {
        finalChildList = templist;
      } else {
        childlist = childlist.concat(templist);
      }
    });
    let j;
    for (let i = 0; i < finalChildList.length; i++) {
      if (input.id === finalChildList[i].id && input.urn === finalChildList[i].urn
          && input.title === finalChildList[i].title) {
        j = i;
        break;
      }
    }
    finalChildList[j].children = childlist;
  } else {
    const output = new Node();
    output.id = input.id;
    output.title = input.title;
    output.children = input.children;
    output.urn = input.urn;
    return output;
  }
  return finalChildList;
}

function flatten2(input, finalChildList) {
  if (input.children !== undefined && input.children.length !== 0) {
    return flatten3(input, finalChildList);
  }

  return input;
}

function flatten1(input) {
  let finalChildList = [];
  input.forEach((node) => {
    if (node.children.length !== 0) {
      const child1 = [];
      const firstNode = new Node();
      firstNode.id = node.id;
      firstNode.title = node.title;
      firstNode.urn = node.urn;
      child1.push(firstNode);
      finalChildList = finalChildList.concat(node);
      node.children.forEach((kids) => {
        const child = flatten2(kids, finalChildList);
        if (child instanceof Array) {
          finalChildList = child;
        } else {
          child1.push(child);
        }
      });
      let j;
      for (let i = 0; i < finalChildList.length; i++) {
        if (node.id === finalChildList[i].id && node.urn === finalChildList[i].urn
          && node.title === finalChildList[i].title) {
          j = i;
          break;
        }
      }
      finalChildList[j].children = child1;
    } else {
      finalChildList.push(node);
    }
  });
  return finalChildList;
}

/* Method for constructing tree for Toc. */
function constructTree(input) {
  const output = new Node();
  output.id = input.i;
  output.title = input.n;
  if (input.lv !== undefined) {
    output.urn = input.lv.pageorder;
  }
  if (input.be !== undefined) {
    if (input.be.length === undefined) {
      output.children.push(
            constructTree(input.be));
    } else {
      input.be.forEach((node) => {
        output.children.push(
               constructTree(node));
      });
    }
  }
  return output;
}

export function fetchToc(inputParams) {
  
  let bookId = inputParams.bookId;
  let authorName = inputParams.authorName;
  let title = inputParams.title;
  let thumbnail = inputParams.thumbnail;
  let bookeditionid = inputParams.bookeditionid;
  let sessionKey = inputParams.ssoKey;
  let bookServerURL = inputParams.serverDetails;
  let hastocflatten = inputParams.hastocflatten;
  let roleTypeID = inputParams.roletypeid;

  const bookState = {
    tocData: {
      content: {}
    }
  };
  return (dispatch,getState) => {
    // dispatch(request('toc'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    let serviceurl = `${bookServerURL}/ebook/pdfplayer/getbaskettocinfo?userroleid=${roleTypeID}&bookid=${bookId}&language=en_US&authkey=${sessionKey}&bookeditionid=${bookeditionid}&basket=toc`;
    // tempurl is starts with http to create hash key for matching with server
    let tempurl = serviceurl.replace("https","http");
    let hsid = getmd5(eT1Contants.MD5_SECRET_KEY+tempurl);
    return axios.get(`${serviceurl}&hsid=${hsid}`,
      {
        timeout: 100000
      })
    .then((response) => {
      if(getState().location.query.bookid === bookId){
          response.data.forEach((allBaskets) => {
        const basketData = allBaskets.basketsInfoTOList;
        bookState.tocData.content.id = basketData[0].bookID || '';
        bookState.tocData.content.mainTitle = title ;
        bookState.tocData.content.author = authorName ;
        bookState.tocData.content.thumbnail = thumbnail
        ||
        'http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/'
        + 'ebookCM21254346/assets/1256799653_Iannone_thumbnail.png';
        bookState.tocData.content.list = [];
        basketData.forEach((tocLevel1) => {
          const tocLevel1ChildData = tocLevel1.document;
          const tocLevel1ChildList = [];
          tocLevel1ChildData.forEach((tocLevel2) => {
            const tocLevel2ChildData = tocLevel2.bc.b.be;
            if(tocLevel2ChildData !== undefined)
            {
              if (tocLevel2ChildData.length === undefined) {
                const childList = constructTree(tocLevel2ChildData);
                tocLevel1ChildList.push(childList);
              } else {
                tocLevel2ChildData.forEach((tocLevel3) => {
                  const childList = constructTree(tocLevel3);
                  tocLevel1ChildList.push(childList);
                });
              }
            }
          });
          if (hastocflatten === 'Y' && tocLevel1ChildList.length !== 0) {
            bookState.tocData.content.list = flatten1(tocLevel1ChildList);
          } else {
            bookState.tocData.content.list = tocLevel1ChildList;
          }
        });
      });
      bookState.tocData.fetching = false;
      bookState.tocData.fetched = true;
      dispatch({ type: 'RECEIVE_TOC', bookState });
      }
    });
  };
}