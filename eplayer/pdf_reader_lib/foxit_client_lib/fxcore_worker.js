eventList = [];
loaded =false;
Module = { 
    onRuntimeInitialized: function() {
        for(var i =0 ;i<eventList.length;i++){
            handleArr.forEach( function(element, index) {
                if (eventList[i].data.type === element.type) {
                    element.typefn(eventList[i]);
                }
            });
        }
        eventList.length = 0;
        loaded = true;
        //console.log('emcc module loaded done');
    } 
};

importScripts("PDF2Image_rel.js");

var PDFErrorCode = {
        /**
        * State is error or unknown.
        */
        ERROR_UNKNOWN : -1,
        /**
        * Success.
        */
        ERROR_SUCCESS : 0,
        /**
        * Parse PDF file failed.
        */
        ERROR_PDFPARSE_FILE : 1,
        /**
        * Format error.
        */
        ERROR_PDFPARSE_FORMAT : 2,
        /**
        * PDF password error.
        */
        ERROR_PDFPARSE_PASSWORD : 3,
        /**
        * Unsupported PDF security handler.
        */
        ERROR_PDFPARSE_HANDLE :4,
        /**
        * Unsupported PDF certificate.
        */
        ERROR_PDFPARSE_CERT : 5,
        /**
        * License expired exception.
        */
        ERROR_LICENSE_EXCEPTION : 16,
        /**
        * PDF load drm error.
        */
        ERROR_PDFPARSE_FOXITCONNECTEDDRM : 17,
        /**
        * PDF load drm error.
        */
        ERROR_USER_NOTLOGIN :18,
        ERROR_NETWORK_ERROR : 19,
        ERROR_USER_NOPERMISSION : 20,
        ERROR_ANNOTSAVE : 21,
        ERROR_FORM_IMPORTXML : 22,

        PDF_ERROR_SUCCESS			 :	0,
        PDF_ERROR_ERROR				 :  -1,
        PDF_ERROR_PARAM				 :	-2,
        PDF_ERROR_DOCSAVE			 :	-3,
        PDF_ERROR_PAGERENDER		 :	-4,
        PDF_ERROR_TEXTINFO			 :	-5,
        PDF_ERROR_DOCPARSER			 :	-6,
        PDF_ERROR_DOCPARSER_FILE	 :	-7,
        PDF_ERROR_DOCPARSER_FORMAT	 :	-8,
        PDF_ERROR_DOCPARSER_PASSWORD :	-9,
        PDF_ERROR_DOCPARSER_HANDLER	 :	-10,
        PDF_ERROR_DOCPARSER_CERT	 :	-11,
        PDF_ERROR_ANNOTSAVE			 :	-12,
        PDF_ERROR_FORM_EXPORTFDF	 :	-13,
        PDF_ERROR_FORM_IMPORTXML	 :	-14,
        PDF_ERROR_FORM_IMPORTFDF	 :	-15,
        PDF_ERROR_NONE_FORM			:  -16,
        PDF_ERROR_DOCPARSER_FOXITCONNECTEDDRM	:	-17
  }

