import React        from 'react';
import ReactDOM     from 'react-dom';
import '../scss/printpage.scss';

class PrintPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    const getHeadTag = window.document.getElementsByTagName('head');
    $(getHeadTag).append('<style>@media print{thead{display:table-header-group;}tfoot{display:table-footer-group;}tbody{display:table-row-group;}#watermark {display:block;color: #d0d0d0; font-size: 65pt;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;xmargin: 0;z-index: 100;opacity: 0.6;left: 35%;top:30%;text-align: center;}#divHeader {display:block;color: green;font-size: 15pt; position: fixed;xmargin: 0;z-index: 100;left: 0%;top:0%;}#divFooter {display:block;color: green;font-size: 15pt; position: fixed; xmargin: 0;z-index: 100;left: 0%;top:97%;} iframe-table{border:none !important;}} @media screen{thead{display:none;}tfoot{display:none;}tbody{display:table-row-group;}#watermark {display:none;color: #d0d0d0;font-size: 90pt;-webkit-transform: rotate(-45deg); -moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;margin: 0;z-index: 100; opacity: 0.6;left: 6%;top:5%;text-align: center;}#divHeader {display:block;color: green;font-size: 15pt; position: fixed;xmargin: 0;z-index: 100;left: 0%;top:3%;}#divFooter {display:block;color: green;font-size: 15pt; position: fixed; xmargin: 0;z-index: 100;left: 0%;top:3%;}.iframe-table{border:none !important;}} </style>');

    const onloadHandler = () => {
      const url = window.location.href;
      const getUrl = url.substring(url.indexOf('?')+1);
      String.prototype.replaceAll = function(target, replacement) {
        return this.split(target).join(replacement);
      };
   
      const getPrintBtn = function() {
        const getPrintBtnEle = window.document.getElementById('printBtn');
        return getPrintBtnEle;  
      };

      const beforePrint = function() {
        const printBtn = getPrintBtn();
        $(printBtn).hide();    
      };
          
      const afterPrint = function() {
        const printBtn = getPrintBtn();
        $(printBtn).show();
      };

      if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
            beforePrint();
          } else {
            afterPrint();
          }
        });
      }
      
      const getPageResponce = new Request(getUrl, {
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });

      fetch(getPageResponce, {
        method: 'get'
      }).then((response) => {
        return response.text();
      }).then((data) => {
        const iframe = document.createElement('iframe');
        iframe.id='printFrame';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.scrolling= 'no'; 
        iframe.style.border='0';

        window.document.body.appendChild(iframe);
        const iframeObj=document.getElementById(iframe.id);
        const iframeDoc=iframeObj.contentDocument;
        const basePath = window.location.search.substring(1).split('/OPS');
        data = data.replaceAll('../../', basePath[0]+'/OPS/');
        data = data.replace('</head>', '<style>.contentPlaceholder{background-color:#efefef;padding:30px;border-width: 1px;border-color: #999999;font-size: 15pt;color:#b3b3b3;text-align: center;display: table-cell;vertical-align: middle;}@media print{#pagelogo{display:block;}.iframe-table{border:none !important;}#watermark {display:block;color: red;font-size: 75pt;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;xmargin: 0;z-index: 100;opacity: 0.6;left: 46%;top:25%;text-align: center;}thead{display:table-header-group;text-align:left;}tfoot{display:table-footer-group;text-align:left;}tbody{display:table-row-group;}}@media screen{#pagelogo{display:none;}.iframe-table{border:none !important;}thead{}tfoot{display:none;}#watermark {display:none;color: #d0d0d0;font-size: 75pt;-webkit-transform: rotate(-45deg);-moz-transform: rotate(-45deg);transform: rotate(-45deg);position: fixed;width: 100%;height: 100%;margin: 0;z-index: 100;opacity: 0.6;left: 6%;top:25%;text-align: center;}} </style>');
      
        iframeDoc.open();
        iframeDoc.write(data);
        iframeDoc.close();
        setTimeout(function() {
          iframeObj.style.height = iframeObj.contentWindow.document.body.scrollHeight + 30+ 'px';
          //$(iframe).contents().find('body').append('<div id="watermark"><p>Not for Distribution</p></div>');
          $(iframe).contents().find('body').find('[data-offlinesupport="no"]').each(function() {
            const fallback = $(this).find('.fallback');
            if (fallback.children().length > 0) {
              $(this).replaceWith(fallback.show());
            }
            else { 
              $(this).replaceWith('<div class="contentPlaceholder" > This content is unavailable when printing </div>').show();
            }
          });
        }, 2000);
        window.document.getElementById('printBtn').addEventListener('click', function() {
          window.print();
        });
      }).catch(() => {
           //console.log(err);
      });
    };
    window.onload = onloadHandler;
    window.document.readyState === 'complete' && onloadHandler();
  }

  render() {
    return (
      <div className="printContainer">
    <button type="button" id="printBtn" >Print</button>
    <div id="watermark" ><p>Not for Distribution</p></div>
    </div>
    );
  }

}

export default PrintPage;
