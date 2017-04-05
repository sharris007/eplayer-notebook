import '../scss/pageviewer.scss';
import React        from 'react';
import ReactDOM     from 'react-dom';
import replaceAllRelByAbs from './ConstructUrls';
const _CONTAINER_ID = Symbol('container_id');

/**
 * @class PopoutWindow
 */
export default class PopoutWindow extends React.Component {

  /**
   * @type {{title: *, url: *, onClosing: *, options: *, window: *, containerId: *}}
   */
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string,
    onClosing: React.PropTypes.func,
    options: React.PropTypes.object,
    window: React.PropTypes.object,
    containerId: React.PropTypes.string,
    children: React.PropTypes.element
  };

  state = {
    openedWindow: null
  };

  defaultOptions = {
    toolbar: 'no',
    location: 'no',
    directories: 'no',
    status: 'no',
    menubar: 'no',
    scrollbars: 'yes',
    resizable: 'yes',
    width: 500,
    height: 600,
    //top: (o, w) => ((w.innerHeight - o.height) / 2) + w.screenY,
    left: (o, w) => ((w.innerWidth - o.width) / 2) + w.screenX
  };

  /**
   * @constructs PoppoutWindow
   * @param props
   */
  constructor(props) {
    super(props);
    this[_CONTAINER_ID] = props.containerId || 'popout-content-container';
    this.closeWindow = this.closeWindow.bind(this);
  }

  /**
   * Override default id if we get given one
   * @param props
   */
  componentWillReceiveProps = (props) => {
    props.containerId && (this[_CONTAINER_ID] = props.containerId);
  }

  componentWillUnmount = () => {
    this.closeWindow();
  }

  isChrome = () => {
    const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;    
    const isChrome = !!window.chrome && !isOpera;
    return isChrome;    
  }
  isMozilla = () => {
    if ((navigator.userAgent.toLowerCase().indexOf('firefox') > -1) && (navigator.appName === 'Netscape')) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount = () => {
    let popoutWindow;
    let container;

    const options      = Object.assign({}, this.defaultOptions, this.props.options);
    const ownerWindow  = this.props.window || window;
    const openedWindow = {
      update(newComponent) {
        ReactDOM.render(newComponent, container);
      },
      close() {
        popoutWindow && popoutWindow.close();
      }
    };

    if (!ownerWindow) {
      // If we have no owner windows, bail. Likely server side render
      return;
    }

    const createOptions = () => {
      const ret = [];
      for (const key in options) {
        options.hasOwnProperty(key) && ret.push(key + '=' + (
            typeof options[key] === 'function' ?
              options[key].call(this, options, ownerWindow) :
              options[key]
          )
        );
      }
      return ret.join(',');
    };

    popoutWindow = ownerWindow.open(this.props.url || 'about:blank', this.props.title, createOptions());

    popoutWindow.onbeforeunload = () => {
      container && ReactDOM.unmountComponentAtNode(container);
      this.windowClosing();
    };
    // Close any open popouts when page unloads/refeshes
    ownerWindow.addEventListener('unload', this.closeWindow);

    const onloadHandler = () => {
      if (container) {
        if (popoutWindow.document.getElementById(this[_CONTAINER_ID])) { return; }

        ReactDOM.unmountComponentAtNode(container);
        container = null;
      }

      popoutWindow.document.title = this.props.title;
      container = popoutWindow.document.createElement('div');
      container.id = this[_CONTAINER_ID];
      //popoutWindow.history.pushState({}, null, "https://google.com");
      popoutWindow.document.body.appendChild(container);

      const getHeadTag = popoutWindow.document.getElementsByTagName('head');

      $(getHeadTag).append('<style>@media print{thead{display:table-header-group;}tfoot{display:table-footer-group;}tbody{display:table-row-group;}#watermark {display:block;color: #d0d0d0; font-size: 65pt;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;xmargin: 0;z-index: 100;opacity: 0.6;left: 35%;top:30%;text-align: center;}#divHeader {display:block;color: green;font-size: 15pt; position: fixed;xmargin: 0;z-index: 100;left: 0%;top:0%;}#divFooter {display:block;color: green;font-size: 15pt; position: fixed; xmargin: 0;z-index: 100;left: 0%;top:97%;} iframe-table{border:none !important;}} @media screen{thead{display:none;}tfoot{display:none;}tbody{display:table-row-group;}#watermark {display:none;color: #d0d0d0;font-size: 90pt;-webkit-transform: rotate(-45deg); -moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;margin: 0;z-index: 100; opacity: 0.6;left: 6%;top:5%;text-align: center;}#divHeader {display:block;color: green;font-size: 15pt; position: fixed;xmargin: 0;z-index: 100;left: 0%;top:3%;}#divFooter {display:block;color: green;font-size: 15pt; position: fixed; xmargin: 0;z-index: 100;left: 0%;top:3%;}.iframe-table{border:none !important;}} </style>');
      const getPrintBtn = function() {
        const getPrintBtnEle = popoutWindow.document.getElementById('printId');
        return getPrintBtnEle;  
      };

      const beforePrint = function() {
        const printBtn = getPrintBtn();
        $(printBtn).hide();
        /*const iframes = popoutWindow.document.getElementsByTagName('iframe');
        for ( let i=0; i<iframes.length; i++ ) {        
          const _tempIframeid = iframes[i].id;      
          const iframeMain = popoutWindow.document.getElementById(_tempIframeid);     
          const innerDoc = iframeMain.contentDocument || iframeMain.contentWindow.document; 
          const tempNPTag = innerDoc.getElementsByTagName('iframe');        
          replacenonprintcontent('iframe', tempNPTag);  
          const tempNPVideoTag = innerDoc.getElementsByTagName('video');                
          replacenonprintcontent('video', tempNPVideoTag);
          const tempNPAudioTag = innerDoc.getElementsByTagName('audio');                
          replacenonprintcontent('audio', tempNPAudioTag);
        } */    
      };
      
      const afterPrint = function() {
        const printBtn = getPrintBtn();
        $(printBtn).show();
        /*const iframes = popoutWindow.document.getElementsByTagName('iframe');   
        for(let i=0; i<iframes.length; i++) {       
          const _tempIframeid = iframes[i].id;
          const iframeMain = popoutWindow.document.getElementById(_tempIframeid);       
          const innerDoc = iframeMain.contentDocument || iframeMain.contentWindow.document;     
          const removetempNPTags = innerDoc.getElementsByClassName('nonprintimage');
          const backupremovetempNPTags = removetempNPTags;
          const _tempnptaglen = Number(removetempNPTags.length);
          for (let k= (_tempnptaglen - 1);k >= 0;k--) {
            backupremovetempNPTags[k].parentNode.removeChild(removetempNPTags[k]);        
          }     
          const tempNPTag = innerDoc.getElementsByTagName('iframe');
          for (let j=0;j<tempNPTag.length;j++) {      
            tempNPTag[j].style.display = 'block';       
          }
          const tempNPVideoTag = innerDoc.getElementsByTagName('video');
          for (let j=0;j<tempNPVideoTag.length;j++) {     
            tempNPVideoTag[j].style.display = 'block';        
          }
          const tempNPAudioTag = innerDoc.getElementsByTagName('audio');
          for (let j=0;j<tempNPAudioTag.length;j++) {     
            tempNPAudioTag[j].style.display = 'block';        
          }
        }*/
      };

      if (popoutWindow.matchMedia) {
        const mediaQueryList = popoutWindow.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
            beforePrint();
          } else {
            afterPrint();
          }
        });
      }

      const url = this.props.baseUrl+this.props.printUrl;
      console.log('url' , url);
      const getPageResponce = new Request(url, {
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
      fetch(getPageResponce, {
        method: 'get'
      }).then((response) => {
        return response.text();
      }).then((text) => {
        let data = replaceAllRelByAbs(text, this.props.baseUrl+this.props.printUrl.substring(0, this.props.printUrl.lastIndexOf('/')));

        const iframe = document.createElement('iframe');
        iframe.id='printFrame';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.scrolling= 'no'; 
        iframe.style.border='0';
        data = data.replace('</head>', '<style>.contentPlaceholder{background-color:#efefef;border-width: 1px;border-color: #999999;font-size: 15pt;color:#b3b3b3;text-align: center;display: table-cell;vertical-align: middle;}@media print{#pagelogo{display:block;}.iframe-table{border:none !important;}#watermark {display:block;color: #d0d0d0;font-size: 75pt;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;xmargin: 0;z-index: 100;opacity: 0.6;left: 46%;top:25%;text-align: center;}thead{display:table-header-group;text-align:left;}tfoot{display:table-footer-group;text-align:left;}tbody{display:table-row-group;}}@media screen{#pagelogo{display:none;}.iframe-table{border:none !important;}thead{}tfoot{display:none;}#watermark {display:none;color: #d0d0d0;font-size: 75pt;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;margin: 0;z-index: 100;opacity: 0.6;left: 6%;top:25%;text-align: center;}} </style>');
        popoutWindow.document.getElementById('popout-content-container').appendChild(iframe);
        const iframeObj=popoutWindow.document.getElementById(iframe.id);
        const iframeDoc=iframeObj.contentDocument;
        iframeDoc.open();
        iframeDoc.write(data);
        iframeDoc.close();
        
        // function headerContent() {
        //   const contentTitle = iframeObj.contentWindow.document.title;
        //   return contentTitle;
        // }
        // function footerContent() {
        //   const monthNames = [
        //     'January', 'February', 'March',
        //     'April', 'May', 'June', 'July',
        //     'August', 'September', 'October',
        //     'November', 'December'
        //   ];

        //   const date = new Date();
        //   const time = formatAMPM(date);
        //   const day= date.getDate();
        //   const monthIndex = date.getMonth();
        //   const year = date.getFullYear();
        //   const todayDate = monthNames[monthIndex] +' '+day+', '+year+' '+time;
        //   return '&copy'+todayDate;
        // }

        // function formatAMPM(date) {
        //   let hours = date.getHours();
        //   let minutes = date.getMinutes();
        //   const ampm = hours >= 12 ? 'pm' : 'am';
        //   hours = hours % 12;
        //   hours = hours ? hours : 12; // the hour '0' should be '12'
        //   minutes = minutes < 10 ? '0'+minutes : minutes;
        //   const strTime = hours + ':' + minutes + ' ' + ampm;
        //   return strTime;
        // }

        setTimeout(function() {
          iframeObj.style.height = iframeObj.contentWindow.document.body.scrollHeight + 30+ 'px';
          $(iframe).contents().find('body').append('<div id="watermark"><p>Not for Distribution</p></div>');
          $(iframe).contents().find('body').find('[data-offlinesupport="no"]').each(function() {
            const fallback = $(this).find('.fallback');
            if (fallback.children().length > 0) {
              $(this).replaceWith(fallback.show());
            }
            else { 
              const getComputedStyle = popoutWindow.getComputedStyle(this, null);
              const computedHeight = getComputedStyle.getPropertyValue('height');
              const computedWidth = getComputedStyle.getPropertyValue('width');
              //const contentHeight = (computedHeight === 'auto') ? $(this).attr('height'):computedHeight;
              //const contentWidth = (computedWidth === 'auto') ? $(this).attr('width'):computedWidth;
              $(this).replaceWith('<div class="contentPlaceholder" > This content is unavailable when printing </div>').show();
            }
          });
        }, 2000);

        setTimeout(function() {
          //$(iframe).height(popoutWindow.document.getElementById('printFrame').contentWindow.document.getElementById('iframecontentTable').scrollHeight+ 30);
        }, 3000);
        popoutWindow.document.getElementById('printId').addEventListener('click', function() {
          popoutWindow.print();
        });
        ReactDOM.render(this.props.children, container);

      }).catch(() => {
          //console.log(err);
      });


      
    };

    popoutWindow.onload = onloadHandler;
    // Just in case that onload doesn't fire / has fired already, we call it manually if it's ready.
    popoutWindow.document.readyState === 'complete' && onloadHandler();

    this.setState({openedWindow});
    
  }

  closeWindow() {
    this.state.openedWindow && this.state.openedWindow.close();
    (this.props.window || window).removeEventListener('unload', this.closeWindow);
  }

  windowClosing() {
    this.props.onClosing && this.props.onClosing();
  }

  /**
   * Bubble changes
   */
  componentDidUpdate() {
    // For SSR we might get updated but there will be no openedWindow. Make sure openedWIndow exists before calling
    this.state.openedWindow && this.state.openedWindow.update(this.props.children);
  }

  render() {
    return <div></div>;
  }

}