var transformJniError = function(jinError) {
        var errCode = PDFErrorCode.ERROR_SUCCESS;
        switch(jinError) {
        case PDFErrorCode.PDF_ERROR_SUCCESS:
          errCode = PDFErrorCode.ERROR_SUCCESS;
          break;
        case PDFErrorCode.PDF_ERROR_DOCPARSER_FILE:
          errCode = PDFErrorCode.ERROR_PDFPARSE_FILE;
          break;
        case PDFErrorCode.PDF_ERROR_DOCPARSER_FORMAT:
          errCode = PDFErrorCode.ERROR_PDFPARSE_FORMAT;
          break;
        case PDFErrorCode.PDF_ERROR_DOCPARSER_PASSWORD:
          errCode = PDFErrorCode.ERROR_PDFPARSE_PASSWORD;
          break;
        case PDFErrorCode.PDF_ERROR_DOCPARSER_FOXITCONNECTEDDRM:
          errCode = PDFErrorCode.ERROR_PDFPARSE_FOXITCONNECTEDDRM;
           break;
        case PDFErrorCode.PDF_ERROR_DOCPARSER_HANDLER:
          errCode = PDFErrorCode.ERROR_PDFPARSE_HANDLE;
          break;
        case PDFErrorCode.PDF_ERROR_DOCPARSER_CERT:
          errCode = PDFErrorCode.ERROR_PDFPARSE_CERT;
          break;
        case PDFErrorCode.PDF_ERROR_ANNOTSAVE:
          errCode = PDFErrorCode.ERROR_ANNOTSAVE;
          break;
        case PDFErrorCode.PDF_ERROR_FORM_IMPORTXML:
          errCode = PDFErrorCode.ERROR_FORM_IMPORTXML;
        default:
          errCode = PDFErrorCode.ERROR_UNKNOWN;
        }
        return errCode;
}




var webPdfMgr = null;
var handleArr = [];
var webPdfDocument = null;
var _bufarray = null;
var pdfBuf = null;

var baseUrl;

var initWorker = {
	type:"initWorker",
	typefn:function(event){
		baseUrl = event.data.baseUrl;
        try{
		    importScripts('webpdf.fontmap.mini.js');
        }catch (ex){

        }
	}
};

var pageImg = {
    type: 'getPageImg',
    typefn: function(event) {
        var pageIndex = event.data.pageIndex;
        var scale = event.data.scale;
        var withForm = event.data.withForm || !event.data.docPermission.isForm;
        var withAnnots = event.data.withAnnots || !event.data.docPermission.isAnnot;
        var imageUrl = getImage(pageIndex,scale, withForm, withAnnots);
        if (imageUrl) {
            try{
                postMessage({type:"getPageImg",pageIndex:pageIndex, imageData: imageUrl.buffer},[imageUrl.buffer]);
            }catch(ex){
                postMessage({type:"getPageImg",pageIndex:pageIndex, imageData: imageUrl.buffer});
            }
        } else {
            postMessage({type:"getPageImg",pageIndex:pageIndex, imageData: null});
        }
    }
};

var commentList = {
    type: 'getCommentList',
    typefn: function(event) {
        var commentData;
        if (!webPdfDocument) {
            postMessage({type:'getCommentList', data:null, response: null, error: -1});
            return;
        }
        var unLoadPageStr = event.data.unLoadPageStr;
        var unLoadPageArr = unLoadPageStr.split(',');
        var len = unLoadPageArr.length;
        var pUnLoadPageArr = Module._malloc(len*32);
        for (var i=0;i<len;i++) {
            HEAPU32[(pUnLoadPageArr +(i<<2))>>2] = parseInt(unLoadPageArr[i]);
        }
        var commentData = webPdfDocument.getAnnotData(pUnLoadPageArr, len, event.data.count);
        if (commentData && commentData.indexOf('{"error":"exception"}') < 0) {
            postMessage({type:'getCommentList', data:commentData, response:{}, error: 0});
        } else {
            postMessage({type:'getCommentList', data:null, response: null, error: -1});
        }
    }
};

var annots = {
    type: 'getAnnots',
    typefn: function(event) {
        if (!webPdfDocument){
            postMessage({type:'getAnnots', data:null, pageIndex: event.data.pageIndex, response: {}, error: 'exception'}); 
            return;
        }
        // pageHandle = webPdfDocument.getPageHandle(docHandle, event.data.pageIndex);
        var page = null;
        var pageAnnot = null;
        if (event.data.docPermission.isForm && event.data.docPermission.isAnnot) {
            page = webPdfDocument.getPage(event.data.pageIndex);
            pageAnnot = page.getAnnotData();
        }else {
            pageAnnot = "{\"annots\":[],\"number\":" + event.data.pageIndex + "}";
        }
	    
    
        if (pageAnnot && pageAnnot.length > 0 && pageAnnot.indexOf('"error":"exception"') < 0) {
            postMessage({type:'getAnnots', data:pageAnnot, pageIndex: event.data.pageIndex, response:{}, error: 0});
        } else {
            postMessage({type:'getAnnots', data:null, pageIndex: event.data.pageIndex, response: {}, error: 'exception'}); 
        }
        if (page) {
            webPdfDocument.closePage(page.getHandle());
        }
    }
};

