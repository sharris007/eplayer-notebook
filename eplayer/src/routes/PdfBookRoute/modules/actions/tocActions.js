import axios from 'axios';
import { getmd5 } from '../../../../components/Utility/Util';
import { eT1Contants } from '../../../../components/common/et1constants';

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
    if(input.urn){
      const firstNode = new Node();
      firstNode.id = input.id;
      firstNode.title = input.title;
      firstNode.urn = input.urn;
      childlist.push(firstNode);
    }
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
      if(node.urn){
        const firstNode = new Node();
        firstNode.id = node.id;
        firstNode.title = node.title;
        firstNode.urn = node.urn;
        child1.push(firstNode);
      }
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
  if(input.lv && (input.lv.t === eT1Contants.LinkType.FLV || input.lv.t === eT1Contants.LinkType.SWF 
        || input.lv.t === eT1Contants.LinkType.JAZZASSET || input.lv.t === eT1Contants.LinkType.IPADAPP)){
      return undefined;
    }else{
        const output = new Node();
        if(input.basketTypeID){
          output.basketTypeID = input.basketTypeID;
        }
        output.id = input.i;
        output.title = input.n;
        if (input.lv) {
          if(input.lv.pageorder){
            output.urn = {pageorder : input.lv.pageorder, linkTypeID : input.lv.t};
          }else{
            output.urn = {linkValue : input.lv.content, linkTypeID : input.lv.t, regionTypeID : input.t, name : input.n}
          }
        }
        if (input.be) {
          if (input.be.length === undefined) {
            let childNode = constructTree(input.be);
            childNode && output.children.push(childNode);
          } else {
            input.be.forEach((node) => {
            let childNode = constructTree(node);
            childNode && output.children.push(childNode);
            });
          }
        }
        if(!output.urn.linkTypeID && !output.children.length){
          return undefined;
        }else{
          return output;
        }
    }
}

export function fetchToc(inputParams) {
  const bookId = inputParams.bookId;
  const authorName = inputParams.authorName;
  const title = inputParams.title;
  const thumbnail = inputParams.thumbnail;
  const bookeditionid = inputParams.bookeditionid;
  const sessionKey = inputParams.ssoKey;
  const bookServerURL = inputParams.serverDetails;
  const hastocflatten = inputParams.hastocflatten;
  const roleTypeID = inputParams.roletypeid;

  const bookState = {
    tocData: {
      content: {}
    }
  };
  return (dispatch, getState) => {
    // dispatch(request('toc'));
    // Here axios is getting base url from client.js file and append with rest url and frame. This is similar for all the action creators in this file.
    const serviceurl = `${bookServerURL}/ebook/pdfplayer/getbaskettocinfo?userroleid=${roleTypeID}&bookid=${bookId}` +
    `&language=en_US&authkey=${sessionKey}&bookeditionid=${bookeditionid}&basket=all`;
    // tempurl is starts with http to create hash key for matching with server
    const tempurl = serviceurl.replace('https', 'http');
    const hsid = getmd5(eT1Contants.MD5_SECRET_KEY + tempurl);
    return axios.get(`${serviceurl}&hsid=${hsid}`,
      {
        timeout: 100000
      })
    .then((response) => {
      if (getState().location.query.bookid === bookId) {
        response.data.forEach((allBaskets) => {
          const basketData = allBaskets.basketsInfoTOList;
          bookState.tocData.content.id = basketData[0].bookID || '';
          bookState.tocData.content.mainTitle = title;
          bookState.tocData.content.author = authorName;
          bookState.tocData.content.thumbnail = thumbnail
        ||
        'http://view.cert1.ebookplus.pearsoncmg.com/ebookassets/'
        + 'ebookCM21254346/assets/1256799653_Iannone_thumbnail.png';
          bookState.tocData.content.list = [];
          let tocLevel1ChildList = [];
          basketData.forEach((tocLevel1) => {
            const tocLevel1ChildData = tocLevel1.document;
            tocLevel1ChildData.forEach((tocLevel2) => {
              let tocLevel2ChildData = {};
              if(tocLevel1.basketTypeID == eT1Contants.basketType.TOC){
                 tocLevel2ChildData = tocLevel2.bc.b.be;
              }else{
                if(tocLevel1.basketTypeID != eT1Contants.basketType.GLOSSARY){
                    tocLevel2ChildData = tocLevel2.bc.b;
                    tocLevel2ChildData.basketTypeID = tocLevel1.basketTypeID;
                }
              }
              if (tocLevel2ChildData !== undefined) {
                if (tocLevel2ChildData.length === undefined) {
                  const childList = constructTree(tocLevel2ChildData);
                  childList && tocLevel1ChildList.push(childList);
                } else {
                  tocLevel2ChildData.forEach((tocLevel3) => {
                    const childList = constructTree(tocLevel3);
                    childList && tocLevel1ChildList.push(childList);
                  });
                }
              }
            });
          });
              if(hastocflatten === 'Y' && tocLevel1ChildList.length !== 0){
                    tocLevel1ChildList = flatten1(tocLevel1ChildList);
                  for(let i=0 ; i<tocLevel1ChildList.length ; i++){
                       if(!tocLevel1ChildList[i].basketTypeID && !tocLevel1ChildList[i].urn){
                          tocLevel1ChildList[i].urn = {};
                       }
                    }
              }
              bookState.tocData.content.list = tocLevel1ChildList;
        });
        bookState.tocData.fetching = false;
        bookState.tocData.fetched = true;
        dispatch({ type: 'RECEIVE_TOC', bookState });
      }
    });
  };
}

export default fetchToc;
