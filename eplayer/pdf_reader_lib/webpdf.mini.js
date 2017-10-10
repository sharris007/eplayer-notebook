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
define("core/Viewer", ["./WebPDF", "./Config", "./ReaderApp", "./Cavans/uupaa-color.mini", "./Cavans/uupaa-excanvas", "./Environment", "./Support", "./Math/Rect", "./Math/Point", "./Math/JSMap", "./Math/Matrix", "./CommonDialog", "./Tools/Tools", "./DataLevel", "./PDFData/Dest", "./Lang", "./PDFView/MainFrame", "./PDFView/PDFDocView", "./PDFView/PDFPageView", "./ViewLevel", "./PDFView/LayoutInfo", "./PDFView/ProgressiveViewerGenerator", "./PDFView/PDFContinuousView", "./PDFView/PDFSinglePageView", "./PDFView/SinglePageViewLayout", "./Common", "./Event/IMainFrmEventHandler", "./Event/Event", "./Event/IMousePtHander", "./Tools/HandToolHandler", "./MenuItem", "./PDFData/Text/TextManager", "./PDFData/Text/Reader_TextObject", "./PDFData/Text/Reader_TextPage", "./Plugins/Annot/BaseAnnotPlugin", "./Plugins/Annot/AnnotHandleManager", "./ImageEngine/AnnotUIManager", "./ImageEngine/PDFAnnotationLoader", "./Plugins/Annot/MarkupAnnotHandler", "./Plugins/Annot/PopupMousePtHandler", "./PDFData/TypewriterAnnot", "./PDFData/Annot", "./Interface", "./Plugins/Annot/CommentAnnotHandler", "./Plugins/Annot/CommonMarkupAnnotHandler", "./Plugins/Annot/LinkAnnotHandler", "./Plugins/Annot/TextAnnotHandler", "./Plugins/Annot/TypewriterAnnotHandler", "./Plugins/Annot/DrawingAnnotHandler", "./Plugins/Annot/CommentsAnnot", "./Plugins/Annot/AnnotMousePtHandler", "./Plugins/Annot/AnnotSelectionTool", "./Plugins/TextSelection/Reader_TextSelectTool", "./Plugins/TextSelection/Reader_TextPageSelect", "./Plugins/Annot/TextAnnotToolHandler", "./PDFData/AnnotFactory", "./PDFData/MarkupAnnot", "./PDFData/LinkAnnot", "./PDFData/Action", "./PDFData/InkAnnot", "./PDFData/Signature", "./PDFData/InkSign", "./Plugins/Annot/TypewriterAnnotToolHandler", "./Plugins/Annot/CommentAnnotToolHandler", "./Plugins/Annot/DrawingAnnotToolHandler", "./Plugins/Annot/DrawingTools", "./Plugins/Print/PrintConfig", "./Plugins/Bookmark/Bookmark", "./Plugins/Bookmark/PDFBookmark", "./ImageEngine/PDFBookmarkLoader", "./Plugins/FindTool/FindToolPlugin", "./Plugins/FindTool/SearchResult", "./Plugins/DocProperties/DocPropertiesPlugin", "./Plugins/Form/FormPlugin", "./Plugins/Form/ActionJScript", "./Plugins/Form/jshint", "./Plugins/Form/FormXMLParser", "./Plugins/TextSelection/TextSelectionPlugin", "./Plugins/TextSelection/TextSelectionToolHandler", "./Plugins/Menu/MenuPlugin", "./Plugins/Signature/SignaturePlugin", "./Plugins/Signature/SignatureHandleManager", "./ImageEngine/SignatureUIManager", "./Plugins/Signature/NormalSigToolHandler", "./Plugins/Signature/StraddleSigToolHandler", "./Plugins/Signature/SignatureMouseHandler", "./Plugins/InkSign/InkSignPlugin", "./Plugins/InkSign/InkSignHandleManager", "./ImageEngine/InkSignUIManager", "./Plugins/InkSign/InkSignToolHandler", "./ImageEngine/PDFInkSignLoader", "./ImageEngine/DocumentLoader", "./ImageEngine/ImageEngine", "./ImageEngine/PDFDocument", "./ImageEngine/PDFPage", "./ImageEngine/PDFDocProperties", "./ImageEngine/ImagePageViewRender", "./ImageLazyLoad", "./AjaxRetryManager"], function(a, b, c) {
    var d = a("./WebPDF"),
        e = a("./Config"),
        f = a("./ReaderApp");
    a("./Common"), d.Viewer = function(b, c) {
        function g() {
            return null == m.getMainView() ? null : m.getMainView().getDocView()
        }
        var h = null,
            j = c.url,
            k = this,
            l = j.indexOf("asserts");
        c.baseUrl = j.substr(0, l), j.lastIndexOf("/") != j.length - 1 && j.lastIndexOf("\\") != j.length - 1 && (j += "/"), c.url = j, c = $.extend(d.Config.defaults, c), "undefined" == typeof c.readerType && (c.readerType = d.ReaderEngineType.IMAGE);
        var m = null;
        try {
            var n = $("#" + b),
                o = b + "_leftPanel";
            d.Environment.mobile && (n.addClass("fwr_main_frame_wnd_wap"), c.defaultZoom = d.ZOOM_FIT_WIDTH);
            var p = null,
                q = null;
            switch (c.readerType) {
                case d.ReaderEngineType.IMAGE:
                    a("./ImageEngine/DocumentLoader"), a("./ImageEngine/ImagePageViewRender"), p = new d.ImageEngine.DocumentLoader(j), q = new d.ImageEngine.ImagePageViewRender;
                    break;
                case d.ReaderEngineType.HTML5:
                    $.error("Unsupported engine.");
                    break;
                default:
                    $.error("Invalid type of reader.")
            }
            m = new f(j, c.fileName, b, c, o, p, q), d.Tool.setReaderApp(m);
            var r = {
                getAsync: !1,
                lng: c.language,
                load: "current",
                useCookie: !1,
                useDataAttrOptions: !0,
                defaultValueFromContent: !1,
                fallbackLng: !1,
                useLocalStorage: !1,
                localStorageExpirationTime: 864e5,
                resGetPath: c.baseUrl + "__ns__-__lng__.json?" + (new Date).getTime()
            };
            i18n.init(r, function(a) {
                $("#" + b).i18n()
            })
        } catch (s) {
            return console.error(s), null
        }
        this.load = function() {
            try {
                var a = {
                    uuid: this.getFileID
                };
                $.ajax({
                    url: c.baseUrl + "api/config/plugins",
                    type: "GET",
                    data: a,
                    success: function(a) {
                        var b = $.parseJSON(a.result);
                        m.setPlugin(b.plugin), m.setReadOnlyFlag(b.readOnly), m.setPrintFlag(b.disablePrint), m.setDisableDownloadFlag(b.disableDownload), m.registerBaseModule(), m.initInstance()
                    },
                    error: function() {
                        m.setPlugin(1023), m.registerBaseModule(), m.initInstance()
                    }
                })
            } catch (b) {
                console.error(b)
            }
        }, this.saveAnnots = function(a) {
            if (m) {
                var b = m.getPluginByName(d.BASEANNOT_PLUGIN_NAME);
                b && b.saveAnnots(!0, "comments", !0, a, a, "wait to save")
            }
        }, this.getZoomLevels = function() {
            var a = g();
            return a ? a.getCurrentZoomList() : null
        }, this.zoomTo = function(a) {
            var b = g(),
                c = parseFloat(a);
            c && (a = c, .1 > a && (a = .1), a > 2 && (a = 2), b.setFitWidth(!1), b.onZoom(a)), a === d.ZOOM_IN ? b.zoomIn() : a === d.ZOOM_OUT ? b.zoomOut() : a === d.ZOOM_FIT_WIDTH && b.fitWidth()
        }, this.rotate = function(a) {
            var b = g();
            a === d.ROTATE_LEFT ? b.rotateLeft() : a === d.ROTATE_RIGHT && b.rotateRight()
        }, this.isFitWidth = function() {
            var a = g();
            return a ? a.isFitWidth() : void 0
        }, this.getCurZoomLevel = function() {
            var a = g();
            return a ? a.getScale() : void 0
        }, this.gotoPage = function(a, b, c) {
            var d = g();
            d && d.gotoPage(a, b, c)
        }, this.getBookmark = function() {
            return m.getBookmark()
        }, this.gotoPrevPage = function() {
            var a = g();
            return a ? a.gotoPrevPage() : void 0
        }, this.gotoNextPage = function() {
            var a = g();
            return a ? a.gotoNextPage() : void 0
        }, this.gotoPageByDestination = function(a) {
            m.getMainView().getDocView().gotoPageByDestination(a)
        }, this.getPageCount = function() {
            var a = g();
            return a ? a.getPageCount() : null
        }, this.getCurPageIndex = function() {
            var a = g();
            return a.getCurPageIndex()
        }, this.scrollBy = function(a, b) {
            var c = g();
            c.movePage(left, top)
        }, this.focus = function() {
            $("#" + m.getDocView().getDocViewContainerID()).focus()
        }, this.updateLayout = function(a, b) {
            m.onResize(a, b)
        }, this.on = function(a, b) {
            return $(m).on(a, b), k
        }, this.getApp = function() {
            return m
        }, this.getOptions = function() {
            return m ? m.getOptions() : 0
        }, this.off = function(a, b) {
            return $(m).off(a, b), k
        }, this.fire = function(a, b) {
            $(m).trigger(a, b)
        }, this.downloadPDF = function() {
            window.open(m.getOptions().url + "pdf")
        }, this.getFileName = function() {
            return m.getFileName()
        }, this.getUserName = function() {
            return m.getUserName()
        }, this.setCurrentToolByName = function(a) {
            m.setCurrentToolByName(a)
        }, this.getCurToolHandler = function() {
            return m.getCurToolHandler()
        }, this.getToolHandlerByName = function(a) {
            return m.getToolHandlerByName(a)
        }, this.setCurToolHandler = function(a) {
            return m.setCurToolHandler(a)
        }, this.getPluginByName = function(a) {
            return m.getPluginByName(a)
        }, this.searchText = function(a, b, c) {
            var e = m.getPluginByName(d.FindToolPluginName);
            return e ? b === d.SearchDirection.Down ? e.searchTextDown(a) : b === d.SearchDirection.Up ? e.searchTextUp(a) : (console.warn("Invalid direction parameter for searching text."), !1) : (console.warn("Find tool is not enabled."), !1)
        }, this.searchAllText = function(a, b, c, e) {
            var f = m.getPluginByName(d.FindToolPluginName),
                g = this.getPageCount();
            return null == a || "" == a || null == e || null == b || 0 == b || e > g ? null : void(f ? f.searchAllText(a, b, c, e) : console.warn("Find tool is not enabled."))
        }, this.isDocLoaded = function() {
            return m.isDocLoaded()
        }, this.print = function() {
            return m.isDisablePrint() ? void 0 : m.print()
        }, this.exportToFDF = function() {
            var a = m.getPDFDoc();
            a && a.exportToFDF()
        }, this.exportDocument = function(a) {
            var b = m.getPDFDoc();
            m.isDisableDownload() || b && b.exportDocument(a)
        }, this.getThumbnail = function(a, b) {
            var c = g().getPageView(a),
                d = m.getMainView().getDocView().getPageViewRender();
            return d.loadThumb(c, a, b, e.defaults.requestRetryCount)
        }, this.highlightText = function(a, b) {
            var c = b.length,
                e = [];
            for (i = 0; i < c; i++) {
                var f = b[i],
                    g = m.getPDFDoc(),
                    h = g.getPage(a),
                    j = h.transRectWithPageMatrix(f);
                e.push(j)
            }
            var k = m.getPluginByName(d.FindToolPluginName);
            return k ? (k.resetHighLightText(!0), k.curPageIndex = a, k.setHighlightRects(e), k.setSeacrchedPageIndex(a), k.highlightSearchedText(a, e)) : !1
        }, this.registerPlugin = function(a) {
            return m.registerPlugin(a)
        }, this.getDocView = function() {
            return m.getMainView().getDocView()
        }, this.addContextMenu = function(a) {
            return m.addMenuItem(menuItemDefinition)
        }, this.registerMainFrmEventHandler = function(a) {
            return m.registerMainFrmEventHandler(a)
        }, this.registerMousePtHandler = function(a) {
            return m.registerMousePtHandler(a)
        }, this.getIp = function() {
            return m.getIP()
        }, this.openFile = function(e) {
            j = e, l = j.indexOf("asserts"), c.baseUrl = j.substr(0, l), j.lastIndexOf("/") != j.length - 1 && j.lastIndexOf("\\") != j.length - 1 && (j += "/"), c.url = j, c = $.extend(d.Config.defaults, c), m.resetResouce();
            try {
                var f = $("#" + b);
                f.children().remove();
                d.Environment.mobile && (f.addClass("fwr_main_frame_wnd_wap"), c.defaultZoom = d.ZOOM_FIT_WIDTH);
                var g = null,
                    h = null;
                switch (c.readerType) {
                    case d.ReaderEngineType.IMAGE:
                        a("./ImageEngine/DocumentLoader"), a("./ImageEngine/ImagePageViewRender"), g = new d.ImageEngine.DocumentLoader(j), h = new d.ImageEngine.ImagePageViewRender;
                        break;
                    case d.ReaderEngineType.HTML5:
                        $.error("Unsupported engine.");
                        break;
                    default:
                        $.error("Invalid type of reader.")
                }
                m.setDocumentHandle(g), m.setPageViewRender(h), m.setOptions(c)
            } catch (i) {
                return console.error(i), null
            }
            //k.load()
        }, this.getFileID = function() {
            return m.getFileID()
        }, this.getFileUrl = function() {
            return h
        }, this.setFileUrl = function(a) {
            h = a
        }, this.hasForm = function() {
            return m.isForm()
        }, this.setWatermarkInfo = function(a) {
            m.setWatermarkInfo(a)
        }, this.getWatermarkInfo = function() {
            return m.getWatermarkInfo()
        }, this.setLayoutShowMode = function(a) {
            var b = g();
            return b ? b.changeShowMode(a, !0) : null
        }
        // , this.setAccessToken = function(a) {
        // //     a && $.ajaxSetup({
        // //         headers: {
        // //             accessToken: a
        // //         }
        // //     }), m.setAccessToken(a)
        // // }, c.accessToken && this.setAccessToken(c.accessToken)
    }, d.createViewer = function(a, b) {
        var c = new d.Viewer(a, b);
        return d.ViewerInstance = c, c
    }
}), define("core/WebPDF", [], function(a, b, c) {
    return window.WebPDF || ("undefined" == typeof console && (window.console = {
        log: function() {},
        warn: function() {},
        error: function() {}
    }), window.WebPDF = {
        version: "1.2",
        timestamp: "20160122"
    }), window.WebPDF
}), define("core/Config", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.Config = {}, d.Config.defaults = {
        language: "en-US",
        defaultLanguage: "en-US",
        zoomList: [.5, .75, 1, 1.25, 1.5, 2],
        minZoomSize: .5,
        maxZoomSize: 2,
        maxNewPagesPerTime: 20,
        maxResizePagesPerTime: 20,
        requestRetryCount: 50,
        maxRequestRetryCount: 100,
        requestRetryInterval: 2e3,
        maxManifestRetryCount: 60,
        errPageImgWidth: 558,
        errPageImgHeight: 106,
        defaultZoom: 1,
        leftPanelShowOnStart: !0,
        showDownloadLimitBtn: !0,
        disablePrint: !0,
        TooltipTimeout: 3e3,
        autoDetectElasticScroll: !0,
        scrollBarType: 0,
        url: "./",
        fileName: "",
        formMode: !0
    }, d.Config.ToolBar = [{
        name: "Logo",
        btns: ["FoxitLog"],
        width: 250
    }, {
        name: "Tools",
        btns: ["ToolBarSeparator", "HandTool", "TextTool"]
    }, {
        name: "document",
        btns: ["ToolBarSeparator", "First Page", "Prev Page", "Next Page", "Last Page", "GotoPage", "ToolBarSeparator"]
    }, {
        name: "Zoom",
        btns: ["FitWidth", "ZoomIn", "ZoomOut", "SelectZoom", "ToolBarSeparator"]
    }, {
        name: "Search",
        btns: ["SearchAllText", "SearchText", "SearchPrev", "SearchNext", "ToolBarSeparator"]
    }, {
        name: "DownloadPDF",
        btns: ["DownLoadPDF", "ToolBarSeparator"]
    }, {
        name: "Highlight",
        btns: ["Highlight", "ExportData", "ToolBarSeparator"]
    }, {
        name: "DocProperties",
        btns: ["PopupDocProperties", "ToolBarSeparator"]
    }, {
        name: "CommentAnnotTool",
        btns: ["ToolBarSeparator", "HighlightAnnot", "UnderlineAnnot"]
    }], d.Config.RibbonToolBar = {
        left: ["DownLoadPDF", "ToolBarSeparator", "HandTool", "TextTool"],
        right: ["SearchAllText", "SearchText", "SearchPrev", "SearchNext", "QRCode"]
    }, d.Config.RibbonStatusBar = {
        center: ["First Page", "Prev Page", "GotoPage", "Next Page", "Last Page"],
        right: ["FitWidth", "SelectZoom", "ZoomOut", "ZoomSlider", "ZoomIn"]
    }, d.Config.MenuBar = [{
        plugin: "document",
        items: [{
            item: "MenuZoom50",
            subitems: []
        }, {
            item: "MenuZoom75",
            subitems: []
        }, {
            item: "MenuZoom100",
            subitems: []
        }, {
            item: "MenuZoom125",
            subitems: []
        }, {
            item: "MenuZoom150",
            subitems: []
        }, {
            item: "MenuZoom200",
            subitems: []
        }, {
            item: "FitWidth",
            subitems: []
        }, {
            item: "MenuSeparator",
            subitems: []
        }, {
            item: "MenuPrevPage",
            subitems: []
        }, {
            item: "MenuNextPage",
            subitems: []
        }]
    }, {
        plugin: "DocProperties",
        items: [{
            item: "MenuSeparator",
            subitems: []
        }, {
            item: "MenuDocProperties",
            subitems: []
        }]
    }], d.Config.Plugins = {
        load: {
            Annot: !0,
            FindTool: !0,
            NavigationPanel: !0,
            Thumbnail: !0,
            Bookmark: !0,
            DocProperties: !0,
            ToolBar: !0,
            Menu: !0,
            Form: !0,
            TextSelection: !0,
            Print: !0,
            Signature: !0,
            InkSign: !0
        },
        flag: {
            FindTool: 1,
            Print: 2,
            Comments: 4,
            Thumbnail: 8,
            TextSelection: 16,
            Form: 32,
            Bookmark: 64,
            Menu: 128,
            Signature: 256,
            InkSign: 512
        }
    }, d.Config
}), define("core/ReaderApp", ["core/WebPDF", "core/Cavans/uupaa-color.mini", "core/Cavans/uupaa-excanvas", "core/Environment", "core/Config", "core/Support", "core/Math/Rect", "core/Math/Point", "core/Math/JSMap", "core/Math/Matrix", "core/CommonDialog", "core/Tools/Tools", "core/DataLevel", "core/PDFData/Dest", "core/Lang", "core/PDFView/MainFrame", "core/PDFView/PDFDocView", "core/PDFView/PDFPageView", "core/ViewLevel", "core/PDFView/LayoutInfo", "core/PDFView/ProgressiveViewerGenerator", "core/PDFView/PDFContinuousView", "core/PDFView/PDFSinglePageView", "core/PDFView/SinglePageViewLayout", "core/Common", "core/Event/IMainFrmEventHandler", "core/Event/Event", "core/Event/IMousePtHander", "core/Tools/HandToolHandler", "core/MenuItem", "core/PDFData/Text/TextManager", "core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage", "core/Plugins/Annot/BaseAnnotPlugin", "core/Plugins/Annot/AnnotHandleManager", "core/ImageEngine/AnnotUIManager", "core/ImageEngine/PDFAnnotationLoader", "core/Plugins/Annot/MarkupAnnotHandler", "core/Plugins/Annot/PopupMousePtHandler", "core/PDFData/TypewriterAnnot", "core/PDFData/Annot", "core/Interface", "core/Plugins/Annot/CommentAnnotHandler", "core/Plugins/Annot/CommonMarkupAnnotHandler", "core/Plugins/Annot/LinkAnnotHandler", "core/Plugins/Annot/TextAnnotHandler", "core/Plugins/Annot/TypewriterAnnotHandler", "core/Plugins/Annot/DrawingAnnotHandler", "core/Plugins/Annot/CommentsAnnot", "core/Plugins/Annot/AnnotMousePtHandler", "core/Plugins/Annot/AnnotSelectionTool", "core/Plugins/TextSelection/Reader_TextSelectTool", "core/Plugins/TextSelection/Reader_TextPageSelect", "core/Plugins/Annot/TextAnnotToolHandler", "core/PDFData/AnnotFactory", "core/PDFData/MarkupAnnot", "core/PDFData/LinkAnnot", "core/PDFData/Action", "core/PDFData/InkAnnot", "core/PDFData/Signature", "core/PDFData/InkSign", "core/Plugins/Annot/TypewriterAnnotToolHandler", "core/Plugins/Annot/CommentAnnotToolHandler", "core/Plugins/Annot/DrawingAnnotToolHandler", "core/Plugins/Annot/DrawingTools", "core/Plugins/Print/PrintConfig", "core/Plugins/Bookmark/Bookmark", "core/Plugins/Bookmark/PDFBookmark", "core/ImageEngine/PDFBookmarkLoader", "core/Plugins/FindTool/FindToolPlugin", "core/Plugins/FindTool/SearchResult", "core/Plugins/DocProperties/DocPropertiesPlugin", "core/Plugins/Form/FormPlugin", "core/Plugins/Form/ActionJScript", "core/Plugins/Form/jshint", "core/Plugins/Form/FormXMLParser", "core/Plugins/TextSelection/TextSelectionPlugin", "core/Plugins/TextSelection/TextSelectionToolHandler", "core/Plugins/Menu/MenuPlugin", "core/Plugins/Signature/SignaturePlugin", "core/Plugins/Signature/SignatureHandleManager", "core/ImageEngine/SignatureUIManager", "core/Plugins/Signature/NormalSigToolHandler", "core/Plugins/Signature/StraddleSigToolHandler", "core/Plugins/Signature/SignatureMouseHandler", "core/Plugins/InkSign/InkSignPlugin", "core/Plugins/InkSign/InkSignHandleManager", "core/ImageEngine/InkSignUIManager", "core/Plugins/InkSign/InkSignToolHandler", "core/ImageEngine/PDFInkSignLoader"], function(a, b, c) {
    function d(a, b) {
        function c() {
            d.on("touchstart touchmove touchend", function(a) {
                switch (a.type) {
                    case "touchstart":
                        if ("fx_doc_qrcode_image" != a.currentTarget.id && $("#fx_doc_qrcode_image").hide(), null != a.originalEvent.touches && 1 != a.originalEvent.touches.length) return;
                        var c = a.originalEvent.touches[0],
                            d = c.target;
                        if (e.Common.isElemInteractive(b, d)) return !0;
                        g.onLButtonDown(c), i = !0;
                        break;
                    case "touchmove":
                        if (null != a.originalEvent.touches && 1 != a.originalEvent.touches.length) return;
                        var c = a.originalEvent.touches[0];
                        if (e.Common.isElemInteractive(b, c.target)) return;
                        endX = c.pageX, endY = c.pageY, g.onMouseMove(c), a.preventDefault(), a.stopPropagation();
                        break;
                    case "touchend":
                        var c = a.originalEvent.changedTouches[0];
                        endX = c.pageX, endY = c.pageY, g.onLButtonUp({
                            pageX: endX,
                            pageY: endY
                        }), i = !1
                }
            });
            var a = new Hammer(d.get(0));
            a.add(new Hammer.Pinch);
            var c = 0;
            a.on("pinchin", function(a) {
                c = 1
            }), a.on("pinchout", function(a) {
                c = 2
            }), a.on("pinchend", function(a) {
                var b = h.getMainView().getDocView();
                1 == c ? b.zoomOut() : 2 == c && b.zoomIn(), c = 0
            }), a.on("doubletap", function(a) {
                g.onLButtonDbClick(a)
            }), a.on("press", function(a) {
                g.onHold(a), a.preventDefault()
            })
        }
        var d = $("#" + b.getMainFrameId()),
            g = this,
            h = b,
            i = !1,
            j = null,
            k = {
                onLButtonDown: ["onLButtonDown", "onLButtonDown"],
                onLButtonUp: ["onLButtonUp", "onLButtonUp"],
                onRButtonDown: ["onRButtonDown", "onRButtonDown"],
                onRButtonUp: ["onRButtonUp", "onRButtonUp"],
                onLButtonDbClick: ["onLButtonDblClk", "onLButtonDbClick"],
                onRButtonDbClick: ["onRButtonDblClk", "onRButtonDbClick"],
                onMouseMove: ["onMouseMove", "onMouseMove"],
                onMouseLeave: ["onMouseLeave", "onMouseLeave"],
                onMouseEnter: ["onMouseEnter", "onMouseEnter"],
                onMouseOver: ["onMouseOver", "onMouseOver"],
                onMouseOut: ["onMouseOut", "onMouseOut"],
                onDoubleTap: ["onDoubleTap", "onDoubleTap"],
                onPinchIn: ["onPinchIn", "onPinchIn"],
                onPinchOut: ["onPinchOut", "onPinchOut"],
                onHold: ["onHold", "onHold"]
            };
        $.each(k, function(a, b) {
            var c = b[0],
                d = b[1];
            g[a] = function(a) {
                var b = h.getCurToolHandler();
                if (b)
                    if (b.isProcessing()) b[c](a);
                    else {
                        var e = h[d](a);
                        e || b[c](a)
                    }
            }
        }), this.bind = function() {
            return f.mobile ? void c() : ($(document).keyup(function(a) {
                //Commented to resolve ETEXT-3916
                /*if (27 == a.keyCode) {
                    var b = h.getToolHandlerByName(e.Tools.TOOL_NAME_HAND);
                    h.setCurToolHandler(b)
                }*/
            }), $(document).bind("mouseup", function(a) {
                i && d.trigger("mouseup")
            }), d.off("mousedown").on("mousedown", function(a) {
                var c = a.target;
                if (0 == a.button || 1 == a.button) {
                    var d = h.getMainView().getDocView(),
                        f = d.getDocViewClientRect();
                    if (!e.RectUtils.ptInRect(f, a.pageX, a.pageY)) return !0;
                    if (e.Common.isElemInteractive(b, c)) return !0;
                    e.Common.preventDefaults(a, !0), c.setCapture ? (j = c, j.setCapture()) : window.captureEvents && window.captureEvents(Event.MOUSEUP), document.activeElement && $.isFunction(document.activeElement.blur), document.getElementById(d.getDocViewContainerID()).focus(), g.onLButtonDown(a), i = !0
                } else(2 == a.button || 3 == a.button) && g.onRButtonDown(a);
                return !0
            }), d.off("mousemove").on("mousemove", function(a) {
                return g.onMouseMove(a), !0
            }), d.off("mouseup").on("mouseup", function(a) {
                return !i && e.Common.isElemInteractive(b, a.target) ? !0 : (a.button && 0 != a.button && 1 != a.button ? (2 == a.button || 3 == a.button) && g.onRButtonUp(a) : (j && j.releaseCapture ? j.releaseCapture() : window.releaseEvents && window.releaseEvents(Event.MOUSEUP), g.onLButtonUp(a)), i = !1, j = null, !0)
            }), d.off("dblclick").on("dblclick", function(a) {
                return e.Common.isElemInteractive(b, a.target) ? !0 : (e.Common.preventDefaults(a, !0), 0 == a.button || 1 == a.button ? g.onLButtonDbClick(a) : (2 == a.button || 3 == a.button) && g.onRButtonDbClick(a), !0)
            }), d.off("mouseover").on("mouseover", function(a) {
                if (i) {
                    var b = $(a.target);
                    if (b.hasClass("fwrJspTrack")) return g.onLButtonUp(a), !1
                }
                g.onMouseOver(a)
            }), d.off("mouseout").on("mouseout", function(a) {
                g.onMouseOut(a)
            }), d.off("mouseleave").on("mouseleave", function(a) {
                g.onMouseLeave(a)
            }), void d.off("mouseenter").on("mouseenter", function(a) {
                g.onMouseEnter(a)
            }))
        }
    }
    var e = a("core/WebPDF");
    a("core/Cavans/uupaa-color.mini"), a("core/Cavans/uupaa-excanvas"), a("core/Environment");
    var f = e.Environment;
    a("core/Config"), a("core/Support");
    var g = e.Config;
    a("core/Math/Rect"), a("core/Math/Point"), a("core/Math/JSMap"), a("core/Math/Matrix"), a("core/CommonDialog"), a("core/Tools/Tools"), a("core/DataLevel"), a("core/PDFData/Dest");
    var h = (a("core/Lang"), a("core/PDFView/MainFrame"));
    a("core/PDFView/PDFDocView");
    $.support.canvas || (a("core/Cavans/uupaa-color.mini"), a("core/Cavans/uupaa-excanvas")), a("core/Event/IMainFrmEventHandler"), a("core/Event/IMousePtHander");
    var i = a("core/Tools/HandToolHandler"),
        j = a("core/MenuItem"),
        k = a("core/PDFView/LayoutInfo");
    return a("core/PDFData/Text/TextManager"), e.Tool = {
        readerApp: null,
        getReaderApp: function() {
            return e.Tool.readerApp
        },
        setReaderApp: function(a) {
            e.Tool.readerApp = a
        }
    }, e.EventList = {
        APP_READY: "ready",
        PAGE_VISIBLE: "pageVisible",
        PAGE_INVISIBLE: "pageInVisible",
        PAGE_SHOW_COMPLETE: "pageShowComplete",
        DOCUMENT_LOADED: "documentLoaded",
        DOCVIEW_PRE_RESIZE: "docViewPreResize",
        DOCVIEW_RESIZE: "docViewResized",
        DOCVIEW_SCROLL: "docViewScroll",
        DOCVIEW_ZOOM_CHANGED: "docViewZoomChanged",
        DOCVIEW_ROTATE_CHANGED: "docViewRotateChanged",
        DOCVIEW_PAGE_CHANGED: "pageChanged",
        MAINFRAME_RESIZE: "mainframeResized",
        TOOL_CHANGED: "toolChanged",
        LAYOUTSHOWMODE_CHANGED: "layoutShowModeChanged",
        DOC_MODIFY_STATE_CHANGED: "docModified",
        SEARCH_ALL_FINISHED: "searchAllFinished",
        SIGNATURE_ADD: "signatureAdd",
        SIGNATURE_PROPERTIES: "signatureProperties",
        INKSIGN_INIT: "inkSignInit",
        INKSIGN_SIGN: "inkSignSign",
        INKSIGN_TOOL_DEACTIVATE: "inkSignToolDeactivate"
    }, e.ReaderEngineType = {
        IMAGE: 0,
        HTML5: 1
    }, e.ConversionState = {
        SUCCESS: 0,
        INITIALIZE: 1,
        IN_PROGRESS: 2,
        SERVICE_BUSY: 3,
        CONVERSION_ERROR: 4,
        UNKNOWN_ERROR: 5
    }, e.PDFError = {
        ERROR_UNKNOWN: -1,
        ERROR_SUCCESS: 0,
        ERROR_PDFPARSE_FILE: 1,
        ERROR_PDFPARSE_FORMAT: 2,
        ERROR_PDFPARSE_PASSWORD: 3,
        ERROR_PDFPARSE_HANDLER: 4,
        ERROR_PDFPARSE_CERT: 5,
        ERROR_COM_CALL: 6,
        ERROR_EXCEPTION: 7,
        ERROR_MANIFEST_GET_ERROR: 8,
        ERROR_FILE_WRITE_ERROR: 9,
        ERROR_CREATE_IMAGE_ERROR: 10,
        ERROR_CREATE_TEXT_ERROR: 11,
        ERROR_CREATE_PATH_ERROR: 12,
        ERROR_PDFPARSE_PAGE_COUNT_EXCEED: 13,
        ERROR_CREAT_FORM_INFO_ERROR: 14,
        ERROR_CACHE_ERROR: 15,
        ERROR_LICENSE_ERROR: 16
    }, e.PDFDocType = {
        PDF: 1,
        FORM: 2,
        XFA: 3
    }, e.PDFPermission = {
        FPDFPERM_PRINT: 4,
        FPDFPERM_MODIFY: 8,
        FPDFPERM_EXTRACT: 16,
        FPDFPERM_ANNOT_FORM: 32,
        FPDFPERM_FILL_FORM: 256,
        FPDFPERM_EXTRACT_ACCESS: 512,
        FPDFPERM_ASSEMBLE: 1024,
        FPDFPERM_PRINT_HIGH: 2048
    }, e.ReaderApp = function(b, c, l, m, n, o, p) {
        function q(a, b) {
            ia = !1, na = a.val(), na = encodeURIComponent(na), ma = b, oa = g.defaults.maxManifestRetryCount, e.waiting(la, {}), t(na)
        }

        function r(a) {
            if ($.isPlainObject(a) && "undefined" != typeof a.error && "undefined" != typeof a.status) {
                var b = a.error;
                if (0 != b)
                    if (b == e.PDFError.ERROR_PDFPARSE_PASSWORD) e.closeWaiting(la), ja || (e.confirmPassword(la, "", i18n.t("ParseError.EnterPassword"), q), ja = !0), ia || ma.html("<span style='color:red'>" + i18n.t("ParseError.PasswordIncorrect") + "</span>");
                    else {
                        var c = a.status;
                        e.Common.isNeedRetry(c) ? (oa--, setTimeout(function() {
                            t.call(la, na, !0, oa)
                        }, g.defaults.requestRetryInterval)) : (ja = !1, e.endConfirmPassword(), e.closeWaiting(la), u(b, c))
                    }
            } else e.alert(la, i18n.t("CommonDialog.DefaultDlgTitle"), i18n.t("ParseError.LoadError")), e.closeWaiting(la)
        }

        function s(a, b) {
            if (e.closeWaiting(la), e.endConfirmPassword(), E.setReaderApp(la), !a) return void e.alert(la, i18n.t("CommonDialog.DefaultDlgTitle"), i18n.t("ParseError.LoadError"));
            try {
                A = a, ia = !0;
                var c = new k;
                G = new h(B, C, A, E, c, la), la.onResize();
                var d = A.hasPermission(e.PDFPermission.FPDFPERM_PRINT),
                    f = A.hasPermission(e.PDFPermission.FPDFPERM_ANNOT_FORM);
                M = A.hasPermission(e.PDFPermission.FPDFPERM_EXTRACT);
                var g = A.hasPermission(e.PDFPermission.FPDFPERM_ANNOT_FORM) && A.hasPermission(e.PDFPermission.FPDFPERM_MODIFY),
                    i = {
                        isAnnotForm: f,
                        isCopyText: M,
                        isPrint: d,
                        isCreateForm: g
                    };
                L = f ? D.readOnly : !0;
                var j = m.disablePrint;
                N = d ? !j : !1, document.getElementById(G.getDocView().getDocViewContainerID()).focus(), w(), v(), j && la.disablePrint();
                var l = la.getToolHandlerByName(e.Tools.TOOL_NAME_HAND);
                la.setCurToolHandler(l), pa = !0, H.init(), $(la).trigger(e.EventList.DOCUMENT_LOADED, {
                    plugins: D.plugins,
                    readOnly: D.readOnly,
                    disablePrint: j,
                    disableDownload: D.disableDownload,
                    docPermission: i
                }), $(la).trigger(e.EventList.DOCVIEW_PAGE_CHANGED, {
                    oldIndex: -1,
                    curIndex: 0
                })
            } catch (n) {
                return console.error(n), !1
            }
            return !0
        }

        function t(a, b) {
            return 0 >= oa ? (e.closeWaiting(la), void u(e.PDFError.ERROR_UNKNOWN, e.ConversionState.SERVICE_BUSY)) : void F.asyncLoadDocument(la, a, b, s, r)
        }

        function u(a, b) {
            var c = null,
                d = e.PDFError;
            switch (a) {
                case d.ERROR_COM_CALL:
                case d.ERROR_PDFPARSE_FILE:
                    e.alert(la, c, i18n.t("ParseError.FailToOpen"));
                    break;
                case d.ERROR_PDFPARSE_FORMAT:
                    e.alert(la, c, i18n.t("ParseError.ErrFormat"));
                    break;
                case d.ERROR_PDFPARSE_HANDLER:
                    e.alert(la, c, i18n.t("ParseError.ErrHandle"));
                    break;
                case d.ERROR_PDFPARSE_CERT:
                    e.alert(la, c, i18n.t("ParseError.ErrCert"));
                    break;
                case d.ERROR_PDFPARSE_PAGE_COUNT_EXCEED:
                    e.alert(la, c, i18n.t("ParseError.ErrPage"));
                    break;
                case d.ERROR_LICENSE_ERROR:
                    e.alert(la, c, i18n.t("ParseError.ErrLicenseExpired"));
                    break;
                default:
                    b == e.ConversionState.SERVICE_BUSY ? e.alert(la, c, i18n.t("ParseError.ServiceBusy")) : e.alert(la, c, i18n.t("ParseError.UnKnown") + b)
            }
        }

        function v() {
            $.each(W, function(a, b) {
                try {
                    b.init()
                } catch (c) {
                    console.error(c)
                }
                return !0
            })
        }

        function w() {
            var a = $("#" + G.getDocView().getDocViewContainerID());
            a.length <= 0 && $.error("Doc view container is not exist!"), new d(a, la).bind()
        }
        var x = b,
            y = c,
            z = "",
            A = null,
            B = l,
            C = n,
            D = m,
            E = p,
            F = o,
            G = null,
            H = null,
            I = "",
            J = x.split("/")[x.split("/").length - 2],
            K = null,
            L = !0,
            M = !1,
            N = !1,
            O = !1,
            P = !1,
            Q = !1,
            R = !1,
            S = !1,
            T = !1;
        this.setAnnotEventInit = function(a) {
            O = a
        }, this.isAnnotEventInit = function() {
            return O
        }, this.setMarkUpEventInit = function(a) {
            P = a
        }, this.isMarkUpEventInit = function() {
            return P
        }, this.setFindToolEventInit = function(a) {
            Q = a
        }, this.isFindToolEventInit = function() {
            return Q
        }, this.setSignatureEventInit = function(a) {
            R = a
        }, this.isSignatureEventInit = function() {
            return R
        }, this.setInkSignEventInit = function(a) {
            S = a
        }, this.isInkSignEventInit = function() {
            return S
        }, this.setTextSelectEventInit = function(a) {
            T = a
        }, this.isTextSelectEventInit = function() {
            return T
        }, this.setDocumentHandle = function(a) {
            F = a
        }, this.setPageViewRender = function(a) {
            E = a
        }, this.setOptions = function(a) {
            D = a
        }, $.ajax({
            url: m.baseUrl + "asserts/ip",
            type: "GET",
            async: !1,
            success: function(a) {
                I = a.result
            }
        });
        var U = new Date,
            V = function() {
                var a = function(a) {
                        return 10 > a ? "0" + a : a
                    },
                    b = U.getFullYear() + "-" + a(U.getMonth()) + "-" + a(U.getDate()) + " " + a(U.getHours()) + ":" + a(U.getMinutes()) + ":" + a(U.getSeconds());
                return b
            }(),
            W = {},
            X = [],
            Y = {},
            Z = null,
            _ = [],
            aa = {},
            ba = {},
            ca = {},
            da = !m.disableDownload,
            ea = !1,
            fa = null,
            ga = "x-auth-token",
            ha = 0,
            ia = !0,
            ja = !1,
            ka = null,
            la = this,
            ma = null,
            na = "",
            oa = 0,
            pa = !1,
            qa = [];
        this.isMobile = function() {
            var a = !1;
            return navigator.userAgent.match(/mobile|Android|iPhone|ios|iPod/i) && (a = !0), a
        }, this.getBookmark = function() {
            return H
        }, this.isDocLoaded = function() {
            return pa
        }, this.isDocumentCanBePrint = function() {
            return A.hasPermission(e.PDFPermission.FPDFPERM_PRINT)
        }, this.isEditable = function() {
            return !0
        }, this.getUrlConfig = function() {
            return _urlConfig
        }, this.addIgnoreMouseEventClass = function(a) {
            $.isArray(a) ? $.each(a, function(a, b) {
                la.addIgnoreMouseEventClass(b)
            }) : a && qa.push(a)
        }, this.getIgnoreMouseEventClasses = function() {
            return qa
        }, this.getAppId = function() {
            return B
        }, this.getMainFrameId = function() {
            return B
        }, this.getOptions = function() {
            return D
        }, this.setPlugin = function(a) {
            D.plugins = a
        }, this.setReadOnlyFlag = function(a) {
            D.readOnly = a
        }, this.isReadOnly = function() {
            return L
        }, this.isDisablePrint = function() {
            return !N
        }, this.isDisableDownload = function() {
            return D.disableDownload
        }, this.isCopyText = function() {
            return M
        }, this.setDisableDownloadFlag = function(a) {
            D.disableDownload = a
        }, this.setPrintFlag = function(a) {
            D.disablePrint = a
        }, this.isFormMode = function() {
            return D.formMode
        }, this.getBaseUrl = function() {
            return D.baseUrl
        }, this.isForm = function() {
            var a = e.Config.Plugins.load;
            return la.isFormMode() && a.Form === !0 && A.getDocType() == e.PDFDocType.FORM
        // }, this.setAccessToken = function(a) {
        //     _accessToken = a
        // }, this.getAccessToken = function() {
        //     return _accessToken
        }, this.registerBaseModule = function() {
            var b = new i;
            la.registerToolHandler(b);
            var c = e.Config.Plugins.load,
                d = e.Config.Plugins.flag;
            if (f.mobile) {
                if (c.Annot === !0 && D.plugins & d.Comments) {
                    var g = a("core/Plugins/Annot/BaseAnnotPlugin");
                    la.registerPlugin(g)
                }
                var h = a("core/Plugins/FindTool/FindToolPlugin");
                if (la.registerPlugin(h), c.TextSelection === !0) {
                    var j = a("core/Plugins/TextSelection/TextSelectionPlugin");
                    la.registerPlugin(j)
                }
                var k = a("core/Plugins/Bookmark/Bookmark");
                if (H = k.createBookmark(la), 1 == c.Print && D.plugins & d.Print) {
                    var l = a("core/Plugins/Print/PrintConfig");
                    la.registerPlugin(l)
                }
                if (c.Form === !0 && D.plugins & d.Form) {
                    var m = a("core/Plugins/Form/FormPlugin");
                    la.registerPlugin(m)
                }
                if (D.plugins & d.InkSign) {
                    var n = a("core/Plugins/InkSign/InkSignPlugin");
                    la.registerPlugin(n)
                }
                if (D.plugins & d.InkSign || D.plugins & d.Signature) {
                    var o = a("core/Plugins/Signature/SignaturePlugin");
                    la.registerPlugin(o)
                }
            } else {
                if (c.Annot === !0 && D.plugins & d.Comments) {
                    var g = a("core/Plugins/Annot/BaseAnnotPlugin");
                    la.registerPlugin(g)
                }
                if (1 == c.Print && D.plugins & d.Print) {
                    var l = a("core/Plugins/Print/PrintConfig");
                    la.registerPlugin(l)
                }
                var k = a("core/Plugins/Bookmark/Bookmark");
                if (H = k.createBookmark(la), c.FindTool === !0) {
                    var p = a("core/Plugins/FindTool/FindToolPlugin");
                    la.registerPlugin(p)
                }
                if (c.DocProperties === !0) {
                    var q = a("core/Plugins/DocProperties/DocPropertiesPlugin");
                    la.registerPlugin(q)
                }
                if (c.Form === !0 && D.plugins & d.Form) {
                    var m = a("core/Plugins/Form/FormPlugin");
                    la.registerPlugin(m)
                }
                if (c.TextSelection === !0) {
                    var j = a("core/Plugins/TextSelection/TextSelectionPlugin");
                    la.registerPlugin(j)
                }
                if (c.Menu === !0 && D.plugins & d.Menu) {
                    var r = a("core/Plugins/Menu/MenuPlugin");
                    la.registerPlugin(r)
                }
                if (D.plugins & d.Signature) {
                    var o = a("core/Plugins/Signature/SignaturePlugin");
                    la.registerPlugin(o)
                }
                if (D.plugins & d.InkSign) {
                    var n = a("core/Plugins/InkSign/InkSignPlugin");
                    la.registerPlugin(n)
                }
            }
        }, this.disablePrint = function() {
            var a = "body { display:none; }",
                b = document.head || document.getElementsByTagName("head")[0],
                c = document.createElement("style");
            c.type = "text/css", c.media = "print", c.styleSheet ? c.styleSheet.cssText = a : c.appendChild(document.createTextNode(a)), b.appendChild(c)
        }, this.canDownloadPDF = function() {
            return da
        }, this.setDownloadPDFPermission = function(a) {
            da = a
        }, this.getDocPermission = function() {
            return ha
        }, this.setDocPermission = function(a) {
            ha = a
        }, this.isTrail = function() {
            return ea
        }, this.setTrail = function(a) {
            ea = a
        }, this.getSessionId = function() {
            return fa
        }, this.setSessionId = function(a) {
            fa = a
        }, this.getSessionIdAuthHeader = function() {
            return ga
        }, this.print = function() {
            return la.getPluginByName(e.PrintPluginName).showPrintDlg()
        }, this.getTextManager = function() {
            return null == ka && (ka = new e.PDFData.Text.TextManager(la)), ka
        }, this.initInstance = function() {
            e.destructorDlg(), x = F.getDocId(), J = x.split("/")[x.split("/").length - 2], $.ajax({
                type: "GET",
                url: m.baseUrl + "api/file/info",
                data: {
                    fileId: J
                },
                success: function(a) {
                    y = a.fname, null != a.userName && "undefined" != a.userName && (z = a.userName)
                }
            }), $(la).trigger(e.EventList.APP_READY, {}), e.waiting(la, {}), oa = g.defaults.maxManifestRetryCount, t(null, !1)
        }, this.addMenuItem = function(a) {
            if (null == a) return !1;
            var b = new j(a);
            return ca[b.name] = b, !0
        }, this.getMenuItem = function(a) {
            return ca[a]
        }, this.addCommand = function(a) {
            if (null == a) return !1;
            var b = new CBaseCommand(la, a);
            return aa[b.GetCommandName()] = b, !0
        }, this.getCommand = function(a) {
            return aa[a]
        }, this.execCommand = function(a, b) {
            var c = la.GetCommand(a);
            return c.Execute(b)
        }, this.addCommandUI = function(a) {
            if (null == a) return !1;
            var b = new CCommandUI(la, a);
            return ba[b.name] = b, !0
        }, this.registerMainFrmEventHandler = function(a) {
            return a ? (_.push(a), !0) : !1
        }, this.unRegisterMainFrmEventHandler = function(a) {
            if (!a) return !1;
            for (var b = 0; b < _.length; b++)
                if (_[b] === a) return delete _[b], _.splice(b, 1), !0;
            return !1
        }, this.registerMousePtHandler = function(a) {
            return a ? (L || X.push(a), !0) : !1
        }, this.unRegisterMousePtHandler = function(a) {
            if (!a) return !1;
            for (var b = 0; b < X.length; b++)
                if (X[b] === a) return delete X[b], !0;
            return !1
        }, this.resetResouce = function() {
            ja = !1, ia = !0, $.each(W, function(a, b) {
                try {
                    b.unload(), delete b
                } catch (c) {
                    console.error(c)
                }
                return !0
            }), W = {}, ka && (delete ka, ka = null), $.each(_, function(a, b) {
                la.unRegisterMainFrmEventHandler(b)
            }), $.each(Y, function(a, b) {
                delete b
            }), Y = {}, Z = null, $.each(X, function(a, b) {
                la.unRegisterMousePtHandler(b)
            }), X.length = 0
        }, this.registerPlugin = function(a) {
            if (!a) return null;
            var b = a.createPlugin(la);
            if (null == b) return null;
            try {
                var c = b.getName();
                W[c] && $.error("The plugin '" + c + "' has been registered!"), W[c] = b, b.onRegister()
            } catch (d) {
                return console.error(d), null
            }
            return b
        }, this.getPluginByName = function(a) {
            return W[a]
        }, this.getFileID = function() {
            return J
        }, this.setFileID = function(a) {
            J = a
        }, this.getPDFPassword = function() {
            return na
        }, this.getFileName = function() {
            return y
        }, this.getUserName = function() {
            return z
        }, this.getOpenTime = function() {
            return V
        }, this.getIP = function() {
            return I
        }, this.getMainView = function() {
            return G
        }, this.getPDFDoc = function() {
            return A
        }, this.getDocView = function() {
            return la.getMainView().getDocView();
        }, this.onResize = function(a, b) {
            G && G.onResize(a, b), $(la).trigger(e.EventList.MAINFRAME_RESIZE, {})
        }, this.registerToolHandler = function(a) {
            if (!a) return !1;
            try {
                var b = a.getName();
                if (Y[b]) return !0;
                Y[b] = a, a.onInit(la)
            } catch (c) {
                return console.error(c), !1
            }
            return !0
        }, this.setCurToolHandler = function(a) {
            if (a) {
                var b = Z;
                b !== a && b && b.onDeactivate(), Z = a, b !== a && (Z && Z.onActivate(), $(la).trigger(e.EventList.TOOL_CHANGED, {
                    oldToolName: b ? b.getName() : "",
                    newToolName: Z ? Z.getName() : ""
                }))
            }
        }, this.setCurrentToolByName = function(a) {
            var b = la.getCurToolHandler(),
                c = la.getToolHandlerByName(a);
            c != b && null != c && la.setCurToolHandler(c)
        }, this.getCurToolHandler = function() {
            return Z
        }, this.getToolHandlerByName = function(a) {
            return Y[a]
        }, this.isCurrentHandTool = function() {
            var a = la.getToolHandlerByName(e.Tools.TOOL_NAME_HAND);
            return a === Z
        }, this.setModified = function(a, b, c) {
            b && b.setModified(c), a && a.setModified(c)
        }, this.getDocVersion = function() {
            return 0
        }, this.updateVersion = function(a) {}, this.getPixelsPerPoint = function() {
            return 96 / 72
        };
        var ra = {
            onLButtonDown: "onLButtonDown",
            onLButtonUp: "onLButtonUp",
            onLButtonDbClick: "onLButtonDblClk",
            onMouseMove: "onMouseMove",
            onRButtonDown: "onRButtonDown",
            onRButtonUp: "onRButtonUp",
            onRButtonDblClk: "onRButtonDblClk",
            onMouseWheel: "onMouseWheel",
            onMouseOver: "onMouseOver",
            onMouseOut: "onMouseOut",
            onMouseLeave: "onMouseLeave",
            onMouseEnter: "onMouseEnter",
            onDoubleTap: "onDoubleTap",
            onPinchIn: "onPinchIn",
            onPinchOut: "onPinchOut",
            onHold: "onHold"
        };
        $.each(ra, function(a, b) {
            la[a] = function(a) {
                var c = !1;
                return $.each(X, function(d, e) {
                    return c = e ? e[b](a) : !1, !c
                }), c
            }
        }), this.setWatermarkInfo = function(a) {
            K = a
        }, this.getWatermarkInfo = function() {
            return K
        }
    }, e.ReaderApp
}), define("core/Cavans/uupaa-color.mini", [], function(a, b, c) {
    var d;
    window.uu || (window.uu = function() {
        return d._impl.apply(this, arguments)
    }, window.uu.mix = function(a, b, c) {
        for (var e in b) a[e] = b[e];
        return c ? d.mix(a, c) : a
    }, window.uu.mix.param = function(a, b, c) {
        for (var e in b) !(e in a) && (a[e] = b[e]);
        return c ? d.mix.param(a, c) : a
    }, window.uuClass = {}, window.uuConst = {}), d = window.uu, uuClass.Color || (uuClass.Color = function(a, b, c, d) {
        this.construct.apply(this, arguments)
    }, d.color = function(a, b, c, d) {
        return new uuClass.Color(a, b, c, d)
    }, uuClass.ColorDictionary = function() {
        var a = this,
            b = arguments.callee;
        return b.instance || (b.instance = a, a.construct.apply(a, arguments)), b.instance
    }, function() {
        var a, b = parseInt,
            c = parseFloat,
            e = Math.round,
            f = uuClass.Color,
            g = "000000black,888888gray,ccccccsilver,ffffffwhite,ff0000red,ffff00yellow,00ff00lime,00ffffaqua,00ffffcyan,0000ffblue,ff00fffuchsia,ff00ffmagenta,880000maroon,888800olive,008800green,008888teal,000088navy,880088purple,696969dimgray,808080gray,a9a9a9darkgray,c0c0c0silver,d3d3d3lightgrey,dcdcdcgainsboro,f5f5f5whitesmoke,fffafasnow,708090slategray,778899lightslategray,b0c4delightsteelblue,4682b4steelblue,5f9ea0cadetblue,4b0082indigo,483d8bdarkslateblue,6a5acdslateblue,7b68eemediumslateblue,9370dbmediumpurple,f8f8ffghostwhite,00008bdarkblue,0000cdmediumblue,4169e1royalblue,1e90ffdodgerblue,6495edcornflowerblue,87cefalightskyblue,add8e6lightblue,f0f8ffaliceblue,191970midnightblue,00bfffdeepskyblue,87ceebskyblue,b0e0e6powderblue,2f4f4fdarkslategray,00ced1darkturquoise,afeeeepaleturquoise,f0ffffazure,008b8bdarkcyan,20b2aalightseagreen,48d1ccmediumturquoise,40e0d0turquoise,7fffd4aquamarine,e0fffflightcyan,00fa9amediumspringgreen,7cfc00lawngreen,00ff7fspringgreen,7fff00chartreuse,adff2fgreenyellow,2e8b57seagreen,3cb371mediumseagreen,66cdaamediumaquamarine,98fb98palegreen,f5fffamintcream,006400darkgreen,228b22forestgreen,32cd32limegreen,90ee90lightgreen,f0fff0honeydew,556b2fdarkolivegreen,6b8e23olivedrab,9acd32yellowgreen,8fbc8fdarkseagreen,9400d3darkviolet,8a2be2blueviolet,dda0ddplum,d8bfd8thistle,8b008bdarkmagenta,9932ccdarkorchid,ba55d3mediumorchid,da70d6orchid,ee82eeviolet,e6e6falavender,c71585mediumvioletred,bc8f8frosybrown,ff69b4hotpink,ffc0cbpink,ffe4e1mistyrose,ff1493deeppink,db7093palevioletred,e9967adarksalmon,ffb6c1lightpink,fff0f5lavenderblush,cd5c5cindianred,f08080lightcoral,f4a460sandybrown,fff5eeseashell,dc143ccrimson,ff6347tomato,ff7f50coral,fa8072salmon,ffa07alightsalmon,ffdab9peachpuff,ffffe0lightyellow,b22222firebrick,ff4500orangered,ff8c00darkorange,ffa500orange,ffd700gold,fafad2lightgoldenrodyellow,8b0000darkred,a52a2abrown,a0522dsienna,b8860bdarkgoldenrod,daa520goldenrod,deb887burlywood,f0e68ckhaki,fffacdlemonchiffon,d2691echocolate,cd853fperu,bdb76bdarkkhaki,bdb76btan,eee8aapalegoldenrod,f5f5dcbeige,ffdeadnavajowhite,ffe4b5moccasin,ffe4c4bisque,ffebcdblanchedalmond,ffefd5papayawhip,fff8dccornsilk,f5deb3wheat,faebd7antiquewhite,faf0e6linen,fdf5e6oldlace,fffaf0floralwhite,fffff0ivory",
            h = {
                ZERO: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                },
                BLACK: {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 1
                },
                WHITE: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 1
                }
            },
            i = {
                RGBAHash: function(a) {
                    return a
                },
                HEX: function(b) {
                    var c = a.dec2hex;
                    return ["#", c[b.r], c[b.g], c[b.b]].join("")
                },
                RGB: function(a) {
                    return "rgb(" + [a.r, a.g, a.b].join(",") + ")"
                },
                RGBA: function(a) {
                    return "rgba(" + [a.r, a.g, a.b, a.a].join(",") + ")"
                },
                HSVA: function(a) {
                    var b = f._rgba2hsva(a);
                    return "hsva(" + [(100 * b.h | 0) / 100, (100 * b.s | 0) / 100, (100 * b.v | 0) / 100, b.a].join(",") + ")"
                },
                HSLA: function(a) {
                    var b = f._rgba2hsla(a);
                    return "hsla(" + [(100 * b.h | 0) / 100, (100 * b.s | 0) / 100, (100 * b.l | 0) / 100, b.a].join(",") + ")"
                }
            },
            j = /^#(([\da-f])([\da-f])([\da-f]))(([\da-f])([\da-f]{2}))?$/,
            k = /(rgb[a]?)\s*\(\s*([0-9a-f\.%]+)\s*,\s*([0-9a-f\.%]+)\s*,\s*([0-9a-f\.%]+)(?:\s*,\s*([0-9\.]+))?\s*\)/,
            l = {
                number: 1,
                string: 2
            };
        uuClass.ColorDictionary.prototype = {
            construct: function() {
                this.name2hash = {}, this.dec2hex = Array(256), this.hex2dec = Array(256), this.hexAlphaCache = {}, this.hexAlphaCacheCount = 0;
                var a, c, d, e, h, i, j, k, l = g.split(",");
                for (a = 0; 16 > a; ++a)
                    for (c = 0; 16 > c; ++c) j = 16 * a + c, k = a.toString(16) + c.toString(16), this.dec2hex[j] = k, this.hex2dec[k] = j;
                for (a = 0, d = l.length; d > a; ++a) e = l[a], h = e.substring(0, 6), i = e.substring(6), this.name2hash[i] = {
                    rgba: f._toRGBAHash(b(h, 16), 1),
                    hex: "#" + h
                };
                this.name2hash.transparent = {
                    rgba: f._toRGBAHash(0, 0),
                    hex: "#000000"
                }
            },
            addColor: function(a) {
                for (var b, c, d = a.toLowerCase().replace(/^[\s;]*|[\s;]*$/g, "").split(";"), e = 0, g = d.length; g > e; ++e) b = d[e].split(":"), c = f._hash(b[1]), this.name2hash[b[0]] = {
                    rgba: c,
                    hex: i.HEX(c)
                }
            },
            clearCache: function(a) {
                this.hexAlphaCacheCount > a && (this.hexAlphaCache = {}, this.hexAlphaCacheCount = 0)
            }
        }, uuClass.Color.prototype = {
            construct: function(a, b, c, d) {
                this._lock = 0, this._stack = [], this.push(a, b, c, d)
            },
            push: function(a, b, c, e) {
                var g, h, i, j;
                if (void 0 !== a)
                    if (a instanceof f)
                        for (h = 0, i = a._stack.length; i > h; ++h) this._stack.push(d.mix({}, a._stack[h]));
                    else if (a instanceof Array)
                    for (h = 0, i = a.length; i > h; ++h)(g = f._hash(a[h])) && this._stack.push(g);
                else if ("string" == typeof a && a.indexOf(";") > -1)
                    for (j = a.toLowerCase().replace(/^[\s;]*|[\s;]*$/g, "").split(";"), h = 0, i = j.length; i > h; ++h)(g = f._hash(j[h])) && this._stack.push(g);
                else(g = f._hash(a, b, c, e)) && this._stack.push(g);
                return this
            },
            pop: function(a) {
                this.unlock();
                var b = a || "RGBAHash",
                    c = this._stack.pop() || h.ZERO;
                return i[b](c)
            },
            clear: function() {
                return this._stack = [], this.unlock()
            },
            size: function() {
                return this._stack.length
            },
            empty: function() {
                return !this._stack.length
            },
            top: function() {
                return this.ref(this._stack.length - 1)
            },
            bottom: function() {
                return this.ref(0)
            },
            ref: function(a) {
                return this._stack[this._ref(a)] || h.ZERO
            },
            _ref: function(a) {
                return void 0 !== a ? a : this._lock ? this._lock - 1 : this._stack.length ? this._stack.length - 1 : 0
            },
            copy: function(a) {
                return this._stack.push(this.ref(a)), this
            },
            lock: function() {
                return this._lock = this._stack.length, this
            },
            unlock: function() {
                return this._lock = 0, this
            },
            forEach: function(a, b, c) {
                for (var d, e = 0, f = this._stack.length, g = void 0 === c, h = i[c || "RGBAHash"]; f > e; ++e) d = g ? this._stack[e] : h(this._stack[e]), a.call(b, d, e, this);
                return this
            },
            hexEach: function(a, b) {
                return this.forEach(a, b, "HEX")
            },
            rgbaEach: function(a, b) {
                return this.forEach(a, b, "RGBA")
            },
            zero: function() {
                return this._stack.push(h.ZERO), this
            },
            black: function() {
                return this._stack.push(h.BLACK), this
            },
            white: function() {
                return this._stack.push(h.WHITE), this
            },
            hex: function(a) {
                return i.HEX(this.ref(a))
            },
            rgb: function(a) {
                return i.RGB(this.ref(a))
            },
            rgba: function(a) {
                return i.RGBA(this.ref(a))
            },
            hsva: function(a) {
                return i.HSVA(this.ref(a))
            },
            hsla: function(a) {
                return i.HSLA(this.ref(a))
            },
            toString: function() {
                return this.hex()
            },
            tone: function(a, b, c) {
                if (!a && !b && !c) return this.copy();
                var d = f._rgba2hsva(this.ref());
                return d.h += a, d.h = d.h > 360 ? d.h - 360 : d.h < 0 ? d.h + 360 : d.h, d.s += b, d.s = d.s > 100 ? 100 : d.s < 0 ? 0 : d.s, d.v += c, d.v = d.v > 100 ? 100 : d.v < 0 ? 0 : d.v, this._stack.push(f._hsva2rgba(d)), this
            },
            complementary: function() {
                var a = this.ref();
                return this._stack.push({
                    r: 255 ^ a.r,
                    g: 255 ^ a.g,
                    b: 255 ^ a.b,
                    a: a.a
                }), this
            },
            gray: function() {
                var a = this.ref();
                return this._stack.push({
                    r: a.g,
                    g: a.g,
                    b: a.g,
                    a: a.a
                }), this
            },
            sepia: function() {
                var a, b = this.ref(),
                    c = b.r,
                    d = b.g,
                    e = b.b,
                    f = .299 * c + .587 * d + .114 * e,
                    g = -.091,
                    h = .056;
                return c = f + 1.4026 * h, d = f - .3444 * g - .7114 * h, e = f + 1.733 * g, c *= 1.2, e *= .8, c = 0 > c ? 0 : c > 255 ? 255 : c, d = 0 > d ? 0 : d > 255 ? 255 : d, e = 0 > e ? 0 : e > 255 ? 255 : e, a = {
                    r: 0 | c,
                    g: 0 | d,
                    b: 0 | e,
                    a: b.a
                }, this._stack.push(a), this
            }
        }, d.mix(uuClass.Color, {
            _toDec: function(a) {
                var d = -1 === a.lastIndexOf("%") ? b(a) : 255 * c(a) / 100 | 0;
                return d > 255 ? 255 : d
            },
            _toRGBAHash: function(a, b) {
                return {
                    r: a >> 16 & 255,
                    g: a >> 8 & 255,
                    b: 255 & a,
                    a: b
                }
            },
            _hash: function(b, e, g, h) {
                if (void 0 === b || null === b) return 0;
                var i, m = l[typeof b] || 0,
                    n = a.name2hash,
                    o = a.hex2dec,
                    p = f._toDec;
                if (1 === m) return void 0 === e ? this._toRGBAHash(b, 1) : {
                    r: b,
                    g: e,
                    b: g,
                    a: void 0 === h ? 1 : h
                };
                if (2 === m) {
                    if (b = b.toLowerCase(), b in n) return n[b].rgba;
                    if (i = b.match(j)) return b.length > 4 ? {
                        r: o[i[2] + i[3]],
                        g: o[i[4] + i[6]],
                        b: o[i[7]],
                        a: 1
                    } : {
                        r: o[i[2] + i[2]],
                        g: o[i[3] + i[3]],
                        b: o[i[4] + i[4]],
                        a: 1
                    };
                    if (i = b.match(k)) return {
                        r: p(i[2]),
                        g: p(i[3]),
                        b: p(i[4]),
                        a: "rgba" === i[1] ? c(i[5]) : 1
                    }
                } else {
                    if ("r" in b) return d.mix({}, b);
                    if ("v" in b) return f._hsva2rgba(b);
                    if ("l" in b) return f._hsla2rgba(b)
                }
                return 0
            },
            _hexAlpha: function(b) {
                var d, e, g, h, i, m, n = a.hexAlphaCache,
                    o = a;
                if (2 === (l[typeof b] || 0)) {
                    if (b in n) return n[b];
                    h = o.name2hash, e = b.toLowerCase(), e in h ? (g = h[e], d = [g.hex, g.rgba.a]) : (g = e.match(j)) ? d = e.length > 4 ? [e, 1] : [
                        ["#", g[2], g[2], g[3], g[3], g[4], g[4]].join(""), 1
                    ] : (g = e.match(k)) ? (i = o.dec2hex, m = f._toDec, d = [
                        ["#", i[m(g[2])], i[m(g[3])], i[m(g[4])]].join(""), "rgba" === g[1] ? c(g[5]) : 1
                    ]) : d = ["#000000", 0], o.hexAlphaCache[b] = d, ++o.hexAlphaCacheCount
                } else d = ["#000000", 0];
                return d
            },
            _rgba2hsva: function(a) {
                var b = a.r / 255,
                    c = a.g / 255,
                    d = a.b / 255,
                    f = Math.max(b, c, d),
                    g = f - Math.min(b, c, d),
                    h = 0,
                    i = f ? e(g / f * 100) : 0,
                    j = e(100 * f);
                return i ? (h = b === f ? 60 * (c - d) / g : c === f ? 60 * (d - b) / g + 120 : 60 * (b - c) / g + 240, {
                    h: 0 > h ? h + 360 : h,
                    s: i,
                    v: j,
                    a: a.a
                }) : {
                    h: 0,
                    s: 0,
                    v: j,
                    a: a.a
                }
            },
            _hsva2rgba: function(a) {
                function b() {
                    var a = e,
                        b = a((1 - d) * f * 255),
                        c = a((1 - d * j) * f * 255),
                        h = a((1 - d * (1 - j)) * f * 255),
                        k = a(255 * f);
                    switch (i) {
                        case 0:
                            return {
                                r: k,
                                g: h,
                                b: b,
                                a: g
                            };
                        case 1:
                            return {
                                r: c,
                                g: k,
                                b: b,
                                a: g
                            };
                        case 2:
                            return {
                                r: b,
                                g: k,
                                b: h,
                                a: g
                            };
                        case 3:
                            return {
                                r: b,
                                g: c,
                                b: k,
                                a: g
                            };
                        case 4:
                            return {
                                r: h,
                                g: b,
                                b: k,
                                a: g
                            };
                        case 5:
                            return {
                                r: k,
                                g: b,
                                b: c,
                                a: g
                            }
                    }
                    return {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: g
                    }
                }
                var c = 360 === a.h ? 0 : a.h,
                    d = a.s / 100,
                    f = a.v / 100,
                    g = a.a,
                    h = c / 60,
                    i = 0 | h,
                    j = h - i;
                return d ? b() : (c = e(255 * f), {
                    r: c,
                    g: c,
                    b: c,
                    a: g
                })
            },
            _rgba2hsla: function(a) {
                var b = a.r / 255,
                    c = a.g / 255,
                    d = a.b / 255,
                    f = Math.max(b, c, d),
                    g = Math.min(b, c, d),
                    h = f - g,
                    i = 0,
                    j = 0,
                    k = (g + f) / 2;
                return k > 0 && 1 > k && (j = h / (.5 > k ? 2 * k : 2 - 2 * k)), h > 0 && (f === b && f !== c ? i += (c - d) / h : f === c && f !== d ? i += (d - b) / h + 2 : f === d && f !== b && (i += (b - c) / h + 4), i *= 60), {
                    h: i,
                    s: e(100 * j),
                    l: e(100 * k),
                    a: a.a
                }
            },
            _hsla2rgba: function(a) {
                var b, c, d, f, g, h, i, j = 360 === a.h ? 0 : a.h,
                    k = a.s / 100,
                    l = a.l / 100;
                return 120 > j ? (b = (120 - j) / 60, c = j / 60, d = 0) : 240 > j ? (b = 0, c = (240 - j) / 60, d = (j - 120) / 60) : (b = (j - 240) / 60, c = 0, d = (360 - j) / 60), f = 1 - k, g = 2 * k, b = g * (b > 1 ? 1 : b) + f, c = g * (c > 1 ? 1 : c) + f, d = g * (d > 1 ? 1 : d) + f, .5 > l ? (b *= l, c *= l, d *= l) : (h = 1 - l, i = 2 * l - 1, b = h * b + i, c = h * c + i, d = h * d + i), {
                    r: e(255 * b),
                    g: e(255 * c),
                    b: e(255 * d),
                    a: a.a
                }
            }
        }), a = new uuClass.ColorDictionary
    }())
}), define("core/Cavans/uupaa-excanvas", [], function(a, b, c) {
    uuClass.Canvas || (uuClass.Canvas = function(a, b) {
        var c = navigator.userAgent.toLowerCase();
        return !document.uniqueID || /trident/.test(c) ? a : uuClass.Canvas._initDynamicElement(a, b)
    }, uuClass.Canvas.xamlsrc = "#xaml", uuClass.Matrix = {
        identity: function() {
            return [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]
        },
        multiply: function(a, b) {
            var c, d, e, f, g = uuClass.Matrix.identity();
            for (c = 0; 3 > c; ++c)
                for (d = 0; 3 > d; ++d) {
                    for (f = 0, e = 0; 3 > e; ++e) f += a[c][e] * b[e][d];
                    g[c][d] = f
                }
            return g
        },
        translate: function(a, b) {
            return [
                [1, 0, 0],
                [0, 1, 0],
                [a, b, 1]
            ]
        },
        rotate: function(a) {
            var b = Math.cos(a),
                c = Math.sin(a);
            return [
                [b, c, 0],
                [-c, b, 0],
                [0, 0, 1]
            ]
        },
        scale: function(a, b) {
            return [
                [a, 0, 0],
                [0, b, 0],
                [0, 0, 1]
            ]
        },
        transform: function(a, b, c, d, e, f) {
            return [
                [a, b, 0],
                [c, d, 0],
                [e, f, 1]
            ]
        }
    }, Math.toDegrees || (Math.toDegrees = 180 / Math.PI), Math.toRadians || (Math.toRadians = Math.PI / 180), function() {
        function a(a) {
            var b, c = y;
            return (void 0 !== a && !a || !c.em) && (b = p.body.appendChild(p.createElement("div")), b.style.width = "12em", c.em = b.clientWidth / 12, b.style.height = "12pt", c.pt = b.clientHeight / 12, p.body.removeChild(b)), c
        }

        function b(a, b) {
            z || (z = p.createElement("div"), z.id = "uupaa-canvas-text-rect", z.style.cssText = "position:absolute;top:-9999px;left:-9999px;text-align:left;visibility:hidden;border:1px solid red", p.body.appendChild(z)), z.style.font = b, z.innerText = a;
            var c, d, e = z.getBoundingClientRect();
            return c = e.right - e.left, d = e.bottom - e.top, {
                w: s(c),
                h: s(d)
            }
        }

        function c(b) {
            var c, d = {
                FontStyle: "normal",
                FontVariant: "normal",
                FontWeight: "normal",
                FontSize: "medium",
                LineHeight: "1",
                FontFamily: ""
            };
            if ((c = b.match(/^(normal|italic|oblique)/)) && (d.FontStyle = c[1], b = b.slice(c[0].length)), (c = b.match(/^\s*(normal|small-caps)/)) && (d.FontVariant = c[1], b = b.slice(c[0].length)), (c = b.match(/^\s*(normal|bolder|bold|lighter|100|200|300|400|500|600|700|800|900)/)) && (d.FontWeight = c[1], b = b.slice(c[0].length)), c = b.match(/^\s*(xx-small|x-small|small|medium|large|x-large|xx-large|larger|smaller|[\d]+(px|em|pt))/)) {
                if (c[2]) switch (c[2]) {
                    case "px":
                        d.FontSize = r(c[1]);
                        break;
                    case "em":
                        d.FontSize = r(c[1]) * a().em;
                        break;
                    case "pt":
                        d.FontSize = r(c[1]) * a().pt
                } else d.FontSize = c[1];
                b = b.slice(c[0].length)
            }
            if (c = b.match(/^\s*\/\s*(normal|[\d\.]+(px|em|pt)|[\d\.]+)/)) {
                if (c[2]) switch (c[2]) {
                    case "px":
                        d.LineHeight = r(c[1]);
                        break;
                    case "em":
                        d.LineHeight = r(c[1]) * a().em;
                        break;
                    case "pt":
                        d.LineHeight = r(c[1]) * a().pt
                } else "normal" === c[1] && (c[1] = 1), d.LineHeight = c[1];
                b = b.slice(c[0].length)
            }
            return d.FontFamily = b.replace(/^\s*/, "").replace(/,/g, ",,").replace(/\"\'/g, ""), d
        }

        function d(a, b) {
            var c = 1,
                d = 0;
            return b ? 10 >= a ? (c = .8, d = 0) : 20 >= a ? (c = .92, d = 0) : 30 >= a ? (c = .97, d = 0) : 40 >= a ? (c = .98, d = 0) : 50 >= a ? (c = .98, d = -2) : 60 >= a ? (c = .99, d = -4) : (c = 1, d = 0) : 10 >= a ? (c = .88, d = 0) : 20 >= a ? (c = .9, d = -3) : 30 >= a ? (c = .93, d = -5) : 40 >= a ? (c = .97, d = -6) : 50 >= a ? (c = .98, d = -10) : 60 >= a ? (c = .98, d = -12) : 80 >= a ? (c = .98, d = -12) : 100 >= a ? (c = .98, d = -16) : 120 >= a ? (c = .99, d = -16) : 140 >= a ? (c = .99, d = -26) : (c = 1, d = -16), {
                scale: c,
                margin: d
            }
        }

        function e(a) {
            for (var b, c = "white", d = a; d && (!d.currentStyle || (c = d.currentStyle.backgroundColor, "transparent" === c));) d = d.parentNode;
            return b = x("transparent" === c ? "white" : c), b[0]
        }

        function f(a) {
            var b, c;
            (c = C[a.propertyName] || 0) && (b = a.srcElement, 1 === c ? (b.style.width = b.attributes.width.nodeValue + "px", uuClass.Canvas.ready() && b.getContext()._clear()) : (b.style.height = b.attributes.height.nodeValue + "px", uuClass.Canvas.ready() && b.getContext()._clear()))
        }

        function g(a) {
            var b = a.srcElement;
            b.firstChild && (b.firstChild.style.cssText = "width:" + b.clientWidth + "pxheight:" + b.clientHeight + "px")
        }

        function h(a) {
            var b, c = p.createElement(a.outerHTML);
            return a.parentNode ? a.parentNode.replaceChild(c, a) : c = a, c.getContext = function() {
                return c._ctx2d ? c._ctx2d : c._ctx2d = new i(c)
            }, c.attachEvent("onpropertychange", f), c.attachEvent("onresize", g), b = c.attributes, b.width && b.width.specified ? c.style.width = b.width.nodeValue + "px" : c.width = c.clientWidth, b.height && b.height.specified ? c.style.height = b.height.nodeValue + "px" : c.height = c.clientHeight, c
        }

        function i(a) {
            this.canvas = a, this.globalAlpha = 1, this.globalCompositeOperation = "source-over", this.strokeStyle = "#000000", this.fillStyle = "#000000", this.lineWidth = 1, this.lineCap = "butt", this.lineJoin = "miter", this.miterLimit = 10, this.shadowOffsetX = 0, this.shadowOffsetY = 0, this.shadowBlur = 0, this.shadowColor = "rgba(0,0,0,0)", this.font = "10px sans-serif", this.textAlign = "start", this.textBaseline = "alphabetic", this.xClearColor = "#ffffff", this.xClipStyle = "#ffffff", this.xFontScaleW = 1, this.xFontScaleH = .9, this.xTextMarginTop = 0, this.xType = "VML2D", this.contextReady = 1, this._lineScale = 1, this._scaleX = 1, this._scaleY = 1, this._mtxEffected = 0, this._zindex = -1, this._mtx = q.identity(), this._stack = [], this._path = [], this._clipPath = null, this._px = 0, this._py = 0, this._elm = a.appendChild(p.createElement("div")), this._elm.style.width = a.clientWidth + "px", this._elm.style.height = a.clientHeight + "px", this._elm.style.overflow = "hidden", this._elm.style.position = "absolute";
            var b = e(this._elm);
            this.xClearColor = b, this.xClipStyle = b, this._clipRect = this._rect(0, 0, this.canvas.width, this.canvas.height)
        }

        function j(a, b) {
            this._type = a, this._param = b, this._colorStop = []
        }

        function k(a, b) {
            switch (b = b || "repeat") {
                case "repeat":
                    break;
                default:
                    throw TypeError("bad argument")
            }
            if (this._type = 3, "src" in a) "uuIEBoostAlphapngSrc" in a ? this._src = a.uuIEBoostAlphapngSrc : this._src = a.src, this._repeat = b;
            else if ("getContext" in a) throw Error("not impl")
        }

        function l(a, b) {
            this.width = a, this.height = b
        }

        function m() {
            function a(a) {
                function b(a, b, e) {
                    return c[d(b.toLowerCase())] = d(e.toLowerCase())
                }
                var c = {},
                    d = o.decodeURIComponent;
                return a.replace(/^.*\?/, "").replace(/&amp;/g, "&").replace(/(?:([^\=]+)\=([^\&]+)&?)/g, b), c
            }
            var b = p.getElementById("uupaa-excanvas.js");
            b && -1 !== b.src.indexOf("?") && uu.mix(B, a(b.src.slice(b.src.indexOf("?") + 1)))
        }

        function n() {
            var a = navigator.userAgent.toLowerCase();
            if (p.uniqueID && /msie/.test(a) && document.all) {
                if (/msie/.test(a) && !/opera/.test(a)) {
                    var b = parseFloat(a.match(/msie (\d+)/)[1]),
                        c = "BackCompat" == document.compatMode,
                        d = !!document.documentMode && document.documentMode < 9,
                        e = 8 == document.documentMode,
                        f = 7 == b && !document.documentMode || 7 == document.documentMode,
                        g = 7 > b || c;
                    (e || f || g || d) && (p.namespaces.v || p.namespaces.add("v", "urn:schemas-microsoft-com:vml"), p.namespaces.o || p.namespaces.add("o", "urn:schemas-microsoft-com:office:office"), p.createStyleSheet().cssText = "canvas{display:inline-block;text-align:left;width:300px;height:150px}v\\:*{behavior:url(#default#VML)} .uvml{behavior: url(#default#VML);}o\\:*{behavior:url(#default#VML)}")
                }
                o.CanvasError = function(a, b) {
                    var c = p.getElementById("output");
                    c && (c.innerHTML = ["type=", b.ErrorType, "code=", b.ErrorCode, "msg=", b.ErrorMessage].join(" "))
                }, p.attachEvent("onreadystatechange", function() {
                    if (/loaded|complete/.test(p.readyState)) {
                        var a, b = p.getElementsByTagName("canvas"),
                            c = 0,
                            d = b.length,
                            e = 0,
                            f = 0;
                        if (d)
                            for (; d > c; ++c) a = b[c], a.getContext || (" " + a.className + " ").indexOf(" vml ") > -1 && (h(a), ++e);
                        f || ++A
                    }
                })
            } else o.opera ? o.addEventListener("load", function() {
                ++A
            }, !1) : /WebKit/.test(navigator.userAgent) && p.readyState ? ! function() {
                return /loaded|complete/.test(p.readyState) ? void++A : void setTimeout(arguments.callee, 16)
            }() : /Gecko\//.test(navigator.userAgent) ? p.addEventListener("DOMContentLoaded", function() {
                ++A
            }, !1) : ++A
        }
        var o = window,
            p = document,
            q = uuClass.Matrix,
            r = parseInt,
            s = Math.round,
            t = Math.sin,
            u = Math.cos,
            v = 10,
            w = v / 2,
            x = (new uuClass.ColorDictionary, uuClass.Color._hexAlpha),
            y = {
                em: 0,
                pt: 0
            },
            z = null,
            A = 0,
            B = {
                xamlsrc: uuClass.Canvas.xamlsrc
            },
            C = {
                width: 1,
                height: 2
            },
            D = {
                "source-over": 1,
                "destination-over": 5,
                copy: 11
            },
            E = {
                start: 1,
                left: 1,
                center: 2,
                right: 3,
                end: 3
            },
            F = {
                strokeStyle: 1,
                fillStyle: 1,
                globalAlpha: 1,
                lineWidth: 1,
                lineCap: 1,
                lineJoin: 1,
                miterLimit: 1,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowBlur: 1,
                shadowColor: 1,
                globalCompositeOperation: 1,
                font: 1,
                textAlign: 1,
                textBaseline: 1,
                _lineScale: 1,
                _scaleX: 1,
                _scaleY: 1,
                _mtxEffected: 1,
                _clipPath: 1
            },
            G = {
                square: "square",
                butt: "flat",
                round: "round"
            };
        uuClass.Canvas.ready = function(a, b) {
            var c, d, e, f;
            if (b) {
                if (!p.uniqueID) return void a();
                d = b instanceof Array ? b : [b], e = 0, f = d.length, c = o.setInterval(function() {
                    for (e = 0; f > e; ++e)
                        if (!d[e].getContext().contextReady) return;
                    clearInterval(c), null != a && a()
                }, 16)
            } else c = o.setInterval(function() {
                A && (clearInterval(c), null != a && a())
            }, 16)
        }, uuClass.Canvas.already = function(a) {
            if (a) {
                if (!p.uniqueID) return !0;
                for (var b = a instanceof Array ? a : [a], c = 0, d = b.length; d > c; ++c)
                    if (!b[c].getContext().contextReady) return !1;
                return !0
            }
            return !!A
        }, uuClass.Canvas._initDynamicElement = function(a, b) {
            return b ? a.getContext ? a : h(a) : a.getContext ? a : null
        }, i.prototype = {
            save: function() {
                var a, b = {};
                for (a in F) b[a] = this[a];
                this._stack.push([b, uu.mix([], this._mtx), this._clipPath ? String(this._clipPath) : null])
            },
            restore: function() {
                if (this._stack.length) {
                    var a, b = this._stack.pop();
                    for (a in F) this[a] = b[0][a];
                    this._mtx = b[1], this._clipPath = b[2]
                }
            },
            scale: function(a, b) {
                ++this._mtxEffected, this._mtx = q.multiply(q.scale(a, b), this._mtx), this._scaleX *= a, this._scaleY *= b, this._lineScale = (this._mtx[0][0] + this._mtx[1][1]) / 2
            },
            rotate: function(a) {
                ++this._mtxEffected, this._mtx = q.multiply(q.rotate(a), this._mtx)
            },
            translate: function(a, b) {
                ++this._mtxEffected, this._mtx = q.multiply(q.translate(a, b), this._mtx)
            },
            transform: function(a, b, c, d, e, f) {
                this._mtx = q.multiply(q.transform(a, b, c, d, e, f), this._mtx)
            },
            setTransform: function(a, b, c, d, e, f) {
                this._mtx = q.transform(a, b, c, d, e, f)
            },
            clearRect: function(a, b, c, d) {
                if (a || b || c != parseInt(this.canvas.width) || d != parseInt(this.canvas.height)) {
                    var e, f = s,
                        g = this._map(a, b),
                        h = this._map(a + c, b),
                        i = this._map(a + c, b + d),
                        j = this._map(a, b + d),
                        k = [" m", f(g.x), " ", f(g.y), " l", f(h.x), " ", f(h.y), " l", f(i.x), " ", f(i.y), " l", f(j.x), " ", f(j.y), " x"].join(""),
                        l = 0,
                        m = x(this.xClearColor),
                        n = m[0],
                        o = m[1] * this.globalAlpha;
                    switch (D[this.globalCompositeOperation] || 1) {
                        case 5:
                            l = --this._zindex;
                            break;
                        case 11:
                            this._clear()
                    }
                    e = ['<v:shape class=uvml style="z-index:', l, ';position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', k, '"><v:fill class=uvml type="solid" color="', n, '" opacity="', o, '" /></v:shape>'].join(""), this._elm.insertAdjacentHTML("beforeEnd", this._clipPath ? this._clippy(e) : e)
                } else this._elm.innerHTML = "", this._zindex = 0
            },
            _clear: function() {
                this._elm.innerHTML = "", this._zindex = 0
            },
            fillRect: function(a, b, c, d) {
                var e = this._rect(a, b, c, d);
                this._path = [e], this._px = a, this._py = b, e === this._clipRect && "string" == typeof this.fillStyle && (this.xClipStyle = this.fillStyle), this.fill()
            },
            strokeRect: function(a, b, c, d) {
                this._path = [], this.rect(a, b, c, d), this.stroke()
            },
            beginPath: function() {
                this._path = []
            },
            closePath: function() {
                this._path.push(" x")
            },
            moveTo: function(a, b) {
                var c = s,
                    d = this._map(a, b);
                this._path.push("m ", c(d.x), " ", c(d.y)), this._px = a, this._py = b
            },
            lineTo: function(a, b) {
                var c = s,
                    d = this._map(a, b);
                this._path.push("l ", c(d.x), " ", c(d.y)), this._px = a, this._py = b
            },
            quadraticCurveTo: function(a, b, c, d) {
                var e = s,
                    f = this._px + 2 / 3 * (a - this._px),
                    g = this._py + 2 / 3 * (b - this._py),
                    h = f + (c - this._px) / 3,
                    i = g + (d - this._py) / 3,
                    j = this._map(c, d),
                    k = this._map(f, g),
                    l = this._map(h, i);
                this._path.push("c ", e(k.x), " ", e(k.y), " ", e(l.x), " ", e(l.y), " ", e(j.x), " ", e(j.y)), this._px = c, this._py = d
            },
            bezierCurveTo: function(a, b, c, d, e, f) {
                var g = s,
                    h = this._map(e, f),
                    i = this._map(a, b),
                    j = this._map(c, d);
                this._path.push("c ", g(i.x), " ", g(i.y), " ", g(j.x), " ", g(j.y), " ", g(h.x), " ", g(h.y)), this._px = e, this._py = f
            },
            arcTo: function(a, b, c, d, e) {},
            rect: function(a, b, c, d) {
                this._path.push(this._rect(a, b, c, d)), this._px = a, this._py = b
            },
            _rect: function(a, b, c, d) {
                var e = s,
                    f = this._map(a, b),
                    g = this._map(a + c, b),
                    h = this._map(a + c, b + d),
                    i = this._map(a, b + d);
                return [" m", e(f.x), " ", e(f.y), " l", e(g.x), " ", e(g.y), " l", e(h.x), " ", e(h.y), " l", e(i.x), " ", e(i.y), " x"].join("")
            },
            arc: function(a, b, c, d, e, f) {
                c *= v;
                var g, h, i, j, k, l = s,
                    m = a + u(d) * c - w,
                    n = b + t(d) * c - w,
                    o = a + u(e) * c - w,
                    p = b + t(e) * c - w;
                m !== o || f || (m += .125), g = this._map(a, b), h = this._map(m, n), i = this._map(o, p), j = this._scaleX * c, k = this._scaleY * c, this._path.push(f ? "at " : "wa ", l(g.x - j), " ", l(g.y - k), " ", l(g.x + j), " ", l(g.y + k), " ", l(h.x), " ", l(h.y), " ", l(i.x), " ", l(i.y))
            },
            fill: function() {
                var a = "",
                    b = this._path.join("");
                if ("string" == typeof this.fillStyle) a = this._fill(this.fillStyle, b);
                else switch (this.fillStyle._type) {
                    case 1:
                        a = this._linearGradientFill(this.fillStyle, b);
                        break;
                    case 2:
                        a = this._radialGradientFill(this.fillStyle, b);
                        break;
                    case 3:
                        a = this._patternFill(this.fillStyle, b)
                }
                a && this._elm.insertAdjacentHTML("beforeEnd", this._clipPath ? this._clippy(a) : a), this._path = []
            },
            _fill: function(a, b, c) {
                var d = x(a),
                    e = d[0],
                    f = d[1] * this.globalAlpha,
                    g = 0;
                switch (D[this.globalCompositeOperation] || 1) {
                    case 5:
                        g = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', g, ';position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', b, '"><v:fill class=uvml type="solid" color="', e, '" opacity="', c || f, '" />', "</v:shape>"].join("")
            },
            _linearGradientFill: function(a, b, c) {
                var d = a._param,
                    e = this._buildColor(a._colorStop),
                    f = this.globalAlpha,
                    g = 0,
                    h = Math.atan2(Math.pow(d.x1 - d.x0, 2), Math.pow(d.y1 - d.y0, 2)) * Math.toDegrees;
                switch (d.x0 > d.x1 && (h += 90), d.y0 > d.y1 && (h += 90), h >= 360 && (h -= 360), D[this.globalCompositeOperation] || 1) {
                    case 5:
                        g = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', g, ';position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', b, '"><v:fill class=uvml type="gradient" method="sigma" focus="0%" colors="', e, '" opacity="', c || f, '" angle="', h, '" /></v:shape>'].join("")
            },
            _radialGradientFill: function(a, b, c) {
                var d, e, f, g, h = [],
                    i = a._param,
                    j = this._buildColor(a._colorStop),
                    k = this.globalAlpha,
                    l = 0,
                    m = 0,
                    n = i.x1 - i.r1,
                    o = i.y1 - i.r1,
                    p = i.r1 * this._scaleX,
                    q = i.r1 * this._scaleY,
                    r = this._map(n, o);
                switch (d = i.r0 / i.r1, e = (1 - d + (i.x0 - i.x1) / i.r1) / 2, f = (1 - d + (i.y0 - i.y1) / i.r1) / 2, D[this.globalCompositeOperation] || 1) {
                    case 5:
                        l = --this._zindex, m = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return a._colorStop.length && (g = a._colorStop[0], g.color[1] > .001 && h.push('<v:shape class=uvml style="z-index:', m, ';position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', b, '"><v:fill class=uvml type="solid" color="', g.color[0], '" opacity="', c || g.color[1] * k, '" /></v:shape>')), h.push('<v:oval class=uvml style="z-index:', l, ";position:absolute;left:", s(r.x / v), "px;top:", s(r.y / v), "px;width:", p, "px;height:", q, 'px" stroked="f" coordorigin="0,0" coordsize="11000,11000"><v:fill class=uvml type="gradientradial" method="sigma" focussize="', d, ",", d, '" focusposition="', e, ",", f, '" opacity="', c || k, '" colors="', j, '" /></v:oval>'), h.join("")
            },
            _patternFill: function(a, b, c) {
                var d = a._src,
                    e = this.globalAlpha,
                    f = 0;
                switch (D[this.globalCompositeOperation] || 1) {
                    case 5:
                        f = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', f, ';position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', b, '"><v:fill class=uvml type="tile" opacity="', c || e, '" src="', d, '" /></v:shape>'].join("")
            },
            stroke: function() {
                var a = "";
                if ("string" == typeof this.strokeStyle) a = this._stroke(this.strokeStyle);
                else switch (this.strokeStyle._type) {
                    case 1:
                        a = this._linearGradientStroke(this.strokeStyle);
                        break;
                    case 2:
                        a = this._radialGradientStroke(this.strokeStyle);
                        break;
                    case 3:
                        a = this._patternStroke(this.strokeStyle)
                }
                a && this._elm.insertAdjacentHTML("beforeEnd", this._clipPath ? this._clippy(a) : a), this._path = []
            },
            _stroke: function(a) {
                var b = x(a),
                    c = b[0],
                    d = b[1] * this.globalAlpha,
                    e = this._path.join(""),
                    f = 0,
                    g = this.lineWidth * this._lineScale,
                    h = this.lineJoin,
                    i = this.miterLimit,
                    j = G[this.lineCap] || "square";
                switch (D[this.globalCompositeOperation] || 1) {
                    case 5:
                        f = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', f, ';position:absolute;width:10px;height:10px" filled="f" stroked="t" coordorigin="0,0" coordsize="100,100" path="', e, '"><v:stroke class=uvml color="', c, '" weight="', g, 'px" endcap="', j, '" opacity="', d, '" joinstyle="', h, '" miterlimit="', i, '" /></v:shape>'].join("")
            },
            _linearGradientStroke: function(a) {
                var b = a._param,
                    c = this._path.join(""),
                    d = 0,
                    e = this._buildColor(a._colorStop),
                    f = this.globalAlpha,
                    g = this.lineWidth * this._lineScale,
                    h = this.lineJoin,
                    i = this.miterLimit,
                    j = G[this.lineCap] || "square",
                    k = Math.atan2(Math.pow(b.x1 - b.x0, 2), Math.pow(b.y1 - b.y0, 2)) * Math.toDegrees;
                switch (b.x0 > b.x1 && (k += 90), b.y0 > b.y1 && (k += 90), k >= 360 && (k -= 360), D[this.globalCompositeOperation] || 1) {
                    case 5:
                        d = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', d, ';position:absolute;width:10px;height:10px" filled="f" stroked="t" coordorigin="0,0" coordsize="100,100" path="', c, '"><v:stroke class=uvml filltype="solid" colors="', e, '" angle="', k, '" weight="', g, 'px" endcap="', j, '" opacity="', f, '" joinstyle="', h, '" miterlimit="', i, '" /></v:shape>'].join("")
            },
            _radialGradientStroke: function(a) {
                var b, c, d = [],
                    e = a._param,
                    f = 0,
                    g = 0,
                    h = this.lineWidth * this._lineScale,
                    i = this.lineJoin,
                    j = this.miterLimit,
                    k = G[this.lineCap] || "square",
                    l = e.x1 - e.r1,
                    m = e.y1 - e.r1,
                    n = e.r1 * this._scaleX,
                    o = e.r1 * this._scaleY,
                    p = this._map(l, m);
                switch (D[this.globalCompositeOperation] || 1) {
                    case 5:
                        f = --this._zindex, g = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return a._colorStop.length && (b = a._colorStop[0], b.color[1] > .001 && (c = this._path.join(""), d.push('<v:shape class=uvml style="z-index:', g, ';position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', c, '"><v:fill class=uvml type="solid" color="', b.color[0], '" opacity="', b.color[1] * this.globalAlpha, '" /></v:shape>')), b = a._colorStop[s(a._colorStop.length / 2) - 1], d.push('<v:oval class=uvml style="z-index:', f, ";position:absolute;left:", s(p.x / v), "px;top:", s(p.y / v), "px;width:", n, "px;height:", o, 'px" stroked="t" coordorigin="0,0" coordsize="11000,11000">', '<v:stroke class=uvml filltype="tile" weight="', h, 'px" endcap="', k, '" joinstyle="', i, '" miterlimit="', j, ",", '" opacity="', b.color[1] * this.globalAlpha, '" color="', b.color[0], '" /></v:oval>')), d.join("")
            },
            _patternStroke: function(a) {
                var b = this._path.join(""),
                    c = 0,
                    d = a._src,
                    e = this.globalAlpha,
                    f = this.lineWidth * this._lineScale,
                    g = this.lineJoin,
                    h = this.miterLimit,
                    i = G[this.lineCap] || "square";
                switch (D[this.globalCompositeOperation] || 1) {
                    case 5:
                        c = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', c, ';position:absolute;width:10px;height:10px" filled="f" stroked="t" coordorigin="0,0" coordsize="100,100" path="', b, '"><v:stroke class=uvml filltype="tile" weight="', f, 'px" endcap="', i, '" opacity="', e, '" joinstyle="', g, '" miterlimit="', h, '" src="', d, '" /></v:shape>'].join("")
            },
            clip: function() {
                this._clipPath = this._clipRect + " x " + this._path.join("")
            },
            _clippy: function(a) {
                return [a, '<v:shape class=uvml style="position:absolute;width:10px;height:10px" filled="t" stroked="f" coordorigin="0,0" coordsize="100,100" path="', this._clipPath, '"><v:fill class=uvml type="solid" color="', this.xClipStyle, '" />', "</v:shape>"].join("")
            },
            isPointInPath: function(a, b) {},
            fillText: function(a, b, c, d) {
                var e;
                if ("string" == typeof this.fillStyle) e = this._fillText(a, b, c, d, this.fillStyle);
                else switch (this.fillStyle._type) {
                    case 1:
                        e = this._linearGradientFillText(a, b, c, d, this.fillStyle);
                        break;
                    case 2:
                        e = this._radialGradientFillText(a, b, c, d, this.fillStyle);
                        break;
                    case 3:
                        e = this._patternFillText(a, b, c, d, this.fillStyle)
                }
                e && this._elm.insertAdjacentHTML("beforeEnd", this._clipPath ? this._clippy(e) : e)
            },
            _fillText: function(a, e, f, g, h) {
                a = a.replace(/( |\t|\v|\f|\r\n|\r|\n)/g, " ");
                var i, j, k, l = x(h),
                    m = l[0],
                    n = l[1] * this.globalAlpha,
                    o = 0,
                    p = E[this.textAlign] || 1,
                    q = b(a, this.font),
                    r = 0;
                switch (k = d(c(this.font).FontSize, 1), i = q.w * this.xFontScaleW, j = q.h * this.xFontScaleH * k.scale, 2 === p ? r = i / 2 : 3 === p && (r = i), D[this.globalCompositeOperation] || 1) {
                    case 5:
                        o = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', o, ";position:absolute;width:", i, "px;height:", j, "px;left:", e - r, "px;top:", f + this.xTextMarginTop + k.margin, 'px;" stroked="f" coordSize="21600,21600" o:spt="136" strokeColor="', m, '" fillColor="', m, ' opacity="', n, '">', '<v:textpath class=uvml style="font:', this.font, '" string="', a, '" />', "</v:shape>"].join("")
            },
            strokeText: function(a, b, c, d) {
                var e;
                "string" == typeof this.fillStyle && (e = this._strokeText(a, b, c, d, this.strokeStyle)), e && this._elm.insertAdjacentHTML("beforeEnd", this._clipPath ? this._clippy(e) : e)
            },
            _strokeText: function(a, e, f, g, h) {
                a = a.replace(/( |\t|\v|\f|\r\n|\r|\n)/g, " ");
                var i, j, k, l = x(h),
                    m = l[0],
                    n = l[1] * this.globalAlpha,
                    o = 0,
                    p = b(a, this.font),
                    q = E[this.textAlign] || 1,
                    r = 0;
                switch (k = d(c(this.font).FontSize, 1), i = p.w * this.xFontScaleW, j = p.h * this.xFontScaleH * k.scale, 2 === q ? r = i / 2 : 3 === q && (r = i), D[this.globalCompositeOperation] || 1) {
                    case 5:
                        o = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return ['<v:shape class=uvml style="z-index:', o, ";position:absolute;width:", i, "px;height:", j, "px;left:", e - r, "px;top:", f + this.xTextMarginTop + k.margin, 'px;" stroked="t" filled="f" coordSize="21600,21600" o:spt="136" strokeColor="', m, '" fillColor="', m, ' opacity="', n, '">', '<v:textpath class=uvml style="font:', this.font, '" string="', a, '" />', "</v:shape>"].join("")
            },
            measureText: function(a) {
                var c = b(a, this.font),
                    d = c.w * this.xFontScaleW,
                    e = c.h * this.xFontScaleH;
                return new l(d, e)
            },
            drawImage: function(a) {
                var b, c, d, e, f, g, h, i, j, k, l, m = "",
                    n = arguments;
                if ("src" in a) {
                    switch (j = a.width, k = a.height, n.length) {
                        case 3:
                            b = n[1], c = n[2], d = j, e = k, f = 0, g = 0, h = j, i = k, l = "image";
                            break;
                        case 5:
                            b = n[1], c = n[2], d = n[3], e = n[4], f = 0, g = 0, h = j, i = k, l = "scale";
                            break;
                        case 9:
                            b = n[5], c = n[6], d = n[7], e = n[8], f = n[1], g = n[2], h = n[3], i = n[4], l = "scale";
                            break;
                        default:
                            throw TypeError("CanvasRenderingContext2D.drawImage")
                    }
                    m = this._drawImage(a, f, g, h, i, b, c, d, e, j, k, l), this._elm.insertAdjacentHTML("beforeEnd", this._clipPath ? this._clippy(m) : m)
                }
            },
            _drawImage: function(a, b, c, d, e, f, g, h, i, j, k, l) {
                function m(a, b, c, d) {
                    var e = n._mtx,
                        f = s,
                        g = n._map(a, b),
                        h = n._map(a + c, b),
                        i = n._map(a, b + d),
                        j = n._map(a + c, b + d),
                        k = ["M11='", e[0][0], "',M12='", e[1][0], "',M21='", e[0][1], "',M22='", e[1][1], "',Dx='", f(g.x / v), "',Dy='", f(g.y / v), "'"],
                        l = ["padding:0 ", f(Math.max(g.x, h.x, i.x, j.x) / v), "px ", f(Math.max(g.y, h.y, i.y, j.y) / v), "px 0;", "filter:progid:DXImageTransform.Microsoft.Matrix(", k.join(""), ",sizingmethod='clip')"];
                    return l.join("")
                }
                var n = this,
                    o = [],
                    p = s,
                    q = this._map(f, g),
                    r = 0,
                    t = "filter:progid:DxImageTransform.Microsoft",
                    w = b || c;
                switch (D[this.globalCompositeOperation] || 1) {
                    case 5:
                        r = --this._zindex;
                        break;
                    case 11:
                        this._clear()
                }
                return this._mtxEffected ? o.push('<div style="z-index:', r, ";position:absolute;", m(f, g, h, i), '">') : o.push('<div style="z-index:', r, ";position:absolute;", "top:", p(q.y / v), "px;left:", p(q.x / v), "px", '">'), o.push('<div style="position:relative;overflow:hidden;width:', p(h), "px;height:", p(i), 'px">'), w && o.push('<div style="width:', u(h + b * h / d), "px;", "height:", u(i + c * i / e), "px;", t, ".Matrix(Dx=", -b * h / d, ",Dy=", -c * i / e, ')">'), o.push('<div style="width:', p(j * h / d), "px;", "height:", p(k * i / e), "px;", t, ".AlphaImageLoader(src=", a.src, ",sizingMethod=" + l + ')"></div>'), o.push(w ? "</div>" : "", "</div></div>"), o.join("")
            },
            createImageData: function(a, b) {},
            getImageData: function(a, b, c, d) {},
            putImageData: function(a, b, c, d, e, f, g) {},
            createLinearGradient: function(a, b, c, d) {
                return new j(1, {
                    x0: a,
                    y0: b,
                    x1: c,
                    y1: d
                })
            },
            createRadialGradient: function(a, b, c, d, e, f) {
                return new j(2, {
                    x0: a,
                    y0: b,
                    r0: c,
                    x1: d,
                    y1: e,
                    r1: f
                })
            },
            createPattern: function(a, b) {
                return new k(a, b)
            },
            _buildColor: function(a) {
                for (var b = [], c = 0, d = a.length; d > c; ++c) b.push(a[c].offset + " " + a[c].color[0]);
                return b.join(",")
            },
            _map: function(a, b) {
                return {
                    x: v * (a * this._mtx[0][0] + b * this._mtx[1][0] + this._mtx[2][0]) - w,
                    y: v * (a * this._mtx[0][1] + b * this._mtx[1][1] + this._mtx[2][1]) - w
                }
            },
            xClearBegin: function(a, b) {
                if (this._node) {
                    this._elm.innerHTML = "", this._zindex = 0;
                    var c = s,
                        d = this._map(a, b);
                    this._path = ["m ", c(d.x), " ", c(d.y)], this._px = a, this._py = b
                }
            }
        }, j.prototype.addColorStop = function(a, b) {
            function c(a, b) {
                return a.offset - b.offset
            }
            for (var d, e = 0, f = this._colorStop.length; f > e; ++e) d = this._colorStop[e], d.offset === a && 1 > a && a > 0 && (a += f / 1e3);
            this._colorStop.push({
                offset: 1 - a,
                color: x(b)
            }), this._colorStop.sort(c)
        }, uuClass.Canvas.VML2D = i, uuClass.Canvas.VMLGradient = j, uuClass.Canvas.VMLPattern = k, uuClass.Canvas.VMLTextMetrics = l, p.uniqueID && (o.CanvasRenderingContext2D = function() {}, o.CanvasGradient = function() {}, o.CanvasPattern = function() {}), uuClass.Canvas.InitCavansElement = function(a) {
            null != a && (a.getContext || (" " + a.className + " ").indexOf(" vml ") > -1 && h(a))
        }, m(), n()
    }())
}), define("core/Environment", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF"),
        e = function() {
            var a = navigator.userAgent.toLowerCase(),
                b = window.opera,
                c = {
                    ie: /msie/.test(a) && !/opera/.test(a) && document.all,
                    ieAtLeast11: !/msie/.test(a) && /trident/.test(a) && !/opera/.test(a),
                    edge: a.indexOf("edge") > -1,
                    opera: !!b && b.version,
                    webkit: a.indexOf(" applewebkit/") > -1,
                    chrome: a.indexOf("chrome") > -1,
                    safari: a.indexOf("safari") > -1 && -1 == a.indexOf("chrome"),
                    gecko: a.indexOf("gecko") > -1 || "Gecko" == navigator.product,
                    mac: a.indexOf("macintosh") > -1,
                    quirks: "BackCompact" == document.CompactMode,
                    iOS: /(ipad|iphone|ipod)/.test(a),
                    android: /android/i.test(a),
                    blackberry: /blackberry/i.test(a),
                    webos: /webos/i.test(a),
                    kindle: /silk|kindle/i.test(a),
                    secure: "https:" == location.protocol
                };
            if (c.mobile = /mobile/i.test(a) || c.iOS || c.android || c.blackberry || c.webos || c.kindle, c.mobile) {
                var d = !0;
                if (c.iOS) {
                    var e = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
                    e && e.length > 0 && parseInt(e[1]) < 4 && (console.log("Version of IOS is lower than 4.0"), d = !1)
                } else if (c.android) {
                    var f = a.match(/android\s+([\d\.]+)/);
                    if (f && f.length > 0) {
                        var g = a.match(/android\s+([\d\.]+)/)[1];
                        parseFloat(g) < 4 && (console.log("Version of android is lower than 4.0"), d = !1)
                    } else d = !1
                }
                $.support.isElasticScrollSupported = d
            }
            c.gecko = "Gecko" == navigator.product && !c.webkit && !c.opera;
            var h = 0;
            if (c.ie ? (h = parseFloat(a.match(/msie (\d+)/)[1]), c.ie8 = !!document.documentMode && document.documentMode < 8, c.ie8Compact = 8 == document.documentMode, c.ie9Compact = 9 == document.documentMode, c.ie10Compact = 10 == document.documentMode, c.ie7Compact = 7 == h && !document.documentMode || 7 == document.documentMode, c.ie6Compact = 7 > h || c.quirks, c.ie8OrLower = c.ie8 || c.ie8Compact || c.ie7Compact || c.ie6Compact) : c.ie8OrLower = !1, c.gecko) {
                var i = a.match(/rv:([\d\.]+)/);
                i && (i = i[1].split("."), h = 1e4 * i[0] + 100 * (i[1] || 0) + 1 * (i[2] || 0))
            }
            return c.opera && (h = parseFloat(b.version())), c.webkit && (h = parseFloat(a.match(/ applewebkit\/(\d+)/)[1])), c.version = h, c.isCompatible = c.iOS && h >= 534 || !c.mobile && (c.ie && h >= 6 || c.gecko && h >= 10801 || c.opera && h >= 9.5 || c.webkit && h >= 522 || !1), c
        }();
    return d.Environment = {
        ie: e.ie,
        chrome: e.chrome,
        safari: e.safari,
        ieAtLeast11: e.ieAtLeast11,
        edge: e.edge,
        opera: e.opera,
        webkit: e.webkit,
        gecko: e.gecko,
        mac: e.mac,
        quirks: e.quirks,
        mobile: e.mobile,
        iOS: e.iOS,
        secure: e.secure,
        version: e.version,
        ie8: e.ie8,
        ie8Compact: e.ie8Compact,
        ie9Compact: e.ie9Compact,
        ie10Compact: e.ie10Compact,
        ie7Compact: e.ie7Compact,
        ie6Compact: e.ie6Compact,
        ie8OrLower: e.ie8OrLower,
        isCompatible: e.isCompatible
    }, d.Environment
}), define("core/Support", ["core/WebPDF"], function(a, b, c) {
    function d(a, b, c, d) {
        var e, f, g, h = "",
            k = document.createElement("div"),
            l = document.body,
            m = l || document.createElement("body");
        if (parseInt(c, 10))
            for (; c--;) g = document.createElement("div"), g.id = d ? d[c] : j + (c + 1), k.appendChild(g);
        return e = ["&#173;", '<style id="s', j, '">', a, "</style>"].join(""), k.id = j, (l ? k : m).innerHTML += e, m.appendChild(k), l || (m.style.background = "", m.style.overflow = "hidden", h = i.style.overflow, i.style.overflow = "hidden", i.appendChild(m)), f = b(k, a), l ? k.parentNode.removeChild(k) : (m.parentNode.removeChild(m), i.style.overflow = h), !!f
    }

    function e(a) {
        l.cssText = a
    }

    function f(a, b) {
        return !!~("" + a).indexOf(b)
    }
    var g = (a("core/WebPDF"), {}),
        h = " -webkit- -moz- -o- -ms- ".split(" "),
        i = document.documentElement,
        j = "modernizr",
        k = document.createElement(j),
        l = k.style;
    g.touch = function() {
        var a = !1;
        return "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch ? a = !0 : d(["@media (", h.join("touch-enabled),("), j, ")", "{#modernizr{top:9px;position:absolute}}"].join(""), function(b) {
            a = 9 === b.offsetTop
        }), a
    }, g.canvas = function() {
        var a = document.createElement("canvas");
        return !(!a.getContext || !a.getContext("2d"))
    }, g.rgba = function() {
        return e("background-color:rgba(150,255,150,.5)"), f(l.backgroundColor, "rgba")
    }, $.support.canvas = g.canvas(), $.support.rgba = g.rgba(), $.support.touch = g.touch(), $.support.cors = !0
}), define("core/Math/Rect", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.RectUtils = {
        clone: function(a) {
            return new d.PDFRect(a.left, a.top, a.right, a.bottom)
        },
        copy: function(a, b) {
            b.left = a.left, b.top = a.top, b.right = a.right, b.bottom = a.bottom
        },
        equal: function(a, b) {
            return b.left === a.left && b.top === a.top && b.right === a.right && b.bottom === a.bottom
        },
        width: function(a) {
            return Math.abs(a.right - a.left)
        },
        height: function(a) {
            return Math.abs(a.bottom - a.top)
        },
        empty: function(a) {
            a.left = a.top = a.right = a.bottom = 0
        },
        isEmpty: function(a) {
            return a.left >= a.right || a.bottom >= a.top
        },
        offset: function(a, b, c) {
            a.left += b, a.right += b, a.top += c, a.bottom += c
        },
        ptInRect: function(a) {
            var b = 0,
                c = 0;
            return 2 == arguments.length ? (b = arguments[1].x, c = arguments[1].y) : 3 != arguments.length || isNaN(arguments[1]) || isNaN(arguments[2]) || (b = arguments[1], c = arguments[2]), b >= a.left && b <= a.right && c <= a.top && c >= a.bottom
        },
        intersect: function(a, b) {
            a.left = Math.max(a.left, b.left), a.top = Math.min(a.top, b.top), a.right = Math.min(a.right, b.right), a.bottom = Math.max(a.bottom, b.bottom)
        },
        normalize: function(a) {
            var b;
            a.left > a.right && (b = a.left, a.left = a.right, a.right = b), a.bottom > a.top && (b = a.bottom, a.bottom = a.top, a.top = b)
        },
        union: function(a, b) {
            a.left = Math.min(a.left, b.left), a.top = Math.max(a.top, b.top), a.right = Math.max(a.right, b.right), a.bottom = Math.min(a.bottom, b.bottom)
        },
        deflate: function(a, b) {
            a.left += b, a.right -= b, a.top += b, a.bottom -= b
        },
        setRect: function(a) {
            2 == arguments.length ? d.RectUtils.copy(arguments[1], this) : 5 == arguments.length && (isNaN(arguments[1]) || isNaN(arguments[2]) || isNaN(arguments[3]) || isNaN(arguments[4]) || (a.left = arguments[1], a.top = arguments[2], a.right = arguments[3], a.bottom = arguments[4]))
        }
    }, d.PDFRect = function() {
        switch (this.left = this.top = this.right = this.bottom = 0, arguments.length) {
            case 1:
                d.RectUtils.setRect(this, arguments[0]);
                break;
            case 4:
                d.RectUtils.setRect(this, arguments[0], arguments[1], arguments[2], arguments[3])
        }
    }, d.PDFRect
}), define("core/Math/Point", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.PDFPoint = function(a, b) {
        this.x = this.y = 0, 2 === arguments.length && (this.x = isNaN(a) ? 0 : a, this.y = isNaN(b) ? 0 : b), this.clone = function() {
            return new this.constructor(this.x, this.y)
        }, this.setPoint = function(a, b) {
            isNaN(a) || isNaN(b) || (this.x = a, this.y = b)
        }, this.offset = function(a, b) {
            isNaN(a) || isNaN(b) || (this.x += a, this.y += b)
        }, this.equal = function(a) {
            return this.x === a.x && this.y === a.y
        }
    }, d.PDFPoint
}), define("core/Math/JSMap", ["core/WebPDF"], function(a, b, c) {
    function d() {
        var a = function(a, b) {
                this.key = a, this.value = b
            },
            b = function(b, c) {
                for (var d = 0; d < this.arr.length; d++)
                    if (this.arr[d].key === b) return void(this.arr[d].value = c);
                this.arr[this.arr.length] = new a(b, c)
            },
            c = function(a) {
                for (var b = 0; b < this.arr.length; b++)
                    if (this.arr[b].key === a) return this.arr[b].value;
                return null
            },
            d = function(a) {
                for (var b, c = 0; c < this.arr.length; c++) b = this.arr.pop(), b.key !== a && this.arr.unshift(b)
            },
            e = function() {
                return this.arr.length
            },
            f = function() {
                return this.arr.length <= 0
            };
        this.arr = new Array, this.get = c, this.put = b, this.remove = d, this.size = e, this.isEmpty = f
    }
    var e = a("core/WebPDF");
    return e.CMap = d, e.CMap
}), define("core/Math/Matrix", ["core/WebPDF"], function(e, f, g) {
    return e("core/WebPDF"), WebPDF.PDFMatrix = function() {
        this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.e = 0, this.f = 0, this.Set = function(a, b, c, d, e, f) {
            this.a = a, this.b = b, this.c = c, this.d = d, this.e = e, this.f = f
        }, this.Reset = function() {
            this.a = this.d = 1, this.b = this.c = this.e = this.f = 0
        }, this.SetReverse = function(a) {
            var b = a.a * a.d - a.b * a.c;
            if (0 != b) {
                var c = -b;
                this.a = a.d / b, this.b = a.b / c, this.c = a.c / c, this.d = a.a / b, this.e = (a.c * a.f - a.d * a.e) / b, this.f = (a.a * a.f - a.b * a.e) / c
            }
        }, this.Rotate = function(a, b) {
            var c = Math.cos(a),
                d = Math.sin(a),
                e = new WebPDF.PDFMatrix;
            e.Set(c, d, -d, c, 0, 0);
            var f = null;
            f = b ? WebPDF.PDFMatrix.Concat2mt(e, this) : WebPDF.PDFMatrix.Concat2mt(this, e), this.Set(f.a, f.b, f.c, f.d, f.e, f.f)
        }, this.RotateAt = function(a, b, c, d) {
            this.Translate(a, b, d), this.Rotate(c, d), this.Translate(-a, -b, d)
        }, this.Concat = function(a, b, c, d, e, f, g) {
            var h = new WebPDF.PDFMatrix;
            h.Set(a, b, c, d, e, f);
            var i = null;
            i = bPrePended ? WebPDF.PDFMatrix.Concat2mt(h, this) : WebPDF.PDFMatrix.Concat2mt(this, h), this.Set(i.a, i.b, i.c, i.d, i.e, i.f)
        }, this.Is90Rotated = function() {
            var a = 1e3 * this.a;
            0 > a && (a *= -1);
            var b = 1e3 * this.d;
            0 > b && (b *= -1);
            var c = this.b;
            0 > c && (c *= -1);
            var d = this.c;
            return 0 > d && (d *= -1), c > a && d > b
        }, this.IsScaled = function() {
            var a = 1e3 * this.b;
            0 > a && (a *= -1);
            var b = 1e3 * this.c;
            0 > b && (b *= -1);
            var c = this.a;
            0 > c && (c *= -1);
            var d = this.d;
            return 0 > d && (d *= -1), c > a && d > b
        }, this.GetA = function() {
            return this.a
        }, this.GetB = function() {
            return this.b
        }, this.GetC = function() {
            return this.c
        }, this.GetD = function() {
            return this.d
        }, this.GetE = function() {
            return this.e
        }, this.GetF = function() {
            return this.f
        }, this.Translate = function(a, b, c) {
            c ? (thi.e += a * this.a + b * this.c, this.f += b * this.d + a * this.b) : (this.e += a, this.f += b)
        }, this.Scale = function(a, b, c) {
            this.a *= a, this.d *= b, c ? (this.b *= a, this.c *= b) : (this.b *= b, this.c *= a, this.e *= a, this.f *= b)
        }, this.TransformXDistance = function(a) {
            var b = this.a * a,
                c = this.b * a;
            return Math.sqrt(b * b + c * c)
        }, this.TransformYDistance = function(a) {
            var b = this.c * a,
                c = this.d * a;
            return Math.sqrt(b * b + c * c)
        }, this.TransformDistance = function(a, b) {
            var c = this.a * a + this.c * b,
                d = this.b * a + this.d * b;
            return Math.sqrt(c * c + d * d)
        }, this.TransFormPoint = function(a, b) {
            var c = this.a * a + this.c * b + this.e,
                d = this.b * a + this.d * b + this.f,
                e = [];
            return e[0] = parseFloat(c.toFixed(3)), e[1] = parseFloat(d.toFixed(3)), e
        }, this.TransFormRect = function(a, b, c, d) {
            var e = function(a, b, c, d) {
                    var e = [],
                        f = [];
                    e[0] = a, f[0] = c, e[1] = a, f[1] = d, e[2] = b, f[2] = c, e[3] = b, f[3] = d;
                    for (var g, h = 0; 4 > h; h++) g = this.TransFormPoint(e[h], f[h]), e[h] = g[0], f[h] = g[1];
                    g = null;
                    var i = [e[0], e[0], f[0], f[0]];
                    for (h = 1; 4 > h; h++) i[0] > e[h] && (i[0] = e[h]), i[1] < e[h] && (i[1] = e[h]), i[2] > f[h] && (i[2] = f[h]), i[3] < f[h] && (i[3] = f[h]);
                    return i
                },
                f = e.call(this, a, c, b, d),
                g = [];
            return g[0] = f[0], g[1] = f[2], g[2] = f[1], g[3] = f[3], f = null, e = null, g
        }, this.GetXUnit = function() {
            return 0 === b ? Math.abs(a) : 0 === a ? Math.abs(b) : Math.sqrt(a * a + b * b)
        }, this.GetYUnit = function() {
            return 0 === c ? Math.abs(d) : 0 === d ? Math.abs(c) : Math.sqrt(c * c + d * d)
        }, this.GetUnitRect = function() {
            return this.TransFormRect(0, 0, 1, 1)
        }, this.MatchRect = function(a, b) {
            var c = b[0] - b[2];
            this.a = Math.abs(c) < .001 ? 1 : (a[0] - a[2]) / c, c = b[3] - b[1], this.d = Math.abs(c) < .001 ? 1 : (a[3] - a[1]) / c, this.e = a[0] - b[0] * this.a, this.f = a[3] - b[3] * this.d, this.b = 0, this.c = 0
        }
    }, WebPDF.PDFMatrix.Concat2mt = function(a, b) {
        var c = a.a * b.a + a.b * b.c,
            d = a.a * b.b + a.b * b.d,
            e = a.c * b.a + a.d * b.c,
            f = a.c * b.b + a.d * b.d,
            g = a.e * b.a + a.f * b.c + b.e,
            h = a.e * b.b + a.f * b.d + b.f,
            i = new WebPDF.PDFMatrix;
        return i.Set(c, d, e, f, g, h), i
    }, WebPDF.PDFMatrix
}), define("core/CommonDialog", ["core/WebPDF"], function(a, b, c) {
    function d(a, b, c, d, e) {
        v = i18n.t("CommonDialog.DefaultDlgTitle");
        var g = "fwrTextCopyArea",
            h = "fwrTextCopyDlg",
            i = "fwrTextCopyClose",
            j = "fwrTextCopyTitle",
            k = null,
            l = null,
            m = null;
        if (!r) {
            var n = "";
            n = f.Environment.mobile ? "<textarea id='" + g + "' class='t-copy'  type='text' value=''  />" : "<textarea id='" + g + "' type='text' value=''  readonly='readonly'/>", a.addIgnoreMouseEventClass("fwr-text-copy-dlg"), p = "<div id='" + h + "' class='fwr-modal fwr-hide fwr-fade fwr-in fwr-text-copy-dlg'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + j + "'>Text Copy</h4></div><div class='fwr-modal-body'><div ><span id='textCopyMsg' data-i18n='[html]CommonDialog.TextCopyLimitMsg'>Current browser is not able to copy the text directly. Please copy the text manually.</span></div>" + n + "</div><div class='fwr-modal-footer'><a href='#' id='" + i + "' class='btn'  webpdf-data-dismiss='modal' data-i18n='[html]CommonDialog.DefaultCloseBtnTitle'>Close</a></div></div>", $("#" + a.getMainFrameId()).append(p), q = $("#" + h), r = !0
        }
        if (q) {
            k = $("#" + j), l = $("#" + i), m = $("#" + g), c || (c = v), k.html(c);
            var o = $("#textCopyMsg");
            o.html(i18n.t("CommonDialog.TextCopyLimitMsg")), $.isFunction(e) && q.off("hidden.bs.webpdf-modal").on("hidden.bs.webpdf-modal", function() {
                e()
            }), m.val(b), d || (d = i18n.t("CommonDialog.DefaultCloseBtnTitle")), l.text(d), a.isMobile() && f.Environment.iOS && (l.unbind("touchstart").bind("touchstart", function() {
                q.webPDFModal("hide")
            }), q.find(".close").unbind("touchstart").bind("touchstart", function() {
                q.webPDFModal("hide")
            }), q.find("textarea").unbind("touchstart").bind("touchstart", function() {
                this.setSelectionRange(0, m.val().length), m.focus()
            })), q.webPDFModal({
                keyboard: !1,
                backdrop: "static",
                manager: "#" + a.getMainFrameId()
            }), q.focus(), f.Environment.mobile ? m.off("click").on("click", function() {
                return this.setSelectionRange(0, m.val().length), m.focus(), !1
            }) : (m.focus(), m.select())
        }
    }

    function e(a) {
        if (window.netscape) {
            try {
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
            } catch (b) {
                return console.error(b), !1
            }
            var c = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
            if (!c) return;
            var d = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
            if (!d) return;
            d.addDataFlavor("text/unicode");
            var e = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
            e.data = a, d.setTransferData("text/unicode", e, 2 * a.length);
            var f = Components.interfaces.nsIClipboard;
            return c ? (c.setData(d, null, f.kGlobalClipboard), !0) : !1
        }
    }
    var f = a("core/WebPDF"),
        g = "",
        h = null,
        i = !1,
        j = "",
        k = null,
        l = !1,
        m = "",
        n = !1,
        o = null,
        p = "",
        q = null,
        r = !1,
        s = "",
        t = null,
        u = !1,
        v = "";
    f.waiting = function(a) {
        v = i18n.t("CommonDialog.DefaultDlgTitle");
        var b = "LoadingDlg";
        if (u || (a.addIgnoreMouseEventClass("fwr-ajax-loading"), s = "<div id='" + b + "' class='fwr-modal fwr-hide fwr-fade fwr-in fwr-ajax-loading'><span class='fwr-ajax-loading-text'></span></div>", t = $(s), u = !0), t) {
            t.i18n(), t.webPDFModal({
                keyboard: !1,
                backdrop: "static",
                manager: "#" + f.Tool.getReaderApp().getMainFrameId()
            });
            var c = $(".fwr-modal-backdrop");
            c.length > 0 && c.addClass("fwr-modal-backdrop-loading");
            var d = $("#" + f.Tool.getReaderApp().getMainFrameId());
            d.addClass("fwr-doc-viewer-loading")
        }
    }, f.closeWaiting = function(a) {
        t && t.webPDFModal("hide");
        var b = $("#" + f.Tool.getReaderApp().getMainFrameId());
        b.removeClass("fwr-doc-viewer-loading")
    }, f.alert = function(a, b, c, d, e, j) {
        null == a && (a = f.Tool.getReaderApp());
        var k = "fwrAlertDlg",
            l = "fwrAlertDialogCloseBtn",
            m = null,
            n = "fwrAlertDialogMsgHolder",
            o = null,
            p = "fwrAlertDialogTitle",
            q = null;
        v = i18n.t("CommonDialog.DefaultDlgTitle"), i || (a.addIgnoreMouseEventClass("fwr-alert"), g = "<div id='" + k + "' class='fwr-modal fwr-hide fwr-fade fwr-in fwr-alert' style='display: none;'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + p + "'>Foxit Web PDF</h4></div><div class='fwr-modal-body'><p id='" + n + "'>Msg Body</p></div><div class='fwr-modal-footer' ><a href='#' id='" + l + "' class='btn' webpdf-data-dismiss='modal' data-i18n='CommonDialog.DefaultOKBtnTitle'>Close</a></div></div>", $("#" + a.getMainFrameId()).append(g), h = $("#" + k), i = !0), h && (m = $("#" + l), q = $("#" + p), o = $("#" + n), m.off("click").on("click", function() {
            h.webPDFModal("hide")
        }), b || (b = v), q.html(b), c || (c = ""), o.html(c), d || (d = i18n.t("CommonDialog.DefaultOKBtnTitle")), m.text(d), $.isFunction(e) && h.off("hidden.bs.webpdf-modal").on("hidden.bs.webpdf-modal", function() {
            e()
        }), h.i18n(), h.webPDFModal({
            keyboard: !1,
            backdrop: "static",
            manager: "#" + a.getMainFrameId()
        }), h.focus())
    }, f.endAlert = function() {
        h && h.webPDFModal("hide")
    }, f.confirm = function(a, b, c, d, e, g) {
        v = i18n.t("CommonDialog.DefaultDlgTitle");
        var h = "fwrConfirmDlg",
            i = "fwrConfirmDlgMsgHolder",
            m = null,
            n = "fwrConfirmDlgOkBtn",
            o = "fwrConfirmDlgCancelBtn",
            p = null,
            q = null,
            r = "fwrConfirmDialogTitle",
            s = null;
        null == a && (a = f.Tool.getReaderApp()), l || (a.addIgnoreMouseEventClass("fwr-confirm"), j = "<div id='" + h + "' title='Confirm' class='fwr-modal fwr-hide fwr-fade fwr-in fwr-confirm'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + r + "'>Foxit Web PDF</h4></div><div class='fwr-modal-body'><p id='" + i + "' >Body Msg</p></div><div class='fwr-modal-footer'><a href='#' type='button' class='btn btn-success'   id='" + n + "' webpdf-data-dismiss='modal' >OK</a>  <a href='#' type='button' class='btn'  id='" + o + "' webpdf-data-dismiss='modal' >Cancel</a></div></div>", $("#" + a.getMainFrameId()).append(j), k = $("#" + h), l = !0), k && (s = $("#" + r), m = $("#" + i), p = $("#" + n), q = $("#" + o), b || (b = v), s.html(b), c || (c = ""), m.html(c), d || (d = i18n.t("CommonDialog.DefaultOKBtnTitle")), e || (e = i18n.t("CommonDialog.DefaultCancelBtnTitle")), p.text(d), q.text(e), $.isFunction(g) || (g = function() {
            k.webPDFModal("hide")
        }), p.text(d).off("click").on("click", function() {
            g(!0)
        }), q.text(e).off("click").on("click", function() {
            g(!1)
        }), k.i18n(), k.webPDFModal({
            keyboard: !1,
            backdrop: "static",
            manager: "#" + a.getMainFrameId()
        }), k.focus())
    }, f.endConfirm = function() {
        k && k.webPDFModal("hide")
    };
    var w = "fwrPasswordDlgPasswordInput",
        x = null;
    f.confirmPassword = function(a, b, c, d, e, g) {
        v = i18n.t("CommonDialog.DefaultDlgTitle");
        var h = "fwrPasswordDlg",
            i = "fwrPasswordDlgMsgHolder",
            j = "fwrPasswordDlgErrorLabel",
            k = "fwrPasswordDlgOkBtn",
            l = "fwrPasswordDlgCancelBtn",
            p = null,
            q = null,
            r = "fwrPasswordDialogTitle",
            s = null,
            t = null,
            u = null,
            y = "fwr-password-confirm";
        f.Environment.mobile && (y = "fwr-password-confirm-mobile"), n || (a.addIgnoreMouseEventClass("fwr-password-confirm"), a.addIgnoreMouseEventClass("fwr-password-confirm-mobile"), m = "<div id='" + h + "' class='fwr-modal fwr-hide fwr-fade fwr-in " + y + "'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + r + "'>Foxit Web PDF</h4></div><div class='fwr-modal-body'><div id='' class='fwr-password-warn' data-i18n='ParseError.EnterPassword'>password</div><div class='fwr-password-block'> <span class='fwr-password-lable'  data-i18n='CommonDialog.EnterPasswordTip'>Password:</span><input type='password' autocomplete='off' id='" + w + "' name='fwr-password' /></div><div class='error-info'><span id='" + j + "'>Error code</span><br /></div></div><div class='fwr-modal-footer'><a href='#' type='button' class='btn btn-success'   id='" + k + "' data-i18n='CommonDialog.DefaultOKBtnTitle'>OK</a> <a href='#' type='button' class='btn'  id='" + l + "' webpdf-data-dismiss='modal' data-i18n='CommonDialog.DefaultCancelBtnTitle'>Cancel</a></div></div>", $("#" + a.getMainFrameId()).append(m), o = $("#" + h), x = $("#" + w), x.off("keyup").on("keyup", function(a) {
            var b = a || window.event,
                c = b.keyCode || b.which || b.charCode;
            "13" == c && p.click()
        }), o.on("shown.bs.webpdf-modal", function() {
            f.Environment.mobile || x.focus()
        }), n = !0), o && (p = $("#" + k), q = $("#" + l), q.off("click").on("click", function() {
            o.webPDFModal("hide")
        }), x = $("#" + w), s = $("#" + r), u = $("#" + i), t = $("#" + j), x.empty(), t.empty(), b || (b = v), s.html(b), c || (c = ""), u.html(c), e || (e = i18n.t("CommonDialog.DefaultOKBtnTitle")), g || (g = i18n.t("CommonDialog.DefaultCancelBtnTitle")), q.text(g), $.isFunction(d) || (d = function() {
            o.webPDFModal("hide")
        }), p.text(e).off("click").on("click", function() {
            d(x, t)
        }), o.i18n(), o.webPDFModal({
            keyboard: !1,
            backdrop: "static",
            manager: "#" + a.getMainFrameId()
        }))
    }, f.endConfirmPassword = function() {
        o && (x.empty().val(""), o.webPDFModal("hide"))
    }, f.copyText = function(a, b, c, f, g, h) {
        try {
            if (window.clipboardData) {
                var i = window.clipboardData.setData("Text", b);
                if (!i) return d(a, b, c, f, g, h), !1
            } else {
                if (!window.netscape) return d(a, b, c, f, g, h), !1;
                if (!e(b)) return d(a, b, c, f, g, h), !1
            }
        } catch (j) {
            return console.error(j), d(a, b, c, f, g, h), !1
        }
        return !0
    }, f.endTextCopyDlg = function() {
        q && q.dialog("close")
    }, f.destructorDlg = function() {
        g = "", h || delete h, h = null, i = !1, j = "", k || delete k, k = null, l = !1, m = "", n = !1, o || delete o, o = null, p = "", q || delete q, q = null, r = !1, s = "", t || delete t, t = null, u = !1, v = ""
    }
}), define("core/Tools/Tools", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    d.Tools = {}
}), define("core/DataLevel", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.PDFData = {}, d.PDFData
}), define("core/PDFData/Dest", ["core/DataLevel", "core/WebPDF"], function(a, b, c) {
    a("core/DataLevel"), WebPDF.PDFData.DestinationInfoJsonFormat = {
        left: "l",
        top: "t",
        width: "w",
        height: "h",
        pageIndex: "p",
        zoomToMode: "zm",
        scale: "s",
        bPdfCord: "bp",
        bLink: "bl",
        offsetX: "x",
        offsetY: "y"
    };
    var d = WebPDF.PDFData.DestinationInfoJsonFormat;
    return WebPDF.PDFData.PDFDestination = function(a) {
        this.left = -1, this.top = -1, this.width = -1, this.height = -1, this.pageIndex = 0, this.zoomToMode = 0, this.scale = 1, this.bPdfCord = !0, this.bLink = !0, this.parseJSONData = function(a) {
            this.left = a[d.left], this.top = a[d.top], this.width = a[d.width], this.height = a[d.height], this.pageIndex = a[d.pageIndex], this.zoomToMode = 0, this.dbScale = a[d.scale], this.bPdfCord = 1 == a[d.bPdfCord] ? !0 : !1, this.bLink = 1 == a[d.bLink] ? !0 : !1
        }, this.parseJSONData(a)
    }, WebPDF.PDFData.PDFDestination
}), define("core/Lang", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.lang = {}, d.lang
}), define("core/PDFView/MainFrame", ["core/PDFView/PDFDocView", "core/PDFView/PDFPageView", "core/ViewLevel", "core/WebPDF", "core/Math/Rect", "core/Math/Point", "core/Config", "core/PDFView/LayoutInfo", "core/PDFView/ProgressiveViewerGenerator", "core/PDFView/PDFContinuousView", "core/PDFView/PDFSinglePageView", "core/PDFView/SinglePageViewLayout", "core/Common"], function(a, b, c) {
    var d = a("core/PDFView/PDFDocView");
    a("core/PDFView/LayoutInfo");
    return WebPDF.PDFView.CMainFrame = function(a, b, c, e, f, g) {
        function h() {
            i = new d(c, e, k, f, l);
            var a = $("#" + k);
            i.setDocViewWidth(a.width()), i.setDocViewHeight(a.height()), i.init()
        }
        var i = null,
            j = b,
            k = a,
            l = g;
        h(), this.getDocView = function() {
            return i
        }, this.getMainFrameID = function() {
            return k
        }, this.getLeftPanelID = function() {
            return j
        }, this.onResize = function(a, b) {
            var c = $("#" + k);
            (a || b) && (c.width(a), c.height(b));
            var a = c.outerWidth(),
                b = c.outerHeight(),
                d = $("#" + j),
                e = b,
                f = d.is(":hidden") ? 0 : d.innerWidth();
            if (d.css({
                    top: 0,
                    height: e
                }), null != i) {
                var g = a - f,
                    h = b,
                    l = f,
                    m = 0;
                if (g === i.getDocViewWidth() && h === i.getDocViewHeight() && l === i.getDocViewOffsetLeft() && m === i.getDocViewOffsetTop()) return;
                i.onSize(g, h, l, m)
            }
        }
    }, WebPDF.PDFView.CMainFrame
}), define("core/PDFView/PDFDocView", ["core/PDFView/PDFPageView", "core/ViewLevel", "core/WebPDF", "core/Math/Rect", "core/Math/Point", "core/Config", "core/PDFView/LayoutInfo", "core/PDFView/ProgressiveViewerGenerator", "core/PDFView/PDFContinuousView", "core/PDFView/PDFSinglePageView", "core/PDFView/SinglePageViewLayout", "core/Common"], function(a, b, c) {
    var d = a("core/PDFView/PDFPageView");
    a("core/PDFView/LayoutInfo"), a("core/PDFView/ProgressiveViewerGenerator");
    var e = a("core/PDFView/PDFContinuousView"),
        f = a("core/PDFView/PDFSinglePageView"),
        g = a("core/PDFView/SinglePageViewLayout");
    a("core/Config");
    var h = WebPDF.Config,
        i = a("core/Math/Rect");
    WebPDF.Common, WebPDF.PDFPoint, WebPDF.RectUtils;
    return WebPDF.PDFView.ScrollBarType = {
        CUSTOM_SCROLL_BAR: 0,
        NATIVE_SCROLL_BAR: 1
    }, WebPDF.ZOOM_FIT_WIDTH = "FitWidth", WebPDF.ZOOM_IN = "in", WebPDF.ZOOM_OUT = "out", WebPDF.ROTATE_LEFT = "left", WebPDF.ROTATE_RIGHT = "right", WebPDF.PDFView.PDFDocView = function(a, b, c, j, k) {
        function l() {
            var a = H.getOptions().defaultZoom;
            a === WebPDF.ZOOM_FIT_WIDTH ? U = !0 : isNaN(a) || (F.scale = a)
        }

        function m(a) {
            var b = X.getPageView(P);
            b.isDimensionUpdated() || (b.updateDimension(), b.setDimensionUpdated(!0)), a != P && $(H).trigger(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, {
                oldIndex: a,
                curIndex: P
            })
        }

        function n() {
            if (!V.isContentCreatedPageCountUpdate && 0 != S) return S;
            V.isContentCreatedPageCountUpdate = !1, S = 0;
            for (var a = X.getPDFDoc(), b = a.getPageCount(), c = 0; b > c; c++) {
                var d = X.getPageView(c);
                if (d.isContentCreated()) {
                    var e = a.getPage(c);
                    S += e.getPageWidth()
                }
            }
            return S
        }

        function o() {
            if (0 != T) return T;
            for (var a = X.getPDFDoc(), b = a.getPageCount(), c = 0; b > c; c++) {
                var d = a.getPage(c);
                T += d.getPageHeight()
            }
            return T
        }

        function p() {
            fa && (X.changeShowMode(WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE, !1), fa = !1)
        }

        function q() {
            F.showMode == WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE && (fa = !0, X.changeShowMode(WebPDF.PDFView.RD_BRMODE_CONTINUOUS, !1))
        }

        function r() {
            var a = X.getMaxPDFPageWidth(),
                b = o(),
                c = 0;
            if (X.getRotate() % 180 != 0) {
                a = X.getMaxPDFPageHeight();
                var d = V.getContentCreatedPageCount();
                b = n(), c = H.getPixelsPerPoint() * b * X.getScale() + X.getPageSpane() * d + .5
            }
            var e = {
                showArrows: !1,
                animateScroll: !1,
                contentWidth: H.getPixelsPerPoint() * a * X.getScale() + .5,
                contentHeight: c,
                keyDownCallback: ba,
                verticalGutter: 4
            };
            return F.showMode == WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE && (e.verticalGutter = 0, e.cancelDrag = p, e.dragMouseDown = q), e
        }

        function s(a, b, c, d) {
            X.unBindScrollEvent();
            var e = X.getVisiblePageRange(),
                f = (V.updateAdjacentPageContent(), e.end),
                g = e.begin;
            a && (g = 0, f = X.getPageCount());
            var h = E.getPageViewOffsetDocView(P);
            V.progressiveUpdatePageDimension(P, g, f, h.y, !0, !0), aa[F.showMode].onPageScroll(P, b, c, d);
            var i = X.countVisiblePageRange(),
                j = P;
            P = i.current, m(j), ca && clearTimeout(ca);
            var k = X.getVisiblePageRange();
            X.bindScrollEvent(), ca = setTimeout(function() {
                u(i)
            }, 200), X.notifyPageVisibleStatus(e, k), $(H).trigger(WebPDF.EventList.DOCVIEW_SCROLL, {})
        }

        function t(a, b, c, d) {
            b && c || s(!1, b, c, d)
        }

        function u(a) {
            var b = $("#" + X.getDocViewContainerID()),
                c = X.getDocViewDimension(),
                d = c.height,
                e = c.width,
                f = b.offset(),
                g = 0,
                i = 0;
            I && (g = I.getScrollBarWidth(), i = I.getScrollBarHeight());
            var j = a.begin;
            a.begin < 0 && (j = 0);
            var k = a.end;
            a.end > D.getPageCount() - 1 && (k = D.getPageCount() - 1);
            for (var l = 24, m = j; k >= m; m++) {
                var n = X.getPageView(m);
                if (n) {
                    if (m >= a.begin && m <= a.end && !n.isPageLoaded()) {
                        var o = n.getPageViewWidth(),
                            p = n.getPageViewHeight(),
                            q = $("#" + n.getPageViewContainerID()),
                            r = e,
                            s = d;
                        I && (s -= i, r -= g);
                        var t = q.offset(),
                            u = t.top + p - (f.top + s);
                        0 > u && (u = 0);
                        var v = 0;
                        t.top < f.top && (v = f.top - t.top);
                        var w = f.left - t.left;
                        0 > w && (w = 0);
                        var x = t.left + o - (f.left + r);
                        0 > x && (x = 0);
                        var y = $("#" + n.getPageLoaderImageID());
                        y.length > 0 && (l > p - u - v && (u = 0, v = 0), y.css({
                            marginLeft: -l / 2 - (x - w) / 2,
                            marginTop: -l / 2 - (u - v) / 2
                        }))
                    }
                    G.renderPage(n, h.defaults.requestRetryCount)
                }
            }
        }

        function v(a) {
            H.getOptions().scrollBarType === WebPDF.PDFView.ScrollBarType.CUSTOM_SCROLL_BAR && a.getContentPane().css({
                left: 0
            })
        }

        function w() {
            for (var a = X.getPageCount(), b = 0; a > b; b++) {
                var c = X.getPageView(b);
                c && c.isContentCreated() && c.setDimensionUpdated(!1)
            }
        }

        function x() {}
        null == a && $.error("pdfDoc is null!");
        var y = {},
            z = c + "_ViewContainer",
            A = c + "_ViewContainer_1",
            B = c + "_ViewContainer_2",
            C = c,
            D = a,
            E = null,
            F = j,
            G = b,
            H = k,
            I = null,
            J = 0,
            K = 0,
            L = 0,
            M = 0,
            N = 0,
            O = 0,
            P = 0,
            Q = -1,
            R = -1,
            S = 0,
            T = 0,
            U = !1,
            V = null,
            W = {
                begin: 0,
                end: 0,
                current: 0
            },
            X = this,
            Y = !1,
            Z = null,
            _ = null,
            aa = [];
        $(H).trigger(WebPDF.EventList.LAYOUTSHOWMODE_CHANGED, {
            oldShowMode: null,
            newShowMode: F.showMode
        });
        var ba = {
                33: function() {
                    X.gotoPrevPage()
                },
                34: function() {
                    X.gotoNextPage()
                },
                35: function() {
                    X.gotoPage(X.getPageCount() - 1, 0, 0)
                },
                36: function() {
                    X.gotoPage(0, 0, 0)
                }
            },
            ca = null,
            da = !1,
            ea = !1;
        l(), this.createPagesView = function(a, b, c) {
            return E.createPagesView(a, b, c)
        }, this.getDocViewContainerID = function() {
            return z
        }, this.getCurPageIndex = function() {
            return P
        }, this.isFitWidth = function() {
            return U
        }, this.setFitWidth = function(a) {
            U = a
        }, this.getLeftDocContainerID = function() {
            return A
        }, this.getRightDocContainerID = function() {
            return B
        }, this.getPageViewContainerID = function(a) {
            return z + "_PageContainer_" + a.toString()
        }, this.getPageBackgroundImgID = function(a) {
            return z + "_BG_" + a.toString()
        }, this.getWrapPageID = function(a) {
            return z + "_Wrap_" + a.toString()
        }, this.getPageLoaderImageID = function(a) {
            return z + "_Loader_" + a.toString()
        }, this.getWatermarkID = function(a) {
            return z + "_Watermark_" + a.toString()
        }, this.getTrialWatermarkID = function(a) {
            return z + "_TrialWatermark_" + a.toString()
        }, this.getUserWatermarkID = function(a) {
            return z + "_UserWatermark_" + a.toString()
        }, this.getPDFDoc = function() {
            return D
        }, this.getPageCount = function() {
            return D.getPageCount()
        }, this.getPageView = function(a) {
            return y[a]
        }, this.getPageViewRender = function() {
            return G
        }, this.setDocViewWidth = function(a) {
            J = a
        }, this.getDocViewWidth = function() {
            return J
        }, this.setDocViewHeight = function(a) {
            K = a
        }, this.getDocViewHeight = function() {
            return K
        }, this.setDocViewOffsetLeft = function(a) {
            O = a
        }, this.getDocViewOffsetLeft = function() {
            return O
        }, this.setDocViewOffsetTop = function(a) {
            N = a
        }, this.getDocViewOffsetTop = function() {
            return N
        }, this.getDocViewClientRect = function() {
            var a = $("#" + this.getDocViewContainerID()).offset(),
                b = X.getDocViewDimension(),
                c = new i(0, 0, 0, 0);
            return a && (c = new i(a.left, a.top, a.left + b.width, a.top + b.height)), WebPDF.RectUtils.normalize(c), c
        }, this.getMaxPDFPageWidth = function() {
            if (-1 !== Q) return Q;
            for (var a = X.getPDFDoc(), b = a.getPageCount(), c = 0; b > c; c++) {
                var d = a.getPage(c),
                    e = d.getPageWidth();
                e > Q && (Q = e)
            }
            return Q
        }, this.getMaxPDFPageHeight = function() {
            if (-1 != R) return R;
            for (var a = X.getPDFDoc(), b = a.getPageCount(), c = 0; b > c; c++) {
                var d = a.getPage(c),
                    e = d.getPageHeight();
                e > R && (R = e)
            }
            return R
        }, this.getMaxPageViewWidth = function(a) {
            var b = a ? X.getScale() : 1;
            return X.getMaxPDFPageWidth() * H.getPixelsPerPoint() * b
        }, this.getMaxPageViewHeight = function(a) {
            var b = a ? X.getScale() : 1;
            return X.getMaxPDFPageHeight() * H.getPixelsPerPoint() * b
        }, this.getPageViewTranslateX = function(a) {
            var b = 0;
            if (0 == a) return .5 * X.getPageView(0).getPageViewTranslateX();
            for (var c = 0; a > c; c++) X.getPageView(c).isContentCreated() && (b += X.getPageView(c).getPageViewTranslateX());
            return b += .5 * X.getPageView(a).getPageViewTranslateX()
        }, this.init = function() {
            V = new WebPDF.PDFView.ProgressiveViewerGenerator(X, z);
            var a = D.getPageCount();
            switch (F.showMode) {
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS:
                case WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE:
                    E = new g(H, X, F);
                    break;
                default:
                    $.error("Unsupported layout mode.")
            }
            for (var b = 0; a > b; b++) y[b] = new d(H, D.getPage(b), X, z);
            var c = E.createDocViewHtml(),
                h = $("#" + C);
            h.append(c), F.showMode == WebPDF.PDFView.RD_BRMODE_CONTINUOUS_FACING && X.updateTwoPageContainerWidth(), V.createPages(0), X.initializeScrollBar(), Z = new e(X, E, V), aa[Z.getName()] = Z, _ = new f(X, E, V), aa[_.getName()] = _, U && X.fitWidth(!0, !1), X.bindScrollEvent(), t()
        }, this.fitWidth = function(a, b) {
            if (a || !X.isFitWidth()) {
                var c = E.getFitWidthScale(!0);
                X.setFitWidth(!0), X.onZoom(c, b)
            }
        }, this.getCurrentZoomList = function() {
            for (var a = E.getFitWidthScale(!0), b = [], c = h.defaults.zoomList, d = !1, e = 0; e < c.length; e++) {
                var f = c[e];
                a >= f ? b.push(f) : (d || (b.push(WebPDF.ZOOM_FIT_WIDTH), d = !0), b.push(f))
            }
            return d || b.push(WebPDF.ZOOM_FIT_WIDTH), b
        }, this.zoomIn = function() {
            var a = X.getScale(),
                b = E.getFitWidthScale(!0),
                c = !1;
            if (H.isMobile()) {
                if (2 * b > a ? a = 1.1 * a : (a = 2 * b, c = !0), c) return !1;
                X.setFitWidth(!1), X.onZoom(a)
            } else {
                for (var d = X.getCurrentZoomList(), e = -1, f = 0; f < d.length; f++) {
                    var g = d[f];
                    if (g === a || g === WebPDF.ZOOM_FIT_WIDTH && X.isFitWidth()) {
                        e = f + 1;
                        break
                    }
                }
                if (e >= d.length || -1 === e) return;
                var h = d[e];
                h === WebPDF.ZOOM_FIT_WIDTH || b === h ? X.fitWidth() : (X.setFitWidth(!1), a = h, X.onZoom(a))
            }
        }, this.zoomOut = function() {
            var a = E.getFitWidthScale(!0),
                b = X.getScale(),
                c = !1;
            if (H.isMobile()) {
                if (.95 * b > .5 * a ? b = .95 * b : (b = .5 * a, c = !0), c) return !1;
                X.setFitWidth(!1), X.onZoom(b)
            } else {
                for (var d = X.getCurrentZoomList(), e = -1, f = 0; f < d.length; f++) {
                    var g = d[f];
                    if (g === b || g === WebPDF.ZOOM_FIT_WIDTH && X.isFitWidth()) {
                        e = f - 1;
                        break
                    }
                }
                if (0 > e) return;
                var h = d[e];
                h === WebPDF.ZOOM_FIT_WIDTH || a === h ? X.fitWidth() : (X.setFitWidth(!1), b = h, X.onZoom(b))
            }
        }, this.rotateLeft = function() {
            var a = X.getRotate();
            a = (a - 90 + 360) % 360, X.onRotate(a)
        }, this.rotateRight = function() {
            var a = X.getRotate();
            a = (a + 90 + 360) % 360, X.onRotate(a)
        }, this.updateTwoPageContainerWidth = function() {
            var a = X.getMaxPageViewWidth(!0),
                b = $("#" + X.getDocViewContainerID()).width();
            a = a > b ? a : b, $("#" + X.getLeftDocContainerID()).css("width", a / 2), $("#" + X.getRightDocContainerID()).css("width", a / 2).css("left", a / 2)
        }, this.bindScrollEvent = function() {
            $("#" + z).scroll(t)
        }, this.unBindScrollEvent = function() {
            $("#" + z).off("scroll")
        }, this.getViewMode = function() {
            return F.showMode
        };
        var fa = !1;
        this.initializeScrollBar = function(a) {
            if (I) return I;
            a || (a = r());
            var b = $("#" + z),
                c = "";
            switch (H.getOptions().scrollBarType) {
                case WebPDF.PDFView.ScrollBarType.CUSTOM_SCROLL_BAR:
                    c = b.fwrJScrollPane(a);
                    break;
                case WebPDF.PDFView.ScrollBarType.NATIVE_SCROLL_BAR:
                    c = b.WebPDFNativeScroll(a);
                    break;
                default:
                    $.error("Unsupported type of scroll bar.")
            }
            return I = c.data("jsp")
        }, this.reinitializeScrollBar = function(a) {
            null == I && $.error("Scroll bar has not been initialized."), $(H).trigger(WebPDF.EventList.DOCVIEW_PRE_RESIZE, {}), a ? I.reinitialise(a) : I.reinitialise(r()), $(H).trigger(WebPDF.EventList.DOCVIEW_RESIZE, {})
        }, this.getScrollApi = function() {
            return I
        }, this.getFitWidthScale = function() {
            return E.getFitWidthScale(!0)
        }, this.movePage = function(a, b) {
            aa[F.showMode].movePage(P, a, b)
        }, this.notifyPageVisibleStatus = function(a, b) {
            var c, d = $("#" + X.getDocViewContainerID()),
                e = X.getDocViewDimension(),
                f = e.height,
                g = e.width,
                h = d.offset(),
                i = [],
                j = [];
            for (c = a.begin; c <= a.end; c++)(c < b.begin || c > b.end) && (i.push(c), $("#" + X.getPageView(c).getPageViewContainerID()).parent().addClass("fwr-page-invisible"));
            for (c = b.begin; c <= b.end; c++) $("#" + X.getPageView(c).getPageViewContainerID()).parent().removeClass("fwr-page-invisible"), j.push(c);
            i.length > 0 && $(H).trigger(WebPDF.EventList.PAGE_INVISIBLE, {
                pages: i
            }), j.length > 0 && $(H).trigger(WebPDF.EventList.PAGE_VISIBLE, {
                pages: j,
                contentPanelWidth: g,
                contentPaneHeight: f,
                contentPanelOffset: h
            })
        }, this.onSize = function(a, b, c, d) {
            X.unBindScrollEvent(), w();
            var e = $("#" + z);
            L = e.outerHeight() - e.height(), M = e.outerWidth() - e.width(), K = b - L, J = a - M, O = c, N = d, e.css({
                width: J,
                height: K,
                left: c,
                top: d
            });
            var f = P;
            if (I && v(I), X.isFitWidth()) {
                var g = E.getFitWidthScale(!0);
                X.onZoom(g)
            } else X.reinitializeScrollBar();
            t(), aa[F.showMode].onSize(f), X.unBindScrollEvent();
            var h = P;
            P = f, m(h), X.countVisiblePageRange(), X.bindScrollEvent()
        }, this.onZoomByPos = function(a, b, c, d) {
            var e = E.getScale(),
                f = a / e,
                g = $("#" + X.getPageView(d).getPageViewContainerID()),
                h = g.position(),
                j = g.offset(),
                k = X.getDocViewWidth(),
                l = X.getDocViewHeight(),
                n = new i(j.left, j.top, j.left + k, j.top + l),
                o = b - n.left,
                p = c - n.top;
            X.unBindScrollEvent(), E.setScale(a), w(), x();
            var q = P,
                r = X.getRotate() % 180 != 0 ? !0 : !1;
            s(r), X.unBindScrollEvent(), P = q, m(q), I.scrollToElement(g, !0, !1), I.scrollBy(o * (f - 1) - h.left, p * (f - 1) - h.top), X.bindScrollEvent(), $(H).trigger(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, {
                oldScale: e,
                newScale: a
            })
        }, this.onZoom = function(a, b) {
            var c = E.getScale();
            if (a !== c) {
                E.setScale(a), w(), x();
                var d = P;
                I && v(I);
                var e = X.getRotate() % 180 != 0 ? !0 : !1;
                s(e), aa[F.showMode].onZoom(d), X.unBindScrollEvent();
                var f = X.countVisiblePageRange(),
                    g = P;
                P = d, m(g), u(f), X.bindScrollEvent(), (null == b || void 0 == b || 1 == b) && $(H).trigger(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, {
                    oldScale: c,
                    newScale: a
                })
            }
        }, this.onRotate = function(a, b) {
            var c = E.getRotate();
            if (a !== c) {
                X.unBindScrollEvent(), E.setRotate(a), w(), x();
                var d = P;
                I && v(I);
                var e = X.getRotate() % 180 != 0 ? !0 : !1;
                s(e), aa[F.showMode].onRotate(d), X.unBindScrollEvent();
                var f = P;
                P = d, m(f);
                var g = X.countVisiblePageRange();
                u(g), X.bindScrollEvent(), (null == b || void 0 == b || 1 == b) && $(H).trigger(WebPDF.EventList.DOCVIEW_ROTATE_CHANGED, {
                    oldRotate: c,
                    newRotate: a
                })
            }
        }, this.getScale = function() {
            return E.getScale()
        }, this.setScale = function(a) {
            E.setScale(a)
        }, this.getRotate = function() {
            return E.getRotate()
        }, this.setRotate = function(a) {
            E.setRotate(a)
        }, this.getPageSpane = function() {
            return aa[F.showMode].getPageSpace()
        }, this.gotoPage = function(a, b, c) {
            if (!I) return !1;
            var d = X.getVisiblePageRange();
            c = c ? c : 0, null == b && (b = I.getContentPositionX());
            var e = X.getPageCount();
            if (0 > a || a >= e) return !1;
            var f = P;
            aa[F.showMode].gotoPage(a, P, b, c), X.unBindScrollEvent(), X.countVisiblePageRange();
            var g = X.getVisiblePageRange();
            return P = g.current, m(f), u(g), X.notifyPageVisibleStatus(d, g), X.reinitializeScrollBar(), X.bindScrollEvent(), !0
        }, this.gotoNextPage = function() {
            P + 1 >= X.getPageCount() || X.gotoPage(P + 1)
        }, this.gotoPrevPage = function() {
            0 >= P || X.gotoPage(P - 1)
        }, this.gotoPageByDestination = function(a) {
            var b = X.getPageCount();
            if (!(!a || a.pageIndex < 0 || a.pageIndex >= b)) {
                var c = H.getPixelsPerPoint();
                E.zoomToPage(a.zoomToMode, a.scale, a.width * c, a.height * c, !0);
                var d = 0,
                    e = 0; - 1 !== a.top && (d = a.top * F.scale * c), -1 !== a.left && (e = a.left * F.scale * c), X.gotoPage(a.pageIndex, e, d)
            }
        }, this.getVisiblePageRange = function() {
            return W
        }, this.countVisiblePageRange = function() {
            return W = V.countVisiblePageRange()
        }, this.clearAllSelection = function() {}, this.isModified = function() {
            return Y
        }, this.setModified = function(a) {
            Y != a && (Y = a, $(k).trigger(WebPDF.EventList.DOC_MODIFY_STATE_CHANGED, [a]))
        }, this.getPageDomElmHeight = function(a) {
            var b = document.getElementById(X.getPageView(a).getPageViewContainerID()),
                c = $(b).height(),
                d = E.getRotate();
            return (90 == d || 270 == d) && (c = $(b).width()), c
        }, this.getDocViewDimension = function() {
            return {
                width: J + M,
                height: K + L
            }
        }, this.changeShowMode = function(a, b) {
            if (F.showMode != a) {
                var c = F.showMode;
                F.showMode = a, aa[F.showMode].active(P), b && $(H).trigger(WebPDF.EventList.LAYOUTSHOWMODE_CHANGED, {
                    oldShowMode: c,
                    newShowMode: F.showMode
                })
            }
        }, this.getPdfViewerShowMode = function() {
            return F.showMode
        }, this.getPageViewByPosition = function(a, b) {
            for (var c = X.getVisiblePageRange(), d = null, e = null, f = c.begin; f <= c.end; f++) {
                var g = X.getPageView(f),
                    h = $("#" + g.getPageViewContainerID()).offset(),
                    i = g.getPageViewWidth(),
                    j = g.getPageViewHeight();
                if (e = new WebPDF.PDFRect(h.left, h.top, h.left + i, h.top + j), WebPDF.RectUtils.normalize(e), WebPDF.RectUtils.ptInRect(e, a, b)) {
                    d = g;
                    break
                }
            }
            return d
        }, this.getWatermarkHtmlContent = function(a, b) {
            return null == a ? "" : (null == b && (b = 1), G.getWatermarkHtmlContent(a, b))
        }, this.showPageWatermark = function(a) {
            return null == a ? !1 : void G.renderPageWatermark(a)
        }, this.setSigAddFlag = function(a) {
            da = a
        }, this.isSigAdded = function(a) {
            return da
        }, this.setInkSigAddFlag = function(a) {
            ea = a
        }, this.isInkSigAdded = function(a) {
            return ea
        }, this.showPageWatermark = function(a) {
            return null == a ? !1 : void G.renderPageWatermark(a)
        }
    }, WebPDF.PDFView.PDFDocView
}), define("core/PDFView/PDFPageView", ["core/ViewLevel", "core/WebPDF", "core/Math/Rect", "core/Math/Point", "core/Config"], function(a, b, c) {
    a("core/ViewLevel");
    var d = a("core/Math/Rect"),
        e = a("core/Math/Point"),
        f = a("core/Config"),
        g = WebPDF.RectUtils;
    return WebPDF.PDFView.PDFPageView = function(a, b, c) {
        b || $.error("PDF page can not be null to create page view!");
        var h = b,
            i = c,
            j = a,
            k = c.getScale(),
            l = h.getPageWidth() * j.getPixelsPerPoint(),
            m = h.getPageHeight() * j.getPixelsPerPoint(),
            n = !1,
            o = !1,
            p = !1,
            q = h.getPageIndex(),
            r = i.getPageViewContainerID(q),
            s = i.getPageBackgroundImgID(q),
            t = i.getWrapPageID(q),
            u = i.getPageLoaderImageID(q),
            v = i.getWatermarkID(q),
            w = i.getTrialWatermarkID(q),
            x = i.getUserWatermarkID(q),
            y = !1,
            z = !1,
            A = !1,
            B = !1,
            C = this,
            D = !1,
            E = !1;
        this.getPDFPage = function() {
            return h
        }, this.getPDFPageWidth = function() {
            return h.getPageWidth()
        }, this.getPDFPageHeight = function() {
            return h.getPageHeight()
        }, this.getPageViewWidth = function() {
            return l
        }, this.setPageViewWidth = function(a) {
            isNaN(a) || (l = a)
        }, this.getPageViewHeight = function() {
            return m
        }, this.setPageViewHeight = function(a) {
            isNaN(a) || (m = a)
        }, this.getPageIndex = function() {
            return h.getPageIndex()
        }, this.getPageViewContainerID = function() {
            return r
        }, this.getPageBackgroundImgID = function() {
            return s
        }, this.getWrapPageID = function() {
            return t
        }, this.getPageLoaderImageID = function() {
            return u
        }, this.getWatermarkID = function() {
            return v
        }, this.getTrialWatermarkID = function() {
            return w
        }, this.getUserWatermarkID = function() {
            return x
        }, this.getDocView = function() {
            return i
        }, this.setContentCreatedState = function(a) {
            n = a
        }, this.isContentCreated = function() {
            return n
        }, this.isDimensionUpdated = function() {
            return y
        }, this.setDimensionUpdated = function(a) {
            y = a
        }, this.isThumb = function() {
            return !1
        }, this.setAnnotLoad = function(a) {
            B = a
        }, this.isLoadAnnot = function() {
            return B
        }, this.isThumbnailLoaded = function() {
            return A
        }, this.setThumbnailLoaded = function(a) {
            A = a
        }, this.updateDimension = function() {
            var a = i.getScale() * j.getPixelsPerPoint(),
                b = i.getRotate(),
                c = C.getPDFPageWidth() * a,
                d = C.getPDFPageHeight() * a,
                e = c,
                f = d;
            b % 180 != 0 && (e = d, f = c), C.setPageViewWidth(e), C.setPageViewHeight(f);
            var g = i.getScrollApi(),
                h = g ? g.getScrollBarWidth() : 0,
                k = (i.getDocViewWidth() - e - h) / 2;
            0 > k && (k = 0);
            var l = 0,
                m = 0;
            if (b % 180 != 0) {
                l = i.getPageViewTranslateX(C.getPageIndex());
                var n = c - e;
                270 == b ? m = .5 * -n : 90 == b && (m = .5 * n)
            }
            WebPDF.Common.addTranslateCss($("#" + C.getPageViewContainerID()), b, l, m), $("#" + C.getPageViewContainerID()).css({
                height: d,
                width: c,
                "margin-left": Math.floor(k)
            });
            var o = C.getDocView();
            o && o.showPageWatermark(C)
        }, this.getPageViewTranslateX = function() {
            var a = i.getScale() * j.getPixelsPerPoint(),
                b = i.getRotate(),
                c = C.getPDFPageWidth() * a,
                d = C.getPDFPageHeight() * a,
                e = c,
                f = d;
            (90 === b || 270 === b) && (e = d, f = c);
            var g = d - f,
                h = 0;
            return 270 == b ? h = g : 90 == b && (h = -g), h
        }, this.show = function() {
            $("#" + t).addClass("fwr-hidden"), $("#" + s).removeClass("fwr-hidden"), $("#" + u).hide()
        }, this.showErrorPage = function(a) {
            var b = $("#" + t);
            b.html(""), b.removeClass("fwr-hidden"), $("#" + s).addClass("fwr-hidden"), $("#" + u).hide();
            var c = f.defaults.errPageImgWidth / C.getPageViewWidth(),
                d = f.defaults.errPageImgHeight / C.getPageViewHeight(),
                e = c >= d ? c : d;
            e = e > 1 ? e : 1;
            var g = f.defaults.errPageImgWidth / e,
                h = f.defaults.errPageImgHeight / e,
                i = (C.getPageViewWidth() - g) / 2,
                j = (C.getPageViewHeight() - h) / 2,            
                k = "<div style='position:absolute;width:" + g + "px;height:" + h + "px;margin-left:" + i + "px;margin-top:" + j + "px'><img alt='' src='" + a + "'  style='width:100%;height:100%'></div>";
            b.append(k)
        }, this.isPageLoaded = function() {
            return o
        }, this.setPageLoaded = function(a) {
            o = a
        }, this.isPageLoadError = function() {
            return p
        }, this.setPageLoadError = function(a) {
            p = a
        }, this.getScale = function() {
            return k
        }, this.setScale = function(a) {
            k = a
        }, this.pdfRectToDevice = function(a, b) {
            g.normalize(a);
            var c = g.width(a),
                e = g.height(a),
                f = new d(0, 0, 0, 0),
                h = C.getScale(),
                k = j.getPixelsPerPoint();
            f.left = a.left * k * h, b ? f.right = f.left + c * k * h : f.right = f.left + c * k, f.top = a.top * k * h;
            var l = 0;
            return l = 90 == i.getRotate() || 270 == i.getRotate() ? C.getPageViewWidth() : C.getPageViewHeight(), f.top = l - f.top, b ? f.bottom = f.top + e * k * h : f.bottom = f.top + e * k, f
        }, this.deviceRectToPDF = function(a, b, c) {
            var e = g.width(a),
                f = g.height(a),
                h = new d(0, 0, 0, 0),
                k = C.getScale(),
                l = 0;
            l = null != c || void 0 != c ? c : i.getRotate(), b || (k = 1);
            var m = j.getPixelsPerPoint();
            return 90 == l ? (h.left = a.top / (m * k), h.right = h.left + f / (m * k), h.top = a.right / (m * k), h.bottom = a.left / (m * k)) : 180 == l ? (h.left = C.getPDFPageWidth() - a.right / (m * k), h.right = C.getPDFPageWidth() - a.left / (m * k), h.top = a.bottom / (m * k), h.bottom = a.top / (m * k)) : 270 == l ? (h.left = C.getPDFPageWidth() - a.bottom / (m * k), h.right = C.getPDFPageWidth() - a.top / (m * k), h.top = C.getPDFPageHeight() - a.left / (m * k), h.bottom = C.getPDFPageHeight() - a.right / (m * k)) : (h.left = a.left / (m * k), h.right = h.left + e / (m * k), h.top = C.getPDFPageHeight() - a.top / (m * k), h.bottom = h.top - f / (m * k)), h
        }, this.devicePtToPDF = function(a) {
            var b = C.getScale(),
                c = j.getPixelsPerPoint(),
                d = new e(0, 0);
            return 90 == i.getRotate() ? (d.x = a.y / (c * b), d.y = a.x / (c * b)) : 180 == i.getRotate() ? (d.x = (C.getPageViewWidth() - a.x) / (c * b), d.y = a.y / (c * b)) : 270 == i.getRotate() ? (d.x = (m - a.y) / (c * b), d.y = (C.getPageViewWidth() - a.x) / (c * b)) : (d.x = a.x / (c * b), d.y = (m - a.y) / (c * b)), d
        }, this.pdfPtToDevice = function(a) {
            var b = C.getScale(),
                c = j.getPixelsPerPoint(),
                d = new e(0, 0);
            return d.x = a.x * c * b, d.y = (C.getPDFPageHeight() - a.y) * c * b, d
        }, this.getPageViewDivOffset = function() {
            var a = $("#" + C.getPageViewContainerID()),
                b = (a.offset(), 0),
                c = 0;
            return b += a.get(0).offsetTop, c += a.get(0).offsetLeft, {
                left: c,
                top: b
            }
        }, this.getPageViewOffsetpt = function(a, b) {
            var c = $("#" + C.getPageViewContainerID()).offset(),
                d = new e(0, 0);
            return d.x = a - c.left, d.y = b - c.top, d
        }, this.getPageViewRect = function() {
            var a = C.getPageViewDivOffset();
            return new WebPDF.PDFRect(a.left, a.top, a.left + C.getPageViewWidth(), a.top + C.getPageViewHeight())
        }, this.getAnnotAtPoint = function(a, b) {
            return null
        }, this.getFocusAnnot = function() {
            return null
        }, this.setFocusAnnot = function(a) {}, this.isModified = function() {
            return z
        }, this.setModified = function(a) {
            z = a
        }, this.isSignatureContainerAdd = function() {
            return D
        }, this.setSignatureContainerAdd = function(a) {
            D = a
        }, this.isInkSignContainerAdd = function() {
            return E
        }, this.setInkSignContainerAdd = function(a) {
            E = a
        }, this.deviceRectToPageRotate = function(a, b) {
            var c = C.getPageViewWidth(),
                d = C.getPageViewHeight(),
                e = WebPDF.RectUtils.width(a),
                f = WebPDF.RectUtils.height(a),
                g = new WebPDF.PDFRect(a.left, a.top, a.right, a.bottom);
            return 270 == b ? (g.left = d - a.bottom, g.right = g.left + f, g.top = a.left, g.bottom = g.top + e) : 90 == b ? (g.left = a.top, g.right = g.left + f, g.top = c - a.right, g.bottom = g.top + e) : 180 == b && (g.left = c - a.right, g.right = g.left + e, g.top = d - a.bottom, g.bottom = g.top + f), g
        }, this.devicePtToPageRotate = function(a, b) {
            var c = C.getPageViewHeight(),
                d = C.getPageViewWidth(),
                e = {
                    left: a.left,
                    top: a.top
                };
            return 270 == b ? (e.left = c - a.top, e.top = a.left) : 90 == b ? (e.left = a.top, e.top = d - a.left) : 180 == b && (e.left = d - a.left, e.top = c - a.top), e
        }, this.PageRotateToScreen = function(a, b) {
            var c = C.getPageViewWidth(),
                d = C.getPageViewHeight(),
                e = WebPDF.RectUtils.width(a),
                f = WebPDF.RectUtils.height(a),
                g = new WebPDF.PDFRect(a.left, a.top, a.right, a.bottom);
            return 90 == b ? (g.left = c - a.bottom, g.right = g.left + f, g.top = a.left, g.bottom = g.top + e) : 180 == b ? (g.left = c - a.right, g.right = g.left + e, g.top = d - a.bottom, g.bottom = g.top + f) : 270 == b && (g.left = a.top, g.right = g.left + f, g.top = d - a.right, g.bottom = g.top + e), g
        }, this.deviceRectToPDFRect = function(a, b) {
            var c = g.width(a),
                e = g.height(a),
                f = j.getPixelsPerPoint(),
                k = new d(0, 0, 0, 0),
                l = C.getScale();
            b || (l = 1);
            var m = i.getRotate(),
                n = 90 * h.getPageRotate();
            0 > n && (n %= 360, n += 360);
            var o = (m + n) % 360;
            return 90 == o ? (k.left = a.top / (f * l), k.right = k.left + e / (f * l), k.top = a.right / (f * l), k.bottom = a.left / (f * l)) : 180 == o ? (180 == m && 0 == n || 0 == m && 180 == n ? (k.left = C.getPDFPageWidth() - a.right / (f * l), k.right = C.getPDFPageWidth() - a.left / (f * l)) : (90 == m && 90 == n || 270 == m && 270 == n) && (k.left = C.getPDFPageHeight() - a.right / (f * l), k.right = C.getPDFPageHeight() - a.left / (f * l)), k.top = a.bottom / (f * l), k.bottom = a.top / (f * l)) : 270 == o ? 270 == m && 0 == n || 90 == m && 180 == n ? (k.left = C.getPDFPageWidth() - a.bottom / (f * l), k.right = C.getPDFPageWidth() - a.top / (f * l), k.top = C.getPDFPageHeight() - a.left / (f * l), k.bottom = C.getPDFPageHeight() - a.right / (f * l)) : (180 == m && 90 == n || 0 == m && 270 == n) && (k.left = C.getPDFPageHeight() - a.bottom / (f * l), k.right = C.getPDFPageHeight() - a.top / (f * l), k.top = C.getPDFPageWidth() - a.left / (f * l), k.bottom = C.getPDFPageWidth() - a.right / (f * l)) : (k.left = a.left / (f * l), k.right = k.left + c / (f * l), 0 == m && 0 == n || 180 == m && 180 == n ? k.top = C.getPDFPageHeight() - a.top / (f * l) : (270 == m && 90 == n || 90 == m && 270 == n) && (k.top = C.getPDFPageWidth() - a.top / (f * l)), k.bottom = k.top - e / (f * l)), k
        }, this.pointToPDF = function(a) {
            var b = 90 * h.getPageRotate();
            0 > b && (b %= 360, b += 360);
            var c = b % 360,
                d = j.getPixelsPerPoint(),
                f = new e(0, 0);
            return 90 == c ? (f.x = a.y / d, f.y = a.x / d) : 180 == c ? (f.x = (l - a.x) / d, f.y = a.y / d) : 270 == c ? (f.x = (m - a.y) / d, f.y = (l - a.x) / d) : (f.x = a.x / d, f.y = (m - a.y) / d), f
        }, this.pdfPointToDevice = function(a) {
            var b = 90 * h.getPageRotate();
            0 > b && (b %= 360, b += 360);
            var c = b % 360,
                d = C.getScale(),
                f = j.getPixelsPerPoint(),
                g = new e(0, 0);
            return 90 == c ? (g.x = a.y * f * d, g.y = a.x * f * d) : 180 == c ? (g.y = a.y * f * d, g.x = (C.getPDFPageWidth() - a.x) * f * d) : 270 == c ? (g.x = (C.getPDFPageWidth() - a.y) * f * d, g.y = (C.getPDFPageHeight() - a.x) * f * d) : (g.x = a.x * f * d, g.y = (C.getPDFPageHeight() - a.y) * f * d), g
        }, this.pdfRectToDeviceRect = function(a, b) {
            g.normalize(a);
            var c = (g.width(a), g.height(a), new d(0, 0, 0, 0)),
                e = new d(0, 0, 0, 0),
                f = C.getScale();
            b || (f = 1);
            var k = j.getPixelsPerPoint(),
                l = i.getRotate(),
                m = 90 * h.getPageRotate();
            0 > m && (m %= 360, m += 360);
            var n = (l + m) % 360;
            0 == n ? (e.left = a.left * k * f, e.right = a.right * k * f, 0 == l && 0 == m || 180 == l && 180 == m ? (e.top = (C.getPDFPageHeight() - a.top) * k * f, e.bottom = (C.getPDFPageHeight() - a.bottom) * k * f) : (270 == l && 90 == m || 90 == l && 270 == m) && (e.top = (C.getPDFPageWidth() - a.top) * k * f, e.bottom = (C.getPDFPageWidth() - a.bottom) * k * f)) : 90 == n ? (e.left = a.bottom * k * f, e.right = a.top * k * f, e.top = a.left * k * f, e.bottom = a.right * k * f) : 180 == n ? (180 == l && 0 == m || 0 == l && 180 == m ? (e.left = (C.getPDFPageWidth() - a.right) * k * f, e.right = (C.getPDFPageWidth() - a.left) * k * f) : (90 == l && 90 == m || 270 == l && 270 == m) && (e.left = (C.getPDFPageHeight() - a.right) * k * f, e.right = (C.getPDFPageHeight() - a.left) * k * f), e.top = a.bottom * k * f, e.bottom = a.top * k * f) : 270 == n && (270 == l && 0 == m || 90 == l && 180 == m ? (e.left = (C.getPDFPageHeight() - a.top) * k * f, e.right = (C.getPDFPageHeight() - a.bottom) * k * f, e.top = (C.getPDFPageWidth() - a.right) * k * f, e.bottom = (C.getPDFPageWidth() - a.left) * k * f) : (180 == l && 90 == m || 0 == l && 270 == m) && (e.left = (C.getPDFPageWidth() - a.top) * k * f, e.right = (C.getPDFPageWidth() - a.bottom) * k * f, e.top = (C.getPDFPageHeight() - a.right) * k * f, e.bottom = (C.getPDFPageHeight() - a.left) * k * f));
            var o = C.getPageViewHeight(),
                p = C.getPageViewWidth();
            return 90 == l ? (c.left = e.top, c.right = e.bottom, c.top = p - e.right, c.bottom = p - e.left) : 180 == l ? (c.left = p - e.right, c.right = p - e.left, c.top = o - e.bottom, c.bottom = o - e.top) : 270 == l ? (c.left = o - e.bottom, c.right = o - e.top, c.top = e.left, c.bottom = e.right) : c = e, c
        }
    }, WebPDF.PDFView.PDFPageView
}), define("core/ViewLevel", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    d.PDFView = {}
}), define("core/PDFView/LayoutInfo", ["core/ViewLevel", "core/WebPDF"], function(a, b, c) {
    return a("core/ViewLevel"), WebPDF.PDFView.RD_ZMODE_NONE = 0, WebPDF.PDFView.RD_ZMODE_CUSTOM = 1, WebPDF.PDFView.RD_ZMODE_ACTUAL_SIZE = 2, WebPDF.PDFView.RD_ZMODE_FIT_PAGE = 3, WebPDF.PDFView.RD_ZMODE_FIT_WIDTH = 4, WebPDF.PDFView.RD_ZMODE_FIT_HEIGHT = 5, WebPDF.PDFView.RD_ZMODE_FIT_RECTANGLE = 6, WebPDF.PDFView.RD_ZMODE_FIT_VISIBLE = 7, WebPDF.PDFView.RD_BRMODE_CONTINUOUS = 0, WebPDF.PDFView.RD_BRMODE_CONTINUOUS_FACING = 1, WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE = 2, WebPDF.PDFView.RD_ROTATE_POS_TOP = 0, WebPDF.PDFView.RD_ROTATE_POS_LEFT = 3, WebPDF.PDFView.RD_ROTATE_POS_BOTTOM = 2, WebPDF.PDFView.RD_ROTATE_POS_RIGHT = 1, WebPDF.PDFView.LayoutInfo = function() {
        this.rotateAngle = 0, this.zoomToMode = WebPDF.PDFView.RD_ZMODE_FIT_WIDTH, this.showMode = WebPDF.PDFView.RD_BRMODE_CONTINUOUS, this.facingCount = 1, this.isReplaceColor = !1, this.marginX = 0, this.marginY = 0, this.continuousPageSpace = 14, this.singlePageSpace = 2, this.isDispGrid = !1, this.isFacing = !1, this.isReversed = !1, this.scale = 1, this.maxScale = 2, this.minScale = .5, this.isCoverPage = !1, this.isShowAnnot = !1
    }, WebPDF.PDFView.LayoutInfo
}), define("core/PDFView/ProgressiveViewerGenerator", ["core/ViewLevel", "core/WebPDF"], function(a, b, c) {
    a("core/ViewLevel");
    var d = WebPDF.Config,
        e = function(a, b) {
            this.startIndex = a, this.endIndex = b
        };
    return WebPDF.PDFView.PageRange = e, WebPDF.PDFView.ProgressiveViewerGenerator = function(a, b) {
        function c(a) {
            for (var b = 0; b < j.length; b++) {
                var c = j[b];
                if (c.startIndex <= a && c.endIndex >= a) return !0
            }
            return !1
        }

        function f(a) {
            for (var b = -1, c = a, d = 0; d < j.length; d++) {
                var e = j[d],
                    f = a - e.endIndex;
                f > 0 && c > f && (c = f, b = e.endIndex)
            }
            return b
        }

        function g(a) {
            var b = d.defaults.maxNewPagesPerTime; - 1 === b && (b = h.getPageCount());
            var c = parseInt(a / b) * b;
            return new e(c, c + b - 1)
        }
        var h = a,
            i = b,
            j = [],
            k = this;
        this.isContentCreatedPageCountUpdate = !1, this.getContentCreatedPageIndexList = function() {
            for (var a = 0, b = [], c = h.getPageCount(), d = 0; c > d; d++) h.getPageView(d).isContentCreated() && (b[a] = d, a++);
            return b
        }, this.getContentCreatedPageCount = function() {
            var a = k.getContentCreatedPageIndexList();
            return a.length
        }, this.createPages = function(a) {
            var b = h.getPageCount();
            if (0 > a || a >= b) return !1;
            if (c(a)) return !1;
            var d = g(a);
            d.startIndex < 0 && (d.startIndex = 0), d.endIndex >= b && (d.endIndex = b - 1);
            var e = f(d.startIndex);
            j.push(d);
            var i = h.createPagesView(d.startIndex, d.endIndex, e);
            if (h.getRotate % 180 == 0) return i;
            k.isContentCreatedPageCountUpdate = !0;
            for (var l = 0; b > l; l++) {
                var m = h.getPageView(l);
                m.isContentCreated() && m.updateDimension()
            }
            return i
        }, this.updateAdjacentPageContent = function() {
            var a = !1,
                b = h.getVisiblePageRange(),
                c = b.end,
                d = b.begin,
                e = h.getPageCount(),
                f = h.getScrollApi();
            if (f) {
                if (d >= 1 && !h.getPageView(d - 1).isContentCreated() && (a = k.createPages(d - 1)), e - 1 > c && !h.getPageView(c + 1).isContentCreated() && (a |= k.createPages(c + 1)), a) {
                    var g = f.getContentPositionX();
                    f.scrollToX(g)
                }
                return a
            }
        }, this.createAdjacentPage = function(a, b) {
            var c = h.getPageCount(),
                d = k.countVisiblePageRange(),
                e = d.end,
                f = d.begin,
                g = h.getScrollApi();
            if (g) {
                var i = !1;
                if (f >= 1 && !h.getPageView(f - 1).isContentCreated() && (i = k.createPages(f - 1)), c - 1 > e && !h.getPageView(e + 1).isContentCreated() && (i |= k.createPages(e + 1)), i) {
                    var j = g.getContentPositionX();
                    d = k.countVisiblePageRange(), e = d.end, f = d.begin, k.progressiveUpdatePageDimension(a, f, e, b, !0, !1), h.reinitializeScrollBar();
                    var l = document.getElementById(h.getPageView(a).getPageViewContainerID()),
                        m = jQuery(l).position();
                    g.scrollToY(m.top + b), g.scrollToX(j), k.createAdjacentPage(a, b), h.reinitializeScrollBar();
                    var m = jQuery(l).position();
                    g.scrollToY(m.top + b), g.scrollToX(j)
                }
            }
        }, this.progressiveUpdatePageDimension = function(a, b, c, e, f, g) {
            var i = h.getPageCount(),
                j = !1,
                k = d.defaults.maxResizePagesPerTime; - 1 === k && (k = h.getPageCount());
            var l = b - k > 0 ? b - k : 0,
                m = c + k;
            m >= i && (m = i - 1);
            for (var n, o = l; m >= o; o++) n = h.getPageView(o), n.isContentCreated() && !n.isDimensionUpdated() && (n.updateDimension(), n.setScale(h.getScale()), n.setDimensionUpdated(!0), j = !0);
            if (j && g) {
                var p = h.getScrollApi();
                if (p) {
                    h.reinitializeScrollBar();
                    var q = p.getContentPositionX();
                    n = h.getPageView(a);
                    var r = document.getElementById(n.getPageViewContainerID()),
                        s = jQuery(r).position();
                    p.scrollToY(s.top + e), f && p.scrollToX(q)
                } else h.reinitializeScrollBar();
                return !0
            }
            return !1
        }, this.countVisiblePageRange = function() {
            for (var a, b, c, d, e, f = {
                    begin: 0,
                    current: 0,
                    end: 1
                }, g = k.getContentCreatedPageIndexList(), j = g.length, l = 0, m = j - 1, n = l + m >> 1, o = $("#" + i), p = o.height(), q = o.offset(); n > l;)
                if (a = h.getPageView(g[n]), b = $("#" + a.getPageViewContainerID()), c = b.offset(), d = a.getPageViewHeight(), e = c.top, e <= q.top && e + d <= q.top) l = n + 1, n = l + m >> 1;
                else {
                    if (!(e > q.top + p)) break;
                    m = n - 1, n = l + m >> 1
                }
            f.begin = g[n], f.end = f.begin;
            var r;
            for (r = n; r >= 0; r--) {
                if (a = h.getPageView(g[r]), b = $("#" + a.getPageViewContainerID()), c = b.offset(), d = a.getPageViewHeight(), e = c.top, !(e + d > q.top)) {
                    r == n && j - 1 > n && (n += 1, f.begin = g[n]);
                    break
                }
                f.begin = g[r]
            }
            for (f.current = f.begin, f.end = g[n], r = n + 1; j > r && (a = h.getPageView(g[r]), b = $("#" + a.getPageViewContainerID()), c = b.offset(), e = c.top, e < p + q.top); r++) f.end = g[r];
            for (r = f.begin; r <= f.end; r++) a = h.getPageView(r), a.isContentCreated() || (f.begin = r + 1);
            for (r = f.begin; r <= f.end; r++)
                if (a = h.getPageView(r), a.isContentCreated() && (b = $("#" + a.getPageViewContainerID()), d = a.getPageViewHeight(), c = b.offset(), e = c.top, e >= q.top && e < q.top + p && e + d / 3 <= q.top + p || e <= q.top && e + d >= q.top + 2 * p / 3)) {
                    f.current = r;
                    break
                }
            return f
        }
    }, WebPDF.PDFView.ProgressiveViewerGenerator
}), define("core/PDFView/PDFContinuousView", ["core/Config", "core/WebPDF"], function(a, b, c) {
    a("core/Config");
    var d = WebPDF.Config;
    return WebPDF.PDFView.PDFContinuousView = function(a, b, c) {
        var e = a,
            f = b,
            g = c,
            h = e.getScrollApi();
        this.getName = function() {
            return WebPDF.PDFView.RD_BRMODE_CONTINUOUS
        }, this.getPageSpace = function() {
            return f.getContinuousPageSpace()
        }, this.gotoPage = function(a, b, c, f) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof b && null != b && "undefined" != typeof e && null != e) {
                e.unBindScrollEvent();
                var i = e.getPageCount(),
                    j = d.defaults.maxNewPagesPerTime;
                if (-1 === j && (j = i), (a + 1) % j === 0) g.createPages(a + 1), g.createPages(a);
                else {
                    var k = a + 1;
                    k >= i && (k = i - 1), g.createPages(k)
                }
                var l = document.getElementById(e.getPageView(a).getPageViewContainerID());
                g.progressiveUpdatePageDimension(a, b, b, f, !0, !0);
                var m = jQuery(l).position();
                h.scrollToY(m.top + f), h.scrollToX(c), g.createAdjacentPage(a, f), e.bindScrollEvent()
            }
        }, this.onZoom = function(a) {
            e.unBindScrollEvent();
            var b = document.getElementById(e.getPageView(a).getPageViewContainerID());
            h.scrollToElement(b, !0, !1), e.bindScrollEvent()
        }, this.onRotate = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof e && null != e) {
                e.unBindScrollEvent();
                var b = document.getElementById(e.getPageView(a).getPageViewContainerID());
                h.scrollToElement(b, !0, !1), e.bindScrollEvent()
            }
        }, this.onSize = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof e && null != e) {
                e.unBindScrollEvent();
                var b = document.getElementById(e.getPageView(a).getPageViewContainerID());
                h.scrollToElement(b, !0, !1), e.bindScrollEvent()
            }
        }, this.active = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof e && null != e) {
                var b = $("#" + e.getDocViewContainerID()),
                    c = b.height(),
                    d = f.getPageViewOffsetDocView(a),
                    g = d.y,
                    h = e.getPageCount(),
                    i = document.getElementById(e.getPageView(a).getPageViewContainerID()),
                    j = e.getPageDomElmHeight(a);
                if (f.changePagesStyle(), c > j && ($(i).css({
                        "margin-bottom": "",
                        "margin-top": ""
                    }), g = 0), a == h - 1 && a > 0) {
                    var k = document.getElementById(e.getPageView(a - 1).getPageViewContainerID());
                    $(k).css({
                        "margin-bottom": "",
                        "margin-top": ""
                    })
                }
                e.gotoPage(a, 0, g)
            }
        }, this.onPageScroll = function(a, b) {}, this.movePage = function(a, b, c) {
            "undefined" != typeof a && null != a && "undefined" != typeof e && null != e && null != h && h.scrollBy(b, c)
        }
    }, WebPDF.PDFView.PDFContinuousView
}), define("core/PDFView/PDFSinglePageView", ["core/Config", "core/WebPDF"], function(a, b, c) {
    a("core/Config");
    var d = WebPDF.Config;
    return WebPDF.PDFView.PDFSinglePageView = function(a, b, c) {
        function e(a, b) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                b = b ? b : f.getVisiblePageRange();
                var c = f.getPageCount(),
                    d = g.getRotate(),
                    e = document.getElementById(f.getPageView(a).getPageViewContainerID());
                if (null != e) {
                    f.unBindScrollEvent(), g.clearPagesSingleStyle(b);
                    var h = {
                        begin: a,
                        end: a
                    };
                    f.notifyPageVisibleStatus(b, h), f.reinitializeScrollBar();
                    var j = $("#" + f.getDocViewContainerID()),
                        k = j.height(),
                        l = f.getPageDomElmHeight(a);
                    if (k > l) {
                        var m = (k - $(e).height()) / 2;
                        if ((90 == d || 270 == d) && (m = (k - $(e).width()) / 2, a == c - 1 && 0 != a)) {
                            var n = document.getElementById(f.getPageView(a - 1).getPageViewContainerID()),
                                o = g.getPageViewOffsetDocView(a - 1),
                                p = $(n).width(),
                                q = p - o.y;
                            if (0 != q) {
                                i.scrollToElement(e, !0, !1);
                                var r = g.getPageViewOffsetDocView(a);
                                g.setSinglePageStyle(a - 1, null, r.y)
                            }
                        }
                        g.setSinglePageStyle(a, m, m), f.reinitializeScrollBar()
                    }
                    f.bindScrollEvent()
                }
            }
        }
        var f = a,
            g = b,
            h = c,
            i = f.getScrollApi();
        this.getName = function() {
            return WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE
        }, this.getPageSpace = function() {
            return g.getSinglePageSpace()
        }, this.gotoPage = function(a, b, c, g) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof b && null != b && "undefined" != typeof f && null != f) {
                f.unBindScrollEvent();
                var j = f.getPageCount(),
                    k = d.defaults.maxNewPagesPerTime;
                if (-1 === k && (k = j), (a + 1) % k === 0) h.createPages(a + 1), h.createPages(a);
                else {
                    var l = a + 1;
                    l >= j && (l = j - 1), h.createPages(l)
                }
                var m = document.getElementById(f.getPageView(a).getPageViewContainerID());
                h.progressiveUpdatePageDimension(a, b, b, g, !0, !0), e(a), f.unBindScrollEvent();
                var n = $("#" + f.getDocViewContainerID()),
                    o = n.height(),
                    p = f.getPageDomElmHeight(a);
                o > p ? g = 0 : o > p - g ? g = p - o : 0 > g && (g = 0);
                var q = jQuery(m).position();
                i.scrollToY(q.top + g), i.scrollToX(c), h.createAdjacentPage(a, g), f.bindScrollEvent()
            }
        }, this.onZoom = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                e(a), f.unBindScrollEvent();
                var b = document.getElementById(f.getPageView(a).getPageViewContainerID());
                i.scrollToElement(b, !0, !1), f.bindScrollEvent()
            }
        }, this.onRotate = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                e(a), f.unBindScrollEvent();
                var b = document.getElementById(f.getPageView(a).getPageViewContainerID());
                i.scrollToElement(b, !0, !1), f.bindScrollEvent()
            }
        }, this.onSize = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                e(a), f.unBindScrollEvent();
                var b = document.getElementById(f.getPageView(a).getPageViewContainerID());
                i.scrollToElement(b, !0, !1), f.bindScrollEvent()
            }
        }, this.active = function(a) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                var b = $("#" + f.getDocViewContainerID()),
                    c = b.height(),
                    d = g.getPageViewOffsetDocView(a),
                    h = d.y,
                    i = f.getPageDomElmHeight(a);
                g.changePagesStyle(), c > i && (e(a), h = 0), f.gotoPage(a, 0, h)
            }
        }, this.onPageScroll = function(a, b) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                f.unBindScrollEvent();
                var c = f.getVisiblePageRange(),
                    d = f.getVisiblePageRange();
                d.end, d.begin, f.getPageCount();
                if (i) {
                    var g = 0,
                        h = 0,
                        j = f.countVisiblePageRange(),
                        k = $("#" + f.getDocViewContainerID()),
                        l = k.height(),
                        m = null,
                        n = 0;
                    if (j.end != j.begin)
                        if (c.begin == c.end) c.begin == j.begin ? (g = j.end, m = document.getElementById(f.getPageView(g).getPageViewContainerID())) : (g = j.begin, m = document.getElementById(f.getPageView(g).getPageViewContainerID()), n = f.getPageDomElmHeight(g), n > l && (h = n - l - 1));
                        else {
                            var o = b;
                            "undefined" == typeof b && (o = c.begin == j.end || c.end == j.end), o ? (g = j.begin, m = document.getElementById(f.getPageView(g).getPageViewContainerID()), n = f.getPageDomElmHeight(g), n > l && (h = n - l - 1)) : (g = j.end, m = document.getElementById(f.getPageView(g).getPageViewContainerID()))
                        }
                    else {
                        g = j.end;
                        var p = f.getPageDomElmHeight(g);
                        l > p && (m = document.getElementById(f.getPageView(g).getPageViewContainerID()))
                    }
                    if (null != m) {
                        e(g, c), f.unBindScrollEvent();
                        var q = jQuery(m).position();
                        i.scrollToY(q.top + h)
                    }
                }
                f.bindScrollEvent()
            }
        }, this.movePage = function(a, b, c) {
            if ("undefined" != typeof a && null != a && "undefined" != typeof f && null != f) {
                var d = !0,
                    e = f.getPageDomElmHeight(a),
                    h = $("#" + f.getDocViewContainerID()),
                    j = h.height(),
                    k = g.getPageViewOffsetDocView(a),
                    l = k.y;
                j > e ? d = !1 : c > 0 ? l + c + j > e - 1 && (c = e - l - j, d = !1) : 0 > l + c && (d = !1), null != i && d && i.scrollBy(b, c)
            }
        }
    }, WebPDF.PDFView.PDFSinglePageView
}), define("core/PDFView/SinglePageViewLayout", ["core/ViewLevel", "core/WebPDF", "core/PDFView/LayoutInfo", "core/Common", "core/Config"], function(a, b, c) {
    a("core/ViewLevel");
    var d = (a("core/PDFView/LayoutInfo"), a("core/Common"));
    a("core/Config");
    return WebPDF.PDFView.CSinglePageViewLayout = function(a, b, c) {
        function e() {
            var a = 1,
                b = n.getPageCount();
            return p.isFacing && (a = p.facingCount <= b ? p.facingCount : b), a
        }

        function f() {
            var a = n.getMaxPageViewHeight(),
                b = n.getMaxPageViewWidth();
            return h(b, a)
        }

        function g(a, b, c, d) {
            var e = n.getScrollApi(),
                f = n.getDocViewWidth() - e.getScrollBarWidth() - 2 * a - c * (d - 1),
                g = f / b;
            return g
        }

        function h(a, b) {
            var c = e();
            return k(p.marginX, p.marginY, a, b, n.getPageSpane(), c)
        }

        function i(a, b, c, d) {
            var e = b;
            switch (a) {
                case WebPDF.PDFView.RD_ZMODE_CUSTOM:
                    e = b;
                    break;
                case WebPDF.PDFView.RD_ZMODE_ACTUAL_SIZE:
                    e = 1;
                    break;
                case WebPDF.PDFView.RD_ZMODE_FIT_PAGE:
                    e = f();
                    break;
                case WebPDF.PDFView.RD_ZMODE_FIT_WIDTH:
                    e = q.getFitWidthScale();
                    break;
                case WebPDF.PDFView.RD_ZMODE_FIT_HEIGHT:
                    e = q.getFitHeightScale();
                    break;
                case WebPDF.PDFView.RD_ZMODE_FIT_RECTANGLE:
                    e = -1 >= d && -1 >= c ? b : h(d, c);
                    break;
                case WebPDF.PDFView.RD_ZMODE_NONE:
            }
            return e = j(e), (0 == e || "NaN" == e) && (e = b), e
        }

        function j(a) {
            return a = .5 * parseInt((a + .2) / .5), a < p.minScale ? p.minScale : a > p.maxScale ? p.maxScale : a
        }

        function k(a, b, c, d, e, f) {
            var g = n.getDocViewWidth() - 2 * a - e * (f - 1),
                h = g / c,
                i = n.getDocViewHeight() - 2 * b,
                j = i / d;
            return j > h ? h : j
        }

        function l(a) {
            p.iZoomMode = a
        }

        function m(a) {
            p.dbScale = a, n.onZoom(p.dbScale)
        }
        var n = b,
            o = a,
            p = c,
            q = this;
        WebPDF.Environment.mobile ? p.marginX = 3 : p.marginX = 15;
        var r = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        this.getFitWidthScale = function(a) {
            var b = e(),
                c = n.getMaxPageViewWidth(!a);
            return g(p.marginX, c, n.getPageSpane(), b)
        }, this.getFitHeightScale = function() {
            return 1
        }, this.createDocViewHtml = function() {
            var a = "";
            switch (p.showMode) {
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS:
                case WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE:
                    a = "<div id='" + n.getDocViewContainerID() + "' class='fwr-pages scroll-pane' style='position:relative;width:" + n.getDocViewWidth() + "px;height:" + n.getDocViewHeight() + "px; overflow-y: auto;overflow-x: auto;margin-left: 5px'></div>";
                    break;
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS_FACING:
                    a = "<div id='" + n.getDocViewContainerID() + "' style='height:100%;' class='scroll-pane'><div id='" + n.getLeftDocContainerID() + "' class='' style='position:relative;top:0px;overflow:hidden;padding-top: 14px;float:left;margin-left: 5px'></div><div id='" + n.getRightDocContainerID() + "' class='' style='margin-left:10px;position:relative;top:0px;overflow:hidden;padding-top: 14px;float:left';margin-left: 5px></div></div>";
            }
            return a
        }, this.createPageViewHtml = function(a) {
            var b = n.getPageView(a);
            if (!b) return "";
            var c = q.getScale(),
                d = o.getPixelsPerPoint(),
                e = b.getPDFPageWidth() * c * d,
                f = b.getPDFPageHeight() * c * d;
            b.setPageViewWidth(e), b.setPageViewHeight(f);
            var g = n.getScrollApi(),
                h = g ? g.getScrollBarWidth() : 0,
                i = (n.getDocViewWidth() - h - e) / 2,
                j = "height:" + f + "px;width:" + e + "px;margin-left:" + i + "px;",
                k = "border  fwr-hidden fwr-page-bg-image",
                l = "fwr-page-loading",
                m = "fwr-watermark",
                s = "fwr-trial-watermark",
                t = "";
            switch (p.showMode) {
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS:
                    t = "<div class='fwr-page' id='" + b.getPageViewContainerID() + "' style='position:relative;" + j + "'><div id='" + b.getWrapPageID() + "' class='fwr-page border ' style='width:100%;height:100%' ></div><img alt='' src='" + r + "' id='" + b.getPageBackgroundImgID() + "' class='" + k + "' style='width:100%;height:100%;background-size:cover' /><div id='" + b.getPageLoaderImageID() + "' class='" + l + "' /></div><div id='" + b.getTrialWatermarkID() + "' class='" + s + "'></div><div id='" + b.getWatermarkID() + "' class='" + m + "'></div><div id='" + b.getUserWatermarkID() + "'></div>", t += "</div>";
                    break;
                case WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE:
                    t = "<div class='fwr-single-page' id='" + b.getPageViewContainerID() + "' style='position:relative;" + j + "'><div id='" + b.getWrapPageID() + "' class='fwr-page border ' style='width:100%;height:100%' ></div><img alt='' src='" + r + "' id='" + b.getPageBackgroundImgID() + "' class='" + k + "' style='width:100%;height:100%;background-size:cover' /><div id='" + b.getPageLoaderImageID() + "' class='" + l + "' /></div><div id='" + b.getTrialWatermarkID() + "' class='" + s + "'></div><div id='" + b.getWatermarkID() + "' class='" + m + "'></div><div id='" + b.getUserWatermarkID() + "'></div>", t += "</div>";
                    break;
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS_FACING:
                    t = "<div class='fwr-page' id='" + b.getPageViewContainerID() + "' style='position:relative;" + j + "'><div id='" + b.getWrapPageID() + "' class='fwr-page border ' style='width:100%;height:100%' ></div><img alt='' src='" + r + "' id='" + b.getPageBackgroundImgID() + "' class='" + k + "' style='width:100%;height:100%;background-size:cover' /><div id='" + b.getPageLoaderImageID() + "' class='" + l + "' /></div><div id='" + b.getTrialWatermarkID() + "' class='" + s + "'></div><div id='" + b.getWatermarkID() + "' class='" + m + "'></div><div id='" + b.getUserWatermarkID() + "'></div>", t += "</div>"
            }
            return t
        }, this.createPagesView = function(a, b, c) {
            for (var e = document.createDocumentFragment(), f = a; b >= f; f++) {
                var g = q.createPageViewHtml(f),
                    h = document.createElement("div");
                h.innerHTML = g, $(h).css({
                    width: "100%"
                }).addClass("fwr-page-invisible"), e.appendChild(h), n.getPageView(f).setContentCreatedState(!0)
            }
            var i = n.getPageViewContainerID(c);
            return -1 === c ? $("#" + n.getDocViewContainerID())[0].appendChild(e) : d.insertAfter(e, document.getElementById(i).parentNode), !0
        }, this.getPageViewOffsetDocView = function(a) {
            var b = n.getPageView(a);
            if (!b.isContentCreated()) return {
                x: 0,
                y: 0
            };
            var c = $("#" + b.getPageViewContainerID()).offset(),
                d = $("#" + n.getDocViewContainerID()).offset();
            return {
                x: d.left - c.left,
                y: d.top - c.top
            }
        }, this.zoomToPage = function(a, b, c, d, e) {
            if (!(a <= WebPDF.PDFView.RD_ZMODE_CUSTOM || a > WebPDF.PDFView.RD_ZMODE_FIT_VISIBLE)) {
                1 == a && (b = j(b)), l(a);
                var f = i(a, b, d, c, e);
                m(f)
            }
        }, this.getScale = function() {
            return p.scale
        }, this.setScale = function(a) {
            p.scale = a
        }, this.getRotate = function() {
            return p.rotateAngle
        }, this.setRotate = function(a) {
            p.rotateAngle = a
        }, this.getContinuousPageSpace = function() {
            return p.continuousPageSpace
        }, this.getSinglePageSpace = function() {
            return p.singlePageSpace
        }, this.changePagesStyle = function() {
            for (var a = n.getPageCount(), b = 0; a > b; b++) {
                var c = n.getPageView(b);
                c.isContentCreated() && (p.showMode == WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE ? $("#" + n.getPageView(b).getPageViewContainerID()).removeClass("fwr-page").addClass("fwr-single-page") : $("#" + n.getPageView(b).getPageViewContainerID()).removeClass("fwr-single-page").addClass("fwr-page"))
            }
        }, this.clearPagesSingleStyle = function(a) {
            for (var b = n.getPageCount(), c = a.begin; c < a.end + 1; c++) q.setSinglePageStyle(c, null, null), c == b - 1 && c > 0 && q.setSinglePageStyle(c - 1, null, null)
        }, this.setSinglePageStyle = function(a, b, c) {
            var d = document.getElementById(n.getPageView(a).getPageViewContainerID()),
                e = "",
                f = "";
            null != b && (e = b + "px"), null != c && (f = c + "px"), $(d).css({
                "margin-bottom": e,
                "margin-top": f
            })
        }
    }, WebPDF.PDFView.CSinglePageViewLayout
}), define("core/Common", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF"),
        e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        f = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
    return d.Common = {
        Unit: {
            POINT: "point",
            INCH: "inch",
            CM: "cm",
            PICA: "pica"
        },
        preventDefaults: function(a, b) {
            if (!d.Environment.mobile) {
                a || (a = window.event), a.preventDefault && a.preventDefault();
                try {
                    b && document.selection && document.selection.empty()
                } catch (c) {
                    console.error(c)
                }
            }
        },
        getHiddenParamValue: function(a) {
            var b = document.getElementById(a);
            return b ? b.value : null
        },
        queryString: function(a) {
            return (document.location.search.match(new RegExp("(?:^\\?|&)" + a + "=(.*?)(?=&|$)")) || ["", null])[1]
        },
        isStringNullorEmpty: function(a) {
            return void 0 == a || null == a || "" == a ? !0 : !1
        },
        insertAfter: function(a, b) {
            var c = b.parentNode,
                d = null;
            return d = c.lastChild == b ? c.appendChild(a) : c.insertBefore(a, b.nextSibling)
        },
        timestamp2Date: function(a) {
            var b = new Date;
            return new Date(1e3 * (a - 60 * b.getTimezoneOffset()))
        },
        timestampToDateString: function(a, b) {
            var c = new Date,
                d = new Date(1e3 * (a - 60 * c.getTimezoneOffset()));
            return this.formatDate(d, b)
        },
        AnnotTimeFormat: "M/d/yyyy hh:mm:ss",
        isColorBlack: function(a) {
            var b = a.toLowerCase();
            if (b) {
                for (var c = 0, d = 1; 7 > d; d += 2) c += parseInt("0x" + b.slice(d, d + 2));
                return 765 > 2 * c
            }
            return !0
        },
        htmlEncode: function(a) {
            return a = a.replace(/&/g, "&amp;"), a = a.replace(/</g, "&lt;"), a = a.replace(/>/g, "&gt;"), a = a.replace(/"/g, "&quot;"), a = a.replace(/'/g, "&#039;")
        },
        htmlEncodeEx: function(a) {
            var b = "";
            if (0 == a.length) return "";
            for (var c = 0; c < a.length; c++) switch (a.substr(c, 1)) {
                case "<":
                    b += "&lt;";
                    break;
                case ">":
                    b += "&gt;";
                    break;
                case "&":
                    b += "&amp;";
                    break;
                case " ":
                    " " == a.substr(c + 1, 1) ? (b += " &nbsp;", c++) : b += " ";
                    break;
                case '"':
                    b += "&quot;";
                    break;
                case "\n":
                    b += "<br>";
                    break;
                default:
                    b += a.substr(c, 1)
            }
            return b
        },
        formatDate: function(a, b) {
            var c = {
                "M+": a.getMonth() + 1,
                "d+": a.getDate(),
                "h+": a.getHours(),
                "m+": a.getMinutes(),
                "s+": a.getSeconds(),
                "q+": Math.floor((a.getMonth() + 3) / 3),
                S: a.getMilliseconds()
            };
            /(y+)/.test(b) && (b = b.replace(RegExp.$1, (a.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (var d in c) new RegExp("(" + d + ")").test(b) && (b = b.replace(RegExp.$1, 1 == RegExp.$1.length ? c[d] : ("00" + c[d]).substr(("" + c[d]).length)));
            return b
        },
        hexColor2Rgba: function(a, b) {
            var c = 0,
                d = 0,
                e = 0;
            if (/rgb/.test(a)) {
                var f = a.match(/\d+/g);
                c = parseInt(f[0]), d = parseInt(f[1]), e = parseInt(f[2])
            } else {
                if (!/#/.test(a)) return a;
                var g = a.length;
                7 === g ? (c = parseInt(a.slice(1, 3), 16), d = parseInt(a.slice(3, 5), 16), e = parseInt(a.slice(5), 16)) : 4 === g && (c = parseInt(a.charAt(1) + a.charAt(1), 16), d = parseInt(a.charAt(2) + a.charAt(2), 16), e = parseInt(a.charAt(3) + a.charAt(3), 16))
            }
            return "rgba(" + c + "," + d + "," + e + "," + b + ")"
        },
        updateBtnState: function(a, b, c, d) {
            d ? $("#" + a).removeClass(c).addClass(b).addClass("fwr_toolbar_btn") : $("#" + a).removeClass(b).addClass(c).removeClass("fwr_toolbar_btn")
        },
        changeUnit: function(a, b, c) {
            var e = 0,
                f = d.Common.Unit;
            switch (b) {
                case f.POINT:
                    e = a / 72;
                    break;
                case f.INCH:
                    e = a;
                    break;
                case f.CM:
                    e = a / 2.54;
                    break;
                case f.PICA:
                    e = a / 6
            }
            switch (c) {
                case f.POINT:
                    e *= 72;
                    break;
                case f.INCH:
                    break;
                case f.CM:
                    e *= 2.54;
                    break;
                case f.PICA:
                    e *= 6
            }
            return e
        },
        parseValueToDecimal: function(a) {
            if (!a) return !1;
            var b = Math.round(100 * a) / 100,
                c = b.toString(),
                d = c.indexOf(".");
            for (0 > d && (d = c.length, c += "."); c.length <= d + 2;) c += "0";
            return c
        },
        getUnicodeStringLength: function(a) {
            var b = 0,
                c = a.length;
            if (a) {
                for (var d = 0; c > d; d++) str.charCodeAt(d) > 255 ? b += 2 : b++;
                return b
            }
            return 0
        },
        isNeedRetry: function(a) {
            return a == d.ConversionState.IN_PROGRESS || a == d.ConversionState.INITIALIZE
        },
        containsNode: function(a, b, c) {
            return c && a === b ? !0 : $.contains(a, b)
        },
        base64encode: function(a) {
            var b, c, d, f, g, h;
            for (d = a.length, c = 0, b = ""; d > c;) {
                if (f = 255 & a.charCodeAt(c++), c == d) {
                    b += e.charAt(f >> 2), b += e.charAt((3 & f) << 4), b += "==";
                    break
                }
                if (g = a.charCodeAt(c++), c == d) {
                    b += e.charAt(f >> 2), b += e.charAt((3 & f) << 4 | (240 & g) >> 4), b += e.charAt((15 & g) << 2), b += "=";
                    break
                }
                h = a.charCodeAt(c++), b += e.charAt(f >> 2), b += e.charAt((3 & f) << 4 | (240 & g) >> 4), b += e.charAt((15 & g) << 2 | (192 & h) >> 6), b += e.charAt(63 & h)
            }
            return b
        },
        base64decode: function(a) {
            var b, c, d, e, g, h, i;
            for (h = a.length, g = 0, i = ""; h > g;) {
                do b = f[255 & a.charCodeAt(g++)]; while (h > g && -1 == b);
                if (-1 == b) break;
                do c = f[255 & a.charCodeAt(g++)]; while (h > g && -1 == c);
                if (-1 == c) break;
                i += String.fromCharCode(b << 2 | (48 & c) >> 4);
                do {
                    if (d = 255 & a.charCodeAt(g++), 61 == d) return i;
                    d = f[d]
                } while (h > g && -1 == d);
                if (-1 == d) break;
                i += String.fromCharCode((15 & c) << 4 | (60 & d) >> 2);
                do {
                    if (e = 255 & a.charCodeAt(g++), 61 == e) return i;
                    e = f[e]
                } while (h > g && -1 == e);
                if (-1 == e) break;
                i += String.fromCharCode((3 & d) << 6 | e)
            }
            return i
        },
        slideToggle: function(a, b) {
            var c = $(a),
                d = c.data("originalHeight"),
                e = c.is(":visible");
            return 1 == arguments.length && (b = !e), b == e ? !1 : (d || (d = c.show().height(), c.data("originalHeight", d), e || c.hide().css({
                height: 0
            })), void(b ? c.show().animate({
                height: d
            }, {
                duration: 250
            }) : c.animate({
                height: 0
            }, {
                duration: 250,
                complete: function() {
                    c.hide()
                }
            })))
        },
        isElemInteractive: function(a, b) {
            var c = $(b),
                d = c.attr("type");
            d = d ? d.toLowerCase() : "";
            var e = b.nodeName.toLowerCase();
            if ("text" === d || "textarea" === d || "select-one" === d || "option" === b.tagName.toLowerCase() || "select" === e || b.isContentEditable) return !0;
            var f = a.getIgnoreMouseEventClasses(),
                g = !1;
            if ($.each(f, function(a, b) {
                    return c.hasClass(b) || c.parents("." + b).length > 0 ? (g = !0, !0) : void 0
                }), g) return !0;
            var h = $.data(b, "events");
            return !h || 1 == Object.keys(h).length && h.contextmenu ? !1 : !0
        },
        createUniqueId: function() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        },
        vectorLength: function(a) {
            return Math.sqrt(a.x * a.x + a.y * a.y)
        },
        slopeAngle: function(a) {
            return d.Common.arcCosine(a, new d.PDFPoint(1, 0))
        },
        arcCosine: function(a, b) {
            return Math.acos(d.Common.cosine(a, b))
        },
        cosine: function(a, b) {
            var c = d.Common.dotProduct(a, b);
            return c / (d.Common.vectorLength(a) * d.Common.vectorLength(b))
        },
        dotProduct: function(a, b) {
            return a.x * b.x + a.y * b.y
        },
        getSign: function(a) {
            return a > 0 ? 1 : 0 > a ? -1 : 0
        },
        clone: function(a) {
            var b;
            if (a && a instanceof Array) {
                b = [];
                for (var c = 0; c < a.length; c++) b[c] = this.clone(a[c]);
                return b
            }
            if (null === a || "object" != typeof a || a instanceof String || a instanceof Number || a instanceof Boolean || a instanceof Date || a instanceof RegExp) return a;
            b = new a.constructor;
            for (var d in a) {
                var e = a[d];
                b[d] = this.clone(e)
            }
            return b
        },
        addTranslateCss: function(a, b, c, e, f, g) {
            if (null == a) return !1;
            var h = "";
            if (null != b && 0 != b && (h = "rotate(" + b + "deg)"), null != c && 0 != c && (h += "translateX(" + c + "px)"), null != e && 0 != e && (h += "translateY(" + e + "px)"), a.css({
                    "-webkit-transform": h,
                    "-moz-transform": h,
                    "-o-transform": h,
                    "-ms-transform": h,
                    transform: h
                }), null != f && null != g) {
                var i = f + " " + g + ";";
                a.css({
                    "-webkit-transform-origin": i,
                    "-moz-transform-origin": i,
                    "-o-transform-origin": i,
                    "-ms-transform-origin": i,
                    "transform-origin": i
                })
            }
            d.Environment.ie8OrLower && a.css({
                filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + b / 90 + ");"
            })
        },
        getTransformCssString: function(a, b, c, e, f) {
            var g = "";
            null != a && 0 != a && (g = "rotate(" + a + "deg)"), null != b && 0 != b && (g += "translateX(" + b + "px)"), null != c && 0 != c && (g += "translateY(" + c + "px)");
            var h = "";
            return null != e && null != f ? (h += "-webkit-transform:" + g + ";-webkit-transform-origin:" + e + " " + f + ";", h += "-moz-transform:" + g + ";-moz-transform-origin:" + e + " " + f + ";", h += "-o-transform: " + g + ";-o-transform-origin:" + e + " " + f + ";", h += "-ms-transform:" + g + ";-ms-transform-origin:" + e + " " + f + ";", h += "transform:" + g + ";transform-origin:" + e + " " + f + ";") : (h += "-webkit-transform:" + g + ";", h += "-moz-transform:" + g + ";", h += "-o-transform: " + g + ";", h += "-ms-transform:" + g + ";", h += "transform:" + g + ";"), d.Environment.ie8OrLower && (h += "filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=" + a / 90 + ");"), h
        }
    }, d.Common
}), define("core/Event/IMainFrmEventHandler", ["core/Event/Event", "core/WebPDF"], function(a, b, c) {
    return a("core/Event/Event"), WebPDF.Event.IReaderMainFrmEventHandler = function() {}, WebPDF.Event.IReaderMainFrmEventHandler.prototype = {
        getType: function() {
            return "Interface"
        },
        onLButtonDown: function(a) {
            return !1
        },
        onLButtonUp: function(a) {
            return !1
        },
        onMouseMove: function(a) {
            return !1
        },
        onMouseLeave: function(a) {
            return !1
        },
        onMouseOut: function(a) {
            return !1
        }
    }, WebPDF.Event.IReaderMainFrmEventHandler
}), define("core/Event/Event", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    d.Event = {}
}), define("core/Event/IMousePtHander", ["core/Event/Event", "core/WebPDF"], function(a, b, c) {
    return a("core/Event/Event"), WebPDF.Event.IReaderMousePtHandler = function() {}, WebPDF.Event.IReaderMousePtHandler.prototype = {
        getType: function() {
            return "Interface"
        },
        onLButtonDown: function(a) {
            return !1
        },
        onLButtonUp: function(a) {
            return !1
        },
        onLButtonDblClk: function(a) {
            return !1
        },
        onMouseMove: function(a) {
            return !1
        },
        onRButtonDown: function(a) {
            return !1
        },
        onRButtonUp: function(a) {
            return !1
        },
        onRButtonDblClk: function(a) {
            return !1
        },
        onMouseWheel: function(a) {
            return !1
        },
        onMouseOver: function(a) {
            return !1
        },
        onMouseOut: function(a) {
            return !1
        },
        onMouseLeave: function(a) {
            return !1
        },
        onMouseEnter: function(a) {
            return !1
        },
        onDoubleTap: function(a) {},
        onPinchIn: function(a) {},
        onPinchOut: function(a) {},
        onHold: function(a) {}
    }, WebPDF.Event.IReaderMousePtHandler
}), define("core/Tools/HandToolHandler", ["core/Tools/Tools", "core/WebPDF"], function(a, b, c) {
    return a("core/Tools/Tools"), WebPDF.Tools.TOOL_NAME_HAND = "Hand", WebPDF.Tools.HandToolHandler = function() {
        function a() {
            var b = g.getMainView();
            if (null !== b) {
                if (!f) {
                    var c = b.getDocView(),
                        d = $("#" + c.getDocViewContainerID());
                    WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (d.addClass("fwr-hand-cursor-ie"), d.css("cursor", "url(" + g.getBaseUrl() + "images/reader/cursor/hand.cur), auto")) : d.addClass("fwr-hand-cursor"), f = !0
                }
            } else setTimeout(a, 100)
        }

        function b(a) {
            var b = $(a).attr("id");
            return Number(b.substr(b.lastIndexOf("_") + 1))
        }
        var c = !1,
            d = 0,
            e = 0,
            f = !1,
            g = null,
            h = 0,
            i = null;
        this.onInit = function(a) {
            g = a
        }, this.onDestroy = function() {}, this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_HAND
        }, this.onActivate = function() {
            a()
        }, this.onDeactivate = function() {
            var a = g.getMainView().getDocView(),
                b = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? b.removeClass("fwr-hand-cursor-ie") : b.removeClass("fwr-hand-cursor"), f = !1
        }, this.isEnabled = function() {
            return !0
        }, this.isProcessing = function() {
            return c
        }, this.onLButtonDown = function(a) {
            var b = g.getMainView().getDocView(),
                f = b.getDocViewClientRect();
            if (!WebPDF.RectUtils.ptInRect(f, a.pageX, a.pageY)) return !0;
            var h = $("#" + b.getDocViewContainerID());
            return WebPDF.Common.containsNode(h.get(0), a.target, !0) ? (WebPDF.Environment.ieAtLeast11 && WebPDF.Common.preventDefaults(a, !0), c = !0, d = a.pageY, e = a.pageX, WebPDF.Environment.mobile ? $("#fwrm-menu-rotate").hide() : WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (h.removeClass("fwr-hand-cursor-ie"), h.addClass("fwr-catch-cursor-ie"), h.css("cursor", "url(" + g.getBaseUrl() + "images/reader/cursor/catch.cur), auto")) : (h.removeClass("fwr-hand-cursor"), h.addClass("fwr-catch-cursor")), !0) : !1
        }, this.onLButtonUp = function(a) {
            if (c) {
                c = !1;
                var b = g.getMainView().getDocView(),
                    d = $("#" + b.getDocViewContainerID());
                WebPDF.Environment.mobile || (WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (d.removeClass("fwr-catch-cursor-ie"), d.addClass("fwr-hand-cursor-ie"), d.css("cursor", "url(" + g.getBaseUrl() + "images/reader/cursor/hand.cur), auto")) : (d.removeClass("fwr-catch-cursor"), d.addClass("fwr-hand-cursor")))
            }
            return !0
        }, this.onLButtonDblClk = function(a) {
            if (g.isMobile()) {
                var b = g.getMainView().getDocView(),
                    c = $("#" + b.getDocViewContainerID()),
                    d = c.height(),
                    e = c.width(),
                    f = b.getScrollApi();
                f && (e -= f.getScrollBarWidth(), d -= f.getScrollBarHeight());
                var h = c.offset(),
                    i = a.srcEvent.changedTouches[0].pageX,
                    j = a.srcEvent.changedTouches[0].pageY,
                    k = j - h.top,
                    l = i - h.left,
                    m = k / d,
                    n = l / e,
                    o = f.getContentPositionY(),
                    p = 0,
                    q = WebPDF.ViewerInstance.getCurZoomLevel();
                if (WebPDF.ViewerInstance.isFitWidth()) {
                    var r = 1.5 * q;
                    WebPDF.ViewerInstance.zoomTo(r), p = .5 * e * n, o = .5 * d * m + 1.5 * o, f.scrollTo(p, o)
                } else {
                    var s = WebPDF.ZOOM_FIT_WIDTH,
                        t = b.getFitWidthScale(!0);
                    WebPDF.ViewerInstance.zoomTo(s);
                    var u = t / q;
                    p = e * (u - 1) * n, o = d * (u - 1) * m + o * u, f.scrollTo(p, o)
                }
            }
            return !1
        }, this.onMouseMove = function(a) {
            return c ? (WebPDF.Common.preventDefaults(a, !0), g.getMainView().getDocView().movePage(e - a.pageX, d - a.pageY), d = a.pageY, e = a.pageX, !0) : !0
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return c && (c = !1), !0
        }, this.onDoubleTap = function(a) {
            var c = g.getMainView().getDocView(),
                d = c.getScale(),
                e = c.getFitWidthScale(!0);
            return d > e ? (d = e, c.setFitWidth(!0), c.onZoomByPos(e, a.gesture.center.pageX, a.gesture.center.pageY, b(a.srcElement))) : (d = 2 * e, c.setFitWidth(!1), c.onZoomByPos(d, a.gesture.center.pageX, a.gesture.center.pageY, b(a.srcElement))), !0
        }, this.onPinchIn = function(a) {
            var c = a.gesture.scale,
                d = g.getMainView().getDocView();
            i != Hammer.detection.current && (h = 0), i = Hammer.detection.current;
            var e = d.getFitWidthScale(!0),
                f = d.getScale();
            0 === h ? h = f : f = h;
            var j = e;
            if (!(j >= f)) {
                var k = f,
                    l = k * c;
                if (Math.abs(l - k) > .01) {
                    var m = a.gesture.center.pageX,
                        n = a.gesture.center.pageY,
                        o = a.gesture.startEvent.center.pageX,
                        p = a.gesture.startEvent.center.pageY,
                        q = (m + o) / 2,
                        r = (n + p) / 2;
                    e >= l ? (d.setFitWidth(!0), d.onZoomByPos(e, q, r, b(a.srcElement))) : d.onZoomByPos(l, q, r, b(a.srcElement))
                }
            }
        }, this.onPinchOut = function(a) {
            var c = a.gesture.scale,
                d = g.getMainView().getDocView();
            i != Hammer.detection.current && (h = 0), i = Hammer.detection.current;
            var e = d.getFitWidthScale(!0),
                f = d.getScale();
            0 === h ? h = f : f = h;
            var j = e > WebPDF.Config.defaults.maxZoomSize ? e : WebPDF.Config.defaults.maxZoomSize;
            if (!(f >= j)) {
                var k = f,
                    l = k * c;
                if (l - f > .01) {
                    l > e && d.setFitWidth(!1);
                    var m = a.gesture.center.pageX,
                        n = a.gesture.center.pageY,
                        o = a.gesture.startEvent.center.pageX,
                        p = a.gesture.startEvent.center.pageY,
                        q = (m + o) / 2,
                        r = (n + p) / 2;
                    d.onZoomByPos(l, q, r, b(a.srcElement))
                }
                return !0
            }
        }, this.onHold = function(a) {
            var b = g.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
            return b ? b.onHold(a) : !1
        }
    }, WebPDF.Tools.HandToolHandler
}), define("core/MenuItem", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.CMenuItem = function(a) {
        this.name = a.name, this.onShowFunc = a.onShow, this.onSelectFunc = a.onSelect, this.createHtmlContentFunc = a.createHtml;
        var b = this;
        this.createHtml = function() {
            return b.createHtmlContentFunc.call(this)
        }, this.onShow = function() {
            null != this.onShowFunc && b.onShowFunc.call(this)
        }, this.onSelect = function(a) {
            null != this.onSelectFunc && b.onSelectFunc.call(this, a)
        }
    }, d.CMenuItem
}), define("core/PDFData/Text/TextManager", ["core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage"], function(a, b, c) {
    var d = (a("core/PDFData/Text/Reader_TextObject"), a("core/PDFData/Text/Reader_TextPage"));
    return WebPDF.PDFData.Text.TextManager = function(a) {
        var b = {},
            c = {},
            e = this;
        this.ajaxGetTextPage = function(e) {            
            if (!c[e]) {
                var g = {
                    password: a.getPDFPassword()
                };
                c[e] = !0
                /*if(window.location.protocol != "file:"){
                    var bookid = JSON.parse(localStorage.getItem('bookId'));
                    if(bookid == '56f24a41226b031530f1a836' || bookid == '57923dc2d26763694cfe8497' || bookid == '575960e0e76d21070f66f9bc'){
                        var f = "./js/providers/"+bookid+"epub/"+bookid+"/annotations/page" + e;
                    } else {
                        var f = "./js/providers/temp/"+JSON.parse(localStorage.getItem('bookId'))+"/annotations/page" + e;
                    }
                    $.get(f , function(a) {
                        a = JSON.parse(a);
                        var f = 0;
                            if (null != a && (f = a.error), 0 != f) return void(c[e] = !1);
                            if (null == a) return console.warn("Get page text returns null."), !1;
                            try {
                                var g = $.parseJSON(a.TextPageData);
                                if (null != g) {
                                    var h = new d;
                                    h.init(g), b[e] = h
                                }
                            } catch (i) {
                                console.error("Parse page{" + e + "} text failed.");
                                var h = new d;
                                return h.init(""), b[e] = h, c[e] = !1, !1
                            }
                    });
                } else {*/
                    var f = a.getOptions().url + "text/" + e;
                    a.isFormMode() && (f += "?formMode=true");
                    $.ajax({
                        url: f,
                        dataType: "json",
                        data: g,
                        success: function(a) {
                            var f = 0;
                            if (null != a && (f = a.error), 0 != f) return void(c[e] = !1);
                            if (null == a) return console.warn("Get page text returns null."), !1;
                            try {
                                var g = $.parseJSON(a.TextPageData);
                                if (null != g) {
                                    var h = new d;
                                    h.init(g), b[e] = h
                                }
                            } catch (i) {
                                console.error("Parse page{" + e + "} text failed.");
                                var h = new d;
                                return h.init(""), b[e] = h, c[e] = !1, !1
                            }
                        },
                        error: function() {
                            console.error("Get page{" + e + "} text from server failed.");
                            var a = new d;
                            return a.init(""), b[e] = a, c[e] = !1, !1
                        }
                    })
                //}
            }
        }, this.ajaxSearchText = function(b, c) {
            if ("" != b) {
                var d = {
                        password: a.getPDFPassword()
                    },
                    e = a.getOptions().url + "searchtext/" + b + "/" + c;
                $.ajax({
                    url: e,
                    dataType: "json",
                    data: d,
                    async: !0,
                    success: function(a) {
                        var b = a.error;
                        if (0 != b) return null;
                        try {
                            var c = $.parseJSON(a.searchResult);
                            return c
                        } catch (d) {
                            return null
                        }
                    },
                    error: function() {
                        return null
                    }
                })
            }
        }, this.getTextPage = function(a, c) {
            var d = b[a];
            return d || c ? d ? d : null : (e.ajaxGetTextPage(a), b[a] ? b[a] : {
                text: null,
                blocking: !0
            })
        }, this.setTextPage = function(a, e) {
            var f = b[a];
            f || (textPage = new d, textPage.init(e), b[a] = textPage, c[a] = !0)
        }
    }, WebPDF.PDFData.Text.TextManager
}), define("core/PDFData/Text/Reader_TextObject", [], function(a, b, c) {
    var d = (WebPDF.PDFPoint, WebPDF.PDFRect),
        e = (WebPDF.Common, WebPDF.RectUtils);
    WebPDF.PDFData.Text = {};
    var f = function() {
        this.charRect = new d(0, 0, 0, 0), this.charCode = -1
    };
    WebPDF.PDFData.Text.CharInfo = f;
    var g = function() {
        this.index = -1, this.bLeft = !0
    };
    return WebPDF.PDFData.Text.WritingMode = {
        TEXT_WRITING_MODE_LRTB: 0,
        TEXT_WRITING_MODE_RLTB: 1,
        TEXT_WRITING_MODE_LRBT: 2,
        TEXT_WRITING_MODE_RLBT: 3
    }, WebPDF.PDFData.Text.CaretInfo = g, WebPDF.PDFData.Text.PDFTextObject = function() {
        this.objIndex = 0, this.charIndex = 0, this.lineIndex = 0, this.charInfoArray = [], this.objText = "", this.strSize = 0, this.bTrueText = !1, this.textPageMatrix = null, this.writingMode = WebPDF.PDFData.Text.WritingMode.TEXT_WRITING_MODE_LRBT;
        var a = null;
        this.init = function() {
            this.objText = this.getAllCharCodeText(), this.strSize = this.objText.length, this.bTrueText = !0
        }, this.getSize = function() {
            return this.charInfoArray.length
        }, this.getStrSize = function() {
            return this.strSize
        }, this.getObjectIndex = function(a) {
            var b = this.charInfoArray.length;
            if (0 > a || a >= this.strSize || 0 == b) return 0;
            for (var c = 0, d = 0; b > d; d++) {
                var e = this.getCharCodeText(d, 1);
                if (c += e.length, c >= a + 1) return d
            }
            return 0
        }, this.getObjectAllTextRect = function() {
            return this.getObjectTextRect(0, this.charInfoArray.length)
        }, this.getObjectTextRect = function(a, b) {
            var c = this.charInfoArray.length,
                f = null;
            if (0 >= b || 0 == c || 0 > a + b - 1 || a + b - 1 >= c) return f = new d(0, 0, 0, 0);
            f = e.clone(this.charInfoArray[a].charRect);
            for (var g = a + 1; a + b > g; g++) {
                var h = this.charInfoArray[g].charRect;
                e.union(f, h)
            }
            return f
        }, this.getAllObjectPDFRect = function(b) {
            return a || (a = this.getObjectPDFRect(0, this.charInfoArray.length)), b ? e.clone(a) : a
        }, this.getObjectPDFRect = function(a, b) {
            var c = this.charInfoArray.length;
            if (0 > a || a >= c || 0 == c) return new d(0, 0, 0, 0);
            if ((a + b - 1 >= c || -1 == b) && (b = c - a), 0 > a + b - 1 || a + b - 1 >= c) return new d(0, 0, 0, 0);
            var e = this.getObjectTextRect(a, b);
            return e
        }, this.getAllCharCodeText = function() {
            return this.getCharCodeText(0, this.charInfoArray.length)
        }, this.getCharCodeText = function(a, b) {
            var c = this.charInfoArray.length;
            if (0 > a || a >= c) return "";
            if (1 == this.bTrueText && 0 == a && b >= c) return this.objText;
            (a + b - 1 >= c || -1 == b) && (b = c - a);
            for (var d = "", e = a + b - 1, f = a; e >= f; f++) {
                var g = this.charInfoArray[f],
                    h = String.fromCharCode(g.charCode);
                d += h
            }
            return d
        }, this.getTextCaretInfo = function(a, b) {
            var c = this.charInfoArray.length;
            if (0 >= c) return !1;
            b.index = -1;
            var d = this.getObjectAllTextRect();
            if (!e.ptInRect(d, a)) return !1;
            for (var f = 0; c > f; f++) {
                var g = this.getObjectTextRect(f, 1);
                if (e.ptInRect(g, a)) {
                    var h = Math.abs(a.x - g.left),
                        i = Math.abs(g.right - g.left);
                    h > i / 2 ? b.bLeft = !1 : b.bLeft = !0, b.index = f;
                    break
                }
            }
            return -1 != b.index
        }, this.getTextCaretInfoByIndex = function(a, b, c) {
            var d = this.charInfoArray.length;
            return 0 >= d ? !1 : 0 > a || a >= d ? !1 : (b.bLeft = c, b.index = a, !0)
        }
    }, WebPDF.PDFData.Text.PDFTextObject
}), define("core/PDFData/Text/Reader_TextPage", ["core/PDFData/Text/Reader_TextObject"], function(a, b, c) {
    var d = a("core/PDFData/Text/Reader_TextObject"),
        e = (WebPDF.PDFPoint, WebPDF.PDFRect),
        f = (WebPDF.Common, WebPDF.RectUtils),
        g = function(a, b) {
            this.startIndex = a, this.endIndex = b
        };
    WebPDF.PDFData.Text.TextBoundInfo = g;
    var h = WebPDF.PDFData.Text.CharInfo;
    return WebPDF.PDFData.Text.PDFTextPage = function() {
        function a() {
            var a = l.textObjectList.length;
            return 0 === a ? 0 : l.textObjectList[a - 1].lineIndex + 1
        }

        function b(a) {
            var b = /^[0-9a-zA-Z]*$/;
            return !(a > 255 || !b.test(a) && "." != a && "-" != a)
        }

        function c(a, b, c, d) {
            if (b > c) return !1;
            var e, g, h, i, j = -1,
                k = -1;
            for (e = b; c >= e; e++) {
                if (i = l.textObjectList[e].getAllObjectPDFRect(!0), f.intersect(i, a), !f.isEmpty(i))
                    for (h = l.textObjectList[e].getSize(), g = 0; h > g; g++)
                        if (i = l.textObjectList[e].getObjectPDFRect(g, 1), f.intersect(i, a), !f.isEmpty(i)) {
                            j = l.textObjectList[e].objIndex + g;
                            break
                        }
                if (-1 != j) break
            }
            if (-1 == j) return !1;
            for (e = c; e >= b; e--) {
                if (i = l.textObjectList[e].getAllObjectPDFRect(!0), f.intersect(i, a), !f.isEmpty(i))
                    for (h = l.textObjectList[e].getSize(), g = h - 1; g >= 0; g--)
                        if (i = l.textObjectList[e].getObjectPDFRect(g, 1), f.intersect(i, a), !f.isEmpty(i)) {
                            k = l.textObjectList[e].objIndex + g;
                            break
                        }
                if (-1 != k) break
            }
            return d.startIndex = j, d.endIndex = k, !0
        }

        function i(a) {
            if (0 > a || a >= l.getSize()) return -1;
            var c = l.getPageText(a, 1),
                d = c.length;
            if (0 == d) return a;
            var e;
            for (e = d - 1; e >= 0; e--)
                if (!b(c.charAt(e))) return e == d - 1 ? -1 : a;
            var f = l.getLineIndexByIndex(a),
                h = new g(-1, -1),
                j = l.getLineRange(f, h);
            if (!j) return -1;
            var k = h.startIndex,
                m = h.endIndex;
            k = l.textObjectList[k].objIndex, m = l.textObjectList[m].objIndex + l.textObjectList[m].getSize() - 1;
            var n = !1,
                o = 0;
            for (e = a - 1; e >= k; e--) {
                c = l.getPageText(e, 1), d = c.length;
                for (var p = d - 1; p >= 0; p--)
                    if (!b(c.charAt(p))) {
                        o = p == d - 1 ? e + 1 : e, n = !0;
                        break
                    }
                if (n) break
            }
            if (n || (o = k), o != k) return o;
            if (0 == f) return o;
            if (h.startIndex = -1, h.endIndex = -1, j = l.getLineRange(f - 1, h), !j) return -1;
            k = h.startIndex, m = h.endIndex, m = l.textObjectList[m].objIndex + l.textObjectList[m].getSize() - 1, c = l.getPageText(m, 1), d = c.length;
            var q = l.getPageText(o, 1);
            if ("-" != q.charAt(0) && "-" != c.charAt(d - 1)) return o;
            var r = i(m);
            return -1 != r && (o = r), o
        }

        function j(a) {
            if (0 > a || a >= l.getSize()) return -1;
            var c = l.getPageText(a, 1),
                d = c.length;
            if (0 == d) return a;
            var e;
            for (e = 0; d > e; e++)
                if (!b(c.charAt(e))) return 0 == e ? -1 : a;
            var f = l.getLineIndexByIndex(a),
                h = new g(-1, -1),
                i = l.getLineRange(f, h);
            if (!i) return -1;
            var k = h.startIndex,
                m = h.endIndex;
            m = l.textObjectList[m].objIndex + l.textObjectList[m].getSize() - 1;
            var n = !1,
                o = 0;
            for (e = a + 1; m >= e; e++) {
                c = l.getPageText(e, 1), d = c.length;
                for (var p = 0; d > p; p++)
                    if (!b(c.charAt(p))) {
                        o = 0 == p ? e - 1 : e, n = !0;
                        break
                    }
                if (n) break
            }
            if (n || (o = m), o != m) return o;
            if (f == l.lineCount - 1) return o;
            if (h.startIndex = -1, h.endIndex = -1, i = l.getLineRange(f + 1, h), !i) return -1;
            k = h.startIndex, m = h.endIndex, k = l.textObjectList[k].objIndex, m = l.textObjectList[m].objIndex + l.textObjectList[m].getSize() - 1, c = l.getPageText(m, 1);
            var q = l.getPageText(o, 1);
            if ("-" != q.charAt(q.length - 1) && "-" != c.charAt(0)) return o;
            var r = j(k);
            return -1 != r && (o = r), o
        }

        function k(a) {
            for (var b = l.textObjectList.length, c = 0; b > c; c++)
                if (a <= l.textObjectList[c].objIndex + l.textObjectList[c].getSize() - 1) return a < l.textObjectList[c].objIndex ? -1 : c;
            return -1
        }
        this.textObjectList = [], this.strSize = 0, this.pageIndex = -1, this.lineCount = 0;
        var l = this;
        this.init = function(b) {
            try {
                if (!b) return !1;
                if (null == b.pagenum) return console.warn("Page index of text data is null."), !1;
                if (this.pageIndex = parseInt(b.pagenum), null == b.texts) return console.warn("Parse text object data failed."), !1;
                for (var c = b.texts, g = 0; g < c.length; g++) {
                    var i = c[g];
                    if (null == i.li || null == i.ci || null == i.oi || null == i.cs) return console.warn("Parse text object data failed."), !1;
                    var j = new d;
                    j.lineIndex = parseInt(i.li), j.objIndex = parseInt(i.oi), j.charIndex = parseInt(i.ci);
                    for (var k = i.cs, l = 0; l < k.length; l++) {
                        var m = k[l];
                        if (5 != m.length) return !1;
                        var n = new h,
                            o = parseFloat(m[0]),
                            p = parseFloat(m[1]),
                            q = parseFloat(m[2]),
                            r = parseFloat(m[3]);
                        n.charRect = new e(o, p, o + q, p + r), f.normalize(n.charRect), n.charCode = parseInt(m[4]), j.charInfoArray.push(n)
                    }
                    if (j.textPageMatrix = new WebPDF.PDFMatrix, "undefined" != typeof i.mt && null != i.mt) {
                        var s = i.mt;
                        j.textPageMatrix.Set(s[0], s[1], s[2], s[3], s[4], s[5])
                    } else j.textPageMatrix.Set(1, 0, 0, 1, 0, 0);
                    "undefined" != typeof i.wm && null != i.wm && (j.writingMode = i.wm), j.init(), this.textObjectList.push(j)
                }
                var t = this.textObjectList[this.textObjectList.length - 1];
                t ? this.strSize = t.charIndex + t.getStrSize() + 1 : this.strSize = 0, this.lineCount = a()
            } catch (u) {
                return console.error(u), !1
            }
            return !0
        }, this.getObjTextIndexByPoint = function(a) {
            for (var b = this.textObjectList.length, c = 0; b > c; c++) {
                var d = this.textObjectList[c].getAllObjectPDFRect(!1);
                if (f.ptInRect(d, a.x, a.y)) return c
            }
            return -1
        }, this.getCharIndexByPoint = function(a) {
            var b = this.getObjTextIndexByPoint(a);
            if (-1 == b) return -1;
            for (var c = this.textObjectList[b].getSize(), d = -1, e = 0; c > e; e++) {
                var g = this.textObjectList[b].getObjectPDFRect(e, 1);
                if (f.ptInRect(g, a.x, a.y)) {
                    d = e;
                    break
                }
            }
            return -1 == d ? -1 : this.textObjectList[b].objIndex + d
        }, this.getPDFRect = function(a, b, c, d) {
            var e = [],
                f = this.getSize();
            if (0 > a || a >= f || 0 >= b) return e;
            a + b > f && (b = f - a);
            for (var g = -1, h = -1, i = this.textObjectList.length, j = 0; i > j; j++) {
                var k = this.textObjectList[j],
                    l = k.objIndex + k.getSize() - 1;
                if (l >= a) {
                    g = j, h = a - k.objIndex, 0 > h && (h = 0, b--);
                    break
                }
            }
            for (var m = g, n = h, o = 0; b > 0;) {
                if (m >= i) return 0;
                var p = this.textObjectList[m],
                    q = p.getSize(),
                    r = q - n,
                    s = p.getObjectPDFRect(n, b);
                if (e.push(s), "undefined" != typeof c && null != c && c.push(p.textPageMatrix), "undefined" != typeof d && null != d && d.push(p.writingMode), o++, b -= r, b > 0 && i - 1 > m) {
                    var t = p.objIndex + q - 1,
                        u = this.textObjectList[m + 1].objIndex;
                    u - t != 1 && b--
                }
                m++, n = 0
            }
            return e
        }, this.getObjIndexByCharIndex = function(a) {
            if (a >= this.strSize) return -1;
            for (var b = this.textObjectList.length, c = 0; b > c; c++) {
                var d = this.textObjectList[c];
                if (a <= d.charIndex + d.getStrSize() - 1) {
                    if (a < d.charIndex) return c > 0 && d.lineIndex != this.textObjectList[c - 1].lineIndex ? d.objIndex : d.objIndex - 1;
                    var e = a - d.charIndex;
                    return d.objIndex + d.getObjectIndex(e)
                }
            }
            return 0
        }, this.getStrSize = function() {
            return this.strSize
        }, this.getSize = function() {
            var a = this.textObjectList.length;
            return 0 == a ? 0 : this.textObjectList[a - 1].objIndex + this.textObjectList[a - 1].getSize()
        }, this.getPageAllText = function() {
            var a = this.textObjectList.length;
            return 0 == a ? "" : this.getPageText(0, this.getSize())
        }, this.getPageText = function(a, b) {
            var c = this.getSize();
            if (0 > a || a >= c || 0 >= b) return "";
            a + b > c && (b = c - a);
            for (var d = -1, e = -1, f = this.textObjectList.length, g = "", h = 0; f > h; h++) {
                var i = this.textObjectList[h],
                    j = i.objIndex + i.getSize() - 1;
                if (j >= a) {
                    d = h, e = a - i.objIndex, 0 > e && (e = 0, g = " ", b--);
                    break
                }
            }
            for (var k = d, l = e; b > 0;) {
                if (k >= f) return "";
                var m = this.textObjectList[k],
                    n = m.getSize(),
                    o = n - l;
                if (g += m.getCharCodeText(l, b), b -= o, b > 0 && k != f - 1) {
                    var p = this.textObjectList[k + 1],
                        q = p.objIndex,
                        r = m.objIndex + m.getSize() - 1,
                        s = p.lineIndex,
                        t = m.lineIndex;
                    if (s != t) {
                        var u = p.charIndex,
                            v = m.charIndex + m.getStrSize() - 1;
                        u - v != 1 && (g += "\r\n")
                    } else q - r != 1 && (g += " ", b--)
                }
                k++, l = 0
            }
            return g
        }, this.getBoundPageInfo = function(a, b) {
            for (var d = 0; d < this.lineCount; d++) {
                var e = new g(-1, -2);
                this.getLineRange(d, e);
                var f = new g(-1, -1);
                c(a, e.startIndex, e.endIndex, f) && b.push(f)
            }
            return 0 != b.length
        }, this.getWordRange = function(a, b) {
            return 0 > a || a >= this.getSize() ? !1 : (b.startIndex = i(a), -1 == b.startIndex && (b.startIndex = b.endIndex = a), b.endIndex = j(a), -1 == b.endIndex && (b.startIndex = b.endIndex = a), !0)
        }, this.getLineRange = function(a, b) {
            var c = this.binarySearch(a);
            if (-1 == c) return !1;
            b.startIndex = b.endIndex = c;
            for (var d = c - 1; d >= 0 && this.textObjectList[d].lineIndex == a; d--) b.startIndex = d;
            for (var e = this.textObjectList.length, f = c + 1; e > f && this.textObjectList[f].lineIndex == a; f++) b.endIndex = f;
            return !0
        }, this.binarySearch = function(a) {
            for (var b, c = 0, d = this.textObjectList.length - 1; d >= c;) {
                if (b = parseInt((c + d) / 2), this.textObjectList[b].lineIndex == a) return b;
                this.textObjectList[b].lineIndex > a ? d = b - 1 : c = b + 1
            }
            return -1
        }, this.getLineIndexByIndex = function(a) {
            for (var b = this.textObjectList.length, c = 0; b > c; c++)
                if (a <= this.textObjectList[c].objIndex + this.textObjectList[c].getSize() - 1) return this.textObjectList[c].lineIndex;
            return -1
        }, this.getCaretByIndex = function(a, b, c) {
            if (0 > a || a >= this.getSize()) return !1;
            var d = k(a);
            if (-1 == d) return !1;
            var e = a - this.textObjectList[d].objIndex;
            return this.textObjectList[d].getTextCaretInfoByIndex(e, b, c), b.index += this.textObjectList[d].objIndex, !0
        }, this.getCaretAtPoint = function(a, b) {
            var c = this.getObjTextIndexByPoint(a);
            if (-1 == c) return !1;
            var d = this.textObjectList[c].getTextCaretInfo(a, b);
            return d ? (b.index += this.textObjectList[c].objIndex, !0) : !1
        }
    }, WebPDF.PDFData.Text.PDFTextPage
}), define("core/Plugins/Annot/BaseAnnotPlugin", ["core/Plugins/Annot/AnnotHandleManager", "core/ImageEngine/AnnotUIManager", "core/Math/Rect", "core/WebPDF", "core/ImageEngine/PDFAnnotationLoader", "core/Plugins/Annot/MarkupAnnotHandler", "core/Plugins/Annot/PopupMousePtHandler", "core/PDFData/TypewriterAnnot", "core/PDFData/Annot", "core/DataLevel", "core/Math/Point", "core/Interface", "core/Plugins/Annot/CommentAnnotHandler", "core/Plugins/Annot/CommonMarkupAnnotHandler", "core/Plugins/Annot/LinkAnnotHandler", "core/Plugins/Annot/TextAnnotHandler", "core/Plugins/Annot/TypewriterAnnotHandler", "core/Plugins/Annot/DrawingAnnotHandler", "core/Plugins/Annot/CommentsAnnot", "core/Plugins/Annot/AnnotMousePtHandler", "core/Plugins/Annot/AnnotSelectionTool", "core/Plugins/TextSelection/Reader_TextSelectTool", "core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage", "core/Plugins/TextSelection/Reader_TextPageSelect", "core/Plugins/Annot/TextAnnotToolHandler", "core/PDFData/AnnotFactory", "core/PDFData/MarkupAnnot", "core/PDFData/LinkAnnot", "core/PDFData/Action", "core/PDFData/Dest", "core/PDFData/InkAnnot", "core/PDFData/Signature", "core/PDFData/InkSign", "core/Plugins/Annot/TypewriterAnnotToolHandler", "core/Plugins/Annot/CommentAnnotToolHandler", "core/Plugins/Annot/DrawingAnnotToolHandler", "core/Plugins/Annot/DrawingTools"], function(a, b, c) {
    a("core/Plugins/Annot/AnnotHandleManager");
    WebPDF.AnnotFactory;
    a("core/Plugins/Annot/CommentsAnnot");
    a("core/Plugins/Annot/AnnotMousePtHandler");
    a("core/Plugins/Annot/AnnotSelectionTool");
    var d = WebPDF.Tools.AnnotSelectionToolHandler;
    a("core/Plugins/Annot/TextAnnotToolHandler");
    var e = WebPDF.Tools.TextAnnotToolHandler,
        f = a("core/Plugins/Annot/TypewriterAnnotToolHandler");
    a("core/Plugins/Annot/CommentAnnotToolHandler"), a("core/Plugins/Annot/DrawingAnnotToolHandler"), a("core/ImageEngine/PDFAnnotationLoader"), a("core/PDFData/AnnotFactory"), WebPDF.BASEANNOT_PLUGIN_NAME = "BaseAnnotPlugin";
    WebPDF.BaseAnnotPlugin = function(a) {
        function b() {
            g.getPDFDoc();
            j = !0, h.init(), k = new d(g, h), g.registerToolHandler(k), l = new e(i), g.registerToolHandler(l);
            var a = new WebPDF.Event.AnnotMousePtHandler(i);
            g.registerMousePtHandler(a);
            var b = new f(WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER, i);
            g.registerToolHandler(b);
            var c = new WebPDF.Event.CommentAnnotToolHandler(WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT);
            g.registerToolHandler(c);
            var m = new WebPDF.Event.CommentAnnotToolHandler(WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE);
            g.registerToolHandler(m);
            var n = new WebPDF.Event.InkAnnotToolHandler;
            g.registerToolHandler(n);
            for (var o = g.getMainView().getDocView(), p = o.getVisiblePageRange(), q = $("#" + o.getDocViewContainerID()), r = o.getDocViewDimension(), s = r.height, t = r.width, u = q.offset(), v = p.begin; v <= p.end; v++) {
                var w = o.getPageView(v);
                w.isPageLoaded() && h.onPageVisible(w, t, s, u)
            }
            q.on("keydown", function(a) {
                var b = a.keyCode || a.which;
                46 == b && h.deleteSelection()
            })
        }

        function c() {
            g.getMainView().getDocView();
            $(g).on(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, function(a, b) {
                var c = (g.getMainView().getDocView(), this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME)),
                    d = null;
                c && (d = c.getAnnotHandlerMgr()), d && d.onDocViewZoom(b.newScale)
            }).on(WebPDF.EventList.DOCVIEW_RESIZE, function() {
                var a = (g.getMainView().getDocView(), this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME)),
                    b = null;
                a && (b = a.getAnnotHandlerMgr()), b && b.onDocViewResize()
            }).on(WebPDF.EventList.DOCVIEW_PRE_RESIZE, function() {
                var a = (g.getMainView().getDocView(), this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME)),
                    b = null;
                a && (b = a.getAnnotHandlerMgr()), b && b.onPreDocViewResize()
            }).on(WebPDF.EventList.DOCVIEW_SCROLL, function() {
                var a = (g.getMainView().getDocView(), this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME)),
                    b = null;
                a && (b = a.getAnnotHandlerMgr()), b && b.onDocViewScroll()
            }).on(WebPDF.EventList.PAGE_INVISIBLE, function(a, b) {
                var c = g.getMainView().getDocView(),
                    d = this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME),
                    e = null;
                if (d && (e = d.getAnnotHandlerMgr()), e)
                    for (var f = 0; f < b.pages.length; f++) e.onPageInvisible(c.getPageView(b.pages[f]))
            }).on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function(a, b) {
                var c = (g.getMainView().getDocView(), this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME)),
                    d = null;
                c && (d = c.getAnnotHandlerMgr()), d && d.onPageShowComplete(b.pageView)
            }).on(WebPDF.EventList.PAGE_VISIBLE, function(a, b) {
                var c = g.getMainView().getDocView(),
                    d = this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME),
                    e = null;
                if (d && (e = d.getAnnotHandlerMgr()), e)
                    for (var f = 0; f < b.pages.length; f++) e.onPageVisible(c.getPageView(b.pages[f]), b.contentPanelWidth, b.contentPaneHeight, b.contentPanelOffset, !1)
            })
        }
        var g = a,
            h = null,
            i = this,
            j = !1,
            k = null,
            l = null;
        this.getName = function() {
            return WebPDF.BASEANNOT_PLUGIN_NAME
        }, this.init = function() {
            h = new WebPDF.AnnotHandleManager(g, i), g.isAnnotEventInit() || (c(), g.setAnnotEventInit(!0));
            var a = new WebPDF.ImageEngine.PDFAnnotationLoader;
            a.asyncLoadUserAnnotation(g, g.getPDFDoc(), b, $.noop)
        }, this.getAnnotationDataToSave = function() {
            for (var a = WebPDF.Tool.getReaderApp().getMainView().getDocView(), b = a.getPDFDoc(), c = b.getPageCount(), d = [], e = 0; c > e; e++) {
                var f = a.getPageView(e);
                if (f.isModified()) {
                    var g = {};
                    g.number = e;
                    var h = f.getPDFPage().getAnnotJsonData();
                    g.annots = h, d.push(g)
                }
            }
            return d
        }, this.saveAnnots = function(b, c, d, e, f, h) {
            var j = WebPDF.Tool.getReaderApp().getMainView().getDocView();
            if (!j.isModified() && d) return void(e && e(0));
            var k = i18n.t("CommonDialog.WaitMsgSave");
            h && (k = h);
            var l = i.getAnnotationDataToSave();
            if (0 != l.length) {
                WebPDF.waiting({
                    message: k
                });
                var m = {
                    filePath: WebPDF.Tool.getReaderApp().getFileID(),
                    data: JSON.stringify(l),
                    checkin: !b,
                    v: WebPDF.Tool.getReaderApp().getDocVersion(),
                    cm: c,
                    modifyed: j.isModified(),
                    password: a.getPDFPassword()
                };
                $.ajax({
                    type: "post",
                    url: a.getOptions().url + "save",
                    data: m,
                    dataType: "json",
                    success: function(b) {
                        if (WebPDF.closeWaiting({}), null == b) return WebPDF.alert(g, "", i18n.t("CommonDialog.SaveCommentsFailedMsg")), void(f && f(-1));
                        var c = "",
                            d = b.error;
                        if (0 != d) {
                            var h = (_preaderApp.GetPluginByName(FXREADER.SPCHECKINOUT_PLUGIN_NAME), _pReaderApp.GetPluginByName(FXREADER.FORM_PLUGIN_NAME), !1);
                            c = i18n.t("Error.UnknownError") + d, f && f(d), WebPDF.alert(g, "", c, FXREADER.DialogType.MB_ICONERROR, null, null, h)
                        } else {
                            for (var i = l.length, k = {}, m = 0; i > m; m++) {
                                var n = l[m],
                                    o = n.number,
                                    p = j.getPageView(o).getPDFPage(),
                                    q = p.getAnnotsMap();
                                for (var r in q) {
                                    var s = q[r];
                                    s.isVisible() || s.isAnnotSource() || (k[r] = 1)
                                }
                                p.deleteAnnots(k), j.getPageView(o).setModified(!1)
                            }
                            a.updateVersion(b.version), j.setModified(!1), null != e && e(d)
                        }
                    },
                    error: function() {
                        f && f(WebPDF.CheckInOutErrorCode.ERROR_CHECK_INOUT_EXCEPTION), WebPDF.closeWaiting({}), d ? WebPDF.alert(g, "", i18n.t("CheckInOut.SaveCommentsFailedMsg")) : WebPDF.alert(g, "", i18n.t("CheckInOut.CheckInFailedMsg"))
                    }
                })
            }
        }, this.onAnnotLButtonDown = function(a, b, c) {
            return h.onAnnotLButtonDown(a, b, c)
        }, this.onAnnotLButtonUp = function(a, b, c) {
            return h.onAnnotLButtonUp(a, b, c)
        }, this.onAnnotLButtonDblClk = function(a, b, c) {
            return h.onAnnotLButtonDblClk(a, b, c)
        }, this.onAnnotMouseMove = function(a, b, c) {
            return h.onAnnotMouseMove(a, b, c)
        }, this.onAnnotMouseOver = function(a, b, c) {
            return h.onAnnotMouseOver(a, b, c)
        }, this.onAnnotMouseLeave = function(a, b, c) {
            return h.onAnnotMouseLeave(a, b, c)
        }, this.onAnnotRButtonDown = function(a, b, c) {
            return h.onAnnotRButtonDown(a, b, c)
        }, this.onAnnotHold = function(a, b, c) {
            return h.onAnnotHold(a, b, c)
        }, this.onRegister = function() {}, this.unload = function() {
            h && (h.clear(), delete h), h = null
        }, this.getReaderApp = function() {
            return g
        }, this.registerAnnotHandler = function(a) {
            h.registerAnnotHandler(a)
        }, this.getAnnotHandlerMgr = function() {
            return h
        }
    }, b.createPlugin = function(a) {
        return new WebPDF.BaseAnnotPlugin(a)
    }
}), define("core/Plugins/Annot/AnnotHandleManager", ["core/ImageEngine/AnnotUIManager", "core/Math/Rect", "core/WebPDF", "core/ImageEngine/PDFAnnotationLoader", "core/Plugins/Annot/MarkupAnnotHandler", "core/Plugins/Annot/PopupMousePtHandler", "core/PDFData/TypewriterAnnot", "core/PDFData/Annot", "core/DataLevel", "core/Math/Point", "core/Interface", "core/Plugins/Annot/CommentAnnotHandler", "core/Plugins/Annot/CommonMarkupAnnotHandler", "core/Plugins/Annot/LinkAnnotHandler", "core/Plugins/Annot/TextAnnotHandler", "core/Plugins/Annot/TypewriterAnnotHandler", "core/Plugins/Annot/DrawingAnnotHandler"], function(a, b, c) {
    a("core/ImageEngine/AnnotUIManager"), a("core/ImageEngine/PDFAnnotationLoader");
    var d = (WebPDF.Common, WebPDF.PDFPoint),
        e = WebPDF.PDFRect,
        f = WebPDF.RectUtils;
    a("core/Plugins/Annot/MarkupAnnotHandler"), a("core/PDFData/TypewriterAnnot");
    var g = a("core/Plugins/Annot/CommentAnnotHandler"),
        h = (a("core/Plugins/Annot/CommonMarkupAnnotHandler"), a("core/Plugins/Annot/LinkAnnotHandler")),
        i = a("core/Plugins/Annot/TextAnnotHandler"),
        j = a("core/Plugins/Annot/TypewriterAnnotHandler"),
        k = a("core/Plugins/Annot/DrawingAnnotHandler");
    return WebPDF.AnnotHandleManager = function(a, b) {
        function c() {
            var a = "<div id='" + u + "'><ul id='" + v + "' class='fwrContextMenu fwr-cm-default' style='left: 341px; top: 167px; display: none;'></div>";
            $(document.body).append(a);
            var b = "<li id='delete_annot' class='icon'  style='width: 100px;' menuname='DeleteAnnot'>" + i18n.t("Annot.DeleteAnnotMenuItem") + "</li>";
            $("#" + v).append(b)
        }

        function l() {
            for (var a = p.getMainView().getDocView().getPDFDoc().getPageCount(), b = 0; a > b; b++) E[b] = !1
        }

        function m(a, b, c) {
            var d, g, h, i, j = a.getPageViewWidth(),
                k = a.getPageViewHeight(),
                l = a.getDocView().getRotate(),
                m = b - B,
                n = c - C,
                o = new e,
                p = !0,
                q = new e;
            for (var s in r) {
                if (g = r[s], i = H.getAnnotMoveDivID(a, s), d = document.getElementById(i)) {
                    var t = $(d);
                    q.top = parseFloat(t.css("top")), q.left = parseFloat(t.css("left")), q.bottom = q.top + parseFloat(t.css("height")), q.right = q.left + parseFloat(t.css("width"))
                } else h = g.getRect(), q = a.pdfRectToDevice(h, !0);
                p ? f.copy(q, o) : f.union(o, q), p = !1
            }
            if (m > 0) {
                var u = 0;
                90 == l ? (m = -m, u = o.top + m, 0 > u && (m = -o.top)) : 180 == l ? (m = -m, u = o.left + m, 0 > u && (m = -o.left)) : 270 == l ? (u = o.bottom + m, u > j && (m = j - o.bottom)) : (u = o.right + m, u > j && (m = j - o.right))
            } else {
                var v = 0;
                90 == l ? (m = -m, v = o.bottom + m, v > j && (m = j - o.bottom)) : 180 == l ? (m = -m, v = o.right + m, v > j && (m = j - o.right)) : 270 == l ? (v = o.top + m, 0 > v && (m = -o.top)) : (v = o.left + m, 0 > v && (m = 0 - o.left))
            }
            if (n > 0) {
                var w = 0;
                90 == l ? (w = o.right + n, w > k && (n = k - o.right)) : 180 == l ? (n = -n, w = o.top + n, 0 > w && (n = -o.top)) : 270 == l ? (n = -n, w = o.left + n, 0 > w && (n = -o.left)) : (w = o.bottom + n, w > k && (n = k - o.bottom))
            } else {
                var x = 0;
                90 == l ? (x = o.left + n, 0 > x && (n = -o.left)) : 180 == l ? (n = -n, x = o.bottom + n, x > k && (n = k - o.bottom)) : 270 == l ? (n = -n, x = o.right + n, x > k && (n = k - o.right)) : (x = o.top + n, 0 > x && (n = 0 - o.top))
            }
            return {
                x: m,
                y: n
            }
        }

        function n(a) {
            return Math.sqrt(a.x * a.x + a.y * a.y)
        }

        function o(a) {
            var b = a,
                c = new d(1, 0),
                e = b.x * c.x + b.y * c.y,
                f = e / (n(b) * n(c));
            return Math.acos(f)
        }
        var p = a,
            q = {},
            r = {},
            s = null,
            t = null,
            u = "fwr-annots-context-menu-container",
            v = "fwr-annots-context-menu",
            w = null,
            x = this,
            y = !1,
            z = new WebPDF.ImageEngine.PDFAnnotationLoader,
            A = !1,
            B = 0,
            C = 0,
            D = {},
            E = [],
            F = [],
            G = WebPDF.Tool.getReaderApp().getMainView().getDocView().getDocViewContainerID() + "_AnnotCanvas",
            H = new WebPDF.ImageEngine.AnnotUIManager(this, p);
        this.init = function() {
            l(), H.init();
            var a = null;
            a = new g(p, x, WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE), x.registerAnnotHandler(a), a = new g(p, x, WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT), x.registerAnnotHandler(a), a = new h(p), x.registerAnnotHandler(a), a = new i(p, x), x.registerAnnotHandler(a), a = new j(p, WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER, x), x.registerAnnotHandler(a), a = new k(p, x), x.registerAnnotHandler(a), w = new WebPDF.MarkupAnnotHandler(p, x), w.init(), x.bindAnnotEvents(), c();
            var b = WebPDF.Tool.getReaderApp().getMainView().getDocView(),
                d = (b.getVisiblePageRange(), $("#" + b.getDocViewContainerID())),
                e = b.getPageView(0);
            0 == $("#" + G).length && (null != e && e.isContentCreated() ? $("#" + e.getPageViewContainerID()).parent().parent().append("<canvas class='vml' style='position:absolute;top:0px;left:0px' id='" + G + "'></canvas>") : d.append("<canvas class='vml' style='position:absolute;top:0px;left:0px' id='" + G + "'></canvas>"));
            var f = b.getScrollApi();
            if (null != f) {
                var m = document.getElementById(G);
                null != m && (uuClass.Canvas.InitCavansElement(m), m = document.getElementById(G), m.width = d.width(), m.height = d.height())
            }
        }, this.clear = function() {
            $("#" + u).remove(), w.clear()
        }, this.getMarkupAnnotHandler = function() {
            return w
        }, this.getContextMenuId = function() {
            return v
        }, this.isPageAnnotCreated = function(a) {
            return D[a]
        }, this.onDocViewZoom = function(a) {
            l();
            for (var b = p.getMainView().getDocView(), c = b.getVisiblePageRange(), d = $("#" + b.getDocViewContainerID()), e = b.getDocViewDimension(), f = e.height, g = e.width, h = d.offset(), i = c.begin; i <= c.end; i++) x.onPageVisible(b.getPageView(i), g, f, h, !0);
            for (var j in F) {
                var k = F[j];
                E[k] === !1 && x.onPageVisible(b.getPageView(k), g, f, h, !0)
            }
            F.length = 0
        }, this.onPageVisible = function(a, b, c, d) {
            if (!a || a.isPageLoadError()) return !1;
            var e = a.getPageIndex();
            if (!D[e]) return !1;
            if (E[e]) return x.showAnnots(a, !0), !1;
            var f = x.getAnnotVisibleRect(a, d, b, c);
            return x.updateAnnotsPosition(a, f), E[e] = !0, x.showAnnots(a, !0), !0
        }, this.onPageShowComplete = function(a) {
            if (!a || a.isPageLoadError()) return !1;
            var b = a.getPageIndex();
            return a.isLoadAnnot() && z.asyncLoadPDFAnnotation(p, p.getPDFDoc(), b, function() {
                if (!D[b]) {
                    var c = x.createAnnotsHtmlContent(a);
                    $("#" + a.getPageViewContainerID()).append(c), x.drawAnnots(a, !1), D[b] = !0, p.isReadOnly() && $(".fwr-popup-annot").hide();
                    var d = p.getPluginByName(WebPDF.SignaturePluginName);
                    if (d) {
                        var e = d.getSigHandleMgr();
                        e.createPageSignatureSignHtml(a)
                    }
                }
                var f = p.getMainView().getDocView(),
                    g = $("#" + f.getDocViewContainerID()),
                    h = f.getDocViewDimension(),
                    i = h.height,
                    j = h.width,
                    k = g.offset();
                x.onPageVisible(a, j, i, k)
            }, $.noop), !0
        }, this.onPageInvisible = function(a) {
            return x.showAnnots(a, !1), !0
        }, this.registerAnnotHandler = function(a) {
            if (null != a) {
                var b = a.getType();
                try {
                    null != q[b] && $.error("The annotation handler '" + b + "' has already been registered!"), q[b] = a
                } catch (c) {
                    console.error(c)
                }
            }
        }, this.getAnnotHandler = function(a) {
            var b = q[a];
            if (null != b) return b;
            for (var c in q)
                if (c.toUpperCase() == a.toUpperCase()) return q[c]
        }, this.getAnnotHandlerByAnnot = function(a) {
            var b = a.getType();
            switch (b) {
                case WebPDF.PDFData.AnnotType.MarkUp:
                    var c = a.getHeadAnnot();
                    return null != c ? x.getAnnotHandler(c.getSubType()) : x.getAnnotHandler(a.getSubType());
                case WebPDF.PDFData.AnnotType.TypeWriter:
                    return x.getAnnotHandler(a.getIT());
                default:
                    return null
            }
        }, this.canAnswer = function(a, b) {
            if (null == a || "undefine" == a) return null;
            var c = a.getType();
            switch (c) {
                case WebPDF.PDFData.AnnotType.MarkUp:
                    if (a.isVisible()) {
                        var d = a.getHeadAnnot();
                        if (null != d) {
                            var e = x.getAnnotHandler(d.getSubType());
                            return null == e && (e = x.getAnnotHandler(WebPDF.CommonMarkupHandler)), null != e ? y ? e : e.canAnswer(d, b) ? e : null : null
                        }
                        var f = x.getAnnotHandler(a.getSubType());
                        return null == f && (f = x.getAnnotHandler(WebPDF.CommonMarkupHandler)), null != f ? y ? f : f.canAnswer(a, b) ? f : null : null
                    }
                    break;
                case WebPDF.PDFData.AnnotType.TypeWriter:
                    var f = x.getAnnotHandler(a.getIT());
                    return null != f ? y ? f : f.canAnswer(a, b) ? f : null : null;
                case WebPDF.PDFData.AnnotType.Link:
                    var f = x.getAnnotHandler("Link");
                    return null != f ? y ? f : f.canAnswer(a, b) ? f : null : null;
                default:
                    return null
            }
        }, this.clearSelection = function() {
            for (var a in r) {
                var b = r[a],
                    c = x.getAnnotHandlerByAnnot(b);
                c && c.onDeSelected(t, b)
            }
            r = {}, s = null, t = null, $("#" + v).hide()
        }, this.setFocusAnnot = function(a, b) {
            s = b, t = a, b.getType() === WebPDF.PDFData.AnnotType.MarkUp && null != b.getHeadAnnot() && (s = b.getHeadAnnot());
            var c = x.getAnnotHandlerByAnnot(s);
            c && c.onFocus(a, b)
        }, this.setPopupFocus = function(a, b) {
            var c = b.getAnnotName(),
                d = H.getAnnotPopupDivID(a, c),
                e = $("#" + d),
                f = e[0];
            w.setFocusAnnotByTarget(f, !0), x.addSelection(b)
        }, this.onAnnotMenuSelect = function(a) {
            if (null != a) try {
                var b = a.attr("menuname");
                "DeleteAnnot" == b && x.deleteSelection()
            } catch (c) {}
        }, this.addSelection = function(a) {
            var b = a.getAnnotName();
            r[b] = a;
            var c = x.getAnnotHandlerByAnnot(a);
            if (c && c.onSelected(t, a)) {
                if (WebPDF.Environment.mobile) return;
                $(".fwr-annot-selected").fwrContextMenu(v, {
                    onSelect: function(a, b) {
                        return x.onAnnotMenuSelect($(this))
                    }
                }, document.getElementById(p.getMainFrameId()))
            }
        }, this.selectAnnot = function(a, b) {
            if (b.getType() === WebPDF.PDFData.AnnotType.MarkUp) {
                var c = b.getHeadAnnot();
                if (null != c) {
                    x.addSelection(c);
                    var d = c.getGroupAnnotMap();
                    for (var e in d) {
                        var f = d[e];
                        x.addSelection(f)
                    }
                } else x.addSelection(b)
            } else x.addSelection(b)
        }, this.selectAnnotsByRect = function(a, b) {
            var c = !0,
                d = a.getPDFPage();
            d.enumAnnots(function(d) {
                var e = x.canAnswer(d);
                if (null != e) {
                    var g = d.getRect();
                    f.intersect(g, b), f.isEmpty(g) || (c && (x.setFocusAnnot(a, d), c = !1), x.selectAnnot(a, d))
                }
                return !0
            })
        }, this.clickOnAnnot = function(a, b, c) {
            if (b != t && x.clearSelection(), document.getElementById(b.getDocView().getDocViewContainerID()).focus(), s) {
                if (null != r[a.getAnnotName()]) return;
                c ? x.addSelection(a) : (x.clearSelection(), x.setFocusAnnot(b, a), x.selectAnnot(b, a))
            } else x.setFocusAnnot(b, a), x.selectAnnot(b, a)
        }, this.onAnnotLButtonDown = function(a, b, c) {
            if (A = !1, null != b) {
                var d = x.canAnswer(b);
                if (!d) return !1;
                if (d.onLButtonDown(a, b, c)) {
                    var e = c.shiftKey,
                        f = c.ctrlKey,
                        g = !0;
                    e || f || (g = !1), x.clickOnAnnot(b, a, g)
                }
                return d.canMove(b.getSubType()) ? ($(".fwr-annot-move-div").remove(), A = !0, C = c.pageY, B = c.pageX, WebPDF.Common.preventDefaults(c, !0), !0) : !0
            }
            return null != c.target.getAttribute("menuname") ? !1 : (x.clearSelection(), !1)
        }, this._isSelectionCanMove = function() {
            if (!p.isEditable()) return !1;
            var a;
            for (var b in r) {
                var c = r[b];
                if (a = x.getAnnotHandler(c.getSubType()), !a) return !1;
                if (!a.canMove(c.getSubType())) return !1
            }
            return !0
        }, this.onAnnotMouseMove = function(a, b, c) {
            if (A) {
                if (x._isSelectionCanMove()) {
                    var d, f, g, h = m(t, c.pageX, c.pageY),
                        i = t.getDocView().getRotate();
                    new e;
                    for (var j in r) {
                        f = r[j];
                        var k = $("#" + H.getAnnotDivID(t, j));
                        if (g = H.getAnnotMoveDivID(t, j), d = document.getElementById(g)) {
                            var l = $(d);
                            90 == i || 270 == i ? l.css("left", parseFloat(l.css("left")) + h.y + "px").css("top", parseFloat(l.css("top")) + h.x + "px") : l.css("left", parseFloat(l.css("left")) + h.x + "px").css("top", parseFloat(l.css("top")) + h.y + "px")
                        } else {
                            var n = "",
                                o = "";
                            90 == i || 270 == i ? (n = "left:" + (parseFloat(k.css("left")) + h.y) + "px;top:" + (parseFloat(k.css("top")) + h.x) + "px;", n += "width:" + k.css("width") + ";height:" + k.css("height") + ";", o = "<div id='" + g + "' style='" + n + "' class='fwr-annot-move-div'/>") : (n = "left:" + (parseFloat(k.css("left")) + h.x) + "px;top:" + (parseFloat(k.css("top")) + h.y) + "px;", n += "width:" + k.css("width") + ";height:" + k.css("height") + ";", o = "<div id='" + g + "' style='" + n + "' class='fwr-annot-move-div'/>"), k.after(o)
                        }
                    }
                }
                C = c.pageY, B = c.pageX
            }
            return !1
        }, this.onAnnotRButtonDown = function(a, b, c) {
            if (null == a || null == b) return $("#" + v).hide(), !1;
            var d = 0;
            for (var e in r) {
                var f = r[e];
                f && d++
            }
            return 1 == d && x.clearSelection(), $(document).trigger("click.fwrContextMenu"), x.setFocusAnnot(a, b), x.selectAnnot(a, b), !0
        }, this.onAnnotLButtonUp = function(a, b, c) {
            if (A) {
                var d, e, f, g, h, i, j, k, l, m, n, o = t.getDocView(),
                    q = p.getPixelsPerPoint(),
                    s = (t.getScale() * q, new Date),
                    u = s.valueOf() + 6e4 * s.getTimezoneOffset(),
                    v = Math.floor(u / 1e3).toString();
                for (var w in r) d = r[w], l = x.getAnnotHandlerByAnnot(d), l && (e = H.getAnnotMoveDivID(t, w), f = document.getElementById(e), f && (k = $(f), g = d.getRect(), h = t.pdfRectToDevice(g, !0), m = parseFloat(k.css("left")), n = parseFloat(k.css("top")), i = m - h.left, j = n - h.top, h.left = m, h.top = n, h.right = h.right + i, h.bottom = h.bottom + j, g = t.deviceRectToPDF(h, !0, 0), d.setRect(g), l.moveAnnot(t, d, i, j, m, n), d.setModifyDate(v), p.setModified(t, o, !0)));
                $(".fwr-annot-move-div").remove()
            }
            return A = !1, !1
        }, this.onAnnotHold = function(a, b, c) {
            if (null == b) return !1;
            var d = c.srcEvent.touches[0];
            $("#" + v).css({
                left: d.pageX,
                top: d.pageY,
                display: "block"
            });
            var e = $("#delete_annot");
            return e.tap(function() {
                x.onAnnotMenuSelect($(this))
            }), !0
        }, this.deleteSelection = function() {
            var a = !1,
                b = {};
            $(".fwr-annot-selected").hide();
            var c;
            for (var d in r) {
                var e = r[d];
                e && (c = x.getAnnotHandlerByAnnot(e)) && (c.deleteAnnot(t, e, H), e.isSourceAnnot ? (e.hide(), e.setDel(1)) : b[d] = 1, a = !0)
            }
            a && (t.getPDFPage().deleteAnnots(b), p.setModified(t, t.getDocView(), !0)), x.clearSelection(), x.onDraw()
        }, this.onAnnotLButtonDblClk = function(a, b, c) {
            if (null != b) {
                var d = x.canAnswer(b);
                return d ? (d.onLButtonDblClk(a, b, c), $("#" + v).hide(), !0) : !1
            }
            return !1
        }, this.onAnnotMouseOver = function(a, b, c) {
            if (!b) return !1;
            try {
                var d = (a.getPageIndex(), b.getAnnotName(), x.canAnswer(b));
                return null == d ? !1 : (d.onMouseOver(a, b, c), !0)
            } catch (e) {
                return console.error(e), !1
            }
        }, this.onAnnotMouseLeave = function(a, b, c) {
            if (!b) return !1;
            try {
                var d = x.canAnswer(b);
                return null == d ? !1 : (d.onMouseLeave(a, b, c), !0)
            } catch (e) {
                return console.error(e), !1
            }
        }, this.updateAnnotsPosition = function(a, b) {
            var c = a.getPDFPage();
            y = !0, c.enumAnnots(function(c) {
                var d = x.canAnswer(c, !0);
                return null != d && d.onUpdatePosition(a, c, b), !0
            }), y = !1
        }, this.onDocViewResize = function() {}, this.onPreDocViewResize = function() {
            var a = H.getCanvasElement();
            null != a && (a.height = 0, a.width = 0, $(a).css({
                left: 0,
                top: 0
            })), F.length = 0;
            for (var b = p.getMainView().getDocView(), c = b.getVisiblePageRange(), d = c.begin; d <= c.end; d++) F.push(d)
        }, this.onDocViewScroll = function() {
            x.onDraw()
        }, this.getAnnotsHtmlContent = function(a, b) {
            return a ? (a.getPDFPage().isInitAnnotData() || D[a.getPageIndex()] || z.syncLoadPDFAnnotation(p, p.getPDFDoc(), a.getPageIndex(), function() {}, function() {}), x.createAnnotsHtmlContent(a, b)) : ""
        }, this.createAnnotsHtmlContent = function(a, b) {
            return H.createAnnotsHtmlContent(a, b)
        }, this.getUIManager = function() {
            return H
        }, this.isAnnotRenderWithBackgroundImage = function(a) {
            return !1
        }, this.quadPointsToRectArray = function(a, b, c) {
            if (null == a || a.length % 8 != 0) return null;
            for (var d = [], g = 0; g < a.length; g += 8) {
                var h = null;
                if (b === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT) {
                    var i = Math.abs(a[g + 7] - a[g + 3]);
                    1 > i && (i = 1);
                    var j = a[g] + (a[g + 4] - a[g]) / 8,
                        k = a[g + 5] + (a[g + 1] - a[g + 5]) / 8,
                        l = a[g + 2] + (a[g + 6] - a[g + 2]) / 8,
                        m = a[g + 7] + (a[g + 3] - a[g + 7]) / 8;
                    h = j === l ? new e(a[g], a[g + 7], a[g + 4], a[g + 1]) : j > l ? new e(j, k - i, l, m) : new e(j, k + i, l, m);
                    var n = c.TransFormRect(h.left, h.top, h.right, h.bottom);
                    h.left = n[0], h.top = n[1], h.right = n[2], h.bottom = n[3]
                } else if (b === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE) {
                    var i = Math.abs(a[g + 7] - a[g + 3]) / 8;
                    1 > i && (i = 1);
                    var j = a[g] + (a[g + 4] - a[g]) / 8,
                        k = a[g + 5] + (a[g + 1] - a[g + 5]) / 8,
                        l = a[g + 2] + (a[g + 6] - a[g + 2]) / 8,
                        m = a[g + 7] + (a[g + 3] - a[g + 7]) / 8;
                    h = j === l ? new e(j - i / 2, k, l + i / 2, m) : new e(j, k + i / 2, l, m - i / 2);
                    var n = c.TransFormRect(h.left, h.top, h.right, h.bottom);
                    h.left = n[0], h.top = n[1], h.right = n[2], h.bottom = n[3]
                }
                if (f.normalize(h), f.isEmpty(h)) return null;
                d.push(h)
            }
            return d
        }, this.showAInkAnnot = function(a, b, c, e, f) {
            if ("Markup" === b.getType() && "Ink" === b.getSubType()) {
                var g = 1,
                    h = 1;
                f && (g = f, h = f);
                var i = x.getAnnotCavansDivID(a, b.getAnnotName()),
                    j = document.getElementById(i);
                if (null == j || c || (uuClass.Canvas.InitCavansElement(j), j = document.getElementById(i)), !j && e && (j = e), null == j) return;
                var k = j.getContext("2d");
                null != k._clear ? k._clear() : k.clearRect(0, 0, j.width, j.height), k.lineWidth = b.getInkBorderWidth() * a.getScale() * g, k.strokeStyle = WebPDF.Common.hexColor2Rgba(b.getInkColor(), 1);
                var l = b.getRect(),
                    m = a.pdfRectToDevice(l, !0),
                    p = b.getInkList();
                if (null != p) {
                    k.beginPath();
                    for (var q = p.length, r = 0; q > r; r++) {
                        var s = p[r],
                            t = s.length;
                        if (!(1 >= t)) {
                            for (var u = [], v = 0; t > v; v++) {
                                var w = a.pdfPtToDevice(s[v]);
                                w.x = (w.x - m.left) * g, w.y = (w.y - m.top) * h, u.push(w)
                            }
                            var y = u[0];
                            if (k.moveTo(y.x, y.y), 1 == t) {
                                var z = u[1];
                                k.lineTo(z.x, z.y), k.stroke()
                            } else {
                                var A, B, C = new d(0, 0),
                                    D = new d(0, 0),
                                    E = new d(0, 0),
                                    F = new d(0, 0),
                                    G = new d(0, 0),
                                    H = new d(0, 0),
                                    I = (new d(0, 0), 1);
                                C = y;
                                do k.moveTo(C.x, C.y), t - I == 1 ? (F = u[I++], D.x = (2 * C.x + F.x) / 3, D.y = (2 * C.y + F.y) / 3, E.x = (C.x + 2 * F.x) / 3, E.y = (C.y + 2 * F.y) / 3, k.bezierCurveTo(D.x, D.y, E.x, E.y, F.x, F.y), C = F) : t - I == 2 ? (D = u[I++], E = u[I], G.x = D.x - C.x, G.y = D.y - C.y, H.x = E.x - D.x, H.y = E.y - D.y, A = n(G) < .001 ? 0 : o(G), B = n(H) < .001 ? 0 : o(H), Math.abs(A - B) > 3.1415926535 / 3 ? (F = D, D.x = (2 * C.x + F.x) / 3, D.y = (2 * C.y + F.y) / 3, E.x = (C.x + 2 * F.x) / 3, E.y = (C.y + 2 * F.y) / 3, k.moveTo(C.x, C.y), k.bezierCurveTo(D.x, D.y, E.x, E.y, F.x, F.y), C = F) : (k.moveTo(C.x, C.y), k.bezierCurveTo(C.x, C.y, D.x, D.y, E.x, E.y), I++, C = E)) : (D = u[I++], E = u[I], F = u[I + 1], k.bezierCurveTo(D.x, D.y, E.x, E.y, F.x, F.y), I += 2, C = F); while (t > I)
                            }
                        }
                    }
                    k.stroke()
                }
            }
        }, this.drawAnnots = function(a, b, c) {
            a && a.getPDFPage().enumAnnots(function(d) {
                var e = x.canAnswer(d);
                return null != e && e.onDraw(a, d, b, c), !0
            })
        }, this.showAnnots = function(a, b) {
            if (a) {
                var c = $("#" + H.getPageAnnotsContainerID(a));
                b ? c.show() : c.hide(), H.rotatePopupAnot(a, a.getDocView().getRotate())
            }
        }, this.onDraw = function() {
            null != x.getMarkupAnnotHandler() && x.getMarkupAnnotHandler().onDraw()
        }, this.getCavansElement = function() {
            return document.getElementById(G)
        }, this.bindAnnotEvents = function() {}, this.getAnnotVisibleRect = function(a, b, c, d) {
            var f = a.getPageViewWidth(),
                g = a.getPageViewHeight(),
                h = a.getPageIndex(),
                i = $("#" + a.getPageViewContainerID()),
                j = a.getDocView().getScrollApi(),
                k = c,
                l = d,
                m = i.offset();
            null != j && (l -= j.getScrollBarHeight(), k -= j.getScrollBarWidth());
            var n = new e(0, 0, 0, 0),
                o = m.top + g - (b.top + l);
            0 > o && (o = 0), m.top < b.top ? (n.top = b.top - m.top, n.bottom = n.top + g - (b.top - m.top) - o) : (n.top = 0, 0 === h && (n.top = b.top - m.top), n.bottom = g - o), h === a.getDocView().getPageCount() - 1 && m.top + g < b.top + l && (n.bottom += b.top + l - (m.top + g));
            var p = a.getDocView().getViewMode();
            if (p == WebPDF.PDFView.RD_BRMODE_CONTINUOUS_FACING) {
                var q = k / 2 - 11;
                if (h % 2 == 0) {
                    n.left = b.left - m.left + 1;
                    var r = m.left + f - (b.left + k);
                    n.right = f - 1, r > 0 && (n.right -= r)
                } else {
                    n.left = 0, n.right = n.left + q;
                    var r = m.left + f - (b.left + k);
                    r > 0 && (n.right = f - r)
                }
            } else(p == WebPDF.PDFView.RD_BRMODE_CONTINUOUS || p == WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE) && (n.left = b.left - m.left + 1, n.right = n.left + k);
            return n
        }, this.getAnnotCavansDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Annots_Canvas_" + b
        }, this.clearCanvas = function() {
            H.clearCanvas()
        }
    }, WebPDF.AnnotHandleManager
}), define("core/ImageEngine/AnnotUIManager", ["core/Math/Rect", "core/WebPDF"], function(a, b, c) {
    a("core/Math/Rect");
    var d = WebPDF.RectUtils,
        e = WebPDF.PDFRect,
        f = WebPDF.Common,
        g = (WebPDF.PDFData.CommentAnnotType, WebPDF.ImageEngine);
    g.AnnotUIManager = function(a, b) {
        function c(a) {
            switch (a) {
                case "Comment":
                    return "fwr-comment-annot-icon";
                case "Key":
                    return "fwr-key-annot-icon";
                case "Note":
                    return "fwr-note-annot-icon";
                case "Help":
                    return "fwr-help-annot-icon";
                case "NewParagraph":
                    return "fwr-new-paragraph-annot-icon";
                case "Paragraph":
                    return "fwr-paragraph-annot-icon";
                case "Insert":
                    return "fwr-insert-annot-icon";
                default:
                    return "fwr-default-annot-icon"
            }
        }

        function g(a) {
            switch (a) {
                case "Accepted":
                    return "fwr-annot-state-accept";
                case "Rejected":
                    return "fwr-annot-state-rejected";
                case "Cancelled":
                    return "fwr-annot-state-canceled";
                case "Completed":
                    return "fwr-annot-state-completed";
                default:
                    return "fwr-annot-state-default"
            }
        }

        function h(a, b) {
            var c, d, e = a.getReplyChain(),
                i = e.length,
                j = "";
            b += 10, k.isMobile() && i > 0 && (j += "<ul>");
            for (var l = 0; i > l; l++) {
                var m = e[l];
                if (k.isMobile()) {
                    var n, o, p = "<div style='width:100%;margin-bottom:5px;padding-left:" + b + "px;'><div style='float:left;width:16px;height:16px;margin-right:5px;'><svg style='width:16px;height:16px;float:left;'><use xlink:href='#icon-popup-reply'></use></svg></div>",
                        q = m.getStateList();
                    if (q.length > 0) {
                        for (var r = 0; r < q.length; r++) o = q[r], "Review" == o.getStateMode() && (n = g(o.getState()));
                        p += "<div style='float:left;height:16px;width:16px;margin:1px 2px 0 0;' class=' " + n + " '></div>"
                    }
                    p += "<div style='float:left;height:20px;font-size:1.0rem;margin:0 0 5px 0;'>" + f.htmlEncodeEx(m.getTitle()) + " " + f.timestampToDateString(m.getModifyDate(), f.AnnotTimeFormat) + "</div>", p += "<div style='clear:both; width:100%; font-size:1.0rem;'>" + f.htmlEncodeEx(m.getContents()) + "</div></div>", p += h(m, b), j += p
                } else {
                    var s = m.getColor(),
                        t = f.isColorBlack(s) ? "color:#fff;" : "color:#000;";
                    j += "<div class='popup_child' style='position:relative;margin-bottom:5px;border-style:solid; border-width: 1px;border-color:" + s + ";" + t + "'>", j += "<div class='popup_child' style='position:relative;left:0px;top:0px;height:18px;overflow:hidden;background-color:" + s + "'>";
                    var n, o, u = 2,
                        q = m.getStateList();
                    if (q.length > 0) {
                        u += 18;
                        for (var r = 0; r < q.length; r++) o = q[r], "Review" == o.getStateMode() && (n = g(o.getState()));
                        j += "<div class='popup_child fwr-annot-state-icon " + n + "'></div>"
                    }
                    var v = m.getTitle();
                    j += "<div class='popup_child' style='position:relative;left:" + u + "px;'><div style='position: relative;line-height:18px; float:left;background-color:" + s + "'>" + f.htmlEncodeEx(v) + "</div>", j += "<div class='popup_child' style='position:relative;margin-left:15px;float:left;background-color:" + s + "'>" + f.timestampToDateString(m.getModifyDate(), f.AnnotTimeFormat) + "</div></div>", j += "</div>", j += "<div class='popup_child' style='position:relative;clear:both;padding-left:5px;padding-right:5px;both; left: 0px; top: 0px;'>", c = "popup_child", d = "", k.isEditable() && (c += "fwr_popup_content", d = "contenteditable='true'"), j += "<div class='" + c + "' annot-name='" + m.getAnnotName() + "' annot-reply='true' " + d + " style='clear:both;padding-top:2px;padding-bottom:2px;word-wrap: break-word; word-break: normal;color:#000'>" + f.htmlEncodeEx(m.getContents()) + "</div>", j += h(m, b), j += "</div>", j += "</div>"
                }
            }
            return k.isMobile() && i > 0 && (j += "</ul>"), j
        }
        var i, j = a,
            k = b,
            l = this;
        this.init = function() {
            var a = k.getMainView().getDocView();
            i = a.getDocViewContainerID() + "_AnnotCanvas";
            var b = $("#" + a.getDocViewContainerID()),
                c = a.getPageView(0);
            null != c && c.isContentCreated() ? $("#" + c.getPageViewContainerID()).append("<canvas class='vml' style='position:absolute;top:0px;left:0px' id='" + i + "'></canvas>") : b.append("<canvas class='vml' style='position:absolute;top:0px;left:0px' id='" + i + "'></canvas>");
            var d = a.getDocViewDimension(),
                e = a.getScrollApi();
            null != e && (d.width -= e.getScrollBarWidth(), d.height -= e.getScrollBarHeight());
            var f = document.getElementById(i);
            null != f && ($.support.canvas || uuClass && uuClass.Canvas.InitCavansElement(f), f = document.getElementById(i), f.width = parseInt(d.width), f.height = parseInt(d.height)), k.addIgnoreMouseEventClass("fwr_popup_content")
        }, this.getAnnotDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Annots_" + b
        }, this.getCommentAnnotDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Comment_Annots_" + b
        }, this.getCommentAnnotQuadDivID = function(a, b, c) {
            var d = l.getCommentAnnotDivID(a, b);
            return d += "_quad_" + c
        }, this.getCommentAnnotRectDivID = function(a, b) {
            var c = l.getCommentAnnotDivID(a, b);
            return c += "_rect"
        }, this.getTextAnnotDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Text_Annots_" + b
        }, this.getInkAnnotDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Ink_Annots_" + b
        }, this.getAnnotCanvasDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Annots_Canvas_" + b
        }, this.getAnnotPopupDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Popup_" + b
        }, this.getPageAnnotsContainerID = function(a) {
            return a.getPageViewContainerID() + "_AnnotsContainer"
        }, this.getTypewriterAnnotDivID = function(a, b) {
            return a.getPageViewContainerID() + "_Typewriter_Annots_" + b
        }, this.getTypewriterAnnotRectDivID = function(a, b) {
            var c = l.getTypewriterAnnotDivID(a, b);
            return c += "_rect"
        }, this.getAnnotDivIDFromTypewriterAnnotRectDivID = function(a) {
            return a.replace("_Typewriter", "").replace("_rect", "")
        }, this.getAnnotMoveDivID = function(a, b) {
            var c = l.getAnnotDivID(a, b);
            return c += "_move"
        }, this.createPopupAnnotHtmlContent = function(a, b, e, i) {
            var j = a.getPopup(),
                m = "no_print";
            if (null == j || null != a.getHeadAnnot()) return "";
            var n = a.getAnnotName(),
                o = l.getAnnotPopupDivID(b, n),
                p = j.getRect(),
                q = b.pdfRectToDevice(p, !1),
                r = Math.floor(d.width(q) * e),
                s = Math.floor(d.height(q) * e);
            q.top < 0 && (q.top = 0, q.bottom += s);
            var t = "";
            (0 === j.getOpenState() || k.isMobile() && !i) && (t = "display:none;");
            var u = 0,
                v = "",
                w = b.getDocView().getRotate();
            if (0 != w) {
                u = (360 - w) % 360;
                var x = (r - s) / 2;
                v = 270 == u ? WebPDF.Common.getTransformCssString(u, -x, -x) : 90 == u ? WebPDF.Common.getTransformCssString(u, x, x) : WebPDF.Common.getTransformCssString(u)
            }
            var y = 0,
                z = "";
            if (k.isMobile()) {
                z += "<div id='" + o + "' class='fwr-popup-annot " + m + "' style='position:fixed; box-sizing:border-box; -webkit-box-sizing:border-box; -moz-box-sizing:border-box; left:0px !important; top:0px !important; width:100%; height:100%; background:rgba(0,0,0,0.5); padding: 20px; margin:0 auto; z-index:999999;" + t + "' page-index='" + b.getPageIndex() + "' annot-name='" + n + "'>", z += "<div id='fwrm-popup-container' style='float:left; width:100%; height:100%;'><div id='fwrm-popup-head' style='float:left;width:100%;height:52px;line-height：52px;font-size:1.4rem;background:#FFFFFF;border-radius:12px 12px 0 0;-webkit-border-radius:12px 12px 0 0;-moz-border-radius:12px 12px 0 0;'>", z += i ? "<p id='fwrm-popup-head-cancel' style='float:left;padding:10px 0 0 20px;'>Cancel</p>" : "<p id='fwrm-popup-head-delete' style='float:left;padding:10px 0 0 20px;'>Delete</p>", z += "<p id='fwrm-popup-head-ok' style='float:right;padding:10px 20px 0 0;'>OK</p>", z += "</div>", z += "<div id='fwrm-popup-content-container' style='float:left;width:100%;height:250px;overflow-y:auto;background:#fdf3a0;padding:10px 20px 10px 20px;border-radius:0 0 12px 12px;-webkit-border-radius:0 0 12px 12px;-moz-border-radius:0 0 12px 12px;box-sizing: border-box;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;text-shadow:none;'>";
                var A, B = a.getStateList();
                if (B.length > 0) {
                    for (var C = 0; C < B.length; C++) "Review" == B[C].getStateMode() && (A = g(B[C].getState()));
                    z += "<div style='float:left;height:16px;width:16px;margin:3px 10px 0 0;' class='" + A + "'></div>"
                }
                z += "<p style='width:100%;height:20px;font-size:1.2rem;margin:0 0 5px 0;'>" + f.htmlEncodeEx(a.getTitle()) + "</p><p style='width:100%; height:20px; font-size:1.0rem;margin:0 0 5px 0;'>" + f.timestampToDateString(a.getModifyDate(), f.AnnotTimeFormat) + "</p>", z += "<div id='fwrm-popup-content' class='fwr_popup_content' contenteditable='true' style='width:100%;min-height:20px;padding:1px;outline:0;font-size:1.0rem;word-wrap:break-word;word-break:normal;overflow-x:hidden;overflow-y:auto;'>" + f.htmlEncodeEx(a.getContents()) + "</div>", z += h(a, y), z += "</div>", z += "</div>", z += "</div>"
            } else {
                var D = f.isColorBlack(a.getColor()) ? "color:#fff;" : "";
                if (z = "<div id='" + o + "' class='fwr-popup-annot " + m + "' style='left:" + q.left * e + "px;top:" + q.top * e + "px;width:" + r + "px;height:" + s + "px;background-color:" + a.getColor() + ";" + t + D + v + "' page-index='" + b.getPageIndex() + "' annot-name='" + n + "'>", z += "<div class='popup_header' style='position:absolute;left:0px;top:0px;height:20px;width:100%;overflow:hidden;'>", a.getSubType() === WebPDF.PDFData.AnnotType.Text) {
                    var E = c(a.getTextAnnotName());
                    z += "<div class='popup_header fwr-annot-icon " + E + "'></div>";
                }
                z += "<div class='popup_header' style='position:relative;left:20px;width:" + (r - 40) + "px'><div class='popup_child'  style='position: absolute; left: 0px; top: 2px;background-color:" + a.getColor() + "'>" + f.htmlEncodeEx(a.getSubject()) + "</div>", z += "<div class='popup_header' style='position:absolute;top:2px;height:18px;right:1px;background-color:" + a.getColor() + "'>" + f.timestampToDateString(a.getModifyDate(), f.AnnotTimeFormat) + "</div></div>", z += "<div  data-i18n='Annot.ClosePopupAnnot' class='fwr-annot-close-btn' style='left:" + (r - 20) + "px;'></div>", z += "</div>", z += "<div class='popup_header' style='position:absolute;left:0px;top:20px;height:20px;width:100%'>";
                var A, B = a.getStateList();
                if (B.length > 0) {
                    for (var C = 0; C < B.length; C++) "Review" == B[C].getStateMode() && (A = g(B[C].getState()));
                    z += "<div class='popup_header fwr-annot-state-icon " + A + "'></div>"
                }
                z += "<div class='popup_header' style='white-space: nowrap;overflow: hidden;text-overflow: ellipsis;position:absolute;top:2px;height:18px;left:20px'>" + f.htmlEncodeEx(a.getTitle()) + "</div>", z += "</div>";
                var F = "rgb(255, 255, 255)",
                    G = "";
                WebPDF.Environment.ie8OrLower && (G = "white-space:normal;"), "#ffffff" === a.getColor() && (F = "rgb(240, 240, 240)"), z += "<div class='popup_child' style='overflow: auto; background-color: " + F + ";white-space: pre-wrap;" + G + "position: absolute; left: 4px; top:40px; width: " + (r - 8) + "px; bottom:10px;'>", z += "<div class='popup_child' style='position:relative;padding:2px;clear:both;left: 0px; top: 0px;'>", z += "<div class='popup_child fwr_popup_content' annot-reply='false' contenteditable='true' style='clear:both;padding-top:2px;padding-bottom:2px;word-wrap: break-word; word-break: normal;color:#000'>" + f.htmlEncodeEx(a.getContents()) + "</div>", z += "</div>", z += h(a, y), z += "</div>", z += "</div>"
            }
            return z
        }, this.createAAnnotHtmlContent = function(a, b, f, g, h) {
            if (null == b || null == a || !b.isVisible()) return "";
            var i = b.canBePrint() ? "" : "no_print",
                m = j.isAnnotRenderWithBackgroundImage(b),
                n = a.getPDFPage(),
                o = a.getPageIndex(),
                p = (90 * n.getPageRotate() % 360 + 360) % 360,
                q = (b.getRotate() % 360 + 360) % 360,
                r = p - q,
                s = b.getRect(),
                t = a.pdfRectToDevice(s, !0),
                u = b.getType(),
                v = new e;
            d.copy(t, v), g = (null != g && g) > 0 ? g : 1, v.left *= g, v.top *= g, v.right *= g, v.bottom *= g;
            var w = d.width(v),
                x = d.height(v),
                y = l.getAnnotDivID(a, b.getAnnotName()),
                z = "";
            switch (u) {
                case WebPDF.PDFData.AnnotType.Link:
                    var A = b.getAction();
                    if (null != A) switch (A.getActionType()) {
                        case "URI":
                            var B = A.getURI();
                            B = B.replace(/^\s*/g, "");
                            var C = B.toLowerCase(),
                                D = 0 === C.indexOf("http:"),
                                E = 0 === C.indexOf("https:");
                            D || E || (B = "http://" + B), z = "<div id='" + y + "' class='fwr-annot fwr_link_annot' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' link-uri='" + WebPDF.Common.htmlEncodeEx(B) + "' annot-name='" + f + "' page-index='" + o + "' title=\"" + B + '"></div>';
                            break;
                        case "GoTo":
                            z = "<div id='" + y + "' class='fwr-annot fwr_link_annot' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>"
                    } else z = "<div id='" + y + "' class='fwr-annot' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>";
                    break;
                case WebPDF.PDFData.AnnotType.MarkUp:
                    if (m) z = "<div id='" + y + "' class='fwr-annot' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>";
                    else {
                        var F = b.getSubType();
                        switch (F) {
                            case WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT:
                            case WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE:
                                var G = "";
                                F == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE ? G = "fwr-annot-underline-parent" : F == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT && (G = "fwr-annot-highlight-parent"), z = "<div id='" + y + "' class='fwr-annot " + i + " " + G + "' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>";
                                var H, I = b.getQuadPoints(),
                                    J = !1,
                                    K = l.getCommentAnnotDivID(a, f),
                                    L = "<div class= '" + i + "'id='" + K + "'>";
                                if (null != I) {
                                    var M = j.quadPointsToRectArray(I, F, n.getPageMatrix());
                                    if (null != M) {
                                        for (var N = 0; N < M.length; N++) {
                                            H = M[N], H = a.pdfRectToDevice(H, !0);
                                            var O = H,
                                                P = l.getCommentAnnotQuadDivID(a, f, N);
                                            L += "<div id='" + P + "' class='fwr-highlight-annot " + G + "' style='background-color:" + b.getColor() + ";left:" + O.left * g + "px;top:" + O.top * g + "px;width:" + d.width(O) * g + "px;height:" + d.height(O) * g + "px' ></div>"
                                        }
                                        J = !0
                                    }
                                }
                                if (!J) {
                                    var Q = l.getCommentAnnotRectDivID(a, f);
                                    L += "<div id='" + Q + "' class='fwr-annot-highlight' style='background-color:" + b.getColor() + ";left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px' ></div>"
                                }
                                L += "</div>", z += L;
                                break;
                            case WebPDF.PDFData.AnnotType.Text:
                                if (!m) {
                                    i = "no_print";
                                    var R = "";
                                    0 != r && (R = ";transform: rotate(" + r + "deg)"), z = "<div id='" + y + "' class='fwr-annot fwr-annot-text-parent' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>";
                                    var K = l.getTextAnnotDivID(a, f),
                                        L = "<div>";
                                    c(b.getTextAnnotName());
                                    L += "<div class='fwr-text-annot " + i + "' id='" + K + "' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + R + ";background-position: center center; background-repeat: no-repeat;'>", L += "</div>", L += "</div>", z += L
                                }
                                break;
                            case WebPDF.PDFData.AnnotType.Ink:
                                if (!m) {
                                    z = "<div id='" + y + "' class='fwr-annot fwr-annot-ink-parent' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>";
                                    var K = l.getInkAnnotDivID(a, f),
                                        S = l.getAnnotCanvasDivID(a, f),
                                        L = "<div class='" + i + "'>";
                                    L += "<div class='fwr-ink-annot' id='" + K + "' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px'>", L += "<div style='position:absolute;left:0px;top:0px;width:100%;height:100%'>", L += "<canvas class='vml' id='" + S + "' width='" + w + "' height='" + x + "' style='position:absolute;left:0px;top:0px;width:100%;height:100%;' />", L += "</div>", L += "</div>", L += "</div>", z += L
                                }
                        }
                    }
                    var T = l.createPopupAnnotHtmlContent(b, a, g, h);
                    if (k.isMobile())
                        if ($(".fwrm-popups").get(0)) $(".fwrm-popups").append(T);
                        else {
                            var U = "<div class='fwrm-popups'></div>";
                            $("body").append(U), $(".fwrm-popups").append(T)
                        }
                    else z += T;
                    break;
                case WebPDF.PDFData.AnnotType.TypeWriter:
                    var V = w,
                        W = x;
                    if (!m) {
                        var X = b.getIT();
                        if (X.toLowerCase() == WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER.toLowerCase()) {
                            var Y = "left";
                            switch (b.getTextAlign()) {
                                case WebPDF.PDFData.TypeWriterTextAlignStyle.CENTERED:
                                    Y = "center";
                                    break;
                                case WebPDF.PDFData.TypeWriterTextAlignStyle.RIGHT_JUSTIFIED:
                                    Y = "right"
                            }
                            var R = "",
                                Z = "";
                            if (0 != r) switch (r) {
                                case 270:
                                case -90:
                                    V = x + .5, W = w + .5, R = WebPDF.Common.getTransformCssString(270, -V, 0, 0, 0);
                                    break;
                                case -270:
                                case 90:
                                    V = x + .5, W = w + .5, R = WebPDF.Common.getTransformCssString(90, 0, -W, 0, 0);
                                    break;
                                case 180:
                                case -180:
                                    R = WebPDF.Common.getTransformCssString(180, 0, 0)
                            }
                            z = "<div id='" + y + "' class='fwr-annot fwr-annot-typewriter-parent' style='left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;' page-index='" + o + "' annot-name='" + f + "'></div>";
                            var _ = l.getTypewriterAnnotDivID(a, f),
                                aa = b.getOpacity(),
                                ba = k.getPixelsPerPoint(),
                                ca = a.getScale(),
                                da = ca * g,
                                ea = b.getFontSize() * ba * da,
                                fa = b.getLineHeight();
                            (isNaN(fa) || 0 == fa) && (fa = b.getFontHeight(), b.setLineHeight(fa)), fa *= ba * da;
                            var ga = "line-height:" + fa + "px;font-size:" + ea + "px;color:" + b.getFontColor() + ";opacity:" + aa + ";text-align:" + Y + ";font-family:" + b.getFontName() + ";" + R + "width:" + (V + .05) + "px;height:" + (W + .05) + "px;",
                                ha = "";
                            aa >= 0 && 1 > aa && (ha += "alpha(opacity=" + 100 * aa + ") "), ha += Z, "" != ha && (ga += "filter:" + ha + ";");
                            var ia = "<textarea id='" + l.getTypewriterAnnotRectDivID(a, f) + "'class='fwr-typewriter-annot-nor'style='" + ga + "-webkit-user-select:auto;'z-index: 10;>" + b.getContents() + "</textarea>",
                                ja = "position: absolute;left:" + v.left + "px;top:" + v.top + "px;width:" + w + "px;height:" + x + "px;";
                            z += "<div id='" + _ + "'style='" + ja + "-webkit-user-select:auto;'>" + ia + "</div>"
                        }
                    }
            }
            return z
        }, this.createAnnotsHtmlContent = function(a, b) {
            if (!a) return "";
            var c = a.getPDFPage(),
                d = "<div id='" + l.getPageAnnotsContainerID(a) + "' >";
            return c.enumAnnots(function(c) {
                var e = l.createAAnnotHtmlContent(a, c, c.getAnnotName(), b, !1);
                d += e
            }), d += "</div>"
        }, this.array2Rect = function(a) {
            var b = new e;
            return b.left = a[0], b.top = a[1], b.right = a[2], b.bottom = a[3], b
        }, this.rotateRect = function(a, b) {
            var c = new WebPDF.PDFMatrix;
            switch (a) {
                case -270:
                case 90:
                    c.Translate(-b.left, -b.bottom, !1), c.Rotate(Math.PI / 180 * a, !1), c.Translate(b.left, b.bottom, !1);
                    break;
                case -180:
                case 180:
                    c.Translate(-b.right, -b.bottom, !1), c.Rotate(Math.PI / 180 * a, !1), c.Translate(b.right, b.bottom, !1);
                    break;
                case -90:
                case 270:
                    c.Translate(-b.right, -b.top, !1), c.Rotate(Math.PI / 180 * a, !1), c.Translate(b.right, b.top, !1)
            }
            var d = c.TransFormRect(b.left, b.top, b.right, b.bottom),
                e = l.array2Rect(d);
            return e
        }, this.rotateRectEx = function(a, b, c) {
            var d = new WebPDF.PDFRect,
                e = a.getPageWidth(),
                f = a.getPageHight();
            switch (b) {
                case 90:
                    d.left = f - c.bottom, d.top = c.left, d.right = f - c.top, d.left = c.right;
                    break;
                case 180:
                    d.left = e - c.right, d.top = e - c.bottom, d.right = e - c.left, d.bottom = f - c.top;
                    break;
                case 270:
                    d.left = top, d.top = e - c.right, d.right = c.bottom, d.left = e - c.left
            }
            return d
        }, this.getCanvasElement = function() {
            return document.getElementById(i)
        }, this.getAnnotCanvasID = function() {
            return i
        }, this.setCanvasRect = function(a, b, c, d) {
            if ($("#" + i).attr({
                    width: parseInt(c),
                    height: parseInt(d)
                }), $("#" + i).css({
                    left: parseInt(a),
                    top: parseInt(b)
                }), !$.support.canvas) {
                var e = $("#" + i).children();
                if (null == e) return;
                $(e).css({
                    width: parseInt(c),
                    height: parseInt(d)
                })
            }
        }, this.getCanvasOffset = function() {
            var a = l.getCanvasElement();
            if (null == a) return !1;
            ctx = a.getContext("2d");
            var b = $(a);
            return b.offset()
        }, this.resetCanvens = function(a) {
            var b, c, d = k.getMainView().getDocView(),
                e = d.getDocViewDimension(),
                f = d.getScrollApi();
            null != f && (e.width -= f.getScrollBarWidth(), e.height -= f.getScrollBarHeight());
            var g = 0,
                h = 0,
                i = l.getCanvasElement();
            if (a.getPageViewWidth() <= e.width) {
                var j = $("#" + a.getPageViewContainerID()).offset(),
                    m = $("#" + d.getDocViewContainerID()).offset();
                g = m.left - j.left, b = parseInt(e.width), c = parseInt(a.getPageViewHeight())
            } else b = parseInt(a.getPageViewWidth()), c = parseInt(a.getPageViewHeight());
            d.getRotate() % 180 == 0 ? l.setCanvasRect(g, h, b, c) : l.setCanvasRect(h, g, c, b), $(i).appendTo($("#" + a.getPageViewContainerID())), l.clearCanvas()
        }, this.clearCanvas = function() {
            var a = document.getElementById(i);
            if (null == a) return null;
            var b = a.getContext("2d");
            return b.clearRect(0, 0, a.width, a.height), b
        }, this.rotatePopupAnot = function(a, b) {
            var c = $("#" + l.getPageAnnotsContainerID(a) + " .fwr-popup-annot");
            b = (b + 360) % 360;
            for (var d = (360 - b) % 360, e = 0; e < c.length; e++) {
                var f = c[e],
                    g = c.width(),
                    h = c.height(),
                    i = (g - h) / 2;
                270 == d || 90 == d ? WebPDF.Common.addTranslateCss($(f), d, i, -i) : WebPDF.Common.addTranslateCss($(f), d)
            }
        }
    }
}), define("core/ImageEngine/PDFAnnotationLoader", [], function(a, b, c) {
    var d = WebPDF.ImageEngine,
        e = {
            pageIndex: "number",
            annotations: "annots"
        };
    d.PDFAnnotationLoader = function() {
        function a(b, c) {
            if (c && b && b.getType() === WebPDF.PDFData.AnnotType.MarkUp) {
                var d = b.getGroupAnnotMap();
                for (var e in d) {
                    var f = d[e];
                    c.addAnnot(f), a(f, c)
                }
            }
        }

        function b(b, c) {
            var d = c[e.pageIndex],
                f = b.getPage(d),
                g = f.getAnnotJsonData();
            if (null == g) {
                var h = c[e.annotations];
                f.setAnnotJsonData(h);
                for (var i = 0; i < h.length; i++) {
                    var j = WebPDF.AnnotFactory.createAnnot(h[i]);
                    j && ("signature" == j.getType() ? f.addSignature(j) : (f.addAnnot(j), a(j, f)))
                }
            }
        }

        function c(b, c) {
            for (var d = 0; d < c.length; d++) {
                var f = c[d],
                    g = f[e.pageIndex],
                    h = b.getPage(g),
                    i = f[e.annotations];
                h.setAnnotJsonData(i);
                for (var j = 0; j < i.length; j++) {
                    var k = WebPDF.AnnotFactory.createAnnot(i[j]);
                    k && ("signature" == k.getType() ? h.addSignature(k) : (h.addAnnot(k), a(k, h)))
                }
            }
        }

        function d(a, c, d, e, h, i) {
            if ($.isFunction(h) && $.isFunction(i) || $.error("both 'doneHandler' and 'failedHandler' must be function."), 0 >= f) return console.error("Maximum number of retries exceeded for getAnnotData request."), void i(null);
            var j = c.getOptions().url + "annots/" + e ;
            c.isFormMode() && (j += "?formMode=true");
            var k = {
                password: c.getPDFPassword()
            };
            $.ajax({
                url: j,
                dataType: "json",
                async: a,
                data: k,
                success: function(a) {
                    if (null == a) return console.warn("Get annot data error: response is null"), void i(a);
                    var j = a.error;
                    if (0 != j) {
                        if (WebPDF.Common.isNeedRetry(a.status)) {
                            var k = WebPDF.AjaxRetryManager.getNextAnnotDataRequestInterval(c.getMainView().getDocView().getPageCount());
                            return f--, void setTimeout(function() {
                                g.asyncLoadPDFAnnotation(c, d, e, h, i)
                            }, k)
                        }
                        return console.error("Get annot data error:" + j), void i(a)
                    }
                    try {
                        var l = $.parseJSON(a.data);
                        null != l && b(d, l), h()
                    } catch (m) {
                        return console.error(m), i(a), !1
                    }
                },
                error: function() {
                    i(null)
                }
            })
        }
        var f = WebPDF.Config.defaults.requestRetryCount,
            g = this;
        this.asyncLoadUserAnnotation = function(a, b, d, e) {
            if ($.isFunction(d) && $.isFunction(e) || $.error("both 'doneHandler' and 'failedHandler' must be function."), 0 >= f) return console.error("Maximum number of retries exceeded for getAnnotData request."), void e(null);
            var h = a.getOptions().url + "userannots?" + Math.random();
            a.isFormMode() && (h += "&formMode=true");
            var i = {
                password: a.getPDFPassword()
            };
            $.ajax({
                url: h,
                dataType: "json",
                data: i,
                success: function(h) {
                    if (null == h) return console.warn("Get annot data error: response is null"), void e(h);
                    var i = h.error;
                    if (0 != i) {
                        if (WebPDF.Common.isNeedRetry(h.status)) {
                            var j = WebPDF.AjaxRetryManager.getNextAnnotDataRequestInterval(a.getMainView().getDocView().getPageCount());
                            return f--, void setTimeout(function() {
                                g.asyncLoadUserAnnotation(a, b, d, e)
                            }, j)
                        }
                        return void e(h)
                    }
                    try {
                        var k = h.data;
                        if ("undefined" == typeof k || null == k) return void d();
                        var l = $.parseJSON(k);
                        null != l && c(b, l), d()
                    } catch (m) {
                        return console.error(m), e(h), !1
                    }
                },
                error: function() {
                    e(null)
                }
            })
        }, this.asyncLoadPDFAnnotation = function(a, b, c, e, f) {
            d(!0, a, b, c, e, f)
        }, this.syncLoadPDFAnnotation = function(a, b, c, e, f) {
            d(!1, a, b, c, e, f)
        }
    }
}), define("core/Plugins/Annot/MarkupAnnotHandler", ["core/Plugins/Annot/PopupMousePtHandler"], function(a, b, c) {
    a("core/Plugins/Annot/PopupMousePtHandler");
    var d = WebPDF.PDFRect,
        e = WebPDF.RectUtils,
        f = .95,
        g = .05,
        h = 3.141592653,
        i = 28;
    return WebPDF.MarkupAnnotHandler = function(a, b) {
        function c() {
            $(v).on(WebPDF.EventList.DOCVIEW_SCROLL, function() {
                var a = this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME),
                    b = null,
                    c = null,
                    d = null;
                a && (b = a.getAnnotHandlerMgr()), b && (c = b.getUIManager(), d = b.getMarkupAnnotHandler()), c && c.clearCanvas(), d && d.updatePoupAnnots()
            }), $(v).on(WebPDF.EventList.DOCVIEW_ROTATE_CHANGED, function() {
                var a = this.getDocView(),
                    b = a.getPageView(a.getCurPageIndex());
                if (null != b && b.isLoadAnnot()) {
                    var c = this.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME),
                        d = null,
                        e = null,
                        f = null;
                    c && (d = c.getAnnotHandlerMgr()), d && (e = d.getUIManager(), f = d.getMarkupAnnotHandler()), e && e.rotatePopupAnot(b, a.getRotate), f && f.updatePoupAnnots()
                }
            })
        }

        function j() {
            if (!v.isMobile())
                for (var a, b, c = v.getMainView().getDocView(), d = c.getVisiblePageRange(), e = $("#" + c.getDocViewContainerID()), f = c.getDocViewDimension(), g = f.height, h = f.width, i = e.offset(), j = d.begin; j <= d.end; j++) b = c.getPageView(j), a = w.getAnnotVisibleRect(b, i, h, g), b.getPDFPage().enumAnnots(function(c) {
                    c.getType() === WebPDF.PDFData.AnnotType.MarkUp && s(b, a, c)
                })
        }

        function k(a, b) {
            if (null != z.annotName && -1 != z.page) {
                var c = a.getDocView().getPageView(z.pageIndex),
                    d = $("#" + x.getAnnotPopupDivID(c, z.annotName));
                null != d && d.removeClass("fwr-popup-annot-focus fwr-popup-annot-to-frontend")
            }
            z.annotName = b, z.page = a.getPageIndex();
            var e = x.getAnnotPopupDivID(a, b),
                f = $("#" + e);
            f.addClass("fwr-popup-annot-to-frontend")
        }

        function l(a, b) {
            A.pageIndex = a, A.annotName = b
        }

        function m(a) {
            if ("undefined" != typeof window.getSelection && "undefined" != typeof document.createRange) {
                var b = document.createRange();
                b.selectNodeContents(a), b.collapse(!1);
                var c = window.getSelection();
                c.removeAllRanges(), c.addRange(b), a.focus()
            } else if ("undefined" != typeof document.body.createTextRange) {
                var d = document.body.createTextRange();
                d.moveToElementText(a), d.collapse(!1), d.select()
            }
        }

        function n(a, b, c) {
            var d = v.getMainView().getDocView(),
                e = $("#" + d.getDocViewContainerID()),
                f = d.getDocViewDimension(),
                g = f.height,
                h = f.width,
                i = e.offset(),
                j = a.getPDFPage().getAnnotByName(b),
                k = w.getAnnotVisibleRect(a, i, h, g);
            s(a, k, j);
            var l = a.getPageIndex(),
                n = x.getAnnotPopupDivID(a, b),
                o = $("#" + n);
            if (b != z.annotName || z.pageIndex != l) {
                if (null != z.annotName && -1 != z.pageIndex) {
                    var p = a.getDocView().getPageView(z.pageIndex),
                        q = $("#" + x.getAnnotPopupDivID(p, z.annotName));
                    null != q && (q.removeClass("fwr-popup-annot-to-frontend"), q.removeClass("fwr-popup-annot-focus"))
                }
                0 != c && (c = !0)
            }
            if (v.isEditable() && (z.isFocus || 0 == c || (c = !0), c)) {
                var r = $("#" + n + " .fwr_popup_content:first-child");
                r.length > 0 && m(r.get(0))
            }
            o.addClass("fwr-popup-annot-focus"), z.annotName = b, z.pageIndex = l, z.isFocus = !0
        }

        function o(a, b, c, e) {
            var f = new d(0, 0, 0, 0);
            return f = 90 == b ? new d(a.left, a.top - c, e + a.left, a.top) : 180 == b ? new d(a.left - c, a.top - e, a.left, a.top) : 270 == b ? new d(a.left - e, a.top, a.left, c + a.top) : new d(a.left, a.top, c + a.left, e + a.top)
        }

        function p(a, b, c, d) {
            return b % 180 != 0 ? e.offset(a, d, c) : e.offset(a, c, d), a
        }

        function q(a, b, c, f) {
            var g = v.getMainView().getDocView(),
                j = g.getPageView(f);
            if (!j) return !1;
            var k = j.getPDFPage(),
                l = k.getAnnotByName(c);
            if (!l) return !1;
            if (l.getType() != WebPDF.PDFData.AnnotType.MarkUp) return !1;
            var m = l.getPopup();
            if (null == m) return !1;
            if (0 == m.getOpenState()) return !1;
            var n = $("#" + j.getPageViewContainerID()).offset();
            if (null == n) return !1;
            n.left -= b.left, n.top -= b.top;
            var q = x.getAnnotDivID(j, c),
                s = $("#" + q),
                t = x.getAnnotPopupDivID(j, c),
                u = $("#" + t),
                w = s.position(),
                y = u.position();
            if (null == w || null == y) return !1;
            var z = g.getRotate();
            w = j.devicePtToPageRotate(w, z), y = j.devicePtToPageRotate(y, z);
            var A = o(w, z, s.width(), s.height()),
                B = o(y, z, u.width(), u.height());
            p(A, z, n.left, n.top), p(B, z, n.left, n.top);
            var C = new d(B.left, B.top, B.right, B.top + 20);
            C.bottom > B.bottom && (C.bottom = B.bottom);
            var D = new d(0, 0, 0, 0);
            e.copy(B, D), e.normalize(D);
            var E = new WebPDF.PDFPoint((A.left + A.right) / 2, (A.top + A.bottom) / 2);
            if (e.ptInRect(D, E)) return !1;
            var F = 2 * h,
                G = 2 * h,
                H = new d(0, 0, 0, 0),
                I = new d(0, 0, 0, 0),
                J = new d(0, 0, 0, 0),
                K = new WebPDF.PDFPoint(0, 0),
                L = new WebPDF.PDFPoint(0, 0);
            if (E.x < B.left ? (H.left = E.x, H.right = B.left, H.top = Math.min(E.y, B.top), H.bottom = Math.max(E.y, B.bottom), F = Math.atan2((C.top + C.bottom) / 2 - E.y, e.width(H))) : E.x > B.right && (H.left = B.right, H.right = E.x, H.top = Math.min(E.y, B.top), H.bottom = Math.max(E.y, B.bottom), F = Math.atan2((C.top + C.bottom) / 2 - E.y, e.width(H))), E.y < B.top ? (I.left = Math.min(E.x, B.left), I.right = Math.max(E.x, B.right), I.top = E.y, I.bottom = B.top, G = Math.atan2((B.left + B.right) / 2 - E.x, e.height(I))) : E.y > B.bottom && (I.left = Math.min(E.x, B.left), I.right = Math.max(E.x, B.right), I.top = B.bottom, I.bottom = E.y, G = Math.atan2((B.left + B.right) / 2 - E.x, e.height(I))), Math.abs(F) < Math.abs(G)) {
                e.copy(H, J), E.x < B.left ? (K.x = B.left, L.x = B.left) : (K.x = B.right, L.x = B.right);
                var M = (C.top + C.bottom) / 2,
                    N = i / (2 * Math.cos(F)) + .5;
                K.y = M - N, L.y = M + N, K.y = Math.max(K.y, B.top), K.y = Math.min(K.y, B.bottom), L.y = Math.max(L.y, B.top), L.y = Math.min(L.y, B.bottom)
            } else {
                e.copy(I, J), E.y < B.top ? (K.y = B.top, L.y = B.top) : (K.y = B.bottom, L.y = B.bottom);
                var O = (B.left + B.right) / 2,
                    P = i / (2 * Math.cos(G)) + .5;
                K.x = O - P, L.x = O + P, K.x = Math.max(K.x, B.left), K.x = Math.min(K.x, B.right), L.x = Math.max(L.x, B.left), L.x = Math.min(L.x, B.right)
            }
            var Q = l.getColor();
            return r(a, E.x, E.y, K.x, K.y, L.x, L.y, "rgba(125,125,125,0.35)", "rgba(125,125,125,0.35)", 2), r(a, E.x, E.y, K.x, K.y, L.x, L.y, WebPDF.Common.hexColor2Rgba(Q, .7), WebPDF.Common.hexColor2Rgba(Q, 1), 1), !0
        }

        function r(a, b, c, d, e, h, i, j, k, l) {
            if (null != a) {
                a.save();
                var m = (b + d + h) / 3,
                    n = (c + e + i) / 3;
                a.beginPath(), a.moveTo(b, c);
                var o = b + (m - b) * g,
                    p = c + (n - c) * g,
                    q = d + (m - d) * f,
                    r = e + (n - e) * f;
                a.bezierCurveTo(o, p, q, r, d, e), a.lineTo(h, i);
                var s = h + (m - h) * f,
                    t = i + (n - i) * f,
                    u = b + (m - b) * g,
                    v = c + (n - c) * g;
                a.bezierCurveTo(s, t, u, v, b, c), a.closePath(), a.fillStyle = j, a.fill(), a.strokeStyle = k, a.lineWidth = l, a.stroke(), a.restore()
            }
        }

        function s(a, b, c) {
            if (!v.isMobile()) {
                var d = c.getPopup();
                if (null != d) {
                    var e = a.getDocView().getRotate(),
                        f = WebPDF.Common.clone(b);
                    WebPDF.RectUtils.deflate(f, 1), f = a.deviceRectToPageRotate(f, e);
                    var g = x.getAnnotPopupDivID(a, c.getAnnotName()),
                        h = $("#" + g),
                        i = d.getRect(),
                        j = a.pdfRectToDevice(i, !1),
                        k = h.outerWidth(),
                        l = h.outerHeight(),
                        m = a.getPageViewHeight();
                    if (e % 180 != 0) {
                        k = h.outerHeight(), l = h.outerWidth();
                        var n = l - k;
                        f.right += n, j.left < f.left ? (j.left = f.left, j.right = j.left + l, j.right = Math.min(m + n, j.left + l), j.left = Math.max(0, j.right - l)) : j.right > f.right && (j.right = f.right, j.left = Math.max(0, j.right - l), j.right = Math.min(m, j.left + l)), j.top < f.top && (j.top = f.top, j.bottom = j.top + k), j.bottom + n > f.bottom && (j.bottom = f.bottom - n, j.bottom - k > f.top && (j.top = j.bottom - k), j.top >= j.bottom && (j.top = j.bottom - k), j.top < f.top && (j.top = f.top))
                    } else {
                        var m = a.getPageViewHeight();
                        j.top < f.top ? (j.top = f.top, j.bottom = j.top + l, j.bottom = Math.min(m, j.top + l), j.top = Math.max(0, j.bottom - l)) : j.bottom > f.bottom && (j.bottom = f.bottom, j.top = Math.max(0, j.bottom - l), j.bottom = Math.min(m, j.top + l)), j.left < f.left && (j.left = f.left, j.right = j.left + k), j.right > f.right && (j.right = f.right, j.right - k > f.left && (j.left = j.right - k), j.left >= j.right && (j.left = j.right - k), j.left < f.left && (j.left = f.left))
                    }
                    $("#" + g).css({
                        left: Math.round(j.left),
                        top: Math.round(j.top)
                    })
                }
            }
        }

        function t(a, b) {
            var c = a.getPDFPage(),
                d = c.getAnnotByName(b);
            if (null != d) {
                var e = d.getPopup();
                if (null != e) {
                    var f = x.getAnnotPopupDivID(a, b),
                        g = $("#" + f);
                    null != g && (g.hide(), e.setOpenState(0))
                }
            }
        }

        function u(a, b) {
            var c = a.getPDFPage(),
                d = c.getAnnotByName(b);
            if (null == d) return 0;
            if (d.getType() != WebPDF.PDFData.AnnotType.MarkUp) return 0;
            var e = d.getPopup();
            if (null == e) {
                var f = new Date,
                    g = f.valueOf() + 6e4 * f.getTimezoneOffset(),
                    h = Math.floor(g / 1e3).toString(),
                    i = d.getRect(),
                    j = new WebPDF.PDFRect(0, 0, 0, 0);
                j.top = i.top, j.right = c.getPageWidth(), j.left = j.right - WebPDF.PDFData.MKA_POPUPWIDTH, j.bottom = j.top - WebPDF.PDFData.MKA_POPUPHEIGHT;
                var k = {
                    f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                    md: h,
                    n: h + "_popup",
                    op: 0,
                    rc: [j.left, j.top, j.right, j.bottom]
                };
                d.setPopupData(k);
                var l = x.createPopupAnnotHtmlContent(d, a),
                    m = x.getPageAnnotsContainerID(a);
                v.isMobile() || $("#" + m).append(l), e = d.getPopup()
            }
            if (null == e) return 0;
            var n = x.getAnnotPopupDivID(a, b),
                o = $("#" + n);
            if (null == o) return 0;
            if (0 === e.getOpenState()) {
                if (d.getSubType() != WebPDF.PDFData.AnnotType.Text) o.show();
                else {
                    var p = o.find("#fwrm-popup-head-cancel");
                    p.length > 0 && (p.attr("id", "fwrm-popup-head-delete"), p.text("Delete")), o.show()
                }
                if (!v.isMobile()) {
                    var q = $("#" + a.getDocView().getDocViewContainerID()),
                        r = a.getDocView().getDocViewDimension(),
                        t = r.height,
                        u = r.width,
                        y = q.offset(),
                        z = w.getAnnotVisibleRect(a, y, u, t);
                    s(a, z, d)
                }
                return e.setOpenState(1), 1
            }
            return o.hide(), e.setOpenState(0), 0
        }
        var v = a,
            w = b,
            x = w.getUIManager(),
            y = this,
            z = {
                pageIndex: -1,
                annotName: null,
                isFocus: !1
            },
            A = {
                pageIndex: -1,
                annotName: null
            };
        this.updatePoupAnnots = function() {
            j()
        }, this.init = function() {
            var a = new WebPDF.Event.PopupMousePtHandler(y, w);
            v.registerMousePtHandler(a), v.isMarkUpEventInit() || (c(), v.setMarkUpEventInit(!0));
            var b = $("#" + v.getAppId());
            b.on("mousedown", ".popup_child", function(a) {
                if (2 == a.button) return $(a.target).fwrContextMenu(null, null, document.getElementById(v.getMainFrameId())), a.stopPropagation(), !1;
                var b = $(a.target);
                if (a.clientX > a.target.scrollWidth + b.offset().left) return void a.stopPropagation();
                var c = $(this).children().find(".fwr_popup_content");
                return v.isReadOnly() ? void c.attr("contenteditable", "false") : void c.attr("contenteditable", "true")
            }), $("body").on("mousedown touchstart", ".fwr-popup-annot", function(a) {
                if (2 != a.button) return !0;
                $(document).trigger("click.fwrContextMenu");
                var b = y.getDirectPopupParent(a.target);
                if (!b) return !1;
                var c = parseInt(b.getAttribute("page-index")),
                    d = b.getAttribute("annot-name"),
                    e = v.getMainView().getDocView().getPageView(c),
                    f = e.getPDFPage().getAnnotByName(d);
                w.clearSelection(), w.setFocusAnnot(e, f), w.selectAnnot(e, f), $(a.target).fwrContextMenu("fwr-annots-context-menu", {
                    onSelect: function(a, b) {
                        return w.onAnnotMenuSelect($(this))
                    }
                }, document.getElementById(v.getMainFrameId()))
            }), b.on("mousedown touchstart", ".fwr-annot-close-btn", function(a) {
                try {
                    if (0 != a.button && 1 != a.button && void 0 != a.button) return console.log("return true"), !0;
                    var b = parseInt(a.target.parentNode.parentNode.getAttribute("page-index")),
                        c = a.target.parentNode.parentNode.getAttribute("annot-name"),
                        d = v.getMainView().getDocView().getPageView(b);
                    return t(d, c), !0
                } catch (e) {
                    return console.error(e), !1
                }
            }), $("body").on("tap", "#fwrm-popup-head", function(a) {
                if ("fwrm-popup-head-delete" == a.target.id || "fwrm-popup-head-cancel" == a.target.id) w.deleteSelection();
                else if ("fwrm-popup-head-ok" == a.target.id) {
                    var b = parseInt(a.target.parentNode.parentNode.parentNode.getAttribute("page-index")),
                        c = a.target.parentNode.parentNode.parentNode.getAttribute("annot-name"),
                        d = v.getMainView().getDocView().getPageView(b),
                        e = d.getPDFPage().getAnnotByName(c),
                        f = x.getAnnotPopupDivID(d, c),
                        g = $("#" + f),
                        h = g.find("#fwrm-popup-content").get(0);
                    if (null != h && void 0 != typeof h) {
                        var i = h.textContent;
                        e.setContents(i)
                    }
                    t(d, c), w.clearSelection()
                }
                return a.stopPropagation(), !1
            }), $("body").on("mousedown touchstart", "#fwrm-popup-content", function(a) {
                return 2 == a.button ? ($(a.target).jeegoocontext(null), a.stopPropagation(), !1) : v.isReadOnly() ? void $(a.target).attr("contenteditable", "false") : void $(a.target).attr("contenteditable", "true")
            }), b.on("mouseenter mouseleave", ".fwr-popup-annot", function(a) {
                if ("mouseover" == a.type || "mouseenter" == a.type) try {
                    var b = parseInt(a.currentTarget.getAttribute("page-index")),
                        c = a.currentTarget.getAttribute("annot-name"),
                        d = v.getMainView().getDocView().getPageView(b),
                        e = d.getPDFPage(),
                        f = e.getAnnotByName(c);
                    return y.onMouseOver(d, f, a), !1
                } catch (g) {
                    return console.error(g), !1
                } else if ("mouseout" == a.type || "mouseleave" == a.type) try {
                    A.pageIndex = -1, A.annotName = null;
                    var h = w.canAnswer(f, !0);
                    return null == h ? (y.onDraw(), !1) : (w.onDraw(), !0)
                } catch (g) {
                    return console.error(g), !1
                }
            }), $("body").on("focus", ".fwr_popup_content", function() {
                var a = $(this);
                return v.isReadOnly() ? void a.attr("contenteditable", "false") : (a.attr("contenteditable", "true"), "undefined" != typeof a.get(0).innerText ? a.data("before", a.get(0).innerText) : a.data("before", a.get(0).textContent), !0)
            }).on("blur keyup paste", ".fwr_popup_content", function(a) {
                var b = $(this);
                if (WebPDF.Environment.ie8OrLower && $(this).parents(".fwr-popup-annot").removeClass("fwr-popup-annot-focus"), "blur" == a.type || "focusout" == a.type) return b.attr("contenteditable", ""), v.isMobile() || $(this).parents(".fwr-popup-annot").removeClass("fwr-popup-annot-focus"), !0;
                if (v.isReadOnly()) return !1;
                b.attr("contenteditable", "true");
                var c = null;
                c = "undefined" != typeof b.get(0).innerText ? b.get(0).innerText : b.get(0).textContent;
                var d = b.data("before");
                if (("undefined" == typeof d || null == d) && (d = c, b.data("before", c)), d != c) {
                    b.data("before", c);
                    var e = b.closest(".fwr-popup-annot"),
                        f = parseInt(e.attr("page-index")),
                        g = e.attr("annot-name"),
                        h = v.getMainView().getDocView(),
                        i = h.getPageView(f),
                        j = i.getPDFPage(),
                        k = j.getAnnotByName(g);
                    if (null == k) return;
                    var l = b.attr("annot-reply"),
                        m = "true" == l,
                        n = new Date,
                        o = n.valueOf() + 6e4 * n.getTimezoneOffset(),
                        p = Math.floor(o / 1e3).toString();
                    if (m) {
                        var q = b.attr("annot-name"),
                            r = k.getReplyAnnotByName(q);
                        if (null == r) return;
                        r.setContents(c), r.setModifyDate(p)
                    } else k.setContents(c);
                    k.setModifyDate(p), v.setModified(i, h, !0)
                }
                return !0
            })
        }, this.getDirectPopupParent = function(a) {
            for (var b = a, c = new RegExp("(^|\\s)fwr-popup-annot(\\s|$)"); null != b && !c.test(b.className);)
                if (b = b.parentNode, /^body|html$/i.test(b.nodeName)) return null;
            return b
        }, this.clear = function() {
            v.isMobile() && $(".fwrm-popups").remove(), w = null
        }, this.setFocusAnnotByTarget = function(b, c) {
            var d = parseInt(b.getAttribute("page-index")),
                e = b.getAttribute("annot-name");
            ("undefined" == typeof c || null == c || 1 == c) && (c = !0), n(a.getMainView().getDocView().getPageView(d), e, c)
        }, this.moveCurrentPopupAnnot = function(a, b) {
            y.movePopupAnnot(z.pageIndex, z.annotName, a, b)
        }, this.movePopupAnnot = function(a, b, c, d) {
            var f = v.getMainView().getDocView(),
                g = f.getPageView(a);
            if (!g) return !1;
            var h = g.getPDFPage(),
                i = h.getAnnotByName(b);
            if (!i) return !1;
            if (i.getType() != WebPDF.PDFData.AnnotType.MarkUp) return !1;
            var j = i.getPopup();
            if (null == j) return !1;
            var k = j.getRect(),
                l = v.getPixelsPerPoint(),
                m = f.getRotate(),
                n = c / g.getScale() / l,
                o = d / g.getScale() / l;
            if (90 == m) {
                var p = n;
                n = o, o = p
            } else if (180 == m) n = -n;
            else if (270 == m) {
                var p = o;
                o = -n, n = -p
            } else o = -o;
            e.offset(k, n, o), j.setRect(k);
            var q = $("#" + f.getDocViewContainerID()),
                r = f.getDocViewDimension(),
                t = r.height,
                u = r.width,
                x = q.offset(),
                y = w.getAnnotVisibleRect(g, x, u, t);
            s(g, y, i), v.setModified(g, f, !0)
        }, this.onDraw = function() {
            var a = x.clearCanvas();
            if (null != a && -1 != A.pageIndex && null != A.annotName) {
                var b = v.getMainView().getDocView(),
                    c = b.getPageView(A.pageIndex);
                if (!c) return !1;
                x.resetCanvens(c), v.isMobile() || q(a, x.getCanvasOffset(), A.annotName, A.pageIndex)
            }
        }, this.onFocus = function(a, b) {
            var c = b.getPopup();
            c && 1 === c.getOpenState() && k(a, b.getAnnotName(), x)
        }, this.onLButtonDblClk = function(a, b) {
            v.isMobile() || l(-1, null);
            var c = b.getHeadAncestorAnnot(),
                d = c ? c : b,
                e = d.getAnnotName();
            if (1 == u(a, e) && (v.isMobile() || l(a.getPageIndex(), e), n(a, e, !0), v.isMobile())) {
                var f = x.getAnnotPopupDivID(a, e),
                    g = $("#" + f),
                    h = g.find("#fwrm-popup-container");
                if (null != h || h.length > 0) {
                    var i = new Hammer(h.get(0));
                    i.on("doubletap", function(a) {
                        return a.preventDefault(), a.srcEvent.stopPropagation(), !1
                    })
                }
            }
            v.setModified(a, a.getDocView(), !0), w.onDraw()
        }, this.onMouseOver = function(a, b, c) {
            var d = b.getAnnotName(),
                e = a.getPageIndex();
            A.pageIndex = e, A.annotName = d;
            var f = w.canAnswer(b);
            if (null == f) return !1;
            var g = b.getHeadAncestorAnnot();
            return null != g ? (A.pageIndex = e, A.annotName = g.getAnnotName()) : (A.pageIndex = e, A.annotName = d), w.onDraw(), !0
        }, this.onMouseLeave = function(a, b, c) {
            A.pageIndex = -1, A.annotName = null;
            var d = w.canAnswer(b);
            return null == d ? !1 : (w.onDraw(), !0)
        }, this.onUpdatePosition = function(a, b, c) {}
    }, WebPDF.MarkupAnnotHandler
}), define("core/Plugins/Annot/PopupMousePtHandler", [], function(a, b, c) {
    var d = function(a, b) {
        this._markupAnnotHandler = a, this._annotHandlerManager = b, this._bMoveDown = !1, this._oldPosY = 0, this._oldPosX = 0
    };
    return d.prototype = {
        getType: function() {
            return "Popup Annot Mouse Pt Handler"
        },
        onLButtonDown: function(a) {
            var b = this._markupAnnotHandler.getDirectPopupParent(a.target);
            return b ? (WebPDF.Common.preventDefaults(a), this._markupAnnotHandler.setFocusAnnotByTarget(b), this._bMoveDown = !0, this._oldPosY = a.pageY, this._oldPosX = a.pageX, !0) : !1
        },
        onLButtonUp: function(a) {
            return this._bMoveDown = !1, this._annotHandlerManager.onDraw(), !1
        },
        onLButtonDblClk: function(a) {
            return !1
        },
        onMouseMove: function(a) {
            return this._bMoveDown ? (this._annotHandlerManager.clearCanvas(), this._markupAnnotHandler.moveCurrentPopupAnnot(a.pageX - this._oldPosX, a.pageY - this._oldPosY), this._oldPosY = a.pageY, this._oldPosX = a.pageX, !0) : !1
        },
        onRButtonDown: function(a) {
            return !1
        },
        onRButtonUp: function(a) {
            return !1
        },
        onRButtonDblClk: function(a) {
            return !1
        },
        onMouseWheel: function(a) {
            return !1
        },
        onMouseOver: function(a) {
            return !1
        },
        onMouseOut: function(a) {
            return !1
        },
        onMouseLeave: function(a) {
            return !1
        },
        onMouseEnter: function(a) {
            return !1
        },
        onHold: function(a) {
            return !1
        }
    }, WebPDF.Event.PopupMousePtHandler = d, WebPDF.Event.PopupMousePtHandler
}), define("core/PDFData/TypewriterAnnot", ["core/PDFData/Annot", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect", "core/Interface"], function(a, b, c) {
    var d = a("core/PDFData/Annot");
    a("core/Interface");
    var e = WebPDF.Interface,
        f = WebPDF.PDFData.AnnotDataJSONFormat;
    WebPDF.PDFData.TypewriterAnnotType = {
        TYPEWRITERTYPE_TYPEWRITER: "FreeTextTypewriter",
        TYPEWRITERTYPE_TEXTBOX: "FreeTextTextbox",
        TYPEWRITERTYPE_CALLOUT: "FreeTextCallout"
    }, WebPDF.PDFData.TypewriteAnnotDefaultValue = {
        LineHeight: 22,
        FontHeight: 22,
        FontSize: 20,
        NewAnnotWidth: 5
    }, WebPDF.PDFData.TypeWriterTextAlignStyle = {
        LEFT_JUSTIFIED: 0,
        CENTERED: 1,
        RIGHT_JUSTIFIED: 2
    };
    var g = function(a) {
        g.superclass.constructor.call(this, a), $.extend(this, {
            getIT: function() {
                var a = this.annotJSONData[f.it];
                return (null == a || "" == a) && (a = WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_CALLOUT), a
            },
            getFontName: function() {
                var a = this.annotJSONData[f.fontName];
                return (null == a || "" == a) && (a = "Helvetica"), a
            },
            getLineHeight: function() {
                return this.annotJSONData[f.lineHeight]
            },
            setLineHeight: function(a) {
                this.annotJSONData[f.lineHeight] = a
            },
            getFontHeight: function() {
                return this.annotJSONData[f.fontHeight]
            },
            getFontSize: function() {
                return this.annotJSONData[f.fontSize]
            },
            getFontColor: function() {
                return this.annotJSONData[f.fontColor]
            },
            getOpacity: function() {
                return this.annotJSONData[f.opacity]
            },
            getTextAlign: function() {
                return this.annotJSONData[f.textAlign]
            },
            getSubType: function() {
                return WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER
            }
        })
    };
    return e.extend(g, d), WebPDF.PDFData.PDFTypewriterAnnot = g, WebPDF.PDFData.PDFTypewriterAnnot
}), define("core/PDFData/Annot", ["core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect"], function(a, b, c) {
    a("core/DataLevel"), a("core/Math/Point");
    var d = a("core/Math/Rect");
    WebPDF.PDFData.AnnotType = {
        MarkUp: "Markup",
        Link: "Link",
        Widget: "Widget",
        TypeWriter: "Typewriter",
        Text: "Text",
        Ink: "Ink"
    };
    var e = {
        ANNOTFLAG_INVISIBLE: 1,
        ANNOTFLAG_HIDDEN: 2,
        ANNOTFLAG_PRINT: 4,
        ANNOTFLAG_NOZOOM: 8,
        ANNOTFLAG_NOROTATE: 16,
        ANNOTFLAG_NOVIEW: 32,
        ANNOTFLAG_READONLY: 64,
        ANNOTFLAG_LOCKED: 128,
        ANNOTFLAG_TOGGLENOVIEW: 256
    };
    WebPDF.PDFData.AnnotFlag = e, WebPDF.PDFData.BorderStyle = {
        BBS_SOLID: 0,
        BBS_DASH: 1,
        BBS_BEVELED: 2,
        BBS_INSET: 3,
        BBS_UNDERLINE: 4
    }, WebPDF.PDFData.AnnotDataJSONFormat = {
        type: "ty",
        flag: "f",
        rect: "rc",
        content: "c",
        name: "n",
        borderWidth: "bw",
        borderStyle: "bs",
        color: "cl",
        highlight: "hl",
        quadPoints: "Quad",
        destinationInfo: "ds",
        openState: "op",
        modifyDate: "md",
        state: "st",
        stateModel: "stm",
        opacity: "ca",
        creationDate: "cd",
        subject: "subj",
        title: "tit",
        popup: "pop",
        replyChain: "rpy",
        stateList: "stat",
        action: "act",
        group: "grp",
        subType: "subty",
        textAnnotName: "txtn",
        ft: "ft",
        fontSize: "fs",
        fontColor: "fc",
        fontName: "ftn",
        lineHeight: "lnh",
        fontHeight: "fh",
        textAlign: "q",
        it: "it",
        inkList: "ikl",
        inkColor: "ikc",
        inkBorderWidth: "ikw",
        rotate: "r",
        pdf: "pdf",
        del: "del"
    };
    var f = WebPDF.PDFData.AnnotDataJSONFormat;
    return WebPDF.PDFData.PDFAnnot = function(a) {
        this.annotJSONData = a, this.actionList = {}, this.isSourceAnnot = !0
    }, WebPDF.PDFData.PDFAnnot.prototype = {
        getType: function() {
            return this.annotJSONData[f.type]
        },
        getFlags: function() {
            return this.annotJSONData[f.flag]
        },
        getRotate: function() {
            return "undefined" != typeof this.annotJSONData[f.rotate] && null != this.annotJSONData[f.rotate] ? this.annotJSONData[f.rotate] : 0
        },
        setFlags: function(a) {
            this.annotJSONData[f.flag] = a
        },
        isVisible: function() {
            var a = this.getFlags();
            return !(a & e.ANNOTFLAG_HIDDEN || a & e.ANNOTFLAG_NOVIEW)
        },
        canBePrint: function() {
            var a = this.getFlags();
            return 0 != (a & e.ANNOTFLAG_PRINT)
        },
        hide: function() {
            this.setFlags(this.getFlags() | e.ANNOTFLAG_HIDDEN)
        },
        getRect: function() {
            var a = this.annotJSONData[f.rect],
                b = new d(a[0], a[1], a[2], a[3]);
            return b
        },
        setRect: function(a) {
            var b = this.annotJSONData[f.rect];
            b[0] = a.left, b[1] = a.top, b[2] = a.right, b[3] = a.bottom
        },
        getContents: function() {
            return this.annotJSONData[f.content]
        },
        setContents: function(a) {
            this.annotJSONData[f.content] = a
        },
        getAnnotName: function() {
            return this.annotJSONData[f.name]
        },
        setAnnotName: function(a) {
            this.annotJSONData[f.name] = a
        },
        setBorderWidth: function(a) {
            this.annotJSONData[f.borderWidth] = a
        },
        getBorderWidth: function() {
            return this.annotJSONData[f.borderWidth]
        },
        setBorderStyle: function(a) {
            this.annotJSONData[f.borderStyle] = a
        },
        getBorderStyle: function() {
            return this.annotJSONData[f.borderStyle]
        },
        setColor: function(a) {
            this.annotJSONData[f.color] = a
        },
        getColor: function() {
            return this.annotJSONData[f.color]
        },
        getTitle: function() {
            return this.annotJSONData[f.title]
        },
        getQuadPoints: function() {
            return this.annotJSONData[f.quadPoints]
        },
        setQuadPoints: function(a) {
            this.annotJSONData[f.quadPoints] = a
        },
        getModifyDate: function() {
            return this.annotJSONData[f.modifyDate]
        },
        setModifyDate: function(a) {
            this.annotJSONData[f.modifyDate] = a
        },
        getCreationDate: function() {
            return this.annotJSONData[f.creationDate]
        },
        setCreationDate: function(a) {
            this.annotJSONData[f.creationDate] = a
        },
        isAnnotSource: function() {
            return this.isSourceAnnot
        },
        setSourceAnnot: function(a) {
            this.isSourceAnnot = a
        },
        getAnnotJSONData: function() {
            return this.annotJSONData
        },
        setDel: function(a) {
            this.annotJSONData[f.del] = a
        }
    }, WebPDF.PDFData.PDFAnnot
}), define("core/Interface", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.Interface = function() {
        return function(a, b) {
            if (2 != arguments.length) throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
            this.name = a, this.methods = [];
            for (var c = 0, d = b.length; d > c; c++) {
                if ("string" != typeof b[c]) throw new Error("Interface constructor expects method names to be passed in as a string.");
                this.methods.push(b[c])
            }
        }
    }(), d.Interface.ensureImplements = function(a) {
        return
    }, d.Interface.extend = function(a, b) {
        var c = function() {};
        c.prototype = b.prototype, a.prototype = new c, a.prototype.constructor = a, a.superclass = b.prototype, b.prototype.constructor == Object.prototype.constructor && (b.prototype.constructor = b)
    }, d.Interface
}), define("core/Plugins/Annot/CommentAnnotHandler", [], function(a, b, c) {
    return WebPDF.CommentAnnotHandler = function(a, b, c) {
        this.readerApp = a, this.annotType = c, this.annotHandlerManager = b
    }, WebPDF.CommentAnnotHandler.isEditableCommentsType = function(a) {
        return a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE || a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT ? !0 : !1
    }, WebPDF.CommentAnnotHandler.prototype = {
        getType: function() {
            return this.annotType
        },
        canAnswer: function(a, b) {
            var c = a.getSubType();
            if (!WebPDF.CommentAnnotHandler.isEditableCommentsType(c)) return !1;
            var d = this.readerApp.getCurToolHandler();
            if (d) {
                var e = d.getName();
                if (e == WebPDF.Tools.TOOL_NAME_SELANNOT || e === WebPDF.Tools.TOOL_NAME_HAND || e === this.annotType) return !0;
                if (void 0 != b && b && e === WebPDF.TOOL_NAME_SELECTTEXT) return !0
            }
            return !1
        },
        canMove: function(a) {
            return !1
        },
        moveAnnot: function(a, b, c, d, e, f) {},
        deleteAnnot: function(a, b) {
            if (this.readerApp.isEditable()) {
                var c = this.annotHandlerManager.getUIManager(),
                    d = b.getAnnotName(),
                    e = c.getAnnotDivID(a, d);
                $("#" + e).remove();
                var f = c.getCommentAnnotDivID(a, d);
                $("#" + f).remove();
                var g = b.getPopup();
                if (null != g && null == b.getHeadAnnot()) {
                    var h = c.getAnnotPopupDivID(a, d);
                    $("#" + h).remove()
                }
            }
        },
        onDraw: function(a, b, c, d) {},
        onSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            return $("#" + e).addClass("fwr-annot-selected"), !0
        },
        onDeSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).removeClass("fwr-annot-selected")
        },
        onFocus: function(a, b) {
            this.annotHandlerManager.getMarkupAnnotHandler().onFocus(a, b)
        },
        onLButtonDown: function(a, b, c) {
            return this.onSelected(a, b)
        },
        onLButtonUp: function(a, b, c) {},
        onLButtonDblClk: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onLButtonDblClk(a, b, c)
        },
        onMouseOver: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseOver(a, b, c)
        },
        onMouseLeave: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseLeave(a, b, c)
        },
        onUpdatePosition: function(a, b, c) {
            var d = a.getPDFPage(),
                e = b.getRect(),
                f = a.pdfRectToDevice(e, !0),
                g = this.annotHandlerManager.getUIManager(),
                h = g.getAnnotDivID(a, b.getAnnotName());
            $("#" + h).css({
                left: f.left,
                top: f.top,
                width: WebPDF.RectUtils.width(f),
                height: WebPDF.RectUtils.height(f)
            });
            var i = b.getSubType(),
                j = b.getQuadPoints(),
                k = !1;
            if (null != j) {
                var l = this.annotHandlerManager.quadPointsToRectArray(j, i, d.getPageMatrix());
                if (null != l) {
                    for (var m = 0; m < l.length; m++) {
                        var n = l[m];
                        n = a.pdfRectToDevice(n, !0);
                        var o = g.getCommentAnnotQuadDivID(a, b.getAnnotName(), m);
                        $("#" + o).css({
                            left: n.left,
                            top: n.top,
                            width: WebPDF.RectUtils.width(n),
                            height: WebPDF.RectUtils.height(n)
                        })
                    }
                    k = !0
                }
            }
            if (!k) {
                var p = g.getCommentAnnotRectDivID(a, b.getAnnotName());
                $("#" + p).css({
                    left: f.left,
                    top: f.top,
                    width: WebPDF.RectUtils.width(f),
                    height: WebPDF.RectUtils.height(f)
                })
            }
        }
    }, WebPDF.CommentAnnotHandler
}), define("core/Plugins/Annot/CommonMarkupAnnotHandler", [], function(a, b, c) {
    return WebPDF.CommonMarkupHandler = "CommonMarkupHandler", WebPDF.InkHandler = "Ink", WebPDF.CommonMarkupAnnotHandler = function(a, b, c) {
        this.readerApp = a, this.type = c, this.annotHandlerManager = b
    }, WebPDF.CommonMarkupAnnotHandler.prototype = {
        getType: function() {
            return this.type
        },
        canAnswer: function(a, b) {
            var c = (a.getSubType(), this.readerApp.getCurToolHandler());
            if (c) {
                var d = c.getName();
                if (d === WebPDF.Tools.TOOL_NAME_SELANNOT || d === WebPDF.Tools.TOOL_NAME_HAND || d === this.annotType) return !0;
                if (void 0 != b && b && d === WebPDF.TOOL_NAME_SELECTTEXT) return !0
            }
            return !1
        },
        canMove: function(a) {
            return !1
        },
        moveAnnot: function(a, b, c, d, e, f) {},
        deleteAnnot: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).remove();
            var f = d.getInkAnnotDivID(a, c);
            $("#" + f).remove()
        },
        onDraw: function(a, b, c, d) {},
        onSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            return $("#" + e).addClass("fwr-annot-selected"), !0
        },
        onDeSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).removeClass("fwr-annot-selected")
        },
        onFocus: function(a, b) {
            this.annotHandlerManager.getMarkupAnnotHandler().onFocus(a, b)
        },
        onLButtonDown: function(a, b, c) {
            return this.onSelected(a, b)
        },
        onLButtonUp: function(a, b, c) {},
        onLButtonDblClk: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onLButtonDblClk(a, b, c)
        },
        onMouseOver: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseOver(a, b, c)
        },
        onMouseLeave: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseLeave(a, b, c)
        },
        onUpdatePosition: function(a, b, c) {
            var d = (a.getPDFPage(), b.getRect()),
                e = a.pdfRectToDevice(d, !0),
                f = this.annotHandlerManager.getUIManager(),
                g = f.getAnnotDivID(a, b.getAnnotName());
            $("#" + g).css({
                left: e.left,
                top: e.top,
                width: WebPDF.RectUtils.width(e),
                height: WebPDF.RectUtils.height(e)
            })
        }
    }, WebPDF.CommonMarkupAnnotHandler
}), define("core/Plugins/Annot/LinkAnnotHandler", [], function(a, b, c) {
    return WebPDF.LinkAnnotHandler = function(a) {
        this.readerApp = a
    }, WebPDF.LinkAnnotHandler.prototype = {
        getType: function() {
            return "Link"
        },
        canAnswer: function(a, b) {
            var c = this.readerApp.getCurToolHandler();
            if (c) {
                var d = c.getName();
                if (d === WebPDF.Tools.TOOL_NAME_HAND) return !0
            }
            return !1
        },
        canMove: function(a) {
            return !1
        },
        moveAnnot: function(a, b, c, d, e, f) {
            return !1
        },
        deleteAnnot: function(a, b) {},
        onDraw: function(a, b, c, d) {},
        onSelected: function(a, b) {},
        onDeSelected: function(a, b) {},
        onFocus: function(a, b) {},
        onLButtonDown: function(a, b, c) {
            var d = b.getAction();
            if (null != d) switch (d.getActionType()) {
                case "GoTo":
                    var e = d.getPDFDestination();
                    if (null != e) return a.getDocView().gotoPageByDestination(e), !1;
                    break;
                case "URI":
                    var f = c.target.getAttribute("link-uri");
                    f && window.open(f)
            } else {
                var e = d.getPDFDestination();
                if (null != e) return a.getDocView().gotoPageByDestination(e), !1
            }
            return !1
        },
        onLButtonUp: function(a, b, c) {},
        OnLButtonDblClk: function(a, b, c) {},
        onMouseOver: function(a, b, c) {},
        onMouseLeave: function(a, b, c) {},
        onUpdatePosition: function(a, b, c) {}
    }, WebPDF.LinkAnnotHandler
}), define("core/Plugins/Annot/TextAnnotHandler", [], function(a, b, c) {
    return WebPDF.TextAnnotHandler = function(a, b) {
        this.readerApp = a, this.annotHandlerManager = b
    }, WebPDF.TextAnnotHandler.prototype = {
        getType: function() {
            return "Text"
        },
        canAnswer: function(a, b) {
            var c = this.readerApp.getCurToolHandler();
            if (null != c) {
                var d = c.getName();
                if (d === WebPDF.Tools.TOOL_NAME_SELANNOT || d === WebPDF.Tools.TOOL_NAME_HAND || d === WebPDF.Tools.TOOL_NAME_TEXTANNOT) return !0;
                if (void 0 != b && b && d === WebPDF.TOOL_NAME_SELECTTEXT) return !0
            }
            return !1
        },
        canMove: function(a) {
            return !0
        },
        moveAnnot: function(a, b, c, d, e, f) {
            var g = b.getAnnotName(),
                h = this.annotHandlerManager.getUIManager(),
                i = h.getAnnotDivID(a, g),
                j = $("#" + i);
            j.css({
                left: e + "px",
                top: f + "px"
            });
            var k = h.getTextAnnotDivID(a, g),
                l = $("#" + k);
            l.css({
                left: e + "px",
                top: f + "px"
            })
        },
        deleteAnnot: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).remove();
            var f = d.getTextAnnotDivID(a, c);
            $("#" + f).remove();
            var g = b.getPopup();
            if (null != g && null == b.getHeadAnnot()) {
                var h = d.getAnnotPopupDivID(a, c);
                $("#" + h).remove()
            }
        },
        onDraw: function(a, b, c, d) {},
        onSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            return $("#" + e).addClass("fwr-annot-selected"), !0
        },
        onDeSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).removeClass("fwr-annot-selected")
        },
        onFocus: function(a, b) {},
        onLButtonDown: function(a, b, c) {
            return this.onSelected(a, b)
        },
        onLButtonUp: function(a, b, c) {},
        onLButtonDblClk: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onLButtonDblClk(a, b, c)
        },
        onMouseOver: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseOver(a, b, c)
        },
        onMouseLeave: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseLeave(a, b, c)
        },
        onUpdatePosition: function(a, b, c) {
            var d = (a.getPDFPage(), b.getRect()),
                e = a.pdfRectToDevice(d, !0),
                f = this.annotHandlerManager.getUIManager(),
                g = f.getTextAnnotDivID(a, b.getAnnotName()),
                h = f.getAnnotDivID(a, b.getAnnotName()),
                i = $("#" + h);
            i.css({
                left: e.left,
                top: e.top,
                width: WebPDF.RectUtils.width(e),
                height: WebPDF.RectUtils.height(e)
            }), $("#" + g).css({
                left: e.left,
                top: e.top,
                width: WebPDF.RectUtils.width(e),
                height: WebPDF.RectUtils.height(e)
            })
        }
    }, WebPDF.TextAnnotHandler
}), define("core/Plugins/Annot/TypewriterAnnotHandler", [], function(a, b, c) {
    function d(a, b) {
        return Math.abs(parseFloat(a) - parseFloat(b)) <= 1
    }

    function e(a, b) {
        return d(a.left, b.left) && d(a.right, b.right) && d(a.top, b.top) && d(a.bottom, b.bottom)
    }
    var f = WebPDF.PDFRect,
        g = WebPDF.RectUtils;
    return WebPDF.TypewriterAnnotHandler = function(a, b, c) {
        this.readerApp = a, this.annotType = b, this.annotHandlerMgr = c, this.annotUIManager = c.getUIManager(), this.init(a, this.annotUIManager)
    }, WebPDF.TypewriterAnnotHandler.prototype = {
        getType: function() {
            return this.annotType
        },
        canAnswer: function(a) {
            if (!this.readerApp.isEditable()) return !1;
            var b = a.getIT();
            if (!this.isTypewritersType(b) || !a.isVisible()) return !1;
            var c = this.readerApp.getCurToolHandler();
            if (null != c) {
                var d = c.getName();
                if (d === WebPDF.Tools.TOOL_NAME_SELANNOT || d === WebPDF.Tools.TOOL_NAME_HAND || d.toLowerCase() === this.annotType.toLowerCase()) return !0
            }
            return !1
        },
        canMove: function(a) {
            return !0
        },
        isTypewritersType: function(a) {
            return a.toLowerCase() == WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER.toLowerCase() ? !0 : !1
        },
        moveAnnot: function(a, b, c, d, e, f) {
            var g = b.getAnnotName(),
                h = $("#" + this.annotUIManager.getAnnotDivID(a, g));
            h.css({
                left: e + "px",
                top: f + "px"
            });
            var i = $("#" + this.annotUIManager.getTypewriterAnnotDivID(a, g));
            i.css({
                left: e + "px",
                top: f + "px"
            })
        },
        deleteAnnot: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotUIManager.getAnnotDivID(a, c);
            $("#" + d).remove();
            var e = this.annotUIManager.getTypewriterAnnotDivID(a, c);
            $("#" + e).remove()
        },
        onDraw: function(a, b, c, d) {
            null != b && null != a && b.isVisible() && b.getType() == WebPDF.PDFData.AnnotType.TypeWriter && (this.currentPageIndex = a.getPageIndex(), this.currentAnnotName = b.getAnnotName(), this._spellCheck(1))
        },
        onSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotUIManager.getAnnotDivID(a, c);
            return $("#" + d).addClass("fwr-annot-selected"), !0
        },
        onDeSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotUIManager.getAnnotDivID(a, c);
            return $("#" + d).removeClass("fwr-annot-selected"), !0
        },
        onFocus: function(a, b) {},
        onLButtonDown: function(a, b, c) {
            return this.onSelected(a, b)
        },
        onLButtonDblClk: function(a, b, c) {
            this.onTypewriterAnnotEdit(a, b)
        },
        onMouseOver: function(a, b, c) {},
        onMouseLeave: function(a, b, c) {},
        onUpdatePosition: function(a, b, c) {
            var d = b.getAnnotName(),
                e = a.pdfRectToDevice(b.getRect(), !0),
                f = $("#" + this.annotUIManager.getAnnotDivID(a, d)),
                h = $("#" + this.annotUIManager.getTypewriterAnnotDivID(a, d)),
                i = $("#" + this.annotUIManager.getTypewriterAnnotRectDivID(a, d)),
                j = e.left,
                k = e.top,
                l = a.getPDFPage(),
                m = (90 * l.getPageRotate() % 360 + 360) % 360,
                n = (b.getRotate() % 360 + 360) % 360,
                o = m - n,
                p = this.readerApp.getPixelsPerPoint(),
                q = p * a.getScale(),
                r = b.getFontSize() * q;
            i.css("fontSize", r + "px");
            var s = g.width(e),
                t = b.getLineHeight(),
                u = t * q;
            i.css("line-height", u + "px");
            var v = g.height(e),
                w = s,
                x = v,
                y = "";
            if (0 != o) switch (o) {
                case -90:
                case 270:
                    w = v, x = s, y = "rotate(270deg) translateX(" + -(w + .05) + "px)";
                    break;
                case -270:
                case 90:
                    w = v, x = s, y = "rotate(90deg) translateY(" + -(x + .05) + "px)";
                    break;
                case -180:
                case 180:
                    y = "rotate(180deg)"
            }
            h.css({
                left: j + "px",
                top: k + "px",
                width: s + "px",
                height: v + "px"
            }), f.css({
                left: j + "px",
                top: k + "px",
                width: s + "px",
                height: v + "px"
            }), i.css({
                "-webkit-transform": y,
                "-moz-transform": y,
                "-o-transform": y,
                "-ms-transform": y,
                transform: y,
                width: w + .05 + "px",
                height: x + .05 + "px"
            })
        },
        _addAndRemoveChangeValueEvent: function(a, b) {
            function c(a) {
                if (!a || !WebPDF.Environment.ie || "value" == a.propertyName) {
                    d._spellCheck(1);
                    var b = d.readerApp.getMainView().getDocView();
                    b.setModified(!0)
                }
            }
            var d = this;
            WebPDF.Environment.ie8OrLower || WebPDF.Environment.ie9Compact || WebPDF.Environment.ie10Compact ? b ? a.attachEvent("onpropertychange", c) : a.detachEvent("onpropertychange", c) : b ? a.addEventListener("input", c, !1) : a.removeEventListener("input", c, !1)
        },
        init: function(a, b) {
            var c = this;
            if ("undefined" == typeof c.readerApp && (c.readerApp = a), "undefined" == typeof b) var b = c.annotUIManager;
            var d = c.readerApp.getMainView().getDocView(),
                e = $("#" + c.readerApp.getAppId());
            e.off("blur", ".fwr-typewriter-annot-edit").on("blur", ".fwr-typewriter-annot-edit", function(a) {
                var e = $(this);
                if ("undefined" == typeof c.currentAnnotName || "undefined" == typeof c.currentPageIndex) return console.log("error in typewriter blur"), !0;
                c._addAndRemoveChangeValueEvent(e.get(0), !1);
                var f = d.getPageView(c.currentPageIndex),
                    g = f.getPDFPage(),
                    h = g.getAnnotByName(c.currentAnnotName);
                WebPDF.Environment.webkit || $("#" + b.getAnnotDivIDFromTypewriterAnnotRectDivID(e.attr("id"))).removeClass("fwr-typewriter-annot-edit-border"), e.removeClass("fwr-typewriter-annot-edit").addClass("fwr-typewriter-annot-nor");
                $("#" + b.getAnnotDivIDFromTypewriterAnnotRectDivID(e.attr("id")));
                if (c._spellCheck(0), h && e.val() != c.originContents && (h.setContents(e.val()), f.setModified(!0), d.setModified(!0)), delete c.currentAnnotName, delete c.currentPageIndex, WebPDF.Environment.iOS && WebPDF.Environment.mobile) {
                    var i = $("body").scrollTop();
                    0 != i && $("body").scrollTop(0)
                }
                return !0
            }), e.off("focus", ".fwr-typewriter-annot-nor").on("focus", ".fwr-typewriter-annot-nor", function(a) {
                var b = $(this),
                    d = c.annotUIManager,
                    e = $("#" + d.getAnnotDivIDFromTypewriterAnnotRectDivID(b.attr("id")));
                return c.currentPageIndex = parseInt(e.attr("page-index")), c.currentAnnotName = e.attr("annot-name"), c.originContents = b.val(), c._spellCheck(1), c._setTextareaCursorPosition(b.get(0), b.val().length), c._addAndRemoveChangeValueEvent(b.get(0), !0), WebPDF.Environment.webkit || $("#" + d.getAnnotDivIDFromTypewriterAnnotRectDivID(b.attr("id"))).removeClass("fwr-annot-selected").addClass("fwr-typewriter-annot-edit-border"), b.removeClass("fwr-typewriter-annot-nor").addClass("fwr-typewriter-annot-edit"), !0
            })
        },
        onTypewriterAnnotEdit: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotUIManager.getTypewriterAnnotRectDivID(a, c),
                e = $("#" + d);
            return WebPDF.Environment.mobile ? (WebPDF.Environment.iOS ? setTimeout(function() {
                e.focus()
            }, 0) : (window.onresize(), e.focus()), !1) : void(WebPDF.Environment.ie8OrLower ? setTimeout(function() {
                e.focus()
            }, 0) : e.focus())
        },
        _setTextareaCursorPosition: function(a, b) {
            if (a.setSelectionRange) a.setSelectionRange(b, b);
            else if (a.createTextRange) {
                var c = a.createTextRange();
                a.value.length === b ? (c.collapse(!1), c.select()) : c.select()
            }
        },
        _calActualWidth: function(a) {
            var b = $('<div rows="1" width="auto"></div>');
            b.css({
                position: "absolute",
                margin: 0,
                padding: 0,
                display: "block",
                width: "1px",
                "float": "left",
                "white-space": "nowrap",
                visibility: "hidden",
                font: a.css("font"),
                "font-family": a.css("font-family"),
                "font-size": a.css("font-size")
            }), a.after(b);
            for (var c = a.val(), d = c.split("\n"), e = d.length, f = 0, g = 10, h = 0; e > h; ++h) {
                var i = b.html(d[h].replace(/ /g, "&nbsp;")).get(0).scrollWidth;
                f = Math.max(f, i), d[h].length > 0 && (g = Math.min(g, i / d[h].length))
            }
            return b.remove(), f + g / 2
        },
        _calActualLineHeight: function(a) {
            var b = $('<textarea rows="1">AbgH@</textarea>');
            b.css({
                position: "absolute",
                margin: 0,
                padding: 0,
                display: "block",
                width: "1px",
                "float": "left",
                "white-space": "nowrap",
                visibility: "hidden",
                font: a.css("font"),
                "font-family": a.css("font-family"),
                "font-size": a.css("font-size")
            }), b.css("lineHeight", "normal"), a.after(b);
            var c = parseFloat(b.get(0).scrollHeight);
            return b.remove(), c
        },
        _spellCheck: function(a) {
            var b = this.currentPageIndex,
                c = this.currentAnnotName;
            if ("undefined" == typeof b || "undefined" == typeof c) return void console.log("Error in _spellCheck: param undefined.");
            var h = WebPDF.Tool.getReaderApp().getMainView().getDocView(),
                i = h.getPageView(b),
                j = $("#" + this.annotUIManager.getTypewriterAnnotRectDivID(i, c)),
                k = j.parent(),
                l = $("#" + this.annotUIManager.getAnnotDivID(i, c)),
                m = i.getPDFPage(),
                n = m.getAnnotByName(c),
                o = this.readerApp.getPixelsPerPoint(),
                p = o * i.getScale(),
                q = (90 * m.getPageRotate() % 360 + 360) % 360,
                r = (n.getRotate() % 360 + 360) % 360,
                s = q - r,
                t = 0,
                u = 0;
            90 == h.getRotate() || 270 == h.getRotate() ? (t = i.getPageViewHeight(), u = i.getPageViewWidth()) : (t = i.getPageViewWidth(), u = i.getPageViewHeight());
            var v = new f,
                w = new f;
            v.left = Math.max(0, parseFloat(l.css("left"))), v.top = Math.max(0, parseFloat(l.css("top"))), v.right = v.left + parseFloat(l.css("width")), v.bottom = v.top + parseFloat(l.css("height")), g.copy(v, w), ("undefined" == typeof a || isNaN(a)) && (a = 1);
            var x = a * parseFloat(j.css("font-size")),
                y = this._calActualWidth(j) + x,
                z = g.width(w);
            (90 == s || 270 == s || -90 == s || -270 == s) && (z = g.height(w));
            var A = y - z;
            if (!d(A, 0)) switch (n.getTextAlign()) {
                case WebPDF.PDFData.TypeWriterTextAlignStyle.CENTERED:
                    var B = A / 2;
                    switch (s) {
                        case 0:
                        case 180:
                            B = Math.min(B, w.left), B = Math.min(B, t - w.right), w.left -= B, w.right += B;
                            break;
                        case 90:
                        case 270:
                            B = Math.min(B, u - w.bottom), B = Math.min(B, w.top), w.bottom += B, w.top -= B
                    }
                    break;
                case WebPDF.PDFData.TypeWriterTextAlignStyle.RIGHT_JUSTIFIED:
                    switch (s) {
                        case 0:
                            w.left = w.left - A, w.left < 0 && (w.left = 0, w.right = Math.min(t, w.left + y));
                            break;
                        case 90:
                            w.bottom = w.bottom + A, w.bottom > u && (w.bottom = u, w.top = Math.max(0, w.bottom - y));
                            break;
                        case 180:
                            w.right = w.right + A, w.right > t && (w.right = t, w.left = Math.max(0, w.right - y));
                            break;
                        case 270:
                            w.top = w.top - A, w.top < 0 && (w.top = 0, w.bottom = Math.min(u, w.top + y))
                    }
                    break;
                default:
                    switch (s) {
                        case 0:
                            w.right = w.right + A, w.right > t && (w.right = t, w.left = v.left);
                            break;
                        case -270:
                        case 90:
                            w.bottom = w.bottom + A, w.bottom > u && (w.bottom = u, w.top = v.top);
                            break;
                        case 180:
                        case -180:
                            w.left = w.left - A, w.left < 0 && (w.left = 0, w.right = v.right);
                            break;
                        case 270:
                        case -90:
                            w.top = w.top - A, w.top < 0 && (w.top = 0, w.bottom = v.bottom)
                    }
            }
            var C = parseFloat(j.css("line-height"));
            (isNaN(C) || 0 == C) && (C = n.getLineHeight() * p), j.css({
                height: C
            });
            var D = j.get(0).scrollHeight;
            switch (j.css({
                height: D
            }), s) {
                case 270:
                case -90:
                    w.right = Math.min(t, w.left + D);
                    var E = w.left + D - t;
                    E > 0 && (w.left -= E, w.left < 0 && (w.left = 0));
                    break;
                case -270:
                case 90:
                    w.left = Math.max(0, w.right - D);
                    var E = w.right - D;
                    0 > E && (w.right -= E, w.right > t && (w.right = t));
                    break;
                case 180:
                case -180:
                    w.top = Math.max(0, w.bottom - D);
                    var E = w.bottom - D;
                    0 > E && (w.bottom -= E, w.bottom > u && (w.bottom = u));
                    break;
                default:
                    w.bottom = Math.min(u, w.top + D);
                    var E = w.top + D - u;
                    E > 0 && (w.top -= E, w.top <= 0 && (w.top = 0))
            }
            if (!e(v, w)) {
                var F = g.width(w) + "px",
                    G = g.height(w) + "px",
                    H = F,
                    I = G,
                    J = "";
                switch (s) {
                    case 270:
                    case -90:
                        H = G, I = F, J = "rotate(270deg) translateX(" + -g.height(w) + "px)";
                        break;
                    case -270:
                    case 90:
                        H = G, I = F, J = "rotate(90deg) translateY(" + -g.width(w) + "px)";
                        break;
                    case 180:
                    case -180:
                        J = "rotate(180deg)"
                }
                l.css({
                    left: w.left + "px",
                    top: w.top + "px",
                    width: F,
                    height: G
                }), k.css({
                    left: w.left + "px",
                    top: w.top + "px",
                    width: F,
                    height: G
                }), j.css({
                    "-webkit-transform": J,
                    "-moz-transform": J,
                    "-o-transform": J,
                    "-ms-transform": J,
                    transform: J,
                    width: H,
                    height: I
                });
                var K = new f;
                K.left = w.left / p, K.top = m.getPageHeight() - w.top / p, K.right = w.right / p, K.bottom = m.getPageHeight() - w.bottom / p, g.normalize(K), n.setRect(K), K = null;
                var L = new Date,
                    M = L.valueOf() + 6e4 * L.getTimezoneOffset(),
                    N = Math.floor(M / 1e3).toString();
                if (n.setModifyDate(N), 0 != a) {
                    var O = h.getScrollApi();
                    if (null != O) {
                        w = i.PageRotateToScreen(w, h.getRotate()), v = i.PageRotateToScreen(v, h.getRotate());
                        var P = w.left - v.left,
                            Q = w.right - v.right,
                            R = w.bottom - v.bottom,
                            S = $("#" + h.getDocViewContainerID()),
                            T = S.height(),
                            U = S.width(),
                            V = S.offset(),
                            W = $("#" + i.getPageViewContainerID()),
                            X = W.offset();
                        if (T -= O.getScrollBarHeight(), U -= O.getScrollBarWidth(), R > 0) V.top + T <= X.top + w.bottom && O.scrollByY(R + 5);
                        else if (0 > R && V.top >= X.top + w.bottom - C) {
                            var Y = Math.min(V.top - (X.top + w.top), V.top + T - (X.top + w.bottom)),
                                Z = Math.min(R, -Y);
                            O.scrollByY(Z - 5)
                        }
                        switch (n.getTextAlign()) {
                            case WebPDF.PDFData.TypeWriterTextAlignStyle.RIGHT_JUSTIFIED:
                                if (P > 0) {
                                    if (V.left + U <= X.left + w.right) {
                                        var _ = Math.min(X.left + w.right - (V.left + U), X.left + w.left - V.left),
                                            aa = Math.max(P, _);
                                        O.scrollByX(aa + 5)
                                    }
                                } else 0 > P && V.left >= X.left + w.left && O.scrollByX(P - 5);
                                break;
                            default:
                                if (Q > 0) V.left + U <= X.left + w.right && O.scrollByX(Q + 5);
                                else if (0 > Q && V.left >= X.left + w.left) {
                                    var _ = Math.min(V.left + U - (X.left + w.right), V.left - (X.left + w.left)),
                                        aa = Math.min(Q, -_);
                                    O.scrollByX(aa - 5)
                                }
                        }
                    }
                }
            }
        }
    }, WebPDF.TypewriterAnnotHandler
}), define("core/Plugins/Annot/DrawingAnnotHandler", [], function(a, b, c) {
    var d = WebPDF.PDFPoint,
        e = WebPDF.Common;
    return WebPDF.DrawingAnnotHandler = function(a, b) {
        this.readerApp = a, this.annotHandlerManager = b
    }, WebPDF.DrawingAnnotHandler.prototype = {
        getType: function() {
            return "Ink"
        },
        canAnswer: function(a, b) {
            var c = this.readerApp.getCurToolHandler();
            if (c) {
                var d = c.getName();
                if (d === WebPDF.Tools.TOOL_NAME_SELANNOT || d === WebPDF.Tools.TOOL_NAME_HAND || d === WebPDF.Tools.TOOL_NAME_INKANNOT) return !0;
                if (void 0 != b && b && d === WebPDF.TOOL_NAME_SELECTTEXT) return !0
            }
            return !1
        },
        canMove: function(a) {
            return !0
        },
        moveAnnot: function(a, b, c, d, e, f) {
            var g = this.annotHandlerManager.getUIManager(),
                h = a.getScale(),
                i = this.readerApp.getPixelsPerPoint();
            c /= i * h, d /= i * h, b.offsetInkList(c, d);
            var j = b.getAnnotName(),
                k = g.getAnnotDivID(a, j),
                l = $("#" + k);
            l.css({
                left: e + "px",
                top: f + "px"
            });
            var m = g.getInkAnnotDivID(a, j),
                n = $("#" + m);
            n.css({
                left: e + "px",
                top: f + "px"
            })
        },
        deleteAnnot: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).remove();
            var f = d.getInkAnnotDivID(a, c);
            $("#" + f).remove();
            var g = b.getPopup();
            if (null != g && null == b.getHeadAnnot()) {
                var h = d.getAnnotPopupDivID(a, c);
                $("#" + h).remove()
            }
        },
        onDraw: function(a, b, c, f) {
            f = $.isNumeric(f) ? f : 1;
            var g = b.getAnnotName(),
                h = this.annotHandlerManager.getUIManager(),
                i = h.getAnnotCanvasDivID(a, g),
                j = document.getElementById(i);
            if (null == j || c || $.support.canvas || (uuClass.Canvas.InitCavansElement(j), j = document.getElementById(i)), j) {
                var k = j.getContext("2d");
                null != k._clear ? k._clear() : k.clearRect(0, 0, j.width, j.height), k.lineWidth = b.getInkBorderWidth() * a.getScale() * f, k.strokeStyle = WebPDF.Common.hexColor2Rgba(b.getInkColor(), 1);
                var l = b.getRect(),
                    m = a.pdfRectToDevice(l, !0),
                    n = b.getInkList();
                if (null != n) {
                    k.beginPath();
                    for (var o = n.length, p = 0; o > p; p++) {
                        var q = n[p],
                            r = q.length;
                        if (!(1 >= r)) {
                            for (var s = [], t = 0; r > t; t++) {
                                var u = a.pdfPtToDevice(q[t]);
                                u.x = (u.x - m.left) * f, u.y = (u.y - m.top) * f, s.push(u)
                            }
                            var v = s[0];
                            if (k.moveTo(v.x, v.y), 1 == r) {
                                var w = s[1];
                                k.lineTo(w.x, w.y), k.stroke()
                            } else {
                                var x, y, z = new d(0, 0),
                                    A = new d(0, 0),
                                    B = new d(0, 0),
                                    C = new d(0, 0),
                                    D = new d(0, 0),
                                    E = new d(0, 0),
                                    F = (new d(0, 0), 1);
                                z = v;
                                do k.moveTo(z.x, z.y), r - F == 1 ? (C = s[F++], A.x = (2 * z.x + C.x) / 3, A.y = (2 * z.y + C.y) / 3, B.x = (z.x + 2 * C.x) / 3, B.y = (z.y + 2 * C.y) / 3, k.bezierCurveTo(A.x, A.y, B.x, B.y, C.x, C.y), z = C) : r - F == 2 ? (A = s[F++], B = s[F], D.x = A.x - z.x, D.y = A.y - z.y, E.x = B.x - A.x, E.y = B.y - A.y, x = e.vectorLength(D) < .001 ? 0 : e.slopeAngle(D), y = e.vectorLength(E) < .001 ? 0 : e.slopeAngle(E), Math.abs(x - y) > 3.1415926535 / 3 ? (C = A, A.x = (2 * z.x + C.x) / 3, A.y = (2 * z.y + C.y) / 3, B.x = (z.x + 2 * C.x) / 3, B.y = (z.y + 2 * C.y) / 3, k.moveTo(z.x, z.y), k.bezierCurveTo(A.x, A.y, B.x, B.y, C.x, C.y), z = C) : (k.moveTo(z.x, z.y), k.bezierCurveTo(z.x, z.y, A.x, A.y, B.x, B.y), F++, z = B)) : (A = s[F++], B = s[F], C = s[F + 1], k.bezierCurveTo(A.x, A.y, B.x, B.y, C.x, C.y), F += 2, z = C); while (r > F)
                            }
                        }
                    }
                    k.stroke()
                }
            }
        },
        onSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            return $("#" + e).addClass("fwr-annot-selected"), !0
        },
        onDeSelected: function(a, b) {
            var c = b.getAnnotName(),
                d = this.annotHandlerManager.getUIManager(),
                e = d.getAnnotDivID(a, c);
            $("#" + e).removeClass("fwr-annot-selected")
        },
        onFocus: function(a, b) {},
        onLButtonDown: function(a, b, c) {
            return this.onSelected(a, b)
        },
        onLButtonUp: function(a, b, c) {},
        onLButtonDblClk: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onLButtonDblClk(a, b, c)
        },
        onMouseOver: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseOver(a, b, c)
        },
        onMouseLeave: function(a, b, c) {
            this.annotHandlerManager.getMarkupAnnotHandler().onMouseLeave(a, b, c)
        },
        onUpdatePosition: function(a, b, c) {
            var d = (a.getPDFPage(), b.getRect()),
                e = a.pdfRectToDevice(d, !0),
                f = this.annotHandlerManager.getUIManager(),
                g = f.getInkAnnotDivID(a, b.getAnnotName()),
                h = f.getAnnotCanvasDivID(a, b.getAnnotName());
            $("#" + g).css({
                left: e.left,
                top: e.top,
                width: WebPDF.RectUtils.width(e),
                height: WebPDF.RectUtils.height(e)
            });
            var i = f.getAnnotDivID(a, b.getAnnotName()),
                j = $("#" + i);
            j.css({
                left: e.left,
                top: e.top,
                width: WebPDF.RectUtils.width(e),
                height: WebPDF.RectUtils.height(e)
            });
            var k = document.getElementById(h);
            null != k && ($(k).height(WebPDF.RectUtils.height(e)), $(k).width(WebPDF.RectUtils.width(e)), $(k).attr("width", WebPDF.RectUtils.width(e)), $(k).attr("height", WebPDF.RectUtils.height(e))), this.onDraw(a, b, !0, 1)
        }
    }, WebPDF.DrawingAnnotHandler
}), define("core/Plugins/Annot/CommentsAnnot", [], function(a, b, c) {
    WebPDF.PDFData.CommentAnnotType = {
        COMMENTTYPE_UNDERLINE: "Underline",
        COMMENTTYPE_HIGHLIGHT: "Highlight",
        COMMENTTYPE_SQUIGGLY: "Squiggly",
        COMMENTTYPE_STRIKEOUT: "StrikeOut",
        COMMENTTYPE_CARET: "Caret",
        COMMENTTYPE_REPLACE: "Replace"
    }
}), define("core/Plugins/Annot/AnnotMousePtHandler", [], function(a, b, c) {
    var d = function(a) {
        this.baseAnnotPlugin = a
    };
    return d.prototype = {
        _getPageAndAnnot: function(a) {
            var b = null,
                c = null;
            if ($(a).hasClass("fwr-annot")) {
                var d = parseInt(a.getAttribute("page-index")),
                    e = a.getAttribute("annot-name"),
                    f = this.baseAnnotPlugin.getReaderApp().getMainView().getDocView();
                c = f.getPageView(d);
                var g = c.getPDFPage();
                b = g.getAnnotByName(e)
            }
            return {
                annot: b,
                page: c
            }
        },
        getType: function() {
            return "Annot Mouse Pt Handler"
        },
        onLButtonDown: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotLButtonDown(b.page, b.annot, a)
        },
        onLButtonUp: function(a) {
            var b = this._getPageAndAnnot(a.target);
            if (!b) {
                parseInt(target.getAttribute("page-index"))
            }
            return this.baseAnnotPlugin.onAnnotLButtonUp(b.page, b.annot, a)
        },
        onLButtonDblClk: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotLButtonDblClk(b.page, b.annot, a)
        },
        onMouseMove: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotMouseMove(b.page, b.annot, a)
        },
        onRButtonDown: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotRButtonDown(b.page, b.annot, a)
        },
        onRButtonUp: function(a) {
            return !1
        },
        onRButtonDblClk: function(a) {
            return !1
        },
        onMouseWheel: function(a) {
            return !1
        },
        onMouseOver: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotMouseOver(b.page, b.annot, a)
        },
        onMouseOut: function(a) {
            return this.onMouseLeave(a)
        },
        onMouseLeave: function(a) {
            var b = this._getPageAndAnnot(a.fromElement);
            return this.baseAnnotPlugin.onAnnotMouseLeave(b.page, b.annot, a)
        },
        onMouseEnter: function(a) {
            return this.onMouseOver(a)
        },
        onDoubleTap: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotLButtonDblClk(b.page, b.annot, a)
        },
        onPinchIn: function(a) {
            return !1
        },
        onPinchOut: function(a) {
            return !1
        },
        onHold: function(a) {
            var b = this._getPageAndAnnot(a.target);
            return this.baseAnnotPlugin.onAnnotHold(b.page, b.annot, a)
        }
    }, WebPDF.Event.AnnotMousePtHandler = d, WebPDF.Event.AnnotMousePtHandler
}), define("core/Plugins/Annot/AnnotSelectionTool", ["core/Plugins/TextSelection/Reader_TextSelectTool", "core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage", "core/Plugins/TextSelection/Reader_TextPageSelect"], function(a, b, c) {
    WebPDF.Tools.TOOL_NAME_SELANNOT = "Annot Selection Tool";
    var d = WebPDF.PDFPoint,
        e = WebPDF.PDFRect;
    a("core/Plugins/TextSelection/Reader_TextSelectTool");
    return WebPDF.Tools.AnnotSelectionToolHandler = function(a, b) {
        function c() {
            if (null == r) {
                var a = h.getMainView().getDocView(),
                    b = a.getPageView(0),
                    c = $("#" + a.getDocViewContainerID()),
                    d = a.getDocViewContainerID() + "_annot_bound_select",
                    e = "<div class='fwr-annot-bound-selection fwr-hidden' id='" + d + "'></div>";
                null != b && b.isContentCreated() ? $("#" + b.getPageViewContainerID()).parent().parent().append(e) : c.append(e), r = $("#" + d)
            }
            return r
        }

        function f() {
            var a = c(),
                b = Math.abs(l.x - k.x),
                d = Math.abs(l.y - k.y),
                e = null,
                f = null;
            l.x < k.x && l.y < k.y && (e = l.x, f = l.y), l.x > k.x && l.y < k.y && (e = k.x, f = l.y), l.x < k.x && l.y > k.y && (e = l.x, f = k.y), l.x >= k.x && l.y >= k.y && (e = k.x, f = k.y);
            var g = h.getMainView().getDocView(),
                i = g.getDocViewClientRect(),
                j = g.getScrollApi(),
                m = 0,
                n = 0;
            j && (m = j.getContentPositionX(), n = j.getContentPositionY());
            var p = o.getPageViewRect();
            e = e - i.left + m, f = f - i.bottom + n, e < p.left && (b -= p.left - e, e = p.left), f < p.top && (d -= p.top - f, f = p.top);
            var q = e + b > p.right ? p.right : e + b,
                r = f + d >= p.bottom ? p.bottom - 3 : f + d;
            b = q - e, d = r - f, a.css({
                left: e,
                top: f,
                width: b,
                height: d
            }), a.removeClass("fwr-hidden")
        }

        function g() {
            var a = c();
            a.addClass("fwr-hidden")
        }
        var h = a,
            i = b,
            j = new e(0, 0, 0, 0),
            k = new d(0, 0),
            l = new d(0, 0),
            m = new d(0, 0),
            n = new d(0, 0),
            o = null,
            p = null,
            q = this,
            r = null,
            s = !1;
        this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_SELANNOT
        }, this.onInit = function(a, b) {
            $.extend(i, {})
        }, this.onDestroy = function() {}, this.onActivate = function() {
            if (null != h.getMainView()) {
                var a = h.getMainView().getDocView(),
                    b = $("#" + a.getDocViewContainerID());
                b.css({
                    cursor: "auto"
                })
            }
        }, this.onDeactivate = function() {
            i.clearSelection()
        }, this.isEnabled = function() {
            var a = h.getMainView().getDocView().getPDFDoc();
            return a && a.getDocType() != WebPDF.PDFDocType.XFA ? !0 : !1;
        }, this.isProcessing = function() {
            return s
        }, this.onLButtonDown = function(a) {
            var b = h.getMainView().getDocView(),
                c = $("#" + b.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(c.get(0), a.target, !0)) return !1;
            var f = (h.getMainView().getDocView(), a.shiftKey),
                g = a.ctrlKey;
            f || g || (b.clearAllSelection(), i.clearSelection());
            var l = null,
                p = new d(0, 0);
            return l = WebPDF.TextSelect.CReader_TextSelectTool.getPageViewInfoByMouseEvent(h, a, p, !0, !1), null == l ? !1 : p.x < 0 || p.x > l.getPageViewWidth() ? !1 : (WebPDF.Common.preventDefaults(a, !0), s = !0, o = l, m = n = p, k.x = a.pageX, k.y = a.pageY, j = new e(0, 0, 0, 0), !0)
        }, this.onLButtonUp = function(a) {
            if (s) {
                l.x = a.pageX, l.y = a.pageY, g();
                var b = null,
                    c = new d(0, 0);
                b = WebPDF.TextSelect.CReader_TextSelectTool.getPageViewInfoByMouseEvent(h, a, c, !0, !1), null == b && (b = o);
                var f = -1;
                if (f = b.getPageIndex(), n = 0 == c.x && 0 == c.y ? p : c, null == n) return !0;
                f != o.getPageIndex() && (f < o.getPageIndex() ? n.y = 0 : n.y = o.getPageViewHeight());
                var q = new d(0, 0),
                    r = new d(0, 0);
                q = o.devicePtToPDF(m), r = o.devicePtToPDF(n), j = new e(q.x, q.y, r.x, r.y), WebPDF.RectUtils.normalize(j), i.selectAnnotsByRect(o, j)
            }
            return s = !1, WebPDF.RectUtils.empty(j), k.x = 0, k.y = 0, l.x = 0, l.y = 0, o = null, !0
        }, this.onLButtonDblClk = function(a) {
            return !1
        }, this.clipSelectRect = function(a, b) {
            var c = a.getPageViewRect();
            b.left = b.left > c.left ? b.left : c.left, b.top = b.top > c.top ? b.top : c.top, b.right = b.right > c.right ? c.right : b.right, b.bottom = b.bottom > c.bottom ? c.bottom : b.bottom
        }, this.onMouseMove = function(a) {
            if (s) {
                var b = null,
                    c = new d(0, 0);
                b = WebPDF.TextSelect.CReader_TextSelectTool.getPageViewInfoByMouseEvent(h, a, c, !0, !1), null != b && (o = b, p = c), WebPDF.Common.preventDefaults(a, !0), l.x = a.pageX, l.y = a.pageY, f()
            }
            return !0
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return q.onLButtonUp(a), !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Event.AnnotSelectionToolHandler
}), define("core/Plugins/TextSelection/Reader_TextSelectTool", ["core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage", "core/Plugins/TextSelection/Reader_TextPageSelect"], function(a, b, c) {
    var d = (a("core/PDFData/Text/Reader_TextObject"), a("core/PDFData/Text/Reader_TextPage"), a("core/Plugins/TextSelection/Reader_TextPageSelect")),
        e = WebPDF.PDFPoint,
        f = WebPDF.PDFRect,
        g = WebPDF.RectUtils,
        h = WebPDF.Common,
        i = WebPDF.PDFData.Text.CaretInfo,
        j = WebPDF.PDFData.Text.TextBoundInfo,
        k = {
            SELECT_MODE_NORMAL: 0,
            SELECT_MODE_IN_SELECTED: 1,
            SELECT_MODE_SELECTING: 2,
            SELECT_MODE_BOUND: 3
        };
    WebPDF.TextSelect.SELECT_STATE = k;
    var l = {
        CURSOR_NORMAL: 0,
        CURSOR_SELECT: 1,
        CURSOR_ARROW: 2,
        CURSOR_BOUND: 3,
        CURSOR_QKSCH: 4
    };
    WebPDF.TextSelect.CURSOR_STATE = l, WebPDF.TextSelect.TextPage = function() {
        this.textPage = null, this.pageSelectInfo = new d
    };
    var m = WebPDF.TextSelect.TextPage;
    WebPDF.TextSelect.TextSelectedInfo = function() {
        this.pageIndex = -1, this.selectedRectArray = []
    };
    var n = function(a) {
        function b() {
            try {
                P || (P = document.createElement("iFrame"), P.id = A.getAppId() + "-copy-frame", P.className = "fwr-copy-frame", $("body").append(P), $("#" + P.id).on("load", function() {
                    P.contentWindow.title = "Reading View.", Q = !0
                }))
            } catch (a) {
                console.error(a)
            }
        }

        function c() {
            if (!P.contentWindow) return void console.warn("Cannot focus the copy frame's window, because it's null. Copy frame load status = " + Q + ".");
            $(P.contentWindow.document.body).empty().append("<p>" + S.getSelectedText() + "</p>");
            try {
                if (P.contentWindow.focus(), "undefined" != typeof window.getSelection) {
                    var a = P.contentWindow.getSelection();
                    a.removeAllRanges(), a.selectAllChildren(P.contentWindow.document.body)
                } else "undefined" != typeof document.execCommand && P.contentWindow.document.execCommand("SelectAll")
            } catch (b) {
                console.error(b)
            }
        }

        function d() {
            if (!M) {
                var a = A.getMainView().getDocView(),
                    b = a.getPageView(0),
                    c = $("#" + a.getDocViewContainerID()),
                    d = a.getDocViewContainerID() + "_text_bound_select",
                    e = "<div class='fwr-text-bound-selection fwr-hidden' id='" + d + "'></div>";
                null != b && b.isContentCreated() ? $("#" + b.getPageViewContainerID()).parent().parent().append(e) : c.append(e), M = $("#" + d)
            }
            return M
        }

        function o() {
            if (!N) {
                var a = A.getMainView().getDocView(),
                    b = a.getPageView(0),
                    c = $("#" + a.getDocViewContainerID()),
                    d = a.getDocViewContainerID() + "_selection_operation_bar";
                R = a.getDocViewContainerID() + "_selection_operation_copy";
                var e = "<div class='fwr-text-selection-operation-bar fwr-hidden' id='" + d + "'><ul><li ><a id='" + R + "' href='javascript:void(0);'>Copy</a></li></ul><div class='fwr-text-selection-operation-bar-right'/></div>";
                null != b && b.isContentCreated() ? $("#" + b.getPageViewContainerID()).parent().parent().append(e) : c.append(e), N = $("#" + d), $("#" + R).on("click", function() {
                    WebPDF.copyText(A, S.getSelectedText()) && S.hideSelectionOperationDiv()
                })
            }
            return N
        }

        function p(a) {
            if (!WebPDF.Environment.mobile) {
                J = a;
                var b = A.getMainView().getDocView(),
                    c = $("#" + b.getDocViewContainerID());
                switch (a) {
                    case l.CURSOR_ARROW:
                        c.removeClass(O).css({
                            cursor: "default"
                        });
                        break;
                    case l.CURSOR_SELECT:
                    case l.CURSOR_NORMAL:
                        c.removeClass(O).css({
                            cursor: "text"
                        });
                        break;
                    case l.CURSOR_BOUND:
                        c.addClass("fwr-bound-cursor"), O = "fwr-bound-cursor"
                }
            }
        }

        function q(a, b) {
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (!g.isEmpty(d) && g.ptInRect(d, a.x, a.y)) return !0
            }
            return !1
        }

        function r(a, b, c, d) {
            if (0 > c || 0 > d || -1 == a.index || -1 == b.index) return !1;
            var e, f, g, i, j;
            c > d && (e = c, c = d, d = e, j = !0);
            var k = h.clone(a),
                l = h.clone(b);
            (j || c === d && k.index > l.index) && (e = k.index, k.index = l.index, l.index = e, e = k.bLeft, k.bLeft = l.bLeft, l.bLeft = e);
            var m = h.clone(D);
            D.length = 0;
            var n = m.length;
            for (i = 0; n > i; i++)
                if (f = m[i], f > d || c > f) {
                    if (g = S.getTextPage(f), !g) return !1;
                    g.pageSelectInfo.clearSelectRect(), D.push(f)
                }
            if (c != d) {
                var o = S.getTextPage(c),
                    p = S.getTextPage(d);
                if (!o || !p) return !1;
                for (o.pageSelectInfo.addSelectedRectByIndex(k.bLeft ? k.index : k.index + 1, o.textPage.getSize() - 1), D.push(c), i = c + 1; d > i; i++) {
                    if (g = S.getTextPage(i), !g) return !1;
                    g.pageSelectInfo.selectAll(), g.pageSelectInfo.isSelected() && D.push(i)
                }
                return p.pageSelectInfo.addSelectedRectByIndex(0, l.bLeft ? l.index - 1 : l.index), D.push(d), D.length > 0
            }
            var q = k.index,
                r = l.index;
            return k.index != l.index ? (0 == k.bLeft && q++, 1 == l.bLeft && r--, (g = S.getTextPage(c)) ? (g.pageSelectInfo.addSelectedRectByIndex(q, r), D.push(c), !0) : !1) : k.bLeft != l.bLeft ? (g = S.getTextPage(c)) ? (g.pageSelectInfo.addSelectedRectByIndex(k.index, l.index), D.push(c), !0) : !1 : 0 == m.length ? !1 : (g = S.getTextPage(c)) ? (g.pageSelectInfo.clearSelectRect(), D.push(c), !0) : !1
        }

        function s(a, b, c) {
            if (a.equal(b)) return 0 == D.length ? !1 : (S.clearSelection(), WebPDF.Environment.mobile && !ba && A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND), !1);
            var d = new e(0, 0),
                g = new e(0, 0);
            d = B.devicePtToPDF(a), g = B.devicePtToPDF(b);
            var h = new f(d.x, d.y, g.x, g.y),
                i = S.getTextPage(c);
            return i ? (i.pageSelectInfo.addSelectedRect(h), D.length = 0, D.push(c), !0) : !1
        }

        function t(a) {
            return a.getPageViewContainerID() + "_TextHighLights"
        }

        function u(a) {
            if (null != a && a.isContentCreated()) {
                $("#textMenu").css({
                    visibility: "hidden"
                });
                var b = t(a),
                    c = $("#" + b);
                null != c && c.empty()
            }
        }

        function v() {
            for (var a = A.getMainView().getDocView(), b = 0; b < D.length; b++) {
                var c = D[b],
                    d = S.getTextPage(c);
                d && (d.pageSelectInfo.clearSelectRect(), u(a.getPageView(c)))
            }
        }

        function w(a, b) {
            if (!a || !a.isContentCreated() || !b) return !1;
            var c = t(a),
                d = a.getPageIndex();
            if (!L[d]) {
                var e = "<div id='" + c + "' style='z-index:7;'></div>",
                    h = $("#" + a.getPageViewContainerID());
                h.append(e), L[d] = !0
            }
            var i = $("#" + c);
            i.empty();
            for (var j = "", k = null, l = null, m = 0; m < b.length; m++) {
                var n = b[m];
                g.normalize(n), n = a.pdfRectToDevice(n, !0), WebPDF.Environment.mobile && !ba && (0 == m && (k = n), m == b.length - 1 && (l = n)), j += "<div id='text_highlight_" + d + "_" + m + "'class='fwr-text-highlight' style='left:" + n.left + "px;top:" + n.top + "px;width:" + g.width(n) + "px;height:" + g.height(n) + "px' ></div>"
            }
            if (WebPDF.Environment.mobile && !ba && null != k && null != l) {
                var o = new f(k.left - 30, k.top - 30, k.right + 3, k.bottom + 3);
                g.normalize(o), Z = [], Z.push(o);
                var p = new f(l.left - 3, l.top - 3, l.right + 30, l.bottom + 30);
                g.normalize(p), _ = [], _.push(p), j += "<div id='text_highlight_mobile_left" + d + "_" + m + "'class='fwr-text-highlight-mobile' style='left:" + k.left + "px;top:" + (k.top - 5) + "px;width:2px;height:" + (g.height(k) + 5) + "px' ></div>", j += "<div id='text-select-start' class='text-select' style='position: absolute; left:" + (k.left - 7) + "px;top:" + (k.top - 5 - 15) + "px;'><svg><use xlink:href='#icon-text-select'></use></svg></div>", j += "<div id='text_highlight_mobile_right" + d + "_" + m + "'class='fwr-text-highlight-mobile' style='left:" + l.right + "px;top:" + l.top + "px;width:2px;height:" + (g.height(l) + 5) + "px' ></div>", j += "<div id='text-select-end' class='text-select' style='position: absolute; left:" + (l.right - 7) + "px;top:" + (l.bottom + 4) + "px;'><svg><use xlink:href='#icon-text-select'></use></svg></div>", ca = k, Y = !0
            }
            if (i.append(j), "" != j) {
                var q = "fwr-textSelect-context-menu";
                if (WebPDF.Environment.mobile && !ba) return !1;
                $(".fwr-text-highlight").fwrContextMenu(q, {
                    onSelect: function(a, b) {
                        return S.onContextMenu($(this))
                    }
                }, document.getElementById(A.getMainFrameId()))
            }
        }

        function x() {
            var a = d(),
                b = Math.abs(X.x - W.x),
                c = Math.abs(X.y - W.y),
                e = null,
                f = null;
            X.x < W.x && X.y < W.y && (e = X.x, f = X.y), X.x > W.x && X.y < W.y && (e = W.x, f = X.y), X.x < W.x && X.y > W.y && (e = X.x, f = W.y), X.x > W.x && X.y > W.y && (e = W.x, f = W.y);
            var g = A.getMainView().getDocView(),
                h = g.getDocViewClientRect(),
                i = g.getScrollApi(),
                j = 0,
                k = 0;
            i && (j = i.getContentPositionX(), k = i.getContentPositionY()), e = e - h.left + j, f = f - h.bottom + k, a.css({
                left: e,
                top: f,
                width: b,
                height: c
            }).removeClass("fwr-hidden")
        }

        function y() {
            var a = d();
            a.addClass("fwr-hidden")
        }

        function z(a) {
            if (!B) return !1;
            var b = A.getMainView().getDocView(),
                c = $("#" + b.getDocViewContainerID()),
                d = c.height(),
                e = c.width() - 16,
                h = c.offset(),
                i = b.getScrollApi();
            i && (e -= i.getScrollBarWidth(), d -= i.getScrollBarHeight());
            var j = new f(h.left, h.top, h.left + e, h.top + d);
            if (g.normalize(j), g.ptInRect(j, a)) return !1;
            var k = 0,
                l = 0,
                m = 20;
            return a.x < j.left && (k = -m), a.y < j.bottom && (l = -m), a.x > j.right && (k = m), a.y > j.top && (l = m), b.movePage(k, l), !0
        }
        WebPDF.TextSelect.CReader_TextSelectTool.Instance = null, WebPDF.TextSelect.CReader_TextSelectTool.CreateTextSelectTool = function(a, b) {
            return null == WebPDF.TextSelect.CReader_TextSelectTool.Instance && (WebPDF.TextSelect.CReader_TextSelectTool.Instance = new WebPDF.TextSelect.CReader_TextSelectTool(a, b)), WebPDF.TextSelect.CReader_TextSelectTool.Instance
        };
        var A = a,
            B = null,
            C = [],
            D = [],
            E = !1,
            F = new e(0, 0),
            G = new e(0, 0),
            H = -1,
            I = k.SELECT_MODE_NORMAL,
            J = l.CURSOR_SELECT,
            K = !1,
            L = {},
            M = null,
            N = null,
            O = null,
            P = null,
            Q = !1,
            R = null,
            S = this,
            T = null,
            U = new i,
            V = new i,
            W = new e(0, 0),
            X = new e(0, 0),
            Y = !1,
            Z = [],
            _ = [],
            aa = !1,
            ba = !1;
        b(), this.getTextPage = function(a) {
            var b = C[a];
            if (!b) {
                var c = A.getTextManager().getTextPage(a, !1);
                if (null != c) {
                    if (c.blocking) return null;
                    b = new m, b.textPage = c, b.pageSelectInfo.setTextPage(c), C[a] = b
                }
            }
            return b
        }, this.hideSelectionOperationDiv = function() {
            var a = o();
            a.addClass("fwr-hidden")
        }, this.onLButtonDown = function(a) {
            if (a.target.id === R) return !1;
            if (ba = !1, WebPDF.Environment.mobile) {
                var b = A.getCurToolHandler().getName();
                ba = b == WebPDF.Tools.TOOL_NAME_COMMENT_HIGHTLIGHT || b == WebPDF.Tools.TOOL_NAME_COMMENT_UNDERLINE
            }
            W.x = a.pageX, W.y = a.pageY;
            var c, d = new e(0, 0);
            if (c = n.getPageViewInfoByMouseEvent(A, a, d, !0, !1), !c) {
                T = c;
                var f = A.getMainView().getDocView(),
                    j = new e(a.pageX, a.pageY),
                    m = f.getDocViewClientRect();
                return void(g.ptInRect(m, j) && (this.clearSelection(), WebPDF.Environment.mobile && !ba && A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND)))
            }
            if (c.isPageLoaded()) {
                h.preventDefaults(a, !0), K = !0;
                var o = new e(0, 0);
                o = c.devicePtToPDF(d);
                var s = [],
                    t = c.getPageIndex(),
                    u = S.getTextPage(t);
                if (u) {
                    u.pageSelectInfo.getSelectPDFRect(s);
                    var v = q(d, Z);
                    if (v ? aa = !0 : v = q(d, _), Y && v) return I = k.SELECT_MODE_SELECTING, aa && V.index < U.index ? V = U : !aa && V.index > U.index && (V = U), H = B.getPageIndex(), !1;
                    if (WebPDF.Environment.mobile && !ba) return this.clearSelection(), A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND), !1;
                    if (q(o, s)) return I = k.SELECT_MODE_IN_SELECTED, void p(l.CURSOR_ARROW);
                    var w, x = u.textPage.getCharIndexByPoint(o); - 1 != x && (w = new i, u.textPage.getCaretAtPoint(o, w), -1 == w.index && (x = -1));
                    var y = a.altKey;
                    if (E && (this.clearSelection(), WebPDF.Environment.mobile && !ba && A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND), E = !1, U.index = -1), x >= 0 && !y) {
                        var z = a.shiftKey;
                        if (I = k.SELECT_MODE_SELECTING, p(l.CURSOR_SELECT), V.index < 0) {
                            if (B != c && (B = c), u.textPage.getCaretAtPoint(o, U), V = h.clone(U), H = B.getPageIndex(), U.index < 0) return
                        } else if (z) {
                            if (z) {
                                if (-1 == V.index) return;
                                w = new i, u.textPage.getCaretAtPoint(o, w), B != c && (B = c), U = w, r(V, U, H, B.getPageIndex())
                            }
                        } else {
                            if (V.index < 0) return;
                            this.clearSelection(), WebPDF.Environment.mobile && !ba && A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND), w = new i, u.textPage.getCaretAtPoint(o, w), B != c && (B = c), U = w, V = h.clone(U), H = B.getPageIndex()
                        }
                    } else this.clearSelection(), WebPDF.Environment.mobile && !ba && A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND), B = c, x >= 0 && (u.textPage.getCaretAtPoint(o, V), H = B.getPageIndex()), U.index = -1, F = G = d, I = k.SELECT_MODE_BOUND, p(l.CURSOR_BOUND)
                }
            }
        }, this.onRButtonUp = function(a) {
            var b, c = new e(0, 0);
            if (b = n.getPageViewInfoByMouseEvent(A, a, c, !0, !1), !b) return !1;
            if (b.isPageLoaded()) {
                var d = new e(0, 0);
                d = b.devicePtToPDF(c);
                var f = b.getPageIndex(),
                    g = S.getTextPage(f);
                if (!g) return !1;
                var h = [];
                return g.pageSelectInfo.getSelectPDFRect(h), q(d, h)
            }
        };
        var ca = null;
        this.onLButtonUp = function(a, b) {
            K = !1, y();
            var c, d = new e(0, 0);
            if (c = n.getPageViewInfoByMouseEvent(A, a, d, !0, !1), (c || (c = T)) && c.isPageLoaded()) {
                if (WebPDF.Environment.mobile && !ba) {
                    if (aa = !1, A.isCopyText()) {
                        var f = A.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
                        if (f && Y) {
                            var g = a.pageX - 50,
                                h = a.pageY - 100;
                            g + 189 > $("#docViewer").width() && (g = $("#docViewer").width() - 189), $("#textMenu").css({
                                visibility: "visible",
                                left: g > 0 ? g : 0,
                                top: h > 0 ? h : 0
                            })
                        }
                    }
                    return !1
                }
                var i = new e(0, 0);
                i = c.devicePtToPDF(d);
                var j = c.getPageIndex(),
                    m = S.getTextPage(j);
                if (!m) return !1;
                var o = [];
                m.pageSelectInfo.getSelectPDFRect(o);
                var r = !1;
                return r = Y ? !(Y && (q(d, Z) || q(d, _))) : q(i, o), I == k.SELECT_MODE_IN_SELECTED && r && (ba || !WebPDF.Environment.mobile) && this.clearSelection(), r && J != l.CURSOR_ARROW ? p(l.CURSOR_ARROW) : r || J == l.CURSOR_SELECT || p(l.CURSOR_SELECT), I = 0 == r && Y ? k.SELECT_MODE_SELECTING : k.SELECT_MODE_NORMAL, S.highLightAllSelectedText(), ba = !1, !0
            }
        }, this.getSelectedText = function() {
            for (var a = "", b = D.length, c = 0; b > c; c++) {
                var d = D[c],
                    e = S.getTextPage(d);
                e && e.textPage && (a += e.pageSelectInfo.getSelectedText(), c != b - 1 && (a += WebPDF.TEXT_RETURN_LINEFEED))
            }
            return a
        }, this.getSelectedTextRectInfo = function() {
            for (var a = [], b = 0; b < D.length; b++) {
                var c = D[b],
                    d = S.getTextPage(c);
                if (d && d.pageSelectInfo.isSelected()) {
                    var e = [];
                    d.pageSelectInfo.getSelectPDFRect(e);
                    var f = new WebPDF.TextSelect.TextSelectedInfo;
                    f.pageIndex = c, f.selectedRectArray = e, a.push(f)
                }
            }
            return a
        }, this.getSelectedTextRectInfo = function(a) {
            for (var b = [], c = 0; c < D.length; c++) {
                var d = D[c],
                    e = S.getTextPage(d);
                if (e && e.pageSelectInfo.isSelected()) {
                    var a = [];
                    e.pageSelectInfo.getSelectPDFRect(a);
                    var f = new WebPDF.TextSelect.TextSelectedInfo;
                    f.pageIndex = d, f.selectedRectArray = a, b.push(f)
                }
            }
            return b
        }, this.clearSelection = function() {
            v(), S.hideSelectionOperationDiv(), Y = !1, Z = [], _ = [], aa = !1;
            var a = A.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
            a && WebPDF.Environment.mobile && $("#textMenu").hide()
        }, this.highLightAllSelectedText = function() {
            for (var a = D.length, b = 0; a > b; b++) {
                var c = D[b],
                    d = S.getTextPage(c);
                if (d) {
                    var e = [];
                    d.pageSelectInfo.getSelectPDFRect(e), w(A.getMainView().getDocView().getPageView(c), e)
                }
            }
        }, this.highLightTextArea = function(a) {
            for (var b = a.length, c = 0; b > c; c++) {
                var d = a[c],
                    e = S.getTextPage(d.pageIndex);
                if (e) {
                    var f = [];
                    f = d.selectedRectArray, w(A.getMainView().getDocView().getPageView(d.pageIndex), f)
                }
            }
        }, this.onContextMenu = function(a) {
            if (null != a) try {
                var b = a.attr("menuname");
                if ("Copy" == b) WebPDF.copyText(A, S.getSelectedText());
                else if ("Highlight" == b) {
                    var c = A.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_COMMENT_HIGHTLIGHT);
                    c.createAnnot(), A.getMainView().getDocView().setModified(!0)
                } else if ("Underline" == b) {
                    var d = A.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_COMMENT_UNDERLINE);
                    d.createAnnot(), A.getMainView().getDocView().setModified(!0)
                }
                S.clearSelection(), this.onActivate()
            } catch (e) {}
        }, this.onActivate = function() {
            var a = A.getMainView();
            if (a) {
                var b = a.getDocView(),
                    c = $("#" + b.getDocViewContainerID());
                c.css({
                    cursor: "text"
                })
            }
        }, this.onLButtonDblClk = function(a, b) {
            if (a && I !== k.SELECT_MODE_BOUND && !ba) {
                var d = null,
                    f = new e(0, 0);
                if (d = n.getPageViewInfoByMouseEvent(A, a, f, !0, !1), d && d.isPageLoaded()) {
                    B = d;
                    var g = d.getPageIndex(),
                        l = S.getTextPage(g);
                    if (l) {
                        var m = new e(0, 0);
                        m = d.devicePtToPDF(f);
                        var o = l.textPage.getCharIndexByPoint(m);
                        if (-1 != o) {
                            var p = new i;
                            l.textPage.getCaretAtPoint(m, p), -1 == p.index && (o = -1)
                        }
                        if (-1 != o) {
                            var q = new j(-1, -1);
                            if (l.textPage.getWordRange(o, q)) {
                                if (-1 === q.startIndex || -1 === q.endIndex) return;
                                if (WebPDF.Environment.mobile) {
                                    var p = new i;
                                    l.textPage.getCaretByIndex(q.startIndex, p, !0), V = h.clone(p), l.textPage.getCaretByIndex(q.endIndex, p, !0), U = h.clone(p)
                                }
                                if (l.pageSelectInfo.addSelectedRectByIndex(q.startIndex, q.endIndex), D.length = 0, D.push(g), $.isFunction(b)) b(a);
                                else {
                                    WebPDF.Environment.mobile && A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
                                    var r = [];
                                    l.pageSelectInfo.getSelectPDFRect(r), c(), S.highLightAllSelectedText()
                                }
                            }
                        } else WebPDF.Environment.mobile && (this.clearSelection(), A.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND))
                    }
                }
            }
        }, this.onMouseMove = function(a) {
            if (K && (!WebPDF.Environment.mobile || ba || Y)) {
                var b, c = new e(0, 0);
                if (b = n.getPageViewInfoByMouseEvent(A, a, c, !0, !0), null != b && b.isPageLoaded()) {
                    T = b, K && WebPDF.Common.preventDefaults(a, !0);
                    var d = new e(0, 0);
                    d = b.devicePtToPDF(c);
                    var f = b.getPageIndex(),
                        g = S.getTextPage(f);
                    if (g) {
                        var h = [];
                        g.pageSelectInfo.getSelectPDFRect(h);
                        var j = !1;
                        j = Y ? !1 : q(d, h);
                        var m, o = g.textPage.getCharIndexByPoint(d); - 1 != o && (m = new i, g.textPage.getCaretAtPoint(d, m), -1 == m.index && (o = -1));
                        var t = a.altKey;
                        if (I == k.SELECT_MODE_NORMAL) return void p(j ? l.CURSOR_ARROW : o >= 0 && !t ? l.CURSOR_SELECT : o >= 0 && t ? l.CURSOR_BOUND : l.CURSOR_NORMAL);
                        if (I == k.SELECT_MODE_BOUND) {
                            if (!ba && J != l.CURSOR_BOUND) return;
                            E = !0, G = c;
                            var u = B.getPageIndex();
                            f != u && (u > f ? G.y = 0 : G.y = B.getPageViewHeight()), s(F, G, u, f) && (S.highLightAllSelectedText(), g.pageSelectInfo.getFirstCaretInfo(U)), X.x = a.pageX, X.y = a.pageY, x()
                        } else if (I == k.SELECT_MODE_SELECTING) {
                            if (!WebPDF.Environment.mobile && J != l.CURSOR_SELECT) return;
                            if (!B || U.index < 0) return;
                            B != b && (B = b), m = new i, g.textPage.getCaretAtPoint(d, m) && (U = m, r(V, U, H, B.getPageIndex()) && S.highLightAllSelectedText()), z(new e(a.pageX, a.pageY))
                        }
                    }
                }
            }
        }, this.onHold = function(a) {
            S.onLButtonDblClk(a)
        }, this.isSelected = function() {
            for (var a = D.length, b = 0; a > b; b++) {
                var c = S.getTextPage(D[b]);
                if (c) {
                    var d = [];
                    if (c.pageSelectInfo.getSelectPDFRect(d) > 0) return !0
                }
            }
            return !1
        }, this.getSelectedPageRange = function() {
            for (var a = A.getMainView().getDocView().getPageCount(), b = -1, c = 0; c < D.length; c++) D[c] < a && (a = D[c]), D[c] > b && (b = D[c]);
            return {
                start: a,
                end: b
            }
        }
    };
    return n.ToolInstances = {}, n.getTextSelectTool = function(a) {
        var b = n.ToolInstances[a.getAppId()];
        return b || (b = new n(a), n.ToolInstances[a.getAppId()] = b), b
    }, n.getPtOffsetPageView = function(a, b, c) {
        if (!a) return !1;
        var d = $("#" + a.getPageViewContainerID()).offset(),
            e = a.getPageViewHeight() + 14,
            h = new f(0, d.top, a.getDocView().getDocViewWidth(), d.top + e);
        return g.normalize(h), c.x = b.pageX - d.left, c.y = b.pageY - d.top, g.ptInRect(h, b.pageX, b.pageY)
    }, n.getPageViewInfoByMouseEvent = function(a, b, c, d, f) {
        var h = a.getMainView().getDocView(),
            i = h.getVisiblePageRange(),
            j = null,
            k = new e(b.pageX, b.pageY),
            l = h.getDocViewClientRect();
        if (!f && !g.ptInRect(l, k)) return j;
        for (var m, o = i.begin; o <= i.end; o++)
            if (m = h.getPageView(o), null != m && n.getPtOffsetPageView(m, b, c)) {
                j = m;
                break
            }
        return !j && d && (m = h.getPageView(h.getCurPageIndex()), n.getPtOffsetPageView(m, b, c), j = m), j
    }, WebPDF.TextSelect.CReader_TextSelectTool = n, WebPDF.TextSelect.CReader_TextSelectTool
}), define("core/Plugins/TextSelection/Reader_TextPageSelect", ["core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage"], function(a, b, c) {
    var d = (a("core/PDFData/Text/Reader_TextObject"), a("core/PDFData/Text/Reader_TextPage"), WebPDF.PDFPoint, WebPDF.PDFRect, WebPDF.RectUtils),
        e = WebPDF.Common,
        f = WebPDF.CMap;
    WebPDF.TextSelect = {};
    var g = function(a, b) {
        this.startIndex = a, this.endIndex = b
    };
    return WebPDF.TextSelect.TextSelectRange = g, WebPDF.TEXT_RETURN_LINEFEED = "\r\n", WebPDF.TextSelect.CReader_TextPageSelect = function() {
        function a(a, c, d) {
            if (!(null == b || c > d)) {
                var e = new g(-1, -1);
                c > a.startIndex && (c <= a.endIndex ? (e.startIndex = a.startIndex, e.endIndex = c - 1, i.push(e)) : i.push(a)), d < a.endIndex && (d >= a.startIndex ? (e.startIndex = d + 1, e.endIndex = a.endIndex, i.push(e)) : i.push(a)), a.startIndex > c && (a.startIndex <= d ? (e.startIndex = c, e.endIndex = a.startIndex - 1, h.push(e)) : (e.startIndex = c, e.endIndex = d, h.push(e))), a.endIndex < d && (a.endIndex >= c ? (e.startIndex = a.endIndex + 1, e.endIndex = d, h.push(e)) : (e.startIndex = c, e.endIndex = d, h.push(e)))
            }
        }
        var b = null,
            c = [],
            h = [],
            i = [];
        this.setTextPage = function(a) {
            var c = b;
            return b = a, c
        }, this.addSelectedRect = function(j) {
            if (b) {
                d.normalize(j);
                var k = [];
                if (h = [], i = [], !b.getBoundPageInfo(j, k)) return i.length = 0, i = e.clone(c), c.length = 0, void(h.length = 0);
                var l, m = c.length;
                if (0 == m) {
                    l = k.length;
                    for (var n = 0; l > n; n++) c.push(new g(k[n].startIndex, k[n].endIndex));
                    return h = [], void(h = e.clone(c))
                }
                var o = new f,
                    p = new f,
                    q = new f;
                l = k.length;
                for (var n = 0; l > n; n++) {
                    var r = b.getLineIndexByIndex(k[n].startIndex);
                    o.put(r, n), p.put(n, r)
                }
                for (var s = 0; m > s; s++) {
                    var r = b.getLineIndexByIndex(c[s].startIndex);
                    q.put(r, s);
                    var t = o.get(r);
                    null != t ? a(c[s], k[t].startIndex, k[t].endIndex) : i.push(e.clone(c[s]))
                }
                for (var u = 0; l > u; u++) {
                    var r = p.get(u);
                    if (null == r) return;
                    var t = q.get(r);
                    null == t && h.push(new g(k[u].startIndex, k[u].endIndex))
                }
                c = [];
                for (var v = 0; l > v; v++) c.push(new g(k[v].startIndex, k[v].endIndex))
            }
        }, this.addSelectedRectByIndex = function(d, f) {
            if (b) {
                if (d > f || 0 > d || f > b.getSize()) return void this.clearSelectRect();
                if (0 == c.length) h = [], i = [], c.push(new g(d, f)), h = e.clone(c);
                else {
                    var j = c[0];
                    h = [], i = [], a(j, d, f), c = [], c.push(new g(d, f))
                }
            }
        }, this.clearSelectRect = function() {
            b && (h.length = 0, i.length = 0, i = e.clone(c), c.length = 0)
        }, this.selectAll = function() {
            if (b) {
                h.length = 0, i.length = 0, i = e.clone(c);
                var a = new g(0, b.getSize() - 1);
                c.length = 0, c.push(a), h.push(a)
            }
        }, this.isSelected = function() {
            return c.length > 0
        }, this.getSelectPDFRect = function(a) {
            a.length = 0;
            for (var d = c.length, e = 0; d > e; e++) {
                var f = c[e].startIndex,
                    g = c[e].endIndex - c[e].startIndex + 1;
                if (!(0 >= g))
                    for (var h = b.getPDFRect(f, g), i = 0; i < h.length; i++) a.push(h[i])
            }
            return a.length
        }, this.getSelectPDFRectAndMatrix = function(a, d, e) {
            a.length = 0, d.length = 0;
            for (var f = c.length, g = 0; f > g; g++) {
                var h = c[g].startIndex,
                    i = c[g].endIndex - c[g].startIndex + 1;
                if (!(0 >= i))
                    for (var j = b.getPDFRect(h, i, d, e), k = 0; k < j.length; k++) a.push(j[k])
            }
            return a.length
        }, this.getNeedDrawPDFRect = function(a) {
            a.length = 0;
            for (var c = h.length, d = 0; c > d; d++) {
                var e = h[d].startIndex,
                    f = h[d].endIndex - h[d].startIndex + 1;
                if (!(0 >= f))
                    for (var g = b.getPDFRect(e, f), i = 0; i < g.length; i++) a.push(g[i])
            }
            return a.length
        }, this.getNeedClearPDFRect = function(a) {
            a.length = 0;
            for (var c = i.length, d = 0; c > d; d++) {
                var e = i[d].startIndex,
                    f = i[d].endIndex - i[d].startIndex + 1;
                0 >= f || (a = b.getPDFRect(e, f))
            }
            return a.length
        }, this.getSelectedText = function() {
            for (var a = "", d = c.length, e = 0; d > e; e++) {
                var f = c[e].startIndex,
                    g = c[e].endIndex - c[e].startIndex + 1;
                0 >= g || (a += b.getPageText(f, g), d - 1 > e && (a += WebPDF.TEXT_RETURN_LINEFEED))
            }
            return a
        }, this.getFirstCaretInfo = function(a) {
            a.index = -1, 0 != c.length && b.getCaretByIndex(c[0].startIndex, a, !0)
        }
    }, WebPDF.TextSelect.CReader_TextPageSelect
}), define("core/Plugins/Annot/TextAnnotToolHandler", ["core/PDFData/AnnotFactory", "core/PDFData/Annot", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect", "core/PDFData/MarkupAnnot", "core/Interface", "core/PDFData/LinkAnnot", "core/PDFData/Action", "core/PDFData/Dest", "core/PDFData/InkAnnot", "core/PDFData/Signature", "core/PDFData/InkSign"], function(a, b, c) {
    a("core/PDFData/AnnotFactory");
    var d = WebPDF.AnnotFactory;
    return WebPDF.Tools.TOOL_NAME_TEXTANNOT = "TextAnnot Tool", WebPDF.Tools.TextAnnotToolHandler = function(a) {
        var b = null,
            c = a,
            e = !1,
            f = this,
            g = WebPDF.PDFData.MKA_POPUPWIDTH,
            h = WebPDF.PDFData.MKA_POPUPHEIGHT,
            i = 20,
            j = 20,
            k = 1;
        this.onInit = function(a) {
            b = a
        }, this.onDestroy = function() {}, this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_TEXTANNOT
        }, this.onActivate = function() {
            var a = b.getMainView().getDocView(),
                c = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (c.addClass("fwr-note-cursor-ie"), c.css("cursor", "crosshair")) : c.addClass("fwr-note-cursor")
        }, this.onDeactivate = function() {
            var a = b.getMainView().getDocView(),
                c = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? c.removeClass("fwr-note-cursor-ie") : c.removeClass("fwr-note-cursor")
        }, this.isEnabled = function() {
            var a = b.getPDFDoc();
            return a && a.getDocType() != WebPDF.PDFDocType.XFA ? !0 : !0
        }, this.isProcessing = function() {
            return e
        }, this.onLButtonDown = function(a) {
            var c = null,
                d = null,
                g = b.getMainView().getDocView();
            if ($(a.target).hasClass("fwr-annot") && (d = a.target.className), d) {
                var h = parseInt(a.target.getAttribute("page-index")),
                    i = a.target.getAttribute("annot-name");
                c = g.getPageView(h);
                var j = c.getPDFPage(),
                    k = j.getAnnotByName(i);
                if (k && "Markup" === k.getType() && "Text" === k.getSubType()) return !1
            }
            var l = $("#" + g.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(l.get(0), a.target, !0)) return !1;
            for (var m = g.getVisiblePageRange(), c = null, n = null, o = m.begin; o <= m.end; o++) {
                var p = g.getPageView(o),
                    q = $("#" + p.getPageViewContainerID()).offset(),
                    r = p.getPageViewWidth(),
                    s = p.getPageViewHeight();
                if (n = new WebPDF.PDFRect(q.left, q.top, q.left + r, q.top + s), WebPDF.RectUtils.normalize(n), WebPDF.RectUtils.ptInRect(n, a.pageX, a.pageY)) {
                    c = p;
                    break
                }
            }
            return null != c && (WebPDF.Common.preventDefaults(a, !0), f.createAnnot(c, a.pageX - n.left, a.pageY - n.bottom), g.setModified(!0)), e = !0, !0
        }, this.onLButtonUp = function(a) {
            return e = !1, !0
        }, this.createAnnot = function(a, e, f) {
            var l = new Date,
                m = l.valueOf() + 6e4 * l.getTimezoneOffset(),
                n = Math.floor(m / 1e3).toString(),
                o = {
                    c: "",
                    ca: k,
                    cd: n,
                    cl: "#ffff00",
                    f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                    md: n,
                    n: n,
                    pop: null,
                    subj: "Note",
                    subty: "Text",
                    tit: b.getUserName(),
                    ty: "Markup",
                    Quad: [],
                    txtn: "Comment",
                    r: 90 * a.getPDFPage().getPageRotate() + a.getDocView().getRotate(),
                    rc: null,
                    pdf: "false",
                    del: 0
                },
                p = a.getPDFPage(),
                q = p.getPageWidth(),
                r = p.getPageHeight(),
                s = new WebPDF.PDFPoint(e, f);
            s = a.devicePtToPDF(s), s.x = s.x, s.y = s.y;
            var t = i / 2,
                u = j / 2,
                v = new WebPDF.PDFRect(s.x - t, s.y + u, s.x + t, s.y - u);
            v.left < 0 && WebPDF.RectUtils.offset(v, 0 - v.left, 0), v.bottom < 0 && WebPDF.RectUtils.offset(v, 0, 0 - v.bottom), v.right > q && WebPDF.RectUtils.offset(v, q - v.right, 0), v.top > r && WebPDF.RectUtils.offset(v, 0, r - v.top), o.rc = [v.left, v.top, v.right, v.bottom];
            var w = new WebPDF.PDFRect(0, 0, 0, 0);
            w.top = v.top;
            var x = a.getDocView().getPageViewRender().getPixelsPerPoint(),
                y = a.getDocView().getScale();
            90 == a.getDocView().getRotate() || 270 == a.getDocView().getRotate() ? w.left = (a.getPageViewHeight() - g * x) / (y * x) : w.left = (a.getPageViewWidth() - g * x) / (y * x), w.right = w.left + g, w.bottom = w.top - h, w.bottom < 0 && WebPDF.RectUtils.offset(w, 0, -w.bottom), o.pop = {
                f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                md: n,
                n: n + "_popup",
                op: 1,
                rc: [w.left, w.top, w.right, w.bottom]
            };
            var z = d.createAnnot(o, !1);
            p.getAnnotJsonData().push(o), p.addAnnot(z), a.setModified(!0);
            var A = c.getAnnotHandlerMgr().getUIManager().getPageAnnotsContainerID(a),
                B = $("#" + A),
                C = z.getAnnotName(),
                D = c.getAnnotHandlerMgr().getUIManager().createAAnnotHtmlContent(a, z, C, 1, !0);
            B.append(D);
            var E = $("#" + a.getDocView().getDocViewContainerID()),
                F = E.height(),
                G = E.width(),
                H = E.offset(),
                I = c.getAnnotHandlerMgr().getAnnotVisibleRect(a, H, G, F);
            c.getAnnotHandlerMgr().updateAnnotsPosition(a, I, z), c.getAnnotHandlerMgr().setFocusAnnot(a, z), b.isMobile() && c.getAnnotHandlerMgr().setPopupFocus(a, z)
        }, this.onLButtonDblClk = function(a) {
            return !1
        }, this.onMouseMove = function(a) {
            return !1
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Event.TextAnnotToolHandler
}), define("core/PDFData/AnnotFactory", ["core/PDFData/Annot", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect", "core/PDFData/MarkupAnnot", "core/Interface", "core/PDFData/LinkAnnot", "core/PDFData/Action", "core/PDFData/Dest", "core/PDFData/InkAnnot", "core/PDFData/Signature", "core/PDFData/InkSign"], function(a, b, c) {
    a("core/PDFData/Annot"), a("core/PDFData/MarkupAnnot"), a("core/PDFData/LinkAnnot"), a("core/PDFData/InkAnnot"), a("core/PDFData/Signature"), a("core/PDFData/InkSign");
    var d = (WebPDF.PDFData.PDFAnnot, WebPDF.PDFData.PDFLinkAnnot),
        e = WebPDF.PDFData.PDFMarkupAnnot,
        f = WebPDF.PDFData.PDFTypewriterAnnot,
        g = WebPDF.PDFData.AnnotDataJSONFormat,
        h = WebPDF.PDFData.Signature,
        i = (WebPDF.PDFData.InkSign, {});
    return WebPDF.AnnotFactory = function() {
        var a = {
            createAnnot: function(a, b) {
                try {
                    var c = null;
                    switch (a[g.type]) {
                        case "Link":
                            c = new d(a);
                            break;
                        case "Typewriter":
                            c = new f(a);
                            break;
                        case "Markup":
                            switch (a[WebPDF.PDFData.AnnotDataJSONFormat.subType]) {
                                case "Ink":
                                    c = new WebPDF.PDFData.PDFInkAnnot(a);
                                    break;
                                default:
                                    c = new e(a)
                            }
                            var j = a[g.group];
                            if (j)
                                for (var k = 0; k < j.length; k++) {
                                    var l = this.createAnnot(j[k], b);
                                    null != l && (l.setHeadAnnot(c), c.addAnnotToGroup(l))
                                }
                            break;
                        default:
                            if (a[g.subType] == WebPDF.PDFData.AnnotType.Widget && ("Sig" == a[g.ft] || "Straddle" == a[g.subty])) {
                                var m = new h(a, "signature");
                                return m
                            }
                            if ("Straddle" == a[g.subType]) {
                                var m = new h(a, "signature");
                                if (null == a[WebPDF.PDFData.SignatureJSONFormat.n]) {
                                    var n = WebPDF.Common.createUniqueId();
                                    m.setSigName(n)
                                }
                                return m
                            }
                    }
                    if (null != a[g.pdf] && (b = !1), null == c) return null;
                    null != b && c.setSourceAnnot(b);
                    var n = WebPDF.Common.createUniqueId();
                    return c.setAnnotName(n), i[n] = 1, c
                } catch (o) {
                    console.error(o)
                }
            }
        };
        return a
    }(), WebPDF.AnnotFactory
}), define("core/PDFData/MarkupAnnot", ["core/PDFData/Annot", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect", "core/Interface"], function(a, b, c) {
    var d = a("core/PDFData/Annot");
    a("core/Interface");
    var e = WebPDF.Interface,
        f = WebPDF.PDFData.AnnotDataJSONFormat;
    WebPDF.PDFData.MKA_POPUPWIDTH = 180, WebPDF.PDFData.MKA_POPUPHEIGHT = 120;
    var g = function(a) {
        g.superclass.constructor.call(this, a), $.extend(this, {
            getOpenState: function() {
                return this.annotJSONData[f.openState]
            },
            setOpenState: function(a) {
                this.annotJSONData[f.openState] = a
            }
        })
    };
    e.extend(g, d), WebPDF.PDFData.PDFPopupAnnot = g;
    var h = function(a) {
        this.annotStateJSONData = a
    };
    h.prototype = {
        getState: function() {
            return this.annotStateJSONData[f.state]
        },
        getStateMode: function() {
            return this.annotStateJSONData[f.stateModel]
        }
    }, WebPDF.PDFData.PDFAnnotState = h;
    var i = function(a) {
        i.superclass.constructor.call(this, a), this.popup = null, this.replyChain = null, this.stateList = null, this.groupAnnots = {}, this.headAnnot = null, this.replyChainAnnotMap = {}, $.extend(this, {
            getOpacity: function() {
                return this.annotJSONData[f.opacity]
            },
            getSubject: function() {
                return "undefined" == typeof this.annotJSONData[f.subject] ? "" : this.annotJSONData[f.subject]
            },
            getTitle: function() {
                return this.annotJSONData[f.title]
            },
            getPopup: function() {
                if (null == this.popup) {
                    if (null == this.annotJSONData[f.popup]) return null;
                    this.popup = new g(this.annotJSONData[f.popup])
                }
                return this.popup
            },
            setPopupData: function(a) {
                this.annotJSONData[f.popup] = a
            },
            getSubType: function() {
                return this.annotJSONData[f.subType]
            },
            getTextAnnotName: function() {
                return this.annotJSONData[f.textAnnotName]
            },
            _initReplyChain: function() {
                if (null == this.replyChain) {
                    if (this.replyChain = [], null == this.annotJSONData[f.replyChain]) return;
                    for (var a = this.annotJSONData[f.replyChain].length, b = 0; a > b; b++) {
                        var c = new i(this.annotJSONData[f.replyChain][b]),
                            d = WebPDF.Common.createUniqueId();
                        c.setAnnotName(d), this.replyChain[b] = c, this.replyChainAnnotMap[d] = c, this.replyChain[b]._initReplyChain()
                    }
                }
            },
            getReplyAnnotByName: function(a) {
                return this.replyChainAnnotMap[a]
            },
            getReplyChain: function() {
                return this._initReplyChain(), this.replyChain
            },
            _initStateList: function() {
                if (null == this.stateList) {
                    if (this.stateList = [], null == this.annotJSONData[f.stateList]) return;
                    for (var a = this.annotJSONData[f.stateList].length, b = 0; a > b; b++) this.stateList[b] = new h(this.annotJSONData[f.stateList][b])
                }
            },
            getStateList: function() {
                return this._initStateList(), this.stateList
            },
            getGroupAnnotMap: function() {
                return this.groupAnnots
            },
            addAnnotToGroup: function(a) {
                return null == a ? !1 : (this.groupAnnots[a.getAnnotName()] = a, !0)
            },
            getHeadAnnot: function() {
                return this.headAnnot
            },
            setHeadAnnot: function(a) {
                this.headAnnot = a;
            },
            getHeadAncestorAnnot: function() {
                for (var a = this.headAnnot; a;) {
                    if (a.getType() !== WebPDF.Data.AnnotType.MarkUp) return a;
                    if (!a.getHeadAnnot()) return a;
                    a = a.getHeadAnnot()
                }
                return a
            }
        })
    };
    return e.extend(i, d), WebPDF.PDFData.PDFMarkupAnnot = i, WebPDF.PDFData.PDFMarkupAnnot
}), define("core/PDFData/LinkAnnot", ["core/PDFData/Annot", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect", "core/Interface", "core/PDFData/Action", "core/PDFData/Dest"], function(a, b, c) {
    var d = a("core/PDFData/Annot");
    a("core/Interface");
    var e = WebPDF.Interface,
        f = a("core/PDFData/Action"),
        g = WebPDF.PDFData.AnnotDataJSONFormat,
        h = function(a) {
            h.superclass.constructor.call(this, a), this.pdfDestination = null, this.pdfAction = null, $.extend(this, {
                getPDFDestination: function() {
                    return null == this.pdfDestination && (this.pdfDestination = new WebPDF.PDFData.PDFDestination(this.annotJSONData[g.destinationInfo])), this.pdfDestination
                },
                getAction: function() {
                    return null == this.annotJSONData[g.action] ? null : (null == this.pdfAction && (this.pdfAction = new f(this.annotJSONData[g.action])), this.pdfAction)
                },
                getSubType: function() {
                    return WebPDF.PDFData.AnnotType.Link
                }
            })
        };
    return e.extend(h, d), WebPDF.PDFData.PDFLinkAnnot = h, WebPDF.PDFData.PDFLinkAnnot
}), define("core/PDFData/Action", ["core/PDFData/Dest", "core/DataLevel", "core/WebPDF"], function(a, b, c) {
    var d = a("core/PDFData/Dest");
    WebPDF.PDFData.AnnotActionJSONFormat = {
        actionType: "ty",
        destination: "ds",
        URI: "uri"
    };
    var e = WebPDF.PDFData.AnnotActionJSONFormat,
        f = function(a) {
            this.actionJSONData = a, this.pdfDestination = null
        };
    return f.prototype = {
        getActionType: function() {
            return this.actionJSONData[e.actionType]
        },
        getPDFDestination: function() {
            if (null == this.pdfDestination) {
                var a = this.actionJSONData[e.destination];
                if (null == a || "undefined" == a) return null;
                this.pdfDestination = new d(a)
            }
            return this.pdfDestination
        },
        getURI: function() {
            return this.actionJSONData[e.URI]
        }
    }, WebPDF.PDFData.PDFAction = f, WebPDF.PDFData.PDFAction
}), define("core/PDFData/InkAnnot", ["core/PDFData/Annot", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect", "core/Interface"], function(a, b, c) {
    var d = (a("core/PDFData/Annot"), WebPDF.PDFData.PDFMarkupAnnot);
    a("core/Interface");
    var e = WebPDF.Interface,
        f = WebPDF.PDFData.AnnotDataJSONFormat,
        g = function(a) {
            g.superclass.constructor.call(this, a), this.inkList = null, $.extend(this, {
                _initInkList: function(a, b, c) {
                    if (c || null == this.inkList) {
                        if (null == this.annotJSONData[f.inkList]) return;
                        var d = null;
                        c && null != this.inkList && (d = this.inkList), this.inkList = [];
                        var e, g = 0;
                        if (null != d ? (g = d.length, e = this.annotJSONData[f.inkList]) : g = this.annotJSONData[f.inkList].length, c && g > 0)
                            for (var h = 0; g > h; h++) {
                                for (var i = d[h], j = [], k = i.length, l = 0; k > l; l++) {
                                    var m = i[l];
                                    m.x += a, m.y -= b, j.push(m)
                                }
                                for (var n = 0; 2 * k > n; n += 2) e[h][n] = j[n / 2].x, e[h][n + 1] = j[n / 2].y;
                                this.inkList.push(j)
                            } else
                                for (var h = 0; g > h; h++) {
                                    for (var o = this.annotJSONData[f.inkList][h], p = o.length, j = [], l = 0; p > l; l += 2) j.push(new WebPDF.PDFPoint(o[l], o[l + 1]));
                                    this.inkList.push(j)
                                }
                    }
                },
                offsetInkList: function(a, b) {
                    this._initInkList(a, b, !0)
                },
                getInkBorderWidth: function() {
                    return this.annotJSONData[f.inkBorderWidth]
                },
                getInkColor: function() {
                    return this.annotJSONData[f.inkColor]
                },
                getInkList: function() {
                    return this._initInkList(), this.inkList
                }
            })
        };
    return e.extend(g, d), WebPDF.PDFData.PDFInkAnnot = g, WebPDF.PDFData.PDFInkAnnot
}), define("core/PDFData/Signature", ["core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect"], function(a, b, c) {
    a("core/DataLevel"), a("core/Math/Point");
    var d = a("core/Math/Rect");
    WebPDF.SignatureType = {
        Normal: 0,
        Straddle: 1
    }, WebPDF.PDFData.SignatureJSONFormat = {
        image: "imgUrl",
        rect: "rc",
        index: "pageIndex",
        n: "n",
        local: "location",
        reason: "reason",
        signer: "name",
        dn: "dn",
        contactInfo: "contact",
        filter: "filter",
        subFilter: "subFilter",
        hash: "hash",
        left: "left",
        top: "top",
        right: "right",
        bottom: "bottom",
        flag: "f",
        subType: "subty",
        md: "md",
        isLayerBoder: "isStraddle",
        straddle: "straddle",
        type: "type",
        pos: "position",
        range: "range",
        percent: "percent",
        parent: "parent"
    };
    var e = WebPDF.PDFData.SignatureJSONFormat;
    return WebPDF.PDFData.Signature = function(a, b) {
        this.sigJSONData = a, this.cerType = null, this.sigType = b
    }, WebPDF.PDFData.Signature.prototype = {
        getSigJSONData: function() {
            return this.sigJSONData
        },
        getSigName: function() {
            return this.sigJSONData[e.n]
        },
        setSigName: function(a) {
            this.sigJSONData[e.n] = a
        },
        getRect: function() {
            var a = this.sigJSONData[e.rect];
            a[0] == a[2] && (a[2] += 1), a[1] == a[3] && (a[3] += 1);
            var b = new d(a[0], a[1], a[2], a[3]);
            return b
        },
        setRect: function(a) {
            var b = this.sigJSONData[e.rect];
            b[0] = a.left, b[1] = a.top, b[2] = a.right, b[3] = a.bottom
        },
        getPageIndex: function() {
            return this.sigJSONData[e.index]
        },
        setPageIndex: function(a) {
            this.sigJSONData[e.index] = a
        },
        getLocation: function() {
            return this.sigJSONData[e.local]
        },
        setLocation: function(a) {
            this.sigJSONData[e.local] = a
        },
        getReason: function() {
            return this.sigJSONData[e.reason]
        },
        setReason: function(a) {
            this.sigJSONData[e.reason] = a
        },
        getImageUrl: function() {
            return this.sigJSONData[e.image]
        },
        setImageUrl: function(a) {
            this.sigJSONData[e.image] = a
        },
        getCerType: function() {
            return this.cerType
        },
        setCerType: function(a) {
            this.cerType = a
        },
        getType: function() {
            return this.sigType
        },
        isLayerBoder: function() {
            return this.sigJSONData[e.isLayerBoder]
        },
        setType: function(a) {
            this.sigType = a
        },
        setStraddleType: function(a) {
            this.sigJSONData[e.straddle][e.type] = a
        },
        getStraddleType: function(a) {
            return this.sigJSONData[e.straddle][e.type]
        },
        setStraddlePercent: function(a) {
            this.sigJSONData[e.straddle][e.percent] = a
        },
        getStraddlePercent: function(a) {
            return this.sigJSONData[e.straddle][e.percent]
        },
        setStraddlePageRange: function(a) {
            this.sigJSONData[e.straddle][e.range] = a
        },
        getStraddlePageRange: function() {
            return this.sigJSONData[e.straddle][e.range]
        },
        setStraddlePos: function(a) {
            this.sigJSONData[e.straddle][e.pos] = a
        },
        getStraddlePos: function() {
            return this.sigJSONData[e.straddle][e.pos]
        },
        generatePosionByRect: function(a) {
            this.sigJSONData[e.left] = a.left, this.sigJSONData[e.right] = a.right, this.sigJSONData[e.bottom] = a.bottom, this.sigJSONData[e.top] = a.top
        },
        isShow: function() {
            return "134" == this.sigJSONData[e.flag] ? !1 : !0
        },
        isStraddle: function() {
            return "Straddle" == this.sigJSONData[e.subType] ? !0 : !1
        },
        getParent: function() {
            return this.sigJSONData[e.parent]
        },
        getModifyTime: function() {
            return this.sigJSONData[e.md]
        },
        getSigner: function() {
            return this.sigJSONData[e.signer]
        }
    }, WebPDF.PDFData.Signature
}), define("core/PDFData/InkSign", ["core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect"], function(a, b, c) {
    a("core/DataLevel"), a("core/Math/Point");
    var d = a("core/Math/Rect");
    WebPDF.InkSignType = {
        Normal: 0,
        Straddle: 1
    }, WebPDF.PDFData.InkSignJSONFormat = {
        rect: "rc",
        index: "pageIndex",
        n: "n",
        local: "location",
        reason: "reason",
        signer: "name",
        dn: "dn",
        contactInfo: "contact",
        filter: "filter",
        subFilter: "subFilter",
        hash: "hash",
        left: "left",
        top: "top",
        right: "right",
        bottom: "bottom",
        flag: "f",
        subType: "subty",
        md: "md",
        inkData: "inkData",
        isLayerBoder: "isStraddle"
    };
    var e = WebPDF.PDFData.InkSignJSONFormat;
    return WebPDF.PDFData.InkSign = function(a, b) {
        this.sigJSONData = a, this.sigType = b
    }, WebPDF.PDFData.InkSign.prototype = {
        getSigJSONData: function() {
            return this.sigJSONData
        },
        getSigName: function() {
            return this.sigJSONData[e.n]
        },
        setSigName: function(a) {
            this.sigJSONData[e.n] = a
        },
        getRect: function() {
            var a = this.sigJSONData[e.rect];
            a[0] == a[2] && (a[2] += 1), a[1] == a[3] && (a[3] += 1);
            var b = new d(a[0], a[1], a[2], a[3]);
            return b
        },
        setRect: function(a) {
            var b = this.sigJSONData[e.rect];
            b[0] = a.left, b[1] = a.top, b[2] = a.right, b[3] = a.bottom
        },
        getPageIndex: function() {
            return this.sigJSONData[e.index]
        },
        setPageIndex: function(a) {
            this.sigJSONData[e.index] = a
        },
        getLocation: function() {
            return this.sigJSONData[e.local]
        },
        setLocation: function(a) {
            this.sigJSONData[e.local] = a
        },
        getReason: function() {
            return this.sigJSONData[e.reason]
        },
        setReason: function(a) {
            this.sigJSONData[e.reason] = a
        },
        getInkData: function() {
            return this.sigJSONData[e.inkData]
        },
        setInkData: function(a) {
            this.sigJSONData[e.inkData] = a
        },
        getType: function() {
            return this.sigType
        },
        isLayerBoder: function() {
            return this.sigJSONData[e.isLayerBoder]
        },
        setType: function(a) {
            this.sigType = a
        },
        generatePosionByRect: function(a) {
            this.sigJSONData[e.left] = a.left, this.sigJSONData[e.right] = a.right, this.sigJSONData[e.bottom] = a.bottom, this.sigJSONData[e.top] = a.top
        },
        isShow: function() {
            return "134" == this.sigJSONData[e.flag] ? !1 : !0
        },
        getModifyTime: function() {
            return this.sigJSONData[e.md]
        },
        getSigner: function() {
            return this.sigJSONData[e.signer]
        }
    }, WebPDF.PDFData.InkSign
}), define("core/Plugins/Annot/TypewriterAnnotToolHandler", [], function(a, b, c) {
    WebPDF.PDFData.PDFAnnot, WebPDF.AnnotFactory;
    return WebPDF.Tools.TOOL_NAME_TYPERWRITER = "FreeTextTypewriter", WebPDF.Event.TypewriterAnnotToolHandler = function(a, b) {
        var c = null,
            d = a,
            e = !1,
            f = this;
        this.onInit = function(a) {
            c = a
        }, this.onDestroy = function() {}, this.getName = function() {
            return d
        }, this.onActivate = function() {
            var a = c.getMainView().getDocView(),
                b = $("#" + a.getDocViewContainerID());
            d === WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER && (WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (b.addClass("fwr-typewriter-cursor-ie"), b.css("cursor", "text")) : b.addClass("fwr-typewriter-cursor"))
        }, this.onDeactivate = function() {
            var a = c.getMainView().getDocView(),
                b = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? b.removeClass("fwr-typewriter-cursor-ie") : b.removeClass("fwr-typewriter-cursor")
        }, this.isEnabled = function() {
            var a = c.getMainView().getDocView().getPDFDoc();
            return a && a.getDocType() != WebPDF.PDFDocType.XFA ? !0 : !0
        }, this.isProcessing = function() {
            return e
        }, this.onLButtonDown = function(a) {
            var b = WebPDF.Tool.getReaderApp().getMainView().getDocView(),
                c = $("#" + b.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(c.get(0), a.target, !0)) return !1;
            for (var d = b.getVisiblePageRange(), g = null, h = null, i = d.begin; i <= d.end; i++) {
                var j = b.getPageView(i),
                    k = $("#" + j.getPageViewContainerID()).offset(),
                    l = j.getPageViewWidth(),
                    m = j.getPageViewHeight();
                if (h = new WebPDF.PDFRect(k.left, k.top, k.left + l, k.top + m), WebPDF.RectUtils.normalize(h), WebPDF.RectUtils.ptInRect(h, a.pageX, a.pageY)) {
                    g = j;
                    break
                }
            }
            return null != g && (f.createAnnot(g, a.pageX - h.left, a.pageY - h.bottom), b.setModified(!0)), e = !0, !0
        }, this.onLButtonUp = function(a) {
            return e = !1, !0
        }, this.createAnnot = function(a, b, c) {
            var e = new Date,
                f = e.valueOf() + 6e4 * e.getTimezoneOffset(),
                g = Math.floor(f / 1e3).toString(),
                h = {
                    c: "",
                    ca: 1,
                    q: 0,
                    cd: g,
                    cl: "",
                    f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                    md: g,
                    n: g,
                    subj: i18n.t("Annot.AnnotSubjTypewriter"),
                    subty: "FreeText",
                    tit: "",
                    ty: "Typewriter",
                    fs: WebPDF.PDFData.TypewriteAnnotDefaultValue.FontSize,
                    fh: WebPDF.PDFData.TypewriteAnnotDefaultValue.FontHeight,
                    lnh: WebPDF.PDFData.TypewriteAnnotDefaultValue.LineHeight,
                    fc: "#0000ff",
                    ftn: "Helvetica",
                    it: d,
                    r: 90 * a.getPDFPage().getPageRotate() + a.getDocView().getRotate(),
                    rc: null,
                    pdf: "false",
                    del: 0
                },
                i = a.getPDFPage(),
                j = i.getPageWidth(),
                k = i.getPageHeight(),
                l = new WebPDF.PDFPoint(b, c);
            l = a.devicePtToPDF(l);
            var m = null;
            m = 90 == h.r ? new WebPDF.PDFRect(l.x, l.y, l.x + WebPDF.PDFData.TypewriteAnnotDefaultValue.LineHeight, l.y - WebPDF.PDFData.TypewriteAnnotDefaultValue.NewAnnotWidth) : 180 == h.r ? new WebPDF.PDFRect(l.x - WebPDF.PDFData.TypewriteAnnotDefaultValue.NewAnnotWidth, l.y + WebPDF.PDFData.TypewriteAnnotDefaultValue.LineHeight, l.x, l.y) : 270 == h.r ? new WebPDF.PDFRect(l.x - WebPDF.PDFData.TypewriteAnnotDefaultValue.LineHeight, l.y, l.x, l.y - WebPDF.PDFData.TypewriteAnnotDefaultValue.NewAnnotWidth) : new WebPDF.PDFRect(l.x, l.y, l.x + WebPDF.PDFData.TypewriteAnnotDefaultValue.NewAnnotWidth, l.y - WebPDF.PDFData.TypewriteAnnotDefaultValue.LineHeight), m.left < 0 && WebPDF.RectUtils.offset(m, 0 - m.left, 0), m.bottom < 0 && WebPDF.RectUtils.offset(m, 0, 0 - m.bottom), m.right > j && WebPDF.RectUtils.offset(m, j - m.right, 0), m.top > k && WebPDF.RectUtils.offset(m, 0, k - m.top), h.rc = [m.left, m.top, m.right, m.bottom];
            var n = WebPDF.AnnotFactory.createAnnot(h, !1);
            i.getAnnotJsonData().push(h), i.addAnnot(n), a.setModified(!0);
            var o = WebPDF.Tool.getReaderApp().getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME).getAnnotHandlerMgr(),
                p = o.getUIManager().getPageAnnotsContainerID(a),
                q = $("#" + p),
                r = n.getAnnotName(),
                s = o.getUIManager().createAAnnotHtmlContent(a, n, r, 1, !1);
            q.append(s);
            var t = o.getAnnotHandler(WebPDF.PDFData.TypewriterAnnotType.TYPEWRITERTYPE_TYPEWRITER);
            t.onTypewriterAnnotEdit(a, n)
        }, this.onLButtonDblClk = function(a) {
            return !1
        }, this.onMouseMove = function(a) {
            return !1
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Event.TypewriterAnnotToolHandler
}), define("core/Plugins/Annot/CommentAnnotToolHandler", [], function(a, b, c) {
    WebPDF.PDFData.CPDF_Annot, WebPDF.CAnnotFactory;
    return WebPDF.Tools.TOOL_NAME_COMMENT_HIGHTLIGHT = WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT, WebPDF.Tools.TOOL_NAME_COMMENT_UNDERLINE = WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE, WebPDF.Event.CommentAnnotToolHandler = function(a, b) {
        function c(a, b) {
            var c = WebPDF.Tool.getReaderApp(),
                d = c.getMainView().getDocView();
            if (a && a >= 0) {
                var e = d.GetPageView(a);
                if (e) {
                    var f = e.getPageViewContainerID() + "_TextSelectedHighLightsSelected",
                        g = $("#" + f);
                    g.length > 0 && g.empty()
                }
            } else
                for (var h = d.getPageCount(), i = 0; h > i; i++) {
                    var e = d.getPageView(i);
                    if (e) {
                        var f = e.getPageViewContainerID() + "_TextSelectedHighLightsSelected",
                            g = $("#" + f);
                        g.length > 0 && g.empty()
                    }
                }
        }

        function d(a) {
            return a === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE ? "#00ff00" : a === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT ? "#ffff00" : "ffff00"
        }

        function e(a) {
            return a === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE ? i18n.t("Annot.AnnotSubjUnderline") : a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT ? i18n.t("Annot.AnnotSubjHighlight") : a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_SQUIGGLY ? i18n.t("Annot.AnnotSubjSquiggly") : a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_STRIKEOUT ? i18n.t("Annot.AnnotSubjStrikeout") : a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_CARET ? i18n.t("Annot.AnnotSubjCaret") : a == WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_REPLACE ? i18n.t("Annot.AnnotSubjReplace") : ""
        }

        function f(a, b, c) {
            var d = c[a];
            c[a] = c[b], c[b] = d
        }

        function g(a, b, c, d, e, g) {
            var h = c.TransFormRect(b.left, b.top, b.right, b.bottom),
                i = d.TransFormRect(h[0], h[1], h[2], h[3]);
            switch (g) {
                case WebPDF.PDFData.Text.WritingMode.TEXT_WRITING_MODE_LRTB:
                    i[2] < i[0] && f(2, 0, i), i[1] > i[3] && f(1, 3, i);
                    break;
                case WebPDF.PDFData.Text.WritingMode.TEXT_WRITING_MODE_RLTB:
                    i[0] > i[2] && f(2, 0, i), i[1] > i[3] && f(1, 3, i);
                    break;
                case WebPDF.PDFData.Text.WritingMode.TEXT_WRITING_MODE_LRBT:
                    i[2] < i[0] && f(2, 0, i), i[1] < i[3] && f(1, 3, i);
                    break;
                case WebPDF.PDFData.Text.WritingMode.TEXT_WRITING_MODE_RLBT:
                    i[0] > i[2] && f(2, 0, i), i[1] < i[3] && f(1, 3, i)
            }
            var j = e.TransFormPoint(i[0], i[3]),
                k = e.TransFormPoint(i[2], i[3]),
                l = e.TransFormPoint(i[2], i[1]),
                m = e.TransFormPoint(i[0], i[1]);
            a.push(j[0], m[1], k[0], l[1], m[0], j[1], l[0], k[1])
        }

        function h(a, b, c, f) {
            if (b.length < 0) return !1;
            var h = new Date,
                k = h.valueOf() + 6e4 * h.getTimezoneOffset(),
                l = Math.floor(k / 1e3).toString(),
                m = {
                    c: "",
                    ca: n,
                    cd: l,
                    cl: d(j),
                    f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                    md: l,
                    n: l,
                    pop: null,
                    subj: e(j),
                    subty: j,
                    tit: i.getUserName(),
                    ty: "Markup",
                    Quad: [],
                    rc: null,
                    pdf: "false",
                    del: 0
                };
            WebPDF.RectUtils.normalize(b[0]);
            var q = b[0],
                r = a.getPageMatrix(),
                s = new WebPDF.PDFMatrix;
            s.SetReverse(r);
            var t = new WebPDF.PDFMatrix;
            t.SetReverse(c[0]), g(m.Quad, q, s, t, c[0], f[0]);
            for (var u = 1; u < b.length; u++) {
                var v = b[u];
                t = new WebPDF.PDFMatrix, t.SetReverse(c[u]), g(m.Quad, v, s, t, c[u], f[u]), WebPDF.RectUtils.normalize(v), WebPDF.RectUtils.union(q, v)
            }
            m.rc = [q.left, q.top, q.right, q.bottom];
            var w = new WebPDF.PDFRect(0, 0, 0, 0);
            w.top = q.top;
            var x = WebPDF.Tool.getReaderApp().getMainView().getDocView().getPageView(a.getPageIndex()),
                y = WebPDF.Tool.getReaderApp().getMainView().getDocView().getPageViewRender().getPixelsPerPoint(),
                z = x.getDocView().getScale();
            w.left = (x.getPageViewWidth() - o * y) / (z * y), w.right = w.left + o, w.bottom = w.top - p, m.pop = {
                f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                md: l,
                n: l + "_popup",
                op: 0,
                rc: [w.left, w.top, w.right, w.bottom]
            };
            var A = WebPDF.AnnotFactory.createAnnot(m, !1);
            a.getAnnotJsonData().push(m), a.addAnnot(A), x.setModified(!0);
            var B = WebPDF.Tool.getReaderApp().getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME).getAnnotHandlerMgr(),
                C = B.getUIManager(),
                D = C.getPageAnnotsContainerID(x),
                E = $("#" + D),
                F = B.getUIManager().createAAnnotHtmlContent(x, A, A.getAnnotName(), 1, !1);
            E.append(F)
        }
        var i = null,
            j = a,
            k = !1,
            l = null,
            m = this,
            n = 1,
            o = WebPDF.PDFData.MKA_POPUPWIDTH,
            p = WebPDF.PDFData.MKA_POPUPHEIGHT;
        this.onInit = function(a) {
            if (i = a, WebPDF.TextSelect && WebPDF.TextSelect.CReader_TextSelectTool) {
                var b = i.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
                b && (l = b.getTextSelectTool())
            }
        }, this.destroy = function() {}, this.getName = function() {
            return j
        }, this.onActivate = function() {
            var a = WebPDF.Tool.getReaderApp(),
                b = a.getMainView().getDocView(),
                c = $("#" + b.getDocViewContainerID());
            j === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT ? WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (c.addClass("fwr-highlight-cursor-ie"), c.css("cursor", "text")) : c.addClass("fwr-highlight-cursor") : j === WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE && (WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (c.addClass("fwr-underline-cursor-ie"), c.css("cursor", "text")) : c.addClass("fwr-underline-cursor"))
        }, this.onDeactivate = function() {
            var a = i.getMainView().getDocView(),
                b = $("#" + a.getDocViewContainerID());
            WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_HIGHLIGHT === j ? WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? b.removeClass("fwr-highlight-cursor-ie") : b.removeClass("fwr-highlight-cursor") : WebPDF.PDFData.CommentAnnotType.COMMENTTYPE_UNDERLINE === j && (WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? b.removeClass("fwr-underline-cursor-ie") : b.removeClass("fwr-underline-cursor"))
        }, this.isEnabled = function() {
            var a = i.GetMainView().GetDocView().GetPDFDoc();
            return a && a.GetDocType() != WebPDF.PDFData.DocType.XFA ? !0 : !0
        }, this.isProcessing = function() {
            return k
        }, this.onLButtonDown = function(a) {
            var b = new RegExp("(^|\\s)fwr-annot(\\s|$)"),
                c = b.test(a.target.className),
                d = null,
                e = WebPDF.Tool.getReaderApp(),
                f = e.getMainView().getDocView();
            if (c) {
                var g = parseInt(a.target.getAttribute("page-index")),
                    h = a.target.getAttribute("annot-name");
                d = f.getPageView(g);
                var i = d.getPDFPage(),
                    m = i.getAnnotByName(h);
                if (m && "Markup" === m.getType() && m.getSubType() === j) return !1
            }
            var n = $("#" + f.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(n.get(0), a.target, !0)) return !1;
            if (null == d) {
                var o = new WebPDF.PDFPoint(0, 0);
                if (d = WebPDF.TextSelect.CReader_TextSelectTool.getPageViewInfoByMouseEvent(e, a, o, !0, !1), null == d) return !1
            }
            var p = d.getFocusAnnot();
            return p && d.setFocusAnnot(null), d.getDocView().clearAllSelection(), l.onLButtonDown(a), k = !0, !0
        }, this.onLButtonUp = function(a) {
            return c(), k && l.onLButtonUp(a) && (m.createAnnot(), i.getMainView().getDocView().setModified(!0)), l.clearSelection(), k = !1, this.onActivate(), !0
        }, this.createAnnot = function() {
            var a = 0,
                b = 0,
                c = l.getSelectedPageRange(a, b);
            if (a = c.start, b = c.end, 0 > b || 0 > a) return !1;
            for (var d = Math.abs(b - a) + 1, e = b - a >= 0 ? 1 : -1, f = a, g = 0; d > g; f += e, g++) {
                var j = l.getTextPage(f);
                if (!j) return;
                var k = [],
                    m = [],
                    n = [];
                if (j.pageSelectInfo.getSelectPDFRectAndMatrix(k, m, n), k.length > 0) {
                    var o = i.getMainView().getDocView().getPageView(f).getPDFPage();
                    h(o, k, m, n)
                }
            }
            return l.clearSelection(), !0
        }, this.onLButtonDblClk = function(a) {
            var b = new RegExp("(^|\\s)fwr-annot(\\s|$)"),
                c = b.test(a.target.className),
                d = null,
                e = i.getMainView().getDocView();
            if (c) {
                var f = parseInt(a.target.getAttribute("page-index")),
                    g = a.target.getAttribute("annot-name");
                d = e.getPageView(f);
                var h = d.getPDFPage(),
                    k = h.getAnnotByName(g);
                if (k && "Markup" === k.getType() && k.getSubType() === j) return !1
            }
            var n = $("#" + e.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(n.get(0), a.target, !0)) return !1;
            if (null == d) {
                var o = new WebPDF.PDFPoint(0, 0);
                d = WebPDF.TextSelect.CReader_TextSelectTool.getPageViewInfoByMouseEvent(i, a, o, !0, !1)
            }
            if (null == d) return !1;
            var p = d.getFocusAnnot();
            return p && d.setFocusAnnot(null), e.clearAllSelection(), l.onLButtonDblClk(a, function() {
                m.createAnnot(), i.getMainView().getDocView().setModified(!0)
            }), !0
        }, this.onMouseMove = function(a) {
            return l.onMouseMove(a), !0
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Event.CommentAnnotToolHandler
}), define("core/Plugins/Annot/DrawingAnnotToolHandler", ["core/Plugins/Annot/DrawingTools"], function(a, b, c) {
    a("core/Plugins/Annot/DrawingTools");
    WebPDF.PDFData.CPDF_Annot, WebPDF.CAnnotFactory;
    return WebPDF.Tools.TOOL_NAME_INKANNOT = "InkAnnot Tool", WebPDF.Event.InkAnnotToolHandler = function() {
        var a = null,
            b = (WebPDF.Tool.getReaderApp().getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME), !1),
            c = null;
        this.onInit = function(b) {
            a = b
        }, this.destroy = function() {}, this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_INKANNOT
        }, this.onActivate = function() {
            b = !0;
            var a = WebPDF.Tool.getReaderApp(),
                c = a.getMainView().getDocView(),
                d = $("#" + c.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? d.addClass("fwr-pencil-cursor-ie") : d.addClass("fwr-pencil-cursor")
        }, this.onDeactivate = function() {
            b = !1;
            var c = a.getMainView().getDocView(),
                d = $("#" + c.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? d.removeClass("fwr-pencil-cursor-ie") : d.removeClass("fwr-pencil-cursor")
        }, this.isEnabled = function() {
            var b = a.getMainView().getDocView().getPDFDoc();
            return b && b.getDocType() != WebPDF.PDFData.DocType.XFA ? !0 : !0
        }, this.isProcessing = function() {
            return b
        }, this.onLButtonDown = function(b) {
            var d = null,
                e = WebPDF.Tool.getReaderApp().getMainView().getDocView(),
                f = $("#" + e.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(f.get(0), b.target, !0)) return !1;
            for (var g = e.getVisiblePageRange(), d = null, h = null, i = g.begin; i <= g.end; i++) {
                var j = e.getPageView(i),
                    k = $("#" + j.getPageViewContainerID()).offset(),
                    l = j.getPageViewWidth(),
                    m = j.getPageViewHeight();
                if (h = new WebPDF.PDFRect(k.left, k.top, k.left + l, k.top + m), WebPDF.RectUtils.normalize(h), WebPDF.RectUtils.ptInRect(h, b.pageX, b.pageY)) {
                    d = j;
                    break
                }
            }
            if (null != d) {
                if (!d.isPageLoaded()) return;
                if (WebPDF.Common.preventDefaults(b, !0), null == c) {
                    var n = WebPDF.Tool.getReaderApp().getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME),
                        o = n.getAnnotHandlerMgr();
                    c = new WebPDF.DrawingTools.Pencil(a, n, o.getCavansElement(), 3, "rgba(255,0,0,1.0)", "#ff0000")
                }
                return c.onMouseDown(b, d)
            }
            return !1
        }, this.onLButtonUp = function(a) {
            return null != c ? c.onMouseUp(a) : !1
        }, this.createAnnot = function(a, b, c) {}, this.onLButtonDblClk = function(a) {
            return !1
        }, this.onMouseMove = function(a) {
            return null != c ? c.onMouseMove(a) : !1
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return null != c ? c.onMouseUp(a) : !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Event.InkAnnotToolHandler
}), define("core/Plugins/Annot/DrawingTools", [], function(a, b, c) {
    WebPDF.DrawingTools = {};
    WebPDF.PDFPoint, WebPDF.PDFData.PDFAnnot, WebPDF.CAnnotFactory;
    WebPDF.DrawingTools.DA_BEZIER = .5522847498308, WebPDF.DrawingTools.Pencil = function(a, b, c, d, e, f) {
        function g(a, b) {
            var c = new WebPDF.PDFPoint(a.x, a.y),
                d = $(i).offset(),
                e = $("#" + s.getPageViewContainerID()).offset(),
                f = e.left - d.left;
            return 270 == b ? (c.x = s.getPageViewHeight() - a.y, c.y = a.x) : 90 == b ? (c.x = a.y, c.y = s.getPageViewWidth() + 2 * f - a.x) : 180 == b && (c.x = s.getPageViewWidth() + 2 * f - a.x, c.y = s.getPageViewHeight() - a.y), c
        }
        var h = a,
            i = c,
            j = b,
            k = d,
            l = e,
            m = f,
            n = [],
            o = 0,
            p = 0,
            q = 0,
            r = 0,
            s = null,
            t = !1,
            u = this,
            v = 1,
            w = 180,
            x = 120,
            y = i.getContext("2d");
        this.onMouseDown = function(a, b) {
            j.getAnnotHandlerMgr().getUIManager().resetCanvens(b), s = b, y.strokeStyle = l, y.lineWidth = k * b.getScale();
            var c = $(i).offset(),
                d = a.pageX - c.left,
                e = a.pageY - c.top,
                f = g(new WebPDF.PDFPoint(d, e), b.getDocView().getRotate());
            y.beginPath(), y.moveTo(f.x, f.y), o = d, p = d, q = e, r = e;
            var h = new WebPDF.PDFPoint(d, e);
            return n = [], n.push(h), t = !0, !0
        }, this.onMouseMove = function(a) {
            if (t) {
                var b = a.pageX,
                    c = a.pageY,
                    d = $("#" + s.getPageViewContainerID()).offset(),
                    e = $(i).offset(),
                    f = b - d.left,
                    h = c - d.top;
                0 > f && (b = d.left), f > s.getPageViewWidth() && (b = d.left + s.getPageViewWidth()), 0 > h && (c = d.top), h > s.getPageViewHeight() && (c = d.top + s.getPageViewHeight());
                var j = b - e.left,
                    k = c - e.top,
                    l = g(new WebPDF.PDFPoint(j, k), s.getDocView().getRotate());
                y.lineTo(l.x, l.y), y.stroke(), y.moveTo(l.x, l.y), o > j && (o = j), j > p && (p = j), q > k && (q = k), k > r && (r = k);
                var m = new WebPDF.PDFPoint(j, k);
                return n.push(m), !0
            }
            return !0
        }, this.CreateAnnot = function() {
            var a = n.length;
            if (!(0 >= a)) {
                var b = $(i).offset(),
                    c = $("#" + s.getPageViewContainerID()).offset(),
                    d = [],
                    e = [],
                    f = 1.5,
                    g = 1.5;
                if (1 == a) {
                    var j = n[0];
                    n = [];
                    for (var l = s.getDocView(), t = l.getPageViewRender().getPixelsPerPoint() * l.getScale(), u = 1; k >= u; u++) {
                        var y = (u - WebPDF.DrawingTools.DA_BEZIER) * t;
                        o = j.x - y < o ? j.x - y : o, o = j.x + y < o ? j.x + y : o, p = j.x - y > p ? j.x - y : p, p = j.x + y > p ? j.x + y : p, q = j.y - y < q ? j.y - y : q, q = j.y + y < q ? j.y + y : q, r = j.y - y > r ? j.y - y : r, r = j.y + y > r ? j.y + y : r, n.push(new WebPDF.PDFPoint(j.x - y, j.y)), n.push(new WebPDF.PDFPoint(j.x - y, j.y + y)), n.push(new WebPDF.PDFPoint(j.x, j.y + y)), n.push(new WebPDF.PDFPoint(j.x + y, j.y + y)), n.push(new WebPDF.PDFPoint(j.x + y, j.y)), n.push(new WebPDF.PDFPoint(j.x + y, j.y - y)), n.push(new WebPDF.PDFPoint(j.x, j.y - y)), n.push(new WebPDF.PDFPoint(j.x - y, j.y - y))
                    }
                    a = n.length
                }
                for (var z = 0; a > z; z++) {
                    var A = n[z];
                    A.x -= c.left - b.left, A.y -= c.top - b.top;
                    var B = s.devicePtToPDF(A);
                    e.push(B.x), e.push(B.y)
                }
                d.push(e);
                var C = o - (c.left - b.left),
                    D = p - o,
                    E = q - (c.top - b.top),
                    F = r - q,
                    G = new Date,
                    H = G.valueOf() + 6e4 * G.getTimezoneOffset(),
                    I = Math.floor(H / 1e3).toString(),
                    J = {
                        c: "",
                        ca: v,
                        cd: I,
                        cl: m,
                        f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                        md: I,
                        n: I,
                        pop: null,
                        subj: i18n.t("Annot.AnnotSubjPencil"),
                        subty: "Ink",
                        tit: h.getUserName(),
                        ty: "Markup",
                        ikl: d,
                        ikc: m,
                        ikw: k,
                        rc: null,
                        pdf: "false",
                        del: 0
                    },
                    K = s.getPDFPage(),
                    L = (K.getPageWidth(), K.getPageHeight(), new WebPDF.PDFRect(C, E, C + D, E + F)),
                    M = s.deviceRectToPDF(L, !0);
                J.rc = [M.left - f, M.top + g, M.right + f, M.bottom - g];
                var N = new WebPDF.PDFRect(0, 0, 0, 0);
                N.top = M.top;
                var O = s.getDocView().getPageViewRender().getPixelsPerPoint(),
                    P = s.getDocView().getScale();
                N.left = (s.getPageViewWidth() - w * O) / (P * O), N.right = N.left + w, N.bottom = N.top - x, N.bottom < 0 && WebPDF.RectUtils.offset(N, 0, -N.bottom), J.pop = {
                    f: WebPDF.PDFData.AnnotFlag.ANNOTFLAG_PRINT,
                    md: I,
                    n: I + "_popup",
                    op: 0,
                    rc: [N.left, N.top, N.right, N.bottom]
                };
                var Q = WebPDF.AnnotFactory.createAnnot(J, !1);
                K.getAnnotJsonData().push(J), K.addAnnot(Q), s.setModified(!0);
                var R = WebPDF.Tool.getReaderApp().getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME).getAnnotHandlerMgr(),
                    S = R.getUIManager().getPageAnnotsContainerID(s),
                    T = $("#" + S),
                    U = Q.getAnnotName(),
                    V = R.getUIManager().createAAnnotHtmlContent(s, Q, U, 1, !1);
                T.append(V), R.showAInkAnnot(s, Q, !1), s.getDocView().setModified(!0)
            }
        }, this.onMouseUp = function(a) {
            return t && (u.CreateAnnot(), y.closePath(), y.clearRect(0, 0, i.width, i.height)), t = !1, !0
        }
    }
}), define("core/Plugins/Print/PrintConfig", [], function(a, b, c) {
    var d = WebPDF.Config;
    WebPDF.printPlugin = function(a) {
        function b(a) {
            var b = 1 / q,
                c = a.getDocView().getWatermarkHtmlContent(a, b);
            return "<div class='watermark'>" + c + "</div>"
        }

        function c(a) {
            var b = 1 / (q * a.getScale()),
                c = k.getPluginByName(WebPDF.InkSignPluginName);
            if (!c) return "";
            var d = a.getPDFPage().getInkSignMap();
            if (!d || 0 == d.length) return "";
            var f = c.getSigHandleMgr(),
                g = f.getInkSignsHtmlContent(a, b);
            if (!g) return "";
            var h = $(g),
                i = h.find(".vml"),
                j = f.isPageInkSignCreated(a.getPageIndex());
            return e(a, d, f, i, b, j), g = h.html(), "<div class='inksign' >" + g + "</div>"
        }

        function e(a, b, c, d, e, f) {
            for (var g in b) {
                var h = b[g];
                if (null != h) {
                    var i = c.getInkSignCanvasDivID(a, h.getSigName());
                    d.each(function() {
                        if (jQuery(this).attr("id") == i) {
                            var b = "";
                            if (!r)
                                if (b = this.outerHTML, f) {
                                    if (!document.getElementById(i)) return void console.warn("print inksign canvas id:" + i + " fail");
                                    b = b.replace("<canvas", "<img src=" + document.getElementById(i).toDataURL()).replace("</canvas>", "</img>")
                                } else c.drawInkSign(a, h, this, e), b = b.replace("<canvas", "<img src=" + this.toDataURL()).replace("</canvas>", "</img>");
                            $(this).parent().html(b)
                        }
                    })
                }
            }
        }

        function f(a, b, c, d, e, f) {
            for (var g in b) {
                var h = b[g];
                if (null != h && "Markup" == h.getType() && "Ink" == h.getSubType()) {
                    var i = c.getAnnotCavansDivID(a, h.getAnnotName());
                    d.each(function() {
                        if (jQuery(this).attr("id") == i) {
                            var b = "";
                            if (!r)
                                if (b = this.outerHTML, f) {
                                    if (!document.getElementById(i)) return void console.warn("print annot canvas id:" + i + " fail");
                                    b = b.replace("<canvas", "<img src=" + document.getElementById(i).toDataURL()).replace("</canvas>", "</img>")
                                } else c.showAInkAnnot(a, h, !1, this, e), b = b.replace("<canvas", "<img src=" + this.toDataURL()).replace("</canvas>", "</img>");
                            $(this).parent().html(b)
                        }
                    })
                }
            }
        }

        function g(a) {
            var b = 1 / (q * a.getScale()),
                c = "",
                d = k.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME);
            if (!d) return c;
            var e = d.getAnnotHandlerMgr();
            c = e.getAnnotsHtmlContent(a, b);
            var g = $(c),
                h = a.getPDFPage().getAnnotsMap(),
                i = g.find(".vml"),
                j = e.isPageAnnotCreated(a.getPageIndex());
            return f(a, h, e, i, b, j), c = g.html(), "<div class='annot' >" + c + "</div>"
        }

        function h(a) {
            var b = 1 / q,
                c = k.getPluginByName(WebPDF.FormPluginName);
            if (!c) return "";
            var d = c.getFormHtmlContent(a, b);
            return "<div class='form' >" + d + "</div>"
        }
        var i, j, k = a,
            l = this,
            m = !1,
            n = null,
            o = null,
            p = null,
            q = null,
            r = !1,
            s = 0,
            t = 0,
            u = 0,
            v = "",
            w = !1,
            x = "fwrprintdlg",
            y = "fwrPrintProgressDlg",
            z = "",
            A = "",
            B = 4.2,
            C = null,
            D = "",
            E = 21.5 / 2.54,
            F = 11,
            G = 96 * Number(E) * .9,
            H = 96 * Number(F) * .9,
            I = "",
            J = "",
            K = !1,
            L = "",
            M = !1,
            N = !1,
            O = !1;
        WebPDF.PrintPluginName = "Print Plugin", this.getName = function() {
            return WebPDF.PrintPluginName
        }, this.onRegister = function() {}, this.init = function() {
            l._browser()
        }, this.unload = function() {}, this.getReaderApp = function() {
            return k
        }, this.onBeforeUnload = function() {
            return m ? (m = !1, jQuery("#continueButtonProgress").attr("style", ""), i18n.t("Print.BrowserClosePrintingPrompt")) : void 0
        }, this._browser = function() {
            WebPDF.Environment.ie && (WebPDF.Environment.ie8 || WebPDF.Environment.ie8Compact || WebPDF.Environment.ie7Compact || WebPDF.Environment.ie6Compact) && (r = !0), WebPDF.Environment.safari && Number(WebPDF.Environment.version) > Number(B) && (C = !0)
        }, this.showPrintDlg = function() {
            var a = k.getMainView().getDocView(),
                b = a.getPageCount(),
                c = "fwr-print-title",
                e = null,
                f = "printButton",
                g = null,
                h = "cancelButton",
                j = null,
                n = "all-radio",
                o = null,
                p = "current-page-radio",
                q = null,
                r = "page-from-radio",
                y = null,
                B = "page-from-start",
                E = null,
                F = "page-from-end",
                G = null,
                H = "pages-texts",
                L = null,
                M = "pages-radio",
                N = null,
                P = "printCommentsCheck";
            if (!K) {
                for (var Q = "", R = "", S = 1; b >= S; S++) Q = 1 == S ? Q + "<option selected='selected'value=" + S + ">" + S + "</option>" : Q + "<option value=" + S + ">" + S + "</option>";
                for (var S = 1; b >= S; S++) R = S == b ? R + "<option selected='selected'value=" + S + ">" + S + "</option>" : R + "<option value=" + S + ">" + S + "</option>";
                J = "<div id='" + x + "' class='fwr-print-dlg fwr-modal fwr-hide fwr-fade fwr-in ' style='display: none; z-index: 1004; outline: 0px; position: absolute; height: auto; width: 350px;'><div class='fwr-modal-header' ><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + c + "'> " + i18n.t("Print.PrintSettingsDlgTitle") + "</h4></div><div id='printDialog'  class='fwr-modal-body fwr-dialog-padding ui-dialog-content ui-widget-content'><div class='title-line top-line'><h5>" + i18n.t("Print.PrintRangeLabel") + "</h5></div><div class='content-line'><input style='margin-left:50px;margin-right: 7px;' checked='checked' id='" + n + "' value='all' name='check-print-model' type='radio'>" + i18n.t("Print.PrintDlgItemAll") + "</div><div class='content-line'><input id='" + p + "' style='margin-left:50px;margin-right: 7px;' value='currentpage' name='check-print-model' type='radio'>" + i18n.t("Print.PrintDlgItemCurPage") + "</div><div class='content-line'><input style='margin-left:50px;margin-right: 7px;' id='" + r + "' value='page_from' name='check-print-model' type='radio'><span style='display: inline-block;width:60px'>" + i18n.t("Print.PrintDlgItemPageFrom") + "</span><select style='width:106px;margin-left:10px;height:26px' disabled='disabled' id='" + B + "'>" + Q + "</select><span style='margin-left:8px;margin-right:8px;'>" + i18n.t("Print.PrintDlgItemPageTo") + "</span><select style='width:106px;height:26px' disabled='disabled' id='" + F + "'>" + R + "</select></div><div class='content-line'><input style='margin-left:50px;margin-right: 7px;' id='" + M + "' value='pages' name='check-print-model' type='radio'><span style='display: inline-block;width:60px'>" + i18n.t("Print.PrintDlgItemPages") + "</span><input type='text' style='width:240px;margin-right:8px;margin-left:10px;background: white;height: 26px;border: 1px #C0C0C0 solid;' id='" + H + "' disabled='disabled' value='1-1'><span>1,2,5-8</span></div><div class='content-line'><lable style=\"margin-top:40px;margin-left:140px;\" >" + i18n.t("Print.MaxPrintPageMessage") + "</lable></div><div class='title-line'><h5>" + i18n.t("Print.PrintCommentsLabel") + "</h5></div><div class='content-line'><input id='" + P + "'style='margin-left:50px;margin-right: 7px;' value='printcomments' type='checkbox' name='check-print-comments'>" + i18n.t("Print.PrintComments") + "</div><div id='lablePrintInfo' style='margin-top:10px;margin-left:25px;color:red;text-align:left;'></div></div><div class='fwr-modal-footer'><a href='#' id='" + f + "' class='btn btn-success'  data-i18n='[value]Print.Next'>" + i18n.t("Print.Next") + "</a><a href='#' id='" + h + "' class='btn' webpdf-data-dismiss='modal' data-i18n='[value]Print.Cancel'>" + i18n.t("Print.Cancel") + "</a></div>",
                    $("#" + k.getMainFrameId()).append(J), i = $("#" + x), K = !0
            }
            if (!i) return !1;
            if ((WebPDF.Environment.mobile || WebPDF.Environment.iOS) && !C) return l.showErrorDlg(), jQuery("#browserPrintInfo").html('<lable style="font-size: 13px">' + i18n.t("Print.PrintBrowserSupport") + "</lable>"), !1;
            if (!K) return !1;
            e = $("#" + f), g = $("#" + h), j = $("#" + n), o = $("#" + p), q = $("#" + r), y = $("#" + B), E = $("#" + F), G = $("#" + H), L = $("#" + M), N = $("#" + P), i.i18n(), g.off("click").on("click", function() {
                l.closePrintDlg()
            });
            var T = $("#lablePrintInfo");
            return T.html(""), T.empty(), e.off("click").on("click", function() {
                m = !0, s = 0, t = 0, u = 0, z = "<div id='" + x + "'>", D = "", I = new Array;
                var c = jQuery("input[name='check-print-model']:checked").val(),
                    e = !0;
                switch (c) {
                    case "all":
                        s = 1, t = b, e = !0, w = !1, v = "";
                        break;
                    case "currentpage":
                        s = a.getCurPageIndex() + 1, t = s, e = !0, w = !1, v = "";
                        break;
                    case "page_from":
                        s = jQuery("#page-from-start").val(), t = jQuery("#page-from-end").val(), e = !0, w = !1, v = "";
                        break;
                    case "pages":
                        var f = /^[1-9][0-9]*([,-][1-9][0-9]*)*$/,
                            g = G.val();
                        if (f.test(g)) {
                            w = !0, s = 1, e = !0, v = new Array;
                            for (var h = g.split(","), i = h.length, j = 0; i > j; j++) {
                                var k = h[j],
                                    n = k.split("-");
                                if (1 == n.length) {
                                    if (!(Number(n) <= b)) return T.html("<lable>" + i18n.t("Print.PrintPageNumberError") + "</lable>"), e = !1, w = !1, void(v = "");
                                    v.push(Number(n))
                                } else if (2 == n.length) {
                                    var o = Number(n[0]),
                                        p = Number(n[1]);
                                    if (o > p || p > b) return T.html("<lable>" + i18n.t("Print.PrintPageOutError") + "</lable>"), e = !1, w = !1, void(v = "");
                                    for (var q = o; p >= q; q++) v.push(q)
                                }
                            }
                        } else T.html("<lable>" + i18n.t("Print.PrintPageNumberError") + "</lable>"), e = !1, w = !1, v = ""
                }
                if (e) {
                    if (w ? (A = v.length, t = A) : A = t - s + 1, A > 100) return void $("#lablePrintInfo").html(i18n.t("Print.OutOfRangeMessage"));
                    if (l.closePrintDlg(), l.showProgressDlg(A), 0 == t) return void(w = !1);
                    l.requestImage(s - 1, a, d.defaults.requestRetryCount)
                }
            }), j.click(function() {
                y.attr("disabled", "disabled"), E.attr("disabled", "disabled"), G.attr("disabled", "disabled"), T.html(""), T.empty()
            }), o.click(function() {
                y.attr("disabled", "disabled"), E.attr("disabled", "disabled"), G.attr("disabled", "disabled"), T.html(""), T.empty()
            }), q.click(function() {
                y.removeAttr("disabled"), E.removeAttr("disabled"), G.attr("disabled", "disabled"), T.html(""), T.empty()
            }), L.click(function() {
                y.attr("disabled", "disabled"), E.attr("disabled", "disabled"), G.removeAttr("disabled"), T.html(""), T.empty()
            }), y.change(function() {
                var a = y.val(),
                    c = E.val();
                E.html(" "), E.empty();
                for (var d = "", e = a; b >= e; e++) d = e == c ? d + "<option selected='selected'value=" + e + ">" + e + "</option>" : d + "<option value=" + e + ">" + e + "</option>";
                E.html(d)
            }), N.click(function() {
                O = N.is(":checked")
            }), i.webPDFModal({
                keyboard: !1,
                backdrop: "static",
                manager: "#" + k.getMainFrameId()
            }), !0
        }, this.requestImage = function(a, b, c) {
            if (a >= t) {
                z += "</div>";
                var d = {};
                return d = WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 || WebPDF.Environment.edge ? {
                    mode: "popup",
                    popClose: "true",
                    currentStep: s,
                    nImageToLoad: t,
                    arrayUrl: I,
                    printPageSizeWidth: G,
                    printPageSizeHeghit: H,
                    baseUrl: k.getBaseUrl()
                } : {
                    currentStep: s,
                    nImageToLoad: t,
                    arrayUrl: I,
                    printPageSizeWidth: G,
                    printPageSizeHeghit: H,
                    baseUrl: k.getBaseUrl()
                }, void jQuery(z).printArea(d)
            }
            if (m) {
                var e = new WebPDF.ImageEngine.ImagePageViewRender;
                e.setReaderApp(k), w && (a = v[a] - 1);
                var f = b.getPageView(a),
                    g = e.getPageImgUrl(a);
                l.preLoadingImg(g, f, c)
            }
        }, this.showProgressDlg = function(a) {
            var b, c, d, e, f = "fwr-print-title";
            M || (L = "<div id='" + y + "'class='fwr-print-dlg fwr-modal fwr-hide fwr-fade fwr-in ' style='display: block; z-index: 1006; outline: 0px; height: auto; width: 350px;'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + f + "'> " + i18n.t("Print.PrintPrintProgressDlgTitle") + "</h4></div><div id='progressDialog'  class='fwr-modal-body fwr-dialog-padding'><p>" + i18n.t("Print.PrintPrintProgressDlgTitle") + "</p><div id='progress_number' align='left' style='margin-top:10px;'><font  size='3' >1/" + a + "</font></div><div id='fwr-print-progress' style='width:100%;margin-top:10px;' class = 'fwr-print-progress'><div id='prpos'></div></div><div id='progressDialogLableInfo' style='color:red;margin-top:10px;height:18px;'></div></div><div class='fwr-modal-footer'><a style='display:none' href='#' id=' continueButtonProgress ' class='btn' webpdf-data-dismiss='modal' data-i18n='CommonDialog.DefaultContinueTile'>" + i18n.t("CommonDialog.DefaultContinueTile") + "</a><a href='#' id='cancelButtonProgress' class='btn' webpdf-data-dismiss='modal' data-i18n='CommonDialog.DefaultCancelBtnTitle'>" + i18n.t("CommonDialog.DefaultCancelBtnTitle") + "</a></div>", $("#" + k.getMainFrameId()).append(L), j = $("#" + y), M = !0), j && (b = $("#progress_number"), b && b.html('<font " size="3" >1/' + A + "</font>"), c = $("#cancelButtonProgress"), c.click(function() {
                m = !1, l.closeProgressDlg(), l.updateProgressbar(0, 0)
            }), e = $("#progressDialogLableInfo"), e.empty(), d = $("#continueButtonProgress"), d.click(function() {
                e.html(""), e.empty(), m = !0, e.css("display", "none");
                var a = k.getMainView().getDocView();
                l.requestImage(u, a)
            }), j.webPDFModal({
                keyboard: !1,
                backdrop: "static",
                manager: "#" + k.getMainFrameId()
            }))
        }, this.showErrorDlg = function() {
            if (!N) {
                var a = "printErrorDialog",
                    b = "printErrorTitle",
                    c = "<div id='" + a + "' class='fwr-print-dlg fwr-modal fwr-hide fwr-fade fwr-in' style='HEIGHT: auto; WIDTH: auto; PADDING-LEFT: 8px; DISPLAY: block; PADDING-RIGHT: 8px'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 id='" + b + "'> " + i18n.t("Print.PrintErrorDlgTitle") + "</h4></div><table style='BORDER-COLLAPSE: collapse; TABLE-LAYOUT: fixed; BORDER-SPACING: 0'><tbody><tr><td style='WIDTH: 36px;margin-top:10px;height:18px;'><div class='fwr-print-error-icon' id='fxalert_icon'></div></td><td><p id='browserPrintInfo'></P></td></tr></tbody></table></div>";
                $("#" + k.getMainFrameId()).append(c), n = $("#" + a), N = !0
            }
            n && l.openErrordlg()
        }, this.callback_fun = function(a, e, f) {
            var i = a.getDocView(),
                j = !1,
                k = e == WebPDF.ImageEngine.GetImageErrorCode.ERROR_CREATE_IMG_FAILED,
                m = e == WebPDF.ImageEngine.GetImageErrorCode.ERROR_PAGE_DISPLAY_LIMIT,
                n = e == WebPDF.ImageEngine.GetImageErrorCode.ERROR_INPROGRESS;
            if (k || m) j = !0;
            else if (n) {
                var o = -1;
                return o = w ? u : a.getPageIndex(), void setTimeout(function() {
                    l.requestImage(o, i, f - 1)
                }, 2e3)
            }
            if (!j) {
                z += b(a), z += c(a), O && (z += g(a)), z += h(a), z += "</div>", z += "</div>", l.updateProgress();
                var o = -1;
                o = w ? u : a.getPageIndex() + 1, l.requestImage(o, i, d.defaults.requestRetryCount)
            }
        }, this.preLoadingImg = function(a, b, c) {
            $.ajax({
                url: a,
                ifModified: !0,
                success: function(d, e, f) {
                    var g = f.getResponseHeader("content-type") || "";
                    if (g.indexOf("application/json") > -1) {
                        var h = d.status.toString();
                        h != WebPDF.ImageEngine.GetImageErrorCode.ERROR_PAGE_DISPLAY_LIMIT.toString() && h != WebPDF.ImageEngine.GetImageErrorCode.ERROR_CREATE_IMG_FAILED.toString() && h != WebPDF.ImageEngine.GetImageErrorCode.ERROR_INPROGRESS.toString() || "success" != e || l.callback_fun(b, h, c)
                    } else I[u] = a, l.resizeImage(b.getPageIndex(), a, k.getPixelsPerPoint()), l.callback_fun(b)
                },
                error: function() {
                    jQuery("#continueButtonProgress").attr("style", "display:''"), jQuery("#progressDialogLableInfo").css("display", "block"), jQuery("#progressDialogLableInfo").html("<lable>" + i18n.t("Print.PrintImageError") + "</lable>")
                }
            })
        }, this.resizeImage = function(a, b, c) {
            var d = k.getPDFDoc().getPage(a).getPageRotate(),
                e = k.getPDFDoc().getPage(a).getPageWidth() * c,
                f = k.getPDFDoc().getPage(a).getPageHeight() * c,
                g = 0,
                h = 0;
            0 == d || 2 == d ? (g = e / G, h = f / H) : (g = e / H, h = f / G), q = g >= h ? g : h, o = f / q, p = e / q;
            var i = (H - o) / 2 - 1,
                j = (G - p) / 2;
            D = "";
            var l = "";
            if (1 == d || 3 == d) {
                i = (H - p) / 2 - 1, j = (G - o) / 2;
                var m = (p - o) / 2;
                l = 1 == d ? WebPDF.Common.getTransformCssString(90 * -d, -m, -m) : WebPDF.Common.getTransformCssString(90 * -d, m, m)
            }
            0 == a && (z = "<div id='" + x + "' style = 'min-width:" + G + "px'>");
            var n = "position: relative; width:" + G + "px; height:" + H + "px;margin: auto;display:inline-block";
            z += "<div class='page' style='" + n + "'>", z += "<div  style='position: inherit;width:" + p + "px;height:" + o + "px;margin-left:" + j + "px;margin-top:" + i + "px;" + l + "' class='subpage'>", z += "<img width='" + p + "px' height='" + (o - 1) + "px' src='" + b + "'></img>"
        }, this.updateProgress = function() {
            u += 1, jQuery("#progress_number").html('<font " size="3" >' + u + "/" + A + "</font>"), l.updateProgressbar(u, A), u == A && (m = !1, j.webPDFModal("hide"), l.updateProgressbar(0, 0))
        }, this.openPrintDlg = function() {
            i.webPDFModal("show")
        }, this.closePrintDlg = function() {
            i.webPDFModal("hide")
        }, this.openProgressDlg = function() {
            j.webPDFModal("show")
        }, this.closeProgressDlg = function() {
            j.webPDFModal("hide")
        }, this.openErrordlg = function() {
            n.webPDFModal("show")
        }, this.closeErrordlg = function() {
            n.webPDFModal("hide")
        }, this.updateProgressbar = function(a, b) {
            var c = document.getElementById("prpos");
            iPerc = a > 0 ? a / b * 100 : 0, c.style.width = iPerc + "%"
        }
    }, b.createPlugin = function(a) {
        var b = new WebPDF.printPlugin(a);
        return b
    }
}), define("core/Plugins/Bookmark/Bookmark", ["core/Plugins/Bookmark/PDFBookmark", "core/ImageEngine/PDFBookmarkLoader"], function(a, b, c) {
    function d(a, b, c, d) {
        this.parentNode = a, this.curIndex = d, this.curNodeId = b, this.pdfBookmark = c, this.childNodeList = [], this.addChildNode = function(a) {
            this.childNodeList.push(a)
        }
    }
    var e = a("core/Plugins/Bookmark/PDFBookmark");
    a("core/ImageEngine/PDFBookmarkLoader"), WebPDF.PDFAction = {
        TYPE_UNSUPPORTED: 0,
        TYPE_EMBEDDEDGOTO: 1,
        TYPE_GOTO: 2,
        TYPE_HIDE: 3,
        TYPE_IMPORTDATA: 4,
        TYPE_JAVASCRIPT: 5,
        TYPE_LAUNCH: 6,
        TYPE_NAMED: 7,
        TYPE_REMOTEGOTO: 8,
        TYPE_RENDITION: 9,
        TYPE_RESETFORM: 10,
        TYPE_SUBMITFORM: 11,
        TYPE_URI: 12
    }, WebPDF.PDFGotoAction = function(a) {
        var b = a;
        this.getPageIndex = function() {
            return b.pdfBookmark && b.pdfBookmark._bookmarkInfo ? b.pdfBookmark._bookmarkInfo.destinationInfo : void 0
        }, this.getDestination = function() {
            return b.pdfBookmark && b.pdfBookmark._bookmarkInfo ? b.pdfBookmark._bookmarkInfo.destinationInfo : void 0
        }
    }, WebPDF.Bookmark = function(a) {
        function b(a) {
            return a ? (k = a, j = new e(null), j.parserBookmarksInfo(a), h = new d(null, 0, j, 0), c(h, j), void(l = h)) : void console.warn("Bookmark data is null.")
        }

        function c(a, b) {
            for (var d = b.getChildCount(), e = 0; d > e; e++) {
                var g = b.getChild(e),
                    h = f(a, g, e);
                c(h, g)
            }
        }

        function f(a, b, c) {
            var e = b.getBookmarkInfo(),
                f = new d(a, e.currentIndex, b, c);
            a.addChildNode(f);
            WebPDF.Common.htmlEncodeEx(e.title);
            return f
        }

        function g(a, b) {
            if (!a) return !1;
            if (a.curNodeId == b) return l = a, !0;
            for (var c = 0; c < a.childNodeList.length; c++)
                if (g(a.childNodeList[c], b)) return !0;
            return !1
        }
        var h = null,
            i = a,
            j = null,
            k = null,
            l = null;
        this.moveToRoot = function() {
            l = h
        }, this.isRoot = function() {
            return l ? null == l.parentNode : !1
        }, this.getParentNodeID = function() {
            return l.parentNode.curNodeId
        }, this.isFirstChild = function() {
            return 0 == l.curIndex
        }, this.isLastChild = function() {
            return l.curIndex == l.parentNode.childNodeList.length - 1
        }, this.moveToParent = function() {
            l.parentNode && (l = l.parentNode)
        }, this.getNodeID = function() {
            return l.curNodeId
        }, this.getNode = function(a) {
            return g(h, a)
        }, this.moveToNextSibling = function() {
            return null == l.childNodeList || null == l.parentNode ? !1 : l.curIndex > l.parentNode.childNodeList.length - 2 ? !1 : (l = l.parentNode.childNodeList[l.curIndex + 1], !0)
        }, this.moveToFirstChild = function() {
            return l.childNodeList && 0 != l.childNodeList.length ? (l = l.childNodeList[0], !0) : !1
        }, this.countActions = function(a) {
            return l.pdfBookmark._bookmarkInfo ? 1 : 0
        }, this.getAction = function(a, b) {
            if (!this.isRoot() && l.pdfBookmark._bookmarkInfo) {
                var c = new WebPDF.PDFGotoAction(l);
                return c
            }
        }, this.getTitle = function() {
            return this.isRoot() ? void 0 : l.pdfBookmark._bookmarkInfo.title
        }, this.init = function() {
            var a = new WebPDF.ImageEngine.PDFBookmarkLoader;
            a.asyncLoadPDFBookmark(i, i.getPDFDoc(), b, $.noop)
        }
    }, b.createBookmark = function(a) {
        return new WebPDF.Bookmark(a)
    }
}), define("core/Plugins/Bookmark/PDFBookmark", [], function(a, b, c) {
    function d(a, b, c, d) {
        this._nParentID = a, this.currentIndex = b, this.destinationInfo = d, this.title = c
    }
    var e = {
        bookmarks: "bmks",
        parentIndex: "parent",
        curIndex: "cur",
        childs: "childs",
        title: "ttl",
        destInfo: "dest"
    };
    WebPDF.PDFData.BookmarkJSONDataFormat = e;
    var f = function(a) {
        this._bookmarkInfo = a, this._childNodeList = []
    };
    return f.prototype = {
        addChildBookmark: function(a) {
            this._childNodeList.push(a)
        },
        getChildCount: function() {
            return this._childNodeList.length
        },
        getChild: function(a) {
            return this._childNodeList[a]
        },
        getBookmarkInfo: function() {
            return this._bookmarkInfo
        },
        parserBookmarksInfo: function(a) {
            var b = a[e.bookmarks];
            if (b)
                for (var c = 0; c < b.length; c++) {
                    var d = b[c];
                    if (0 === d[e.parentIndex]) {
                        var f = this._addBookmarkNode(this, d, c),
                            g = d[e.childs];
                        if (g)
                            for (var h = g.length, i = 0; h > i; i++) {
                                var j = g[i] - 1,
                                    k = this._addBookmarkNode(f, b[j], j + 1);
                                this._enumBookmarks(k, j, b)
                            }
                    }
                }
        },
        _enumBookmarks: function(a, b, c) {
            var d = c[b];
            if (d) {
                var f = d[e.childs];
                if (f)
                    for (var g = f.length, h = 0; g > h; h++) {
                        var b = f[h] - 1,
                            i = this._addBookmarkNode(a, c[b], b + 1);
                        this._enumBookmarks(i, b, c)
                    }
            }
        },
        _addBookmarkNode: function(a, b, c) {
            var g = new WebPDF.PDFData.PDFDestination(b[e.destInfo]),
                h = new d(b[e.parentIndex], b[e.curIndex], b[e.title], g),
                i = new f(h);
            return a.addChildBookmark(i), i
        }
    }, WebPDF.PDFData.PDFBookmark = f, WebPDF.PDFData.PDFBookmark
}), define("core/ImageEngine/PDFBookmarkLoader", [], function(a, b, c) {
    var d = WebPDF.ImageEngine;
    d.PDFBookmarkLoader = function() {
        var a = WebPDF.Config.defaults.requestRetryCount,
            b = this;
        this.asyncLoadPDFBookmark = function(c, d, e, f) {
            if ($.isFunction(e) && $.isFunction(f) || $.error("both 'doneHandler' and 'failedHandler' must be function."), 0 >= a) return console.error("Maximum number of retries exceeded for getBookmarkData request."), void f(null);
            var g;
            /*if(window.location.protocol != "file:"){
                var bookid = JSON.parse(localStorage.getItem('bookId'));
                if(bookid == '56f24a41226b031530f1a836' || bookid == '57923dc2d26763694cfe8497' || bookid == '575960e0e76d21070f66f9bc'){
                    g = "./js/providers/"+bookid+"epub/"+bookid+"/bookmark";
                } else {
                    g = "./js/providers/temp/"+JSON.parse(localStorage.getItem('bookId'))+"/bookmark";
                }
            }else{*/
                g = c.getOptions().url + "bookmarks";
           // }
            c.isFormMode() && (g += "?formMode=true");
            var h = {
                password: c.getPDFPassword()
            };
            $.ajax({
                url: g,
                dataType: "json",
                data: h,
                success: function(g) {
                    if (null == g) return console.warn("Getting bookmark date returns null"), void f(g);
                    var h = g.error;
                    if (0 != h) {
                        if (WebPDF.Common.isNeedRetry(g.status)) {
                            var i = WebPDF.AjaxRetryManager.getNextBookmarkDataRequestInterval(c.getMainView().getDocView().getPageCount());
                            return a--, void setTimeout(function() {
                                b.asyncLoadPDFBookmark(c, d, e, f)
                            }, i)
                        }
                        return console.error("Get bookmark data error:" + h), void f(g)
                    }
                    try {
                        e($.parseJSON(g.BookmarkInfo))
                    } catch (j) {
                        return console.error(j), f(g), !1
                    }
                },
                error: function() {
                    f(null)
                }
            })
        }
    }
}), define("core/Plugins/FindTool/FindToolPlugin", ["core/Plugins/FindTool/SearchResult"], function(a, b, c) {
    var d = WebPDF.RectUtils,
        e = WebPDF.PDFRect,
        f = a("core/Plugins/FindTool/SearchResult");
    WebPDF.FindToolPluginName = "Find Tool Plugin", WebPDF.SearchDirection = {
        Up: 0,
        Down: 1
    };
    var g = function() {
            this.startCharIndex = -1, this.relateText = "", this.rects = []
        },
        h = function() {
            this.pageIndex = -1, this.totalCharCnt = -1, this.curResultIndex = -1, this.resultList = [], this.isSearched = !1, this.isHasResult = !1, this.clearResult = function() {
                this.pageIndex = -1, this.totalCharCnt = -1, this.curResultIndex = -1, this.resultList = [], this.isSearched = !1, this.isHasResult = !1
            }, this.isLastResult = function(a) {
                return a === this.resultList.length - 1
            }, this.isFirstResult = function(a) {
                return 0 === a
            }, this.getNextCharIndex = function(a) {
                return this.resultList[a + 1].startCharIndex
            }, this.getPrevCharIndex = function(a) {
                return this.resultList[a - 1].startCharIndex
            }, this.getLastCharIndex = function() {
                var a = this.resultList.length - 1;
                0 > a && (a = 0);
                var b = this.resultList[a];
                return b ? b.startCharIndex : 0
            }
        },
        i = function() {
            this.findWhat = "", this.resultRectArray = [], this.searchPos = -1, this.resultCharStartPos = -1, this.resultItemStartPos = -1, this.resultItemEndPos = -1, this.isMatchCase = !1, this.isMatchWholeWord = !1, this.isFound = !1
        },
        j = function() {
            this.startIndex = -1, this.endIndex = -1, this.resultCharStartPos = -1
        },
        k = function() {
            this.startCharIndex = -1, this.endCharIndex = -1
        },
        l = function(a, b) {
            this.pageIndex = a, this.charIndex = b
        };
    WebPDF.FindToolPlugin = function(a) {
        function b(a, b) {
            return b ? !(O === a) : !(N === a)
        }

        function c() {
            N = "", _self.resetHighLightText(!0), Q = -1, P = -1, R = -1;
            for (var a = 0; a < _pageCount; a++) S[a].clearResult();
            _hasSearchResult = !1, Z = !1
        }

        function n(a) {
            for (var b = [], c = a.length, d = 0; c > d; d++) {
                var f = new h,
                    i = a[d],
                    j = i.context;
                if (null != i.number && (f.pageIndex = parseInt(i.number)), f.isSearched = !0, 0 == j.length) f.isHasResult = !1;
                else {
                    f.isHasResult = !0, _hasSearchResult = !0;
                    for (var k = j.length, l = 0; k > l; l++) {
                        var m = new g,
                            n = j[l];
                        m.relateText = n.text.toString();
                        for (var o = n.rc, p = [], q = 0; q < o.length; q++) {
                            var n = o[q],
                                r = parseFloat(n[0]),
                                s = parseFloat(n[1]),
                                t = parseFloat(n[2]),
                                u = parseFloat(n[3]),
                                v = new e(r, s, t, u);
                            p.push(v)
                        }
                        m.rects = p, f.resultList.push(m)
                    }
                }
                b[f.pageIndex] = f
            }
            return b
        }

        function o(a) {
            return a.getPageViewContainerID() + "_HighLights"
        }

        function p(a) {
            if (_searchLoadingCallback) _searchLoadingCallback(a);
            else {
                var b = $("#" + V);
                a ? b.show() : b.hide()
            }
        }

        function q(a, b) {
            if (!a || !a.isContentCreated() || !b) return !1;
            var c = o(a);
            _lastHighLightDivID = c;
            var e = a.getPageIndex();
            if (null == Y[e]) {
                var f = "<div id='" + c + "' style='z-index:7;'></div>",
                    g = $("#" + a.getPageViewContainerID());
                g.append(f), Y[e] = !0
            }
            var h = $("#" + c);
            h.empty();
            for (var i = "", j = 0; j < b.length; j++) {
                var k = b[j];
                d.normalize(k), k = a.pdfRectToDevice(k, !0), i += "<div id='highlight_" + e + "_" + j + "'class='fwr-search-text-highlight' style='left:" + k.left + "px;top:" + k.top + "px;width:" + d.width(k) + "px;height:" + d.height(k) + "px' ></div>"
            }
            return h.append(i), !0
        }

        function r(a, b) {
            if (b.length <= 0) return null;
            var c = b[0];
            d.normalize(c);
            for (var f = new e(c.left, c.top, c.right, c.bottom), g = 1; g < b.length; g++) {
                var h = b[g];
                d.normalize(h), d.union(f, h)
            }
            var i = J.getMainView().getDocView(),
                j = $("#" + i.getDocViewContainerID()),
                k = j.height(),
                l = j.width(),
                m = j.offset(),
                n = $("#" + a.getPageViewContainerID()),
                o = a.getDocView().getViewMode();
            switch (o) {
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS_FACING:
                    break;
                case WebPDF.PDFView.RD_BRMODE_SINGLE_PAGE:
                case WebPDF.PDFView.RD_BRMODE_CONTINUOUS:
                    var p = n.offset(),
                        q = a.pdfRectToDevice(f, !0),
                        r = d.height(q),
                        s = d.width(q),
                        t = k / 2,
                        u = l / 2,
                        v = $("div#docViewer_ViewContainer .fwrJspHorizontalBar").height();
                    0 > v && (v = 0);
                    var w = p.top + q.top >= m.top && p.top + q.bottom <= m.top + k - v;
                    if (w &= p.left + q.left >= m.left && p.left + q.left <= m.left + l || p.left + q.left <= m.left && p.left + q.left + s >= m.left) return null;
                    var x = r / 2 + q.top;
                    x = t - x, x = -x;
                    var y = s / 2 + q.left;
                    return y = u - y, y = -y, {
                        x: y,
                        y: x
                    }
            }
            return null
        }

        function s(a, d, e, f, g) {
            if (K) return !1;
            if (!a || 0 > e) return !1;
            _isCancelSearch = !1, p(!0);
            var h = !1,
                i = !0,
                j = b(a, !1);
            return j ? (c(), N = a) : Z && (i = !1), i && (h = d == WebPDF.SearchDirection.Down ? t(e, f, g, d) : t(e, f, g, d)), _isCancelSearch ? (_isCancelSearch = !1, p(!1), !1) : (p(!1), h || (Z = !0, _searchNotFoundCallback ? _searchNotFoundCallback() : WebPDF.alert(J, "", i18n.t("Search.NoFound"), null, null, !0)), h)
        }

        function t(a, b, c, d) {
            var e, f = !1;
            if (d == WebPDF.SearchDirection.Down) {
                for (e = a; b >= e; e++) {
                    if (_isCancelSearch) return !1;
                    var g = S[e];
                    if (!g || !g.isSearched || g.isHasResult) {
                        if (!g || !g.isSearched) {
                            var h = w(e, !0);
                            if (!h) break
                        }
                        if (f = u(e, h, c, d)) return !0;
                        if (e == _pageCount - 1 && 0 != a) return s(N, d, 0, a - 1, -1)
                    }
                }
                return e > b ? _hasSearchResult ? b == _pageCount - 1 ? s(N, d, 0, a - 1, -1) : s(N, d, b + 1, _pageCount - 1, -1) : !1 : (E(e, b, N, 0, !0), !0)
            }
            for (e = b; e >= a; e--) {
                if (_isCancelSearch) return !1;
                var g = S[e];
                if (!g || !g.isSearched || g.isHasResult) {
                    if (!g || !g.isSearched) {
                        var h = w(e, !0);
                        if (!h) break
                    }
                    if (f = u(e, h, c, d)) return !0;
                    if (0 == e && b != _pageCount - 1) return s(N, d, b + 1, _pageCount - 1, -1)
                }
            }
            return a > e ? _hasSearchResult ? 0 == a ? s(N, d, b + 1, _pageCount - 1, -1) : s(N, d, 0, a - 1, -1) : !1 : (E(a, e, N, 0, !1), !0)
        }

        function u(a, b, c, d) {
            var e = S[a];
            if (!e || !e.isSearched) {
                e = new h, e.pageIndex = a, e.totalCharCnt = b.getStrSize();
                for (var f, i = x(), k = !1;;) {
                    f = new j;
                    var l = y(i, f, b);
                    if (!l) break;
                    var m = f.startIndex >= 0;
                    if (m) {
                        k = !0;
                        var n = new g;
                        n.startCharIndex = f.resultCharStartPos, n.rects = i.resultRectArray, e.resultList.push(n)
                    }
                }
                if (e.isSearched = !0, !k) return S[a] = e, !1;
                e.isHasResult = !0, _hasSearchResult = !0, S[a] = e
            }
            var n = v(e, c, d);
            if (n) {
                _self.resetHighLightText(!0), f = n.ret;
                var o = Q === f.startCharIndex && R == n.index && P === a;
                P = a, _self.setHighlightRects(f.rects), o ? setTimeout(function() {
                    _self.highlightSearchedText(P, X)
                }, 50) : _self.highlightSearchedText(P, X), Q = f.startCharIndex, R = n.index
            }
            return null != n
        }

        function v(a, b, c) {
            if (!a || !a.isSearched) return null;
            if (c == WebPDF.SearchDirection.Down)
                for (var d = 0; d < a.resultList.length; d++) {
                    var e = a.resultList[d];
                    if (-1 === b || e.startCharIndex >= b) return {
                        ret: e,
                        index: d
                    }
                } else
                    for (var d = a.resultList.length - 1; d >= 0; d--) {
                        var e = a.resultList[d];
                        if (-1 === b || e.startCharIndex <= b) return {
                            ret: e,
                            index: d
                        }
                    }
            return null
        }

        function w(a, b) {
            var c = U.getTextPage(a, b);
            return c && c.blocking ? null : c
        }

        function x() {
            var a = new i;
            return a.isMatchCase = L, a.isMatchWholeWord = M, a.resultRectArray = [], a.findWhat = N, a.searchPos = 0, a.resultCharStartPos = -1, a.resultItemStartPos = -1, a.resultItemEndPos = -1, a.searchPos = 0, a.isFound = !1, a.searchPos = 0, a
        }

        function y(a, b, c) {
            return a.resultRectArray = [], a.resultItemEndPos = -1, a.resultItemStartPos = -1, -1 != a.resultCharStartPos && (a.searchPos = a.resultCharStartPos + 1), z(a, c) ? (b.startIndex = a.resultItemStartPos, b.endIndex = a.resultItemEndPos, b.resultCharStartPos = a.resultCharStartPos, a.isFound = !0, !0) : (a.isFound = !1, !1)
        }

        function z(a, b) {
            a.resultCharStartPos = -1, a.resultItemStartPos = -1, a.resultItemEndPos = -1;
            var c = b.getPageAllText();
            if (!c) return !1;
            a.isMatchCase || (c = c.toLowerCase());
            var d = a.findWhat;
            d = d.replace(/(^\s*)|(\s*$)/g, ""), a.isMatchCase || (d = d.toLowerCase()), d.replace("  ", " "), a.isMatchWholeWord && (d = " " + d + " ", d = " " + d + " ");
            var e = new k,
                f = A(c, d, a.searchPos, e);
            if (!f) return !1;
            var g = e.startCharIndex,
                h = e.endCharIndex;
            a.isMatchWholeWord && (h -= 2);
            var i = b.getObjIndexByCharIndex(g),
                j = b.getObjIndexByCharIndex(h);
            if (a.resultCharStartPos = g, a.resultItemStartPos = i, a.resultItemEndPos = j, -1 === j || -1 === i) return !1;
            var l = b.getPDFRect(i, j - i + 1);
            return 0 === l.length ? !1 : (a.resultRectArray = l, !0)
        }

        function A(a, b, c, d) {
            var e = d.startCharIndex,
                f = d.endCharIndex,
                g = c,
                h = 0,
                i = a.length,
                j = b.length;
            for (e = g; i > g && j > h;) a.charAt(g) == b.charAt(h) || "\r" == a.charAt(g) && i - 1 > g && "\n" == a.charAt(g + 1) && " " == b.charAt(h) || "\n" == a.charAt(g) && g > 0 && "\r" == a.charAt(g - 1) && " " == b.charAt(h) || (0 == h || h == j - 1) && " " == b.charAt(h) && !(a.charAt(g) >= "a" && a.charAt(g) <= "z" || a.charAt(g) >= "A" && a.charAt(g) <= "Z") ? (0 == h && (e = g), ++g, ++h) : 0 != h && "-" == a.charAt(g) && "-" != a.charAt(g - 1) ? ++g : 0 != h && 173 == a.charCodeAt(g) ? ++g : 0 != h && "\r" == a.charAt(g) && i - 1 > g && "\n" == a.charAt(g + 1) && (h - 1 != 0 || " " != b.charAt(h - 1)) ? ++g : 0 != h && "\n" == a.charAt(g) && g > 0 && "\r" == a.charAt(g - 1) && (h - 1 != 0 || " " != b.charAt(h - 1)) ? ++g : " " == a.charAt(g) && h > 1 && " " == b.charAt(h - 1) ? ++g : (e += 1, g = e, h = 0);
            return h >= j ? (f = g - 1, d.startCharIndex = e, d.endCharIndex = f, !0) : !1
        }

        function B(a) {
            if (b(a, !1)) return null;
            if (Z) return null;
            var c = S[P];
            if (c.isLastResult(R)) {
                var d = P >= S.length - 1 ? 0 : P + 1,
                    e = 0;
                return new l(d, e)
            }
            return new l(P, c.getNextCharIndex(R))
        }

        function C(a) {
            if (b(a, !1)) return null;
            if (Z) return null;
            var c = S[P];
            if (c.isFirstResult(R)) {
                var d = 0;
                return d = P >= 1 ? P - 1 : S.length - 1, new l(d, -1)
            }
            return new l(P, c.getPrevCharIndex(R))
        }

        function D(a, b, c, d) {
            return a ? K ? !1 : (p(!0), F(a, b, c, d), void(WebPDF.Environment.mobile || p(!1))) : (console.warn("Search text cannot be null or empty"), !1)
        }

        function E(b, c, d, e, f) {
            var g = {
                    startpageindex: b,
                    endpageindex: c,
                    findtext: d,
                    flags: e,
                    searchDown: f,
                    password: a.getPDFPassword()
                },
                h = a.getOptions().url + "searchtext/pageindex";
            $.ajax({
                url: h,
                type: "POST",
                dataType: "json",
                data: g,
                success: function(a) {
                    var e = a.error;
                    if (0 == e) try {
                        var g = -1;
                        g = $.parseJSON(a.pageIndex);
                        var h = $.parseJSON(a.pageTextInfo);
                        if (-1 != g && U.setTextPage(g, h), f) {
                            if (-1 == g) {
                                for (var i = b; c >= i; i++) {
                                    var j = S[i];
                                    j.isSearched || (j.isSearched = !0, j.isHasResult = !1, S[i] = j)
                                }
                                return b > 0 ? (c = b - 1, b = 0) : (b = 0, c = _pageCount - 1), void s(d, WebPDF.SearchDirection.Down, 0, b, -1)
                            }
                            for (var i = b; g > i; i++) {
                                var j = S[i];
                                j.isSearched || (j.isSearched = !0, j.isHasResult = !1, S[i] = j)
                            }
                            return void s(d, WebPDF.SearchDirection.Down, g, c, -1)
                        }
                        if (-1 == g) {
                            for (var i = c; i >= b; i--) {
                                var j = S[i];
                                j.isSearched || (j.isSearched = !0, j.isHasResult = !1, S[i] = j)
                            }
                            return b > 0 ? (c = b - 1, b = 0) : (b = c + 1, c = _pageCount - 1), void s(d, WebPDF.SearchDirection.Up, b, c, -1)
                        }
                        for (var i = c; i > g; i--) {
                            var j = S[i];
                            j.isSearched || (j.isSearched = !0, j.isHasResult = !1, S[i] = j)
                        }
                        return void s(d, WebPDF.SearchDirection.Up, b, g, -1)
                    } catch (k) {
                        return
                    }
                },
                error: function() {}
            })
        }

        function F(b, c, d, e) {
            if ("" != b) {
                var g = {
                        findtext: b,
                        flags: d,
                        pageIndex: e,
                        count: c,
                        password: a.getPDFPassword()
                    },
                    h = a.getOptions().url + "searchtext";
                $.ajax({
                    url: h,
                    type: "POST",
                    dataType: "json",
                    data: g,
                    success: function(a) {
                        var c = a.error;
                        if (0 != c) return null;
                        try {
                            var d = $.parseJSON(a.searchResult);
                            O = b;
                            var e = n(d.searchResult),
                                g = (T.length, d.pageIndex),
                                h = new f(e);
                            $(J).trigger(WebPDF.EventList.SEARCH_ALL_FINISHED, {
                                searchResult: h,
                                pageIndex: g
                            }), WebPDF.Environment.mobile && p(!1)
                        } catch (i) {
                            return null
                        }
                    },
                    error: function() {
                        return null
                    }
                })
            }
        }

        function G() {
            $(J).on(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, H)
        }

        function H(a) {
            var b = J.getMainView().getDocView().getPageView(P);
            b && X && q(b, X)
        }

        function I() {
            _jqPanel = $("#" + _self.getPanelID()), _searchPanel = new m(J, S, _self), _isSearchInitialized = !0
        }
        var J = a,
            K = !1,
            L = !1,
            M = !1,
            N = "",
            O = "",
            P = -1,
            Q = -1,
            R = -1,
            S = [],
            T = [],
            U = J.getTextManager(),
            V = null,
            W = J.getAppId() + "_searchLoadingText",
            X = (J.getAppId() + "_searchTextInput", null),
            Y = {},
            Z = !1;
        _pageCount = -1, _isCancelSearch = !1, _searchLoadingCallback = null, _searchNotFoundCallback = null, _self = this, _searchRootNode = null, _searchPanel = null, _scrollApi = null, _isSearchInitialized = !1, _jqPanel = null, _hasSearchResult = !1, _lastHighLightDivID = null, this.setSearchParam = function(a, b) {
            return K ? void console.warn("Searching parameters can not be changed during searching.") : ((L != a || M != b) && c(), L = a, void(M = b))
        }, this.setHighlightRects = function(a) {
            return X = [], X = a.concat()
        }, this.resetHighLightText = function(a) {
            if (null != X && 0 != X.length) {
                if (a && (X = []), _lastHighLightDivID) {
                    var b = $("#" + _lastHighLightDivID);
                    b.length > 0 && b.empty()
                }
                var c = $("#" + J.getMainView().getMainFrameID());
                c.off("click.highlightSearchResult")
            }
        }, this.highlightSearchedText = function(a, b) {
            var c = J.getMainView().getDocView();
            if (0 > a || a >= _pageCount) return !1;
            var d = c.getPageView(a);
            d.isContentCreated() || c.gotoPage(a, 0, 0);
            var e = r(d, b);
            e && c.gotoPage(a, e.x, e.y);
            var f = q(d, b);
            if (b && b.length > 0) {
                var g = $("#" + J.getMainView().getMainFrameID());
                g.on("click.highlightSearchResult", function(a) {
                    var b = $("div#docViewer_ViewContainer .fwrJspVerticalBar");
                    if (b.length > 0) {
                        var c = b.offset();
                        if (a.clientX >= c.left) return
                    }
                    var d = $("div#docViewer_ViewContainer .fwrJspHorizontalBar");
                    if (d.length > 0) {
                        var e = d.offset();
                        if (a.clientY >= e.top) return
                    }
                    _self.resetHighLightText(!0)
                })
            }
            return f
        }, this.searchAllText = function(a, b, c, d) {
            D(a, b, c, d)
        }, this.cancelSearching = function() {
            K && (_isCancelSearch = !0, _)
        }, this.setSearchLoadingCallback = function(a) {
            _searchLoadingCallback = a
        }, this.setNotFoundCallback = function(a) {
            _searchNotFoundCallback = a
        }, this.searchTextDown = function(a) {
            if (!a) return console.warn("Search text cannot be null or empty"), !1;
            var b = B(a),
                c = J.getMainView().getDocView().getCurPageIndex();
            return b ? s(a, WebPDF.SearchDirection.Down, b.pageIndex, _pageCount - 1, b.charIndex) : s(a, WebPDF.SearchDirection.Down, c, _pageCount - 1, -1)
        }, this.searchTextUp = function(a) {
            if (!a) return console.warn("Search text cannot be null or empty"), !1;
            var b = C(a),
                c = J.getMainView().getDocView().getCurPageIndex();
            return b ? s(a, WebPDF.SearchDirection.Up, 0, b.pageIndex, b.charIndex) : s(a, WebPDF.SearchDirection.Up, 0, c, -1)
        }, this.getPanelID = function() {
            return J.getAppId() + "_fxfindPanel"
        }, this.getTabBtnID = function() {
            return J.getAppId() + "_searchtab"
        }, this.getTabNorClass = function() {
            return "fwr-find-panel-icon"
        }, this.getTabHotClass = function() {
            return "fwr-find-panel-icon"
        }, this.getTitle = function() {
            return "SearchResult.Title"
        }, this.onSize = function(a, b) {
            _jqPanel && (_jqPanel.css({
                width: a,
                height: b
            }), _isSearchInitialized && _scrollApi && _scrollApi.reinitialise())
        }, this.getName = function() {
            return WebPDF.FindToolPluginName
        }, this.onRegister = function() {}, this.setSeacrchedPageIndex = function(a) {
            P = a
        }, this.init = function() {
            var a = J.getMainView(),
                b = a.getDocView();
            V = b.getDocViewContainerID() + "_SearchingDiv", W = V + "_LoadingText", _pageCount = b.getPageCount();
            for (var c = 0; c < _pageCount; c++) S[c] = new h;
            var d = $("#" + a.getMainFrameID());
            d.append("<div id='" + V + "' class='fwr-searching-div' style='display: none;'><div  class='fwr-searching-div-content' /><label class='fxsearching_divcontent' style='margin-left: 10px;margin-top: 1px;float: left;' id='" + W + "'>Searching...</label></div>"), I(), p(!1), J.isFindToolEventInit() || (G(), J.setFindToolEventInit(!0))
        }, this.unload = function() {}
    };
    var m = function(a, b, c) {
        function d(a) {
            for (var b = e.length, c = 0, d = 0; b > d; d++) {
                var f = e[d];
                if (f && f.isHasResult) {
                    var g = f.resultList,
                        h = g.length;
                    if (c += h, c > a || a == c) {
                        var i = g[h + a - c - 1];
                        return {
                            ret: i,
                            index: d
                        }
                    }
                }
            }
        }
        var e = b,
            f = c,
            g = a,
            h = "searchNode",
            i = "searchPlusItem",
            j = a.getBaseUrl() + "images/reader/dtree/",
            k = {
                root: "",
                folder: j + "bk.png",
                folderOpen: j + "bk.png",
                node: j + "bk.png",
                nodehot: j + "bk1.png",
                empty: j + "empty.gif",
                line: j + "line.png",
                join: j + "join.png",
                joinBottom: j + "joinbottom.png",
                joinTop: j + "jointop.png",
                joinonly: j + "joinonly.png",
                plus: j + "plug.png",
                plusBottom: j + "plugbottom.png",
                plusTop: j + "plugtop.png",
                plusOnly: j + "plugonly.png",
                minus: j + "minus.png",
                minusBottom: j + "minusbottom.png",
                minusTop: j + "minustop.png",
                minusOnly: j + "minusonly.png",
                nlPlus: j + "nolines_plus.gif",
                nlMinus: j + "nolines_minus.gif"
            },
            l = null;
        this.createTree = function(a) {
            l = new WebPDFTools.dTree(g.getAppId() + "_search_", h, i, k), l.add(0, -1, "");
            for (var b = a.length, c = 0; b > c; c++) {
                var d = a[c];
                if (d)
                    for (var e = d.resultList, f = 0; f < e.length; f++) {
                        for (var j = e[f], m = j.relateText, n = m.search("\n", ""); - 1 != n;) m = m.replace("\n", ""), n = m.search("\n", "");
                        var o = WebPDF.Common.htmlEncodeEx(m);
                        l.add(c + f + 1, 0, o)
                    }
            }
        }, this.toHtmlString = function() {
            return l.toString()
        }, this.bindEvents = function(a) {
            var b = $("#" + g.getMainView().getMainFrameID());
            b.on("click", "." + h, function(a) {
                try {
                    var b = parseInt(a.target.getAttribute("nodeid")),
                        c = d(b);
                    if (c) {
                        var e = c.index;
                        f.resetHighLightText(!0);
                        var g = c.ret,
                            h = !1;
                        f._curSearchedPageIndex = e;
                        var i = f.setHighlightRects(g.rects);
                        h ? setTimeout(function() {
                            f.highlightSearchedText(f._curSearchedPageIndex, i)
                        }, 50) : f.highlightSearchedText(f._curSearchedPageIndex, i)
                    }
                } catch (j) {
                    console.error(j)
                }
            }), b.on("click", "." + i, function(a) {
                try {
                    var b = parseInt(a.target.getAttribute("nodeid")),
                        c = d(b);
                    if (c) return !1
                } catch (e) {
                    console.error(e)
                }
            })
        }
    };
    b.createPlugin = function(a) {
        return new WebPDF.FindToolPlugin(a)
    }
}), define("core/Plugins/FindTool/SearchResult", [], function(a, b, c) {
    return WebPDF.SearchResult = function(a) {
        for (var b = function(a, b) {
                this.pageIndex = a, this.result = b, this.getPageIndex = function() {
                    return a
                }, this.getResult = function() {
                    return b
                }
            }, c = [], d = -1, e = a.length, f = 0; e > f; f++) {
            var g = a[f];
            if (g)
                for (var h = g.resultList, i = 0; i < h.length; i++) {
                    var j = h[i];
                    d += 1;
                    var k = new b(f, j);
                    c[d] = k
                }
        }
        this.count = function() {
            return c.length
        }, this.getContent = function(a) {
            if (a > c.length - 1) return null;
            for (var b = c[a], d = b.getResult(), e = d.relateText, e = d.relateText, f = e.search("\n", ""); - 1 != f;) e = e.replace("\n", ""), f = e.search("\n", "");
            WebPDF.Common.htmlEncodeEx(e);
            return e
        }, this.continueSearch = function(a) {
            _continueToSearch(a)
        }, this.getPageIndex = function(a) {
            return a > c.length - 1 ? null : c[a].getPageIndex()
        }, this.getRects = function(a) {
            if (a > c.length - 1) return null;
            var b = c[a].getResult().rects,
                d = [],
                e = b.length;
            for (f = 0; e > f; f++) {
                var g = b[f],
                    h = this.getPageIndex(a),
                    i = WebPDF.Tool.readerApp.getPDFDoc(),
                    j = i.getPage(h),
                    k = j.transRectToPDF(g);
                WebPDF.RectUtils.normalize(k), d.push(k)
            }
            return d
        }
    }, WebPDF.SearchResult
}), define("core/Plugins/DocProperties/DocPropertiesPlugin", [], function(a, b, c) {
    WebPDF.PDFDocPropertiesPlugin = function(a) {
        function b(a, b) {
            var c = WebPDF.Common.changeUnit(b, "point", a);
            return WebPDF.Common.parseValueToDecimal(c, 2)
        }

        function c() {
            var b = g.getPDFDoc().getDocProperties();
            if (b) {
                var c = g.getAppId(),
                    e = c + "-fwr-doc-properties-dlg";
                if (0 == $("#" + e).length && (f = "<div id='" + e + "' style='display:none' class='fwr-modal fwr-hide fwr-fade fwr-in fwr-doc-properties-dlg'><div class='fwr-modal-header'><a class='close' webpdf-data-dismiss='modal'></a><h4 data-i18n='DocProperties.Title'>Foxit Web PDF</h4></div><div class='fwr-modal-body'><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.PDFTitle'></span><span id='" + k.title + "' class='txtspan' title=''></span></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.Subject'></span><span id='" + k.subject + "' class='txtspan'></span></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.Author'></span><span id='" + k.author + "' class='txtspan'></span></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.Creator'></span><span id='" + k.creator + "' class='txtspan'></span></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.Producer'></span><span id='" + k.producer + "' class='txtspan'></span></div><div class='sp'><span class='left' style='float:left' data-i18n='DocProperties.Keywords'></span><textarea id='" + k.keywords + "' style='width:272px;max-width:272px;height:55px; resize:none;' class='fwr-doc-properties-dlg-keyword' disabled='disabled'></textarea></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.CreateDate'></span><span  id='" + k.creationDate + "' class='txtspan'></span></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.ModifyDate'></span><span  id='" + k.modifyDate + "' class='txtspan'></span></div><div class='separator'></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.PDFVersion'></span><span id='" + k.version + "'></span></div><div class='sp defaultHeight'><span class='left' data-i18n='DocProperties.PageSize'></span><span id='" + k.pageSize + "'></span><select id='" + k.unit + "' style='width:53px;margin-left:4px'><option value='inch' data-i18n='DocProperties.Inch'></option><option value='cm' data-i18n='DocProperties.Centimeter'></option><option value='point' data-i18n='DocProperties.Point'></option><option value='pica' data-i18n='DocProperties.Pica'></option></select></div><div class='sp'><span class='left' data-i18n='DocProperties.NumOfPages'></span><span id='" + k.pageCount + "'></span></div></div><div class='fwr-modal-footer' ><a href='#' id='" + k.closeBtn + "' class='btn' webpdf-data-dismiss='modal' data-i18n='DocProperties.OKBtnTitle'>Close</a>",
                        $("#" + a.getMainFrameId()).append(f), i = $("#" + e), $("#" + k.unit).on("change", function() {
                            d()
                        }), h = !0), i) {
                    i.i18n();
                    var j = b.getAuthor();
                    j && $("#" + k.author).text(j).attr("title", j);
                    var l = b.getCreator();
                    l && $("#" + k.creator).text(l).attr("title", l);
                    var m = b.getProducer();
                    m && $("#" + k.producer).text(m).attr("title", m);
                    var n = b.getTitle();
                    n && $("#" + k.title).text(n).attr("title", n);
                    var o = b.getSubject();
                    o && $("#" + k.subject).text(o).attr("title", o);
                    var p = b.getKeywords();
                    p && $("#" + k.keywords).val(p);
                    var q = b.getCreationDate();
                    q && $("#" + k.creationDate).text(q).attr("title", q);
                    var r = b.getModifyDate();
                    r && $("#" + k.modifyDate).text(r).attr("title", r);
                    var s = b.getVersion();
                    s && $("#" + k.version).text(s).attr("title", s);
                    var t = g.getMainView().getDocView().getPageCount();
                    $("#" + k.pageCount).text(t).attr("title", t), d(), i.webPDFModal({
                        keyboard: !1,
                        backdrop: "static"
                    })
                }
            }
        }

        function d() {
            var a = $("#" + k.unit).val();
            console.log(k.unit);
            var c = g.getMainView().getDocView().getCurPageIndex(),
                d = g.getPDFDoc().getPage(c),
                e = b(a, d.getPageWidth()),
                f = b(a, d.getPageHeight()),
                h = e + " * " + f;
            $("#" + k.pageSize).text(h).attr("title", h)
        }

        function e() {
            var a = j + "contextMenuDocProperties";
            g.addMenuItem({
                name: "MenuDocProperties",
                createHtml: function() {
                    return "<li  id='" + a + "' class='icon' menuname='MenuDocProperties'><span class='icon icon1'></span><label data-i18n='DocProperties.Title'></label></li>"
                },
                onShow: function() {},
                onSelect: function(a) {
                    if (a) {
                        if (a.hasClass("disabled")) return !1;
                        c()
                    }
                }
            })
        }
        var f = "",
            g = a,
            h = !1,
            i = null,
            j = g.getAppId(),
            k = {
                author: j + "_docPropertiesAuthor",
                creator: j + "_docPropertiesCreator",
                producer: j + "_docPropertiesProducer",
                title: j + "_docPropertiesTitle",
                subject: j + "_docPropertiesSubject",
                keywords: j + "_docPropertiesKeywords",
                creationDate: j + "_docPropertiesCreationDate",
                modifyDate: j + "_docPropertiesModifyDate",
                version: j + "_docPropertiesVersion",
                name: j + "_docPropertiesName",
                pageCount: j + "_docPropertiesPageCount",
                pageSize: j + "_docPropertiesPageSize",
                unit: j + "_docPropertiesUnit",
                closeBtn: j + "_btnCloseDocPropertiesDlg"
            };
        this.getName = function() {
            return "DocProperties Plugin"
        }, this.onRegister = function() {}, this.init = function() {
            e()
        }, this.unload = function() {}
    }, b.createPlugin = function(a) {
        return new WebPDF.PDFDocPropertiesPlugin(a)
    }
}), define("core/Plugins/Form/FormPlugin", ["core/Plugins/Form/ActionJScript", "core/Plugins/Form/jshint", "core/Plugins/Form/FormXMLParser"], function(a, b, c) {
    function d(a, b) {
        this.m_state = a, this.m_errMsg = b
    }
    a("core/Plugins/Form/ActionJScript"), a("core/Plugins/Form/jshint"), a("core/Plugins/Form/FormXMLParser"), WebPDF.FormPluginName = "Form Plugin", WebPDF.FormPlugin = function(a) {
        function b() {
            var a = j.getPDFDoc(),
                b = a.getDocType(),
                c = a.hasPermission(WebPDF.PDFPermission.FPDFPERM_ANNOT_FORM) || a.hasPermission(WebPDF.PDFPermission.FPDFPERM_FILL_FORM);
            return b != WebPDF.PDFDocType.FORM && b != WebPDF.PDFDocType.XFA || !c ? !1 : !0
        }

        function c(a, b) {
            for (var c = $(b), d = 0; d < a.formWidgets.length; d++) {
                var e = a.formWidgets[d].getControlID(),
                    f = "",
                    g = "";
                if (7 == a.formWidgets[d].formWidget.type) {
                    var h = $("#" + e);
                    g = c.find("#" + e), g.empty(), g.append(h.children().clone())
                } else if (8 == a.formWidgets[d].formWidget.type) {
                    var i = e + "_input",
                        j = $("#" + i);
                    f = j.attr("value"), g = c.find("#" + i)
                } else if (2 == a.formWidgets[d].formWidget.type || 3 == a.formWidgets[d].formWidget.type) {
                    var h = $("#" + e);
                    g = c.find("#" + e);
                    var k = g.parent();
                    k.empty(), k.append(h.clone())
                } else {
                    var h = $("#" + e);
                    f = h.attr("value"), g = c.find("#" + e)
                }
                g && g.length > 0 && g.attr("value", f)
            }
            return c.html()
        }

        function e(a) {
            var b = null;
            return null == a ? "Loading failed, the link is corrupted or tampered." : ($(a).find("Pages").each(function() {
                if ("Error" == WebPDF.getNodeString($(this), "Error")) {
                    var a = WebPDF.getNodeString($(this), "Msg"),
                        c = WebPDF.getNodeFloat($(this), "status");
                    b = new d(c, a)
                }
            }), b)
        }

        function f(b, c, d, g) {
            var h = c.join(";");
            h = encodeURIComponent(h);
            var i = a.getOptions().url + "form/xml/" + h;
            if (0 >= d) throw new Error("Maximum number of retries exceeded for get form xml request.");
            $.ajax({
                url: i + "?number=" + Math.random(),
                dataType: "xml",
                async: b,
                success: function(a) {
                    var b = e(a),
                        g = j.getMainView().getDocView();
                    if (b) {
                        if (WebPDF.Common.isNeedRetry(b.m_state)) {
                            var h = g.getPageViewRender().getMaxRenderedPageIndex();
                            null == h && (h = 0);
                            var i = WebPDF.AjaxRetryManager.getNextFormXmlRequestInterval(c[c.length - 1], h, g.getPageCount());
                            setTimeout(function() {
                                f(!0, c, d - 1)
                            }, i)
                        } else if ("" != b.m_errMsg)
                            for (var k in c) o[c[k]] = !1
                    } else {
                        $(a).find("Page").each(function() {
                            var a = parseInt($(this).attr("PageNo")),
                                b = g.getPageView(a),
                                d = b.getPageBackgroundImgID(),
                                e = new WebPDF.FormPage(j);
                            n[a] || (e.parser(d + "_form", a, $(this)), n[a] = e, b.isPageLoaded() ? b.isPageLoadError() ? n[a] = null : ($("#" + d).after(e.getHtmlCode(m, g.getScale())), j.isReadOnly() || (e.getRegisterActionCode(), e.getReadyBindCode()), o[a] && e.ShowPage(), e.changeSize(g.getScale()), n[a].changeHighlight(m)) : p[a] = !0), c[a] = null
                        });
                        for (var k in c) null != c[k] && (o[c[k]] = !1, q[c[k]] = !1)
                    }
                },
                error: function() {
                    for (var a in c) o[c[a]] = !1;
                    throw new Error("Get Form XML Data Error!")
                }
            })
        }

        function g() {
            $(j).on(WebPDF.EventList.DOCVIEW_PRE_RESIZE, function() {
                var a = this.getPluginByName(WebPDF.FormPluginName);
                a && b() && a.onPreDocViewResize()
            }).on(WebPDF.EventList.PAGE_INVISIBLE, function(a, c) {
                var d = this.getPluginByName(WebPDF.FormPluginName);
                d && b() && d.onPageInvisible(c.pages)
            }).on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function(a, c) {
                var d = j.getMainView().getDocView();
                document.getElementById(d.getDocViewContainerID()).focus();
                var e = this.getPluginByName(WebPDF.FormPluginName);
                e && b() && (e.showFormWidget(), e.onPageShowComplete(c.pageView))
            }).on(WebPDF.EventList.DOCVIEW_PAGE_CHANGED, function(a, c) {
                var d = j.getMainView().getDocView();
                document.getElementById(d.getDocViewContainerID()).focus();
                var e = this.getPluginByName(WebPDF.FormPluginName);
                e && b() && e.onPageChanged(c.curIndex)
            })
        }

        function h() {
            for (var a in n)
                if (null != n[a])
                    for (var b = n[a], c = 0; c < b.formWidgets.length; c++) b.formWidgets[c].initValue = WebPDF.g_formValue.GetItemValue(b.formWidgets[c].formWidget.name)
        }

        function i() {
            var b = j.getPDFDoc().getFormXMLData(),
                c = {
                    data: b
                },
                d = a.getOptions().url + "form/xml/save";
            $.ajax({
                type: "post",
                url: d,
                data: c,
                dataType: "json",
                success: function(a) {
                    j.getDocView().setModified(!1);
                    var b = a.error;
                    0 != b && alert("save form error!")
                },
                error: function() {}
            })
        }
        var j = a,
            k = this,
            l = !1,
            m = !0,
            n = {},
            o = {},
            p = {},
            q = {},
            r = -1;
        this.getName = function() {
            return WebPDF.FormPluginName
        }, this.onRegister = function() {}, this.init = function() {
            if (b()) {
                var a = "fwr-form-widget";
                j.addIgnoreMouseEventClass(a);
                var c = "fwr-form-widget-combo-list";
                j.addIgnoreMouseEventClass(c);
                var d = j.getDocPermission();
                l = 0 == (16 & d), l && g()
            }
        }, this.unload = function() {}, this.getReaderApp = function() {
            return j
        }, this.isFormFieldsEnable = function() {
            var a = l;
            if (a) {
                var b = j.getCurToolHandler();
                null != b && b.getName() != WebPDF.Tools.TOOL_NAME_HAND && (a = !1)
            }
            return a
        }, this.disableFormFields = function() {
            l = !1
        }, this.getFormData = function() {
            return l ? WebPDF.g_formValue.GetFormDataXML() : ""
        }, this.setFormDataByXMLData = function(a) {
            WebPDF.g_formValue.beginFormImportData(), WebPDF.g_formValue.setFormDataByXML($(a)), this.updateForm(), WebPDF.g_formValue.endFormImportData()
        }, this.exportXML = function() {
            var a = j.getPDFDoc();
            a && a.exportFormXML()
        }, this.importXML = function(a) {
            var b = j.getPDFDoc();
            b && b.importFormXML(a)
        }, this.save = function(a) {
            i(), h()
        }, this.updateForm = function() {
            n[r] && n[r].update(arguments[0], arguments[1])
        }, this.resetForm = function() {
            if (l) {
                WebPDF.g_formValue.ClearAll();
                for (var a = j.getMainView().getDocView(), b = a.getPageCount(), c = 0; b > c; c++) {
                    var d = a.getPageView(c);
                    null != d && null != n[c] && n[c].resetData()
                }
                j.setModified(null, null, !0)
            }
        }, this.checkRequiredField = function() {
            for (var a = j.getMainView().getDocView(), b = a.getPageCount(), c = 0; b > c; c++) {
                var d = a.getPageView(c);
                if (null != d && null != n[c] && !n[c].CheckRequiredWidget()) return !1
            }
            return !0
        }, this.canFillForm = function() {
            return l
        }, this.highlight = function() {
            m = !m;
            for (var a in n) null != n[a] && n[a].changeHighlight(m)
        }, this.isHighlight = function() {
            return m
        }, this.getInitializedPageList = function() {
            return n
        }, this.getFormHtmlContent = function(a, d) {
            if (!b()) return "";
            var e = a.getPageIndex();
            if (a.isPageLoaded() && a.isPageLoadError()) return "";
            if (q[e] || (q[e] = !0, f(!1, [e], WebPDF.Config.requestRetryCount)), !n[e]) return "";
            var g = n[e],
                h = "";
            if (!g) return h;
            if (h = g.getHtmlCode(m, d), a.isPageLoaded()) {
                g.changeSize(d), h = c(g, h);
                var i = j.getMainView().getDocView();
                g.changeSize(i.getScale())
            }
            return h
        }, this.showFormWidget = function() {
            for (var a = j.getMainView().getDocView(), b = a.getVisiblePageRange(), c = [], d = 0, e = b.begin; e <= b.end; e++) {
                var g = a.getPageView(e);
                if (g.isPageLoaded() && !g.isPageLoadError()) {
                    if (o[e] = !0, !q[e]) {
                        q[e] = !0, c[d++] = e;
                        continue
                    }
                    n[e] && o[e] && n[e].ShowPage()
                }
            }
            c.length > 0 && f(!0, c, WebPDF.Config.requestRetryCount)
        }, this.onPageInvisible = function(a) {
            var b = j.getMainView().getDocView();
            for (var c in a) {
                var d = b.getPageView(c);
                o[d.getPageIndex()] = !1
            }
        }, this.onPageChanged = function(a) {
            r = a, k.updateForm()
        }, this.onPageShowComplete = function(a) {
            var b = a.getPageIndex();
            if (p[b])
                if (!a.isPageLoaded() || a.isPageLoadError()) n[b] = null;
                else {
                    var c = n[b];
                    if (c) {
                        var d = a.getPageBackgroundImgID(),
                            e = a.getDocView().getScale();
                        p[b] = !1, $("#" + d).after(c.getHtmlCode(m, e)), c.getRegisterActionCode(), c.getReadyBindCode(), o[b] && c.ShowPage(), c.changeSize(e)
                    }
                }
            return !0
        }, this.onPreDocViewResize = function() {
            var a = j.getMainView().getDocView().getScale();
            for (var b in n) null != n[b] && n[b].changeSize(a)
        }
    }, b.createPlugin = function(a) {
        var b = new WebPDF.FormPlugin(a);
        return WebPDF.g_pFormPlugin = b, WebPDF.g_formValue = new WebPDF.FormValue, b
    }
}), define("core/Plugins/Form/ActionJScript", [], function(require, exports, module) {
    function RunPDFJS(jsString) {
        try {
            eval(jsString)
        } catch (e) {}
    }

    function jsEncode(a) {
        return a = a.replace(/\n/g, "\\n")
    }

    function getFieldValue(a) {
        return WebPDF.g_formValue.GetItemValue(a)
    }

    function getFieldNumber(a) {
        var b = getFieldValue(a);
        return b
    }

    function getDigits(a) {
        var b = a.toString(),
            c = b.split(".", 2);
        return null == c || c.length < 2 ? (c = null, 0) : c[1].length
    }

    function AFSimple_Calculat(a, b) {
        AFSimple_Calculate(a, b)
    }

    function AFSimple_Calculate(a, b) {
        if ("undefined" != typeof fnElm) {
            var c = "",
                d = 0;
            switch (a) {
                case "AVG":
                    for (var e = NaN, f = 0; f < b.length; f++) {
                        var g = parseFloat(getFieldValue(b[f]));
                        if (!isNaN(g)) {
                            var h = getDigits(g);
                            d = d > h ? d : h, isNaN(e) && (e = 0), e += g
                        }
                    }
                    c = isNaN(e) ? "" : e / b.length;
                    break;
                case "SUM":
                    for (var e = NaN, f = 0; f < b.length; f++) {
                        var g = parseFloat(getFieldValue(b[f]));
                        if (!isNaN(g)) {
                            var h = getDigits(g);
                            d = d > h ? d : h, isNaN(e) && (e = 0), e += g
                        }
                    }
                    c = isNaN(e) ? "" : e;
                    break;
                case "PRD":
                    for (var i = NaN, f = 0; f < b.length; f++) {
                        var g = parseFloat(getFieldValue(b[f]));
                        if (!isNaN(g)) {
                            var h = getDigits(g);
                            d = d > h ? d : h, isNaN(i) && (i = 1), i *= g
                        }
                    }
                    c = isNaN(i) ? "" : i;
                    break;
                case "MIN":
                    for (var j = NaN, f = 0; f < b.length; f++) {
                        var g = parseFloat(getFieldValue(b[f]));
                        if (!isNaN(g)) {
                            var h = getDigits(g);
                            d = d > h ? d : h, isNaN(j) && (j = g), j > g && (j = g)
                        }
                    }
                    c = isNaN(j) ? "" : j;
                    break;
                case "MAX":
                    for (var k = NaN, f = 0; f < b.length; f++) {
                        var g = parseFloat(getFieldValue(b[f]));
                        if (!isNaN(g)) {
                            var h = getDigits(g);
                            d = d > h ? d : h, isNaN(k) && (k = g), g > k && (k = g)
                        }
                    }
                    c = isNaN(k) ? "" : k
            }
            fnElm.setFieldValue(c, !0)
        }
    }

    function AFRange_Validate(a, b, c, d) {
        if ("undefined" != typeof fnElm) {
            var e = "",
                f = fnElm.val();
            if ("" == f) return void fnElm.setFieldValue("");
            var g = NaN;
            if (g = parseFloat(f), isNaN(g)) return void fnElm.val(fnElm.getFieldValue());
            a && c ? (b > g || g > d) && (e = i18n.t("Form.IDS_FX_GTET") + b + i18n.t("Form.IDS_FX_AND_LTET") + d + ".") : a ? (s, b > g && (e = i18n.t("Form.IDS_FX_GTET") + b + ".")) : c && g > d && (e = i18n.t("Form.IDS_FX_AND_LTET") + d + "."), "" != e && (WebPDF.alert(WebPDF.g_pFormPlugin.getReaderApp(), null, e), fnElm.val(fnElm.getFieldValue()), fnElm.focus())
        }
    }

    function FXFormatNumber(a, b, c, d) {
        var e = ".",
            f = ",",
            g = "";
        switch (c) {
            case 0:
                break;
            case 1:
                f = "";
                break;
            case 2:
                e = ",", f = ".";
                break;
            case 3:
                e = ",", f = ""
        }
        var h = a.length % 3;
        g = a.substr(0, h);
        for (var i = h; i < a.length; i += 3) 0 != g.length && (g += f), g += a.substr(i, 3);
        if (d > 0) {
            for (b = b.substring(0, d); b.length < d;) b += "0";
            g = g + e + b
        }
        return g
    }

    function AFNumber_Format(a, b, c, d, e, f) {
        if ("undefined" != typeof fnElm) {
            if ("" == fnElm.val()) return void fnElm.setFieldValue("");
            var g = parseFloat(fnElm.val()),
                h = 0 > g ? -1 : 1;
            if (isNaN(g)) return void fnElm.val(fnElm.getFieldValue());
            var i = "";
            i = (2 == c || 3 == c) && 0 > h ? "(" : "", f && (i += e), g *= h;
            var j = g.toString().split(".", 2),
                k = j[0],
                l = "";
            j.length > 1 && (l = j[1]), i += FXFormatNumber(k, l, b, a), f || (i += e), (2 == c || 3 == c) && 0 > h && (i += ")"), (0 != c || f) && (g = Math.abs(g)), (1 == c || 3 == c) && (h > 0 ? fnElm.css("color", "0x000") : fnElm.css("color", "0xF00")), 0 > h && f && 0 == c && (i = "-" + i), fnElm.setFieldValue(i)
        }
    }

    function AFPercent_Format(a, b) {
        if ("undefined" != typeof fnElm) {
            if ("" == fnElm.val()) return void fnElm.setFieldValue("");
            var c = parseFloat(100 * fnElm.val());
            if (isNaN(c)) return void fnElm.val(fnElm.getFieldValue());
            c += .005;
            var d = c.toString().split(".", 2),
                e = d[0],
                f = "";
            d.length > 1 && (f = d[1]), formatStr = FXFormatNumber(e, f, b, a) + "%", fnElm.setFieldValue(formatStr)
        }
    }

    function FXFormatDate(a, b) {
        a = a.replace(/%/g, "%69");
        var c = new Array,
            d = b.getFullYear().toString();
        return d = "0000" + d, a = a.replace(/([^y])y{4}(?!y)|(^)y{4}(?!y)/g, "$1" + d.substr(d.length - 4, 4)), a = a.replace(/([^y])y{2}(?!y)|(^)y{2}(?!y)/g, "$1" + d.substr(d.length - 2, 2)), d = AFGetMonthString(b.getMonth() + 1), c["%mmmm"] = d, a = a.replace(/([^m])m{4}(?!m)|(^)m{4}(?!m)/g, "$1%mmmm"), c["%mmm"] = d.substr(0, 3), a = a.replace(/([^m])m{3}(?!m)|(^)m{3}(?!m)/g, "$1%mmm"), a = a.replace(/([^m])m{1}(?!m)|(^)m{1}(?!m)/g, "$1" + (b.getMonth() + 1)), d = (b.getMonth() + 1).toString(), 1 == d.length && (d = "0" + d), a = a.replace(/([^m])m{2}(?!m)|(^)m{2}(?!m)/g, "$1" + d), d = AFGetDayString(b.getDay()), c["%dddd"] = d, a = a.replace(/([^d])d{4}(?!d)|(^)d{4}(?!d)/g, "$1%dddd"), c["%ddd"] = d.substr(0, 3), a = a.replace(/([^d])d{3}(?!d)|(^)d{3}(?!d)/g, "$1%ddd"), a = a.replace(/([^d])d{1}(?!d)|(^)d{1}(?!d)/g, "$1" + b.getDate()), d = b.getDate().toString(), 1 == d.length && (d = "0" + d), a = a.replace(/([^d])d{2}(?!d)|(^)d{2}(?!d)/g, "$1" + d), a = a.replace(/([^H])H{1}(?!H)|(^)H{1}(?!H)/g, "$1" + b.getHours()), d = b.getHours().toString(), 1 == d.length && (d = "0" + d), a = a.replace(/([^H])H{2}(?!H)|(^)H{2}(?!H)/g, "$1" + d), a = a.replace(/([^h])h{1}(?!h)|(^)h{1}(?!h)/g, "$1" + (b.getHours() > 12 ? b.getHours() - 12 : b.getHours())), d = (b.getHours() > 12 ? b.getHours() - 12 : b.getHours()).toString(), 1 == d.length && (d = "0" + d), a = a.replace(/([^h])h{2}(?!h)|(^)h{2}(?!h)/g, "$1" + d), a = a.replace(/([^M])M{1}(?!M)|(^)M{1}(?!M)/g, "$1" + b.getMinutes()), d = b.getMinutes().toString(), 1 == d.length && (d = "0" + d), a = a.replace(/([^M])M{2}(?!M)|(^)M{2}(?!M)/g, "$1" + d), a = a.replace(/([^s])s{1}(?!s)|(^)s{1}(?!s)/g, "$1" + b.getSeconds()), d = b.getSeconds().toString(), 1 == d.length && (d = "0" + d), a = a.replace(/([^s])s{2}(?!s)|(^)s{2}(?!s)/g, "$1" + d), d = AFGetMeridianString(b.getHours()), a = a.replace(/([^t])t{2}(?!t)|(^)t{2}(?!t)/g, "$1" + d), 1 == d.length && (d = d.charAt(0)), a = a.replace(/([^t])t{1}(?!t)|(^)t{1}(?!t)/g, "$1" + d), a = a.replace(/%mmmm/g, c["%mmmm"]), a = a.replace(/%mmm/g, c["%mmm"]), a = a.replace(/%dddd/g, c["%dddd"]), a = a.replace(/%ddd/g, c["%ddd"]), a = a.replace(/%69/g, "%"), c = null, a
    }

    function AFDate_Format(a) {
        if ("undefined" != typeof fnElm) {
            var b = fnElm.val();
            if (b) {
                var c = new Array("m/d", "m/d/yy", "mm/dd/yy", "mm/yy", "d-mmm", "d-mmm-yy", "dd-mmm-yy", "yy-mm-dd", "mmm-yy", "mmmm-yy", "mmm d, yyyy", "mmmm d, yyyy", "m/d/yy h:MM tt", "m/d/yy HH:MM"),
                    d = AFParseDateEx(b, c[a]);
                if (!d) {
                    if (_bAlert) return WebPDF.alert(WebPDF.g_pFormPlugin.getReaderApp(), null, i18n.t("Form.IDS_FX_DF") + c[a].toString()), void fnElm.val(fnElm.getFieldValue());
                    d = new Date
                }
                fnElm.setFieldValue(FXFormatDate(c[a], d))
            }
        }
    }

    function AFDate_FormatEx(a) {
        if ("undefined" != typeof fnElm && (value = fnElm.val(), value)) {
            var b = AFParseDateEx(value, a);
            if (!b) {
                if (_bAlert) return WebPDF.alert(WebPDF.g_pFormPlugin.getReaderApp(), null, i18n.t("Form.IDS_FX_DF") + a), void fnElm.val(fnElm.getFieldValue());
                b = new Date
            }
            fnElm.setFieldValue(FXFormatDate(a, b))
        }
    }

    function AFTime_Format(a) {
        var b = new Array("HH:MM", "h:MM tt", "HH:MM:ss", "h:MM:ss tt");
        AFTime_FormatEx(b[a])
    }

    function AFTime_FormatEx(a) {
        if ("undefined" != typeof fnElm && (value = fnElm.val(), value)) {
            var b = AFParseDateEx(value, a);
            if (!b) {
                if (_bAlert) return WebPDF.alert(WebPDF.g_pFormPlugin.getReaderApp(), null, i18n.t("Form.IDS_FX_TF") + a), void fnElm.val(fnElm.getFieldValue());
                b = new Date
            }
            fnElm.setFieldValue(FXFormatDate(a, b))
        }
    }

    function AFParseDateEx(a, b) {
        return MakeRegularDate(a, b)
    }

    function AFGetMonthString(a) {
        var b = new RegExp("(\\w+)\\[" + a + "\\]"),
            c = b.exec(IDS_MONTH_INFO);
        return c ? c[1] : null
    }

    function AFGetDayString(a) {
        var b = new RegExp("(\\w+)\\[" + a + "\\]"),
            c = b.exec(IDS_DAY_INFO);
        return c ? c[1] : null
    }

    function AFGetMeridianString(a) {
        return a > 11 ? "PM" : "AM"
    }

    function MakeRegularDate(a, b) {
        var c = ParseFormatDate(a, b);
        return null == c && (c = ParseNormalDate(a)), c
    }

    function ParseFormatDate(a, b) {
        var c = new Date,
            d = c.getFullYear(),
            e = c.getMonth() + 1,
            f = c.getDate(),
            g = c.getHours(),
            h = c.getMinutes(),
            i = c.getSeconds(),
            j = 99,
            k = !1,
            l = !1;
        bWrongFormat = !1;
        for (var m = 0, n = 0; m < b.length && !l;) {
            var o = b.charAt(m);
            switch (o) {
                case "y":
                case "m":
                case "d":
                case "H":
                case "h":
                case "M":
                case "s":
                case "t":
                    var p = n,
                        q = 0,
                        r = null;
                    if (b.charAt(m + 1) != o) switch (o) {
                        case "y":
                            m++, n++;
                            break;
                        case "m":
                            r = ParseStringInteger(a, n, 2), e = r.nRet, q = r.nSkip, m++, n += q;
                            break;
                        case "d":
                            r = ParseStringInteger(a, n, 2), f = r.nRet, q = r.nSkip, m++, n += q;
                            break;
                        case "H":
                            r = ParseStringInteger(a, n, 2), g = r.nRet, q = r.nSkip, m++, n += q;
                            break;
                        case "h":
                            r = ParseStringInteger(a, n, 2), g = r.nRet, q = r.nSkip, m++, n += q;
                            break;
                        case "M":
                            r = ParseStringInteger(a, n, 2), h = r.nRet, q = r.nSkip, m++, n += q;
                            break;
                        case "s":
                            r = ParseStringInteger(a, n, 2), i = r.nRet, q = r.nSkip, m++, n += q;
                            break;
                        case "t":
                            k = "p" == a.charAt(m), m++, n++
                    } else if (b.charAt(m + 1) == o && b.charAt(m + 2) != o) switch (o) {
                        case "y":
                            r = ParseStringInteger(a, n, 4), d = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "m":
                            r = ParseStringInteger(a, n, 2), e = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "d":
                            r = ParseStringInteger(a, n, 2), f = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "H":
                            r = ParseStringInteger(a, n, 2), g = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "h":
                            r = ParseStringInteger(a, n, 2), g = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "M":
                            r = ParseStringInteger(a, n, 2), h = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "s":
                            r = ParseStringInteger(a, n, 2), i = r.nRet, q = r.nSkip, m += 2, n += q;
                            break;
                        case "t":
                            k = "p" == a.charAt(n) && "m" == a.charAt(n + 1), m += 2, n += 2
                    } else if (b.charAt(m + 1) == o && b.charAt(m + 2) == o && b.charAt(m + 3) != o) switch (o) {
                        case "m":
                            r = ParseStringString(a, n), q = r.nSkip;
                            for (var s = r.swRet, t = !1, u = 0; 12 > u; u++)
                                if (s.toLowerCase() == AFGetMonthString(u + 1).substr(0, 3).toLowerCase()) {
                                    e = u + 1, m += 3, n += q, t = !0;
                                    break
                                }
                            t || (r = ParseStringInteger(a, n, 3), e = r.nRet, q = r.nSkip, m += 3, n += q);
                            break;
                        case "y":
                            break;
                        default:
                            m += 3, n += 3
                    } else if (b.charAt(m + 1) == o && b.charAt(m + 2) == o && b.charAt(m + 3) == o && b.charAt(m + 4) != o) switch (o) {
                        case "y":
                            r = ParseStringInteger(a, n, 4), d = r.nRet, q = r.nSkip, n += q, m += 4;
                            break;
                        case "m":
                            var t = !1;
                            r = ParseStringString(a, n), q = r.nSkip;
                            var s = r.swRet;
                            s = s.toLowerCase();
                            for (var u = 0; 12 > u; u++) {
                                var v = AFGetMonthString(u + 1);
                                if (v = v.toLowerCase(), v.indexOf(s, 0) >= 0) {
                                    e = u + 1, m += 4, n += q, t = !0;
                                    break
                                }
                            }
                            t || (r = ParseStringInteger(a, n, 4), e = r.nRet, q = r.nSkip, m += 4, n += q);
                            break;
                        default:
                            m += 4, n += 4
                    } else b.charAt(m) != a.charAt(n) && (bWrongFormat = !0, l = !0), m++, n++;
                    p == n && (bWrongFormat = !0, l = !0);
                    break;
                default:
                    a.length <= n ? l = !0 : b.charAt(m) != a.charAt(n) && (bWrongFormat = !0, l = !0), m++, n++
            }
        }
        return k && (g += 12), d >= 0 && j >= d && (d += 2e3), (1 > e || e > 12) && (bWrongFormat = !0), (1 > f || f > 31) && (bWrongFormat = !0), (0 > g || g > 24) && (bWrongFormat = !0), (0 > h || h > 60) && (bWrongFormat = !0), (0 > i || i > 60) && (bWrongFormat = !0), bWrongFormat ? null : new Date(d, e - 1, f, g, h, i)
    }

    function IsDigit(a) {
        return a >= "0" && "9" >= a
    }

    function ParseStringInteger(a, b, c) {
        var d = new Array;
        d.nRet = 0, d.nSkip = 0;
        for (var e = b, f = a.length; f > e && !(e - b > 10); e++) {
            var g = a.charAt(e);
            if (!IsDigit(g)) break;
            if (d.nRet = 10 * d.nRet + (g - "0"), d.nSkip = e - b + 1, d.nSkip >= c) break
        }
        return d
    }

    function ParseStringString(a, b) {
        var c = new Array;
        c.swRet = null, c.nSkip = 0;
        for (var d = b, e = a.length; e > d; d++) {
            var f = a.charAt(d);
            if (!(f >= "a" && "z" >= f || f >= "A" && "Z" >= f)) break;
            c.swRet += f, c.nSkip = d - b + 1
        }
        return c
    }

    function GuessDate(a, b, c, d, e, f, g) {
        var h = new Array;
        if (h.y = e, h.m = f, h.d = g, 2 == a) {
            if (b >= 1 && 12 >= b && c >= 1 && 31 >= c) return h.m = b, h.d = c, h;
            if (b >= 1 && 31 >= b && c >= 1 && 12 >= c) return h.m = c, h.d = b, h
        } else if (a >= 3) {
            if (b > 12 && c >= 1 && 12 >= c && d >= 1 && 31 >= d) return h.y = b, h.m = c, h.d = d, h;
            if (b >= 1 && 12 >= b && c >= 1 && 31 >= c && d > 31) return h.y = d, h.m = b, h.d = c, h;
            if (b >= 1 && 31 >= b && c >= 1 && 12 >= c && d > 31) return h.y = d, h.m = c, h.d = b, h
        }
        return null
    }

    function GuessTime(a, b, c, d, e, f, g) {
        var h = new Array;
        if (h.h = e, h.M = f, h.s = g, 2 == a) {
            if (b >= 0 && 23 >= b && c >= 0 && 59 >= c) return h.h = b, h.M = c, h.s = 0, h
        } else if (3 == a && b >= 0 && 23 >= b && c >= 0 && 59 >= c && d >= 0 && 59 >= d) return h.h = b, h.M = c, h.s = d, h;
        return null
    }

    function ParseNormalDate(a) {
        for (var b = new Date, c = b.getFullYear(), d = b.getMonth() + 1, e = b.getDate(), f = b.getHours(), g = b.getMinutes(), h = b.getSeconds(), i = new Array, j = 0; 6 > j; j++) i[j] = 0;
        for (var k = !1, l = 0, m = 0, n = a.length; n > m && !(l > 5);) {
            var o = a.charAt(m);
            if (IsDigit(o)) {
                var p = 0,
                    q = ParseStringInteger(a, m, 4);
                i[l++] = q.nRet, p = q.nSkip, m += p
            } else ":" == o && (k = !0), m++
        }
        if (bWrongFormat = !0, k)
            if (3 >= l) {
                var r = GuessTime(l, i[0], i[1], i[2], f, g, h);
                r && (f = r.h, g = r.M, h = r.s, bWrongFormat = !1)
            } else if (4 == l) {
            var r = GuessDate(2, i[0], i[1], 0, c, d, e);
            r && (c = r.y, d = r.m, e = r.d, r = GuessTime(2, i[2], i[3], 0, f, g, h), r && (f = r.h, g = r.M, h = r.s, bWrongFormat = !1))
        } else if (5 == l) {
            var r = GuessDate(3, i[0], i[1], i[2], c, d, e);
            if (r && (c = r.y, d = r.m, e = r.d, r = GuessTime(2, i[3], i[4], 0, f, g, h), r && (f = r.h, g = r.M, h = r.s, bWrongFormat = !1)), bWrongFormat) {
                var r = GuessDate(2, i[0], i[1], 0, c, d, e);
                r && (c = r.y, d = r.m, e = r.d, r = GuessTime(3, i[2], i[3], i[4], f, g, h), r && (f = r.h, g = r.M, h = r.s, bWrongFormat = !1))
            }
        } else if (6 == l) {
            var r = GuessDate(3, i[0], i[1], i[2], c, d, e);
            r && (c = r.y, d = r.m, e = r.d, r = GuessTime(3, i[3], i[4], i[5], f, g, h), r && (f = r.h, g = r.M, h = r.s, bWrongFormat = !1))
        }
        if (bWrongFormat) {
            var r = GuessDate(l, i[0], i[1], i[2], c, d, e);
            r && (c = r.y, d = r.m, e = r.d, bWrongFormat = l > 3)
        }
        return bWrongFormat ? null : new Date(c, d - 1, e, f, g, h)
    }
    var option = {
            WebPDF: !0,
            eqnull: !0,
            noarg: !0,
            eqeqeq: !0,
            bitwise: !0,
            undef: !0,
            curly: !0,
            indent: 4,
            maxerr: 1
        },
        _bAlert = !0;
    $.fn.getActionEventString = function(a) {
        return "C" == a ? "C" : "V" == a || "F" == a ? "blur" : ""
    }, $.fn.triggerJSAction = function() {
        $.event.trigger("C")
    }, $.fn.AddActionJS = function(a, b, c) {
        if (b = $.trim(b), "" != b) {
            var d = this.getActionEventString(a);
            "" != d && (b = jsEncode(b), this.on(d, function() {
                fnElm = $(this), _bAlert = c, RunPDFJS(b), fnElm = null, _bAlert = !0
            }))
        }
    }, $.fn.setFieldValue = function(a, b) {
        var c = !1;
        c = "undefined" == typeof b ? !1 : b, c ? WebPDF.g_formValue.SetItemValue_ActionJScript($(this).attr("name"), a) : WebPDF.g_formValue.SetItemValue_ActionJScript($(this).attr("name"), $(this).val()), $(this).val(a)
    }, $.fn.getFieldValue = function() {
        return WebPDF.g_formValue.GetItemValue($(this).attr("name"))
    };
    var IDS_MONTH_INFO = "January[1]February[2]March[3]April[4]May[5]June[6]July[7]August[8]September[9]October[10]Movember[11]December[12]Jan[1]Feb[2]Mar[3]Apr[4]Jun[6]Jul[7]Aug[8]Sep[9]Oct[10]Mov[11]Dec[12]",
        IDS_DAY_INFO = "Sunday[0]Monday[1]Tuesday[2]Wednesday[3]Thursday[4]Friday[5]Saturday[6]"
}), define("core/Plugins/Form/jshint", [], function(a, b, c) {
    var d = function() {
        "use strict";

        function a() {}

        function b(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b)
        }

        function c(a, b) {
            void 0 === Ma[a] && void 0 === La[a] && i("Bad option: '" + a + "'.", b)
        }

        function e(a, c) {
            var d = null;
            for (d in c) b(c, d) && (a[d] = c[d])
        }

        function f() {
            oa.couch && e(pa, Qa), oa.rhino && e(pa, $a), oa.prototypejs && e(pa, Za), oa.node && (e(pa, Ya), oa.globalstrict = !0), oa.devel && e(pa, Ra), oa.dojo && e(pa, Ta), oa.browser && e(pa, Pa), oa.nonstandard && e(pa, ab), oa.jquery && e(pa, Wa), oa.mootools && e(pa, Xa), oa.wsh && e(pa, cb), oa.esnext && za(), oa.WebPDF && e(pa, Sa), oa.globalstrict && oa.strict !== !1 && (oa.strict = !0)
        }

        function g(a, b, c) {
            var d = Math.floor(b / ia.length * 100);
            throw {
                name: "JSHintError",
                line: b,
                character: c,
                message: a + " (" + d + "% scanned).",
                raw: a
            }
        }

        function h(a, b, c, e) {
            return d.undefs.push([a, b, c, e])
        }

        function i(a, b, c, e, f, h) {
            var i, j, k;
            return b = b || ma, "(end)" === b.id && (b = xa), j = b.line || 0, i = b.from || 0, k = {
                id: "(error)",
                raw: a,
                evidence: ia[j - 1] || "",
                line: j,
                character: i,
                a: c,
                b: e,
                c: f,
                d: h
            }, k.reason = a.supplant(k), d.errors.push(k), oa.passfail && g("Stopping. ", j, i), Aa += 1, Aa >= oa.maxerr && g("Too many errors.", j, i), k
        }

        function j(a, b, c, d, e, f, g) {
            return i(a, {
                line: b,
                from: c
            }, d, e, f, g)
        }

        function k(a, b, c, d, e, f) {
            i(a, b, c, d, e, f)
        }

        function l(a, b, c, d, e, f, g) {
            return k(a, {
                line: b,
                from: c
            }, d, e, f, g)
        }

        function m(a, c) {
            "hasOwnProperty" === a && i("'hasOwnProperty' is a really bad name."), b(ba, a) && !ba["(global)"] && (ba[a] === !0 ? oa.latedef && i("'{a}' was used before it was defined.", ma, a) : oa.shadow || "exception" === c || i("'{a}' is already defined.", ma, a)), ba[a] = c, ba["(global)"] ? (da[a] = ba, b(ea, a) && (oa.latedef && i("'{a}' was used before it was defined.", ma, a), delete ea[a])) : ta[a] = ba
        }

        function n() {
            var a, b, d, e, g, h, i = ma.value;
            switch (i) {
                case "*/":
                    k("Unbegun comment.");
                    break;
                case "/*members":
                case "/*member":
                    i = "/*members", la || (la = {}), b = la;
                    break;
                case "/*jshint":
                case "/*jslint":
                    b = oa, d = La;
                    break;
                case "/*global":
                    b = pa;
                    break;
                default:
                    k("What?")
            }
            e = db.token();
            a: for (var j = 0; 1 > j;) {
                for (var l = 0; 1 > l;) {
                    if ("special" === e.type && "*/" === e.value) break a;
                    if ("(endline)" !== e.id && "," !== e.id) break;
                    e = db.token()
                }
                "(string)" !== e.type && "(identifier)" !== e.type && "/*members" !== i && k("Bad option.", e), h = db.token(), ":" === h.id ? (h = db.token(), b === la && k("Expected '{a}' and instead saw '{b}'.", e, "*/", ":"), "/*jshint" === i && c(e.value, e), "indent" !== e.value || "/*jshint" !== i && "/*jslint" !== i ? "maxerr" !== e.value || "/*jshint" !== i && "/*jslint" !== i ? "maxlen" !== e.value || "/*jshint" !== i && "/*jslint" !== i ? "validthis" === e.value ? ba["(global)"] ? k("Option 'validthis' can't be used in a global scope.") : "true" === h.value || "false" === h.value ? b[e.value] = "true" === h.value : k("Bad option value.", h) : "true" === h.value || "false" === h.value ? "/*jslint" === i ? (g = Oa[e.value] || e.value, b[g] = "true" === h.value, void 0 !== Na[g] && (b[g] = !b[g])) : b[e.value] = "true" === h.value : k("Bad option value.", h) : (a = +h.value, ("number" != typeof a || !isFinite(a) || 0 >= a || Math.floor(a) !== a) && k("Expected a small integer and instead saw '{a}'.", h, h.value), b.maxlen = a) : (a = +h.value, ("number" != typeof a || !isFinite(a) || 0 >= a || Math.floor(a) !== a) && k("Expected a small integer and instead saw '{a}'.", h, h.value), b.maxerr = a) : (a = +h.value, ("number" != typeof a || !isFinite(a) || 0 >= a || Math.floor(a) !== a) && k("Expected a small integer and instead saw '{a}'.", h, h.value), b.white = !0, b.indent = a), e = db.token()) : (("/*jshint" === i || "/*jslint" === i) && k("Missing option value.", e), b[e.value] = !1, e = h)
            }
            d && f()
        }

        function o(a) {
            for (var b, c = a || 0, d = 0; c >= d;) b = ja[d], b || (b = ja[d] = db.token()), d += 1;
            return b
        }

        function p(a, b) {
            switch (xa.id) {
                case "(number)":
                    "." === ma.id && i("A dot following a number can be confused with a decimal point.", xa);
                    break;
                case "-":
                    ("-" === ma.id || "--" === ma.id) && i("Confusing minusses.");
                    break;
                case "+":
                    ("+" === ma.id || "++" === ma.id) && i("Confusing plusses.")
            }("(string)" === xa.type || xa.identifier) && (aa = xa.value), a && ma.id !== a && (b ? "(end)" === ma.id ? i("Unmatched '{a}'.", b, b.id) : i("Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.", ma, a, b.id, b.line, ma.value) : ("(identifier)" !== ma.type || ma.value !== a) && i("Expected '{a}' and instead saw '{b}'.", ma, a, ma.value)), ra = xa, xa = ma;
            for (var c = 0; 1 > c;) {
                if (ma = ja.shift() || db.token(), "(end)" === ma.id || "(error)" === ma.id) return;
                if ("special" === ma.type) n();
                else if ("(endline)" !== ma.id) break
            }
        }

        function q(a, b) {
            var c, d = !1,
                e = !1;
            if ("(end)" === ma.id && k("Unexpected early end of program.", xa), p(), b && (aa = "anonymous", ba["(verb)"] = xa.value), b === !0 && xa.fud) c = xa.fud();
            else {
                if (xa.nud) c = xa.nud();
                else {
                    if ("(number)" === ma.type && "." === xa.id) return i("A leading decimal point can be confused with a dot: '.{a}'.", xa, ma.value), p(), xa;
                    k("Expected an identifier and instead saw '{a}'.", xa, xa.id)
                }
                for (; a < ma.lbp;) d = "Array" === xa.value, e = "Object" === xa.value, c && (c.value || c.first && c.first.value) && ("new" !== c.value || c.first && c.first.value && "." === c.first.value) && (d = !1, c.value !== xa.value && (e = !1)), p(), xa.led ? c = xa.led(c) : k("Expected an operator and instead saw '{a}'.", xa, xa.id)
            }
            return c
        }

        function r(a, b) {
            a = a || xa, b = b || ma, oa.white && a.character !== b.from && a.line === b.line && (a.from += a.character - a.from, i("Unexpected space after '{a}'.", a, a.value))
        }

        function s(a, b) {
            a = a || xa, b = b || ma, !oa.white || a.character === b.from && a.line === b.line || i("Unexpected space before '{a}'.", b, b.value)
        }

        function t(a, b) {
            a = a || xa, b = b || ma, oa.white && !a.comment && a.line === b.line && r(a, b)
        }

        function u(a, b) {
            oa.white && (a = a || xa, b = b || ma, a.line === b.line && a.character === b.from && (a.from += a.character - a.from, i("Missing space after '{a}'.", a, a.value)))
        }

        function v(a, b) {
            a = a || xa, b = b || ma, oa.laxbreak || a.line === b.line ? oa.white && (a = a || xa, b = b || ma, a.character === b.from && (a.from += a.character - a.from, i("Missing space after '{a}'.", a, a.value))) : i("Bad line breaking before '{a}'.", b, b.id)
        }

        function w(a) {
            var b;
            oa.white && "(end)" !== ma.id && (b = ga + (a || 0), ma.from !== b && i("Expected '{a}' to have an indentation at {b} instead at {c}.", ma, ma.value, b, ma.from))
        }

        function x(a) {
            a = a || xa, a.line !== ma.line && i("Line breaking error '{a}'.", a, a.value)
        }

        function y() {
            xa.line !== ma.line ? oa.laxcomma || (y.first && (i("Comma warnings can be turned off with 'laxcomma'"), y.first = !1), i("Bad line breaking before '{a}'.", xa, ma.id)) : !xa.comment && xa.character !== ma.from && oa.white && (xa.from += xa.character - xa.from, i("Unexpected space after '{a}'.", xa, xa.value)), p(","), u(xa, ma)
        }

        function z(a, b) {
            var c = bb[a];
            return c && "object" == typeof c || (bb[a] = c = {
                id: a,
                lbp: b,
                value: a
            }), c
        }

        function A(a) {
            return z(a, 0)
        }

        function B(a, b) {
            var c = A(a);
            return c.identifier = c.reserved = !0, c.fud = b, c
        }

        function C(a, b) {
            var c = B(a, b);
            return c.block = !0, c
        }

        function D(a) {
            var b = a.id.charAt(0);
            return (b >= "a" && "z" >= b || b >= "A" && "Z" >= b) && (a.identifier = a.reserved = !0), a
        }

        function E(a, b) {
            var c = z(a, 150);
            return D(c), c.nud = "function" == typeof b ? b : function() {
                return this.right = q(150), this.arity = "unary", ("++" === this.id || "--" === this.id) && (oa.plusplus ? i("Unexpected use of '{a}'.", this, this.id) : this.right.identifier && !this.right.reserved || "." === this.right.id || "[" === this.right.id || i("Bad operand.", this)), this
            }, c
        }

        function F(a, b) {
            var c = A(a);
            return c.type = a, c.nud = b, c
        }

        function G(a, b) {
            var c = F(a, b);
            return c.identifier = c.reserved = !0, c
        }

        function H(a, b) {
            return G(a, function() {
                return "function" == typeof b && b(this), this
            })
        }

        function I(a, b, c, d) {
            var e = z(a, c);
            return D(e), e.led = function(e) {
                return d || (v(ra, xa), u(xa, ma)), "in" === a && "!" === e.id && i("Confusing use of '{a}'.", e, "!"), "function" == typeof b ? b(e, this) : (this.left = e, this.right = q(c), this)
            }, e
        }

        function J(a, b) {
            var c = z(a, 100);
            return c.led = function(a) {
                v(ra, xa), u(xa, ma);
                var c = q(100);
                return a && "NaN" === a.id || c && "NaN" === c.id ? i("Use the isNaN function to compare with NaN.", this) : b && b.apply(this, [a, c]), "!" === a.id && i("Confusing use of '{a}'.", a, "!"), "!" === c.id && i("Confusing use of '{a}'.", c, "!"), this.left = a, this.right = c, this
            }, c
        }

        function K(a) {
            return a && ("(number)" === a.type && 0 === +a.value || "(string)" === a.type && "" === a.value || "null" === a.type && !oa.eqnull || "true" === a.type || "false" === a.type || "undefined" === a.type)
        }

        function L(a, b) {
            return z(a, 20).exps = !0, I(a, function(a, b) {
                if (b.left = a, pa[a.value] === !1 && ta[a.value]["(global)"] === !0 ? i("Read only.", a) : a["function"] && i("'{a}' is a function.", a, a.value), a) {
                    if (oa.esnext && "const" === ba[a.value] && i("Attempting to override '{a}' which is a constant", a, a.value), "." === a.id || "[" === a.id) return a.left && "arguments" !== a.left.value || i("Bad assignment.", b), b.right = q(19), b;
                    if (a.identifier && !a.reserved) return "exception" === ba[a.value] && i("Do not assign to the exception parameter.", a), b.right = q(19), b;
                    a === bb["function"] && i("Expected an identifier in an assignment and instead saw a function invocation.", xa)
                }
                k("Bad assignment.", b)
            }, 20)
        }

        function M(a, b, c) {
            var d = z(a, c);
            return D(d), d.led = "function" == typeof b ? b : function(a) {
                return oa.bitwise && i("Unexpected use of '{a}'.", this, this.id), this.left = a, this.right = q(c), this
            }, d
        }

        function N(a) {
            return z(a, 20).exps = !0, I(a, function(a, b) {
                return oa.bitwise && i("Unexpected use of '{a}'.", b, b.id), u(ra, xa), u(xa, ma), a ? "." === a.id || "[" === a.id || a.identifier && !a.reserved ? (q(19), b) : (a === bb["function"] && i("Expected an identifier in an assignment, and instead saw a function invocation.", xa), b) : void k("Bad assignment.", b)
            }, 20)
        }

        function O(a, b) {
            var c = z(a, 150);
            return c.led = function(a) {
                return oa.plusplus ? i("Unexpected use of '{a}'.", this, this.id) : a.identifier && !a.reserved || "." === a.id || "[" === a.id || i("Bad operand.", this), this.left = a, this
            }, c
        }

        function P(a) {
            return ma.identifier ? (p(), xa.reserved && !oa.es5 && (a && "undefined" === xa.value || i("Expected an identifier and instead saw '{a}' (a reserved word).", xa, xa.id)), xa.value) : void 0
        }

        function Q(a) {
            var b = P(a);
            return b ? b : void("function" === xa.id && "(" === ma.id ? i("Missing name in function declaration.") : k("Expected an identifier and instead saw '{a}'.", ma, ma.value))
        }

        function R(a) {
            var b, c = 0;
            if (";" === ma.id && !na)
                for (var d = 0; 1 > d;) {
                    if (b = o(c), b.reach) return;
                    if ("(endline)" !== b.id) {
                        if ("function" === b.id) {
                            if (!oa.latedef) break;
                            i("Inner functions should be listed at the top of the outer function.", b);
                            break
                        }
                        i("Unreachable '{a}' after '{b}'.", b, b.value, a);
                        break
                    }
                    c += 1
                }
        }

        function S(a) {
            var b, c = ga,
                d = ta,
                e = ma;
            if (";" === e.id) return void p(";");
            if (e.identifier && !e.reserved && ":" === o().id && (p(), p(":"), ta = Object.create(d), m(e.value, "label"),
                    ma.labelled || i("Label '{a}' on {b} statement.", ma, e.value, ma.value), Ia.test(e.value + ":") && i("Label '{a}' looks like a javascript url.", e, e.value), ma.label = e.value, e = ma), a || w(), b = q(0, !0), !e.block) {
                if (oa.expr || b && b.exps ? oa.nonew && "(" === b.id && "new" === b.left.id && i("Do not use 'new' for side effects.") : i("Expected an assignment or function call and instead saw an expression.", xa), "," === ma.id) return y();
                ";" !== ma.id ? oa.asi || oa.lastsemic && "}" === ma.id && ma.line === xa.line || j("Missing semicolon.", xa.line, xa.character) : (r(xa, ma), p(";"), u(xa, ma))
            }
            return ga = c, ta = d, b
        }

        function T(a) {
            for (var b, c = []; !ma.reach && "(end)" !== ma.id;) ";" === ma.id ? (b = o(), b && "(" === b.id || i("Unnecessary semicolon."), p(";")) : c.push(S(a === ma.line));
            return c
        }

        function U() {
            for (var a, b, c, d = 0; 1 > d && "(string)" === ma.id;) {
                if (b = o(0), "(endline)" === b.id) {
                    a = 1;
                    do c = o(a), a += 1; while ("(endline)" === c.id);
                    if (";" !== c.id) {
                        if ("(string)" !== c.id && "(number)" !== c.id && "(regexp)" !== c.id && c.identifier !== !0 && "}" !== c.id) break;
                        i("Missing semicolon.", ma)
                    } else b = c
                } else if ("}" === b.id) i("Missing semicolon.", b);
                else if (";" !== b.id) break;
                w(), p(), va[xa.value] && i('Unnecessary directive "{a}".', xa, xa.value), "use strict" === xa.value && (oa.newcap = !0, oa.undef = !0), va[xa.value] = !0, ";" === b.id && p(";")
            }
        }

        function V(a, c, d) {
            var e, f, g, h, j, l = fa,
                m = ga,
                n = ta;
            if (fa = a, a && oa.funcscope || (ta = Object.create(ta)), u(xa, ma), g = ma, "{" === ma.id) {
                if (p("{"), h = xa.line, "}" !== ma.id) {
                    for (ga += oa.indent; !a && ma.from > ga;) ga += oa.indent;
                    if (d) {
                        f = {};
                        for (j in va) b(va, j) && (f[j] = va[j]);
                        U(), oa.strict && ba["(context)"]["(global)"] && (f["use strict"] || va["use strict"] || i('Missing "use strict" statement.'))
                    }
                    e = T(h), d && (va = f), ga -= oa.indent, h !== ma.line && w()
                } else h !== ma.line && w();
                p("}", g), ga = m
            } else a ? ((!c || oa.curly) && i("Expected '{a}' and instead saw '{b}'.", ma, "{", ma.value), na = !0, ga += oa.indent, e = [S(ma.line === xa.line)], ga -= oa.indent, na = !1) : k("Expected '{a}' and instead saw '{b}'.", ma, "{", ma.value);
            return ba["(verb)"] = null, a && oa.funcscope || (ta = n), fa = l, !a || !oa.noempty || e && 0 !== e.length || i("Empty block."), e
        }

        function W(a) {
            la && "boolean" != typeof la[a] && i("Unexpected /*member '{a}'.", xa, a), "number" == typeof ka[a] ? ka[a] += 1 : ka[a] = 1
        }

        function X(a) {
            var b = a.value,
                c = a.line,
                d = ea[b];
            "function" == typeof d && (d = !1), d ? d[d.length - 1] !== c && d.push(c) : (d = [c], ea[b] = d)
        }

        function Y() {
            var a = P(!0);
            return a || ("(string)" === ma.id ? (a = ma.value, p()) : "(number)" === ma.id && (a = ma.value.toString(), p())), a
        }

        function Z() {
            var a, b = ma,
                c = [];
            if (p("("), t(), ")" === ma.id) return void p(")");
            for (var d = 0; 1 > d;) {
                if (a = Q(!0), c.push(a), m(a, "parameter"), "," !== ma.id) return p(")", b), t(ra, xa), c;
                y()
            }
        }

        function $(a, b) {
            var c, d = oa,
                e = ta;
            return oa = Object.create(oa), ta = Object.create(ta), ba = {
                "(name)": a || '"' + aa + '"',
                "(line)": ma.line,
                "(context)": ba,
                "(breakage)": 0,
                "(loopage)": 0,
                "(scope)": ta,
                "(statement)": b
            }, c = ba, xa.funct = ba, ca.push(ba), a && m(a, "function"), ba["(params)"] = Z(), V(!1, !1, !0), ta = e, oa = d, ba["(last)"] = xa.line, ba = ba["(context)"], c
        }

        function _() {
            function a() {
                var a = {},
                    b = ma;
                if (p("{"), "}" !== ma.id)
                    for (var c = 0; 1 > c;) {
                        if ("(end)" === ma.id) k("Missing '}' to match '{' from line {a}.", ma, b.line);
                        else {
                            if ("}" === ma.id) {
                                i("Unexpected comma.", xa);
                                break
                            }
                            "," === ma.id ? k("Unexpected comma.", ma) : "(string)" !== ma.id && i("Expected a string and instead saw {a}.", ma, ma.value)
                        }
                        if (a[ma.value] === !0 ? i("Duplicate key '{a}'.", ma, ma.value) : "__proto__" === ma.value && !oa.proto || "__iterator__" === ma.value && !oa.iterator ? i("The '{a}' key may produce unexpected results.", ma, ma.value) : a[ma.value] = !0, p(), p(":"), _(), "," !== ma.id) break;
                        p(",")
                    }
                p("}")
            }

            function b() {
                var a = ma;
                if (p("["), "]" !== ma.id)
                    for (var b = 0; 1 > b;) {
                        if ("(end)" === ma.id) k("Missing ']' to match '[' from line {a}.", ma, a.line);
                        else {
                            if ("]" === ma.id) {
                                i("Unexpected comma.", xa);
                                break
                            }
                            "," === ma.id && k("Unexpected comma.", ma)
                        }
                        if (_(), "," !== ma.id) break;
                        p(",")
                    }
                p("]")
            }
            switch (ma.id) {
                case "{":
                    a();
                    break;
                case "[":
                    b();
                    break;
                case "true":
                case "false":
                case "null":
                case "(number)":
                case "(string)":
                    p();
                    break;
                case "-":
                    p("-"), xa.character !== ma.from && i("Unexpected space after '-'.", xa), r(xa, ma), p("(number)");
                    break;
                default:
                    k("Expected a JSON value.", ma)
            }
        }
        var aa, ba, ca, da, ea, fa, ga, ha, ia, ja, ka, la, ma, na, oa, pa, qa, ra, sa, ta, ua, va, wa, xa, ya, za, Aa, Ba, Ca, Da, Ea, Fa, Ga, Ha, Ia, Ja, Ka = {
                "<": !0,
                "<=": !0,
                "==": !0,
                "===": !0,
                "!==": !0,
                "!=": !0,
                ">": !0,
                ">=": !0,
                "+": !0,
                "-": !0,
                "*": !0,
                "/": !0,
                "%": !0
            },
            La = {
                asi: !0,
                bitwise: !0,
                boss: !0,
                browser: !0,
                camelcase: !0,
                couch: !0,
                curly: !0,
                debug: !0,
                devel: !0,
                dojo: !0,
                eqeqeq: !0,
                eqnull: !0,
                es5: !0,
                esnext: !0,
                evil: !0,
                expr: !0,
                forin: !0,
                funcscope: !0,
                globalstrict: !0,
                immed: !0,
                iterator: !0,
                jquery: !0,
                lastsemic: !0,
                latedef: !0,
                laxbreak: !0,
                laxcomma: !0,
                loopfunc: !0,
                mootools: !0,
                multistr: !0,
                newcap: !0,
                noarg: !0,
                node: !0,
                noempty: !0,
                nonew: !0,
                nonstandard: !0,
                nomen: !0,
                onevar: !0,
                onecase: !0,
                passfail: !0,
                plusplus: !0,
                proto: !0,
                prototypejs: !0,
                regexdash: !0,
                regexp: !0,
                rhino: !0,
                undef: !0,
                scripturl: !0,
                shadow: !0,
                smarttabs: !0,
                strict: !0,
                sub: !0,
                supernew: !0,
                trailing: !0,
                validthis: !0,
                withstmt: !0,
                white: !0,
                wsh: !0,
                WebPDF: !0
            },
            Ma = {
                maxlen: !1,
                indent: !1,
                maxerr: !1,
                predef: !1,
                quotmark: !1
            },
            Na = {
                bitwise: !0,
                forin: !0,
                newcap: !0,
                nomen: !0,
                plusplus: !0,
                regexp: !0,
                undef: !0,
                white: !0,
                eqeqeq: !0,
                onevar: !0
            },
            Oa = {
                eqeq: "eqeqeq",
                vars: "onevar",
                windows: "wsh"
            },
            Pa = {
                ArrayBuffer: !1,
                ArrayBufferView: !1,
                Audio: !1,
                addEventListener: !1,
                applicationCache: !1,
                atob: !1,
                blur: !1,
                btoa: !1,
                clearInterval: !1,
                clearTimeout: !1,
                close: !1,
                closed: !1,
                DataView: !1,
                DOMParser: !1,
                defaultStatus: !1,
                document: !1,
                event: !1,
                FileReader: !1,
                Float32Array: !1,
                Float64Array: !1,
                FormData: !1,
                focus: !1,
                frames: !1,
                getComputedStyle: !1,
                HTMLElement: !1,
                HTMLAnchorElement: !1,
                HTMLBaseElement: !1,
                HTMLBlockquoteElement: !1,
                HTMLBodyElement: !1,
                HTMLBRElement: !1,
                HTMLButtonElement: !1,
                HTMLCanvasElement: !1,
                HTMLDirectoryElement: !1,
                HTMLDivElement: !1,
                HTMLDListElement: !1,
                HTMLFieldSetElement: !1,
                HTMLFontElement: !1,
                HTMLFormElement: !1,
                HTMLFrameElement: !1,
                HTMLFrameSetElement: !1,
                HTMLHeadElement: !1,
                HTMLHeadingElement: !1,
                HTMLHRElement: !1,
                HTMLHtmlElement: !1,
                HTMLIFrameElement: !1,
                HTMLImageElement: !1,
                HTMLInputElement: !1,
                HTMLIsIndexElement: !1,
                HTMLLabelElement: !1,
                HTMLLayerElement: !1,
                HTMLLegendElement: !1,
                HTMLLIElement: !1,
                HTMLLinkElement: !1,
                HTMLMapElement: !1,
                HTMLMenuElement: !1,
                HTMLMetaElement: !1,
                HTMLModElement: !1,
                HTMLObjectElement: !1,
                HTMLOListElement: !1,
                HTMLOptGroupElement: !1,
                HTMLOptionElement: !1,
                HTMLParagraphElement: !1,
                HTMLParamElement: !1,
                HTMLPreElement: !1,
                HTMLQuoteElement: !1,
                HTMLScriptElement: !1,
                HTMLSelectElement: !1,
                HTMLStyleElement: !1,
                HTMLTableCaptionElement: !1,
                HTMLTableCellElement: !1,
                HTMLTableColElement: !1,
                HTMLTableElement: !1,
                HTMLTableRowElement: !1,
                HTMLTableSectionElement: !1,
                HTMLTextAreaElement: !1,
                HTMLTitleElement: !1,
                HTMLUListElement: !1,
                HTMLVideoElement: !1,
                history: !1,
                Int16Array: !1,
                Int32Array: !1,
                Int8Array: !1,
                Image: !1,
                length: !1,
                localStorage: !1,
                location: !1,
                MessageChannel: !1,
                MessageEvent: !1,
                MessagePort: !1,
                moveBy: !1,
                moveTo: !1,
                name: !1,
                Node: !1,
                NodeFilter: !1,
                navigator: !1,
                onbeforeunload: !0,
                onblur: !0,
                onerror: !0,
                onfocus: !0,
                onload: !0,
                onresize: !0,
                onunload: !0,
                open: !1,
                openDatabase: !1,
                opener: !1,
                Option: !1,
                parent: !1,
                print: !1,
                removeEventListener: !1,
                resizeBy: !1,
                resizeTo: !1,
                screen: !1,
                scroll: !1,
                scrollBy: !1,
                scrollTo: !1,
                sessionStorage: !1,
                setInterval: !1,
                setTimeout: !1,
                SharedWorker: !1,
                status: !1,
                top: !1,
                Uint16Array: !1,
                Uint32Array: !1,
                Uint8Array: !1,
                WebSocket: !1,
                window: !1,
                Worker: !1,
                XMLHttpRequest: !1,
                XMLSerializer: !1,
                XPathEvaluator: !1,
                XPathException: !1,
                XPathExpression: !1,
                XPathNamespace: !1,
                XPathNSResolver: !1,
                XPathResult: !1
            },
            Qa = {
                require: !1,
                respond: !1,
                getRow: !1,
                emit: !1,
                send: !1,
                start: !1,
                sum: !1,
                log: !1,
                exports: !1,
                module: !1,
                provides: !1
            },
            Ra = {
                alert: !1,
                confirm: !1,
                console: !1,
                Debug: !1,
                opera: !1,
                prompt: !1
            },
            Sa = {
                AFSimple_Calculat: !1,
                AFSimple_Calculate: !1,
                AFRange_Validate: !1,
                AFNumber_Format: !1,
                AFPercent_Format: !1,
                AFDate_Format: !1,
                AFDate_FormatEx: !1,
                AFTime_Format: !1,
                AFTime_FormatEx: !1,
                app: !1
            },
            Ta = {
                dojo: !1,
                dijit: !1,
                dojox: !1,
                define: !1,
                require: !1
            },
            Ua = {
                "\b": "\\b",
                "   ": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "/": "\\/",
                "\\": "\\\\"
            },
            Va = ["closure", "exception", "global", "label", "outer", "unused", "var"],
            Wa = {
                $: !1,
                jQuery: !1
            },
            Xa = {
                $: !1,
                $$: !1,
                Assets: !1,
                Browser: !1,
                Chain: !1,
                Class: !1,
                Color: !1,
                Cookie: !1,
                Core: !1,
                Document: !1,
                DomReady: !1,
                DOMReady: !1,
                Drag: !1,
                Element: !1,
                Elements: !1,
                Event: !1,
                Events: !1,
                Fx: !1,
                Group: !1,
                Hash: !1,
                HtmlTable: !1,
                Iframe: !1,
                IframeShim: !1,
                InputValidator: !1,
                instanceOf: !1,
                Keyboard: !1,
                Locale: !1,
                Mask: !1,
                MooTools: !1,
                Native: !1,
                Options: !1,
                OverText: !1,
                Request: !1,
                Scroller: !1,
                Slick: !1,
                Slider: !1,
                Sortables: !1,
                Spinner: !1,
                Swiff: !1,
                Tips: !1,
                Type: !1,
                typeOf: !1,
                URI: !1,
                Window: !1
            },
            Ya = {
                __filename: !1,
                __dirname: !1,
                Buffer: !1,
                console: !1,
                exports: !1,
                GLOBAL: !1,
                global: !1,
                module: !1,
                process: !1,
                require: !1,
                setTimeout: !1,
                clearTimeout: !1,
                setInterval: !1,
                clearInterval: !1
            },
            Za = {
                $: !1,
                $$: !1,
                $A: !1,
                $F: !1,
                $H: !1,
                $R: !1,
                $break: !1,
                $continue: !1,
                $w: !1,
                Abstract: !1,
                Ajax: !1,
                Class: !1,
                Enumerable: !1,
                Element: !1,
                Event: !1,
                Field: !1,
                Form: !1,
                Hash: !1,
                Insertion: !1,
                ObjectRange: !1,
                PeriodicalExecuter: !1,
                Position: !1,
                Prototype: !1,
                Selector: !1,
                Template: !1,
                Toggle: !1,
                Try: !1,
                Autocompleter: !1,
                Builder: !1,
                Control: !1,
                Draggable: !1,
                Draggables: !1,
                Droppables: !1,
                Effect: !1,
                Sortable: !1,
                SortableObserver: !1,
                Sound: !1,
                Scriptaculous: !1
            },
            $a = {
                defineClass: !1,
                deserialize: !1,
                gc: !1,
                help: !1,
                importPackage: !1,
                java: !1,
                load: !1,
                loadClass: !1,
                print: !1,
                quit: !1,
                readFile: !1,
                readUrl: !1,
                runCommand: !1,
                seal: !1,
                serialize: !1,
                spawn: !1,
                sync: !1,
                toint32: !1,
                version: !1
            },
            _a = {
                Array: !1,
                Boolean: !1,
                Date: !1,
                decodeURI: !1,
                decodeURIComponent: !1,
                encodeURI: !1,
                encodeURIComponent: !1,
                Error: !1,
                eval: !1,
                EvalError: !1,
                Function: !1,
                hasOwnProperty: !1,
                isFinite: !1,
                isNaN: !1,
                JSON: !1,
                Math: !1,
                Number: !1,
                Object: !1,
                parseInt: !1,
                parseFloat: !1,
                RangeError: !1,
                ReferenceError: !1,
                RegExp: !1,
                String: !1,
                SyntaxError: !1,
                TypeError: !1,
                URIError: !1
            },
            ab = {
                escape: !1,
                unescape: !1
            },
            bb = {},
            cb = {
                ActiveXObject: !0,
                Enumerator: !0,
                GetObject: !0,
                ScriptEngine: !0,
                ScriptEngineBuildVersion: !0,
                ScriptEngineMajorVersion: !0,
                ScriptEngineMinorVersion: !0,
                VBArray: !0,
                WSH: !0,
                WScript: !0,
                XDomainRequest: !0
            };
        ! function() {
            Ba = /@cc|<\/?|script|\]\s*\]|<\s*!|&lt/i, Ca = /[\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, Da = /^\s*([(){}\[.,:;'"~\?\]#@]|==?=?|\/(\*?|=|\/)?|\*[\/=]?|\+(?:=|\++)?|-(?:=|-+)?|%=?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=!]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+\-]?[0-9]+)?)/, Ea = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/, Fa = /[\u0000-\u001f&<"\/\\\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, Ga = /\*\/|\/\*/, Ha = /^([a-zA-Z_$][a-zA-Z0-9_$]*)$/, Ia = /^(?:javascript|jscript|ecmascript|vbscript|mocha|livescript)\s*:/i, Ja = /^\s*\/\*\s*falls\sthrough\s*\*\/\s*$/
        }(), "function" != typeof Array.isArray && (Array.isArray = function(a) {
            return "[object Array]" === Object.prototype.toString.apply(a)
        }), "function" != typeof Object.create && (Object.create = function(b) {
            return a.prototype = b, new a
        }), "function" != typeof Object.keys && (Object.keys = function(a) {
            var c = [],
                d = null;
            for (d in a) b(a, d) && c.push(d);
            return c
        }), "function" != typeof String.prototype.entityify && (String.prototype.entityify = function() {
            return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }), "function" != typeof String.prototype.isAlpha && (String.prototype.isAlpha = function() {
            return this >= "a" && "z￿" >= this || this >= "A" && "Z￿" >= this
        }), "function" != typeof String.prototype.isDigit && (String.prototype.isDigit = function() {
            return this >= "0" && "9" >= this
        }), "function" != typeof String.prototype.supplant && (String.prototype.supplant = function(a) {
            return this.replace(/\{([^{}]*)\}/g, function(b, c) {
                var d = a[c];
                return "string" == typeof d || "number" == typeof d ? d : b
            })
        }), "function" != typeof String.prototype.name && (String.prototype.name = function() {
            return Ha.test(this) ? this : Ea.test(this) ? '"' + this.replace(Fa, function(a) {
                var b = Ua[a];
                return b ? b : "\\u" + ("0000" + a.charCodeAt().toString(16)).slice(-4)
            }) + '"' : '"' + this + '"'
        });
        var db = function() {
            function a() {
                var a, b;
                return f >= ia.length ? !1 : (d = 1, h = ia[f], f += 1, a = oa.smarttabs ? h.search(/ \t/) : h.search(/ \t|\t [^\*]/), a >= 0 && j("Mixed spaces and tabs.", f, a + 1), h = h.replace(/\t/g, wa), a = h.search(Ca), a >= 0 && j("Unsafe character.", f, a), oa.maxlen && oa.maxlen < h.length && j("Line too long.", f, h.length), b = oa.trailing && h.match(/^(.*?)\s+$/), b && !/^\s+$/.test(h) && j("Trailing whitespace.", f, b[1].length + 1), !0)
            }

            function c(a, c) {
                var g, h;
                return h = "(color)" === a || "(range)" === a ? {
                    type: a
                } : "(punctuator)" === a || "(identifier)" === a && b(bb, c) ? bb[c] || bb["(error)"] : bb[a], h = Object.create(h), ("(string)" === a || "(range)" === a) && !oa.scripturl && Ia.test(c) && j("Script URL.", f, e), "(identifier)" === a && (h.identifier = !0, "__proto__" !== c || oa.proto ? "__iterator__" !== c || oa.iterator ? !oa.nomen || "_" !== c.charAt(0) && "_" !== c.charAt(c.length - 1) ? oa.camelcase && c.indexOf("_") > -1 && !c.match(/^[A-Z0-9_]*$/) && j("Identifier '{a}' is not in camel case.", f, e, c) : (!oa.node || "." === xa.id || "__dirname" !== c && "__filename" !== c) && j("Unexpected {a} in '{b}'.", f, e, "dangling '_'", c) : j("'{a}' is only available in JavaScript 1.7.", f, e, c) : j("The '{a}' property is deprecated.", f, e, c)), h.value = c, h.line = f, h.character = d, h.from = e, g = h.id, "(endline)" !== g && (qa = g && ("(,=:[!&|?{};".indexOf(g.charAt(g.length - 1)) >= 0 || "return" === g || "case" === g)), h
            }
            var d, e, f, h;
            return {
                init: function(b) {
                    ia = "string" == typeof b ? b.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n") : b, ia[0] && "#!" === ia[0].substr(0, 2) && (ia[0] = ""), f = 0, a(), e = 1
                },
                range: function(a, b) {
                    var g, i = "";
                    e = d, h.charAt(0) !== a && l("Expected '{a}' and instead saw '{b}'.", f, d, a, h.charAt(0));
                    for (var k = 0; 1 > k;) {
                        switch (h = h.slice(1), d += 1, g = h.charAt(0)) {
                            case "":
                                l("Missing '{a}'.", f, d, g);
                                break;
                            case b:
                                return h = h.slice(1), d += 1, c("(range)", i);
                            case "\\":
                                j("Unexpected '{a}'.", f, d, g)
                        }
                        i += g
                    }
                },
                token: function() {
                    function b(a) {
                        var b, c = a.exec(h);
                        return c ? (s = c[0].length, b = c[1], m = b.charAt(0), h = h.substr(s), e = d + s - b.length, d += s, b) : void 0
                    }

                    function i(b) {
                        function g(a) {
                            var b = parseInt(h.substr(k + 1, a), 16);
                            k += a, b >= 32 && 126 >= b && 34 !== b && 92 !== b && 39 !== b && j("Unnecessary escapement.", f, d), d += a, i = String.fromCharCode(b)
                        }
                        var i, k, m = "",
                            n = !1;
                        ha && '"' !== b && j("Strings must use doublequote.", f, d), oa.quotmark && ("single" === oa.quotmark && "'" !== b ? j("Strings must use singlequote.", f, d) : "double" === oa.quotmark && '"' !== b ? j("Strings must use doublequote.", f, d) : oa.quotmark === !0 && (sa = sa || b, sa !== b && j("Mixed double and single quotes.", f, d))), k = 0;
                        a: for (var o = 0; 1 > o;) {
                            for (; k >= h.length;) {
                                k = 0;
                                var p = f,
                                    q = e;
                                if (!a()) {
                                    l("Unclosed string.", p, q);
                                    break a
                                }
                                n ? n = !1 : j("Unclosed string.", p, q)
                            }
                            if (i = h.charAt(k), i === b) return d += 1, h = h.substr(k + 1), c("(string)", m, b);
                            if (" " > i) {
                                if ("\n" === i || "\r" === i) break;
                                j("Control character in string: {a}.", f, d + k, h.slice(0, k))
                            } else if ("\\" === i) switch (k += 1, d += 1, i = h.charAt(k), y = h.charAt(k + 1), i) {
                                case "\\":
                                case '"':
                                case "/":
                                    break;
                                case "'":
                                    ha && j("Avoid \\'.", f, d);
                                    break;
                                case "b":
                                    i = "\b";
                                    break;
                                case "f":
                                    i = "\f";
                                    break;
                                case "n":
                                    i = "\n";
                                    break;
                                case "r":
                                    i = "\r";
                                    break;
                                case "t":
                                    i = "   ";
                                    break;
                                case "0":
                                    i = "\x00", y >= 0 && 7 >= y && va["use strict"] && j("Octal literals are not allowed in strict mode.", f, d);
                                    break;
                                case "u":
                                    g(4);
                                    break;
                                case "v":
                                    ha && j("Avoid \\v.", f, d), i = "";
                                    break;
                                case "x":
                                    ha && j("Avoid \\x-.", f, d), g(2);
                                    break;
                                case "":
                                    if (n = !0, oa.multistr) {
                                        ha && j("Avoid EOL escapement.", f, d), i = "", d -= 1;
                                        break
                                    }
                                    j("Bad escapement of EOL. Use option multistr if needed.", f, d);
                                    break;
                                default:
                                    j("Bad escapement.", f, d)
                            }
                            m += i, d += 1, k += 1
                        }
                    }
                    for (var k, m, n, o, p, q, r, s, t, u, v, w, x, y, z = 0; 1 > z;) {
                        if (!h) return c(a() ? "(endline)" : "(end)", "");
                        if (v = b(Da)) {
                            if (m.isAlpha() || "_" === m || "$" === m) return c("(identifier)", v);
                            if (m.isDigit()) return isFinite(Number(v)) || j("Bad number '{a}'.", f, d, v), h.substr(0, 1).isAlpha() && j("Missing space after '{a}'.", f, d, v), "0" === m && (o = v.substr(1, 1), o.isDigit() ? "." !== xa.id && j("Don't use extra leading zeros '{a}'.", f, d, v) : !ha || "x" !== o && "X" !== o || j("Avoid 0x-. '{a}'.", f, d, v)), "." === v.substr(v.length - 1) && j("A trailing decimal point can be confused with a dot '{a}'.", f, d, v), c("(number)", v);
                            switch (v) {
                                case '"':
                                case "'":
                                    return i(v);
                                case "//":
                                    h = "", xa.comment = !0;
                                    break;
                                case "/*":
                                    for (var A = 0; 1 > A && (r = h.search(Ga), !(r >= 0));) a() || l("Unclosed comment.", f, d);
                                    d += r + 2, "/" === h.substr(r, 1) && l("Nested comment.", f, d), h = h.substr(r + 2), xa.comment = !0;
                                    break;
                                case "/*members":
                                case "/*member":
                                case "/*jshint":
                                case "/*jslint":
                                case "/*global":
                                case "*/":
                                    return {
                                        value: v,
                                        type: "special",
                                        line: f,
                                        character: d,
                                        from: e
                                    };
                                case "":
                                    break;
                                case "/":
                                    if ("/=" === xa.id && l("A regular expression literal can be confused with '/='.", f, e), qa) {
                                        p = 0, n = 0, s = 0;
                                        for (var z = 0; 1 > z;) {
                                            switch (k = !0, m = h.charAt(s), s += 1, m) {
                                                case "":
                                                    return l("Unclosed regular expression.", f, e), g("Stopping.", f, e);
                                                case "/":
                                                    for (p > 0 && j("{a} unterminated regular expression group(s).", f, e + s, p), m = h.substr(0, s - 1), u = {
                                                            g: !0,
                                                            i: !0,
                                                            m: !0
                                                        }; u[h.charAt(s)] === !0;) u[h.charAt(s)] = !1, s += 1;
                                                    return d += s, h = h.substr(s), u = h.charAt(0), ("/" === u || "*" === u) && l("Confusing regular expression.", f, e), c("(regexp)", m);
                                                case "\\":
                                                    m = h.charAt(s), " " > m ? j("Unexpected control character in regular expression.", f, e + s) : "<" === m && j("Unexpected escaped character '{a}' in regular expression.", f, e + s, m), s += 1;
                                                    break;
                                                case "(":
                                                    if (p += 1, k = !1, "?" === h.charAt(s)) switch (s += 1, h.charAt(s)) {
                                                        case ":":
                                                        case "=":
                                                        case "!":
                                                            s += 1;
                                                            break;
                                                        default:
                                                            j("Expected '{a}' and instead saw '{b}'.", f, e + s, ":", h.charAt(s))
                                                    } else n += 1;
                                                    break;
                                                case "|":
                                                    k = !1;
                                                    break;
                                                case ")":
                                                    0 === p ? j("Unescaped '{a}'.", f, e + s, ")") : p -= 1;
                                                    break;
                                                case " ":
                                                    for (u = 1;
                                                        " " === h.charAt(s);) s += 1, u += 1;
                                                    u > 1 && j("Spaces are hard to count. Use {{a}}.", f, e + s, u);
                                                    break;
                                                case "[":
                                                    m = h.charAt(s), "^" === m && (s += 1, oa.regexp ? j("Insecure '{a}'.", f, e + s, m) : "]" === h.charAt(s) && l("Unescaped '{a}'.", f, e + s, "^")), "]" === m && j("Empty class.", f, e + s - 1), w = !1, x = !1;
                                                    a: do switch (m = h.charAt(s), s += 1, m) {
                                                            case "[":
                                                            case "^":
                                                                j("Unescaped '{a}'.", f, e + s, m), x ? x = !1 : w = !0;
                                                                break;
                                                            case "-":
                                                                w && !x ? (w = !1, x = !0) : x ? x = !1 : "]" === h.charAt(s) ? x = !0 : (oa.regexdash !== (2 === s || 3 === s && "^" === h.charAt(1)) && j("Unescaped '{a}'.", f, e + s - 1, "-"), w = !0);
                                                                break;
                                                            case "]":
                                                                x && !oa.regexdash && j("Unescaped '{a}'.", f, e + s - 1, "-");
                                                                break a;
                                                            case "\\":
                                                                m = h.charAt(s), " " > m ? j("Unexpected control character in regular expression.", f, e + s) : "<" === m && j("Unexpected escaped character '{a}' in regular expression.", f, e + s, m), s += 1, /[wsd]/i.test(m) ? (x && (j("Unescaped '{a}'.", f, e + s, "-"), x = !1), w = !1) : x ? x = !1 : w = !0;
                                                                break;
                                                            case "/":
                                                                j("Unescaped '{a}'.", f, e + s - 1, "/"), x ? x = !1 : w = !0;
                                                                break;
                                                            case "<":
                                                                x ? x = !1 : w = !0;
                                                                break;
                                                            default:
                                                                x ? x = !1 : w = !0
                                                        }
                                                        while (m);
                                                        break;
                                                case ".":
                                                    oa.regexp && j("Insecure '{a}'.", f, e + s, m);
                                                    break;
                                                case "]":
                                                case "?":
                                                case "{":
                                                case "}":
                                                case "+":
                                                case "*":
                                                    j("Unescaped '{a}'.", f, e + s, m)
                                            }
                                            if (k) switch (h.charAt(s)) {
                                                case "?":
                                                case "+":
                                                case "*":
                                                    s += 1, "?" === h.charAt(s) && (s += 1);
                                                    break;
                                                case "{":
                                                    s += 1, m = h.charAt(s), ("0" > m || m > "9") && j("Expected a number and instead saw '{a}'.", f, e + s, m), s += 1, t = +m;
                                                    for (var A = 0; 1 > A && (m = h.charAt(s), !("0" > m || m > "9"));) s += 1, t = +m + 10 * t;
                                                    if (q = t, "," === m && (s += 1, q = 1 / 0, m = h.charAt(s), m >= "0" && "9" >= m)) {
                                                        s += 1, q = +m;
                                                        for (var z = 0; 1 > z && (m = h.charAt(s), !("0" > m || m > "9"));) s += 1, q = +m + 10 * q
                                                    }
                                                    "}" !== h.charAt(s) ? j("Expected '{a}' and instead saw '{b}'.", f, e + s, "}", m) : s += 1, "?" === h.charAt(s) && (s += 1), t > q && j("'{a}' should not be greater than '{b}'.", f, e + s, t, q)
                                            }
                                        }
                                        return m = h.substr(0, s - 1), d += s, h = h.substr(s), c("(regexp)", m)
                                    }
                                    return c("(punctuator)", v);
                                case "#":
                                    return c("(punctuator)", v);
                                default:
                                    return c("(punctuator)", v)
                            }
                        } else {
                            for (v = "", m = ""; h && "!" > h;) h = h.substr(1);
                            h && (l("Unexpected '{a}'.", f, d, h.substr(0, 1)), h = "")
                        }
                    }
                }
            }
        }();
        F("(number)", function() {
                return this
            }), F("(string)", function() {
                return this
            }), bb["(identifier)"] = {
                type: "(identifier)",
                lbp: 0,
                identifier: !0,
                nud: function() {
                    var a, b = this.value,
                        c = ta[b];
                    if ("function" == typeof c ? c = void 0 : "boolean" == typeof c && (a = ba, ba = ca[0], m(b, "var"), c = ba, ba = a), ba === c) switch (ba[b]) {
                            case "unused":
                                ba[b] = "var";
                                break;
                            case "unction":
                                ba[b] = "function", this["function"] = !0;
                                break;
                            case "function":
                                this["function"] = !0;
                                break;
                            case "label":
                                i("'{a}' is a statement label.", xa, b)
                        } else if (ba["(global)"]) oa.undef && "boolean" != typeof pa[b] && ("typeof" !== aa && "delete" !== aa || ma && ("." === ma.value || "[" === ma.value)) && h(ba, "'{a}' is not defined.", xa, b), X(xa);
                        else switch (ba[b]) {
                            case "closure":
                            case "function":
                            case "var":
                            case "unused":
                                i("'{a}' used out of scope.", xa, b);
                                break;
                            case "label":
                                i("'{a}' is a statement label.", xa, b);
                                break;
                            case "outer":
                            case "global":
                                break;
                            default:
                                if (c === !0) ba[b] = !0;
                                else if (null === c) i("'{a}' is not allowed.", xa, b), X(xa);
                                else if ("object" != typeof c) oa.undef && ("typeof" !== aa && "delete" !== aa || ma && ("." === ma.value || "[" === ma.value)) && h(ba, "'{a}' is not defined.", xa, b), ba[b] = !0, X(xa);
                                else switch (c[b]) {
                                    case "function":
                                    case "unction":
                                        this["function"] = !0, c[b] = "closure", ba[b] = c["(global)"] ? "global" : "outer";
                                        break;
                                    case "var":
                                    case "unused":
                                        c[b] = "closure", ba[b] = c["(global)"] ? "global" : "outer";
                                        break;
                                    case "closure":
                                    case "parameter":
                                        ba[b] = c["(global)"] ? "global" : "outer";
                                        break;
                                    case "label":
                                        i("'{a}' is a statement label.", xa, b)
                                }
                        }
                        return this
                },
                led: function() {
                    k("Expected an operator and instead saw '{a}'.", ma, ma.value)
                }
            }, F("(regexp)", function() {
                return this
            }), A("(endline)"), A("(begin)"), A("(end)").reach = !0, A("</").reach = !0, A("<!"), A("<!--"), A("-->"), A("(error)").reach = !0, A("}").reach = !0, A(")"), A("]"), A('"').reach = !0, A("'").reach = !0, A(";"), A(":").reach = !0, A(","), A("#"), A("@"), G("else"), G("case").reach = !0, G("catch"), G("default").reach = !0, G("finally"), H("arguments", function(a) {
                va["use strict"] && ba["(global)"] && i("Strict violation.", a)
            }), H("eval"), H("false"), H("Infinity"), H("NaN"), H("null"), H("this", function(a) {
                va["use strict"] && !oa.validthis && (ba["(statement)"] && ba["(name)"].charAt(0) > "Z" || ba["(global)"]) && i("Possible strict violation.", a)
            }), H("true"), H("undefined"), L("=", "assign", 20), L("+=", "assignadd", 20), L("-=", "assignsub", 20), L("*=", "assignmult", 20), L("/=", "assigndiv", 20).nud = function() {
                k("A regular expression literal can be confused with '/='.")
            }, L("%=", "assignmod", 20), N("&=", "assignbitand", 20), N("|=", "assignbitor", 20), N("^=", "assignbitxor", 20), N("<<=", "assignshiftleft", 20), N(">>=", "assignshiftright", 20), N(">>>=", "assignshiftrightunsigned", 20), I("?", function(a, b) {
                return b.left = a, b.right = q(10), p(":"), b["else"] = q(10), b
            }, 30), I("||", "or", 40), I("&&", "and", 50), M("|", "bitor", 70), M("^", "bitxor", 80), M("&", "bitand", 90), J("==", function(a, b) {
                var c = oa.eqnull && ("null" === a.value || "null" === b.value);
                return !c && oa.eqeqeq ? i("Expected '{a}' and instead saw '{b}'.", this, "===", "==") : K(a) ? i("Use '{a}' to compare with '{b}'.", this, "===", a.value) : K(b) && i("Use '{a}' to compare with '{b}'.", this, "===", b.value), this
            }), J("==="), J("!=", function(a, b) {
                var c = oa.eqnull && ("null" === a.value || "null" === b.value);
                return !c && oa.eqeqeq ? i("Expected '{a}' and instead saw '{b}'.", this, "!==", "!=") : K(a) ? i("Use '{a}' to compare with '{b}'.", this, "!==", a.value) : K(b) && i("Use '{a}' to compare with '{b}'.", this, "!==", b.value), this
            }), J("!=="), J("<"), J(">"), J("<="), J(">="), M("<<", "shiftleft", 120), M(">>", "shiftright", 120), M(">>>", "shiftrightunsigned", 120), I("in", "in", 120), I("instanceof", "instanceof", 120), I("+", function(a, b) {
                var c = q(130);
                return a && c && "(string)" === a.id && "(string)" === c.id ? (a.value += c.value, a.character = c.character, !oa.scripturl && Ia.test(a.value) && i("JavaScript URL.", a), a) : (b.left = a, b.right = c, b)
            }, 130), E("+", "num"), E("+++", function() {
                return i("Confusing pluses."), this.right = q(150), this.arity = "unary", this
            }), I("+++", function(a) {
                return i("Confusing pluses."), this.left = a, this.right = q(130), this
            }, 130), I("-", "sub", 130), E("-", "neg"), E("---", function() {
                return i("Confusing minuses."), this.right = q(150), this.arity = "unary", this
            }), I("---", function(a) {
                return i("Confusing minuses."), this.left = a, this.right = q(130), this
            }, 130), I("*", "mult", 140), I("/", "div", 140), I("%", "mod", 140), O("++", "postinc"), E("++", "preinc"), bb["++"].exps = !0, O("--", "postdec"), E("--", "predec"), bb["--"].exps = !0, E("delete", function() {
                var a = q(0);
                return (!a || "." !== a.id && "[" !== a.id) && i("Variables should not be deleted."), this.first = a, this
            }).exps = !0, E("~", function() {
                return oa.bitwise && i("Unexpected '{a}'.", this, "~"), q(150), this
            }), E("!", function() {
                return this.right = q(150), this.arity = "unary", Ka[this.right.id] === !0 && i("Confusing use of '{a}'.", this, "!"), this
            }), E("typeof", "typeof"), E("new", function() {
                var a, b = q(155);
                if (b && "function" !== b.id)
                    if (b.identifier) switch (b["new"] = !0, b.value) {
                        case "Number":
                        case "String":
                        case "Boolean":
                        case "Math":
                        case "JSON":
                            i("Do not use {a} as a constructor.", xa, b.value);
                            break;
                        case "Function":
                            oa.evil || i("The Function constructor is eval.");
                            break;
                        case "Date":
                        case "RegExp":
                            break;
                        default:
                            "function" !== b.id && (a = b.value.substr(0, 1), oa.newcap && ("A" > a || a > "Z") && i("A constructor name should start with an uppercase letter.", xa))
                    } else "." !== b.id && "[" !== b.id && "(" !== b.id && i("Bad constructor.", xa);
                    else oa.supernew || i("Weird construction. Delete 'new'.", this);
                return r(xa, ma), "(" === ma.id || oa.supernew || i("Missing '()' invoking a constructor."), this.first = b, this
            }), bb["new"].exps = !0, E("void").exps = !0, I(".", function(a, b) {
                r(ra, xa), s();
                var c = Q();
                return "string" == typeof c && W(c), b.left = a, b.right = c, !a || "arguments" !== a.value || "callee" !== c && "caller" !== c ? oa.evil || !a || "document" !== a.value || "write" !== c && "writeln" !== c || i("document.write can be a form of eval.", a) : oa.noarg ? i("Avoid arguments.{a}.", a, c) : va["use strict"] && k("Strict violation."), oa.evil || "eval" !== c && "execScript" !== c || i("eval is evil."), b
            }, 160, !0), I("(", function(a, b) {
                "}" !== ra.id && ")" !== ra.id && s(ra, xa), t(), oa.immed && !a.immed && "function" === a.id && i("Wrap an immediate function invocation in parentheses to assist the reader in understanding that the expression is the result of a function, and not the function itself.");
                var c = 0,
                    d = [];
                if (a && "(identifier)" === a.type && a.value.match(/^[A-Z]([A-Z0-9_$]*[a-z][A-Za-z0-9_$]*)?$/) && "Number" !== a.value && "String" !== a.value && "Boolean" !== a.value && "Date" !== a.value && ("Math" === a.value ? i("Math is not a function.", a) : oa.newcap && i("Missing 'new' prefix when invoking a constructor.", a)), ")" !== ma.id)
                    for (var e = 0; 1 > e && (d[d.length] = q(10), c += 1, "," === ma.id);) y();
                return p(")"), t(ra, xa), "object" == typeof a && ("parseInt" === a.value && 1 === c && i("Missing radix parameter.", a), oa.evil || ("eval" === a.value || "Function" === a.value || "execScript" === a.value ? i("eval is evil.", a) : !d[0] || "(string)" !== d[0].id || "setTimeout" !== a.value && "setInterval" !== a.value || i("Implied eval is evil. Pass a function instead of a string.", a)), a.identifier || "." === a.id || "[" === a.id || "(" === a.id || "&&" === a.id || "||" === a.id || "?" === a.id || i("Bad invocation.", a)), b.left = a, b
            }, 155, !0).exps = !0, E("(", function() {
                t(), "function" === ma.id && (ma.immed = !0);
                var a = q(0);
                return p(")", this), t(ra, xa), oa.immed && "function" === a.id && ("(" === ma.id || "." === ma.id && ("call" === o().value || "apply" === o().value) ? i("Move the invocation into the parens that contain the function.", ma) : i("Do not wrap function literals in parens unless they are to be immediately invoked.", this)), a
            }), I("[", function(a, b) {
                s(ra, xa), t();
                var c, d = q(0);
                return d && "(string)" === d.type && (oa.evil || "eval" !== d.value && "execScript" !== d.value || i("eval is evil.", b), W(d.value), !oa.sub && Ha.test(d.value) && (c = bb[d.value], c && c.reserved || i("['{a}'] is better written in dot notation.", d, d.value))), p("]", b), t(ra, xa), b.left = a, b.right = d, b
            }, 160, !0), E("[", function() {
                var a = xa.line !== ma.line;
                for (this.first = [], a && (ga += oa.indent, ma.from === ga + oa.indent && (ga += oa.indent));
                    "(end)" !== ma.id;) {
                    for (;
                        "," === ma.id;) i("Extra comma."), p(",");
                    if ("]" === ma.id) break;
                    if (a && xa.line !== ma.line && w(), this.first.push(q(10)), "," !== ma.id) break;
                    if (y(), "]" === ma.id && !oa.es5) {
                        i("Extra comma.", xa);
                        break
                    }
                }
                return a && (ga -= oa.indent, w()), p("]", this), this
            }, 160),
            function(a) {
                a.nud = function() {
                    function a(a, c) {
                        l[a] && b(l, a) ? i("Duplicate member '{a}'.", ma, g) : l[a] = {}, l[a].basic = !0, l[a].basicToken = c
                    }

                    function c(a, c) {
                        l[a] && b(l, a) ? (l[a].basic || l[a].setter) && i("Duplicate member '{a}'.", ma, g) : l[a] = {}, l[a].setter = !0, l[a].setterToken = c
                    }

                    function d(a) {
                        l[a] && b(l, a) ? (l[a].basic || l[a].getter) && i("Duplicate member '{a}'.", ma, g) : l[a] = {}, l[a].getter = !0, l[a].getterToken = xa
                    }
                    var e, f, g, h, j, l = {};
                    e = xa.line !== ma.line, e && (ga += oa.indent, ma.from === ga + oa.indent && (ga += oa.indent));
                    for (var m = 0; 1 > m && "}" !== ma.id;) {
                        if (e && w(), "get" === ma.value && ":" !== o().id) p("get"), oa.es5 || k("get/set are ES5 features."), g = Y(), g || k("Missing property name."), d(g), j = ma, r(xa, ma), f = $(), h = f["(params)"], h && i("Unexpected parameter '{a}' in get {b} function.", j, h[0], g), r(xa, ma);
                        else if ("set" === ma.value && ":" !== o().id) p("set"), oa.es5 || k("get/set are ES5 features."), g = Y(), g || k("Missing property name."), c(g, ma), j = ma, r(xa, ma), f = $(), h = f["(params)"], h && 1 === h.length || i("Expected a single parameter in set {a} function.", j, g);
                        else {
                            if (g = Y(), a(g, ma), "string" != typeof g) break;
                            p(":"), u(xa, ma), q(10)
                        }
                        if (W(g), "," !== ma.id) break;
                        y(), "," === ma.id ? i("Extra comma.", xa) : "}" !== ma.id || oa.es5 || i("Extra comma.", xa)
                    }
                    if (e && (ga -= oa.indent, w()), p("}", this), oa.es5)
                        for (var n in l) b(l, n) && l[n].setter && !l[n].getter && i("Setter is defined without getter.", l[n].setterToken);
                    return this
                }, a.fud = function() {
                    k("Expected to see a statement and instead saw a block.", xa)
                }
            }(A("{")), za = function() {
                var a = B("const", function(a) {
                    var b, c, d;
                    this.first = [];
                    for (var e = 0; 1 > e && (u(xa, ma), b = Q(), "const" === ba[b] && i("const '" + b + "' has already been declared"), ba["(global)"] && pa[b] === !1 && i("Redefinition of '{a}'.", xa, b), m(b, "const"), !a) && (c = xa, this.first.push(xa), "=" !== ma.id && i("const '{a}' is initialized to 'undefined'.", xa, b), "=" === ma.id && (u(xa, ma), p("="), u(xa, ma), "undefined" === ma.id && i("It is not necessary to initialize '{a}' to 'undefined'.", xa, b), "=" === o(0).id && ma.identifier && k("Constant {a} was not declared correctly.", ma, ma.value), d = q(0), c.first = d), "," === ma.id);) y();
                    return this
                });
                a.exps = !0
            };
        var eb = B("var", function(a) {
            var b, c, d;
            ba["(onevar)"] && oa.onevar ? i("Too many var statements.") : ba["(global)"] || (ba["(onevar)"] = !0), this.first = [];
            for (var e = 0; 1 > e && (u(xa, ma), b = Q(), oa.esnext && "const" === ba[b] && i("const '" + b + "' has already been declared"), ba["(global)"] && pa[b] === !1 && i("Redefinition of '{a}'.", xa, b), m(b, "unused"), !a) && (c = xa, this.first.push(xa), "=" === ma.id && (u(xa, ma), p("="), u(xa, ma), "undefined" === ma.id && i("It is not necessary to initialize '{a}' to 'undefined'.", xa, b), "=" === o(0).id && ma.identifier && k("Variable {a} was not declared correctly.", ma, ma.value), d = q(0), c.first = d), "," === ma.id);) y();
            return this
        });
        eb.exps = !0, C("function", function() {
                fa && i("Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.", xa);
                var a = Q();
                return oa.esnext && "const" === ba[a] && i("const '" + a + "' has already been declared"), r(xa, ma), m(a, "unction"), $(a, !0), "(" === ma.id && ma.line === xa.line && k("Function declarations are not invocable. Wrap the whole function invocation in parens."), this
            }), E("function", function() {
                var a = P();
                return a ? r(xa, ma) : u(xa, ma), $(a), !oa.loopfunc && ba["(loopage)"] && i("Don't make functions within a loop."), this
            }), C("if", function() {
                var a = ma;
                return p("("), u(this, a), t(), q(20), "=" === ma.id && (oa.boss || i("Expected a conditional expression and instead saw an assignment."), p("="), q(20)), p(")", a), t(ra, xa), V(!0, !0), "else" === ma.id && (u(xa, ma), p("else"), "if" === ma.id || "switch" === ma.id ? S(!0) : V(!0, !0)), this
            }), C("try", function() {
                var a, b, c;
                return V(!1), "catch" === ma.id && (p("catch"), u(xa, ma), p("("), c = ta, ta = Object.create(c), b = ma.value, "(identifier)" !== ma.type ? i("Expected an identifier and instead saw '{a}'.", ma, b) : m(b, "exception"), p(), p(")"), V(!1), a = !0, ta = c), "finally" === ma.id ? (p("finally"), void V(!1)) : (a || k("Expected '{a}' and instead saw '{b}'.", ma, "catch", ma.value), this)
            }), C("while", function() {
                var a = ma;
                return ba["(breakage)"] += 1, ba["(loopage)"] += 1, p("("), u(this, a), t(), q(20), "=" === ma.id && (oa.boss || i("Expected a conditional expression and instead saw an assignment."), p("="), q(20)), p(")", a), t(ra, xa), V(!0, !0), ba["(breakage)"] -= 1, ba["(loopage)"] -= 1, this
            }).labelled = !0, C("with", function() {
                var a = ma;
                return va["use strict"] ? k("'with' is not allowed in strict mode.", xa) : oa.withstmt || i("Don't use 'with'.", xa), p("("), u(this, a), t(), q(0), p(")", a), t(ra, xa), V(!0, !0), this
            }), C("switch", function() {
                var a = ma,
                    b = !1;
                ba["(breakage)"] += 1, p("("), u(this, a), t(), this.condition = q(20), p(")", a), t(ra, xa), u(xa, ma), a = ma, p("{"), u(xa, ma), ga += oa.indent, this.cases = [];
                for (var c = 0; 1 > c;) switch (ma.id) {
                    case "case":
                        switch (ba["(verb)"]) {
                            case "break":
                            case "case":
                            case "continue":
                            case "return":
                            case "switch":
                            case "throw":
                                break;
                            default:
                                Ja.test(ia[ma.line - 2]) || i("Expected a 'break' statement before 'case'.", xa)
                        }
                        w(-oa.indent), p("case"), this.cases.push(q(20)), b = !0, p(":"), ba["(verb)"] = "case";
                        break;
                    case "default":
                        switch (ba["(verb)"]) {
                            case "break":
                            case "continue":
                            case "return":
                            case "throw":
                                break;
                            default:
                                Ja.test(ia[ma.line - 2]) || i("Expected a 'break' statement before 'default'.", xa)
                        }
                        w(-oa.indent), p("default"), b = !0, p(":");
                        break;
                    case "}":
                        return ga -= oa.indent, w(), p("}", a), (1 === this.cases.length || "true" === this.condition.id || "false" === this.condition.id) && (oa.onecase || i("This 'switch' should be an 'if'.", this)),
                            ba["(breakage)"] -= 1, void(ba["(verb)"] = void 0);
                    case "(end)":
                        return void k("Missing '{a}'.", ma, "}");
                    default:
                        if (b) switch (xa.id) {
                            case ",":
                                return void k("Each value should have its own case label.");
                            case ":":
                                b = !1, T();
                                break;
                            default:
                                return void k("Missing ':' on a case clause.", xa)
                        } else {
                            if (":" !== xa.id) return void k("Expected '{a}' and instead saw '{b}'.", ma, "case", ma.value);
                            p(":"), k("Unexpected '{a}'.", xa, ":"), T()
                        }
                }
            }).labelled = !0, B("debugger", function() {
                return oa.debug || i("All 'debugger' statements should be removed."), this
            }).exps = !0,
            function() {
                var a = B("do", function() {
                    ba["(breakage)"] += 1, ba["(loopage)"] += 1, this.first = V(!0), p("while");
                    var a = ma;
                    return u(xa, a), p("("), t(), q(20), "=" === ma.id && (oa.boss || i("Expected a conditional expression and instead saw an assignment."), p("="), q(20)), p(")", a), t(ra, xa), ba["(breakage)"] -= 1, ba["(loopage)"] -= 1, this
                });
                a.labelled = !0, a.exps = !0
            }(), C("for", function() {
                var a, b = ma;
                if (ba["(breakage)"] += 1, ba["(loopage)"] += 1, p("("), u(this, b), t(), "in" === o("var" === ma.id ? 1 : 0).id) {
                    if ("var" === ma.id) p("var"), eb.fud.call(eb, !0);
                    else {
                        switch (ba[ma.value]) {
                            case "unused":
                                ba[ma.value] = "var";
                                break;
                            case "var":
                                break;
                            default:
                                i("Bad for in variable '{a}'.", ma, ma.value)
                        }
                        p()
                    }
                    return p("in"), q(20), p(")", b), a = V(!0, !0), oa.forin && a && (a.length > 1 || "object" != typeof a[0] || "if" !== a[0].value) && i("The body of a for in should be wrapped in an if statement to filter unwanted properties from the prototype.", this), ba["(breakage)"] -= 1, ba["(loopage)"] -= 1, this
                }
                if (";" !== ma.id)
                    if ("var" === ma.id) p("var"), eb.fud.call(eb);
                    else
                        for (var c = 0; 1 > c && (q(0, "for"), "," === ma.id);) y();
                if (x(xa), p(";"), ";" !== ma.id && (q(20), "=" === ma.id && (oa.boss || i("Expected a conditional expression and instead saw an assignment."), p("="), q(20))), x(xa), p(";"), ";" === ma.id && k("Expected '{a}' and instead saw '{b}'.", ma, ")", ";"), ")" !== ma.id)
                    for (var d = 0; 1 > d && (q(0, "for"), "," === ma.id);) y();
                return p(")", b), t(ra, xa), V(!0, !0), ba["(breakage)"] -= 1, ba["(loopage)"] -= 1, this
            }).labelled = !0, B("break", function() {
                var a = ma.value;
                return 0 === ba["(breakage)"] && i("Unexpected '{a}'.", ma, this.value), oa.asi || x(this), ";" !== ma.id && xa.line === ma.line && ("label" !== ba[a] ? i("'{a}' is not a statement label.", ma, a) : ta[a] !== ba && i("'{a}' is out of scope.", ma, a), this.first = ma, p()), R("break"), this
            }).exps = !0, B("continue", function() {
                var a = ma.value;
                return 0 === ba["(breakage)"] && i("Unexpected '{a}'.", ma, this.value), oa.asi || x(this), ";" !== ma.id ? xa.line === ma.line && ("label" !== ba[a] ? i("'{a}' is not a statement label.", ma, a) : ta[a] !== ba && i("'{a}' is out of scope.", ma, a), this.first = ma, p()) : ba["(loopage)"] || i("Unexpected '{a}'.", ma, this.value), R("continue"), this
            }).exps = !0, B("return", function() {
                return this.line === ma.line ? ("(regexp)" === ma.id && i("Wrap the /regexp/ literal in parens to disambiguate the slash operator."), ";" === ma.id || ma.reach || (u(xa, ma), "=" !== o().value || oa.boss || j("Did you mean to return a conditional instead of an assignment?", xa.line, xa.character + 1), this.first = q(0))) : oa.asi || x(this), R("return"), this
            }).exps = !0, B("throw", function() {
                return x(this), u(xa, ma), this.first = q(20), R("throw"), this
            }).exps = !0, G("class"), G("const"), G("enum"), G("export"), G("extends"), G("import"), G("super"), G("let"), G("yield"), G("implements"), G("interface"), G("package"), G("private"), G("protected"), G("public"), G("static");
        var fb = function(a, g, h) {
            var j, k, l, m, n, o = {};
            if (d.errors = [], d.undefs = [], pa = Object.create(_a), e(pa, h || {}), g) {
                if (j = g.predef)
                    if (Array.isArray(j))
                        for (k = 0; k < j.length; k += 1) pa[j[k]] = !0;
                    else if ("object" == typeof j)
                    for (l = Object.keys(j), k = 0; k < l.length; k += 1) pa[l[k]] = !!j[l[k]];
                for (n = Object.keys(g), m = 0; m < n.length; m++) o[n[m]] = g[n[m]]
            }
            for (oa = o, oa.indent = oa.indent || 4, oa.maxerr = oa.maxerr || 50, wa = "", k = 0; k < oa.indent; k += 1) wa += " ";
            ga = 1, da = Object.create(pa), ta = da, ba = {
                "(global)": !0,
                "(name)": "(global)",
                "(scope)": ta,
                "(breakage)": 0,
                "(loopage)": 0
            }, ca = [ba], ya = [], ua = null, ka = {}, la = null, ea = {}, fa = !1, ja = [], ha = !1, Aa = 0, db.init(a), qa = !0, va = {}, ra = xa = ma = bb["(begin)"];
            for (var q in g) b(g, q) && c(q, xa);
            f(), e(pa, h || {}), y.first = !0, sa = void 0;
            try {
                switch (p(), ma.id) {
                    case "{":
                    case "[":
                        oa.laxbreak = !0, ha = !0, _();
                        break;
                    default:
                        U(), va["use strict"] && !oa.globalstrict && i('Use the function form of "use strict".', ra), T()
                }
                p(ma && "." !== ma.value ? "(end)" : void 0);
                var r = function(a, b) {
                        do {
                            if ("string" == typeof b[a]) return "unused" === b[a] ? b[a] = "var" : "unction" === b[a] && (b[a] = "closure"), !0;
                            b = b["(context)"]
                        } while (b);
                        return !1
                    },
                    s = function(a, b) {
                        if (ea[a]) {
                            for (var c = [], d = 0; d < ea[a].length; d += 1) ea[a][d] !== b && c.push(ea[a][d]);
                            0 === c.length ? delete ea[a] : ea[a] = c
                        }
                    };
                for (k = 0; k < d.undefs.length; k += 1) l = d.undefs[k].slice(0), r(l[2].value, l[0]) ? s(l[2].value, l[2].line) : i.apply(i, l.slice(1))
            } catch (t) {
                if (t) {
                    var u = ma || {};
                    d.errors.push({
                        raw: t.raw,
                        reason: t.message,
                        line: t.line || u.line,
                        character: t.character || u.from
                    }, null)
                }
            }
            return 0 === d.errors.length
        };
        return fb.data = function() {
            var a, c, d, e, f, g, h, i = {
                    functions: [],
                    options: oa
                },
                j = [],
                k = [],
                l = [];
            fb.errors.length && (i.errors = fb.errors), ha && (i.json = !0);
            for (g in ea) b(ea, g) && j.push({
                name: g,
                line: ea[g]
            });
            for (j.length > 0 && (i.implieds = j), ya.length > 0 && (i.urls = ya), c = Object.keys(ta), c.length > 0 && (i.globals = c), e = 1; e < ca.length; e += 1) {
                for (d = ca[e], a = {}, f = 0; f < Va.length; f += 1) a[Va[f]] = [];
                for (g in d) b(d, g) && "(" !== g.charAt(0) && (h = d[g], "unction" === h && (h = "unused"), Array.isArray(a[h]) && (a[h].push(g), "unused" === h && l.push({
                    name: g,
                    line: d["(line)"],
                    "function": d["(name)"]
                })));
                for (f = 0; f < Va.length; f += 1) 0 === a[Va[f]].length && delete a[Va[f]];
                a.name = d["(name)"], a.param = d["(params)"], a.line = d["(line)"], a.last = d["(last)"], i.functions.push(a)
            }
            l.length > 0 && (i.unused = l), k = [];
            for (g in ka)
                if ("number" == typeof ka[g]) {
                    i.member = ka;
                    break
                }
            return i
        }, fb.report = function(a) {
            function b(a, b) {
                var c, d, e;
                if (b) {
                    for (o.push("<div><i>" + a + "</i> "), b = b.sort(), d = 0; d < b.length; d += 1) b[d] !== e && (e = b[d], o.push((c ? ", " : "") + e), c = !0);
                    o.push("</div>")
                }
            }
            var c, d, e, f, g, h, i, j, k, l = fb.data(),
                m = [],
                n = "",
                o = [];
            if (l.errors || l.implieds || l.unused) {
                if (e = !0, o.push("<div id=errors><i>Error:</i>"), l.errors)
                    for (g = 0; g < l.errors.length; g += 1) c = l.errors[g], c && (d = c.evidence || "", o.push("<p>Problem" + (isFinite(c.line) ? " at line " + c.line + " character " + c.character : "") + ": " + c.reason.entityify() + "</p><p class=evidence>" + (d && (d.length > 80 ? d.slice(0, 77) + "..." : d).entityify()) + "</p>"));
                if (l.implieds) {
                    for (k = [], g = 0; g < l.implieds.length; g += 1) k[g] = "<code>" + l.implieds[g].name + "</code>&nbsp;<i>" + l.implieds[g].line + "</i>";
                    o.push("<p><i>Implied global:</i> " + k.join(", ") + "</p>")
                }
                if (l.unused) {
                    for (k = [], g = 0; g < l.unused.length; g += 1) k[g] = "<code><u>" + l.unused[g].name + "</u></code>&nbsp;<i>" + l.unused[g].line + "</i> <code>" + l.unused[g]["function"] + "</code>";
                    o.push("<p><i>Unused variable:</i> " + k.join(", ") + "</p>")
                }
                l.json && o.push("<p>JSON: bad.</p>"), o.push("</div>")
            }
            if (!a) {
                for (o.push("<br><div id=functions>"), l.urls && b("URLs<br>", l.urls, "<br>"), l.json && !e ? o.push("<p>JSON: good.</p>") : l.globals ? o.push("<div><i>Global</i> " + l.globals.sort().join(", ") + "</div>") : o.push("<div><i>No new global variables introduced.</i></div>"), g = 0; g < l.functions.length; g += 1) f = l.functions[g], o.push("<br><div class=function><i>" + f.line + "-" + f.last + "</i> " + (f.name || "") + "(" + (f.param ? f.param.join(", ") : "") + ")</div>"), b("<big><b>Unused</b></big>", f.unused), b("Closure", f.closure), b("Variable", f["var"]), b("Exception", f.exception), b("Outer", f.outer), b("Global", f.global), b("Label", f.label);
                if (l.member) {
                    if (m = Object.keys(l.member), m.length) {
                        for (m = m.sort(), n = "<br><pre id=members>/*members ", i = 10, g = 0; g < m.length; g += 1) h = m[g], j = h.name(), i + j.length > 72 && (o.push(n + "<br>"), n = "    ", i = 1), i += j.length + 2, 1 === l.member[h] && (j = "<i>" + j + "</i>"), g < m.length - 1 && (j += ", "), n += j;
                        o.push(n + "<br>*/</pre>")
                    }
                    o.push("</div>")
                }
            }
            return o.join("")
        }, fb.jshint = fb, fb
    }();
    "object" == typeof b && b && (b.JSHINT = d), WebPDF.JSHINT = d
}), define("core/Plugins/Form/FormXMLParser", [], function(a, b, c) {
    function d(a) {
        return a.replace(/(^\s*)|(\s*$)/g, "")
    }

    function e(a) {
        return a.replace(/\s+/g, "_").replace(/\./g, "_")
    }

    function f(a) {
        var b = a;
        return b = b.replace(/&amp;/g, "&"), b = b.replace(/&lt;/g, "<"), b = b.replace(/&gt;/g, ">"), b = b.replace(/&apos;/g, "'"), b = b.replace(/&quot;/g, '"'), b = b.replace(/\r/g, ""), b = b.replace(/\n/g, " ")
    }

    function g(a) {
        var b = a;
        return b = b.replace(/&/g, "&amp;"), b = b.replace(/</g, "&lt;"), b = b.replace(/>/g, "&gt;"), b = b.replace(/\'/g, "&apos;"), b = b.replace(/\"/g, "&quot;")
    }

    function h(a, b) {
        var c = 0;
        return a && "undefined" != typeof a.attr(b) && (c = parseFloat(a.attr(b))), c
    }

    function j(a, b) {
        var c = "";
        return a && "undefined" != typeof a.attr(b) && (c = f(a.attr(b))), c
    }

    function k(a, b, c, d, e) {
        a && a.css({
            left: b + "px",
            top: c + "px",
            width: d + "px",
            height: e + "px"
        })
    }

    function l() {
        this.top = 0, this.left = 0, this.width = 0, this.height = 0, this.setValue = function(a, b, c, d) {
            this.left = a, this.top = b, this.width = c, this.height = d
        }
    }

    function m() {
        this.strID = "", this.strBgID = "", this.strFgID = "", this.name = "", this.type = ya.Unknown, this.fieldAction = [], this.rect = new l, this.borderWidth = 0, this.fontSize = 12, this.bReadOnly = !1, this.bRequired = !1, this.curPageObj = null, this.readerApp = null, this.parse = function(a, b, c) {
            if (this.strID = a, this.strBgID = a + "_bg", this.strFgID = a + "_fg", this.curPageObj = c, b) {
                var e = this;
                this.curPageObj && b.children("Pos").each(function() {
                    e.rect = e.curPageObj.Transform(h($(this), "l"), h($(this), "b"), h($(this), "w"), h($(this), "h"))
                }), b.children("General").each(function() {
                    $(this).children("ReadOnly").each(function() {
                        e.bReadOnly = "1" == d($(this).text()) ? !0 : !1
                    }), $(this).children("Required").each(function() {
                        e.bRequired = "1" == d($(this).text()) ? !0 : !1
                    })
                }), b.children("Ap").each(function() {
                    $(this).children("Font").each(function() {
                        e.fontSize = h($(this), "FontSize")
                    }), $(this).children("BS").each(function() {
                        $(this).children("W").each(function() {
                            e.borderWidth = parseFloat($(this).text())
                        })
                    })
                }), this.name = j(b, "Name"), this.type = parseInt(h(b, "Type")), b.children("AA").each(function() {
                    $(this).children().each(function() {
                        var a = [],
                            b = 0;
                        $(this).children().each(function() {
                            var c = f($(this).text());
                            c && (a[b++] = c)
                        }), e.fieldAction[$(this)[0].tagName] = a
                    })
                })
            }
        }, this.getControlID = function() {
            return this.strID
        }, this.getRegisterActionCode = function() {
            if (this.type == ya.Text || this.type == ya.RichText)
                for (key in this.fieldAction)
                    for (var a = this.fieldAction[key], b = 0; b < a.length; b++)
                        if (a[b] && "" != a[b]) {
                            if ("C" == key) {
                                var c = a[b].replace(/\/\*{1,2}[\s\S]*?\*\//, ""),
                                    e = c.match(oa);
                                if (e && e.length > 1)
                                    for (var f = e[1].replace(/\s+/g, " ").replace(/\./g, "").replace(/\"/g, "").replace(/\,/g, ","), g = f.split(","), h = 0; h < g.length; h++) WebPDF.g_formValue.setNeedClac(d(g[h]), this.name)
                            }
                            $("#" + this.strID).AddActionJS(key, a[b], !0)
                        }
        }
    }

    function n() {
        this.formWidget = new m, this.value = "", this.NImgPos = 0, this.RImgPos = 0, this.DImgPos = 0, this.BgColor = 0, this.parser = function(a, b, c) {
            if (this.formWidget.parse(a, b, c), b) {
                var e = this;
                b.children("Value").each(function() {
                    e.value = f($(this).text())
                }), b.children("Ap").each(function() {
                    $(this).children("N").each(function() {
                        e.NImgPos = h($(this), "Path")
                    }), $(this).children("R").each(function() {
                        e.RImgPos = h($(this), "Path")
                    }), $(this).children("D").each(function() {
                        e.DImgPos = h($(this), "Path")
                    })
                }), b.children("MK").each(function() {
                    $(this).children("BG").each(function() {
                        e.BgColor = (16777215 & parseInt(d($(this).text()))).toString(16)
                    })
                })
            }
        }, this.getControlID = function() {
            return this.formWidget.getControlID()
        }, this.getHtmlCode = function(a, b) {
            var c = "display:none;",
                d = parseInt(this.formWidget.rect.left * wa.PointToPx * b + .5),
                e = parseInt(this.formWidget.rect.top * wa.PointToPx * b + .5),
                f = parseInt(this.formWidget.rect.width * wa.PointToPx * b + .5),
                g = parseInt(this.formWidget.rect.height * wa.PointToPx * b + .5),
                h = String.Format(xa.styleLTWH + "position:absolute;padding:0;cursor:pointer;", d, e, f, g),
                i = 0 - parseInt(this.NImgPos * b + .5),
                j = parseInt(this.formWidget.curPageObj.allImgWidth * b + .5),
                k = parseInt(this.formWidget.curPageObj.allImgHeight * b + .5),
                l = String.Format(xa.styleLTWH + "position:absolute;padding:0;cursor:pointer;", i, 0, j, k),
                m = String.Format(xa.styleLTWH + "position:absolute;background-image:none;overflow:hidden;background-color:#{4}", d, e, f, g, this.BgColor),
                n = String.Format("<div name='{0}'><div id='{1}' style='{2}'>", this.formWidget.name, this.formWidget.strBgID, m);
            return n += String.Format("<img class='fwr-form-widget fwr-form-image' tabindex=1 src='{0}' id='{1}' name='{2}' value='{3}'style='{4}'/>", this.formWidget.curPageObj.m_imgUrl, this.getControlID(), this.formWidget.name, this.value, l), n += "</div>", (!a || this.formWidget.bReadOnly) && (h += c), n += String.Format("<div id='{0}' class='{1} fwr-form-widget' style='{2}'></div></div>", this.formWidget.strFgID, this.formWidget.bRequired ? qa : pa, h)
        }, this.getReadyBindCode = function() {
            if (!this.formWidget.bReadOnly) {
                var a = this.getControlID(),
                    b = $("#" + a);
                b.on("focus", {
                    id: a,
                    fgid: this.formWidget.strFgID
                }, z), b.on("blur", {
                    id: a,
                    fgid: this.formWidget.strFgID
                }, A), b.on("mouseout", {
                    id: a,
                    curPageNum: this.formWidget.curPageObj.m_iPageNum,
                    nImgPos: this.NImgPos,
                    rImgPos: this.RImgPos,
                    dImgPos: this.DImgPos
                }, B), b.on("mouseover", {
                    id: a,
                    curPageNum: this.formWidget.curPageObj.m_iPageNum,
                    nImgPos: this.NImgPos,
                    rImgPos: this.RImgPos,
                    dImgPos: this.DImgPos
                }, C), b.on("mousemove", {
                    id: a,
                    curPageNum: this.formWidget.curPageObj.m_iPageNum,
                    nImgPos: this.NImgPos,
                    rImgPos: this.RImgPos,
                    dImgPos: this.DImgPos
                }, D), b.on("mousedown", {
                    id: a,
                    curPageNum: this.formWidget.curPageObj.m_iPageNum,
                    nImgPos: this.NImgPos,
                    rImgPos: this.RImgPos,
                    dImgPos: this.DImgPos
                }, F), $("#" + this.formWidget.strFgID).on("click", {
                    id: a
                }, y)
            }
        }, this.changeSize = function(a) {
            var b = parseInt(this.formWidget.rect.left * wa.PointToPx * a + .5),
                c = parseInt(this.formWidget.rect.top * wa.PointToPx * a + .5),
                d = parseInt(this.formWidget.rect.width * wa.PointToPx * a + .5),
                e = parseInt(this.formWidget.rect.height * wa.PointToPx * a + .5);
            k($("#" + this.formWidget.strBgID), b, c, d, e), k($("#" + this.formWidget.strFgID), b, c, d, e);
            var f = 0 - parseInt(this.NImgPos * a + .5),
                g = parseInt(this.formWidget.curPageObj.allImgWidth * a + .5),
                h = parseInt(this.formWidget.curPageObj.allImgHeight * a + .5);
            k($("#" + this.getControlID()), f, 0, g, h)
        }, this.changeHighlight = function(a) {
            this.formWidget.bReadOnly || $("#" + this.formWidget.strFgID).css("display", a ? "" : "none")
        }, this.resetData = function() {}, this.update = function() {}, this.getRegisterActionCode = function(a) {}
    }

    function o() {
        this.formWidget = new m, this.value = "", this.initValue = "", this.bCheck = !1, this.bRadiosInUnison = !1, this.bNoToggleToOff = !0, this.offImgPos = 0, this.onImgPos = 0, this.BgColor = 0, this.stateValue = "", this.objNum = -1, this.index = -1, this.parser = function(a, b, c) {
            if (this.formWidget.parse(a, b, c), b) {
                var e = this;
                b.children("Value").each(function() {
                    e.value = f($(this).text()), e.initValue = e.value
                }), b.children("ObjNum").each(function() {
                    e.objNum = parseInt(d($(this).text()))
                }), b.children("State").each(function() {
                    $(this).children("Checked").each(function() {
                        e.bCheck = parseInt(h($(this), "Checked")) > 0 ? !0 : !1
                    }), $(this).children("Unison").each(function() {
                        e.bRadiosInUnison = parseInt(h($(this), "Unison")) > 0 ? !0 : !1
                    }), e.bRadiosInUnison || $(this).children("Index").each(function() {
                        e.index = parseInt(h($(this), "Index"))
                    })
                }), b.children("Ap").each(function() {
                    $(this).children("N").each(function() {
                        $(this).children("Off").each(function() {
                            e.offImgPos = h($(this), "Path")
                        }), $(this).children("On").each(function() {
                            e.onImgPos = h($(this), "Path")
                        })
                    })
                }), b.children("MK").each(function() {
                    $(this).children("BG").each(function() {
                        e.BgColor = (16777215 & parseInt(d($(this).text()))).toString(16)
                    })
                }), "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) ? WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.bCheck ? this.value : "Off") : this.bCheck && "Off" == WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value), this.bCheck ? this.stateValue = this.value : this.stateValue = "Off"
            }
        }, this.getControlID = function() {
            return this.formWidget.getControlID()
        }, this.getHtmlCode = function(a, b) {
            var c = "display:none;",
                d = parseInt(this.formWidget.rect.left * wa.PointToPx * b + .5),
                e = parseInt(this.formWidget.rect.top * wa.PointToPx * b + .5),
                f = parseInt(this.formWidget.rect.width * wa.PointToPx * b + .5),
                g = parseInt(this.formWidget.rect.height * wa.PointToPx * b + .5),
                h = String.Format(xa.styleLTWH + "position:absolute;padding:0;cursor:pointer;", d, e, f, g),
                i = 0 - parseInt(this.onImgPos * b + .5),
                j = 0 - parseInt(this.offImgPos * b + .5),
                k = parseInt(this.formWidget.curPageObj.allImgWidth * b + .5),
                l = parseInt(this.formWidget.curPageObj.allImgHeight * b + .5),
                m = 1 == $("#" + this.getControlID()).attr("isChecked"),
                n = String.Format(xa.styleLTWH + "position:absolute;padding:0;cursor:pointer;", this.bCheck || m ? i : j, 0, k, l),
                o = String.Format(xa.styleLTWH + "position:absolute;background-image:none;overflow:hidden;background-color:#{4};", d, e, f, g, this.BgColor),
                p = String.Format("<div name='{0}'><div id='{1}' style='{2}'>", this.formWidget.name, this.formWidget.strBgID, o);
            return p += String.Format("<img class='fwr-form-widget fwr-form-image' tabindex=1 src='{0}' id='{1}' name='{2}' checked='{3}' value='{4}'style='{5}' stateValue='{6}' objNum='{7}'/>", this.formWidget.curPageObj.m_imgUrl, this.getControlID(), this.formWidget.name, this.bCheck ? "1" : "0", this.value, n, this.stateValue, this.objNum), p += "</div>", (!a || this.formWidget.bReadOnly) && (h += c), p += String.Format("<div id='{0}' class='{1} fwr-form-widget' style='{2}'></div></div>", this.formWidget.strFgID, this.formWidget.bRequired ? qa : pa, h)
        }, this.getReadyBindCode = function() {
            if (!this.formWidget.bReadOnly) {
                var a = this.getControlID(),
                    b = $("#" + a);
                b.on("click", {
                    id: a,
                    bNoToggleToOff: this.bNoToggleToOff
                }, L), b.on("focus", {
                    id: a,
                    fgid: this.formWidget.strFgID
                }, I), b.on("blur", {
                    id: a,
                    fgid: this.formWidget.strFgID
                }, J), $("#" + this.formWidget.strFgID).on("click", {
                    id: a
                }, H)
            }
        }, this.changeSize = function(a) {
            var b = parseInt(this.formWidget.rect.left * wa.PointToPx * a + .5),
                c = parseInt(this.formWidget.rect.top * wa.PointToPx * a + .5),
                d = parseInt(this.formWidget.rect.width * wa.PointToPx * a + .5),
                e = parseInt(this.formWidget.rect.height * wa.PointToPx * a + .5);
            k($("#" + this.formWidget.strBgID), b, c, d, e), k($("#" + this.formWidget.strFgID), b, c, d, e);
            var f = this.offImgPos,
                g = parseInt(this.formWidget.curPageObj.allImgWidth * a + .5),
                h = parseInt(this.formWidget.curPageObj.allImgHeight * a + .5);
            1 == $("#" + this.getControlID()).attr("isChecked") && (f = this.onImgPos), f = 0 - parseInt(f * a + .5), k($("#" + this.getControlID()), f, 0, g, h)
        }, this.changeHighlight = function(a) {
            this.formWidget.bReadOnly || $("#" + this.formWidget.strFgID).css("display", a ? "" : "none")
        }, this.resetData = function() {
            "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) ? WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.bCheck ? this.value : "Off") : this.bCheck && "Off" == WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value), this.bCheck ? this.stateValue = this.value : this.stateValue = "Off", G(this, this.bCheck)
        }, this.update = function() {
            var a = arguments[0] ? arguments[0] : "",
                b = WebPDF.g_formValue.GetItemValue(this.formWidget.name),
                c = !1;
            if ("undefined" != typeof b) {
                a && "" != a || (a = this.formWidget.curPageObj.GetRadioGroupSelectedItemID(this.formWidget.name));
                var d = $("#" + this.getControlID());
                d.attr("isChecked") && -1 == this.index || !d.attr("isChecked") && this.bRadiosInUnison || WebPDF.g_formValue.isImport() && !this.bRadiosInUnison && 0 == this.index ? (c = this.value == b, d.attr("stateValue", "Off")) : WebPDF.g_formValue.isImport() && !this.bRadiosInUnison && 0 != this.index ? (c = !1, d.attr("stateValue", "Off")) : c = d.attr("stateValue") == this.value, !a || "" == a || this.bRadiosInUnison || WebPDF.g_formValue.isImport() || (c = c && a == this.getControlID())
            }
            G(this, c), this.formWidget.readerApp && this.initValue != b && this.formWidget.readerApp.getDocView().setModified(!0)
        }, this.getRegisterActionCode = function(a) {}
    }

    function p() {
        this.formWidget = new m, this.value = "", this.initValue = "", this.bCheck = !1, this.offImgPos = 0, this.onImgPos = 0, this.BgColor = 0, this.objNum = -1, this.parser = function(a, b, c) {
            if (this.formWidget.parse(a, b, c), b) {
                var e = this;
                if (b.children("Value").each(function() {
                        e.value = f($(this).text()), e.initValue = e.value
                    }), b.children("ObjNum").each(function() {
                        e.objNum = parseInt(d($(this).text()))
                    }), b.children("State").each(function() {
                        $(this).children("Checked").each(function() {
                            e.bCheck = parseInt(h($(this), "Checked")) > 0 ? !0 : !1
                        })
                    }), b.children("Ap").each(function() {
                        $(this).children("N").each(function() {
                            $(this).children("Off").each(function() {
                                e.offImgPos = h($(this), "Path")
                            }), $(this).children("On").each(function() {
                                e.onImgPos = h($(this), "Path")
                            })
                        })
                    }), b.children("MK").each(function() {
                        $(this).children("BG").each(function() {
                            e.BgColor = (16777215 & parseInt(d($(this).text()))).toString(16)
                        })
                    }), "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name)) {
                    var g = this.bCheck ? this.value : "Off";
                    e.initValue = g, WebPDF.g_formValue.SetItemValue(this.formWidget.name, g)
                } else this.bCheck && "Off" == WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value)
            }
        }, this.getControlID = function() {
            return this.formWidget.getControlID()
        }, this.getHtmlCode = function(a, b) {
            var c = "display:none;",
                d = parseInt(this.formWidget.rect.left * wa.PointToPx * b + .5),
                e = parseInt(this.formWidget.rect.top * wa.PointToPx * b + .5),
                f = parseInt(this.formWidget.rect.width * wa.PointToPx * b + .5),
                g = parseInt(this.formWidget.rect.height * wa.PointToPx * b + .5),
                h = String.Format(xa.styleLTWH + "position:absolute;padding:0;cursor:pointer;", d, e, f, g),
                i = 0 - parseInt(this.onImgPos * b + .5),
                j = 0 - parseInt(this.offImgPos * b + .5),
                k = parseInt(this.formWidget.curPageObj.allImgWidth * b + .5),
                l = parseInt(this.formWidget.curPageObj.allImgHeight * b + .5),
                m = 1 == $("#" + this.getControlID()).attr("isChecked"),
                n = String.Format(xa.styleLTWH + "position:absolute;padding:0;cursor:pointer;", this.bCheck || m ? i : j, 0, k, l),
                o = String.Format(xa.styleLTWH + "position:absolute;background-image:none;overflow:hidden;background-color:#{4};", d, e, f, g, this.BgColor),
                p = String.Format("<div name='{0}'><div id='{1}' style='{2}'>", this.formWidget.name, this.formWidget.strBgID, o);
            return p += String.Format("<img class='fwr-form-widget fwr-form-image' tabindex=1 src='{0}' id='{1}' name='{2}' checked='{3}' value='{4}' style='{5}' objNum='{6}'/>", this.formWidget.curPageObj.m_imgUrl, this.getControlID(), this.formWidget.name, this.bCheck ? "1" : "0", this.value, n, this.objNum), p += "</div>", (!a || this.formWidget.bReadOnly) && (h += c), p += String.Format("<div id='{0}' class='{1} fwr-form-widget' style='{2}'></div></div>", this.formWidget.strFgID, this.formWidget.bRequired ? qa : pa, h)
        }, this.getReadyBindCode = function() {
            if (!this.formWidget.bReadOnly) {
                var a = this.getControlID(),
                    b = $("#" + a);
                b.on("click", {
                    id: a
                }, K), b.on("focus", {
                    id: a,
                    fgid: this.formWidget.strFgID
                }, I), b.on("blur", {
                    id: a,
                    fgid: this.formWidget.strFgID
                }, J), $("#" + this.formWidget.strFgID).on("click", {
                    id: a
                }, H)
            }
        }, this.changeSize = function(a) {
            var b = parseInt(this.formWidget.rect.left * wa.PointToPx * a + .5),
                c = parseInt(this.formWidget.rect.top * wa.PointToPx * a + .5),
                d = parseInt(this.formWidget.rect.width * wa.PointToPx * a + .5),
                e = parseInt(this.formWidget.rect.height * wa.PointToPx * a + .5);
            k($("#" + this.formWidget.strBgID), b, c, d, e), k($("#" + this.formWidget.strFgID), b, c, d, e);
            var f = this.offImgPos,
                g = parseInt(this.formWidget.curPageObj.allImgWidth * a + .5),
                h = parseInt(this.formWidget.curPageObj.allImgHeight * a + .5);
            1 == $("#" + this.getControlID()).attr("isChecked") && (f = this.onImgPos), f = 0 - parseInt(f * a + .5), k($("#" + this.getControlID()), f, 0, g, h)
        }, this.changeHighlight = function(a) {
            this.formWidget.bReadOnly || $("#" + this.formWidget.strFgID).css("display", a ? "" : "none")
        }, this.resetData = function() {
            "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) ? WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.bCheck ? this.value : "Off") : this.bCheck && "Off" == WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value), G(this, this.bCheck)
        }, this.update = function() {
            var a = WebPDF.g_formValue.GetItemValue(this.formWidget.name);
            if ("undefined" != typeof a) {
                var b = this.value == a;
                G(this, b)
            }
            this.formWidget.readerApp && this.initValue != a && this.formWidget.readerApp.getDocView().setModified(!0)
        }, this.getRegisterActionCode = function(a) {}
    }

    function q() {
        this.formWidget = new m, this.bMultiLine = !1, this.bSpellCheck = !1, this.bLimit = !1, this.maxlen = 0, this.imgPos = 0, this.value = "", this.initValue = "", this.bUnbind = !0, this.alignment = "left", this.BgColor = 0, this.bPassword = !1, this.parser = function(a, b, c) {
            if (this.formWidget.parse(a, b, c), 0 == this.formWidget.borderWidth && (this.formWidget.borderWidth = 1), b) {
                var e = this;
                b.children("Flags").each(function() {
                    $(this).children("MultiLine").each(function() {
                        e.bMultiLine = "1" == d($(this).text()) ? !0 : !1
                    }), $(this).children("SpellCheck").each(function() {
                        e.bSpellCheck = "1" == d($(this).text()) ? !0 : !1
                    }), $(this).children("Password").each(function() {
                        e.bPassword = "1" == d($(this).text()) ? !0 : !1
                    })
                }), b.children("Value").each(function() {
                    e.bPassword ? e.value = "********" : e.value = $(this).text(), e.initValue = e.value
                }), b.children("Ap").each(function() {
                    $(this).children("N").each(function() {
                        e.imgPos = h($(this), "Path")
                    })
                }), b.children("Options").each(function() {
                    $(this).children("Limit").each(function() {
                        e.bLimit = !0, e.maxlen = parseInt(h($(this), "MaxLen"))
                    }), $(this).children("Alignment").each(function() {
                        switch (parseInt(d($(this).text()))) {
                            case 1:
                                e.alignment = "center";
                                break;
                            case 2:
                                e.alignment = "right";
                                break;
                            default:
                                e.alignment = "left"
                        }
                    })
                }), b.children("MK").each(function() {
                    $(this).children("BG").each(function() {
                        e.BgColor = (16777215 & parseInt(d($(this).text()))).toString(16)
                    })
                }), "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) && (WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value), WebPDF.g_formValue.checkCalc(this.formWidget.name, !1))
            }
        }, this.getControlID = function() {
            return this.formWidget.getControlID()
        }, this.getHtmlCode = function(a, b) {
            var c = parseInt(this.formWidget.rect.left * wa.PointToPx * b + .5),
                d = parseInt(this.formWidget.rect.top * wa.PointToPx * b + .5),
                e = parseInt(this.formWidget.rect.width * wa.PointToPx * b + .5),
                f = parseInt(this.formWidget.rect.height * wa.PointToPx * b + .5),
                g = parseInt(this.formWidget.borderWidth * wa.PointToPx * b + .5),
                h = c + g,
                i = d + g,
                j = e - 2 * g,
                k = f - 2 * g,
                l = 0;
            l = -1 != this.formWidget.fontSize ? parseInt(this.formWidget.fontSize * wa.PointToPx * b + .5) : this.bMultiLine ? parseInt(12 * wa.PointToPx * b + .5) : 1 == this.formWidget.curPageObj.rotate || 3 == this.formWidget.curPageObj.rotate ? parseInt(.7 * this.formWidget.rect.width * wa.PointToPx * b + .5) : parseInt(.7 * this.formWidget.rect.height * wa.PointToPx * b + .5);
            var m = 0 - parseInt(this.imgPos * b + .5),
                n = parseInt(this.formWidget.curPageObj.allImgWidth * b + .5),
                o = parseInt(this.formWidget.curPageObj.allImgHeight * b + .5),
                p = String.Format(xa.styleLTWH + "position:absolute;padding:0;", m, 0, n, o),
                q = String.Format(xa.styleLTWH + "position:absolute;background-image:none;overflow:hidden;background-color:#{4};", c, d, e, f, this.BgColor),
                r = String.Format("<div name='{0}'><div id='{1}' style='{2}'>", this.formWidget.name, this.formWidget.strBgID + "_div", q);
            if (r += String.Format("<img class='fwr-form-widget fwr-form-image' src='{0}' id='{1}' style='{2}'/>", this.formWidget.curPageObj.m_imgUrl, this.formWidget.strBgID, p), r += "</div>", this.bMultiLine) {
                var s = String.Format(xa.styleLTWH + "max-width:{2}px;max-height:{3}px;position:absolute;background-image:url(about:blank);background-color:transparent;font-size:{4}px;resize:none;border:0;padding:0;text-align:{5}; -webkit-user-select: auto;", h, i, j, k, l, this.alignment);
                r += String.Format("<textarea id='{0}' name='{1}' style='{2}' class='fwr_form_textarea_none_border fwr-form-widget' multiline='1' {3}>{4}</textarea>", this.getControlID(), this.formWidget.name, s, this.formWidget.bReadOnly ? "readonly='readonly'" : "", this.value)
            } else {
                var s = String.Format(xa.styleLTWH + "line-height:{3}px;position:absolute;font-size:{4}px;background-image:url(about:blank);background-color:transparent;border:0;padding:0;text-align:{5}; -webkit-user-select: auto;", h, i, j, k, l, this.alignment);
                r += String.Format("<input type='text' class='fwr-form-widget' id='{0}' name='{1}' style='{2}' multiline='0' value='{3}' {4}/>", this.getControlID(), this.formWidget.name, s, this.value, this.formWidget.bReadOnly ? "readonly='readonly'" : "")
            }
            var t = String.Format(xa.styleLTWH + "cursor:text;", h, i, j, k);
            return (!a || this.formWidget.bReadOnly) && (t += "display:none"), r += String.Format("<div id='{0}' class='{1} fwr-form-widget' style='{2}'></div></div>", this.formWidget.strFgID, this.formWidget.bRequired ? qa : pa, t)
        }, this.getReadyBindCode = function() {
            var a = this.getControlID(),
                b = $("#" + a);
            this.formWidget.bReadOnly ? this.bMultiLine && (b.on("focus", {
                id: a,
                fgid: this.formWidget.strFgID,
                bReadOnly: this.formWidget.bReadOnly,
                bSpellCheck: this.bSpellCheck,
                bgid: this.formWidget.strBgID
            }, X), b.on("blur", {
                id: a,
                fgid: this.formWidget.strFgID,
                bReadOnly: this.formWidget.bReadOnly,
                bgid: this.formWidget.strBgID
            }, Y)) : (this.bMultiLine ? (b.on("focus", {
                id: a,
                fgid: this.formWidget.strFgID,
                bReadOnly: this.formWidget.bReadOnly,
                bSpellCheck: this.bSpellCheck,
                bgid: this.formWidget.strBgID
            }, X), b.on("blur", {
                id: a,
                fgid: this.formWidget.strFgID,
                bReadOnly: this.formWidget.bReadOnly,
                bgid: this.formWidget.strBgID
            }, Y)) : (b.on("focus", {
                id: a,
                fgid: this.formWidget.strFgID,
                bgid: this.formWidget.strBgID
            }, Z), b.on("blur", {
                id: a,
                fgid: this.formWidget.strFgID,
                bgid: this.formWidget.strBgID
            }, _)), WebPDF.Environment.mobile || WebPDF.Environment.iOS ? $("#" + this.formWidget.strFgID).on("touchstart.jsp", {
                id: a
            }, S) : $("#" + this.formWidget.strFgID).on("click", {
                id: a
            }, S), this.bSpellCheck && (b.on("keypress", {
                id: a,
                bTextarea: this.bMultiLine
            }, P), b.on("paste", {
                id: a,
                bTextarea: this.bMultiLine
            }, R)), this.bLimit && b.on("keypress", {
                id: a,
                bLimit: this.bLimit,
                maxlen: this.maxlen
            }, O))
        }, this.changeSize = function(a) {
            var b = parseInt(this.formWidget.rect.left * wa.PointToPx * a + .5),
                c = parseInt(this.formWidget.rect.top * wa.PointToPx * a + .5),
                d = parseInt(this.formWidget.rect.width * wa.PointToPx * a + .5),
                e = parseInt(this.formWidget.rect.height * wa.PointToPx * a + .5),
                f = parseInt(this.formWidget.borderWidth * wa.PointToPx * a + .5),
                g = b + f,
                h = c + f,
                i = d - 2 * f,
                j = e - 2 * f,
                l = 0;
            if (l = -1 != this.formWidget.fontSize ? parseInt(this.formWidget.fontSize * wa.PointToPx * a + .5) : this.bMultiLine ? parseInt(12 * wa.PointToPx * a + .5) : 1 == this.formWidget.curPageObj.rotate || 3 == this.formWidget.curPageObj.rotate ? parseInt(.7 * this.formWidget.rect.width * wa.PointToPx * a + .5) : parseInt(.7 * this.formWidget.rect.height * wa.PointToPx * a + .5), k($("#" + this.formWidget.strBgID + "_div"), b, c, d, e), this.bMultiLine) {
                var m = $("#" + this.getControlID());
                m.css("max-width", i + "px").css("max-height", j + "px").css("font-size", l + "px"), k(m, g, h, i, j)
            } else {
                var m = $("#" + this.getControlID());
                m.css("line-height", j + "px").css("font-size", l + "px"), k(m, g, h, i, j)
            }
            k($("#" + this.formWidget.strFgID), g, h, i, j);
            var n = 0 - parseInt(this.imgPos * a + .5),
                o = parseInt(this.formWidget.curPageObj.allImgWidth * a + .5),
                p = parseInt(this.formWidget.curPageObj.allImgHeight * a + .5);
            k($("#" + this.formWidget.strBgID), n, 0, o, p)
        }, this.changeHighlight = function(a) {
            this.formWidget.bReadOnly || $("#" + this.formWidget.strFgID).css("display", a ? "" : "none")
        }, this.resetData = function() {
            "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) && (WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value), WebPDF.g_formValue.checkCalc(this.formWidget.name, !1)), this.bUnbind = !0;
            var a = $("#" + this.getControlID());
            this.bMultiLine ? a.val(this.value) : a.attr("value", this.value)
        }, this.update = function() {
            var a = arguments[0] ? arguments[0] : "";
            if (a != this.getControlID()) {
                var b = $("#" + this.getControlID());
                if (!this.formWidget.bReadOnly || this.bUnbind || WebPDF.g_formValue.isImport()) {
                    var c = WebPDF.g_formValue.GetItemValue(this.formWidget.name);
                    "undefined" == typeof c && (c = ""), this.bMultiLine ? b.val(c) : b.attr("value", c), c != this.initValue && this.formWidget.readerApp && this.formWidget.readerApp.getDocView().setModified(!0)
                }
                if (WebPDF.g_formValue.isCalc(this.formWidget.name)) {
                    if (b.attr("noupdate", "true").trigger("blur").trigger("C"), WebPDF.g_formValue.itemsOldValue[this.formWidget.name] = b.attr("value"), void 0 != WebPDF.g_formValue.needCalc[this.formWidget.name] && WebPDF.g_formValue.needCalc[this.formWidget.name].length > 0)
                        for (var d = 0; d < WebPDF.g_formValue.needCalc[this.formWidget.name].length; d++) WebPDF.g_formValue.checkCalc(WebPDF.g_formValue.needCalc[this.formWidget.name][d], !0);
                    WebPDF.g_formValue.checkCalc(this.formWidget.name, !1)
                }
                b.attr("noupdate", "true").trigger("blur").trigger("F"), this.formWidget.bReadOnly && this.bUnbind && (this.bUnbind = !1, setTimeout(function() {
                    b.off(), this.bMultiLine && ($("#" + this.getControlID()).on("focus", {
                        id: this.getControlID(),
                        fgid: this.formWidget.strFgID,
                        bReadOnly: this.formWidget.bReadOnly,
                        bSpellCheck: this.bSpellCheck
                    }, X), $("#" + this.getControlID()).on("blur", {
                        id: this.getControlID(),
                        fgid: this.formWidget.strFgID,
                        bReadOnly: this.formWidget.bReadOnly
                    }, Y))
                }, 1e3))
            }
        }, this.getRegisterActionCode = function(a) {
            this.formWidget.getRegisterActionCode(a);
            var b = this;
            WebPDF.g_formValue.onItemValueChange(e(this.formWidget.name), function() {
                if (void 0 != WebPDF.g_formValue.needCalc[b.formWidget.name] && WebPDF.g_formValue.needCalc[b.formWidget.name].length > 0)
                    for (var a = 0; a < WebPDF.g_formValue.needCalc[b.formWidget.name].length; a++) WebPDF.g_formValue.checkCalc(WebPDF.g_formValue.needCalc[b.formWidget.name][a], !0);
            })
        }
    }

    function r() {
        this.strID = "", this.bSelected = !1, this.realValue = "", this.text = ""
    }

    function s() {
        this.formWidget = new m, this.value = "", this.initValue = "", this.bMultiple = !1, this.imgPos = 0, this.optios = [], this.BgColor = 0;
        var a = !0;
        this.parser = function(b, c, e) {
            if (a = !0, this.formWidget.parse(b, c, e), c) {
                var g = this;
                c.children("Options").each(function() {
                    var a = 0;
                    $(this).children("Option").each(function() {
                        var c = new r;
                        c.strID = b + "_" + a.toString(), c.text = f($(this).text()), c.realValue = j($(this), "realValue"), "" == c.realValue && (c.realValue = c.text), c.bSelected = parseInt(h($(this), "Selected")) > 0 ? !0 : !1, g.optios[a] = c, a++, c.bSelected && ("" != g.value && (g.value += ";"), g.value += c.realValue, g.initValue = g.value)
                    })
                }), c.children("Flags").each(function() {
                    $(this).children("MultiSelect").each(function() {
                        g.bMultiple = "1" == d($(this).text()) ? !0 : !1
                    })
                }), c.children("Ap").each(function() {
                    $(this).children("N").each(function() {
                        g.imgPos = h($(this), "Path")
                    })
                }), c.children("MK").each(function() {
                    $(this).children("BG").each(function() {
                        g.BgColor = (16777215 & parseInt(d($(this).text()))).toString(16)
                    })
                }), "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value)
            }
        }, this.getControlID = function() {
            return this.formWidget.getControlID()
        }, this.getHtmlCode = function(a, b) {
            var c = parseInt(this.formWidget.rect.left * wa.PointToPx * b + .5),
                d = parseInt(this.formWidget.rect.top * wa.PointToPx * b + .5),
                e = parseInt(this.formWidget.rect.width * wa.PointToPx * b + .5),
                f = parseInt(this.formWidget.rect.height * wa.PointToPx * b + .5),
                g = parseInt(this.formWidget.borderWidth * wa.PointToPx * b + .5),
                h = 0;
            h = -1 != this.formWidget.fontSize ? parseInt(this.formWidget.fontSize * wa.PointToPx * b + .5) : parseInt(12 * wa.PointToPx * b + .5);
            var i = this.bMultiple ? "true" : "false",
                j = 0 - parseInt(this.imgPos * b + .5),
                k = parseInt(this.formWidget.curPageObj.allImgWidth * b + .5),
                l = parseInt(this.formWidget.curPageObj.allImgHeight * b + .5),
                m = String.Format(xa.styleLTWH + "position:absolute;padding:0;", j, 0, k, l),
                n = String.Format(xa.styleLTWH + "position:absolute;background-image:none;overflow:hidden;background-color:#{4};", c, d, e, f, this.BgColor),
                o = String.Format("<div name='{0}'><div id='{1}' style='{2}'>", this.formWidget.name, this.formWidget.strBgID + "_div", n);
            o += String.Format("<img class='fwr-form-widget fwr-form-image' src='{0}' id='{1}' style='{2}'/>", this.formWidget.curPageObj.m_imgUrl, this.formWidget.strBgID, m), o += "</div>";
            var p = c + g,
                q = d + g,
                r = e - 2 * g,
                s = f - 2 * g,
                t = this.formWidget.bReadOnly ? "hidden" : "auto",
                u = String.Format(xa.styleLTWH + "position:absolute;background-image:url(about:blank);background-color:transparent;overflow:{4};-moz-user-select:none;", p, q, r, s, t);
            o += String.Format("<div class='fwr-form-widget' id='{0}' name='{1}' style='{2}' fxmultiple='{3}' tabindex=1>", this.getControlID(), this.formWidget.name, u, i);
            for (var v = 0; v < this.optios.length; v++) {
                var w = this.optios[v];
                w && (o += String.Format("<div id='{0}' tabindex=2 style='overflow: hidden; display: block;width:100%;font-size:{1}px;cursor:default;' class='{2} fwr-form-widget' selected='{3}' realValue='{4}'>{5}</div>", w.strID, h, w.bSelected ? ra : "", w.bSelected ? "1" : "0", w.realValue, w.text))
            }
            return o += "</div>", u = String.Format(xa.styleLTWH, p, q, r, s), u += "cursor:default;", (!a || this.formWidget.bReadOnly) && (u += "display:none"), o += String.Format("<div id='{0}' class='{1} fwr-form-widget' style='{2}'></div></div>", this.formWidget.strFgID, this.formWidget.bRequired ? qa : pa, u)
        }, this.getReadyBindCode = function() {
            if (!this.formWidget.bReadOnly) {
                for (var a = this.getControlID(), b = $("#" + a), c = 0; c < this.optios.length; c++) {
                    var d = this.optios[c];
                    if (d) {
                        var e = $("#" + d.strID);
                        e.on("click", {
                            id: d.strID,
                            listdivid: a
                        }, la), e.on("keydown", {
                            id: d.strID,
                            listdivid: a
                        }, ma), e.on("focus", {
                            id: a,
                            fgid: this.formWidget.strFgID,
                            bgid: this.formWidget.strBgID
                        }, ja), e.on("blur", {
                            id: a,
                            fgid: this.formWidget.strFgID,
                            bgid: this.formWidget.strBgID
                        }, ka)
                    }
                }
                b.on("selectstart", function() {
                    return !1
                }).trigger("selectstart"), b.on("keydown", {
                    id: a
                }, na), b.on("focus", {
                    id: a,
                    fgid: this.formWidget.strFgID,
                    bgid: this.formWidget.strBgID
                }, ja), b.on("blur", {
                    id: a,
                    fgid: this.formWidget.strFgID,
                    bgid: this.formWidget.strBgID
                }, ka), $("#" + this.formWidget.strFgID).on("click", {
                    id: a,
                    fgid: this.formWidget.strFgID,
                    optiosCount: this.optios.length
                }, ia)
            }
        }, this.changeSize = function(a) {
            var b = parseInt(this.formWidget.rect.left * wa.PointToPx * a + .5),
                c = parseInt(this.formWidget.rect.top * wa.PointToPx * a + .5),
                d = parseInt(this.formWidget.rect.width * wa.PointToPx * a + .5),
                e = parseInt(this.formWidget.rect.height * wa.PointToPx * a + .5),
                f = parseInt(this.formWidget.borderWidth * wa.PointToPx * a + .5),
                g = b + f,
                h = c + f,
                i = d - 2 * f,
                j = e - 2 * f,
                l = 0;
            l = -1 != this.formWidget.fontSize ? parseInt(this.formWidget.fontSize * wa.PointToPx * a + .5) : parseInt(12 * wa.PointToPx * a + .5), k($("#" + this.formWidget.strBgID + "_div"), b, c, d, e);
            var m = $("#" + this.getControlID());
            k(m, g, h, i, j);
            for (var n = 0; n < this.optios.length; n++) {
                var o = this.optios[n];
                o && (m = $("#" + o.strID), m.css("font-size", l + "px"))
            }
            k($("#" + this.formWidget.strFgID), g, h, i, j);
            var p = 0 - parseInt(this.imgPos * a + .5),
                q = parseInt(this.formWidget.curPageObj.allImgWidth * a + .5),
                r = parseInt(this.formWidget.curPageObj.allImgHeight * a + .5);
            k($("#" + this.formWidget.strBgID), p, 0, q, r)
        }, this.changeHighlight = function(a) {
            this.formWidget.bReadOnly || $("#" + this.formWidget.strFgID).css("display", a ? "" : "none")
        }, this.resetData = function() {
            "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.value);
            for (var a = 0; a < this.optios.length; a++) {
                var b = this.optios[a];
                b && aa($("#" + b.strID), b.bSelected)
            }
        }, this.update = function() {
            var b = null,
                c = WebPDF.g_formValue.GetItemValue(this.formWidget.name);
            c && "" != c && (b = c.split(";"));
            for (var e = 0; e < this.optios.length; e++) {
                var f = this.optios[e];
                if (f) {
                    var g = !1;
                    for (i in b)
                        if (d(b[i]) == f.realValue) {
                            g = !0, a && ($("#" + this.getControlID()).scrollTop(30 * e), a = !1);
                            break
                        }
                    aa($("#" + f.strID), g)
                }
            }
            this.formWidget.readerApp && this.initValue != c && this.formWidget.readerApp.getDocView().setModified(!0)
        }, this.getRegisterActionCode = function(a) {}
    }

    function t() {
        this.formWidget = new m, this.listDivID = "", this.imgPos = 0, this.bEdit = !1, this.optios = [], this.selectValue = "", this.selectText = "", this.value = "", this.initValue = "", this.inputID = "", this.BgColor = 0, this.parser = function(a, b, c) {
            if (this.formWidget.parse(a, b, c), this.listDivID = a + "_list", this.inputID = a + "_input", b) {
                var e = this;
                b.children("Options").each(function() {
                    var a = 0;
                    $(this).children("Option").each(function() {
                        var b = new r;
                        b.strID = e.listDivID + "_" + a.toString(), b.text = f($(this).text()), b.realValue = j($(this), "realValue"), "" == b.realValue && (b.realValue = b.text), b.bSelected = parseInt(h($(this), "Selected")) > 0 ? !0 : !1, e.optios[a] = b, a++, b.bSelected && (e.selectValue = b.realValue, e.selectText = b.text)
                    })
                }), b.children("Value").each(function() {
                    e.value = d($(this).text()), e.initValue = e.value
                }), b.children("General").each(function() {
                    $(this).children("Edit").each(function() {
                        e.bEdit = "1" == d($(this).text()) ? !0 : !1
                    })
                }), b.children("Ap").each(function() {
                    $(this).children("N").each(function() {
                        e.imgPos = h($(this), "Path")
                    })
                }), b.children("MK").each(function() {
                    $(this).children("BG").each(function() {
                        e.BgColor = (16777215 & parseInt(d($(this).text()))).toString(16)
                    })
                }), "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.selectValue ? this.selectValue : this.value)
            }
        }, this.getControlID = function() {
            return this.formWidget.getControlID()
        }, this.getHtmlCode = function(a, b) {
            var c = parseInt(this.formWidget.rect.left * wa.PointToPx * b + .5),
                d = parseInt(this.formWidget.rect.top * wa.PointToPx * b + .5),
                e = parseInt(this.formWidget.rect.width * wa.PointToPx * b + .5),
                f = parseInt(this.formWidget.rect.height * wa.PointToPx * b + .5),
                g = parseInt(this.formWidget.borderWidth * wa.PointToPx * b + .5),
                h = c + g,
                i = d + g,
                j = e - 2 * g,
                k = f - 2 * g,
                l = 0,
                m = 0; - 1 != this.formWidget.fontSize ? (l = parseInt(this.formWidget.fontSize * wa.PointToPx * b + .5), m = l) : (l = 1 == this.formWidget.curPageObj.rotate || 3 == this.formWidget.curPageObj.rotate ? parseInt(.7 * this.formWidget.rect.width * wa.PointToPx * b + .5) : parseInt(.7 * this.formWidget.rect.height * wa.PointToPx * b + .5), m = parseInt(12 * wa.PointToPx * b + .5));
            var n = d + f,
                o = 0 - parseInt(this.imgPos * b + .5),
                p = parseInt(this.formWidget.curPageObj.allImgWidth * b + .5),
                q = parseInt(this.formWidget.curPageObj.allImgHeight * b + .5),
                r = String.Format(xa.styleLTWH + "position:absolute;padding:0;", o, 0, p, q),
                s = String.Format(xa.styleLTWH + "position:absolute;background-image:none;overflow:hidden;background-color:#{4};", c, d, e, f, this.BgColor),
                t = String.Format("<div name='{0}'><div id='{1}' style='{2}'>", this.formWidget.name, this.formWidget.strBgID + "_div", s);
            t += String.Format("<img class='fwr-form-widget fwr-form-image' src='{0}' id='{1}' style='{2}'/>", this.formWidget.curPageObj.m_imgUrl, this.formWidget.strBgID, r), t += "</div>";
            var u = String.Format(xa.styleLTWH + "line-height:{3}px;position:absolute;font-size:{4}px;text-align:center;padding:0;background-image:url(about:blank);", h, i, j, k, l);
            t += String.Format("<div class='fwr-form-widget' id='{0}' name='{1}' style='{2}' tabindex=1></div>", this.getControlID(), this.formWidget.name, u);
            var v = h,
                w = i,
                x = j,
                y = k,
                z = parseInt(16 * wa.PointToPx + .5),
                A = 0,
                B = 0,
                C = 0,
                D = 0,
                E = "",
                F = "",
                G = 0,
                H = 0,
                I = 0;
            switch (I = 12 > m ? 14 * this.optios.length : (m + 2) * this.optios.length, this.formWidget.curPageObj.rotate) {
                case 1:
                    y -= z, D = f, H = x, G = y, A = Math.abs(y - x) / 2, E = WebPDF.Common.getTransformCssString(90 * this.formWidget.curPageObj.rotate, A, A), B = D - (D - I) / 2 + .5, C = (D + I) / 2, F = WebPDF.Common.getTransformCssString(90 * this.formWidget.curPageObj.rotate, -B, C + 2);
                    break;
                case 2:
                    x -= z, v += z, D = e, G = x, H = y, E = WebPDF.Common.getTransformCssString(90 * this.formWidget.curPageObj.rotate, 0, 0), B = 0, C = I, F = WebPDF.Common.getTransformCssString(90 * this.formWidget.curPageObj.rotate, B, C + f + .5);
                    break;
                case 3:
                    y -= z, w += z, D = f, H = x, G = y, A = Math.abs(y - x) / 2, E = WebPDF.Common.getTransformCssString(90 * this.formWidget.curPageObj.rotate, 0 - A, 0 - A), B = (D + I) / 2, C = (D - I) / 2 + .5 - e, F = WebPDF.Common.getTransformCssString(90 * this.formWidget.curPageObj.rotate, B + 2, -C);
                    break;
                default:
                    x -= z, D = e, G = x, H = y
            }
            u = String.Format(xa.styleLTWH + "line-height:{3}px;position:absolute;font-size:{4}px;background-image:url(about:blank);background-color:transparent;padding:0;border:0;", v, w, G, H, l), u += E, t += String.Format("<input class='fwr-form-widget' type='text' id='{0}' style='{1}' value='{2}' oldValue='{2}' realValue='{3}' {4}/>", this.inputID, u, this.selectValue ? this.selectText : this.value, this.selectValue ? this.selectValue : this.value, this.formWidget.bReadOnly || !this.bEdit ? "readonly='readonly'" : ""), u = String.Format("left:{0}px;top:{1}px;width:{2}px;position: absolute;background-color:#ffffff;border: 1px solid #6ea3c4;display:none;overflow:auto;", c, n, D), u += F, t += String.Format("<div id='{0}' style='{1}' class='fwr-form-widget-combo-list' tabindex=2>", this.listDivID, u);
            for (var J = 0; J <= this.optios.length; J++) {
                var K = this.optios[J];
                K && (t += String.Format("<div id='{0}' style='overflow: hidden;display: block;width:100%;font-size:{1}px;' tabindex=3 class='fwr_form_combobox_item {2}' selected='{3}'  realValue='{4}'>{5}</div>", K.strID, m, K.bSelected ? ra : "", K.bSelected ? "1" : "0", K.realValue, K.text))
            }
            return t += "</div>", u = String.Format(xa.styleLTWH, h, i, j, k), u += "cursor:default;", (!a || this.formWidget.bReadOnly) && (u += "display:none"), t += String.Format("<div id='{0}' class='{1} fwr-form-widget' style='{2}'></div></div>", this.formWidget.strFgID, this.formWidget.bRequired ? qa : pa, u)
        }, this.getReadyBindCode = function() {
            if (!this.formWidget.bReadOnly) {
                var a = this.getControlID();
                $("#" + a).on("focus", {
                    inputid: this.inputID
                }, ba), $("#" + a).on("click", {
                    inputid: this.inputID
                }, ca), $("#" + this.inputID).on("focus", {
                    id: a,
                    listdivid: this.listDivID,
                    fgid: this.formWidget.strFgID,
                    inputid: this.inputID,
                    bgid: this.formWidget.strBgID
                }, da), $("#" + this.inputID).on("click", {
                    listdivid: this.listDivID,
                    fgid: this.formWidget.strFgID
                }, ea), $("#" + this.inputID).on("blur", {
                    id: a,
                    listdivid: this.listDivID,
                    fgid: this.formWidget.strFgID,
                    inputid: this.inputID,
                    bgid: this.formWidget.strBgID
                }, fa), $("#" + this.listDivID).on("blur", {
                    id: a,
                    listdivid: this.listDivID,
                    fgid: this.formWidget.strFgID,
                    inputid: this.inputID,
                    bgid: this.formWidget.strBgID
                }, fa);
                for (var b = 0; b < this.optios.length; b++) {
                    var c = this.optios[b];
                    c && ($("#" + c.strID).on("click", {
                        id: c.strID,
                        combodivid: a
                    }, ga), $("#" + c.strID).on("blur", {
                        id: a,
                        listdivid: this.listDivID,
                        fgid: this.formWidget.strFgID,
                        inputid: this.inputID,
                        bgid: this.formWidget.strBgID
                    }, fa))
                }
                $("#" + this.formWidget.strFgID).on("click", {
                    inputid: this.inputID
                }, ca)
            }
        }, this.changeSize = function(a) {
            var b = parseInt(this.formWidget.rect.left * wa.PointToPx * a + .5),
                c = parseInt(this.formWidget.rect.top * wa.PointToPx * a + .5),
                d = parseInt(this.formWidget.rect.width * wa.PointToPx * a + .5),
                e = parseInt(this.formWidget.rect.height * wa.PointToPx * a + .5),
                f = parseInt(this.formWidget.borderWidth * wa.PointToPx * a + .5),
                g = b + f,
                h = c + f,
                i = d - 2 * f,
                j = e - 2 * f,
                l = c + e,
                m = 0,
                n = 0; - 1 != this.formWidget.fontSize ? (m = parseInt(this.formWidget.fontSize * wa.PointToPx * a + .5), n = m) : (m = 1 == this.formWidget.curPageObj.rotate || 3 == this.formWidget.curPageObj.rotate ? parseInt(.7 * this.formWidget.rect.width * wa.PointToPx * a + .5) : parseInt(.7 * this.formWidget.rect.height * wa.PointToPx * a + .5), n = parseInt(12 * wa.PointToPx * a + .5)), k($("#" + this.formWidget.strBgID + "_div"), b, c, d, e);
            var o = $("#" + this.getControlID());
            o.css("line-height", j + "px").css("font-size", m + "px"), k(o, g, h, i, j);
            var p = g,
                q = h,
                r = i,
                s = j,
                t = parseInt(16 * wa.PointToPx * a + .5),
                u = 0,
                v = 0,
                w = 0,
                x = 0,
                y = 0,
                z = 0;
            switch (this.formWidget.curPageObj.rotate) {
                case 1:
                    s -= t, x = e, z = r, y = s, u = Math.abs(s - r) / 2;
                    var A = $("#" + this.inputID);
                    WebPDF.Common.addTranslateCss(A, 90 * this.formWidget.curPageObj.rotate, u, u);
                    break;
                case 2:
                    r -= t, p += t, x = d, y = r, z = s;
                    var A = $("#" + this.inputID);
                    WebPDF.Common.addTranslateCss(A, 90 * this.formWidget.curPageObj.rotate, 0, 0);
                    break;
                case 3:
                    s -= t, q += t, x = e, z = r, y = s, u = Math.abs(s - r) / 2;
                    var A = $("#" + this.inputID);
                    WebPDF.Common.addTranslateCss(A, 90 * this.formWidget.curPageObj.rotate, 0 - u, 0 - u);
                    break;
                default:
                    r -= t, x = d, y = r, z = s
            }
            o = $("#" + this.inputID), o.css("line-height", z + "px").css("font-size", m + "px"), k(o, p, q, y, z), o = $("#" + this.listDivID), o.css("left", b + "px").css("top", l + "px").css("width", x + "px");
            for (var B = 0; B <= this.optios.length; B++) {
                var C = this.optios[B];
                C && $("#" + C.strID).css("font-size", n + "px")
            }
            k($("#" + this.formWidget.strFgID), g, h, i, j);
            var D = 0 - parseInt(this.imgPos * a + .5),
                E = parseInt(this.formWidget.curPageObj.allImgWidth * a + .5),
                F = parseInt(this.formWidget.curPageObj.allImgHeight * a + .5);
            switch (k($("#" + this.formWidget.strBgID), D, 0, E, F), o = $("#" + this.listDivID), this.formWidget.curPageObj.rotate) {
                case 1:
                    v = o.width() - (o.width() - o.height()) / 2 + .5, w = (o.width() + o.height()) / 2, WebPDF.Common.addTranslateCss(o, 90 * this.formWidget.curPageObj.rotate, -v, w + 2);
                    break;
                case 2:
                    v = 0, w = o.height(), WebPDF.Common.addTranslateCss(o, 90 * this.formWidget.curPageObj.rotate, v, w + e + .5);
                    break;
                case 3:
                    v = (o.width() + o.height()) / 2, w = (o.width() - o.height()) / 2 + .5 - d, WebPDF.Common.addTranslateCss(o, 90 * this.formWidget.curPageObj.rotate, v + 2, -w)
            }
        }, this.changeHighlight = function(a) {
            this.formWidget.bReadOnly || $("#" + this.formWidget.strFgID).css("display", a ? "" : "none")
        }, this.resetData = function() {
            "undefined" == typeof WebPDF.g_formValue.GetItemValue(this.formWidget.name) && WebPDF.g_formValue.SetItemValue(this.formWidget.name, this.selectValue ? this.selectValue : this.value);
            for (var a = 0; a <= this.optios.length; a++) {
                var b = this.optios[a];
                b && aa($("#" + b.strID), b.bSelected)
            }
        }, this.update = function() {
            var a = WebPDF.g_formValue.GetItemValue(this.formWidget.name);
            "undefined" == typeof a && (a = "");
            var b = $("#" + this.inputID);
            b.attr("realValue", a), b.attr("oldValue", a), b.attr("value", a);
            for (var c = 0; c <= this.optios.length; c++) {
                var d = this.optios[c];
                if (d) {
                    var e = d.realValue == a;
                    e && (b.attr("oldValue", d.text), b.val(d.text)), aa($("#" + d.strID), e)
                }
            }
            this.formWidget.readerApp && this.initValue != a && this.formWidget.readerApp.getDocView().setModified(!0)
        }, this.getRegisterActionCode = function(a) {
            if (!this.formWidget.bReadOnly && this.bEdit)
                for (key in this.formWidget.fieldAction)
                    for (var b = this.formWidget.fieldAction[key], c = 0; c < b.length; c++) b[c] && "" != b[c] && $("#" + this.inputID).AddActionJS(key, b[c], !1);
            else this.formWidget.getRegisterActionCode(a)
        }
    }

    function u(a, b, c) {
        var d, e = null;
        return b && (d = parseInt(h(b, "Type")), d == ya.PushButton ? (e = new n, e.parser(a, b, c)) : d == ya.RadioButton ? (e = new o, e.parser(a, b, c)) : d == ya.CheckBox ? (e = new p, e.parser(a, b, c)) : d == ya.Text || d == ya.RichText ? (e = new q, e.parser(a, b, c)) : d == ya.ListBox ? (e = new s, e.parser(a, b, c)) : d == ya.ComboBox && (e = new t, e.parser(a, b, c))), e
    }

    function v(a) {
        this.scale = 1, this.strID = "", this.strBgID = "", this.pdfRect = new l, this.rotate = 0, this.pageWidth = 0, this.pageHeight = 0, this.imgPos = 0, this.allImgWidth = 0, this.allImgHeight = 0, this.m_imgUrl = "", this.formWidgets = [], this.m_iPageNum = 0, this.m_bLastPage = !1, this.divWidth = 0, this.divHeight = 0, this.pdfDoc = a.getPDFDoc(), this.parserLastPage = function(a, b, c, d) {
            this.m_bLastPage = !0, this.strID = a, this.m_iPageNum = b, this.divWidth = c, this.divHeight = d
        }, this.parser = function(b, c, d) {
            if (this.strID = b, this.strBgID = b + "_bg", this.m_iPageNum = c, this.m_imgUrl = a.getOptions().url + "form/bg/" + this.m_iPageNum, this.m_imgUrl += "?", d) {
                var e = this;
                switch (d.each(function() {
                    $(this).children("State").each(function() {
                        e.rotate = parseInt(h($(this), "Rotate")), e.pdfRect.setValue(h($(this), "l"), h($(this), "b"), h($(this), "Width"), h($(this), "Height")), $(this).children("Ap").each(function() {
                            e.imgPos = h($(this), "Path")
                        })
                    }), $(this).children("ImgInfo").each(function() {
                        e.allImgWidth = h($(this), "Width"), e.allImgHeight = h($(this), "Height")
                    })
                }), this.rotate) {
                    case 1:
                    case 3:
                        this.pageHeight = this.pdfRect.width, this.pageWidth = this.pdfRect.height;
                        break;
                    case 2:
                    default:
                        this.pageHeight = this.pdfRect.height, this.pageWidth = this.pdfRect.width
                }
                var f = this;
                d.each(function() {
                    $(this).children("Form").each(function() {
                        var c = 0;
                        $(this).children("Widget").each(function() {
                            e.formWidgets[c] = u(b + "_" + c.toString(), $(this), f), e.formWidgets[c].formWidget.type != ya.PushButton && e.pdfDoc.addFormWidget(e.formWidgets[c]), e.formWidgets[c].formWidget.readerApp = a, c++
                        })
                    })
                })
            }
        }, this.getHtmlCode = function(a, b) {
            if (this.m_bLastPage) {
                var c = String.Format(xa.styleLTWH + "position:absolute;background-color:transparent;", 0, 0, this.divWidth, this.divHeight),
                    d = "<div class='border' id='{0}' style='{1}'><button id='btnreset' style='margin:20px 50px;' class='fwr_button blue fwr_dialog_btn_cancel fr' name='btnreset' type='button'>{2}</button><button id='btnsubmit' style='margin:20px 0px;' class='fwr_button orange fwr_dialog_btn_ok fr' name='btnsubmit' type='button'>{3}</button></div>";
                return String.Format(d, this.strID, c, strArr.resetText, strArr.submitText)
            }
            this.divWidth = this.pageWidth * wa.PointToPx * b, this.divHeight = this.pageHeight * wa.PointToPx * b;
            for (var c = String.Format(xa.styleLTWH + "position:absolute;", 0, 0, parseInt(this.divWidth + .5), parseInt(this.divHeight + .5)), e = String.Format("<div id='{0}' class='" + va + "'style='background-color:transparent;{1}'>", this.strID, c), f = 0; f < this.formWidgets.length; f++) this.formWidgets[f] && (e += this.formWidgets[f].getHtmlCode(a, b));
            return e += "</div>"
        }, this.getRegisterActionCode = function() {
            for (var a = 0; a < this.formWidgets.length; a++) this.formWidgets[a] && this.formWidgets[a].getRegisterActionCode(this)
        }, this.getReadyBindCode = function() {
            for (var a = 0; a < this.formWidgets.length; a++) this.formWidgets[a] && this.formWidgets[a].getReadyBindCode()
        }, this.changeSize = function(a) {
            if (a != this.scale) {
                this.scale = a;
                var b = parseInt(this.divWidth * a + .5),
                    c = parseInt(this.divHeight * a + .5);
                if (k($("#" + this.strID), 0, 0, b, c), this.m_bLastPage) {
                    var d = parseInt(20 * a + .5),
                        e = parseInt(50 * a + .5),
                        f = parseInt(11 * a + .5),
                        g = parseInt(25 * a + .5),
                        h = parseInt(80 * a + .5);
                    $("#btnreset").css("margin", d + "px " + e + "px").css("font-size", f + "px").css("height", g + "px").css("width", h + "px").css("min-width", h + "px"), $("#btnsubmit").css("margin", d + "px 0px").css("font-size", f + "px").css("height", g + "px").css("width", h + "px").css("min-width", h + "px")
                } else
                    for (var i = 0; i < this.formWidgets.length; i++) this.formWidgets[i] && this.formWidgets[i].changeSize(a)
            }
        }, this.ShowPage = function() {
            $("#" + this.strID).show();
            for (var a = 0; a < this.formWidgets.length; a++) this.formWidgets[a] && this.formWidgets[a].update()
        }, this.HidePage = function() {
            $("#" + this.strID).hide()
        }, this.changeHighlight = function(a) {
            for (var b = 0; b < this.formWidgets.length; b++) this.formWidgets[b] && this.formWidgets[b].changeHighlight(a)
        }, this.resetData = function() {
            for (var a = 0; a < this.formWidgets.length; a++) this.formWidgets[a] && this.formWidgets[a].resetData();
            for (var a = 0; a < this.formWidgets.length; a++) this.formWidgets[a] && this.formWidgets[a].update()
        }, this.update = function(a) {
            if ("undefined" == typeof a)
                for (var b = 0; b < this.formWidgets.length; b++) this.formWidgets[b] && this.formWidgets[b].update();
            else
                for (var b = 0; b < this.formWidgets.length; b++) this.formWidgets[b] && this.formWidgets[b].formWidget.name == a && this.formWidgets[b].update(arguments[1])
        }, this.GetRadioGroupSelectedItemID = function(a) {
            for (var b = "", c = 0; c < this.formWidgets.length; c++)
                if (this.formWidgets[c] && this.formWidgets[c].formWidget.name == a) {
                    var d = this.formWidgets[c].getControlID();
                    if ("1" == $("#" + d).attr("isChecked")) {
                        b = d;
                        break
                    }
                }
            return b
        }, this.CheckRequiredWidget = function() {
            for (var a = 0; a < this.formWidgets.length; a++)
                if (this.formWidgets[a] && this.formWidgets[a].formWidget.bRequired && !WebPDF.g_formValue.GetItemValue(this.formWidgets[a].formWidget.name)) return !1;
            return !0
        }, this.Transform = function(a, b, c, d) {
            var e = new l;
            switch (this.rotate) {
                case 1:
                    e.top = a - this.pdfRect.left, e.left = b - this.pdfRect.top, e.width = d, e.height = c;
                    break;
                case 2:
                    e.top = b - this.pdfRect.top, e.left = this.pdfRect.width - a - this.pdfRect.left - c, e.width = c, e.height = d;
                    break;
                case 3:
                    e.top = this.pdfRect.width - (a - this.pdfRect.left) - c, e.left = this.pdfRect.height - (b - this.pdfRect.top) - d, e.width = d, e.height = c;
                    break;
                default:
                    e.top = this.pdfRect.height - (b - this.pdfRect.top) - d, e.left = a - this.pdfRect.left, e.width = c, e.height = d
            }
            return e
        }
    }

    function w() {
        var a = this;
        this.items = [], this.itemsActionJScriptChange = [], this.bImport = !1, this.bCalc = [], this.itemsOldValue = [], this.needCalc = [], this.ClearAll = function() {
            this.items = [], this.itemsActionJScriptChange = [], this.itemsOldValue = []
        }, this.GetItemValue = function(a) {
            return this.items[a]
        }, this.SetItemValue = function(a, b, c) {
            if (this.itemsActionJScriptChange[a]) this.itemsActionJScriptChange[a] = !1;
            else if (this.items[a] = b, this.itemsOldValue[a] != b) {
                this.itemsOldValue[a] = b;
                var d = e(a);
                za.trigger(d, [c])
            }
        }, this.SetItemValue_ActionJScript = function(a, b) {
            this.itemsActionJScriptChange[a] = !0, this.items[a] = b
        }, this.onItemValueChange = function(a, b) {
            "function" == typeof b && za.on(a, function(a, c) {
                b(c)
            })
        }, this.GetFormDataXML = function() {
            var a = '<?xml version="1.0" encoding="UTF-8"?><fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">',
                b = 0;
            for (name in this.items)
                if ("undefined" != typeof this.items[name]) {
                    var c = "FormField" + b.toString();
                    a += String.Format('<{0} xfdf:original="{1}" type>{2}</{0}>', c, name, g(this.items[name].toString())), "" != this.items[name].toString() && b++
                }
            return a += "</fields>", 0 == b ? "" : a
        }, this.setFormDataByXML = function(b) {
            b.children().each(function() {
                var b = j($(this), "xfdf:original"),
                    c = f($(this).text());
                null != b && "" != b ? a.SetItemValue(b, c) : a.SetItemValue($(this)[0].nodeName, c)
            })
        }, this.beginFormImportData = function() {
            this.bImport = !0
        }, this.endFormImportData = function() {
            this.bImport = !1
        }, this.isImport = function() {
            return this.bImport
        }, this.isCalc = function(a) {
            return this.bCalc[a]
        }, this.checkCalc = function(a, b) {
            this.bCalc[a] = b
        }, this.setNeedClac = function(a, b) {
            if (void 0 == this.needCalc[a]) return void(this.needCalc[a] = [b]);
            for (var c = 0; c < this.needCalc[a].length; c++)
                if (this.needCalc[a][c] == b) return;
            var d = this.needCalc[a].length;
            this.needCalc[a][d] = b
        }
    }

    function x(a) {
        var b = WebPDF.g_pFormPlugin.getInitializedPageList();
        for (var c in b) null != b[c] && b[c].update(a, arguments[1])
    }

    function y(a) {
        setTimeout(function() {
            $("#" + a.data.id).focus().trigger("mouseover")
        }, 0)
    }

    function z(a) {
        $("#" + a.data.id).hasClass(sa) && ($("#" + a.data.id).removeClass(sa).addClass(ta), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", "none"))
    }

    function A(a) {
        setTimeout(function() {
            document.activeElement.id && d(document.activeElement.id).toLowerCase() == d(a.data.id).toLowerCase() || ($("#" + a.data.id).removeClass(ta).addClass(sa), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", ""))
        }, 0)
    }

    function B(a) {
        var b = d(a.data.id).toLowerCase();
        if (!Aa) {
            var c = WebPDF.g_pFormPlugin.getInitializedPageList()[a.data.curPageNum],
                e = 0 - parseInt(a.data.nImgPos * c.scale + .5);
            $("#" + a.data.id).css("left", e + "px")
        }
        Ba[b] = !1
    }

    function C(a) {
        var b = d(a.data.id).toLowerCase();
        if (!Aa) {
            var c = WebPDF.g_pFormPlugin.getInitializedPageList()[a.data.curPageNum],
                e = 0 - parseInt(a.data.rImgPos * c.scale + .5);
            $("#" + a.data.id).css("left", e + "px")
        }
        Ba[b] = !0
    }

    function D(a) {
        var b = d(a.data.id).toLowerCase();
        if (!Aa) {
            var c = WebPDF.g_pFormPlugin.getInitializedPageList()[a.data.curPageNum],
                e = 0 - parseInt(a.data.rImgPos * c.scale + .5);
            $("#" + a.data.id).css("left", e + "px")
        }
        Ba[b] = !0
    }

    function E(a) {
        var b = null;
        try {
            b = arguments.caller.length
        } catch (c) {}
        var d = !1;
        return navigator.userAgent.indexOf("MSIE") > 0 && null != b ? 1 == a.button && (d = !0) : 0 == a.button && (d = !0), d
    }

    function F(a) {
        var b = d(a.data.id).toLowerCase();
        if (E(a)) {
            var c = document.getElementById(a.data.id),
                e = WebPDF.g_pFormPlugin.getInitializedPageList()[a.data.curPageNum],
                f = 0 - parseInt(a.data.nImgPos * e.scale + .5),
                g = 0 - parseInt(a.data.rImgPos * e.scale + .5),
                h = 0 - parseInt(a.data.dImgPos * e.scale + .5);
            $("#" + a.data.id).css("left", h + "px"), Aa = !0, a.preventDefault && a.preventDefault(), window.captureEvents ? window.captureEvents(Event.MOUSEUP) : c.setCapture && c.setCapture();
            var i = a.data.id,
                j = document;
            j.onmouseup = function(a) {
                a = a || window.event, E(a) && (window.releaseEvents ? window.releaseEvents(Event.MOUSEUP) : c.releaseCapture && c.releaseCapture(), 1 != Ba[b] || navigator.userAgent.indexOf("MSIE") > 0 || navigator.userAgent.toLowerCase().indexOf("trident") > 0 ? $("#" + i).css("left", f + "px") : $("#" + i).css("left", g + "px"), Aa = !1, j.onmouseup = null)
            }
        }
    }

    function G(a, b) {
        var c = $("#" + a.getControlID()),
            d = "1" == c.attr("isChecked"),
            e = 0 - parseInt((b ? a.onImgPos : a.offImgPos) * a.formWidget.curPageObj.scale + .5);
        b && !d ? c.attr("isChecked", "1").css("left", e + "px") : !b && d && c.attr("isChecked", "0").css("left", e + "px")
    }

    function H(a) {
        setTimeout(function() {
            $("#" + a.data.id).focus().click()
        }, 0)
    }

    function I(a) {
        $("#" + a.data.id).removeClass(sa).addClass(ta), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", "none")
    }

    function J(a) {
        setTimeout(function() {
            document.activeElement.id && d(document.activeElement.id).toLowerCase() == d(a.data.id).toLowerCase() || ($("#" + a.data.id).removeClass(ta).addClass(sa), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", ""))
        }, 0)
    }

    function K(a) {
        var b = $("#" + a.data.id),
            c = "Off";
        "1" != b.attr("isChecked") && (c = b.attr("value")), WebPDF.g_formValue.SetItemValue(b.attr("name"), c), x(b.attr("name"))
    }

    function L(a) {
        var b = $("#" + a.data.id);
        "1" != b.attr("isChecked") ? (b.attr("stateValue", b.attr("value")), WebPDF.g_formValue.SetItemValue(b.attr("name"), b.attr("value")), x(b.attr("name"), b.attr("id"))) : a.data.bNoToggleToOff || (b.attr("stateValue", "Off"), WebPDF.g_formValue.SetItemValue(b.attr("name"), "Off"), x(b.attr("name"), b.attr("id")))
    }

    function M(a) {
        var b = document.getElementById(a);
        if (document.selection) return document.selection.createRange().text;
        if (window.getSelection().toString()) return window.getSelection().toString();
        if (void 0 != b.selectionStart && void 0 != b.selectionEnd) {
            var c = b.selectionStart,
                d = b.selectionEnd;
            return b.value.substring(c, d)
        }
    }

    function N(a, b, c, d) {
        var e = a.replace(/ /g, "&nbsp;"),
            f = c.width();
        if (b) {
            var g = parseInt(c.height() / parseFloat(c.css("font-size")));
            for (f *= g; g > 1;) e += "M", g -= 1
        }
        return d.html(e), d.width() > f
    }

    function O(a) {
        var b = $("#" + a.data.id),
            c = a.data.maxlen,
            d = b.val().toString();
        return d.length == c ? void a.preventDefault() : void 0
    }

    function P(a) {
        if (!a.ctrlKey) {
            var b;
            if (b = document.all ? window.event.keyCode : arguments.callee.caller.arguments[0].which, 8 == b || 46 == b) return !0;
            var c = String.fromCharCode(b),
                d = $("#" + a.data.id),
                e = !1,
                f = M(a.data.id),
                g = "";
            g = f && "" != f ? d.val().replace(f, c) : d.val() + c;
            var h = String.Format('<span id= "SpellCeckSpan" style= "visibility:hidden;border:0;padding:0;font-size:{0};"></span>', d.css("font-size"));
            d.after(h);
            var i = $("#SpellCeckSpan");
            return e = N(g, a.data.bTextarea, d, i), i.remove(), e ? document.all ? (window.event.returnValue = !1, !1) : (arguments.callee.caller.arguments[0].preventDefault(), !0) : void 0
        }
    }

    function Q(a, b) {
        var c = $("#" + a),
            d = c.val(),
            e = String.Format('<span id= "SpellCeckSpan" style= "visibility:hidden;border:0;padding:0;font-size:{0};"></span>', c.css("font-size"));
        c.after(e);
        for (var f = $("#SpellCeckSpan"), g = 0; 1 > g && N(d, b, c, f);) d = d.substr(0, d.length - 1);
        f.remove(), c.val(d)
    }

    function R(a) {
        var b = $("#" + a.data.id),
            c = b.val(),
            d = !1,
            e = String.Format('<span id= "SpellCeckSpan" style= "visibility:hidden;border:0;padding:0;font-size:{0};"></span>', b.css("font-size"));
        b.after(e);
        var f = $("#SpellCeckSpan");
        d = N(c + c.substr(c.length - 1), a.data.bTextarea, b, f), f.remove();
        var g = M(a.data.id);
        return d && !g ? document.all ? (window.event.returnValue = !1, !1) : (arguments.callee.caller.arguments[0].preventDefault(), !0) : void setTimeout(function() {
            Q(a.data.id, a.data.bTextarea)
        }, 0)
    }

    function S(a) {
        setTimeout(function() {
            $("#" + a.data.id).focus()
        }, 0)
    }

    function T(a) {
        var b = document.getElementById(a);
        if (b.createTextRange) {
            var c = document.selection.createRange();
            return c.setEndPoint("StartToStart", b.createTextRange()), c.text.length
        }
        return "number" == typeof b.selectionStart ? b.selectionStart : void 0
    }

    function U(a, b) {
        var c = document.getElementById(a);
        if (b > c.value.length && (b = c.value.length), c.createTextRange) {
            var d = c.createTextRange();
            d.moveStart("character", b), d.collapse(), d.select()
        } else c.setSelectionRange && (c.setSelectionRange(b, b), c.focus())
    }

    function V(a) {
        var b = 0;
        if (a.focus(), a.setSelectionRange) b = a.selectionStart;
        else if (document.selection) {
            var c, d = document.selection.createRange(),
                e = document.body.createTextRange();
            for (e.moveToElementText(a), c = 0; e.compareEndPoints("StartToStart", d) < 0 && 0 !== d.moveStart("character", -1); c++) "\n" == a.value.charAt(c) && c++;
            b = c
        }
        return b
    }

    function W(a, b) {
        if (a.setSelectionRange) a.focus(), a.setSelectionRange(b, b);
        else if (a.createTextRange) {
            var c = a.createTextRange();
            a.value.length === b ? (c.collapse(!1), c.select()) : c.select()
        }
    }

    function X(a) {
        var b = $("#" + a.data.id);
        if (a.data.bReadOnly) return void(a.data.bSpellCheck || b.removeClass(ua));
        if (b.removeClass(sa).addClass(ta), $("#" + a.data.bgid).removeClass(sa).addClass(ta), WebPDF.g_pFormPlugin.isHighlight()) $("#" + a.data.fgid).css("display", "none"), a.data.bSpellCheck || b.removeClass(ua), b.val(WebPDF.g_formValue.GetItemValue(b.attr("name")));
        else {
            var c = V(document.getElementById(a.data.id));
            a.data.bSpellCheck || b.removeClass(ua), b.val(WebPDF.g_formValue.GetItemValue(b.attr("name"))), W(document.getElementById(a.data.id), c)
        }
    }

    function Y(a) {
        var b = $("#" + a.data.id);
        return a.data.bReadOnly ? void b.addClass(ua) : (b.removeClass(ta).addClass(sa), $("#" + a.data.bgid).removeClass(ta).addClass(sa), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", ""), b.addClass(ua), WebPDF.g_formValue.SetItemValue(b.attr("name"), b.val()), "true" == b.attr("noupdate") ? b.attr("noupdate", "") : x(), void b.triggerJSAction())
    }

    function Z(a) {
        var b = $("#" + a.data.id);
        if (b.removeClass(sa).addClass(ta), $("#" + a.data.bgid).removeClass(sa).addClass(ta), WebPDF.g_pFormPlugin.isHighlight()) $("#" + a.data.fgid).css("display", "none"), b.attr("value", WebPDF.g_formValue.GetItemValue(b.attr("name")));
        else {
            var c = T(a.data.id);
            b.attr("value", WebPDF.g_formValue.GetItemValue(b.attr("name"))), U(a.data.id, c)
        }
    }

    function _(a) {
        var b = $("#" + a.data.id);
        b.removeClass(ta).addClass(sa), $("#" + a.data.bgid).removeClass(ta).addClass(sa), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", ""), WebPDF.g_formValue.SetItemValue(b.attr("name"), b.attr("value")), "true" == b.attr("noupdate") ? b.attr("noupdate", "") : x()
    }

    function aa(a, b) {
        b && "1" != a.attr("isSelected") ? a.attr("isSelected", "1").addClass(ra) : b || "0" == a.attr("isSelected") || a.attr("isSelected", "0").removeClass(ra)
    }

    function ba(a) {
        setTimeout(function() {
            $("#" + a.data.inputid).focus()
        }, 0)
    }

    function ca(a) {
        setTimeout(function() {
            $("#" + a.data.inputid).focus().click()
        }, 0)
    }

    function da(a) {
        $("#" + a.data.id).removeClass(sa).addClass(ta), $("#" + a.data.bgid).removeClass(sa).addClass(ta), $("#" + a.data.inputid).removeClass(sa).addClass(ta), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", "none")
    }

    function ea(a) {
        $("#" + a.data.listdivid).show()
    }

    function fa(a) {
        setTimeout(function() {
            if (!document.activeElement.id || d(document.activeElement.id).toLowerCase() != d(a.data.inputid).toLowerCase() && d(document.activeElement.id).toLowerCase() != d(a.data.id).toLowerCase() && -1 == d(document.activeElement.id).toLowerCase().indexOf(d(a.data.id).toLowerCase())) {
                var b = $("#" + a.data.id),
                    c = $("#" + a.data.inputid),
                    e = c.attr("realValue");
                c.val() != c.attr("oldValue") && (e = c.val()), WebPDF.g_formValue.SetItemValue(b.attr("name"), e), x(b.attr("name")), $("#" + a.data.listdivid).hide(), $("#" + a.data.id).removeClass(ta).addClass(sa), $("#" + a.data.bgid).removeClass(ta).addClass(sa), $("#" + a.data.inputid).removeClass(ta).addClass(sa), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", "")
            }
        }, 0)
    }

    function ga(a) {
        var b = $("#" + a.data.id);
        if ("1" != b.attr("isSelected")) {
            var c = $("#" + a.data.combodivid);
            WebPDF.g_formValue.SetItemValue(c.attr("name"), b.attr("realValue")), x(c.attr("name")), $(a.target).trigger("blur")
        }
    }

    function ha(a) {
        for (var b = a, c = a.offsetTop; b = b.offsetParent;) b.offsetTop < 0 || (c += b.offsetTop);
        return c
    }

    function ia(a) {
        var b = document.getElementById(a.data.id),
            c = $(".scroll-pane"),
            d = c.data("jsp"),
            e = a.clientY - ha(b) + d.getContentPositionY() - 2,
            f = "";
        if (a.data.optiosCount > 0) {
            var g = $("#" + a.data.id),
                h = a.data.id + "_0",
                i = parseFloat($("#" + h).css("height"));
            i || (i = parseFloat(document.getElementById(h).scrollHeight));
            var j = parseInt((e + g.scrollTop()) / i) + 1;
            j > 0 && j <= a.data.optiosCount && (f = a.data.id + "_" + (j - 1))
        }
        setTimeout(function() {
            $("#" + a.data.id).focus(), f && "" != f && (Ca = a.ctrlKey, $("#" + f).click())
        }, 0)
    }

    function ja(a) {
        var b = $("#" + a.data.id);
        b.removeClass(sa).addClass(ta), b.children().each(function() {
            $(this).removeClass(sa).addClass(ta)
        }), $("#" + a.data.bgid).removeClass(sa).addClass(ta), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", "none")
    }

    function ka(a) {
        setTimeout(function() {
            var b = -1;
            if (document.activeElement.id) {
                var c = d(document.activeElement.id).toLowerCase(),
                    e = d(a.data.id).toLowerCase();
                b = c.lastIndexOf(e)
            }
            if (0 > b) {
                var f = $("#" + a.data.id);
                f.removeClass(ta).addClass(sa), f.children().each(function() {
                    $(this).removeClass(ta).addClass(sa)
                }), $("#" + a.data.bgid).removeClass(ta).addClass(sa), WebPDF.g_pFormPlugin.isHighlight() && $("#" + a.data.fgid).css("display", "")
            }
        }, 0)
    }

    function la(a) {
        var b = Ca;
        Ca = !1;
        var c = $("#" + a.data.id),
            e = $("#" + a.data.listdivid),
            f = "true" == e.attr("fxmultiple") ? !0 : !1,
            g = "1" == c.attr("isSelected") ? !0 : !1,
            h = c.attr("realValue");
        if (f || !g) {
            e.children().each(function() {
                f && (a.ctrlKey || b) ? $(this).attr("realValue") == h && aa($(this), !g) : aa($(this), $(this).attr("realValue") == h)
            });
            var i = "";
            e.children().each(function() {
                "1" == $(this).attr("isSelected") && ("" != i && (i += ";"), i += d($(this).attr("realValue")))
            }), WebPDF.g_formValue.SetItemValue(e.attr("name"), i), x(e.attr("name"))
        }
    }

    function ma(a) {
        var b = $("#" + a.data.id),
            c = $("#" + a.data.listdivid),
            d = null,
            e = a.keyCode || a.which;
        return 38 == e ? d = b.prev() : 40 == e && (d = b.next()), d && d.attr("tagName") && (WebPDF.g_formValue.SetItemValue(c.attr("name"), d.attr("realValue")), x(c.attr("name")), d.focus()), !1
    }

    function na(a) {
        var b = null,
            c = null,
            d = !1,
            e = a.keyCode || a.which;
        if (38 == e) d = !0;
        else {
            if (40 != e) return !1;
            d = !1
        }
        var f = $("#" + a.data.id);
        f.children().each(function() {
            return b || (b = $(this)), c || "1" == $(this).attr("isSelected") && (c = $(this)), b && c ? !1 : void 0
        });
        var g;
        return c ? (g = d ? c.prev() : c.next(), g && !g.attr("tagName") && (g = c)) : g = b, g && (WebPDF.g_formValue.SetItemValue(f.attr("name"), g.attr("realValue")), x(f.attr("name"))), !1
    }
    var oa = /\s*new Array\s*[^\(]*\(\s*([^\)]*)\)/m;
    String.Format = function() {
        for (var a = arguments[0], b = 0; b < arguments.length - 1; b++) a = a.replace(RegExp("\\{" + b + "\\}", "gm"), arguments[b + 1]);
        return a
    }, WebPDF.getNodeString = j, WebPDF.getNodeFloat = h;
    var pa = "fwr-form-field-highlight",
        qa = "fwr-form-require-field-highlight",
        ra = "fwr-form-listitem-selected",
        sa = "fwr-form-widget",
        ta = "fwr-form-widget-combo-list",
        ua = "fwr-form-textarea-none-border",
        va = "fwr-form-fields-container",
        wa = {
            PointToPx: 96 / 72
        },
        xa = {
            styleLTWH: "left:{0}px;top:{1}px;width:{2}px;height:{3}px;"
        },
        ya = {
            Unknown: 0,
            PushButton: 1,
            RadioButton: 2,
            CheckBox: 3,
            Text: 4,
            RichText: 5,
            File: 6,
            ListBox: 7,
            ComboBox: 8,
            Sign: 9
        },
        za = $("body"),
        Aa = !1,
        Ba = new Array,
        Ca = !1;
    WebPDF.FormPage = v, WebPDF.FormValue = w
}), define("core/Plugins/TextSelection/TextSelectionPlugin", ["core/Plugins/TextSelection/TextSelectionToolHandler", "core/Plugins/TextSelection/Reader_TextSelectTool", "core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage", "core/Plugins/TextSelection/Reader_TextPageSelect"], function(a, b, c) {
    a("core/Plugins/TextSelection/TextSelectionToolHandler");
    var d = a("core/Plugins/TextSelection/Reader_TextSelectTool"),
        e = WebPDF.Tools.TextSelectionToolHandler;
    WebPDF.TextSelectPluginName = "TextSelection Plugin", WebPDF.TextSelectionPlugin = function(a) {
        function b() {
            $(c).on(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, function() {
                var a = null,
                    b = null;
                a = this.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT), a && (b = a.getTextSelectTool()), null != b && (b.highLightAllSelectedText(), b.hideSelectionOperationDiv())
            }).on(WebPDF.EventList.DOCVIEW_PRE_RESIZE, function() {
                var a = null,
                    b = null;
                a = this.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT), a && (b = a.getTextSelectTool()), null != b && (b.highLightAllSelectedText(), b.hideSelectionOperationDiv())
            }).on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function(a, b) {
                if (null != b.pageView) {
                    var c = this.getTextManager();
                    null != c && c.ajaxGetTextPage(b.pageView.getPageIndex(), !0)
                }
            })
        }
        var c = a,
            f = !1,
            g = null;
        this.getName = function() {
            return WebPDF.TextSelectPluginName
        }, this.onRegister = function() {
            return f ? !0 : void 0
        }, this.init = function() {
            g = new e(c), c.registerToolHandler(g), c.isTextSelectEventInit() || (b(), c.setTextSelectEventInit(!0)), f = !0
        }, this.unload = function() {
            var b = d.ToolInstances[a.getAppId()];
            b || delete b, d.ToolInstances = {}, g && g.onDestroy()
        }, this.getSelectedTextRectInfo = function() {
            var a, b, d = c.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
            if (d && (a = d.getTextSelectTool()), null == a || void 0 == a) return null;
            b = a.getSelectedTextRectInfo();
            var e = [];
            e = WebPDF.Common.clone(b);
            var f = c.getPDFDoc(),
                g = e.length;
            for (i = 0; i < g; i++) {
                var h = e[i],
                    k = f.getPage(h.pageIndex),
                    l = h.selectedRectArray,
                    m = l.length,
                    n = [];
                for (j = 0; j < m; j++) {
                    var o = l[j],
                        p = k.transRectToPDF(o);
                    WebPDF.RectUtils.normalize(p), n.push(p)
                }
                h.selectedRectArray = n
            }
            return e
        }, this.highlight = function(a) {
            if (null == a || void 0 == a) return !1;
            var b, d = c.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_SELECTTEXT);
            if (d && (b = d.getTextSelectTool()), null == b || void 0 == b) return !1;
            var e;
            e = WebPDF.Common.clone(a);
            var f = c.getPDFDoc(),
                g = e.length;
            for (i = 0; i < g; i++) {
                var h = e[i],
                    k = f.getPage(h.pageIndex),
                    l = h.selectedRectArray,
                    m = l.length,
                    n = [];
                for (j = 0; j < m; j++) {
                    var o = l[j],
                        p = k.transRectWithPageMatrix(o);
                    WebPDF.RectUtils.normalize(p), n.push(p)
                }
                h.selectedRectArray = n
            }
            b.highLightTextArea(e)
        }
    }, b.createPlugin = function(a) {
        return new WebPDF.TextSelectionPlugin(a)
    }
}), define("core/Plugins/TextSelection/TextSelectionToolHandler", ["core/Plugins/TextSelection/Reader_TextSelectTool", "core/PDFData/Text/Reader_TextObject", "core/PDFData/Text/Reader_TextPage", "core/Plugins/TextSelection/Reader_TextPageSelect"], function(a, b, c) {
    var d = a("core/Plugins/TextSelection/Reader_TextSelectTool");
    return WebPDF.Tools.TOOL_NAME_SELECTTEXT = "Select Text", WebPDF.Tools.TextSelectionToolHandler = function() {
        function a() {
            var a = WebPDF.Config.Plugins.flag,
                b = "fwr-cm-default",
                d = "<li  class='separator'></li>";
            WebPDF.Environment.mobile && (b = "fwr-cm-default-mobile", d = "");
            var f = "<div id='" + c + "'><ul id='" + e + "'class='fwrContextMenu " + b + " fwr-text-selection-operation-bar' style='left: 341px; top: 167px; display: none;'></div>";
            $(document.body).append(f);
            var h = "";
            g.isCopyText() && (h += "<li id='copy_text'   style='' menuname='Copy'>" + i18n.t("CommandUI.Copy") + "</li>");
            var i = g.getOptions();
            i.plugins & a.Comments && !g.isReadOnly() && (h = h + d + "<li id='highlight_annot'   style='' menuname='Highlight'>" + i18n.t("Annot.AnnotSubjHighlight") + "</li><li id='underline_annot'   style='' menuname='Underline'>" + i18n.t("Annot.AnnotSubjUnderline") + "</li>"), $("#" + e).append(h)
        }
        var b = !1,
            c = "fwr-textSelect-context-menu-container",
            e = "fwr-textSelect-context-menu",
            f = null,
            g = null;
        this.getTextSelectTool = function() {
            return f
        }, this.onInit = function(b) {
            g = b, f = d.getTextSelectTool(b, !0), a()
        }, this.onDestroy = function() {
            $("#" + c).remove()
        }, this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_SELECTTEXT
        }, this.getTextMenuID = function() {
            return e
        }, this.onActivate = function() {
            var a = g.getMainView();
            if (a) {
                var b = a.getDocView(),
                    c = $("#" + b.getDocViewContainerID());
                c.css({
                    cursor: "text"
                })
            }
        }, this.onDeactivate = function() {
            f.clearSelection()
        }, this.isEnabled = function() {
            return !0
        }, this.isProcessing = function() {
            return b
        }, this.onLButtonDown = function(a) {
            b = !0;
            var c = g.getMainView().getDocView(),
                d = $("#" + c.getDocViewContainerID());
            return WebPDF.Common.containsNode(d.get(0), a.target, !0) ? (f.onLButtonDown(a), !0) : !1
        }, this.onLButtonUp = function(a) {
            return b = !1, f.onLButtonUp(a), !0
        }, this.onLButtonDblClk = function(a) {
            var b = g.getMainView().getDocView(),
                c = $("#" + b.getDocViewContainerID());
            return WebPDF.Common.containsNode(c.get(0), a.target, !0) ? (f.onLButtonDblClk(a), !0) : !1
        }, this.onMouseMove = function(a) {
            return f.onMouseMove(a), !0
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return f.isSelected() && f.onRButtonUp(a), !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onContextMenu = function(a) {
            if (null != a) try {
                var b = a.attr("menuname");
                if ("Copy" == b) WebPDF.copyText(g, f.getSelectedText());
                else if ("Highlight" == b) {
                    var c = g.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_COMMENT_HIGHTLIGHT);
                    c.createAnnot(), g.getMainView().getDocView().setModified(!0)
                } else if ("Underline" == b) {
                    var d = g.getToolHandlerByName(WebPDF.Tools.TOOL_NAME_COMMENT_UNDERLINE);
                    d.createAnnot(), g.getMainView().getDocView().setModified(!0)
                }
                f.clearSelection(), this.onActivate()
            } catch (e) {}
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return !1
        }, this.onDoubleTap = function(a) {
            return !1
        }, this.onPinchIn = function(a) {
            return !1
        }, this.onPinchOut = function(a) {
            return !1
        }, this.onHold = function(a) {
            var b = g.getMainView().getDocView(),
                c = $("#" + b.getDocViewContainerID());
            if (!WebPDF.Common.containsNode(c.get(0), a.target, !0)) return !1;
            var d = a.srcEvent.touches[0];
            return f.onHold(d), !0
        }
    }, WebPDF.Event.TextSelectionToolHandler
}), define("core/Plugins/Menu/MenuPlugin", [], function(a, b, c) {
    WebPDF.ContextMenuPlugin = function(a) {
        function b(a) {
            var c = "";
            if (!a) return a;
            var d = j.getMenuItem(a.item);
            if (null == d) return "";
            if (c += d.createHtml(), "" === c) return c;
            var e = $(c),
                f = !1,
                g = "";
            if (a.subitems && a.subitems.length > 0)
                for (var h = 0; h < a.subitems.length; h++) {
                    var i = a.subitems[h],
                        k = b(i);
                    "" != k && (f = !0, g += k)
                }
            return f && e.append("<ul>" + g + "</ul>"), c = e.get(0).outerHTML
        }

        function c(a, b, c) {
            var d = a.getScale(),
                e = $("#" + c);
            e.find(".ok").remove();
            var f = b === WebPDF.ZOOM_FIT_WIDTH ? a.isFitWidth() : d === b && !a.isFitWidth();
            f ? e.addClass("icon").prepend('<span class="icon ok"></span>') : e.removeClass("icon").find(".ok").remove()
        }

        function d(a, b, c) {
            return c ? c.hasClass("disabled") ? !1 : (b === WebPDF.ZOOM_FIT_WIDTH ? a.fitWidth() : (a.setFitWidth(!1), a.onZoom(b)), !0) : !1
        }

        function e() {
            var a = j.getAppId(),
                b = a + "_cmz50",
                e = a + "_cmz75",
                f = a + "_cmz100",
                g = a + "_cmz125",
                h = a + "_cmz150",
                i = a + "_cmz200",
                k = a + "_fitWidth",
                l = a + "_previousPage",
                m = a + "_nextPage",
                n = j.getMainView().getDocView();
            j.addMenuItem({
                name: "MenuSeparator",
                createHtml: function() {
                    return "<li class='separator'></li>"
                }
            }), j.addMenuItem({
                name: "MenuZoom50",
                createHtml: function() {
                    return "<li id='" + b + "' class='icon' menuname='MenuZoom50'><span class='ok icon'></span>50%</li>"
                },
                onShow: function() {
                    c(n, .5, b)
                },
                onSelect: function(a) {
                    return d(n, .5, a)
                }
            }), j.addMenuItem({
                name: "MenuZoom75",
                createHtml: function() {
                    return "<li id='" + e + "' class='icon' menuname='MenuZoom75'><span class='ok icon'></span>75%</li>"
                },
                onShow: function() {
                    c(n, .75, e)
                },
                onSelect: function(a) {
                    return d(n, .75, a)
                }
            }), j.addMenuItem({
                name: "MenuZoom100",
                createHtml: function() {
                    return "<li id='" + f + "' class='icon' menuname='MenuZoom100'><span class='ok icon'></span>100%</li>"
                },
                onShow: function() {
                    c(n, 1, f)
                },
                onSelect: function(a) {
                    return d(n, 1, a)
                }
            }), j.addMenuItem({
                name: "MenuZoom125",
                createHtml: function() {
                    return "<li id='" + g + "' class='icon' menuname='MenuZoom125'><span class='ok icon'></span>125%</li>"
                },
                onShow: function() {
                    c(n, 1.25, g)
                },
                onSelect: function(a) {
                    return d(n, 1.25, a)
                }
            }), j.addMenuItem({
                name: "MenuZoom150",
                createHtml: function() {
                    return "<li id='" + h + "' class='icon' menuname='MenuZoom150'><span class='ok icon'></span>150%</li>"
                },
                onShow: function() {
                    c(n, 1.5, h)
                },
                onSelect: function(a) {
                    return d(n, 1.5, a)
                }
            }), j.addMenuItem({
                name: "MenuZoom200",
                createHtml: function() {
                    return "<li id='" + i + "' class='icon' menuname='MenuZoom200'><span class='ok icon'></span>200%</li>"
                },
                onShow: function() {
                    c(n, 2, i)
                },
                onSelect: function(a) {
                    return d(n, 2, a)
                }
            }), j.addMenuItem({
                name: "FitWidth",
                createHtml: function() {
                    return "<li id='" + k + "' class='icon' menuname='FitWidth'><span class='ok icon'></span><label data-i18n='CommandUI.FitWidth'></label></li>"
                },
                onShow: function() {
                    c(n, WebPDF.ZOOM_FIT_WIDTH, k)
                },
                onSelect: function(a) {
                    return d(n, WebPDF.ZOOM_FIT_WIDTH, a)
                }
            }), j.addMenuItem({
                name: "MenuPrevPage",
                createHtml: function() {
                    return "<li  id='" + l + "' class='icon' menuname='MenuPrevPage'><span class='icon icon1'></span><label data-i18n='Menu.PrevPage'></label></li>"
                },
                onShow: function() {
                    var a = $("#" + l);
                    0 === n.getCurPageIndex() ? a.addClass("disabled") : a.removeClass("disabled")
                },
                onSelect: function(a) {
                    if (a) {
                        if (a.hasClass("disabled")) return !1;
                        n.gotoPrevPage()
                    }
                }
            }), j.addMenuItem({
                name: "MenuNextPage",
                createHtml: function() {
                    return "<li  id='" + m + "' class='icon' menuname='MenuNextPage'><span class='icon icon1'></span><label data-i18n='Menu.NextPage'></label></li>"
                },
                onShow: function() {
                    var a = $("#" + m);
                    n.getCurPageIndex() === n.getPageCount() - 1 ? a.addClass("disabled") : a.removeClass("disabled")
                },
                onSelect: function(a) {
                    if (a) {
                        if (a.hasClass("disabled")) return !1;
                        n.gotoNextPage()
                    }
                }
            })
        }

        function f() {
            m = !1
        }

        function g(a) {
            if (!a) return a;
            var b = j.getMenuItem(a.item);
            if (b && (b.onShow(), a.subitems && a.subitems.length > 0))
                for (var c = 0; c < a.subitems.length; c++) {
                    var d = a.subitems[c];
                    g(d)
                }
        }

        function h() {
            m = !0;
            for (var a = WebPDF.Config.MenuBar, b = 0; b < a.length; b++) {
                var c = a[b].plugin,
                    d = WebPDF.Config.Plugins.load[c];
                if (null == d || 0 != d)
                    for (var e = a[b].items, f = 0; f < e.length; f++) g(e[f])
            }
        }

        function i(a) {
            if (null != a) try {
                var b = a.attr("menuname"),
                    c = j.getMenuItem(b);
                c && c.onSelect(a)
            } catch (d) {
                console.error(d)
            }
        }
        var j = a,
            k = j.getAppId() + "FxMenuContainer",
            l = j.getAppId() + "FxMenu",
            m = !1;
        this.getName = function() {
            return "ContextMenu Plugin"
        }, this.onRegister = function() {}, this.init = function() {
            var a = "<div id='" + k + "'><ul id='" + l + "' class='fwrContextMenu fwr-cm-default' style='left: 341px; top: 167px; display: none;'></div>",
                c = j.getMainView();
            $(document.body).append(a), e();
            for (var d = "", g = WebPDF.Config.MenuBar, m = 0; m < g.length; m++) {
                var n = g[m].plugin,
                    o = WebPDF.Config.Plugins.load[n];
                if (null == o || o !== !1)
                    for (var p = g[m].items, q = 0; q < p.length; q++) d += b(p[q])
            }
            $("#" + l).append(d), $("#" + c.getDocView().getDocViewContainerID()).fwrContextMenu(l, {
                onSelect: function(a, b) {
                    return i($(this))
                },
                onShow: function(a, b) {
                    return $("#" + l).i18n(), h()
                },
                onHide: function(a, b) {
                    return f()
                },
                onHover: function(a, b) {
                    return !0
                }
            }, document.getElementById(c.getMainFrameID()))
        }, this.hideMenu = function() {
            if (m) {
                var a = $("#" + l);
                a.css({
                    display: "none"
                })
            }
        }, this.unload = function() {
            $("#" + k).remove()
        }, this.getReaderApp = function() {
            return j
        }
    }, b.createPlugin = function(a) {
        return new WebPDF.ContextMenuPlugin(a)
    }
}), define("core/Plugins/Signature/SignaturePlugin", ["core/Plugins/Signature/SignatureHandleManager", "core/ImageEngine/SignatureUIManager", "core/Math/Rect", "core/WebPDF", "core/Plugins/Signature/NormalSigToolHandler", "core/PDFData/Signature", "core/DataLevel", "core/Math/Point", "core/Plugins/Signature/StraddleSigToolHandler", "core/Plugins/Signature/SignatureMouseHandler"], function(a, b, c) {
    var d = (WebPDF.Config, a("core/Plugins/Signature/SignatureHandleManager")),
        e = a("core/Plugins/Signature/NormalSigToolHandler"),
        f = a("core/Plugins/Signature/StraddleSigToolHandler");
    a("core/PDFData/Signature"), a("core/Plugins/Signature/SignatureMouseHandler"), WebPDF.SignaturePlugin = function(a) {
        function b() {
            $(c).on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function(a, b) {
                var c = this.getPluginByName(WebPDF.SignaturePluginName),
                    d = null;
                c && (d = c.getSigHandleMgr()), d && d.onPageShowComplete(b.pageView)
            }).on(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, function(a, b) {
                var c = this.getPluginByName(WebPDF.SignaturePluginName),
                    d = null;
                c && (d = c.getSigHandleMgr()), d && d.onDocViewZoom(b.newScale)
            }).on(WebPDF.EventList.PAGE_VISIBLE, function(a, b) {
                var d = c.getMainView().getDocView(),
                    e = this.getPluginByName(WebPDF.SignaturePluginName),
                    f = null;
                if (e && (f = e.getSigHandleMgr()), f)
                    for (var g = 0; g < b.pages.length; g++) f.updateSigPosition(d.getPageView(b.pages[g]))
            })
        }
        var c = a,
            g = this,
            h = null;
        WebPDF.SignaturePluginName = "Signature Plugin", this.getName = function() {
            return WebPDF.SignaturePluginName
        }, this.onRegister = function() {}, this.getReaderApp = function() {
            return c
        }, this.getSigHandleMgr = function() {
            return h
        }, this.init = function() {
            h = new d(c, this);
            var a = new WebPDF.Event.SignatureMouseHandler(g);
            c.registerMousePtHandler(a);
            var i = new e(this);
            c.registerToolHandler(i);
            var j = new f(this);
            c.registerToolHandler(j), c.isSignatureEventInit() || (b(), c.setSignatureEventInit(!0))
        }, this.unload = function() {}, this.getReaderApp = function() {
            return c
        }, this.onBeforeUnload = function() {}, this._browser = function() {
            WebPDF.Environment.ie && (WebPDF.Environment.ie8 || WebPDF.Environment.ie8Compact || WebPDF.Environment.ie7Compact || WebPDF.Environment.ie6Compact) && (ie8_below = !0), WebPDF.Environment.safari && Number(WebPDF.Environment.version) > Number(print_lowest_safari) && (safari = !0)
        }, this.sign = function(a) {
            var b = c.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME).getAnnotationDataToSave(),
                d = JSON.stringify(b),
                e = c.getPDFDoc(),
                f = null;
            e && 2 == e.getDocType() && (f = e.getFormXMLData());
            var g = c.getPluginByName(WebPDF.InkSignPluginName).getInkSignData(),
                h = c.getFileID(),
                i = c.getBaseUrl() + "api/signature/" + h + "/stamp";
            a.annotData = d, a.formData = f, a.inkData = g, successCallback = a.success, failCallback = a.fail, a.success = null, a.fail = null, $.ajax({
                type: "POST",
                url: i,
                data: a,
                success: function(a) {
                    var b = a.resultMsg;
                    if (0 == a.resultCode && "" != a.resultBody.exparams) b = i18n.t("Signature.SigScuess"), successCallback(b, a.resultBody.exparams);
                    else {
                        switch (a.resultCode) {
                            case 101:
                                b = i18n.t("Signature.SigUserNone");
                                break;
                            case 102:
                                b = i18n.t("Signature.SigDocNone");
                                break;
                            case 201:
                                b = i18n.t("Signature.SignatureUnregistered");
                                break;
                            default:
                                b = i18n.t("Signature.SigError")
                        }
                        failCallback(b, a.resultBody.exparams)
                    }
                },
                error: function() {
                    var a = i18n.t("Signature.SigError");
                    failCallback(a, "")
                }
            })
        }, this.cancelSign = function(a) {
            var b = c.getMainView().getDocView();
            h.deleteSignature(a), b.setSigAddFlag(!1)
        }, this.getSignatureInfo = function(a, b, d, e, f, g, h) {
            if (null == a) return null;
            var i = a.getPageIndex(),
                j = c.getMainView().getDocView(),
                k = j.getPageView(i),
                l = a.getSigName(),
                m = k.getPDFPage(),
                n = m.getSigByName(l);
            if (b && n.setLocation(b), d && n.setReason(d), e && n.setStraddleType(e), g && n.setStraddlePercent(g), f && n.setStraddlePageRange(f), h) {
                var o = null;
                1 == e || 2 == e ? (o = k.getPDFPageHeight(), "top" == h ? h = o : "bottom" == h ? h = 0 : "middle" == h && (h = o / 2)) : 3 == e || 4 == e ? (o = k.getPDFPageWidth(), "right" == h ? h = o : "left" == h ? h = 0 : "middle" == h && (h = o / 2)) : 0 == e && (h = k.getPDFPageHeight() / 2), n.setStraddlePos(h)
            }
            var p = n.getRect();
            n.generatePosionByRect(p);
            var q = JSON.stringify(n.getSigJSONData());
            return q
        }
    }, b.createPlugin = function(a) {
        var b = new WebPDF.SignaturePlugin(a);
        return b
    }
}), define("core/Plugins/Signature/SignatureHandleManager", ["core/ImageEngine/SignatureUIManager", "core/Math/Rect", "core/WebPDF"], function(a, b, c) {
    a("core/ImageEngine/SignatureUIManager");
    var d = WebPDF.PDFPoint,
        e = WebPDF.PDFRect;
    return WebPDF.SignatureHandleManager = function(a, b) {
        function c(a) {
            return new Date(1e3 * parseInt(a)).toLocaleString()
        }
        var f = a,
            g = new WebPDF.ImageEngine.SignatureUIManager(this, f),
            h = (new d(0, 0), []),
            i = [],
            j = this,
            k = !1;
        this.init = function() {}, this.clearAllSelection = function() {
            for (var a = i.length, b = 0; a > b; b++) {
                var c = i[b];
                $("#" + c).remove(), delete i[b]
            }
            i.length = 0, i = []
        }, this.clearAllSigLayer = function() {
            for (var a = h.length, b = 0; a > b; b++) {
                var c = h[b];
                $("#" + c).remove(), delete h[b]
            }
            h.length = 0
        }, this.hideSigLayer = function() {
            var a = f.getMainView().getDocView(),
                b = g.getSigLayerID(a),
                c = $("#" + b).find("div");
            null != c && c.remove(), $("#" + b).hide()
        }, this.showSigLayer = function(a) {
            var b = g.getSigLayerID(a);
            if (!k) {
                var c = g.getPageViewSigLayerHtml(a),
                    d = $("#" + a.getDocViewContainerID()),
                    e = a.getPageView(0);
                null != e && e.isContentCreated() ? $("#" + e.getPageViewContainerID()).parent().parent().append(c) : d.append(c), k = !0
            }
            $("#" + b).show()
        }, this.getSigUIMgr = function() {
            return g
        }, this.addSignature = function(a, b) {
            this.clearAllSigLayer(), this.hideSigLayer();
            var c = g.getPageViewSigHtml(a, b),
                d = g.getPageSigContainerID(a);
            $("#" + d).append(c);
            var e = b.getSigName(),
                i = g.getPageSigID(a, e),
                j = b.getRect(),
                k = a.pdfRectToDeviceRect(j, !0);
            g.updatePageViewSigLayerPos(i, k), h.push(i);
            var l = f.getMainView().getDocView();
            l.setSigAddFlag(!0)
        }, this.deleteSignature = function(a) {
            if (null == a) return !1;
            for (var b = a.getPageIndex(), c = f.getMainView().getDocView(), d = c.getPageView(b), e = g.getPageSigID(d, a.getSigName()), j = i.length, k = j - 1; k > -1; k--) {
                var l = i[k];
                l == e && (delete i[k], i.pop(k))
            }
            for (var j = h.length, k = j - 1; k > -1; k--) {
                var m = h[k];
                m == e && ($("#" + m).remove(), delete h[k], h.pop(k))
            }
            var n = d.getPDFPage();
            n.deleteSigByName(a.getSigName());
            var c = f.getMainView().getDocView();
            c.setSigAddFlag(!1)
        }, this.getsigVisibleOffset = function(a, b, c, d, e, f) {
            var h = a.getPageViewHeight(),
                i = a.getPageViewWidth(),
                j = c - e,
                k = d - f,
                l = ($("#" + b), g.getSigPageviewRect(b)),
                m = a.getDocView().getRotate();
            if (j > 0) {
                var n = 0;
                90 == m ? (j = -j, n = l.top - j, 0 > n && (j = -l.top)) : 180 == m ? (j = -j, n = l.left + j, 0 > n && (j = -l.left)) : 270 == m ? (n = l.bottom + j, n > i && (j = i - l.bottom)) : (n = l.right + j, n > i && (j = i - l.right))
            } else {
                var o = 0;
                90 == m ? (j = -j, o = l.bottom + j, o > i && (j = i - l.bottom)) : 180 == m ? (j = -j, o = l.right + j, o > i && (j = i - l.right)) : 270 == m ? (o = l.top + j, 0 > o && (j = -l.top)) : (o = l.left + j, 0 > o && (j = 0 - l.left))
            }
            if (k > 0) {
                var p = 0;
                90 == m ? (p = l.right + k, p > h && (k = h - l.right)) : 180 == m ? (k = -k, p = l.top + k, 0 > p && (k = -l.top)) : 270 == m ? (k = -k, p = l.left + k, 0 > p && (k = -l.left)) : (p = l.bottom + k, p > h && (k = h - l.bottom))
            } else {
                var q = 0;
                90 == m ? (q = l.left + k, 0 > q && (k = -l.left)) : 180 == m ? (k = -k, q = l.bottom + k, q > h && (k = h - l.bottom)) : 270 == m ? (k = -k, q = l.right + k, q > h && (k = h - l.right)) : (q = l.top + k, 0 > q && (k = 0 - l.top))
            }
            return {
                x: j,
                y: k
            }
        }, this.onSigSelectedLButtonDown = function(a, b) {
            if (this.isSignatureSelected(a, b)) return !0;
            if (!b.isLayerBoder()) {
                var c = g.getPageSigID(a, b.getSigName()),
                    d = $("#" + c);
                d.addClass("fwr-sig-layer-select");
                var e = d.width(),
                    f = d.height();
                this.updateSigBorderHtml(c, e, f, !0)
            }
            this.addSelection(c)
        }, this.updateSigBorderHtml = function(a, b, c, d) {
            var e = g.getSigSelectBorderHtml(a, b, c, d),
                h = $("#" + a);
            if (h.append(e), void 0 != h[0]) {
                var i = parseInt(h[0].getAttribute("pageIndex"));
                if (!isNaN(i)) {
                    var k = h[0].getAttribute("Signame"),
                        l = f.getMainView().getDocView(),
                        m = l.getPageView(i),
                        n = m.getPDFPage(),
                        o = n.getSigByName(k);
                    $("#sigAttributesSetting").off("mousedown").bind("mousedown", function() {
                        return $(f).trigger(WebPDF.EventList.SIGNATURE_ADD, {
                            sig: o,
                            sigType: WebPDF.SignatureType.Normal
                        }), !1
                    }), $("#sigDeleteId").off("mousedown").bind("mousedown", function() {
                        return j.deleteSignature(o), !1
                    })
                }
            }
        }, this.isSignatureSelected = function(a, b) {
            for (var c = g.getPageSigID(a, b.getSigName()), d = i.length, e = 0; d > e; e++) {
                var f = i[e];
                if (f == c) return !0
            }
            return !1
        }, this.getSigjasonData = function(a) {
            if (null == a) return !1;
            var b = a.getPageIndex(),
                c = f.getMainView().getDocView(),
                d = c.getPageView(b),
                e = a.getSigName(),
                g = d.getPDFPage(),
                h = g.getSigByName(e),
                i = h.getRect();
            h.generatePosionByRect(i);
            var j = JSON.stringify(h.getSigJSONData());
            return j
        }, this.isSigSelect = function() {
            var a = i.length;
            return 0 == a ? !1 : !0
        }, this.addSelection = function(a) {
            i.push(a)
        }, this.isSigCanBeAdd = function(a) {
            var b = pageView.getPDFPage();
            return b.isSigAdded() ? !1 : void 0
        }, this.onSigAddLButtonDown = function(a) {}, this.onSigAddMousemove = function(a, b) {
            var c = g.getSigLayerID(a);
            if (null != c && void 0 != c) {
                this.showSigLayer(a), g.updatePageViewSigLayerPos(c, b);
                var d = b.right - b.left,
                    e = b.bottom - b.top,
                    f = g.getSigLayerID(a);
                this.updateSigBorderHtml(f, d, e)
            }
        }, this.onStraddleSigAddMousemove = function(a, b) {
            var c = g.getSigLayerID(a);
            null != c && void 0 != c && (this.showSigLayer(a), g.updatePageViewSigLayerPos(c, b))
        }, this.updateSelectSigPosition = function() {
            for (var a = i.length, b = 0; a > b; b++) {
                var c = i[b],
                    d = $("#" + c),
                    g = parseInt(d[0].getAttribute("pageIndex")),
                    h = d[0].getAttribute("Signame"),
                    j = f.getMainView().getDocView(),
                    k = j.getPageView(g),
                    l = new e,
                    m = new e;
                l.top = parseFloat(d.css("top")), l.left = parseFloat(d.css("left")), l.bottom = l.top + parseFloat(d.css("height")), l.right = l.left + parseFloat(d.css("width"));
                var n = j.getRotate();
                90 == n ? (m.top = l.left, m.left = k.getPageViewWidth() - (l.top + parseFloat(d.css("height"))), m.bottom = l.left + parseFloat(d.css("width")), m.right = k.getPageViewWidth() - l.top, l = m) : 180 == n ? (m.top = k.getPageViewHeight() - (l.top + parseFloat(d.css("height"))), m.left = k.getPageViewWidth() - l.right, m.bottom = m.top + parseFloat(d.css("height")), m.right = m.left + parseFloat(d.css("width")), l = m) : 270 == n && (m.top = k.getPageViewHeight() - (l.left + parseFloat(d.css("width"))), m.left = l.top, m.bottom = m.top + parseFloat(d.css("width")), m.right = m.left + parseFloat(d.css("height")), l = m);
                var o = k.deviceRectToPDFRect(l, !0),
                    p = k.getPDFPage(),
                    q = p.getSigByName(h);
                q.setRect(o)
            }
        }, this.onSigSelectedMousemove = function(a, b, c, d, e) {
            if (!this.isSigSelect()) return !1;
            for (var f = 0; f < i.length; f++) {
                var h = i[0],
                    j = this.getsigVisibleOffset(a, h, b, c, d, e);
                g.moveSigPosition(h, j.x, j.y)
            }
        }, this.onSigChangeRect = function(a, b, c, d, e, f) {
            for (var h = 0; h < i.length; h++) {
                var j = i[0],
                    k = this.getsigVisibleOffset(a, j, b, c, d, e),
                    l = g.getSigPageviewRect(j),
                    m = a.getDocView().getRotate();
                if (l.left > l.right) {
                    var n = l.left;
                    l.left = l.right, l.right = n
                }
                if (l.bottom < l.top) {
                    var n = l.bottom;
                    l.bottom = l.top, l.top = n
                }
                if (90 == m || 270 == m) {
                    var o = k.x;
                    k.x = k.y, k.y = o
                }
                this.calculateRectBydirec(l, f, k), g.updatePageViewSigLayerPos(j, l), this.updateSigBorderHtml(j, l.right - l.left, l.bottom - l.top, !0)
            }
        }, this.calculateRectBydirec = function(a, b, c) {
            var d;
            switch (b) {
                case 0:
                    d = a.top + c.y, a.top = d, a.left = a.left + c.x;
                    break;
                case 1:
                    d = a.top + c.y, a.top = d;
                    break;
                case 2:
                    a.top = a.top + c.y, a.right = a.right + c.x;
                    break;
                case 3:
                    a.left = a.left + c.x;
                    break;
                case 4:
                    a.right = a.right + c.x;
                    break;
                case 5:
                    a.left = a.left + c.x, a.bottom = a.bottom + c.y;
                    break;
                case 6:
                    a.bottom = a.bottom + c.y;
                    break;
                case 7:
                    a.right = a.right + c.x, a.bottom = a.bottom + c.y
            }
            a.bottom < a.top && (a.top = a.bottom), a.right < a.left && (a.left = a.right)
        }, this.onPageShowComplete = function(a) {
            if (!a || a.isPageLoadError()) return !1;
            a.getPageIndex();
            if (!a.isSignatureContainerAdd()) {
                var b = "<div id='" + g.getPageSigContainerID(a) + "'> </div>";
                $("#" + a.getPageViewContainerID()).append(b);
                var c = "<div id='" + g.getPageSignedContainerID(a) + "'> </div>";
                $("#" + a.getPageViewContainerID()).append(c), a.setSignatureContainerAdd(!0)
            }
            return !0
        }, this.createPageSignatureSignHtml = function(a) {
            if (null != a) {
                var b = a.getPDFPage(),
                    d = g.getPageSignedContainerID(a);
                b.enumSignature(function(b) {
                    if (!b.isStraddle() && !b.isShow()) return !0;
                    var e = g.createSignatureHtml(a, b);
                    $("#" + d).append(e);
                    var h = b.getRect(),
                        i = a.pdfRectToDeviceRect(h, !0),
                        j = b.getSigName(),
                        k = g.getPageSigID(a, j);
                    g.updatePageViewSigLayerPos(k, i), $("#" + k).on("dblclick tap", function() {
                        var a = $(this).attr("signame"),
                            b = parseInt($(this).attr("pageindex")),
                            d = f.getMainView().getDocView(),
                            e = (d.getPDFDoc(), d.getPageView(b));
                        if (null == e) return !1;
                        var g = e.getPDFPage(),
                            h = g.getSigByName(a);
                        if (null == h) return !1;
                        var i = h.getReason();
                        void 0 == i && (i = "");
                        var j = h.getLocation();
                        void 0 == j && (j = "");
                        var k = h.getSigner(),
                            l = c(h.getModifyTime());
                        return $(f).trigger(WebPDF.EventList.SIGNATURE_PROPERTIES, {
                            signer: k,
                            reason: i,
                            location: j,
                            time: l
                        }), !1
                    })
                })
            }
        }, this.setLocation = function(a, b) {
            if (null == a) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setLocation(b)
        }, this.setReason = function(a, b) {
            if (null == a) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setReason(b)
        }, this.setImageUrl = function(a, b) {
            if (null == a) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                h = a.getSigName(),
                i = e.getPDFPage(),
                j = i.getSigByName(h);
            j.setImageUrl(b);
            var k = g.getPageSigImageID(e, h);
            g.changeSigImage(k, b)
        }, this.setCerType = function(a, b) {
            if (null == a) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setCerType(b)
        }, this.setStraddleType = function(a, b) {
            if (null == a) return !1;
            if (a.getType() != WebPDF.SignatureType.Straddle) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setStraddleType(b)
        }, this.setStraddlePercent = function(a, b) {
            if (null == a) return !1;
            if (a.getType() != WebPDF.SignatureType.Straddle) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setStraddlePercent(b)
        }, this.setStraddlePageRange = function(a, b) {
            if (null == a) return !1;
            if (a.getType() != WebPDF.SignatureType.Straddle) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setStraddlePageRange(b)
        }, this.setStraddlePos = function(a, b) {
            if (null == a) return !1;
            if (a.getType() != WebPDF.SignatureType.Straddle) return !1;
            var c = a.getPageIndex(),
                d = f.getMainView().getDocView(),
                e = d.getPageView(c),
                g = a.getSigName(),
                h = e.getPDFPage(),
                i = h.getSigByName(g);
            i.setStraddlePos(b)
        }, this.cancelSign = function(a) {
            var b = f.getMainView().getDocView();
            this.clearAllSelection(), this.clearAllSigLayer(), b.setSigAddFlag(!1)
        }, this.onDocViewZoom = function(a) {
            for (var b = f.getMainView().getDocView(), c = b.getVisiblePageRange(), d = $("#" + b.getDocViewContainerID()), e = b.getDocViewDimension(), g = e.height, h = e.width, i = d.offset(), k = c.begin; k <= c.end; k++) j.updateSigPosition(b.getPageView(k), h, g, i, !0)
        }, this.updateSigPosition = function(a) {
            if (null != a) {
                var b = a.getPDFPage();
                b.enumSignature(function(b) {
                    var c = b.getSigName(),
                        d = g.getPageSigID(a, c),
                        e = b.getRect(),
                        f = a.pdfRectToDeviceRect(e, !0);
                    g.updatePageViewSigLayerPos(d, f);
                    var h = f.right - f.left,
                        i = f.bottom - f.top;
                    "signature" == b.getType() || b.isLayerBoder() || j.updateSigBorderHtml(d, h, i, !0)
                })
            }
        }, this.onDocViewResize = function() {}
    }, WebPDF.SignatureHandleManager
}), define("core/ImageEngine/SignatureUIManager", ["core/Math/Rect", "core/WebPDF"], function(a, b, c) {
    a("core/Math/Rect");
    var d = (WebPDF.RectUtils, WebPDF.PDFRect),
        e = (WebPDF.Common, WebPDF.PDFData.CommentAnnotType, WebPDF.ImageEngine);
    e.SignatureUIManager = function(a, b) {
        var c = a,
            e = b,
            f = this,
            g = [];
        this.init = function() {}, this.isAddSig = function() {
            return 0 == g.length ? !1 : !0
        }, this.blindSigEvent = function(a) {
            $("#" + a).on("mousedown", function(a) {
                (0 == a.button || 1 == a.button) && (this.classList.add("fwr-sig-layer-select"), c.addSelection(this.id))
            })
        }, this.unbindSigEvent = function(a) {
            $("#" + a).off("mousedown")
        }, this.clearSelected = function(a) {
            $("#" + a).removeClass("fwr-sig-layer-select")
        }, this.updatePageViewSigLayerPos = function(a, b) {
            $("#" + a).css({
                left: b.left + "px",
                top: b.top + "px",
                height: b.bottom - b.top + "px",
                width: b.right - b.left + "px"
            })
        }, this.getSigPageviewRect = function(a) {
            var b = $("#" + a),
                c = new d;
            return c.top = parseFloat(b.css("top")), c.left = parseFloat(b.css("left")), c.bottom = c.top + parseFloat(b.css("height")), c.right = c.left + parseFloat(b.css("width")), c
        }, this.moveSigPosition = function(a, b, c) {
            var d = e.getDocView().getRotate();
            90 == d || 270 == d ? ($("#" + a).css("left", parseFloat($("#" + a).css("left")) + c + "px"), $("#" + a).css("top", parseFloat($("#" + a).css("top")) + b + "px")) : ($("#" + a).css("left", parseFloat($("#" + a).css("left")) + b + "px"), $("#" + a).css("top", parseFloat($("#" + a).css("top")) + c + "px"))
        }, this.changeSigImage = function(a, b) {
            $("#" + a).attr("src", b)
        }, this.changeSigOpacity = function(a, b) {
            $("#" + a).css({
                opacity: b
            })
        }, this.getPageViewSigLayerHtml = function(a) {
            var b = f.getSigLayerID(a),
                c = "<div id='" + b + "' class ='fwr-signature-layer'></div>";
            return c
        }, this.getPageViewSigHtml = function(a, b) {
            var c = b.getSigName(),
                d = f.getPageSigID(a, c),
                e = f.getPageSigImageID(a, c),
                g = "<div style='position: absolute;' id='" + d + "'pageIndex ='" + a.getPageIndex() + "' sigName='" + c + "'><div style='width: 100%;height: 100%'class ='fwr-signature-layer fwr-signature' pageIndex='" + a.getPageIndex() + "' sigName='" + c + "'><Image id='" + e + "'style='width:100%; height:100%' class='fwr-sig-hideimage'> </image></div></div>";
            return g
        }, this.removeBorderHmtl = function(a) {
            var b = a + "_sigBorder",
                c = $("#" + b);
            c.remove()
        }, this.getSigSelectBorderHtml = function(a, c, d, f) {
            var g = e.getDocView().getRotate(),
                h = a + "_sigBorder",
                i = b.getBaseUrl();
            this.removeBorderHmtl(a);
            var j = "";
            if (j = 90 == g || 270 == g ? "<div id='" + h + "'><div class ='fwr-signature-select-border' style='left: -4px;top: -4px; cursor:ne-resize' dir='0'></div><div class ='fwr-signature-select-border' style='left:" + (c / 2 - 4) + "px;top: -4px; cursor:e-resize' dir='1'></div> <div class ='fwr-signature-select-border' style='left:" + (c - 4) + "px;top: -4px; cursor:nw-resize' dir='2'></div> <div class ='fwr-signature-select-border' style='left: -4px;top:" + (d / 2 - 4) + "px; cursor:n-resize' dir='3'></div> <div class ='fwr-signature-select-border' style='left:" + (c - 4) + "px;top:" + (d / 2 - 4) + "px; cursor:n-resize' dir='4'></div> <div class ='fwr-signature-select-border' style='left: -4px;top:" + (d - 4) + "px; cursor:nw-resize' dir='5'></div> <div class ='fwr-signature-select-border' style='left:" + (c / 2 - 4) + "px;top:" + (d - 4) + "px; cursor:e-resize' dir='6'></div> <div class ='fwr-signature-select-border' style='left:" + (c - 4) + "px;top:" + (d - 4) + "px; cursor:ne-resize' dir='7'></div> " : "<div id='" + h + "'><div class ='fwr-signature-select-border' style='left: -4px;top: -4px; cursor:nw-resize' dir='0'></div><div class ='fwr-signature-select-border' style='left:" + (c / 2 - 4) + "px;top: -4px; cursor:n-resize' dir='1'></div> <div class ='fwr-signature-select-border' style='left:" + (c - 4) + "px;top: -4px; cursor:ne-resize' dir='2'></div> <div class ='fwr-signature-select-border' style='left: -4px;top:" + (d / 2 - 4) + "px; cursor:e-resize' dir='3'></div> <div class ='fwr-signature-select-border' style='left:" + (c - 4) + "px;top:" + (d / 2 - 4) + "px; cursor:e-resize' dir='4'></div> <div class ='fwr-signature-select-border' style='left: -4px;top:" + (d - 4) + "px; cursor:ne-resize' dir='5'></div> <div class ='fwr-signature-select-border' style='left:" + (c / 2 - 4) + "px;top:" + (d - 4) + "px; cursor:n-resize' dir='6'></div> <div class ='fwr-signature-select-border' style='left:" + (c - 4) + "px;top:" + (d - 4) + "px; cursor:nw-resize' dir='7'></div> ",
                1 == f) {
                var k = "",
                    l = "";
                90 == g ? (l = "rotate(-" + g + "deg) translateX(-17px) translateY(-17px)", l += "transform:" + l + ";-webkit-transform:" + l + ";-moz-transform:" + l + ";-o-transform;-ms-transform:" + l + ";", k = "<div style='left:" + (c + 5) + "px;top:0px; background-image:url(" + i + "images/cancel-ok-bg.png); position: absolute; width: 60px;" + l + " '>") : 180 == g ? (l = "rotate(-" + g + "deg)", l += "transform:" + l + ";-webkit-transform:" + l + ";-moz-transform:" + l + ";-o-transform;-ms-transform:" + l + ";", k = "<div style='left:0px;top:-30px; background-image:url(" + i + "images/cancel-ok-bg.png); position: absolute; width: 60px;" + l + "'>") : 270 == g ? (l = "rotate(-" + g + "deg) translateX(-17px) translateY(-17px)", l += "transform:" + l + ";-webkit-transform:" + l + ";-moz-transform:" + l + ";-o-transform;-ms-transform:" + l + ";", k = "<div style='left:-65px;top:" + (d - 25) + "px; background-image:url(" + i + "images/cancel-ok-bg.png); position: absolute; width: 60px;" + l + "'>") : (l = "rotate(-" + g + "deg) translateX(-17px) translateY(-17px)", k = "<div style='left:" + (c - 60) + "px;top:" + (d + 5) + "px; background-image:url(" + i + "images/cancel-ok-bg.png); position: absolute; width: 60px;'>"), k += "<img src='" + i + "images/cancel.png' id='sigDeleteId' style='width: 25px;height: 25px;display: inline-block; z-index:3 ;cursor: default;'><img src='" + i + "images/ok.png' id='sigAttributesSetting' style='width: 25px;height: 25px;display: inline-block;margin-left: 7px; z-index:3;  cursor: default;'></div>", j += k
            }
            return j += "</div>"
        }, this.createSignatureHtml = function(a, b) {
            var c = b.getSigName(),
                d = f.getPageSigID(a, c),
                e = "<div id='" + d + "' class ='fwr-signature-sign fwr-signature' pageIndex ='" + a.getPageIndex() + "' sigName='" + c + "'></div>";
            return e
        }, this.getPageSigContainerID = function(a) {
            return a.getPageViewContainerID() + "_SignatureContainer"
        }, this.getPageSignedContainerID = function(a) {
            return a.getPageViewContainerID() + "_SignatureSigned"
        }, this.getSigLayerID = function(a) {
            return a.getDocViewContainerID() + "_sig_bound_select"
        }, this.getPageSigID = function(a, b) {
            return a.getPageViewContainerID() + "_Signature_" + b
        }, this.getPageSigImageID = function(a, b) {
            return a.getPageViewContainerID() + "_Signature_image" + b
        }
    }
}), define("core/Plugins/Signature/NormalSigToolHandler", ["core/PDFData/Signature", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect"], function(a, b, c) {
    WebPDF.Tools.TOOL_NAME_NORMALSIG = "Normal Signature Tool";
    var d = WebPDF.PDFPoint,
        e = WebPDF.PDFRect,
        f = a("core/PDFData/Signature");
    return WebPDF.Tools.NormalSigToolHandler = function(a) {
        var b = null,
            c = a,
            g = this,
            h = !1,
            i = !1,
            j = new d(0, 0),
            k = new d(0, 0);
        this.onInit = function(a) {
            b = a
        }, this.isEnabled = function() {
            return !0
        }, this.isProcessing = function() {
            return i
        }, this.onDestroy = function() {}, this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_NORMALSIG
        }, this.createSignatrue = function(a, b) {
            var c = {
                    isStraddle: !1,
                    imgUrl: "",
                    pageIndex: a.getPageIndex(),
                    signer: "signer",
                    dn: "domain",
                    reason: "",
                    location: "",
                    contact: "contactInfo@email.com",
                    rc: null,
                    filter: "Adobe.PPKLite",
                    subFilter: "adbe.pkcs7.sha1",
                    hash: 1
                },
                d = a.deviceRectToPDFRect(b, !0);
            c.rc = [d.left, d.top, d.right, d.bottom];
            var e = new f(c, WebPDF.SignatureType.Normal),
                g = a.getPDFPage(),
                h = WebPDF.Common.createUniqueId();
            return e.setSigName(h), g.addSignature(e), e
        }, this.onActivate = function() {
            var a = b.getMainView().getDocView(),
                c = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (c.addClass("fwr-note-cursor-ie"), c.css("cursor", "crosshair")) : c.addClass("fwr-note-cursor")
        }, this.onDeactivate = function() {
            var a = b.getMainView().getDocView(),
                d = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? d.removeClass("fwr-note-cursor-ie") : d.removeClass("fwr-note-cursor"), c.getSigHandleMgr().clearAllSelection(), c.getSigHandleMgr().clearAllSigLayer(), a.setSigAddFlag(!1), i = !1
        }, this.getSigRect = function(a) {
            var b = a.getPageViewOffsetpt(j.x, j.y);
            temEndPoint = a.getPageViewOffsetpt(k.x, k.y);
            var c, d = new e(b.x, b.y, temEndPoint.x, temEndPoint.y);
            return d.left > d.right && (c = d.left, d.left = d.right, d.right = c), d.bottom < d.top && (c = d.bottom, d.bottom = d.top, d.top = c), d
        }, this.onLButtonDown = function(a) {
            var d = b.getMainView().getDocView();
            if (d.isSigAdded()) return !1;
            var e = d.getPageViewByPosition(a.pageX, a.pageY);
            return null == e ? !1 : c.getSigHandleMgr().onSigAddLButtonDown(d) ? !1 : (WebPDF.Common.preventDefaults(a, !0), j.x = a.pageX, j.y = a.pageY, h = !0, i = !0, !0)
        }, this.onLButtonUp = function(a) {
            if (!h) return !1;
            h = !1, i = !1;
            var d = b.getMainView().getDocView();
            if (d.isSigAdded()) return !1;
            var e = d.getPageViewByPosition(k.x, k.y);
            if (null == e) return !1;
            var f = g.getSigRect(e),
                j = g.createSignatrue(e, f);
            return c.getSigHandleMgr().addSignature(e, j), c.getSigHandleMgr().onSigSelectedLButtonDown(e, j), k.x = 0, k.y = 0, !0
        }, this.onLButtonDblClk = function(a) {
            return !1
        }, this.onMouseMove = function(a) {
            if (!h) return !1;
            var d = b.getMainView().getDocView();
            if (!d.isSigAdded()) {
                var e = d.getPageViewByPosition(a.pageX, a.pageY);
                if (null == e) return !1;
                var f = d.getPageViewByPosition(j.x, j.y);
                if (null == f) return !1;
                if (e.getPageIndex() != f.getPageIndex()) return !1;
                k.x = a.pageX, k.y = a.pageY;
                var i = g.getLayerRect();
                return c.getSigHandleMgr().onSigAddMousemove(d, i), !0
            }
        }, this.getLayerRect = function() {
            var a = Math.abs(k.x - j.x),
                c = Math.abs(k.y - j.y),
                d = null,
                f = null;
            k.x < j.x && k.y < j.y && (d = k.x, f = k.y), k.x > j.x && k.y < j.y && (d = j.x, f = k.y), k.x < j.x && k.y > j.y && (d = k.x, f = j.y), k.x > j.x && k.y > j.y && (d = j.x, f = j.y);
            var g = b.getMainView().getDocView(),
                h = g.getDocViewClientRect(),
                i = g.getScrollApi(),
                l = 0,
                m = 0;
            i && (l = i.getContentPositionX(), m = i.getContentPositionY()), d = d - h.left + l, f = f - h.bottom + m;
            var n = new e(d, f, d + a, f + c);
            return n
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Tools.NormalSigToolHandler
}), define("core/Plugins/Signature/StraddleSigToolHandler", ["core/PDFData/Signature", "core/DataLevel", "core/WebPDF", "core/Math/Point", "core/Math/Rect"], function(a, b, c) {
    WebPDF.Tools.TOOL_NAME_CROSSPAGESIG = "Straddle Signature Tool";
    var d = WebPDF.PDFPoint,
        e = WebPDF.PDFRect,
        f = a("core/PDFData/Signature");
    return WebPDF.Tools.StraddleSigToolHandler = function(a) {
        var b = null,
            c = a,
            g = this,
            h = !1,
            i = !1,
            j = new d(0, 0),
            k = new d(0, 0);
        this.onInit = function(a) {
            b = a
        }, this.onDestroy = function() {}, this.getName = function() {
            return WebPDF.Tools.TOOL_NAME_CROSSPAGESIG
        }, this.getSigRect = function(a) {
            var b = a.getPageViewOffsetpt(j.x, j.y);
            temEndPoint = a.getPageViewOffsetpt(k.x, k.y);
            var c, d = new e(b.x, b.y, temEndPoint.x, temEndPoint.y);
            return d.left > d.right && (c = d.left, d.left = d.right, d.right = c), d.bottom < d.top && (c = d.bottom, d.bottom = d.top, d.top = c), d
        }, this.getLayerRect = function() {
            var a = Math.abs(k.x - j.x),
                c = Math.abs(k.y - j.y),
                d = null,
                f = null;
            k.x < j.x && k.y < j.y && (d = k.x, f = k.y), k.x > j.x && k.y < j.y && (d = j.x, f = k.y), k.x < j.x && k.y > j.y && (d = k.x, f = j.y), k.x > j.x && k.y > j.y && (d = j.x, f = j.y);
            var g = b.getMainView().getDocView(),
                h = g.getDocViewClientRect(),
                i = g.getScrollApi(),
                l = 0,
                m = 0;
            i && (l = i.getContentPositionX(), m = i.getContentPositionY()), d = d - h.left + l, f = f - h.bottom + m;
            var n = new e(d, f, d + a, f + c);
            return n
        }, this.createSignatrue = function(a, b) {
            var c = {
                    isStraddle: !0,
                    imgUrl: "",
                    pageIndex: a.getPageIndex(),
                    signer: "signer",
                    dn: "domain",
                    reason: "",
                    location: "",
                    contact: "contactInfo@email.com",
                    rc: null,
                    straddle: {
                        type: 0,
                        position: 0,
                        range: "",
                        percent: 0
                    },
                    filter: "Adobe.PPKLite",
                    subFilter: "adbe.pkcs7.sha1",
                    hash: 1
                },
                d = a.deviceRectToPDFRect(b, !0);
            c.rc = [d.left, d.top, d.right, d.bottom];
            var e = new f(c, WebPDF.SignatureType.Straddle),
                g = a.getPDFPage(),
                h = WebPDF.Common.createUniqueId();
            return e.setSigName(h), g.addSignature(e), e
        }, this.onActivate = function() {
            var a = b.getMainView().getDocView(),
                c = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? (c.addClass("fwr-note-cursor-ie"), c.css("cursor", "crosshair")) : c.addClass("fwr-note-cursor")
        }, this.onDeactivate = function() {
            var a = b.getMainView().getDocView(),
                d = $("#" + a.getDocViewContainerID());
            WebPDF.Environment.ie || WebPDF.Environment.ieAtLeast11 ? d.removeClass("fwr-note-cursor-ie") : d.removeClass("fwr-note-cursor"), c.getSigHandleMgr().clearAllSelection(), c.getSigHandleMgr().clearAllSigLayer(), a.setSigAddFlag(!1), i = !1
        }, this.isEnabled = function() {
            return !0
        }, this.isProcessing = function() {
            return !0
        }, this.onLButtonDown = function(a) {
            var d = b.getMainView().getDocView();
            if (d.isSigAdded()) return !1;
            var e = d.getPageViewByPosition(a.pageX, a.pageY);
            return null == e ? !1 : c.getSigHandleMgr().onSigAddLButtonDown(e) ? !1 : (j.x = a.pageX, j.y = a.pageY, h = !0, i = !0, !0)
        }, this.onLButtonUp = function(a) {
            if (!h) return !1;
            h = !1, i = !1;
            var d = b.getMainView().getDocView();
            if (d.isSigAdded()) return !1;
            var e = d.getPageViewByPosition(k.x, k.y);
            if (null == e) return !1;
            var f = g.getSigRect(e),
                j = g.createSignatrue(e, f);
            return c.getSigHandleMgr().addSignature(e, j), c.getSigHandleMgr().onSigSelectedLButtonDown(e, j), $(b).trigger(WebPDF.EventList.SIGNATURE_ADD, {
                sig: j,
                sigType: WebPDF.SignatureType.Straddle
            }), k.x = 0, k.y = 0, !0
        }, this.onLButtonDblClk = function(a) {
            return !1
        }, this.onMouseMove = function(a) {
            if (!h) return !1;
            var d = b.getMainView().getDocView();
            if (!d.isSigAdded()) {
                var e = d.getPageViewByPosition(a.pageX, a.pageY);
                if (null == e) return !1;
                var f = d.getPageViewByPosition(j.x, j.y);
                if (null == f) return !1;
                if (e.getPageIndex() != f.getPageIndex()) return !1;
                k.x = a.pageX, k.y = a.pageY;
                var i = g.getLayerRect();
                return c.getSigHandleMgr().onStraddleSigAddMousemove(d, i), !0
            }
        }, this.onRButtonDown = function(a) {
            return !1
        }, this.onRButtonUp = function(a) {
            return !1
        }, this.onRButtonDblClk = function(a) {
            return !1
        }, this.onMouseWheel = function(a) {
            return !1
        }, this.onMouseOver = function(a) {
            return !1
        }, this.onMouseOut = function(a) {
            return !1
        }, this.onMouseEnter = function(a) {
            return !1
        }, this.onMouseLeave = function(a) {
            return !1
        }, this.onKeyDown = function(a) {
            return !1
        }, this.onKeyUp = function(a) {
            return !1
        }, this.onChar = function(a) {
            return !1
        }
    }, WebPDF.Tools.StraddleSigToolHandler
}), define("core/Plugins/Signature/SignatureMouseHandler", [], function(a, b, c) {
    var d = WebPDF.PDFPoint,
        e = (WebPDF.PDFRect, function(a) {
            this.signaturePlugin = a, this._beginPoint = new d(0, 0), this._endPoint = new d(0, 0), this._isLbuttonDown = !1, this._direc = 0, this._isSelectedBorderClick = !1
        });
    return e.prototype = {
        getSigByEvent: function(a) {
            var b = null,
                c = null;
            if ($(a).hasClass("fwr-signature")) {
                var d = parseInt(a.getAttribute("pageIndex")),
                    e = a.getAttribute("Signame"),
                    f = this.signaturePlugin.getReaderApp().getMainView().getDocView();
                c = f.getPageView(d);
                var g = c.getPDFPage();
                b = g.getSigByName(e)
            }
            return {
                signature: b,
                page: c
            }
        },
        isSigBorderClick: function(a) {
            return $(a).hasClass("fwr-signature-select-border") && (this._direc = parseInt(a.getAttribute("dir")), this._isSelectedBorderClick = !0), this._isSelectedBorderClick
        },
        getType: function() {
            return "Signature Mouse Handler"
        },
        onLButtonDown: function(a) {
            var b = this.isSigBorderClick(a.target),
                c = this.getSigByEvent(a.target.parentElement);
            if (null == c.signature && !b) return !1;
            var d = this.signaturePlugin.getReaderApp().getMainView().getDocView(),
                e = d.getPageViewByPosition(a.pageX, a.pageY);
            return null == e ? !1 : (this._beginPoint.x = a.pageX, this._beginPoint.y = a.pageY, this._isLbuttonDown = !0, !0)
        },
        onLButtonUp: function(a) {
            return this.signaturePlugin.getSigHandleMgr().isSigSelect() ? (this.signaturePlugin.getSigHandleMgr().updateSelectSigPosition(), this._isLbuttonDown = !1, void(this._isSelectedBorderClick = !1)) : !1
        },
        onLButtonDblClk: function(a) {
            var b = this.getSigByEvent(a.target.parentElement);
            if (null == b.signature) return !1;
            var c = this.signaturePlugin.getReaderApp().getMainView().getDocView(),
                d = c.getPageViewByPosition(a.pageX, a.pageY);
            return null == d ? !1 : (this.signaturePlugin.getSigHandleMgr().onSig(d, b.signature), !0)
        },
        onMouseMove: function(a) {
            if (!this.signaturePlugin.getSigHandleMgr().isSigSelect()) return !1;
            if (!this._isLbuttonDown) return !1;
            var b = this.signaturePlugin.getReaderApp().getMainView().getDocView(),
                c = b.getPageViewByPosition(a.pageX, a.pageY);
            return null == c ? !1 : (this._isSelectedBorderClick ? this.signaturePlugin.getSigHandleMgr().onSigChangeRect(c, a.pageX, a.pageY, this._beginPoint.x, this._beginPoint.y, this._direc) : this.signaturePlugin.getSigHandleMgr().onSigSelectedMousemove(c, a.pageX, a.pageY, this._beginPoint.x, this._beginPoint.y), this._beginPoint.x = a.pageX, this._beginPoint.y = a.pageY, !0)
        },
        onRButtonDown: function(a) {
            return !1
        },
        onRButtonUp: function(a) {
            return !1
        },
        onRButtonDblClk: function(a) {
            return !1
        },
        onMouseWheel: function(a) {
            return !1
        },
        onMouseOver: function(a) {
            return !1
        },
        onMouseOut: function(a) {
            return this.onMouseLeave(a)
        },
        onMouseLeave: function(a) {
            return !1
        },
        onMouseEnter: function(a) {
            return this.onMouseOver(a)
        },
        onDoubleTap: function(a) {
            return !1
        },
        onPinchIn: function(a) {
            return !1
        },
        onPinchOut: function(a) {
            return !1
        },
        onHold: function(a) {
            return !1
        }
    }, WebPDF.Event.SignatureMouseHandler = e, WebPDF.Event.SignatureMouseHandler
}), define("core/Plugins/InkSign/InkSignPlugin", ["core/Plugins/InkSign/InkSignHandleManager", "core/ImageEngine/InkSignUIManager", "core/Math/Rect", "core/WebPDF", "core/PDFData/InkSign", "core/DataLevel", "core/Math/Point", "core/Plugins/InkSign/InkSignToolHandler", "core/ImageEngine/PDFInkSignLoader"], function(a, b, c) {
    var d = (WebPDF.Config, a("core/Plugins/InkSign/InkSignHandleManager")),
        e = a("core/Plugins/InkSign/InkSignToolHandler");
    a("core/ImageEngine/PDFInkSignLoader"), WebPDF.InkSignPlugin = function(a) {
        function b() {
            $(j).on(WebPDF.EventList.PAGE_SHOW_COMPLETE, function(a, b) {
                var c = this.getPluginByName(WebPDF.InkSignPluginName),
                    d = null;
                c && (d = c.getSigHandleMgr()), d && d.onPageShowComplete(b.pageView)
            }).on(WebPDF.EventList.DOCVIEW_ZOOM_CHANGED, function(a, b) {
                var c = this.getPluginByName(WebPDF.InkSignPluginName),
                    d = null;
                c && (d = c.getSigHandleMgr()), d && d.onDocViewZoom(b.newScale)
            }).on(WebPDF.EventList.PAGE_VISIBLE, function(a, b) {
                var c = j.getMainView().getDocView(),
                    d = this.getPluginByName(WebPDF.InkSignPluginName),
                    e = null;
                if (d && (e = d.getSigHandleMgr()), e)
                    for (var f = 0; f < b.pages.length; f++) e.updateSigPosition(c.getPageView(b.pages[f]))
            })
        }

        function c(a) {
            var b = j.getMainView().getDocView();
            if (a.length > 0)
                for (var c = 0; c < a.length; c++)
                    for (var d = a[c].pageIndex, e = b.getPageView(d), g = a[c].inkSignList, i = 0; i < g.length; i++)
                        for (var k = g[i].rc, l = g[i].inkData.rect, m = g[i].inkData.pencil, n = 0; n < m.length; n++) {
                            var o = m[n].points;
                            m[n].points = h(e, k, l, o);
                            var p = m[n].color;
                            p = p.substring(1, p.length), p = f(p), m[n].color = p
                        }
            return a
        }

        function f(a) {
            return parseInt(a, 16)
        }

        function g(a, b) {
            var c = (a.rc, a.inkData),
                d = c.rect;
            d[0] = d[0] / b, d[1] = d[1] / b, d[2] = d[2] / b, d[3] = d[3] / b, c.rect = d;
            for (var e = c.pencil, f = 0; f < e.length; f++) {
                e[f].width = e[f].width / b;
                for (var g = 0; g < e[f].points.length; g++) e[f].points[g].x = e[f].points[g].x / b, e[f].points[g].y = e[f].points[g].y / b
            }
        }

        function h(a, b, c, d) {
            var e = a.getPDFPage(),
                f = 90 * e.getPageRotate();
            0 > f && (f %= 360, f += 360);
            for (var g = f % 360, h = [], i = 0, j = 0, k = a.pointToPDF({
                    x: 0,
                    y: 0
                }), l = k.y, m = k.x, n = 0; n < d.length; n++) {
                d[n].x = d[n].x - c[0], d[n].y = d[n].y - c[1];
                var o = a.pointToPDF(d[n]),
                    p = 0,
                    q = 0;
                b[1] != o.y && (p = l - o.y), b[0] != o.x && (q = m - o.x), 0 == i && (90 == g ? (j = -b[0], i = o.y - b[3] + p) : 180 == g ? (j = o.x - b[2] + q, i = o.y - b[3] + p) : 270 == g ? (j = o.x - b[2] + q, i = o.y - b[1] + p) : (j = -b[0], i = o.y - b[1] + p)), o.x = o.x - j, o.y = o.y - i, h.push(o)
            }
            return h
        }
        var i, j = a,
            k = this,
            l = null,
            m = null;
        WebPDF.InkSignPluginName = "InkSign Plugin", this.getName = function() {
            return WebPDF.InkSignPluginName
        }, this.onRegister = function() {}, this.getReaderApp = function() {
            return j
        }, this.getSigHandleMgr = function() {
            return l
        }, this.getCurInkSignature = function(a) {
            return null == m && $.isFunction(a) && (m = a), null != m ? m.call() : null
        }, this.init = function() {
            if (WebPDF.Environment.ie8OrLower) return !1;
            $(j).trigger(WebPDF.EventList.INKSIGN_INIT), l = new d(j, this), i = new e(this), j.registerToolHandler(i), j.isInkSignEventInit() || (b(), j.setInkSignEventInit(!0));
            var a = new WebPDF.ImageEngine.PDFInkSignLoader;
            a.asyncLoadInkSign(j, j.getPDFDoc())
        }, this.unload = function() {}, this.getReaderApp = function() {
            return j
        }, this.onBeforeUnload = function() {}, this._browser = function() {
            WebPDF.Environment.ie && (WebPDF.Environment.ie8 || WebPDF.Environment.ie8Compact || WebPDF.Environment.ie7Compact || WebPDF.Environment.ie6Compact) && (ie8_below = !0), WebPDF.Environment.safari && Number(WebPDF.Environment.version) > Number(print_lowest_safari) && (safari = !0)
        }, this.getInkSignInfo = function(a, b, c) {
            if (null == a) return null;
            var d = a.getPageIndex(),
                e = j.getMainView().getDocView(),
                f = e.getPageView(d),
                h = a.getSigName(),
                i = f.getPDFPage(),
                k = i.getInkSigByName(h),
                l = $.extend(!0, {}, k);
            b && l.setLocation(b), c && l.setReason(c);
            var m = l.getRect();
            l.generatePosionByRect(m);
            var n = f.getScale();
            1 != n && g(l.getSigJSONData(), n);
            var o = JSON.stringify(l.getSigJSONData());
            return o
        }, this.sign = function(a) {
            var b = a.sigJSONData.pageIndex,
                c = j.getMainView().getDocView(),
                d = c.getPageView(b);
            l.createSignByNoCert(d, a), $(".fwr-inksign-parent").remove();
            var e = j.getPDFDoc(),
                f = e.getPage(b),
                h = f.getInkSignJsonData(),
                i = d.getScale();
            return 1 != i && g(a.sigJSONData, i), h.push(a.sigJSONData), c.setModified(!0), WebPDF.ViewerInstance.setCurrentToolByName(WebPDF.Tools.TOOL_NAME_HAND), !1
        }, this.getInkSignData = function() {
            for (var a = j.getMainView().getDocView(), b = j.getPDFDoc(), d = b.getPageCount(), e = [], f = 0; d > f; f++) {
                var g = a.getPageView(f),
                    h = {};
                h.pageIndex = f;
                var i = g.getPDFPage().getInkSignJsonData();
                if (h.inkSignList = i, i.length > 0) {
                    var k = $.extend(!0, {}, h);
                    e.push(k)
                }
            }
            return e = c(e), JSON.stringify(e)
        }, this.save = function() {
            var a = j.getBaseUrl() + "api/signature/inkSign/save",
                b = {
                    fileId: j.getFileID(),
                    signData: k.getInkSignData()
                };
            $.ajax({
                type: "post",
                url: a,
                dataType: "json",
                data: b,
                success: function(a) {
                    var b = a.error;
                    0 != b || j.updateVersion(a.version)
                },
                error: function(a) {}
            })
        }, this.replace = function() {
            var a = $(".fwr-inksign-parent");
            if (!a.get(0)) return !1;
            var b = parseInt(a.attr("pageIndex")),
                c = j.getMainView().getDocView(),
                d = c.getPageView(b),
                e = a.attr("Signame"),
                f = d.getPDFPage();
            f.deleteInkSigByName(e);
            var g, h, i = parseFloat(a.css("top")),
                l = parseFloat(a.css("left")),
                m = parseFloat(a.width()),
                n = parseFloat(a.height()),
                o = c.getRotate();
            270 == o ? (h = d.getPageViewHeight() - l - m / 2, g = i + n / 2) : 90 == o ? (h = l + m / 2, g = d.getPageViewWidth() - i - n / 2) : 180 == o ? (g = d.getPageViewWidth() - l - m / 2, h = d.getPageViewHeight() - i - n / 2) : (g = l + m / 2, h = i + n / 2);
            var p = $("#" + d.getPageViewContainerID()).offset();
            pageX = g + p.left, pageY = h + p.top;
            var q = k.getCurInkSignature();
            a.remove(), k.getSigHandleMgr().createInkSign(q, d, pageX, pageY, o)
        }, this.signWithCert = function(a) {
            var b = j.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME).getAnnotationDataToSave(),
                c = JSON.stringify(b),
                d = j.getPDFDoc(),
                e = null;
            d && 2 == d.getDocType() && (e = d.getFormXMLData());
            var f = k.getInkSignData(),
                g = j.getFileID(),
                h = j.getBaseUrl() + "api/signature/" + g + "/stamp";
            a.annotData = c, a.formData = e, a.inkData = f, successCallback = a.success, failCallback = a.fail, a.success = null, a.fail = null, $.ajax({
                type: "POST",
                url: h,
                data: a,
                success: function(a) {
                    var b = a.resultMsg;
                    if (0 == a.resultCode && "" != a.resultBody.exparams) b = i18n.t("InkSign.SigScuess"), successCallback(b, a.resultBody.exparams);
                    else {
                        switch (a.resultCode) {
                            case 101:
                                b = i18n.t("InkSign.SigUserNone");
                                break;
                            case 102:
                                b = i18n.t("InkSign.SigDocNone");
                                break;
                            case 201:
                                b = i18n.t("InkSign.SignatureUnregistered");
                                break;
                            default:
                                b = i18n.t("InkSign.SigError")
                        }
                        failCallback(b, a.resultBody.exparams)
                    }
                },
                error: function() {
                    var a = i18n.t("InkSign.SigError");
                    failCallback(a, "")
                }
            })
        }, this.cancelSign = function(a) {
            var b = j.getMainView().getDocView();
            l.deleteInkSign(a), b.setInkSigAddFlag(!1)
        }
    }, b.createPlugin = function(a) {
        var b = new WebPDF.InkSignPlugin(a);
        return b
    }
}), define("core/ImageEngine/DocumentLoader", ["core/ImageEngine/ImageEngine", "core/ImageEngine/PDFDocument", "core/ImageEngine/PDFPage", "core/ImageEngine/PDFDocProperties"], function(a, b, c) {
    a("core/ImageEngine/ImageEngine"), a("core/ImageEngine/PDFDocument"), a("core/ImageEngine/PDFDocProperties");
    var d = WebPDF.ImageEngine;
    d.DocumentLoader = function(a) {
        function b(a) {
            var b = null;
            try {
                b = new d.PDFDocument(parseInt(a.doctype), parseInt(a.DocPermission));
                for (var c = 0; c < a.PagesInfo.length; c++) {
                    var e = new d.PDFPage(a.PagesInfo[c]);
                    b.addPage(e)
                }
                if (a && a.dppinfo && a.dppinfo.ppt) {
                    var f = new d.PDFDocProperties(a.dppinfo.ppt);
                    b.setDocProperties(f)
                } else b.setDocProperties(null)
            } catch (g) {
                return console.error(g), null
            }
            return b
        }
        var c = a;
        this.getDocId = function() {
            return c
        }, this.asyncLoadDocument = function(a, c, d, e, f) {
            if (!$.isFunction(e) || !$.isFunction(f)) return void $.error("both 'doneHandler' and 'failedHandler' must be function.");
            var g;
            /*if(window.location.protocol != "file:"){
                var bookid = JSON.parse(localStorage.getItem('bookId'));
                if(bookid == '56f24a41226b031530f1a836' || bookid == '57923dc2d26763694cfe8497' || bookid == '575960e0e76d21070f66f9bc'){
                    g = "./js/providers/"+bookid+"epub/"+bookid+"/manifest";
                } else {
                    g = "./js/providers/temp/"+JSON.parse(localStorage.getItem('bookId'))+"/manifest";
                }
            }else{*/
                g = a.getOptions().url + "manifest";
            //} 
                h = {};
            c ? h.password = c : h.password = "", null != d && (h.isCheckPsd = d), h.form = a.isFormMode(), $.ajax({
                url: g,
                dataType: "json",
                data: h,
                success: function(c, d, g) {
                    if (!c) return void f(c);
                    var h = c.error;
                    if (0 == h) try {
                        var i = $.parseJSON(c.docinfo),
                            j = b(i);
                        j.loadWatermark(), a.setTrail(c.trail), a.setSessionId(g.getResponseHeader("x-auth-token")), e(j, c)
                    } catch (k) {
                        console.error(k), e(null, c)
                    } else f(c)
                },
                error: function() {
                    f(null)
                }
            })
        }
    }
}), define("core/ImageEngine/ImageEngine", [], function(a, b, c) {
    window.WebPDF || (window.WebPDF = {}), window.WebPDF.ImageEngine = {}
}), define("core/ImageEngine/PDFDocument", ["core/ImageEngine/ImageEngine", "core/ImageEngine/PDFPage"], function(a, b, c) {
    a("core/ImageEngine/ImageEngine"), a("core/ImageEngine/PDFPage"), WebPDF.ImageEngine.PDFDocument = function(a, b) {
        function c() {
            var a = (WebPDF.Tool.getReaderApp().getDocView(), '<?xml version="1.0" encoding="UTF-8"?>\n');
            a += '<fields xmlns:xfdf="http://ns.adobe.com/xfdf-transition/">\n';
            for (var b = 0; b < _formWidgets.length; b++) {
                var c = "FormField" + b.toString(),
                    d = _formWidgets[b].formWidget.name;
                if (2 == _formWidgets[b].formWidget.type || 3 == _formWidgets[b].formWidget.type) {
                    var e = $("#" + _formWidgets[b].formWidget.getControlID()),
                        f = e.attr("objNum"),
                        g = "0";
                    "1" == e.attr("isChecked") && (g = "1"), a += String.Format('<{0} name="{1}" type="{2}" objnum="{3}" checked="{4}">{5}</{0}>\n', c, d, _formWidgets[b].formWidget.type, f, g, WebPDF.g_formValue.items[d])
                } else a += String.Format('<{0} name="{1}" type="{2}">{3}</{0}>\n', c, d, _formWidgets[b].formWidget.type, WebPDF.g_formValue.items[d])
            }
            return a += "</fields>", 0 == b ? "" : a
        }

        function d() {
            var a = WebPDF.Tool.getReaderApp();
            console.log("a.getAccessToken()");
            var b = a.getOptions().url + "exportToFDF?accessToken=" + "null",
                c = a.getFileName();
            c = WebPDF.ViewerInstance.getFileName();
            var d = a.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME).getAnnotationDataToSave(),
                e = JSON.stringify(d);
            f(b, "post", c, e, function(a) {})
        }

        function e(a, b, c, d, e, f, g) {
            if ("undefined" != typeof a && null != a) {
                var h, i = "_blank",
                    j = "iframe_download_pdf_data",
                    k = j;
                $("#" + k) && $("#" + k).remove(), h = $('<iframe src="[removed]false;" name="' + j + '" id="' + k + '"></iframe>').appendTo("body").hide(), h.get(0).attachEvent ? h.get(0).attachEvent("onload", function(a) {
                    var b = h.get(0).contentWindow.document.body.innerHTML;
                    void 0 != typeof g && null != g && g(b)
                }) : h.get(0).onload = function(a) {
                    var b = h.get(0).contentWindow.document.body.innerHTML;
                    void 0 != typeof g && null != g && g(b)
                }, i = k;
                var l = "iframe_download_pdf_data_formObj";
                $("#" + l) && $("#" + l).remove();
                var m = $('<form target="' + i + '"></form>').attr("action", a).attr("id", l).attr("method", b);
                m.append($("<input type='hidden' id='fileName' name='fileName' />").val(c)), m.append($("<input type='hidden' id='annotsData' name='annotsData' />").val(d)), m.append($("<input type='hidden' id='formData' name='formData' />").val(e)), m.append($("<input type='hidden' id='inkData' name='inkData' />").val(f)), $("body").append(m), m.submit()
            }
        }

        function f(a, b, c, d, e) {
            if ("undefined" != typeof a && null != a) {
                var f, g = "_blank",
                    h = "iframe_download_annot_data",
                    i = h;
                $("#" + i) && $("#" + i).remove(), f = $('<iframe src="[removed]false;" name="' + h + '" id="' + i + '"></iframe>').appendTo("body").hide(), f.get(0).attachEvent ? f.get(0).attachEvent("onload", function(a) {
                    var b = f.get(0).contentWindow.document.body.innerHTML;
                    void 0 != typeof e && null != e && e(b)
                }) : f.get(0).onload = function(a) {
                    var b = f.get(0).contentWindow.document.body.innerHTML;
                    void 0 != typeof e && null != e && e(b)
                }, g = i;
                var j = "iframe_download_annot_data_formobj";
                $("#" + j) && $("#" + j).remove();
                var k = $('<form target="' + g + '"></form>').attr("action", a).attr("id", j).attr("method", b);
                k.append($("<input type='hidden' id='fileName' name='fileName' />").val(c)), k.append($("<input type='hidden' id='annotsData' name='annotsData' />").val(d)), $("body").append(k), k.submit()
            }
        }

        function g(a, b, c, d, e) {
            if ("undefined" != typeof a && null != a) {
                var f, g = "_blank",
                    h = "iframe_download_form_xml_data",
                    i = h;
                $("#" + i) && $("#" + i).remove(), f = $('<iframe src="[removed]false;" name="' + h + '" id="' + i + '"></iframe>').appendTo("body").hide(), f.get(0).attachEvent ? f.get(0).attachEvent("onload", function(a) {
                    var b = f.get(0).contentWindow.document.body.innerHTML;
                    void 0 != typeof e && null != e && e(b)
                }) : f.get(0).onload = function(a) {
                    var b = f.get(0).contentWindow.document.body.innerHTML;
                    void 0 != typeof e && null != e && e(b)
                }, g = i;
                var j = "iframe_download_form_xml_data_formObj";
                $("#" + j) && $("#" + j).remove();
                var k = $('<form target="' + g + '"></form>').attr("action", a).attr("id", j).attr("method", b);
                k.append($("<input type='hidden' id='fileName' name='fileName' />").val(c)), k.append($("<input type='hidden' id='formXmlData' name='formXmlData' />").val(d)), $("body").append(k), k.submit()
            }
        }
        var h = a,
            i = null,
            j = b,
            k = [],
            l = null,
            m = null,
            n = !0;
        _formWidgets = [];
        var o = {},
            p = {};
        this.hasPermission = function(a) {
            return 0 == (j & a) ? !1 : !0
        }, this.addFormWidget = function(a) {
            var b = jQuery.inArray(a, _formWidgets);
            if (!(b >= 0)) {
                var c = _formWidgets.length;
                _formWidgets[c] = a
            }
        }, this.importFromFDF = function(a) {}, this.exportDocument = function(a) {
            var b = WebPDF.Tool.getReaderApp(),
                d = b.getOptions().url + "exportDocument?accessToken=" + "null",
                f = b.getPluginByName(WebPDF.BASEANNOT_PLUGIN_NAME),
                g = "";
            f && (g = f.getAnnotationDataToSave());
            var h = JSON.stringify(g),
                i = b.getPluginByName(WebPDF.InkSignPluginName),
                j = "";
            i && (j = i.getInkSignData());
            var k = null;
            2 == this.getDocType() && (k = c()), e(d, "post", a, h, k, j, function(a) {})
        }, this.exportFormXML = function() {
            var a = WebPDF.Tool.getReaderApp(),
                b = a.getFileName(),
                d = a.getOptions().url + "form/xml/exportXml?accessToken=" + "null",
                e = c();
            g(d, "post", b, e, function(a) {})
        }, this.importFormXML = function(a) {
            var a = $(a).find("fields");
            return null == a || void 0 == a ? void alert("The import file form is error.") : void WebPDF.g_pFormPlugin.setFormDataByXMLData(a)
        }, this.getFormXMLData = function() {
            return c()
        }, this.exportToFDF = function() {
            d()
        }, this.getPageCount = function() {
            return k.length
        }, this.getPage = function(a) {
            return isNaN(a) ? null : k[a]
        }, this.setDocType = function(a) {
            h = a
        }, this.getDocType = function() {
            return h
        }, this.setDocProperties = function(a) {
            i = a
        }, this.getDocProperties = function() {
            return i
        }, this.addPage = function(a) {
            k.push(a)
        }, this.deletePage = function(a) {
            return isNaN(a) || a > k.length || 0 > a ? !1 : (delete k[a], k.splice(a, 1), !0)
        }, this.loadWatermark = function() {
            var a = WebPDF.Tool.getReaderApp(),
                b = a.getOptions().baseUrl + "api/watermark/info",
                c = {
                    userId: a.getIP()
                };
            $.ajax({
                url: b + "?" + Math.random(),
                type: "GET",
                data: c,
                async: !1,
                timeout: 500,
                success: function(a) {
                    if (0 == a.resultCode) {
                        var b = a.resultBody.hasTrail;
                        n = null == b || "0" == b ? !1 : !0;
                        var c = $.parseJSON(a.resultBody.content);
                        c.globalWatermark && (l = $.parseJSON(c.globalWatermark)), c.userWatermark && (m = $.parseJSON(c.userWatermark))
                    }
                },
                error: function() {
                    alert("Fail to load watermark")
                }
            }), m = a.getWatermarkInfo()
        }, this.getWatermarkInfo = function() {
            return l
        }, this.getUserWatermarkInfo = function() {
            return m
        }, this.isTrial = function() {
            return n
        }, this.addSignature = function(a) {
            o[a.getSigName()] = a
        }, this.getSigByName = function(a) {
            return null == o ? null : o[a]
        }, this.deleteSigByName = function(a) {
            delete o[a]
        }, this.getSigCount = function() {
            return o.size()
        }, this.enumSignature = function(a) {
            for (var b in o)
                if (a.call(_self, o[b]) === !1) break
        }, this.addInkSign = function(a) {
            p[a.getInkSigName()] = a
        }, this.getInkSigByName = function(a) {
            return null == p ? null : p[a]
        }, this.deleteInkSigByName = function(a) {
            delete p[a]
        }, this.getInkSigCount = function() {
            return p.size()
        }, this.enumInkSign = function(a) {
            for (var b in p)
                if (a.call(_self, p[b]) === !1) break
        }
    }
}), define("core/ImageEngine/PDFPage", ["core/ImageEngine/ImageEngine"], function(a, b, c) {
    a("core/ImageEngine/ImageEngine");
    var d = WebPDF.PDFMatrix;
    WebPDF.ImageEngine.PageDataJsonFormat = {
        PAGE_WIDTH: "width",
        PAGE_HEIGHT: "height",
        PAGE_ROTATE: "rotate",
        PAGE_INDEX: "number",
        PAGE_MATRIX: "matrix"
    }, WebPDF.ImageEngine.PDFPage = function(a) {
        function b() {
            try {
                e = a[p.PAGE_INDEX], f = a[p.PAGE_WIDTH], g = a[p.PAGE_HEIGHT], h = a[p.PAGE_ROTATE], h = (h + 4) % 4, i = new d;
                var b = a[p.PAGE_MATRIX];
                "undefined" != typeof b && null != b ? i.Set(b[0], b[1], b[2], b[3], b[4], b[5]) : i.Set(1, 0, 0, 1, 0, 0)
            } catch (c) {
                return console.error(c), !1
            }
            return !0
        }

        function c(a, b) {
            return null == b ? null : b[a]
        }
        var e, f, g, h = 0,
            i = null,
            j = null,
            k = {},
            l = {},
            m = {},
            n = [],
            o = this,
            p = WebPDF.ImageEngine.PageDataJsonFormat;
        b() || $.error("Init PDFPage failed:" + a), this.getPageIndex = function() {
            return e
        }, this.getPageWidth = function() {
            return f
        }, this.getPageHeight = function() {
            return g
        }, this.setPageWidth = function(a) {
            f = a
        }, this.setPageHeight = function(a) {
            g = a
        }, this.getPageRotate = function() {
            return h
        }, this.setPageRotate = function(a) {
            h = a
        }, this.getPageMatrix = function() {
            return i
        }, this.getAnnotByName = function(a) {
            return null == k ? null : c(a, k)
        }, this.enumAnnots = function(a) {
            for (var b in k)
                if (a.call(o, k[b]) === !1) break
        }, this.getAnnotsMap = function() {
            return k
        }, this.deleteAnnots = function(a) {
            for (var b = 0; b < j.length; b++) {
                var c = j[b],
                    d = c[WebPDF.PDFData.AnnotDataJSONFormat.name];
                a[d] && (j.splice(b, 1), b -= 1, delete k[d])
            }
        }, this.addAnnot = function(a) {
            return k[a.getAnnotName()] = a
        }, this.getAnnotCount = function() {
            return k.size()
        }, this.getAnnotJsonData = function() {
            return j
        }, this.n = 0, this.setAnnotJsonData = function(a) {
            j = a
        }, this.isInitAnnotData = function() {
            return null == j ? !1 : !0
        }, this.setInkSignJsonData = function(a) {
            n = a
        }, this.getInkSignJsonData = function() {
            return n
        }, this.addSignature = function(a) {
            l[a.getSigName()] = a
        }, this.getSigByName = function(a) {
            return null == l ? null : l[a]
        }, this.deleteSigByName = function(a) {
            delete l[a]
        }, this.getSigCount = function() {
            return l.size()
        }, this.enumSignature = function(a) {
            for (var b in l)
                if (a.call(o, l[b]) === !1) break
        }, this.addInkSign = function(a) {
            m[a.getSigName()] = a
        }, this.getInkSigByName = function(a) {
            return null == m ? null : m[a]
        }, this.deleteInkSigByName = function(a) {
            delete m[a]
        }, this.getInkSigCount = function() {
            return m.size()
        }, this.enumInkSign = function(a) {
            for (var b in m)
                if (a.call(o, m[b]) === !1) break
        }, this.getInkSignMap = function() {
            return m
        }, this.transRectWithPageMatrix = function(a) {
            var b = this.getPageMatrix(),
                c = b.TransFormRect(a.left, a.top, a.right, a.bottom),
                d = new WebPDF.PDFRect(c[0], c[1], c[2], c[3]);
            return d
        }, this.transRectToPDF = function(a) {
            var b = this.getPageMatrix(),
                c = new WebPDF.PDFMatrix;
            c.SetReverse(b);
            var d = c.TransFormRect(a.left, a.top, a.right, a.bottom),
                e = new WebPDF.PDFRect(d[0], d[1], d[2], d[3]);
            return e
        }
    }
}), define("core/ImageEngine/PDFDocProperties", ["core/ImageEngine/ImageEngine"], function(a, b, c) {
    a("core/ImageEngine/ImageEngine"), WebPDF.ImageEngine.DocPropertiesJsonFormat = {
        DOC_PROPERTIES_INFO: "dppinfo",
        PROPERTIES: "ppt",
        AUTHOR: "atr",
        CREATOR: "ctr",
        PRODUCER: "pdr",
        TITLE: "title",
        SUBJECT: "sbj",
        KEYWORDS: "kwd",
        CREATION_DATE: "ctd",
        MODIFY_DATE: "mdd",
        VERSION: "ver"
    };
    var d = WebPDF.ImageEngine.DocPropertiesJsonFormat;
    return WebPDF.ImageEngine.PDFDocProperties = function(a) {
        this._docPropertiesJSONData = a
    }, WebPDF.ImageEngine.PDFDocProperties.prototype = {
        getAuthor: function() {
            return this._docPropertiesJSONData[d.AUTHOR]
        },
        getCreator: function() {
            return this._docPropertiesJSONData[d.CREATOR]
        },
        getProducer: function() {
            return this._docPropertiesJSONData[d.PRODUCER]
        },
        getTitle: function() {
            return this._docPropertiesJSONData[d.TITLE]
        },
        getSubject: function() {
            return this._docPropertiesJSONData[d.SUBJECT]
        },
        getKeywords: function() {
            return this._docPropertiesJSONData[d.KEYWORDS]
        },
        getCreationDate: function() {
            return this._docPropertiesJSONData[d.CREATION_DATE]
        },
        getModifyDate: function() {
            return this._docPropertiesJSONData[d.MODIFY_DATE]
        },
        getVersion: function() {
            return this._docPropertiesJSONData[d.VERSION]
        }
    }, WebPDF.ImageEngine.PDFDocProperties
}), define("core/ImageEngine/ImagePageViewRender", ["core/ImageEngine/ImageEngine", "core/Common", "core/WebPDF", "core/Config", "core/ImageLazyLoad", "core/AjaxRetryManager"], function(a, b, c) {
    a("core/ImageEngine/ImageEngine"), a("core/Common"), a("core/Config");
    var d = WebPDF.Config,
        e = a("core/ImageLazyLoad");
    a("core/AjaxRetryManager");
    var f = WebPDF.ImageEngine;
    return f.GetImageErrorCode = {
        ERROR_PAGE_DISPLAY_LIMIT: 1,
        ERROR_CREATE_IMG_FAILED: 2,
        ERROR_INPROGRESS: 3
    }, f.ImagePageViewRender = function() {
        function a(a, b) {
            var c = {
                pageWidth: 0,
                pageHeight: 0
            };
            return null == a ? c : (1 == b ? (c.pageWidth = a.getPDFPageWidth() * j.getPixelsPerPoint(), c.pageHeight = a.getPDFPageHeight() * j.getPixelsPerPoint()) : (c.pageWidth = a.getPageViewWidth(), c.pageHeight = a.getPageViewHeight()), a.getDocView().getRotate() % 180 != 0 && (c.pageWidth = a.getPageViewHeight(), c.pageHeight = a.getPageViewWidth()), c)
        }

        function b(b, d, e) {
            var f = a(d, e),
                g = .75 * f.pageWidth,
                h = {
                    add: !0,
                    content: "<nobr>Foxit WebPDF SDK Trial</nobr><br><nobr>Please contact at: sales@foxitsoftware.com</nobr>",
                    fontFamily: "Helvetica, sans-serif",
                    rotation: -45,
                    color: 16711680,
                    opacity: .5,
                    width: g
                };
            c(b, h, d, e)
        }

        function c(b, c, d, e) {
            function f(a, b, c) {
                for (var d = a.outerHeight(), e = g(c), f = b.fontSize * b.scale; d - e > 1;) f -= 1, a.css({
                    fontSize: f + "px"
                }), wmkW = a.outerWidth(), d = a.outerHeight(), a.css({
                    left: (c.pageWidth - wmkW) / 2 + "px",
                    top: (c.pageHeight - d) / 2 + "px"
                })
            }

            function g(a) {
                var b = Math.min(a.pageWidth, a.pageHeight);
                return Math.SQRT2 * b / 2
            }

            function h(a, b, c) {
                var d = b.content;
                b.isDynamic && (d = "", b.userName && (d += i.getUserName()), b.ip && (d += "<br />", d += i.getIP()), b.openTime && (d += "<br />", d += i.getOpenTime())), a.html(d);
                var e = parseInt(b.rotation),
                    f = (parseFloat(b.opacity), parseInt(b.color));
                f = 16777215 & f, f = f.toString(16);
                for (var h = "", j = 0; j < 6 - f.length; ++j) h += "0";
                f = "#" + h + f;
                var k = b.fontSize * b.scale;
                a.attr({
                    style: "word-break: break-all"
                }), a.css({
                    position: "absolute",
                    textAlign: "center",
                    verticalAlign: "top",
                    lineHeight: "normal",
                    fontWeight: b.fontWeight,
                    fontFamily: b.fontFamily,
                    fontStyle: b.fontStyle ? "italic" : "normal",
                    fontSize: k + "px",
                    opacity: .75,
                    color: f,
                    overflow: "hidden"
                }), WebPDF.Common.addTranslateCss(a, e);
                var l = WebPDF.Tool.getReaderApp().getPixelsPerPoint();
                if (b.width) {
                    var m = a.width(),
                        n = b.width ? b.width : pageWidth;
                    !isNaN(m) && m > 0 && (k = k * n / m, a.css({
                        fontSize: k + "px",
                        lineHeight: k * l + "px"
                    }))
                } else {
                    var o = g(c);
                    a.css({
                        width: o + "px"
                    })
                }
                if (WebPDF.Environment.ie8OrLower) {
                    var p = "progid:DXImageTransform.Microsoft.Alpha(Opacity=75)",
                        q = e * Math.PI * 2 / 360,
                        r = Math.cos(q),
                        s = Math.sin(q),
                        t = "M11=" + r + ", M12=" + -s + ", M21=" + s + ", M22=" + r,
                        u = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand'," + t + ")",
                        v = p + " " + u;
                    a.css({
                        "-ms-filter": v,
                        filter: v
                    })
                }
                a.css({
                    left: (c.pageWidth - a.width()) / 2 + "px",
                    top: (c.pageHeight - a.height()) / 2 + "px"
                })
            }
            if ("undefined" == typeof c || null == c || "undefined" != typeof c.add && 0 == c.add) return void b.hide();
            var j = {
                add: !0,
                content: "",
                fontSize: 12,
                fontFamily: '"Segoe UI", sans-serif',
                fontWeight: "normal",
                fontStyle: !1,
                rotation: 0,
                color: 11259615,
                scale: 1,
                opacity: .75,
                isDynamic: !1,
                userName: !1,
                ip: !1,
                openTime: !1
            };
            c = $.extend(j, c);
            var k = a(d, e);
            h(b, c, k), f(b, c, k)
        }
        var g = {},
            h = -1,
            i = null,
            j = this;
        this.getMaxRenderedPageIndex = function() {
            return h
        }, this.setReaderApp = function(a) {
            i = a
        }, this.loadThumb = function(a, b, c, d) {
            var g = j.getPageImgUrl(b, a.getScale(), !0);
            return 0 >= d ? (console.warn("Maximum number of retries exceeded for render thumb page: " + b), g) : (new e(g, i, a, function(e, h) {
                var i = h == f.GetImageErrorCode.ERROR_INPROGRESS;
                return i ? void setTimeout(function() {
                    j.loadThumb(a, b, c, d - 1)
                }, 2e3) : void $("#" + c).attr("src", g)
            }), g)
        }, this.getPageImgUrl = function(a, b, c) {
            b = 100;
            var d = c ? "thumb" : b + "",
                e = "?password=" + i.getPDFPassword();
                var f;
               /* if(window.location.protocol != "file:"){
                    var bookid = JSON.parse(localStorage.getItem('bookId'));
                    if(bookid == '56f24a41226b031530f1a836' || bookid == '57923dc2d26763694cfe8497' || bookid == '575960e0e76d21070f66f9bc'){
                        f = "./js/providers/"+bookid+"epub/"+bookid+"/pages/page" + a;
                        return f
                    } else {
                        f = "./js/providers/temp/"+JSON.parse(localStorage.getItem('bookId'))+"/pages/page" + a;
                        return f
                    }
                }else{*/
                    f = i.getOptions().url + "image/" + a + "/" + d + e;
                    return f += "&accessToken=" + "null", i.isFormMode() && (f += "&formMode=true"), f
               // }
        }, this.getPixelsPerPoint = function() {
            return 96 / 72
        }, this.renderPage = function(a, b) {
            if (a && a.isContentCreated() && !a.isPageLoaded()) {
                var c = a.getPageIndex(),
                    k = (a.isThumb() || !a.isThumbnailLoaded() ? "thumb" : "page") + c;
                if (0 >= b) return console.warn("Maximum number of retries exceeded for render page: " + c + "; thumb:" + a.isThumb()), void(g[k] = null);
                if (a.isThumbnailLoaded() ? a.setAnnotLoad(!0) : a.setAnnotLoad(!1), !g[k]) {
                    var l = 1,
                        m = a.getDocView(),
                        n = m.getVisiblePageRange();
                    if (c <= n.begin - l || c >= n.end + l) return;
                    g[k] = a;
                    var o = j.getPageImgUrl(c, a.getScale(), a.isThumb() || !a.isThumbnailLoaded());
                    new e(o, i, a, function(a, c) {
                        var e = !1,
                            l = c == f.GetImageErrorCode.ERROR_CREATE_IMG_FAILED,
                            n = c == f.GetImageErrorCode.ERROR_PAGE_DISPLAY_LIMIT,
                            p = c == f.GetImageErrorCode.ERROR_INPROGRESS;
                        if (l || n) e = !0;
                        else if (p) {
                            -1 === h && (h = 0);
                            WebPDF.AjaxRetryManager.getNextPageImageRequestInterval(a.getPageIndex(), h, m.getPageCount());
                            return g[k] = null, void setTimeout(function() {
                                j.renderPage(a, b - 1)
                            }, 2e3)
                        }
                        if (h = a.getPageIndex(), g[k] = null, e) {
                            a.isThumb() || a.setThumbnailLoaded(!0), a.setPageLoaded(!0);
                            var q = "";
                            q = l ? i.getBaseUrl() + "images/reader/imgFailed.png" : i.getBaseUrl() + "images/reader/imgLimit.png", a.showErrorPage(q)
                        } else{
                            $("#" + a.getPageBackgroundImgID()).attr("src", o), a.show(), a.isThumb() ? a.setPageLoaded(!0) : a.isThumbnailLoaded() ? a.setPageLoaded(!0) : (a.setThumbnailLoaded(!0), setTimeout(function() {
                            j.renderPage(a, d.defaults.requestRetryCount)
                            }, 50));    
                        } 
                        
                        !a.isThumb() && a.isPageLoaded() && (a.setPageLoadError(e), $(i).trigger(WebPDF.EventList.PAGE_SHOW_COMPLETE, {
                            pageView: a
                        }))
                    }, function(a) {
                        g[k] = null, a.setPageLoaded(!0), a.showErrorPage(i.getBaseUrl() + "/images/reader/imgFailed.png"), a.isThumb() || (a.setPageLoadError(!0), $(i).trigger(WebPDF.EventList.PAGE_SHOW_COMPLETE, {
                            pageView: a
                        }))
                    }), j.renderPageWatermark(a)
                }
            }
        }, this.renderPageWatermark = function(a) {
            var d = a.getDocView(),
                e = d.getPDFDoc();
            e.isTrial() && b($("#" + a.getTrialWatermarkID()), a, !1), c($("#" + a.getWatermarkID()), e.getWatermarkInfo(), a, !1), c($("#" + a.getUserWatermarkID()), e.getUserWatermarkInfo(), a, !1)
        }, this.getWatermarkHtmlContent = function(a, d) {
            function e(a, b, c) {
                var d = "",
                    e = a.clone();
                e.show();
                var f = parseInt(a.css("left")) * c,
                    g = parseInt(a.css("top")) * c,
                    h = parseInt(a.css("font-size")) * c;
                return e.css({
                    width: a.width() * c,
                    left: f,
                    top: g,
                    "font-size": h + "px"
                }), d += e.prop("outerHTML")
            }
            if (null == a) return "";
            var f = "",
                g = a.getDocView().getPDFDoc();
            if (g.isTrial()) {
                var h = $('<div id="' + a.getTrialWatermarkID() + '"></div>');
                $("body").append(h), h.hide(), b(h, a, !0), f += e(h, a, d), h.remove()
            }
            var i = $('<div id="' + a.getWatermarkID() + '"></div>');
            $("body").append(i), i.hide(), c(i, g.getWatermarkInfo(), a, !0), f += e(i, a, d), i.remove();
            var j = $('<div id="' + a.getUserWatermarkID() + '"></div>');
            return $("body").append(j), j.hide(), c(j, g.getUserWatermarkInfo(), a, !0), f += e(j, a, d), j.remove(), f
        }
    }, WebPDF.ImageEngine.ImagePageViewRender
}), define("core/ImageLazyLoad", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    return d.ImgLazyLoad = function(a, b, c, e, f) {
        /*if(window.location.protocol != "file:"){
            if(a.indexOf("pages") > -1){
                e(c);      
            }
        }else{*/
            $.ajax({
                url: a,
                crossDomain: !0,
                ifModified: !0,
                error: function(a, b, d) {
                    $.isFunction(f) && f(c)
                },
                success: function(a, b, f) {
                    var g = f.getResponseHeader("content-type") || "";
                    if (g.indexOf("application/json") > -1) {
                        var h = a.status.toString();
                        h != d.ImageEngine.GetImageErrorCode.ERROR_PAGE_DISPLAY_LIMIT.toString() && h != d.ImageEngine.GetImageErrorCode.ERROR_CREATE_IMG_FAILED.toString() && h != d.ImageEngine.GetImageErrorCode.ERROR_INPROGRESS.toString() || "success" != b || e(c, h)
                    } else {
                        e(c)
                    }
                }
            })            
        //}        
    }, d.ImgLazyLoad
}), define("core/AjaxRetryManager", ["core/WebPDF"], function(a, b, c) {
    var d = a("core/WebPDF");
    d.AjaxRetryManager = {
        getNextPageImageRequestInterval: function(a, b, c) {
            var d = c + 2;
            return b > d || b >= a + 2 ? 1e3 : 1500 * (a + 2 - b)
        },
        getNextAnnotDataRequestInterval: function(a) {
            return 500 * a
        },
        getNextBookmarkDataRequestInterval: function(a) {
            return 500 * a
        },
        getNextFormXmlRequestInterval: function(a, b, c) {
            var d = c + 2;
            return b > d || b >= a + 2 ? 1e3 : 1500 * (a + 2 - b)
        }
    }
});