var thumbImg = {
    type: 'getThumbImg',
    typefn: function(event) {
        var pageIndex = event.data.pageIndex;
        var scale = event.data.scale;
        var imageData = getImage(pageIndex,scale);
        if (imageData) {
            try{
                postMessage({type:"getThumbImg",pageIndex:pageIndex, imageData: imageData.buffer,imageId:event.data.imageId},[imageData.buffer]);
            }catch(ex){
                postMessage({type:"getThumbImg",pageIndex:pageIndex, imageData: imageData.buffer,imageId:event.data.imageId});
            }
        } else {
            postMessage({type:"getThumbImg", pageIndex:pageIndex, imageData: null, imageId:event.data.imageId});
        }
    }
};

var printImg = {
    type: 'getPrintImg',
    typefn: function(event) {
        var pageIndex = event.data.pageIndex;
        var scale = event.data.scale;
     
        var imageData = getImage(pageIndex,scale);
        if (imageData) {
            try{
                postMessage({type:"getPrintImg",pageIndex:pageIndex, JR:true, imageData: imageData.buffer},[imageData.buffer]);
            }catch(ex){
                postMessage({type:"getPrintImg",pageIndex:pageIndex, JR:true,  imageData: imageData.buffer});
            }
        } else {
            var dataStatus = {
                status: 2
            };
            postMessage({type: 'getPrintImg',pageIndex:pageIndex, 'data':dataStatus, textStatus: 'success',JR:true, isrc: '', ct: 'application/json'});
        }
    }
};

var seachAllText = {
    type: 'seachAllText',
    typefn: function(event) {
        if (!webPdfDocument) {
            postMessage({type:"seachAllText", searchResult:null, response:{}, error: -1});
            return;
        } 
        var searchResult = webPdfDocument.searchText(event.data.pageIndex,event.data.count,event.data.findtext,event.data.flags);
        if (searchResult) {
            postMessage({type:"seachAllText", searchResult:searchResult, response:{}, error: 0});
        } else {
            postMessage({type:"seachAllText", searchResult:null, response:{}, error: -1});
        }
        
    }
};

var searchTextPageIndex = {
    type: 'searchTextPageIndex',
    typefn: function(event) {

        if (!webPdfDocument) {
            postMessage({type:"searchTextPageIndex",findWhat:event.data.findtext, pageTextInfo:'', response:{}, error: -1, pageIndex: pageNum});
            return;
        } 
        var pageNum = webPdfDocument.getPageIndexBySearchText(event.data.startpageindex, 
            event.data.endpageindex, event.data.findtext, event.data.flags,
             event.data.searchDown);
        if (pageNum <0) {
            postMessage({type:"searchTextPageIndex",findWhat:event.data.findtext, pageTextInfo:'', response:{}, error: 0, pageIndex: pageNum});
            return;
        }
        var page = webPdfDocument.getPage(pageNum);
        var ret = Module._malloc(4);
        var pageText = page.getText(ret);
        var ret1 = HEAP32[((ret)>>2)];
        Module._free(ret);

        if (ret1 !== 0) {
            postMessage({type:"searchTextPageIndex",findWhat:event.data.findtext, pageTextInfo:null, response:{}, error: ret1, pageIndex: pageNum});
            return;
        }
        postMessage({type:"searchTextPageIndex",findWhat:event.data.findtext, pageTextInfo:pageText, response:{}, error: 0, pageIndex: pageNum});
    }
};

var pageText = {
    type: 'getPageText',
    typefn: function(event) {
        if (!webPdfDocument) {
            postMessage({type:"getPageText", textPageData:null, pageIndex: event.data.pageIndex, response:{}, error: -1});
            return;
        } 
        //var pageHandle = webPdfDocument.getPageHandle(docHandle,event.data.pageIndex);
		var page = webPdfDocument.getPage(event.data.pageIndex);
        var ret = Module._malloc(4);
        var pageText = page.getText(ret);
        var ret1 = HEAP32[((ret)>>2)];
        Module._free(ret);
        ret1 = transformJniError(ret1);
        if (ret1 !== PDFErrorCode.PDF_ERROR_SUCCESS) {
            postMessage({type:"getPageText", textPageData:null, pageIndex: event.data.pageIndex, response:{}, error: ret1});
        }
        postMessage({type:"getPageText", textPageData:pageText, pageIndex: event.data.pageIndex, response:{}, error: 0});
		webPdfDocument.closePage(page.getHandle());
    }
};

var exportDocument = {
    type: 'exportDocument',
    typefn: function(event) {
        if (!webPdfDocument) {
            postMessage({type:"exportDocument", docmentContent:null,fileName:event.data.fileName});
            return;
        }
        var error = -1;

        if (event.data.annotData != null && event.data.annotData != "") {
            var annotData = addStampJson(event.data.annotData);
            error = webPdfDocument.saveAnnotsData(annotData);
            if(error !== 0) {
               postMessage({type:"exportDocument", error:error,fileName:event.data.fileName});
               return;
            }  
        }

        if (event.data.formData != null && event.data.formData != "") {
            var length = Module.lengthBytesUTF8(event.data.formData)
            var bufarray = new Uint8Array(length + 1);
            var actualNumBytes = Module.stringToUTF8Array(event.data.formData, bufarray, 0, bufarray.length);

            var buf = Module._malloc(bufarray.length*bufarray.BYTES_PER_ELEMENT);
            Module.HEAPU8.set(bufarray, buf);

            var ret = -1;
            error = webPdfDocument.importFromXml(buf,bufarray.length);


            if (error != 0) {
                postMessage({type:"exportDocument", error:error,fileName:event.data.fileName});
                return;
            }
        }

        if (event.data.wmInfo != null && event.data.wmInfo != "") {
            error = webPdfDocument.addWatermark(event.data.wmInfo);
            if (error != 0) {
                postMessage({type:"exportDocument", error:error,fileName:event.data.fileName});
                return;
            }
        }

        if (event.data.inkSignData != null && event.data.inkSignData != "") {
            error = webPdfDocument.saveInkSignData(event.data.inkSignData);
            //if(error != 0)
            //    return;
        }

        var dwDataSize = Module._malloc(4);
        var content = webPdfDocument.getDocumentStream(dwDataSize);

        if (content == null) {
            postMessage({type:"exportDocument", error:-1,fileName:event.data.fileName});
            return;
        }

        var len;
        len = HEAPU32[((dwDataSize)>>2)];
        var docArray = new Uint8Array(len);
        var array = [];
        for (var i = 0 ; i < len; i++){
            docArray[i] = HEAPU8[content++];
        }
        //Module._free(dwDataSize);
        try{
             postMessage({type:"exportDocument", docmentContent:docArray.buffer, error:0,fileName:event.data.fileName},[docArray.buffer]);
        }catch(ex){
             postMessage({type:"exportDocument", docmentContent:docArray.buffer,fileName:event.data.fileName});
        }

        if(webPdfDocument != null){
             webPdfMgr.closeDoc(webPdfDocument);
             webPdfDocument = null;
             pdfBuf = null;
        }

        pdfBuf = Module._malloc(_bufarray.length*_bufarray.BYTES_PER_ELEMENT);
        Module.HEAPU8.set(_bufarray, pdfBuf);
        var ret = Module._malloc(4);

        webPdfDocument = webPdfMgr.loadDocFromStream(pdfBuf,_bufarray.length,event.data.password,ret);
        Module._free(ret);
    }
};

var loadPDF = {
    type: 'loadPDF',
    typefn: function(event) {
        if (webPdfMgr == null) {
            webPdfMgr = new Module.WebPdfMgr();
            webPdfMgr.initMgr("");
        }

        if(event.data.buf != null){
            _bufarray = null;
            _bufarray = new Uint8Array(event.data.buf);

            if(webPdfDocument != null){
                 webPdfMgr.closeDoc(webPdfDocument);
                 webPdfDocument = null;
                 pdfBuf = null;
            }
        } else if (_bufarray == null) {
            try {
                postMessage({ type: "loadPDF", docInfo: null, bmkInfo: null, pdfBffer: event.data.buf, response: { error: PDFErrorCode.ERROR_PDFPARSE_FILE, status: 4 }, xhr: null, trail: null, error: ret1 }, [event.data.buf]);
            } catch (ex) {
                postMessage({ type: "loadPDF", docInfo: null, bmkInfo: null, pdfBffer: event.data.buf, response: { error: PDFErrorCode.ERROR_PDFPARSE_FILE, status: 4 }, xhr: null, trail: null, error: ret1 });
            }
        }

        pdfBuf = Module._malloc(_bufarray.length*_bufarray.BYTES_PER_ELEMENT);
        Module.HEAPU8.set(_bufarray, pdfBuf);
        var ret = Module._malloc(4);
        webPdfDocument = webPdfMgr.loadDocFromStream(pdfBuf,_bufarray.length,event.data.password,ret);
        var ret1 = HEAP32[((ret)>>2)];
        Module._free(ret);
        ret1 = transformJniError(ret1);
        
        if (ret1 !== PDFErrorCode.PDF_ERROR_SUCCESS) {
            if (ret1 === PDFErrorCode.ERROR_PDFPARSE_PASSWORD) {
		        try{
				    postMessage({type:"loadPDF", docInfo:null, bmkInfo:null,pdfBffer:event.data.buf, response:{error: ret1, status: 4}, xhr:null, trail:null, error: ret1},[event.data.buf]);
				}catch(ex){
					 postMessage({type:"loadPDF", docInfo:null, bmkInfo:null,pdfBffer:event.data.buf, response:{error: ret1, status: 4}, xhr:null, trail:null, error: ret1});
				}   
            } else {
                postMessage({type:"loadPDF", docInfo:null, bmkInfo:null, response:{error: ret1, status: 4}, xhr:null, trail:null, error: ret1});
            }
            
            return;
        }

        if(webPdfDocument == null)
            return;

        //get ManifestInfo
        var docInfo = null;
        var pageInfo = webPdfDocument.getDocInfo(0);
        var pageInfoSub = pageInfo.substr(0,pageInfo.length-2);//remove '}'
        var dt = new  Date();
        var docinfo = webPdfDocument.getDocInfo(1);
        var docProperties = ',\"dppinfo\":' + docinfo;
        docProperties += ',\"createdUtcTime\":' + dt.valueOf().toString();
        docInfo = pageInfoSub + docProperties + '}';
        postMessage({type:"loadPDF", docInfo:docInfo, bmkInfo:null, response:{}, xhr:null, trail:null, error: 0});
    }
};

var bmkInfo = {
    type: 'getBmkInfo',
    typefn: function(event) {
        if (!webPdfDocument) {
            postMessage({type:"getBmkInfo", bmkInfo:null,  response:null, error: -1});
            return;
        }
        var bmkInfo = webPdfDocument.getDocInfo(2);
        if (bmkInfo != null) {
            if(bmkInfo == ""){
                bmkInfo = "{}";
            }
            postMessage({type:"getBmkInfo", bmkInfo:bmkInfo,  response:{}, error: 0});
        } else {
            postMessage({type:"getBmkInfo", bmkInfo:null,  response:null, error: -1});
        }
    }
};

var form = {
    type: 'getForm',
    typefn: function(event) {

        //form info
        var dwSize = Module._malloc(4);
        var formImage = webPdfDocument.outputBgImage2Buf(event.data.pageIndex, true, dwSize, 0, 0, 0);
        if (formImage == null) {
            postMessage({type:"getForm", xmlData:null, pageIndex:event.data.pageIndex, imageUrl: null});
            return;
        }

        var formXML = webPdfDocument.getCurXMLStr();
        var imageArray = [];
        if(formImage){
            var len = HEAPU32[((dwSize)>>2)];
            imageArray = new Uint8Array(len);
            for (var i = 0 ; i < len; i++){
                imageArray[i] = HEAPU8[formImage++];
            }
        }


        try{
           postMessage({type:"getForm", xmlData:formXML, pageIndex:event.data.pageIndex, imageUrl: imageArray.buffer},[imageArray.buffer]);
        }catch(ex){
           postMessage({type:"getForm", xmlData:formXML, pageIndex:event.data.pageIndex, imageUrl: imageArray.buffer});
        }

        Module._free(dwSize);
        
    }
};

var getPageControlsAP = {
    type: 'getPageControlsAP',
    typefn: function(event) {
        var contorlsAP;
        var pageIndex = event.data.pageIndex;
        var dataSize = Module._malloc(4);
        var contorlsAPImage = webPdfDocument.loadPageControlsAP(pageIndex,contorlsAP,dataSize);

        if (contorlsAPImage == null) {
            Module._free(dataSize);
            return null;
        }

        var len = HEAPU32[((dataSize)>>2)];
        var imageDataArray = new Uint8Array(len);

        for (var i = 0 ; i < len; i++){
            imageDataArray[i] = HEAPU8[contorlsAPImage++];
        }

        contorlsAP = webPdfDocument.getPageControlsAP();
        try{
           postMessage({type:"getPageControlsAP", contorlsAP:contorlsAP, pageIndex:pageIndex,
            imageUrl: imageDataArray},[imageDataArray.buffer]);
        }catch(ex){
           postMessage({type:"getPageControlsAP", contorlsAP:contorlsAP, pageIndex:pageIndex,
            imageUrl: imageDataArray});
        }        
    }
};

var getFields = {
    type: 'getFields',
    typefn: function(event) {
        var fields = webPdfDocument.getFields();
        postMessage({type:'getFields', fields:fields});
    }
};

var getPdfBuffer = {
    type: 'getPdfBuffer',
    typefn: function(event) {
        postMessage({type:'getPdfBuffer', pdfBuffer:_bufarray.buffer});
    }
};

var exportFormXML = {
    type: 'exportFormXML',
    typefn: function(event) {
        if (!webPdfDocument){
            postMessage({type:"exportFormXML", originalXML:null, fileName: event.data.fileName}); 
            return;
        }
        var dwSize = Module._malloc(4);
        var ret = Module._malloc(4);
        var buffXML = webPdfDocument.exportToXml(true, false, dwSize, ret);

        if (buffXML == null) {
           Module._free(dwSize);
           Module._free(ret);
           postMessage({type:"exportFormXML", originalXML:null, fileName: event.data.fileName}); 
           return;
        }

        var len = HEAPU32[((dwSize)>>2)];
        var xmlArray = new Uint8Array(len);
        for (var i = 0 ; i < len; i++){
            xmlArray[i] = HEAPU8[buffXML++];
        }
        postMessage({type:"exportFormXML", originalXML:String.fromCharCode.apply(null, xmlArray), fileName: event.data.fileName});
        Module._free(dwSize);
        Module._free(ret);
    }
};

var initLoad = {
    type: 'initLoad',
    typefn: function() {
        if (webPdfMgr == null) {
            webPdfMgr = new Module.WebPdfMgr();
            webPdfMgr.initMgr("");
        }
        postMessage({type: 'initLoad', status: 1});
    }
};


var terminate ={
    type: 'terminate',
    typefn: function() {
        //if(webPdfDocument != null){
        //    webPdfMgr.closeDoc(webPdfDocument);
        //    Module.destroy(webPdfDocument);
        //    webPdfDocument = null;
        //}
       // var _bufarray = null;
       // var pdfBuf = null;
       //
       //if(webPdfMgr){
       //    Module.destroy(webPdfMgr);
       //    webPdfMgr = null;
       //}

        //postMessage({type: 'terminate', status: 1});
    }
};

var exportFDF = {
    type: 'exportFDF',
    typefn: function(event) {
        if (!webPdfDocument){
            postMessage({type:"exportFDF", fdfStream:null, fileName: event.data.fileName});
            return;
        }
        if(event.data.annotData) {
            var annotData = addStampJson(event.data.annotData);
            var error = webPdfDocument.saveAnnotsData(annotData);
            if(error !== 0) {
                postMessage({type:"exportFDF", fdfStream:null, fileName: event.data.fileName});
                return;
            }
        }
        var dwSize = Module._malloc(4);
        var fdfStream = webPdfDocument.exportAnnotsToFdf(event.data.fileName, dwSize);
        
        if (fdfStream == null) {
            Module._free(dwSize);
            postMessage({type:"exportFDF", fdfStream:null, fileName: event.data.fileName});
            return;
        }
        var len = HEAPU32[((dwSize)>>2)];
        var fdfArray = new Uint8Array(len);
        for (var i = 0 ; i < len; i++){
            fdfArray[i] = HEAPU8[fdfStream++];
        }
        postMessage({type:"exportFDF", fdfStream:fdfArray, fileName: event.data.fileName});
        Module._free(dwSize);
    }
};


var getUserFormXML = {
   type: 'getUserFormXml',
    typefn: function(event) {
        if (!webPdfDocument){
            return false;
        }
        var dwSize = Module._malloc(4);
        var ret = Module._malloc(4);
        var buffXML = webPdfDocument.exportToXml(true, false, dwSize, ret);
        var ret1 = HEAP32[((ret)>>2)];
        Module._free(ret);
        if (ret1 !== 0) {
            postMessage({type:"getUserFormXml", originalXML:ret1 });
            Module._free(dwSize);
            return;
        }

        var len = HEAPU32[((dwSize)>>2)];
        var xmlArray = new Uint8Array(len);
        for (var i = 0 ; i < len; i++){
            xmlArray[i] = HEAPU8[buffXML++];
        }

        postMessage({type:"getUserFormXml", originalXML:String.fromCharCode.apply(null, xmlArray)});
        Module._free(dwSize);
    }
};

var getAnnotsDataFromFDF = {
    type: 'getAnnotsDataFromFDF',
    typefn: function(event) {
        if (webPdfMgr == null) {
            webPdfMgr = new Module.WebPdfMgr();
            webPdfMgr.initMgr("");
        }
        var bufferArray = event.data.fileBuffer;
        var fdfBuf = Module._malloc(bufferArray.length*bufferArray.BYTES_PER_ELEMENT);
        Module.HEAPU8.set(bufferArray, fdfBuf);
        var ret = Module._malloc(4);
        var annotsData = webPdfMgr.getAnnotsDataFromFDF(fdfBuf, bufferArray.length, ret);
        var ret1 = HEAP32[((ret)>>2)];
        postMessage({type:'getAnnotsDataFromFDF', data:annotsData, response:{}, error: ret1});
        Module._free(ret);
        Module._free(fdfBuf);
    }
};

handleArr.push(initLoad, pageImg, commentList, annots, thumbImg, printImg, seachAllText, pageText,
    exportDocument, loadPDF, bmkInfo, form, exportFormXML, exportFDF,getUserFormXML,searchTextPageIndex,initWorker,terminate,
    getFields,getPageControlsAP,getAnnotsDataFromFDF,getPdfBuffer);

onmessage = function (event) {
    if(!loaded){
        eventList.push(event);
        return 
    }
    handleArr.forEach( function(element, index) {
        if (event.data.type === element.type) {
            element.typefn(event);
        }
    });
};


//get quest
function getImage(pageIndex,scale, withForm, withAnnots){
    if (!webPdfDocument) {
        return null;
    }
    var dwDataSize = Module._malloc(4);

	var page = webPdfDocument.getPage(pageIndex);

    var ret = Module._malloc(4);
    var buffer = page.getImage(scale, withForm, withAnnots, dwDataSize, ret);
    var ret1 = HEAP32[((ret)>>2)];
    Module._free(ret);

    if (buffer == null) {
         Module._free(dwDataSize);
        return null;
    }

    var len;
    len = HEAPU32[((dwDataSize)>>2)];
    var docArray = new Uint8Array(len);

    for (var i = 0 ; i < len; i++){
        docArray[i] = HEAPU8[buffer++];
    }

	webPdfDocument.closePage(page.getHandle());
    Module._free(dwDataSize);
    return  docArray;
}

//add stamp icon source
function addStampJson(jsonAnnots) {
    var annotsObj = JSON.parse(jsonAnnots);
    var iconNum = 1;
    var iconName = "stampIcon_";
    var stampObj = {};
    var pdfUrl = null;
    var stampImageMap = [];
    function searchInMap(iconUrl,map){
        var  iconName = null;
        for(var i = 0; i < map.length; i++){
            if(iconUrl == map[i].iconUrl){
                 iconName = map[i].iconName;
                 break;
            }
        }
        return iconName;
    }

    for (var pageIndex=0;pageIndex<annotsObj.length;pageIndex++) {
        var obj = annotsObj[pageIndex].annots;
        if(obj == null){
            continue;
        }
        for (var annotIndex=0;annotIndex<obj.length;annotIndex++) {
            pdfUrl = obj[annotIndex].stamp_ic;
            if (pdfUrl) {
                pdfUrl = pdfUrl.replace(".svg", ".pdf");
                var icon =  searchInMap(pdfUrl,stampImageMap);
                if(icon != null){
                    obj[annotIndex].stamp_ic = icon;
                    continue;
                }

                obj[annotIndex].stamp_ic = iconName + iconNum;
                var object = {};
                object.iconUrl = pdfUrl;
                object.iconName =  iconName + iconNum;
                stampImageMap.push(object);

                function  callback (buffer){
                    stampObj[iconName + iconNum] = buffer;
                }
                getFileData("../../"+pdfUrl, callback);
                iconNum++;
            }
        }
    }
    var annots = {};
    annots["pageAnnots"]  = annotsObj;
    annots["stampIcons"] = stampObj;
    return JSON.stringify(annots);
}

//get url source
function getFileData(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("get", url, false);
    xmlHttp.responseType = "arraybuffer";
    xmlHttp.onreadystatechange =changeState;
    xmlHttp.setRequestHeader("Cache-Control", "public");
    xmlHttp.send();
    function changeState(){
        if (xmlHttp.readyState == 4) {
            var buff = new Uint8Array(xmlHttp.response);
            var array = [].slice.call(buff);
            buff = null;
            // var buffer = [];
            // for (var i=0;i<xmlHttp.response.byteLength;i++) {
            //     buffer[i] = buff[i];
            // }
            callback(array);
        }
    }
}

//get url source
function getHttpsData(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("get", url, false);
    xmlHttp.responseType = "json";
    xmlHttp.onreadystatechange = changeState;
    xmlHttp.setRequestHeader("Accept", "application/json");
    xmlHttp.send();
    function changeState() {
        if (xmlHttp.readyState == 4) {
            callback(xmlHttp.response.data[0]);
        }
    }
}

