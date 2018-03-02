this.JSON || (JSON = function() {
        function f(a) {
            return 10 > a ? "0" + a : a
        }

        function quote(a) {
            return escapeable.test(a) ? '"' + a.replace(escapeable, function(a) {
                var b = meta[a];
                return "string" == typeof b ? b : (b = a.charCodeAt(), "\\u00" + Math.floor(b / 16).toString(16) + (b % 16).toString(16))
            }) + '"' : '"' + a + '"'
        }

        function str(a, b) {
            var c, d, e, f, g, h = gap,
                i = b[a];
            switch (i && "object" == typeof i && "function" == typeof i.toJSON && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                case "string":
                    return quote(i);
                case "number":
                    return isFinite(i) ? String(i) : "null";
                case "boolean":
                case "null":
                    return String(i);
                case "object":
                    if (!i) return "null";
                    if (gap += indent, g = [], "number" == typeof i.length && !i.propertyIsEnumerable("length")) {
                        for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
                        return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
                    }
                    if ("object" == typeof rep)
                        for (f = rep.length, c = 0; f > c; c += 1) d = rep[c], "string" == typeof d && (e = str(d, i, rep), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                    else
                        for (d in i) e = str(d, i, rep), e && g.push(quote(d) + (gap ? ": " : ":") + e);
                    return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
            }
        }
        Date.prototype.toJSON = function() {
            return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z"
        };
        var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
            gap, indent, meta = {
                "\b": "\\b",
                "	": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            rep;
        return {
            stringify: function(a, b, c) {
                var d;
                if (gap = "", indent = "", c)
                    if ("number" == typeof c)
                        for (d = 0; c > d; d += 1) indent += " ";
                    else "string" == typeof c && (indent = c);
                if (b) {
                    if ("function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
                    rep = b
                } else rep = function(a, b) {
                    return Object.hasOwnProperty.call(this, a) ? b : void 0
                };
                return str("", {
                    "": a
                })
            },
            parse: function(text, reviver) {
                function walk(a, b) {
                    var c, d, e = a[b];
                    if (e && "object" == typeof e)
                        for (c in e) Object.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                    return reviver.call(a, b, e)
                }
                var j;
                if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                    "": j
                }, "") : j;
                throw new SyntaxError("JSON.parse")
            },
            quote: quote
        }
    }()),
    function(a) {
        function b(b) {
            var c = b || window.event,
                d = [].slice.call(arguments, 1),
                e = 0,
                f = 0,
                g = 0;
            return b = a.event.fix(c), b.type = "mousewheel", c.wheelDelta && (e = c.wheelDelta / 120), c.detail && (e = -c.detail / 3), g = e, void 0 !== c.axis && c.axis === c.HORIZONTAL_AXIS && (g = 0, f = -1 * e), void 0 !== c.wheelDeltaY && (g = c.wheelDeltaY / 120), void 0 !== c.wheelDeltaX && (f = -1 * c.wheelDeltaX / 120), d.unshift(b, e, f, g), (a.event.dispatch || a.event.handle).apply(this, d)
        }
        var c = ["DOMMouseScroll", "mousewheel"];
        if (a.event.fixHooks)
            for (var d = c.length; d;) a.event.fixHooks[c[--d]] = a.event.mouseHooks;
        a.event.special.mousewheel = {
            setup: function() {
                if (this.addEventListener)
                    for (var a = c.length; a;) this.addEventListener(c[--a], b, !1);
                else this.onmousewheel = b
            },
            teardown: function() {
                if (this.removeEventListener)
                    for (var a = c.length; a;) this.removeEventListener(c[--a], b, !1);
                else this.onmousewheel = null
            }
        }, a.fn.extend({
            mousewheel: function(a) {
                return a ? this.on("mousewheel", a) : this.trigger("mousewheel")
            },
            unmousewheel: function(a) {
                return this.off("mousewheel", a)
            }
        })
    }(jQuery), _globalfwrContextMenuIgnoreHide = !1,
    function(a) {
        var b, c, d = function(b, c, d) {
                var e = a(d),
                    f = d.innerHeight ? d.innerHeight : e.height(),
                    g = e.offset();
                return {
                    width: b - a(d).width() - a(d).scrollLeft() - g.left,
                    height: c - f - a(d).scrollTop() - g.top
                }
            },
            e = function(d) {
                if (c[b.activeId].currentHover) {
                    var e = d ? c[b.activeId].currentHover.nextAll(":not(." + c[b.activeId].separatorClass + "):visible:first") : c[b.activeId].currentHover.prevAll(":not(." + c[b.activeId].separatorClass + "):visible:first");
                    0 == e.length && (e = c[b.activeId].currentHover.parent().find("> li:visible"), e = a(d ? e[0] : e[e.length - 1])), e.mouseover()
                } else {
                    var f = a("#" + b.activeId + ", #" + b.activeId + " ul").filter(function() {
                        return a(this).is(":visible") && 0 == a(this).parents(":hidden").length
                    });
                    if (f.length > 0) {
                        var g = a(f[f.length - 1]).find("> li:visible");
                        a(g[d ? 0 : g.length - 1]).mouseover()
                    }
                }
            },
            f = function() {
                for (cm in c) a(c[cm].allContext).removeClass(b.activeClass)
            },
            g = function() {
                b.activeId && a("#" + b.activeId).add("#" + b.activeId + " ul").hide(), clearInterval(b.keyUpDown), b.keyUpDownStop = !1, c[b.activeId] && (c[b.activeId].currentHover = null), b.activeId = null, a(document).off(".fwrContextMenu"), a(window).off("resize.fwrContextMenu")
            },
            h = function(d) {
                return b.activeId && c[b.activeId].onHide && 0 == c[b.activeId].onHide.apply(a("#" + b.activeId), [d, c[b.activeId].context]) ? !1 : (f(), void g())
            };
        a.fn.fwrContextMenu = function(i, j, k) {
            var l = k || window;
            b || (b = {}), c || (c = {}), j && j.menuClass && (b.menuClass = j.menuClass), b.menuClass || (b.menuClass = "fwrContextMenu"), j && j.activeClass && (b.activeClass = j.activeClass), b.activeClass || (b.activeClass = "active"), c[i] = a.extend({
                hoverClass: "hover",
                submenuClass: "submenu",
                separatorClass: "separator",
                operaEvent: "ctrl+click",
                wrapper: "body",
                fadeIn: 200,
                delay: 300,
                keyDelay: 100,
                widthOverflowOffset: 0,
                heightOverflowOffset: 0,
                submenuLeftOffset: 0,
                submenuTopOffset: 0,
                autoAddSubmenuArrows: !0,
                startLeftOffset: 0,
                startTopOffset: 0,
                keyboard: !0
            }, j || {}), c[i].allContext = this.selector, a("#" + i).find("li")[c[i].livequery ? "expire" : "unbind"](".fwrContextMenu")[c[i].livequery ? "livequery" : "bind"]("mouseover.fwrContextMenu", function(b) {
                if (WebPDF.Environment.mobile) return !1;
                var e = c[i].currentHover = a(this);
                clearTimeout(c[i].show), clearTimeout(c[i].hide), a("#" + i).find("*").removeClass(c[i].hoverClass);
                var f = e.parents("li");
                e.add(e.find("> *")).add(f).add(f.find("> *")).addClass(c[i].hoverClass);
                var g = !0;
                if (c[i].onHover && 0 == c[i].onHover.apply(this, [b, c[i].context]) && (g = !1), !c[i].proceed) return c[i].show = setTimeout(function() {
                    c[i].proceed = !0, e.mouseover()
                }, c[i].delay), !1;
                if (c[i].proceed = !1, e.parent().find("ul").not(e.find("> ul")).hide(), !g) return b.preventDefault(), !1;
                var h = e.find("> ul");
                if (0 != h.length) {
                    var j = e.offset(),
                        k = d(j.left + e.parent().width() + c[i].submenuLeftOffset + h.width() + c[i].widthOverflowOffset, j.top + c[i].submenuTopOffset + h.height() + c[i].heightOverflowOffset, l),
                        m = h.parent().parent().width(),
                        n = j.top - e.parent().offset().top;
                    h.css({
                        left: k.width > 0 && !c[i].ignoreWidthOverflow ? -m - c[i].submenuLeftOffset + "px" : m + c[i].submenuLeftOffset + "px",
                        top: k.height > 0 && !c[i].ignoreHeightOverflow ? n - k.height + c[i].submenuTopOffset + "px" : n + c[i].submenuTopOffset + "px"
                    }), h.fadeIn(c[i].fadeIn)
                }
                b.stopPropagation()
            })[c[i].livequery ? "livequery" : "bind"]("click.fwrContextMenu touchstart.fwrContextMenu", function(d) {
                if (c[i].onSelect) {
                    if (0 == c[i].onSelect.apply(this, [d, c[i].context])) return !1;
                    d.preventDefault()
                }
                g(), a(c[i].context).removeClass(b.activeClass), d.stopPropagation()
            });
            var m = document.createElement("div");
            m.setAttribute("oncontextmenu", "");
            var n = c[i].event;
            if (n ? n += ".fwrContextMenu" : n = "undefined" != typeof m.oncontextmenu ? "contextmenu.fwrContextMenu" : c[i].operaEvent + ".fwrContextMenu", -1 != n.indexOf("+")) {
                var o = n.split("+", 2);
                c[i].modifier = o[0] + "Key", n = o[1]
            }
            return this[c[i].livequery ? "livequery" : "bind"](n, function(j, k) {
                if (WebPDF.Tool && WebPDF.Tool.getReaderApp()) {
                    var m = WebPDF.Tool.getReaderApp().getCurToolHandler();
                    if (a.isFunction(m.getIsOnDraw) && m.getIsOnDraw()) switch (m.getName()) {
                        case WebPDF.Tools.TOOL_NAME_DRAWING_DISTANCE:
                            i = "distanceDrawingMenu";
                            break;
                        case WebPDF.Tools.TOOL_NAME_DRAWING_POLYGON:
                        case WebPDF.Tools.TOOL_NAME_DRAWING_CLOUD:
                        case WebPDF.Tools.TOOL_NAME_DRAWING_POLYLINE:
                            i = "polyDrawingMenu"
                    }
                }
                if ("string" != typeof c[i].modifier || j[c[i].modifier]) {
                    "undefined" == typeof j.pageX && (j = k), c[i].context = this;
                    var n, o, p = a("#" + i);
                    if (c[i].openBelowContext) {
                        var q = a(this).offset();
                        n = q.left, o = q.top + a(this).outerHeight()
                    } else n = j.pageX, o = j.pageY;
                    n += c[i].startLeftOffset, o += c[i].startTopOffset;
                    var r = d(n + p.width() + c[i].widthOverflowOffset, o + p.height() + c[i].heightOverflowOffset, l);
                    return !c[i].ignoreWidthOverflow && r.width > 0 && (n -= r.width), !c[i].openBelowContext && !c[i].ignoreHeightOverflow && r.height > 0 && (o -= r.height), c[i].onShow && 0 == c[i].onShow.apply(p, [j, c[i].context, n, o]) ? !1 : (g(), b.activeId = i, a("#" + b.activeId).add("#" + b.activeId + " ul").hide(), f(), a(c[i].context).addClass(b.activeClass), p.find("li, li > *").removeClass(c[i].hoverClass), c[i].autoAddSubmenuArrows && (p.find("li:has(ul)").not(":has(span." + c[i].submenuClass + ")").prepend('<span class="' + c[i].submenuClass + '"></span>'), p.find("li").not(":has(ul)").find("> span." + c[i].submenuClass).remove()), p.css({
                        left: n + "px",
                        top: o + "px"
                    }).fadeIn(c[i].fadeIn), c[i].openBelowContext && a(window).on("resize.fwrContextMenu", function() {
                        a("#" + i).css("left", a(c[i].context).offset().left + c[i].startLeftOffset + "px")
                    }), a(document).on("mouseover.fwrContextMenu", function(d) {
                        if (a(d.relatedTarget).parents("#" + i).length > 0) {
                            clearTimeout(c[i].show);
                            var e = a(d.relatedTarget).parent().find("li");
                            e.add(e.find("> *")).removeClass(c[i].hoverClass), c[b.activeId].currentHover = null, c[i].hide = setTimeout(function() {
                                e.find("ul").hide(), c[i].autoHide && h(d)
                            }, c[i].delay)
                        }
                    }).on("click.fwrContextMenu touchstart.fwrContextMenu", function(a) {
                        _globalfwrContextMenuIgnoreHide || h(a), _globalfwrContextMenuIgnoreHide = !1
                    }).on("contextmenu.fwrContextMenu", function(a) {
                        a.preventDefault()
                    }), c[i].keyboard && a(document).on("keydown.fwrContextMenu", function(d) {
                        switch (d.which) {
                            case 38:
                                return b.keyUpDownStop ? !1 : (e(), b.keyUpDown = setInterval(e, c[b.activeId].keyDelay), b.keyUpDownStop = !0, !1);
                            case 39:
                                if (c[b.activeId].currentHover) c[b.activeId].currentHover.find("ul:visible:first li:visible:first").mouseover();
                                else {
                                    var f = a("#" + b.activeId + ", #" + b.activeId + " ul:visible");
                                    f.length > 0 && a(f[f.length - 1]).find(":visible:first").mouseover()
                                }
                                return !1;
                            case 40:
                                return b.keyUpDownStop ? !1 : (e(!0), b.keyUpDown = setInterval(function() {
                                    e(!0)
                                }, c[b.activeId].keyDelay), b.keyUpDownStop = !0, !1);
                            case 37:
                                if (c[b.activeId].currentHover) a(c[b.activeId].currentHover.parents("li")[0]).mouseover();
                                else {
                                    var g = a("#" + b.activeId + " li." + c[b.activeId].hoverClass);
                                    g.length > 0 && a(g[g.length - 1]).mouseover()
                                }
                                return !1;
                            case 13:
                                c[b.activeId].currentHover ? c[b.activeId].currentHover.click() : h(d);
                                break;
                            case 27:
                                h(d)
                        }
                    }).on("keyup.fwrContextMenu", function(a) {
                        clearInterval(b.keyUpDown), b.keyUpDownStop = !1
                    }), !1)
                }
            })
        }, a.fn.nofwrContextMenu = function() {
            this.off(".fwrContextMenu")
        }, a.fn.hidden = function() {
            h()
        }
    }(jQuery),
    function(a) {
        "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
    }(function(a) {
        a.fn.fwrJScrollPane = function(b) {
            function c(b, c) {
                function d(c) {
                    var f, h, j, k, l, o, p = !1,
                        q = !1;
                    if (M = c, void 0 === N) l = b.scrollTop(), o = b.scrollLeft(), b.css({
                        overflow: "hidden",
                        padding: 0
                    }), O = b.innerWidth() + qa, P = b.innerHeight(), b.width(O), N = a('<div class="fwrJspPane" />').css("padding", pa).append(b.children()), Q = WebPDF.Environment.ie || WebPDF.Environment.edge || WebPDF.Environment.ieAtLeast11 ? a('<div class="fwrJspContainer-ie" />').css({
                        width: O + "px",
                        height: P + "px"
                    }).append(N).appendTo(b) : a('<div class="fwrJspContainer" />').css({
                        width: O + "px",
                        height: P + "px"
                    }).append(N).appendTo(b);
                    else {
                        if (b.css("width", ""), p = M.stickToBottom && A(), q = M.stickToRight && B(), k = b.innerWidth() + qa != O || b.outerHeight() != P, k && (O = b.innerWidth() + qa, P = b.innerHeight(), Q.css({
                                width: O + "px",
                                height: P + "px"
                            })), !k && ra == R && !c.contentHeight && N.outerHeight() == S) return void b.width(O);
                        ra = R, N.css("width", ""), b.width(O), Q.find(">.fwrJspVerticalBar,>.fwrJspHorizontalBar").remove().end()
                    }
                    N.css("overflow", "auto"), R = c.contentWidth ? c.contentWidth : N[0].scrollWidth, S = c.contentHeight ? c.contentHeight : N[0].scrollHeight, N.css("overflow", ""), T = R / O, U = S / P, V = U > 1, W = T > 1, V || N.css({
                        top: 0
                    }), W || V ? (b.addClass("jspScrollable"), f = M.maintainPosition && (Z || aa), f && (h = y(), j = z()), e(), g(), i(), f && (w(q ? R - O : h, !1), v(p ? S - P : j, !1)), F(), C(), K(), M.enableKeyboardNavigation && H(), M.clickOnTrack && m(), I(), M.hijackInternalLinks && J()) : (b.removeClass("jspScrollable"), N.css({
                        top: 0,
                        left: 0,
                        width: Q.width() - qa
                    }), D(), G(), n()), M.autoReinitialise && !oa ? oa = setInterval(function() {
                        d(M)
                    }, M.autoReinitialiseDelay) : !M.autoReinitialise && oa && clearInterval(oa), l && b.scrollTop(0) && v(l, !1), o && b.scrollLeft(0) && w(o, !1), b.trigger("jsp-initialised", [W || V])
                }

                function e() {
                    V && (Q.append(a('<div class="fwrJspVerticalBar" />').append(a('<div class="fwrJspCap fwrJspCapTop" />'), a('<div class="fwrJspTrack" />').append(a('<div class="fwrJspDrag" />').append(a('<div class="fwrJspDragTop" />'), a('<div class="fwrJspDragBottom" />'))), a('<div class="fwrJspCap fwrJspCapBottom" />'))), ba = Q.find(">.fwrJspVerticalBar"), ca = ba.find(">.fwrJspTrack"), X = ca.find(">.fwrJspDrag"), M.showArrows && (ga = a('<a class="fwrJspArrow fwrJspArrowUp" />').on("mousedown.jsp", k(0, -1)).on("click.jsp", E), ha = a('<a class="fwrJspArrow fwrJspArrowDown" />').on("mousedown.jsp", k(0, 1)).on("click.jsp", E), M.arrowScrollOnHover && (ga.on("mouseover.jsp", k(0, -1, ga)), ha.on("mouseover.jsp", k(0, 1, ha))), j(ca, M.verticalArrowPositions, ga, ha)), ea = P, Q.find(">.fwrJspVerticalBar>.fwrJspCap:visible,>.fwrJspVerticalBar>.fwrJspArrow").each(function() {
                        ea -= a(this).outerHeight()
                    }), X.hover(function() {
                        X.addClass("jspHover")
                    }, function() {
                        X.removeClass("jspHover")
                    }).on("mousedown.jsp", function(b) {
                        a("html").on("dragstart.jsp selectstart.jsp", E), X.addClass("jspActive"), null != M.dragMouseDown && "function" == typeof M.dragMouseDown && M.dragMouseDown();
                        var c = b.pageY - X.position().top;
                        return a("html").on("mousemove.jsp", function(a) {
                            p(a.pageY - c, !1)
                        }).on("mouseup.jsp mouseleave.jsp", o), !1
                    }), f())
                }

                function f() {
                    ca.height(ea + "px"), Z = 0, da = M.verticalGutter + ca.outerWidth(), N.width(O - da - qa);
                    try {
                        0 === ba.position().left && N.css("margin-left", da + "px")
                    } catch (a) {}
                }

                function g() {
                    M.disableHorizontalScroll || W && (Q.append(a('<div class="fwrJspHorizontalBar" />').append(a('<div class="fwrJspCap fwrJspCapLeft" />'), a('<div class="fwrJspTrack" />').append(a('<div class="fwrJspDrag" />').append(a('<div class="fwrJspDragLeft" />'), a('<div class="fwrJspDragRight" />'))), a('<div class="fwrJspCap fwrJspCapRight" />'))), ia = Q.find(">.fwrJspHorizontalBar"), ja = ia.find(">.fwrJspTrack"), $ = ja.find(">.fwrJspDrag"), M.showArrows && (ma = a('<a class="fwrJspArrow fwrJspArrowLeft" />').on("mousedown.jsp", k(-1, 0)).on("click.jsp", E), na = a('<a class="fwrJspArrow fwrJspArrowRight" />').on("mousedown.jsp", k(1, 0)).on("click.jsp", E), M.arrowScrollOnHover && (ma.on("mouseover.jsp", k(-1, 0, ma)), na.on("mouseover.jsp", k(1, 0, na))), j(ja, M.horizontalArrowPositions, ma, na)), $.hover(function() {
                        $.addClass("jspHover")
                    }, function() {
                        $.removeClass("jspHover")
                    }).on("mousedown.jsp", function(b) {
                        a("html").on("dragstart.jsp selectstart.jsp", E), $.addClass("jspActive");
                        var c = b.pageX - $.position().left;
                        return a("html").on("mousemove.jsp", function(a) {
                            r(a.pageX - c, !1)
                        }).on("mouseup.jsp mouseleave.jsp", o), !1
                    }), ka = Q.innerWidth(), h())
                }

                function h() {
                    Q.find(">.fwrJspHorizontalBar>.fwrJspCap:visible,>.fwrJspHorizontalBar>.fwrJspArrow").each(function() {
                        ka -= a(this).outerWidth()
                    }), ja.width(ka + "px"), aa = 0
                }

                function i() {
                    if (W && V) {
                        var b = ja.outerHeight(),
                            c = ca.outerWidth();
                        ea -= b, a(ia).find(">.fwrJspCap:visible,>.fwrJspArrow").each(function() {
                            ka += a(this).outerWidth()
                        }), ka -= c, P -= c, O -= b, ja.parent().append(a('<div class="fwrJspCorner" />').css("width", b + "px")), f(), h()
                    }
                    W && N.width(Q.outerWidth() - qa + "px"), S = M.contentHeight ? M.contentHeight : N.outerHeight(), U = S / P, W && (la = Math.ceil(1 / T * ka), la > M.horizontalDragMaxWidth ? la = M.horizontalDragMaxWidth : la < M.horizontalDragMinWidth && (la = M.horizontalDragMinWidth), $.width(la + "px"), _ = ka - la, s(aa)), V && (fa = Math.ceil(1 / U * ea), fa > M.verticalDragMaxHeight ? fa = M.verticalDragMaxHeight : fa < M.verticalDragMinHeight && (fa = M.verticalDragMinHeight), X.height(fa + "px"), Y = ea - fa, q(Z))
                }

                function j(a, b, c, d) {
                    var e, f = "before",
                        g = "after";
                    "os" == b && (b = /Mac/.test(navigator.platform) ? "after" : "split"), b == f ? g = b : b == g && (f = b, e = c, c = d, d = e), a[f](c)[g](d)
                }

                function k(a, b, c) {
                    return function() {
                        return l(a, b, this, c), this.blur(), !1
                    }
                }

                function l(b, c, d, e) {
                    d = a(d).addClass("jspActive");
                    var f, g, h = !0,
                        i = function() {
                            0 !== b && sa.scrollByX(b * M.arrowButtonSpeed), 0 !== c && sa.scrollByY(c * M.arrowButtonSpeed), g = setTimeout(i, h ? M.initialDelay : M.arrowRepeatFreq), h = !1
                        };
                    i(), f = e ? "mouseout.jsp" : "mouseup.jsp", e = e || a("html"), e.on(f, function() {
                        d.removeClass("jspActive"), g && clearTimeout(g), g = null, e.off(f)
                    })
                }

                function m() {
                    n(), V && ca.on("mousedown.jsp", function(b) {
                        if (void 0 === b.originalTarget || b.originalTarget == b.currentTarget) {
                            var c, d = a(this),
                                e = d.offset(),
                                f = b.pageY - e.top - Z,
                                g = !0,
                                h = function() {
                                    var a = d.offset(),
                                        e = b.pageY - a.top - fa / 2,
                                        j = P * M.scrollPagePercent,
                                        k = Y * j / (S - P);
                                    if (0 > f) Z - k > e ? sa.scrollByY(-j) : p(e);
                                    else {
                                        if (!(f > 0)) return void i();
                                        e > Z + k ? sa.scrollByY(j) : p(e)
                                    }
                                    c = setTimeout(h, g ? M.initialDelay : M.trackClickRepeatFreq), g = !1
                                },
                                i = function() {
                                    c && clearTimeout(c), c = null, a(document).off("mouseup.jsp", i)
                                };
                            return h(), a(document).on("mouseup.jsp", i), !1
                        }
                    }), W && ja.on("mousedown.jsp", function(b) {
                        if (void 0 === b.originalTarget || b.originalTarget == b.currentTarget) {
                            var c, d = a(this),
                                e = d.offset(),
                                f = b.pageX - e.left - aa,
                                g = !0,
                                h = function() {
                                    var a = d.offset(),
                                        e = b.pageX - a.left - la / 2,
                                        j = O * M.scrollPagePercent,
                                        k = _ * j / (R - O);
                                    if (0 > f) aa - k > e ? sa.scrollByX(-j) : r(e);
                                    else {
                                        if (!(f > 0)) return void i();
                                        e > aa + k ? sa.scrollByX(j) : r(e)
                                    }
                                    c = setTimeout(h, g ? M.initialDelay : M.trackClickRepeatFreq), g = !1
                                },
                                i = function() {
                                    c && clearTimeout(c), c = null, a(document).off("mouseup.jsp", i)
                                };
                            return h(), a(document).on("mouseup.jsp", i), !1
                        }
                    })
                }

                function n() {
                    ja && ja.off("mousedown.jsp"), ca && ca.off("mousedown.jsp")
                }

                function o() {
                    a("html").off("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp"), null != M.cancelDrag && "function" == typeof M.cancelDrag && M.cancelDrag(), X && X.removeClass("jspActive"), $ && $.removeClass("jspActive")
                }

                function p(a, b) {
                    V && (0 > a ? a = 0 : a > Y && (a = Y), void 0 === b && (b = M.animateScroll), b ? sa.animate(X, "top", a, q) : (X.css("top", a), q(a)))
                }

                function q(a) {
                    void 0 === a && (a = X.position().top), Q.scrollTop(0);
                    var c = !1;
                    (Z > a || Z == a && 0 == Z) && (c = !0), Z = a || 0;
                    var d = 0 === Z,
                        e = Z == Y,
                        f = a / Y,
                        g = -f * (S - P);
                    (ta != d || va != e) && (ta = d, va = e, b.trigger("jsp-arrow-change", [ta, va, ua, wa])), t(d, e), N.css("top", g), b.trigger("jsp-scroll-y", [-g, d, e]).trigger("scroll", [c, d, e])
                }

                function r(a, b) {
                    W && (0 > a ? a = 0 : a > _ && (a = _), void 0 === b && (b = M.animateScroll), b ? sa.animate($, "left", a, s) : ($.css("left", a), s(a)))
                }

                function s(a) {
                    void 0 === a && (a = $.position().left), Q.scrollTop(0), aa = a || 0;
                    var c = 0 === aa,
                        d = aa == _,
                        e = a / _,
                        f = -e * (R - O);
                    (ua != c || wa != d) && (ua = c, wa = d, b.trigger("jsp-arrow-change", [ta, va, ua, wa])), u(c, d), N.css("left", f), b.trigger("jsp-scroll-x", [-f, c, d]).trigger("scroll")
                }

                function t(a, b) {
                    M.showArrows && (ga[a ? "addClass" : "removeClass"]("jspDisabled"), ha[b ? "addClass" : "removeClass"]("jspDisabled"))
                }

                function u(a, b) {
                    M.showArrows && (ma[a ? "addClass" : "removeClass"]("jspDisabled"), na[b ? "addClass" : "removeClass"]("jspDisabled"))
                }

                function v(a, b) {
                    var c = a / (S - P);
                    p(c * Y, b)
                }

                function w(a, b) {
                    var c = a / (R - O);
                    r(c * _, b)
                }

                function x(b, c, d) {
                    var e, f, g, h, i, j, k, l, m, n = 0,
                        o = 0;
                    try {
                        e = a(b)
                    } catch (p) {
                        return
                    }
                    for (f = e.outerHeight(), g = e.outerWidth(), Q.scrollTop(0), Q.scrollLeft(0); !e.is(".fwrJspPane");)
                        if (n += e.position().top, o += e.position().left, e = e.offsetParent(), /^body|html$/i.test(e[0].nodeName)) return;
                    h = z(), j = h + P, h > n || c ? l = n - M.verticalGutter : n + f > j && (l = n - P + f + M.verticalGutter), isNaN(l) || v(l, d), i = y(), k = i + O, i > o || c ? m = o - M.horizontalGutter : o + g > k && (m = o - O + g + M.horizontalGutter), isNaN(m) || w(m, d)
                }

                function y() {
                    return -N.position().left
                }

                function z() {
                    return -N.position().top
                }

                function A() {
                    var a = S - P;
                    return a > 20 && a - z() < 10
                }

                function B() {
                    var a = R - O;
                    return a > 20 && a - y() < 10
                }

                function C() {
                    Q.off(ya).on(ya, function(a, b, c, d) {
                        aa || (aa = 0), Z || (Z = 0);
                        var e = aa,
                            f = Z,
                            g = a.deltaFactor || M.mouseWheelSpeed;
                        return sa.scrollBy(c * g, -d * g, !1), e == aa && f == Z
                    })
                }

                function D() {
                    Q.off(ya)
                }

                function E() {
                    return !1
                }

                function F() {
                    N.find(":input,a").off("focus.jsp").on("focus.jsp", function(a) {
                        x(a.target, !1)
                    })
                }

                function G() {
                    N.find(":input,a").off("focus.jsp")
                }

                function H() {
                    function c() {
                        var a = aa,
                            b = Z;
                        switch (d) {
                            case 40:
                                sa.scrollByY(M.keyboardSpeed, !1);
                                break;
                            case 38:
                                sa.scrollByY(-M.keyboardSpeed, !1);
                                break;
                            case 34:
                            case 32:
                                sa.scrollByY(P * M.scrollPagePercent, !1);
                                break;
                            case 33:
                                sa.scrollByY(-P * M.scrollPagePercent, !1);
                                break;
                            case 39:
                                sa.scrollByX(M.keyboardSpeed, !1);
                                break;
                            case 37:
                                sa.scrollByX(-M.keyboardSpeed, !1)
                        }
                        return e = a != aa || b != Z
                    }
                    var d, e, f = [];
                    W && f.push(ia[0]), V && f.push(ba[0]), N.on("focus.jsp", function() {
                        b.focus()
                    }), b.attr("tabindex", 0).off("keydown.jsp keypress.jsp").on("keydown.jsp", function(b) {
                        if (b.target === this || f.length && a(b.target).closest(f).length) {
                            var g = aa,
                                h = Z;
                            switch (b.keyCode) {
                                case 40:
                                case 38:
                                case 34:
                                case 32:
                                case 33:
                                case 39:
                                case 37:
                                    d = b.keyCode, c(), d = null;
                                    break;
                                case 35:
                                    M.keyDownCallback(35), d = null;
                                    break;
                                case 36:
                                    v(0), d = null
                            }
                            return e = b.keyCode == d && g != aa || h != Z, !e
                        }
                    }).on("keypress.jsp", function(b) {
                        return b.keyCode == d && c(), b.target === this || f.length && a(b.target).closest(f).length ? !e : void 0
                    }), M.hideFocus ? (b.css("outline", "none"), "hideFocus" in Q[0] && b.attr("hideFocus", !0)) : (b.css("outline", ""), "hideFocus" in Q[0] && b.attr("hideFocus", !1))
                }

                function I() {
                    if (location.hash && location.hash.length > 1) {
                        var b, c, d = escape(location.hash.substr(1));
                        try {
                            b = a("#" + d + ', a[name="' + d + '"]')
                        } catch (e) {
                            return
                        }
                        b.length && N.find(d) && (0 === Q.scrollTop() ? c = setInterval(function() {
                            Q.scrollTop() > 0 && (x(b, !0), a(document).scrollTop(Q.position().top), clearInterval(c))
                        }, 50) : (x(b, !0), a(document).scrollTop(Q.position().top)))
                    }
                }

                function J() {
                    a(document.body).data("jspHijack") || (a(document.body).data("jspHijack", !0), a(document.body).delegate("a[href*=#]", "click", function(b) {
                        var c, d, e, f, g, h, i = this.href.substr(0, this.href.indexOf("#")),
                            j = location.href;
                        if (-1 !== location.href.indexOf("#") && (j = location.href.substr(0, location.href.indexOf("#"))), i === j) {
                            c = escape(this.href.substr(this.href.indexOf("#") + 1));
                            try {
                                d = a("#" + c + ', a[name="' + c + '"]')
                            } catch (k) {
                                return
                            }
                            d.length && (e = d.closest(".jspScrollable"), f = e.data("jsp"), f.scrollToElement(d, !0), e[0].scrollIntoView && (g = a(window).scrollTop(), h = d.offset().top, (g > h || h > g + a(window).height()) && e[0].scrollIntoView()), b.preventDefault())
                        }
                    }))
                }

                function K() {
                    var a, b, c, d, e, f = !1;
                    Q.off("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").on("touchstart.jsp", function(g) {
                        var h = g.originalEvent.touches[0];
                        a = y(), b = z(), c = h.pageX, d = h.pageY, e = !1, f = !0
                    }).on("touchmove.jsp", function(g) {
                        if (f) {
                            var h = g.originalEvent.touches[0],
                                i = aa,
                                j = Z;
                            return sa.scrollTo(a + c - h.pageX, b + d - h.pageY), e = e || Math.abs(c - h.pageX) > 5 || Math.abs(d - h.pageY) > 5, i == aa && j == Z
                        }
                    }).on("touchend.jsp", function(a) {
                        f = !1
                    }).on("click.jsp-touchclick", function(a) {
                        return e ? (e = !1, !1) : void 0
                    })
                }

                function L() {
                    var a = z(),
                        c = y();
                    b.removeClass("jspScrollable").off(".jsp"), N.off(".jsp"), b.replaceWith(xa.append(N.children())), xa.scrollTop(a), xa.scrollLeft(c), oa && clearInterval(oa)
                }
                var M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, $, _, aa, ba, ca, da, ea, fa, ga, ha, ia, ja, ka, la, ma, na, oa, pa, qa, ra, sa = this,
                    ta = !0,
                    ua = !0,
                    va = !1,
                    wa = !1,
                    xa = b.clone(!1, !1).empty(),
                    ya = a.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
                "border-box" === b.css("box-sizing") ? (pa = 0, qa = 0) : (pa = b.css("paddingTop") + " " + b.css("paddingRight") + " " + b.css("paddingBottom") + " " + b.css("paddingLeft"), qa = (parseInt(b.css("paddingLeft"), 10) || 0) + (parseInt(b.css("paddingRight"), 10) || 0)), a.extend(sa, {
                    reinitialise: function(b) {
                        b = a.extend({}, M, b), d(b)
                    },
                    scrollToElement: function(a, b, c) {
                        x(a, b, c)
                    },
                    scrollTo: function(a, b, c) {
                        w(a, c), v(b, c)
                    },
                    scrollToX: function(a, b) {
                        w(a, b)
                    },
                    scrollToY: function(a, b) {
                        v(a, b)
                    },
                    scrollToPercentX: function(a, b) {
                        w(a * (R - O), b)
                    },
                    scrollToPercentY: function(a, b) {
                        v(a * (S - P), b)
                    },
                    scrollBy: function(a, b, c) {
                        sa.scrollByX(a, c), sa.scrollByY(b, c)
                    },
                    scrollByX: function(a, b) {
                        var c = y() + Math[0 > a ? "floor" : "ceil"](a),
                            d = c / (R - O);
                        r(d * _, b)
                    },
                    scrollByY: function(a, b) {
                        var c = z() + Math[0 > a ? "floor" : "ceil"](a),
                            d = c / (S - P);
                        // For Poc
                        var ctop = z();
                        if(ctop === -0)
                        {
                            ctop = 0;
                        }
                        var height;
                        if (document.getElementsByClassName("fwr-single-page")[0] !== undefined)
                        {
                           height =  document.getElementsByClassName("fwr-single-page")[0].clientHeight;
                        } else if (document.getElementsByClassName("fwr-page")[0] !== undefined) {
                           height =  document.getElementsByClassName("fwr-page")[0].clientHeight;
                        }
                        var visiblePageNo = WebPDF.ViewerInstance.getCurPageIndex();
                        var r = ctop % height;
                        var s = (height - r) - (P);
                        var lowerSizeLimit = visiblePageNo * height
                        var upperSizeLimit = ctop + s;
                        if(ctop === 0)
                        {
                         lowerSizeLimit = 0;
                         upperSizeLimit = height;
                        }
                        if (c <= upperSizeLimit && c >=lowerSizeLimit)
                        p(d * Y, b)
                    },
                    positionDragX: function(a, b) {
                        r(a, b)
                    },
                    positionDragY: function(a, b) {
                        p(a, b)
                    },
                    animate: function(a, b, c, d) {
                        var e = {};
                        e[b] = c, a.animate(e, {
                            duration: M.animateDuration,
                            easing: M.animateEase,
                            queue: !1,
                            step: d
                        })
                    },
                    getContentPositionX: function() {
                        return y()
                    },
                    getContentPositionY: function() {
                        return z()
                    },
                    getContentWidth: function() {
                        return R
                    },
                    getContentHeight: function() {
                        return S
                    },
                    getPercentScrolledX: function() {
                        return y() / (R - O)
                    },
                    getPercentScrolledY: function() {
                        return z() / (S - P)
                    },
                    getIsScrollableH: function() {
                        return W
                    },
                    getIsScrollableV: function() {
                        return V
                    },
                    getScrollBarWidth: function() {
                        return sa.getIsScrollableV() ? M.verticalGutter + ca.outerWidth() : 0
                    },
                    getScrollBarHeight: function() {
                        return sa.getIsScrollableH() ? M.horizontalGutter + ja.outerHeight() : 0
                    },
                    getContentPane: function() {
                        return N
                    },
                    scrollToBottom: function(a) {
                        p(Y, a)
                    },
                    hijackInternalLinks: a.noop,
                    destroy: function() {
                        L()
                    }
                }), d(c)
            }
            return b = a.extend({}, a.fn.fwrJScrollPane.defaults, b), a.each(["arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
                b[this] = b[this] || b.speed
            }), this.each(function() {
                var d = a(this),
                    e = d.data("jsp");
                e ? e.reinitialise(b) : (a("script", d).filter('[type="text/javascript"],:not([type])').remove(), e = new c(d, b), d.data("jsp", e))
            })
        }, a.fn.fwrJScrollPane.defaults = {
            disableHorizontalScroll: !1,
            initTouchScreen: !1,
            showArrows: !1,
            maintainPosition: !0,
            stickToBottom: !1,
            stickToRight: !1,
            clickOnTrack: !0,
            autoReinitialise: !1,
            autoReinitialiseDelay: 500,
            verticalDragMinHeight: 5,
            verticalDragMaxHeight: 99999,
            horizontalDragMinWidth: 0,
            horizontalDragMaxWidth: 99999,
            contentWidth: void 0,
            contentHeight: void 0,
            animateScroll: !1,
            animateDuration: 300,
            animateEase: "linear",
            hijackInternalLinks: !1,
            verticalGutter: 4,
            horizontalGutter: 4,
            mouseWheelSpeed: 10,
            arrowButtonSpeed: 0,
            arrowRepeatFreq: 50,
            arrowScrollOnHover: !1,
            trackClickSpeed: 0,
            trackClickRepeatFreq: 70,
            verticalArrowPositions: "split",
            horizontalArrowPositions: "split",
            enableKeyboardNavigation: !0,
            hideFocus: !0,
            keyboardSpeed: 0,
            initialDelay: 300,
            speed: 30,
            scrollPagePercent: .8,
            keyDownCallback: {},
            cancelDrag: null,
            dragMouseDown: null
        }
    }),
    function(a, b, c) {
        a.fn.WebPDFNativeScroll = function(b) {
            function d(b, d) {
                function e(d) {
                    j = b.innerWidth(), k = b.innerHeight(), h === c && (b.css({
                        overflow: "auto"
                    }), b.width(j), h = a('<div class="fwrJspPane" />').append(b.children()), i = WebPDF.Environment.ie || WebPDF.Environment.edge || WebPDF.Environment.ieAtLeast11 ? a('<div class="fwrJspContainer-ie" />').append(h).appendTo(b) : a('<div class="fwrJspContainer" />').append(h).appendTo(b));
                    var e = "",
                        f = "",
                        g = "";
                    d.contentHeight && (e = d.contentWidth > j ? d.contentWidth + "px" : j + "px", f = d.contentHeight + "px", g = "hidden"), h.css({
                        height: f,
                        width: e,
                        overflow: g
                    }), i.css({
                        height: f,
                        width: e,
                        overflow: g
                    })
                }

                function f() {
                    a.error("Unimplemented function for native scroll bar.")
                }
                var g, h, i, j, k, l = this;
                a.extend(l, {
                    reinitialise: function(b) {
                        g = a.extend({}, g, b), e(g)
                    },
                    scrollToElement: function(a, c, d, e) {
                        var f = null;
                        b.scrollLeft(0), b.scrollTop(0), f = jQuery(a).position();
                        var g = f.top;
                        e && (g += e), l.scrollBy(f.left, g)
                    },
                    scrollTo: function(a, c, d) {
                        b.scrollLeft(a), b.scrollTop(c)
                    },
                    scrollToX: function(a, c) {
                        b.scrollLeft(a)
                    },
                    scrollToY: function(a, c) {
                        b.scrollTop(a)
                    },
                    scrollToPercentX: function(a, b) {
                        f()
                    },
                    scrollToPercentY: function(a, b) {
                        f()
                    },
                    scrollBy: function(a, b, c) {
                        l.scrollByX(a, c), l.scrollByY(b, c)
                    },
                    scrollByX: function(a, c) {
                        b.scrollLeft() <= 0 && 0 > a && (a = 0), b.scrollLeft(b.scrollLeft() + a)
                    },
                    scrollByY: function(a, c) {
                        b.scrollTop() <= 0 && 0 > a && (a = 0), b.scrollTop(b.scrollTop() + a)
                    },
                    positionDragX: function(a, b) {
                        f()
                    },
                    positionDragY: function(a, b) {
                        f()
                    },
                    animate: function(a, b, c, d) {
                        f()
                    },
                    getContentPositionX: function() {
                        return b.scrollLeft()
                    },
                    getContentPositionY: function() {
                        return b.scrollTop()
                    },
                    getContentWidth: function() {
                        return b.width()
                    },
                    getContentHeight: function() {
                        return b.height()
                    },
                    getPercentScrolledX: function() {
                        f()
                    },
                    getPercentScrolledY: function() {
                        f()
                    },
                    getIsScrollableH: function() {
                        return l.getScrollBarHeight() > 0
                    },
                    getIsScrollableV: function() {
                        return l.getScrollBarWidth() > 0
                    },
                    getScrollBarWidth: function() {
                        return b[0].offsetWidth - b[0].clientWidth
                    },
                    getScrollBarHeight: function() {
                        return b[0].offsetHeight - b[0].clientHeight
                    },
                    getContentPane: function() {
                        return b
                    },
                    scrollToBottom: function(a) {
                        f()
                    },
                    hijackInternalLinks: function() {
                        f()
                    },
                    destroy: function() {
                        f()
                    }
                })
            }
            return this.each(function() {
                var c = a(this),
                    e = c.data("jsp");
                e ? e.reinitialise(b) : (e = new d(c, b), c.data("jsp", e))
            })
        }
    }(jQuery, this), window.WebPDFTools = window.WebPDFTools || {}, WebPDFTools.Node = function(a, b, c, d, e, f, g, h, i) {
        this.id = a, this.pid = b, this.name = c, this.url = d, this.title = e, this.target = f, this.icon = g, this.iconOpen = h, this._io = i || !1, this._is = !1, this._ls = !1, this._hc = !1, this._ai = 0, this._hidden = !1, this._bTop = !1, this.pageIndex = null, this.rc = null
    }, WebPDFTools.dTree = function(a, b, c, d) {
        this.config = {
            showroot: !1,
            target: null,
            folderLinks: !0,
            useSelection: !0,
            useCookies: !0,
            useLines: !0,
            useIcons: !0,
            useStatusText: !1,
            closeSameLevel: !1,
            inOrder: !1
        }, this.icon = d, this.obj = a, this.extNodeClass = b, this.extPlusItemClass = c, this.aNodes = [], this.aIndent = [], this.root = new WebPDFTools.Node(-1), this.selectedNode = null, this.selectedFound = !1, this.completed = !1, this.bSetTop = !1, this.curID = -1
    }, WebPDFTools.dTree.prototype.add = function(a, b, c, d, e, f, g, h, i) {
        this.aNodes[this.aNodes.length] = new WebPDFTools.Node(a, b, c, d, e, f, g, h, i)
    }, WebPDFTools.dTree.prototype.setPageIndex = function(a, b) {
        this.aNodes[a].pageIndex = b
    }, WebPDFTools.dTree.prototype.setRect = function(a, b) {
        this.aNodes[a].rc = b
    }, WebPDFTools.dTree.prototype.getPageIndex = function(a) {
        return this.aNodes[a].pageIndex
    }, WebPDFTools.dTree.prototype.getRect = function(a) {
        return this.aNodes[a].rc
    }, WebPDFTools.dTree.prototype.resetFlag = function(a) {
        this.aNodes.length > 0 && (this.aNodes[0]._ls = !1, this.aNodes[this.aNodes.length - 1]._ls = !1)
    }, WebPDFTools.dTree.prototype.openAll = function() {
        this.oAll(!0)
    }, WebPDFTools.dTree.prototype.closeAll = function() {
        this.oAll(!1)
    }, WebPDFTools.dTree.prototype.toString = function() {
        var a = '<div class="fwr-dtree">\n';
        return document.getElementById ? (this.config.useCookies && (this.selectedNode = this.getSelected()), a += this.addNode(this.root)) : a += "Browser not supported.", a += "</div>", this.selectedFound || (this.selectedNode = null), this.completed = !0, a
    }, WebPDFTools.dTree.prototype.addNode = function(a) {
        var b = "",
            c = 0;
        for (this.config.inOrder && (c = a._ai), c; c < this.aNodes.length; c++)
            if (this.aNodes[c].pid == a.id) {
                var d = this.aNodes[c];
                if (d._p = a, d._ai = c, this.setCS(d), !d.target && this.config.target && (d.target = this.config.target), d._hc && !d._io && this.config.useCookies && (d._io = this.isOpen(d.id)), !this.config.folderLinks && d._hc && (d.url = null), this.config.useSelection && d.id == this.selectedNode && !this.selectedFound && (d._is = !0, this.selectedNode = c, this.selectedFound = !0), b += this.node(d, c), d._ls) break
            }
        return b
    }, WebPDFTools.dTree.prototype.node = function(a, b) {
        var c = '<div class="fwr-dTreeNode"';
        return this.root.id != a.pid || this.config.showroot || (c += "style='display:none'", a._hidden = !0), c += ">", c += this.indent(a, b), this.config.useIcons && (a.icon || (a.icon = this.root.id == a.pid ? this.icon.root : a._hc ? this.icon.folder : this.icon.node), a.iconOpen || (a.iconOpen = a._hc ? this.icon.folderOpen : this.icon.node), this.root.id == a.pid && (a.icon = this.icon.root, a.iconOpen = this.icon.root, this.config.showroot || (a._hidden = !0)), c += '<img id="i' + this.obj + b + '" src="' + (a._io ? a.iconOpen : a.icon) + '" alt="" class="' + this.extNodeClass + '" nodeId="' + b + '"/>'), a.url ? (c += '<a id="s' + this.obj + b + '" class="' + (this.config.useSelection && a._is ? "nodeSel" : "node") + '" href="' + a.url + '"', a.title && (c += ' title="' + a.title + '"'), a.target && (c += ' target="' + a.target + '"'), this.config.useStatusText && (c += " onmouseover=\"window.status='" + a.name + "';return true;\" onmouseout=\"window.status='';return true;\" "), this.config.useSelection && (a._hc && this.config.folderLinks || !a._hc) && (c += ' onclick="javascript: ' + this.obj + ".s(" + b + ');"'), c += ">") : c += this.config.folderLinks && a.url || !a._hc || a.pid == this.root.id ? '<a class="node ' + this.extNodeClass + '" nodeId="' + b + '">' : '<a id="s' + this.obj + b + '"" class="node ' + this.extNodeClass + '" nodeId="' + b + '">', c += "<span id='" + this.obj + b + "'title='" + a.name + "' class='" + this.extNodeClass + "' nodeId='" + b + "'>" + a.name + "</span>", c += "</a>", c += "</div>", a._hc && (c += '<div id="d' + this.obj + b + '" class="clip" style="display:' + (this.root.id == a.pid || a._io ? "block" : "none") + ';">', c += this.addNode(a), c += "</div>"), this.aIndent.pop(), c
    }, WebPDFTools.dTree.prototype.indent = function(a, b) {
        var c = "";
        if (this.root.id != a.pid) {
            this.config.showroot || 0 != this.bSetTop || (a._bTop = !0, this.bSetTop = !0);
            for (var d = 0; d < this.aIndent.length; d++) c += '<img src="' + (1 == this.aIndent[d] && this.config.useLines ? this.icon.line : this.icon.empty) + '" alt="" />';
            if (a._ls ? this.aIndent.push(0) : this.aIndent.push(1), a._hc) {
                var e = !this.config.showroot && a._bTop ? this.icon.minusTop : this.icon.minus,
                    f = !this.config.showroot && a._bTop ? this.icon.plusTop : this.icon.plus,
                    g = a._bTop == a._ls ? this.icon.minusOnly : this.icon.minusBottom,
                    h = a._bTop == a._ls ? this.icon.plusOnly : this.icon.plusBottom;
                c += '<a id="hc' + this.obj + b + '" class="' + this.extPlusItemClass + '" nodeId="' + b + '"><img id="j' + this.obj + b + '" class="' + this.extPlusItemClass + '" nodeId="' + b + '" src="',
                    c += this.config.useLines ? a._io ? a._ls && this.config.useLines ? g : e : a._ls && this.config.useLines ? h : f : a._io ? this.icon.nlMinus : this.icon.nlPlus, c += '" alt="" /></a>'
            } else {
                var i = !this.config.showroot && a._bTop ? this.icon.joinTop : this.icon.join,
                    j = a._bTop == a._ls ? this.icon.joinonly : this.icon.joinBottom;
                c += '<img src="' + (this.config.useLines ? a._ls ? j : i : this.icon.empty) + '" alt="" />'
            }
        }
        return c
    }, WebPDFTools.dTree.prototype.setCS = function(a) {
        for (var b, c = 0; c < this.aNodes.length; c++) this.aNodes[c].pid == a.id && (a._hc = !0), this.aNodes[c].pid == a.pid && (b = this.aNodes[c].id);
        b != a.id || a._bTop || (a._ls = !0)
    }, WebPDFTools.dTree.prototype.getSelected = function() {
        var a = this.getCookie("cs" + this.obj);
        return a ? a : null
    }, WebPDFTools.dTree.prototype.s = function(a) {
        if (this.config.useSelection) {
            var b = this.aNodes[a];
            (!b._hc || this.config.folderLinks) && this.selectedNode != a && ((this.selectedNode || 0 == this.selectedNode) && (eOld = document.getElementById("s" + this.obj + this.selectedNode), eOld.className = "node"), eNew = document.getElementById("s" + this.obj + a), eNew.className = "nodeSel", this.selectedNode = a, this.config.useCookies && this.setCookie("cs" + this.obj, b.id))
        }
    }, WebPDFTools.dTree.prototype.setCurNode = function(a) {
        if (this.config.useIcons && this.curID != a) {
            var b = null;
            this.curID > -1 && (b = document.getElementById("i" + this.obj + this.curID), b.src = this.icon.node), this.curID = a;
            var b = document.getElementById("i" + this.obj + this.curID);
            b.src = this.icon.nodehot
        }
    }, WebPDFTools.dTree.prototype.o = function(a) {
        var b = this.aNodes[a];
        this.nodeStatus(!b._io, a, b._ls), b._io = !b._io, this.config.closeSameLevel && this.closeLevel(b), this.config.useCookies && this.updateCookie()
    }, WebPDFTools.dTree.prototype.oAll = function(a) {
        for (var b = 0; b < this.aNodes.length; b++) this.aNodes[b]._hc && this.aNodes[b].pid != this.root.id && (this.nodeStatus(a, b, this.aNodes[b]._ls), this.aNodes[b]._io = a);
        this.config.useCookies && this.updateCookie()
    }, WebPDFTools.dTree.prototype.openTo = function(a, b, c) {
        if (!c)
            for (var d = 0; d < this.aNodes.length; d++)
                if (this.aNodes[d].id == a) {
                    a = d;
                    break
                }
        var e = this.aNodes[a];
        e.pid != this.root.id && e._p && (e._io = !0, e._is = b, this.completed && e._hc && this.nodeStatus(!0, e._ai, e._ls), this.completed && b ? this.s(e._ai) : b && (this._sn = e._ai), this.openTo(e._p._ai, !1, !0))
    }, WebPDFTools.dTree.prototype.closeLevel = function(a) {
        for (var b = 0; b < this.aNodes.length; b++) this.aNodes[b].pid == a.pid && this.aNodes[b].id != a.id && this.aNodes[b]._hc && (this.nodeStatus(!1, b, this.aNodes[b]._ls), this.aNodes[b]._io = !1, this.closeAllChildren(this.aNodes[b]))
    }, WebPDFTools.dTree.prototype.closeAllChildren = function(a) {
        for (var b = 0; b < this.aNodes.length; b++) this.aNodes[b].pid == a.id && this.aNodes[b]._hc && (this.aNodes[b]._io && this.nodeStatus(!1, b, this.aNodes[b]._ls), this.aNodes[b]._io = !1, this.closeAllChildren(this.aNodes[b]))
    }, WebPDFTools.dTree.prototype.nodeStatus = function(a, b, c) {
        eDiv = document.getElementById("d" + this.obj + b), eJoin = document.getElementById("j" + this.obj + b);
        var d = this.aNodes[b]._bTop,
            e = !this.config.showroot && d ? this.icon.minusTop : this.icon.minus,
            f = !this.config.showroot && d ? this.icon.plusTop : this.icon.plus,
            g = d == c ? this.icon.minusOnly : this.icon.minusBottom,
            h = d == c ? this.icon.plusOnly : this.icon.plusBottom;
        eJoin.src = this.config.useLines ? a ? c ? g : e : c ? h : f : a ? this.icon.nlMinus : this.icon.nlPlus, eDiv.style.display = a ? "block" : "none"
    }, WebPDFTools.dTree.prototype.clearCookie = function() {
        var a = new Date,
            b = new Date(a.getTime() - 864e5);
        this.setCookie("co" + this.obj, "cookieValue", b), this.setCookie("cs" + this.obj, "cookieValue", b)
    }, WebPDFTools.dTree.prototype.setCookie = function(a, b, c, d, e, f) {
        document.cookie = escape(a) + "=" + escape(b) + (c ? "; expires=" + c.toGMTString() : "") + (d ? "; path=" + d : "") + (e ? "; domain=" + e : "") + (f ? "; secure" : "")
    }, WebPDFTools.dTree.prototype.getCookie = function(a) {
        var b = "",
            c = document.cookie.indexOf(escape(a) + "=");
        if (-1 != c) {
            var d = c + (escape(a) + "=").length,
                e = document.cookie.indexOf(";", d);
            b = -1 != e ? unescape(document.cookie.substring(d, e)) : unescape(document.cookie.substring(d))
        }
        return b
    }, WebPDFTools.dTree.prototype.updateCookie = function() {
        for (var a = "", b = 0; b < this.aNodes.length; b++) this.aNodes[b]._io && this.aNodes[b].pid != this.root.id && (a && (a += "."), a += this.aNodes[b].id);
        this.setCookie("co" + this.obj, a)
    }, WebPDFTools.dTree.prototype.isOpen = function(a) {
        for (var b = this.getCookie("co" + this.obj).split("."), c = 0; c < b.length; c++)
            if (b[c] == a) return !0;
        return !1
    }, Array.prototype.push || (Array.prototype.push = function() {
        for (var a = 0; a < arguments.length; a++) this[this.length] = arguments[a];
        return this.length
    }), Array.prototype.pop || (Array.prototype.pop = function() {
        return lastElement = this[this.length - 1], this.length = Math.max(this.length - 1, 0), lastElement
    }),
    function() {
        function a(a, b, c, d) {
            this.target = a, this.$select = b, this.params = c, this.props = {}, this.eventId = d, this.$selection = b.find("[role=selection]"), this.$wrapper = b.find("[role=wrapper]"), this.$optionContainer = b.find("[role=options]"), this.$optionList = b.find("[role=options] ul")
        }

        function b(b, d, g) {
            function h(a) {
                var c = l.selectedItem;
                a !== c && (l.selectData(a), b.trigger("change", {
                    oldValue: c,
                    newValue: a
                }), b.trigger("select", a))
            }
            var i = b.data("fxUISelect");
            if ("string" == typeof d && !i) throw new Error("Select component not initialized!");
            if (i) return i.updateParams(d, g);
            var j = "." + Math.floor(Math.random() * new Date).toString(16),
                k = (d.optionHeight, c(b)),
                l = new a(b, k, d, j);
            k.data(f, l), b.data(f, l);
            var m, n = l.$optionContainer,
                o = l.$optionList,
                p = l.$selection;
            b.proxyEvent("select" + j, k), b.proxyEvent("change" + j, k);
            var q = !0;
            return p.on("click" + j, function(a) {
                return l.isDisabled() ? void 0 : (p.is(":focus") || p.focus(), q ? void(q = !1) : void l.toggle())
            }), p.on("focusout" + j, function() {
                q = !0, l.hide(), clearTimeout(m), clearInterval(m)
            }), p.on("focusin" + j, function() {
                l.isDisabled() || l.show()
            }), n.on("scroll" + j, function() {
                l.updateData()
            }), n.on("mousedown" + j, function(a) {
                a.stopPropagation()
            }), o.on("mousedown" + j, "li", function() {
                return !1
            }), o.on("click" + j, "li", function() {
                if (!l.isDisabled()) {
                    var a = $(this).data("value");
                    h(a), l.hide()
                }
            }), p.on("keydown" + j, function(a) {
                if (!l.isDisabled() && p.is(":focus")) {
                    var b = 0;
                    switch (a.keyCode) {
                        case 40:
                            b = 1;
                            break;
                        case 38:
                            b = -1;
                            break;
                        default:
                            return
                    }
                    l.selectAt(l.selectedIndex + b), clearTimeout(m), clearInterval(m), m = setTimeout(function() {
                        clearTimeout(m), m = setInterval(function() {
                            l.selectAt(l.selectedIndex + b)
                        }, 300)
                    }, 500)
                }
            }), $(document).on("keyup" + j, function(a) {
                13 === a.keyCode && l.hide(), clearTimeout(m), clearInterval(m)
            }), $(document).on("click" + j, function(a) {
                if (k.is(":focus")) {
                    var b = $(a.target),
                        c = b.parents("[role=" + e + "]"),
                        d = c.is(k);
                    d || p.focusout()
                }
            }), l.init(d), b
        }

        function c(a) {
            a.css("display", "none");
            var b = ['<div class="fx-ui-select" role="', e, '">', '<div class="fx-ui-select-selection" tabindex="0" role="selection"></div>', '<div class="fx-ui-select-options" role="options">', '<div role="wrapper">', "<ul></ul>", "</div>", "</div>", "</div>"].join(""),
                c = $(b);
            return a.after(c), c.append(a)
        }

        function d(a) {
            return a
        }
        var e = "selection_" + Date.now().toString(16),
            f = "fxUISelect",
            g = $(window),
            h = $.fn.val,
            i = $.fn.prop,
            j = {
                data: [],
                optionHeight: 26,
                optionListMaxHeight: 324,
                disabled: !1,
                render: d,
                selectionRender: d
            };
        $.fn.extend({
            val: function(a) {
                var b = this.data(f),
                    c = h.apply(this, arguments);
                return b ? 0 == arguments.length ? b.selectedItem : (b.selectData(a), this) : c
            },
            prop: function(a, b) {
                var c = this.data(f),
                    d = i.apply(this, arguments);
                return c ? 0 == arguments.length ? c.prop(a) : (c.prop(a, b), this) : d
            },
            proxyEvent: function(a, b) {
                return this.on(a, function(a, c) {
                    $(b).trigger(a, c)
                }), this
            },
            fxUISelect: function k(a) {
                var c = arguments,
                    d = this;
                return d.length > 1 ? d.map(function(a, b) {
                    return k.apply(d, c)
                }) : d.length ? ("string" == typeof a ? c = Array.prototype.slice.call(arguments, 1) : a = $.extend({}, j, a), b($(d), a, c)) : this
            }
        }), $.extend(a.prototype, {
            handlers: {
                destroy: function() {
                    var a = this.target,
                        b = this.$select;
                    a.off(this.eventId), a.removeData(f), b.before(a), b.remove(), $(document).off(this.eventId), clearInterval(this.positionTimmer)
                },
                disable: function() {
                    this.updateParams({
                        disabled: !0
                    })
                },
                enable: function() {
                    this.updateParams({
                        disabled: !1
                    })
                },
                value: function() {
                    return this.selectedItem
                }
            },
            init: function(a) {
                var b = this;
                this.positionTimmer = setInterval(function() {
                    b.toggleOptionContainer()
                }, 10), this.updateParams(a)
            },
            updateParams: function(a, b) {
                if (a) {
                    if ("string" == typeof a) {
                        var c = this.handlers[a];
                        if (!c) throw new Error("method not found:" + a);
                        return c.apply(this, b)
                    }
                    var e = this.target,
                        f = this.params;
                    if (a.data) {
                        f.data = a.data, this.updateData();
                        var g = f.defaultValue,
                            h = this.selectedItem;
                        void 0 !== h && (g = h), (void 0 === g || -1 == a.data.indexOf(g)) && (g = a.data[0]), void 0 != g && this.selectData(g)
                    }
                    return void 0 !== a.disabled && e.prop("disabled", !!a.disabled), $.isFunction(a.render) && (f.render = a.render, f.selectionRender === d && (f.selectionRender = a.render)), $.isFunction(a.selectionRender) && (f.selectionRender = a.selectionRender), "number" == typeof a.optionListMaxHeight && (f.optionListMaxHeight = a.optionListMaxHeight, this.$optionContainer.css({
                        maxHeight: a.optionListMaxHeight
                    })), "number" == typeof a.optionHeight && f.optionHeight !== a.optionHeight && (f.optionHeight = a.optionHeight, this.updateData()), e
                }
            },
            updateData: function() {
                var a = this.params,
                    b = a.data || [],
                    c = a.render,
                    d = a.optionHeight,
                    e = (this.$select, this.$wrapper),
                    f = this.$optionList,
                    g = this.$optionContainer,
                    h = b ? b.length : 0,
                    i = d + 1;
                if (e.css("height", h * i), f.empty(), h)
                    for (var j = g.scrollTop(), k = Math.max(0, Math.floor(j / i - 1)), l = Math.min(h, k + Math.ceil(a.optionListMaxHeight / i) + 2), m = k; l > m; m++) {
                        var n = $("<li>" + c(b[m]) + "</li>");
                        n.css({
                            top: m * i,
                            height: d - 2,
                            lineHeight: d - 2 + "px"
                        }), n.data("value", b[m]), n.attr({
                            index: m,
                            tabindex: m + 1
                        }), m === this.selectedIndex && n.addClass("hover"), f.append(n)
                    }
            },
            selectData: function(a) {
                var b = this.params,
                    c = b.data.indexOf(a);
                return -1 != c ? this.selectAt(c) : void 0
            },
            selectAt: function(a) {
                var b = this.params,
                    c = b.data || [];
                if (0 > a || a >= c.length) return !1;
                var d = this.$optionContainer,
                    e = this.$optionList;
                e.find(".hover").removeClass("hover");
                var f = b.data[a],
                    g = b.selectionRender;
                this.selectedItem = f;
                var h = this.selectedIndex;
                this.selectedIndex = a, this.$selection.html(g(f));
                var i = this.$optionList.find("[index=" + a + "]"),
                    j = (d.scrollTop(), this.params.optionHeight + 1),
                    k = Math.floor(b.optionListMaxHeight / j);
                if (1 !== i.length && (a > h ? d.scrollTop((a - k + 1) * j) : d.scrollTop(a * j), i = e.find("[index=" + a + "]")), 0 !== i.length) {
                    var l = i.offset().top,
                        m = d.offset().top,
                        n = m + d.height();
                    return m > l ? d.scrollTop(a * j) : l > n - j + 1 && d.scrollTop((a - k + 1) * j), i.addClass("hover"), !0
                }
            },
            toggleOptionContainer: function() {
                function a() {
                    d.css({
                        top: h
                    })
                }

                function b() {
                    d.css({
                        top: e.top - f
                    })
                }
                if (this.isOpened()) {
                    var c = this.$select,
                        d = this.$optionContainer,
                        e = c.offset();
                    d.css({
                        width: c.width(),
                        left: e.left
                    });
                    var f = d.outerHeight(),
                        h = e.top + c.height(),
                        i = h + f,
                        j = e.top - f,
                        k = j,
                        l = g.height() - i;
                    l > 0 || l > k ? a() : b()
                }
            },
            prop: function(a, b) {
                if (1 === arguments.length) return this.props[a];
                this.props[a] = b;
                var c = this.$select;
                switch (a) {
                    case "disabled":
                        b ? c.addClass("disabled") : c.removeClass("disabled")
                }
            },
            show: function() {
                this.$select.addClass("open"), this.toggleOptionContainer()
            },
            hide: function() {
                this.$select.removeClass("open")
            },
            toggle: function() {
                this.$select.toggleClass("open"), this.isOpened() && this.toggleOptionContainer()
            },
            isOpened: function() {
                return this.$select.hasClass("open")
            },
            isDisabled: function() {
                return this.$select.hasClass("disabled")
            }
        })
    }(), ! function(a) {
        "use strict";

        function b(a) {
            return function(b) {
                return this === b.target ? a.apply(this, arguments) : void 0
            }
        }
        var c = function(a, b) {
            this.init(a, b)
        };
        c.prototype = {
            constructor: c,
            init: function(b, c) {
                if (this.$element = a(b), this.options = a.extend({}, a.fn.webPDFModalManager.defaults, this.$element.data(), "object" == typeof c && c), this.stack = [], this.backdropCount = 0, this.options.resize) {
                    var d, e = this;
                    a(window).on("resize.webpdf-modal", function() {
                        d && clearTimeout(d), d = setTimeout(function() {
                            for (var a = 0; a < e.stack.length; a++) e.stack[a].isShown && e.stack[a].layout()
                        }, 10)
                    })
                }
            },
            createModal: function(b, c) {
                a(b).webpdf - modal(a.extend({
                    manager: this
                }, c))
            },
            appendModal: function(c) {
                this.stack.push(c);
                var d = this;
                c.$element.on("show.webpdf-modalmanager", b(function(b) {
                    var e = function() {
                        c.isShown = !0;
                        var b = !1;
                        d.$element.toggleClass("fwr-modal-open", d.hasOpenModal()).toggleClass("fwr-page-overflow", a(window).height() < d.$element.height()), c.$parent = c.$element.parent(), c.$container = d.createContainer(c), c.$element.appendTo(c.$container), d.backdrop(c, function() {
                            c.$element.show(), b && c.$element[0].offsetWidth, c.layout(), c.$element.addClass("fwr-in").attr("aria-hidden", !1);
                            var a = function() {
                                d.setFocus(), c.$element.trigger("shown")
                            };
                            a()
                        })
                    };
                    c.options.replace ? d.replace(e) : e()
                })), c.$element.on("hidden.webpdf-modalmanager", b(function(a) {
                    if (d.backdrop(c), c.$element.parent().length)
                        if (c.$backdrop) {
                            var b = !1;
                            b && c.$element[0].offsetWidth, c.destroy()
                        } else c.destroy();
                    else d.destroyModal(c)
                })), c.$element.on("destroyed.webpdf-modalmanager", b(function(a) {
                    d.destroyModal(c)
                }))
            },
            getOpenModals: function() {
                for (var a = [], b = 0; b < this.stack.length; b++) this.stack[b].isShown && a.push(this.stack[b]);
                return a
            },
            hasOpenModal: function() {
                return this.getOpenModals().length > 0
            },
            setFocus: function() {
                for (var a, b = 0; b < this.stack.length; b++) this.stack[b].isShown && (a = this.stack[b]);
                a && a.focus()
            },
            destroyModal: function(a) {
                a.$element.off(".webpdf-modalmanager"), a.$backdrop && this.removeBackdrop(a), this.stack.splice(this.getIndexOfModal(a), 1);
                var b = this.hasOpenModal();
                this.$element.toggleClass("fwr-modal-open", b), b || this.$element.removeClass("fwr-page-overflow"), this.removeContainer(a), this.setFocus()
            },
            getModalAt: function(a) {
                return this.stack[a]
            },
            getIndexOfModal: function(a) {
                for (var b = 0; b < this.stack.length; b++)
                    if (a === this.stack[b]) return b
            },
            replace: function(c) {
                for (var d, e = 0; e < this.stack.length; e++) this.stack[e].isShown && (d = this.stack[e]);
                d ? (this.$backdropHandle = d.$backdrop, d.$backdrop = null, c && d.$element.one("hidden", b(a.proxy(c, this))), d.hide()) : c && c()
            },
            removeBackdrop: function(a) {
                a.$backdrop.remove(), a.$backdrop = null
            },
            createBackdrop: function(b, c) {
                var d;
                return this.$backdropHandle ? (d = this.$backdropHandle, d.off(".webpdf-modalmanager"), this.$backdropHandle = null, this.isLoading && this.removeSpinner()) : d = a(c).addClass(b).appendTo(this.$element), d
            },
            removeContainer: function(a) {
                a.$container.remove(), a.$container = null
            },
            createContainer: function(c) {
                var e;
                return e = a('<div class="fwr-modal-scrollable">').css("z-index", d("fwr-modal", this.getOpenModals().length)).appendTo(this.$element), c && "static" != c.options.backdrop ? e.on("click.webpdf-modal", b(function(a) {
                    c.hide()
                })) : c && e.on("click.webpdf-modal", b(function(a) {
                    c.attention()
                })), e
            },
            backdrop: function(a, b) {
                var c = a.$element.hasClass("fwr-fade") ? "fwr-fade" : "",
                    e = a.options.backdrop && this.backdropCount < this.options.backdropLimit;
                if (a.isShown && e) {
                    var f = !1;
                    a.$backdrop = this.createBackdrop(c, a.options.backdropTemplate), a.$backdrop.css("z-index", d("backdrop", this.getOpenModals().length)), f && a.$backdrop[0].offsetWidth, a.$backdrop.addClass("fwr-in"), this.backdropCount += 1, b()
                } else if (!a.isShown && a.$backdrop) {
                    a.$backdrop.removeClass("fwr-in"), this.backdropCount -= 1;
                    var g = this;
                    g.removeBackdrop(a)
                } else b && b()
            },
            removeSpinner: function() {
                this.$spinner && this.$spinner.remove(), this.$spinner = null, this.isLoading = !1
            },
            removeLoading: function() {
                this.$backdropHandle && this.$backdropHandle.remove(), this.$backdropHandle = null, this.removeSpinner()
            },
            loading: function(b) {
                if (b = b || function() {}, this.$element.toggleClass("fwr-modal-open", !this.isLoading || this.hasOpenModal()).toggleClass("fwr-page-overflow", a(window).height() < this.$element.height()), this.isLoading)
                    if (this.isLoading && this.$backdropHandle) {
                        this.$backdropHandle.removeClass("fwr-in");
                        var c = this;
                        a.support.transition ? this.$backdropHandle.one(a.support.transition.end, function() {
                            c.removeLoading()
                        }) : c.removeLoading()
                    } else b && b(this.isLoading);
                else {
                    this.$backdropHandle = this.createBackdrop("fwr-fade", this.options.backdropTemplate), this.$backdropHandle[0].offsetWidth;
                    var e = this.getOpenModals();
                    this.$backdropHandle.css("z-index", d("backdrop", e.length + 1)).addClass("fwr-in");
                    var f = a(this.options.spinner).css("z-index", d("fwr-modal", e.length + 1)).appendTo(this.$element).addClass("fwr-in");
                    this.$spinner = a(this.createContainer()).append(f).on("click.webpdf-modalmanager", a.proxy(this.loading, this)), this.isLoading = !0, a.support.transition ? this.$backdropHandle.one(a.support.transition.end, b) : b()
                }
            }
        };
        var d = function() {
            var b, c = {};
            return function(d, e) {
                if ("undefined" == typeof b) {
                    var f = a('<div class="fwr-modal fwr-hide" />').appendTo("body"),
                        g = a('<div class="fwr-modal-backdrop hide" />').appendTo("body");
                    c["fwr-modal"] = +f.css("z-index"), c.backdrop = +g.css("z-index"), b = c["fwr-modal"] - c.backdrop, f.remove(), g.remove(), g = f = null
                }
                return c[d] + b * e
            }
        }();
        a.fn.webPDFModalManager = function(b, d) {
            return this.each(function() {
                var e = a(this),
                    f = e.data("webpdf-modal-manager");
                f || e.data("webpdf-modal-manager", f = new c(this, b)), "string" == typeof b && f[b].apply(f, [].concat(d))
            })
        }, a.fn.webPDFModalManager.defaults = {
            backdropLimit: 999,
            resize: !0,
            spinner: '<div class="fwr-loading-spinner fwr-fade" style="width: 200px; margin-left: -100px;"><div class="fwr-progress fwr-progress-striped fwr-active"><div class="fwr-bar" style="width: 100%;"></div></div></div>',
            backdropTemplate: '<div class="fwr-modal-backdrop" />'
        }, a.fn.webPDFModalManager.Constructor = c, a(function() {
            a(document).off("show.bs.webpdf-modal").off("hidden.bs.webpdf-modal")
        })
    }(jQuery), ! function(a) {
        "use strict";
        var b = function(a, b) {
            this.init(a, b)
        };
        b.prototype = {
            constructor: b,
            init: function(b, c) {
                var d = this;
                this.options = c, this.$element = a(b).delegate('[webpdf-data-dismiss="modal"]', "click.dismiss.webpdf-modal", a.proxy(this.hide, this)), this.options.remote && this.$element.find(".fwr-modal-body").load(this.options.remote, function() {
                    var b = a.Event("loaded");
                    d.$element.trigger(b)
                });
                var e = "function" == typeof this.options.manager ? this.options.manager.call(this) : this.options.manager;
                e = e.appendModal ? e : a(e).webPDFModalManager().data("webpdf-modal-manager"), e.appendModal(this)
            },
            toggle: function() {
                return this[this.isShown ? "hide" : "show"]()
            },
            show: function() {
                var b = a.Event("show");
                this.isShown || (this.$element.trigger(b), b.isDefaultPrevented() || (this.escape(), this.tab(), this.options.loading && this.loading()))
            },
            hide: function(b) {
                b && b.preventDefault(), b = a.Event("hide"), this.$element.trigger(b), this.isShown && !b.isDefaultPrevented() && (this.isShown = !1, this.escape(), this.tab(), this.isLoading && this.loading(), a(document).off("focusin.webpdf-modal"), this.$element.removeClass("fwr-in").removeClass(this.options.attentionAnimation).removeClass("fwr-modal-overflow").attr("aria-hidden", !0), a.support.transition && this.$element.hasClass("fwr-fade") ? this.hideWithTransition() : this.hideModal())
            },
            layout: function() {
                var b = this.options.height ? "height" : "max-height",
                    c = this.options.height || this.options.maxHeight;
                if (this.options.width) {
                    this.$element.css("width", this.options.width);
                    var d = this;
                    this.$element.css("margin-left", function() {
                        return /%/gi.test(d.options.width) ? -(parseInt(d.options.width) / 2) + "%" : -(a(this).width() / 2) + "px"
                    })
                } else this.$element.css("width", ""), this.$element.css("margin-left", "");
                this.$element.find(".fwr-modal-body").css("overflow", "").css(b, ""), c && this.$element.find(".fwr-modal-body").css("overflow", "auto").css(b, c);
                var e = a(window).height() - 10 < this.$element.height();
                e || this.options.webpdf - e ? this.$element.css("margin-top", 0).addClass("fwr-modal-overflow") : this.$element.css("margin-top", 0 - this.$element.height() / 2).removeClass("fwr-modal-overflow")
            },
            tab: function() {
                var b = this;
                this.isShown && this.options.consumeTab ? this.$element.on("keydown.tabindex.webpdf-modal", "[webpdf-data-tabindex]", function(c) {
                    if (c.keyCode && 9 == c.keyCode) {
                        var d = a(this),
                            e = a(this);
                        b.$element.find("[webpdf-data-tabindex]:enabled:not([readonly])").each(function(b) {
                            d = b.shiftKey ? d.data("tabindex") > a(this).data("tabindex") ? d = a(this) : e = a(this) : d.data("tabindex") < a(this).data("tabindex") ? d = a(this) : e = a(this)
                        }), d[0] !== a(this)[0] ? d.focus() : e.focus(), c.preventDefault()
                    }
                }) : this.isShown || this.$element.off("keydown.tabindex.webpdf-modal")
            },
            escape: function() {
                var a = this;
                this.isShown && this.options.keyboard ? (this.$element.attr("tabindex") || this.$element.attr("tabindex", -1), this.$element.on("keyup.dismiss.webpdf-modal", function(b) {
                    27 == b.which && a.hide()
                })) : this.isShown || this.$element.off("keyup.dismiss.webpdf-modal")
            },
            hideWithTransition: function() {
                var b = this,
                    c = setTimeout(function() {
                        b.$element.off(a.support.transition.end), b.hideModal()
                    }, 500);
                this.$element.one(a.support.transition.end, function() {
                    clearTimeout(c), b.hideModal()
                })
            },
            hideModal: function() {
                var a = this.options.height ? "height" : "max-height",
                    b = this.options.height || this.options.maxHeight;
                b && this.$element.find(".fwr-modal-body").css("overflow", "").css(a, ""), this.$element.hide().trigger("hidden")
            },
            removeLoading: function() {
                this.$loading.remove(), this.$loading = null, this.isLoading = !1
            },
            loading: function(b) {
                b = b || function() {};
                var c = this.$element.hasClass("fwr-fade") ? "fwr-fade" : "";
                if (this.isLoading)
                    if (this.isLoading && this.$loading) {
                        this.$loading.removeClass("fwr-in");
                        var d = this;
                        a.support.transition && this.$element.hasClass("fwr-fade") ? this.$loading.one(a.support.transition.end, function() {
                            d.removeLoading()
                        }) : d.removeLoading()
                    } else b && b(this.isLoading);
                else {
                    var e = a.support.transition && c;
                    this.$loading = a('<div class="fwr-loading-mask ' + c + '">').append(this.options.spinner).appendTo(this.$element), e && this.$loading[0].offsetWidth, this.$loading.addClass("fwr-in"), this.isLoading = !0, e ? this.$loading.one(a.support.transition.end, b) : b()
                }
            },
            focus: function() {
                var a = this.$element.find(this.options.focusOn);
                a = a.length ? a : this.$element, a.focus()
            },
            attention: function() {
                if (this.options.attentionAnimation) {
                    this.$element.removeClass(this.options.attentionAnimation);
                    var a = this;
                    setTimeout(function() {
                        a.$element.addClass(a.options.attentionAnimation)
                    }, 0)
                }
                this.focus()
            },
            destroy: function() {
                var b = a.Event("destroy");
                if (this.$element.trigger(b), !b.isDefaultPrevented()) {
                    if (this.$element.off(".webpdf-modal").removeData("fwr-modal").removeClass("fwr-in").attr("aria-hidden", !0), this.$parent && this.$parent !== this.$element.parent()) this.$element.appendTo(this.$parent);
                    else if (!this.$parent || !this.$parent.length) return this.$element.remove(), void(this.$element = null);
                    this.$element.trigger("destroyed")
                }
            }
        }, a.fn.webPDFModal = function(c, d) {
            return this.each(function() {
                var e = a(this),
                    f = e.data("fwr-modal"),
                    g = a.extend({}, a.fn.webPDFModal.defaults, e.data(), "object" == typeof c && c);
                f || e.data("fwr-modal", f = new b(this, g)), "string" == typeof c ? f[c].apply(f, [].concat(d)) : g.show && f.show()
            })
        }, a.fn.webPDFModal.defaults = {
            keyboard: !0,
            backdrop: !0,
            loading: !1,
            show: !0,
            width: null,
            height: null,
            maxHeight: null,
            modalOverflow: !1,
            consumeTab: !0,
            focusOn: null,
            replace: !1,
            resize: !1,
            attentionAnimation: "shake",
            manager: "body",
            spinner: '<div class="fwr-loading-spinner" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',
            backdropTemplate: '<div class="fwr-modal-backdrop" />'
        }, a.fn.webPDFModal.Constructor = b, a(function() {
            a(document).off("click.webpdf-modal").on("click.webpdf-modal.data-api", '[data-toggle="modal"]', function(b) {
                var c = a(this),
                    d = c.attr("href"),
                    e = a(c.attr("data-target") || d && d.replace(/.*(?=#[^\s]+$)/, "")),
                    f = e.data("fwr-modal") ? "toggle" : a.extend({
                        remote: !/#/.test(d) && d
                    }, e.data(), c.data());
                b.preventDefault(), e.webPDFModal(f).one("hide", function() {
                    c.focus()
                })
            })
        })
    }(window.jQuery),
    function() {
        function a(a, b) {
            if (!b || "function" == typeof b) return a;
            for (var c in b) a[c] = b[c];
            return a
        }

        function b(a, b, c) {
            var d, e = 0,
                f = a.length,
                g = void 0 === f || "function" == typeof a;
            if (c)
                if (g) {
                    for (d in a)
                        if (b.apply(a[d], c) === !1) break
                } else
                    for (; f > e && b.apply(a[e++], c) !== !1;);
            else if (g) {
                for (d in a)
                    if (b.call(a[d], d, a[d]) === !1) break
            } else
                for (; f > e && b.call(a[e], e, a[e++]) !== !1;);
            return a
        }

        function c(a) {
            var b = function(a) {
                    if (window.XMLHttpRequest) return a(null, new XMLHttpRequest);
                    if (window.ActiveXObject) try {
                        return a(null, new ActiveXObject("Msxml2.XMLHTTP"))
                    } catch (b) {
                        return a(null, new ActiveXObject("Microsoft.XMLHTTP"))
                    }
                    return a(new Error)
                },
                c = function(a) {
                    if ("string" == typeof a) return a;
                    var b = [];
                    for (var c in a) a.hasOwnProperty(c) && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                    return b.join("&")
                },
                d = function(a) {
                    a = a.replace(/\r\n/g, "\n");
                    for (var b = "", c = 0; c < a.length; c++) {
                        var d = a.charCodeAt(c);
                        128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192), b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224), b += String.fromCharCode(d >> 6 & 63 | 128), b += String.fromCharCode(63 & d | 128))
                    }
                    return b
                },
                e = function(a) {
                    var b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                    a = d(a);
                    var c, e, f, g, h, i, j, k = "",
                        l = 0;
                    do c = a.charCodeAt(l++), e = a.charCodeAt(l++), f = a.charCodeAt(l++), g = c >> 2, h = (3 & c) << 4 | e >> 4, i = (15 & e) << 2 | f >> 6, j = 63 & f, isNaN(e) ? i = j = 64 : isNaN(f) && (j = 64), k += b.charAt(g) + b.charAt(h) + b.charAt(i) + b.charAt(j), c = e = f = "", g = h = i = j = ""; while (l < a.length);
                    return k
                },
                f = function() {
                    for (var a = arguments[0], b = 1; b < arguments.length; b++) {
                        var c = arguments[b];
                        for (var d in c) c.hasOwnProperty(d) && (a[d] = c[d])
                    }
                    return a
                },
                g = function(a, d, e, h) {
                    "function" == typeof e && (h = e, e = {}), e.cache = e.cache || !1, e.data = e.data || {}, e.headers = e.headers || {}, e.jsonp = e.jsonp || !1, e.async = void 0 === e.async ? !0 : e.async;
                    var i, j = f({
                        accept: "*/*",
                        "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
                    }, g.headers, e.headers);
                    if (i = "application/json" === j["content-type"] ? JSON.stringify(e.data) : c(e.data), "GET" === a) {
                        var k = [];
                        if (i && (k.push(i), i = null), e.cache || k.push("_=" + (new Date).getTime()), e.jsonp && (k.push("callback=" + e.jsonp), k.push("jsonp=" + e.jsonp)), k = k.join("&"), k.length > 1 && (d += d.indexOf("?") > -1 ? "&" + k : "?" + k), e.jsonp) {
                            var l = document.getElementsByTagName("head")[0],
                                m = document.createElement("script");
                            return m.type = "text/javascript", m.src = d, l.appendChild(m), void 0
                        }
                    }
                    b(function(b, c) {
                        if (b) return h(b);
                        c.open(a, d, e.async);
                        for (var f in j) j.hasOwnProperty(f) && c.setRequestHeader(f, j[f]);
                        c.onreadystatechange = function() {
                            if (4 === c.readyState) {
                                var a = c.responseText || "";
                                if (!h) return;
                                h(c.status, {
                                    text: function() {
                                        return a
                                    },
                                    json: function() {
                                        return JSON.parse(a)
                                    }
                                })
                            }
                        }, c.send(i)
                    })
                },
                h = {
                    authBasic: function(a, b) {
                        g.headers.Authorization = "Basic " + e(a + ":" + b)
                    },
                    connect: function(a, b, c) {
                        return g("CONNECT", a, b, c)
                    },
                    del: function(a, b, c) {
                        return g("DELETE", a, b, c)
                    },
                    get: function(a, b, c) {
                        return g("GET", a, b, c)
                    },
                    head: function(a, b, c) {
                        return g("HEAD", a, b, c)
                    },
                    headers: function(a) {
                        g.headers = a || {}
                    },
                    isAllowed: function(a, b, c) {
                        this.options(a, function(a, d) {
                            c(-1 !== d.text().indexOf(b))
                        })
                    },
                    options: function(a, b, c) {
                        return g("OPTIONS", a, b, c)
                    },
                    patch: function(a, b, c) {
                        return g("PATCH", a, b, c)
                    },
                    post: function(a, b, c) {
                        return g("POST", a, b, c)
                    },
                    put: function(a, b, c) {
                        return g("PUT", a, b, c)
                    },
                    trace: function(a, b, c) {
                        return g("TRACE", a, b, c)
                    }
                },
                i = a.type ? a.type.toLowerCase() : "get";
            h[i](a.url, a, function(b, c) {
                200 === b ? a.success(c.json(), b, null) : a.error(c.text(), b, null)
            })
        }

        function d(a, b) {
            "function" == typeof a && (b = a, a = {}), a = a || {}, E.extend(B, a), "string" == typeof B.ns && (B.ns = {
                namespaces: [B.ns],
                defaultNs: B.ns
            }), B.interpolationPrefixEscaped = E.regexEscape(B.interpolationPrefix), B.interpolationSuffixEscaped = E.regexEscape(B.interpolationSuffix), B.lng || (B.lng = E.detectLanguage()), B.lng ? B.useCookie && E.cookie.create(B.cookieName, B.lng, B.cookieExpirationTime) : (B.lng = B.fallbackLng, B.useCookie && E.cookie.remove(B.cookieName)), A = E.toLanguages(B.lng), u = A[0], E.log("currentLng set to: " + u), G.setCurrentLng(u), w && B.setJqueryExt && m();
            var c;
            w && w.Deferred && (c = w.Deferred()); {
                if (!B.resStore) {
                    var d = E.toLanguages(B.lng);
                    "string" == typeof B.preload && (B.preload = [B.preload]);
                    for (var e = 0, f = B.preload.length; f > e; e++)
                        for (var g = E.toLanguages(B.preload[e]), h = 0, i = g.length; i > h; h++) d.indexOf(g[h]) < 0 && d.push(g[h]);
                    return x.sync.load(d, B, function(a, d) {
                        y = d, b && b(r), c && c.resolve()
                    }), c ? c.promise() : void 0
                }
                if (y = B.resStore, b && b(r), c && c.resolve(), c) return c.promise()
            }
        }

        function e(a, b) {
            "string" == typeof a && (a = [a]);
            for (var c = 0, e = a.length; e > c; c++) B.preload.indexOf(a[c]) < 0 && B.preload.push(a[c]);
            return d(b)
        }

        function f(a, b, c) {
            "string" != typeof b && (c = b, b = B.ns.defaultNs), y[a] = y[a] || {}, y[a][b] = y[a][b] || {}, E.extend(y[a][b], c)
        }

        function g(a) {
            B.ns.defaultNs = a
        }

        function h(a, b) {
            i([a], b)
        }

        function i(a, b) {
            var c = {
                    dynamicLoad: B.dynamicLoad,
                    resGetPath: B.resGetPath,
                    getAsync: B.getAsync,
                    ns: {
                        namespaces: a,
                        defaultNs: ""
                    }
                },
                d = E.toLanguages(B.lng);
            "string" == typeof B.preload && (B.preload = [B.preload]);
            for (var e = 0, f = B.preload.length; f > e; e++)
                for (var g = E.toLanguages(B.preload[e]), h = 0, i = g.length; i > h; h++) d.indexOf(g[h]) < 0 && d.push(g[h]);
            for (var j = [], k = 0, l = d.length; l > k; k++) {
                var m = !1,
                    n = y[d[k]];
                if (n)
                    for (var o = 0, p = a.length; p > o; o++) n[a[o]] || (m = !0);
                else m = !0;
                m && j.push(d[k])
            }
            j.length ? x.sync._fetch(j, c, function(c, d) {
                var e = a.length * j.length;
                E.each(a, function(a, c) {
                    E.each(j, function(a, f) {
                        y[f] = y[f] || {}, y[f][c] = d[f][c], e--, 0 === e && b && (B.useLocalStorage && x.sync._storeLocal(y), b())
                    })
                })
            }) : b && b()
        }

        function j(a, b) {
            return d({
                lng: a
            }, b)
        }

        function l() {
            return u
        }

        function m() {
            function a(a, b, c) {
                if (0 !== b.length) {
                    var d = "text";
                    if (0 === b.indexOf("[")) {
                        var e = b.split("]");
                        b = e[1], d = e[0].substr(1, e[0].length - 1)
                    }
                    b.indexOf(";") === b.length - 1 && (b = b.substr(0, b.length - 2));
                    var f;
                    "html" === d ? (f = B.defaultValueFromContent ? w.extend({
                        defaultValue: a.html()
                    }, c) : c, a.html(w.t(b, f))) : "text" === d ? (f = B.defaultValueFromContent ? w.extend({
                        defaultValue: a.text()
                    }, c) : c, a.text(w.t(b, f))) : (f = B.defaultValueFromContent ? w.extend({
                        defaultValue: a.attr(d)
                    }, c) : c, a.attr(d, w.t(b, f)))
                }
            }

            function b(b, c) {
                var d = b.attr(B.selectorAttr);
                if (d) {
                    var e = b,
                        f = b.data("i18n-target");
                    if (f && (e = b.find(f) || b), !c && B.useDataAttrOptions === !0 && (c = b.data("i18n-options")), c = c || {}, d.indexOf(";") <= d.length - 1) {
                        var g = d.split(";");
                        w.each(g, function(b, d) {
                            a(e, d, c)
                        })
                    } else a(e, k, c);
                    B.useDataAttrOptions === !0 && b.data("i18n-options", c)
                }
            }
            w.t = w.t || r, w.fn.i18n = function(a) {
                return this.each(function() {
                    b(w(this), a);
                    var c = w(this).find("[" + B.selectorAttr + "]");
                    c.each(function() {
                        b(w(this), a)
                    })
                })
            }
        }

        function n(a, b, c, d) {
            if (d = d || b, a.indexOf(d.interpolationPrefix || B.interpolationPrefix) < 0) return a;
            var e = d.interpolationPrefix ? E.regexEscape(d.interpolationPrefix) : B.interpolationPrefixEscaped,
                f = d.interpolationSuffix ? E.regexEscape(d.interpolationSuffix) : B.interpolationSuffixEscaped;
            return E.each(b, function(b, g) {
                a = "object" == typeof g && null !== g ? n(a, g, c ? c + B.keyseparator + b : b, d) : a.replace(new RegExp([e, c ? c + B.keyseparator + b : b, f].join(""), "g"), g)
            }), a
        }

        function o(a, b) {
            var c = ",",
                d = "{",
                e = "}",
                f = E.extend({}, b);
            for (delete f.postProcess; - 1 != a.indexOf(B.reusePrefix) && (z++, !(z > B.maxRecursion));) {
                var g = a.indexOf(B.reusePrefix),
                    h = a.indexOf(B.reuseSuffix, g) + B.reuseSuffix.length,
                    i = a.substring(g, h),
                    j = i.replace(B.reusePrefix, "").replace(B.reuseSuffix, "");
                if (-1 != j.indexOf(c)) {
                    var k = j.indexOf(c);
                    if (-1 != j.indexOf(d, k) && -1 != j.indexOf(e, k)) {
                        var l = j.indexOf(d, k),
                            m = j.indexOf(e, l) + e.length;
                        try {
                            f = E.extend(f, JSON.parse(j.substring(l, m))), j = j.substring(0, k)
                        } catch (n) {}
                    }
                }
                var o = s(j, f);
                a = a.replace(i, o)
            }
            return a
        }

        function p(a) {
            return a.context && "string" == typeof a.context
        }

        function q(a) {
            return void 0 !== a.count && "string" != typeof a.count && 1 !== a.count
        }

        function r(a, b) {
            return z = 0, s(a, b)
        }

        function s(a, b) {
            if (b = b || {}, !y) return e;
            var c, d, e = b.defaultValue || a,
                f = A;
            if (b.lng && (f = E.toLanguages(b.lng), !y[f[0]])) {
                var g = B.getAsync;
                B.getAsync = !1, x.sync.load(f, B, function(a, b) {
                    E.extend(y, b), B.getAsync = g
                })
            }
            var h = b.ns || B.ns.defaultNs;
            if (a.indexOf(B.nsseparator) > -1) {
                var i = a.split(B.nsseparator);
                h = i[0], a = i[1]
            }
            if (p(b)) {
                c = E.extend({}, b), delete c.context, c.defaultValue = B.contextNotFound;
                var j = h + B.nsseparator + a + "_" + b.context;
                if (d = r(j, c), d != B.contextNotFound) return n(d, {
                    context: b.context
                })
            }
            if (q(b)) {
                c = E.extend({}, b), delete c.count, c.defaultValue = B.pluralNotFound;
                var k = h + B.nsseparator + a + B.pluralSuffix,
                    l = G.get(u, b.count);
                if (l >= 0 ? k = k + "_" + l : 1 === l && (k = h + B.nsseparator + a), d = r(k, c), d != B.pluralNotFound) return n(d, {
                    count: b.count
                })
            }
            for (var m, t = a.split(B.keyseparator), v = 0, w = f.length; w > v && !m; v++) {
                for (var z = f[v], C = 0, D = y[z] && y[z][h]; t[C];) D = D && D[t[C]], C++;
                if (void 0 !== D) {
                    if ("string" == typeof D) D = n(D, b), D = o(D, b);
                    else if ("[object Array]" !== Object.prototype.toString.apply(D) || B.returnObjectTrees || b.returnObjectTrees)
                        if (B.returnObjectTrees || b.returnObjectTrees) {
                            var I = {};
                            for (var J in D) I[J] = s(h + B.nsseparator + a + B.keyseparator + J, b);
                            D = I
                        } else D = "key '" + h + ":" + a + " (" + z + ")' returned a object instead of string.", E.log(D);
                    else D = D.join("\n"), D = n(D, b), D = o(D, b);
                    m = D
                }
            }
            void 0 === m && B.fallbackToDefaultNS && (m = s(a, b)), void 0 === m && B.sendMissing && (b.lng ? F.postMissing(f[0], h, a, e, f) : F.postMissing(B.lng, h, a, e, f));
            var K = b.postProcess || B.postProcess;
            return void 0 !== m && K && H[K] && (m = H[K](m, a, b)), void 0 === m && (e = n(e, b), e = o(e, b)), void 0 !== m ? m : e
        }

        function t() {
            var a, b = [];
            if ("undefined" != typeof window && (function() {
                    for (var a = window.location.search.substring(1), c = a.split("&"), d = 0; d < c.length; d++) {
                        var e = c[d].indexOf("=");
                        if (e > 0) {
                            var f = c[d].substring(0, e),
                                g = c[d].substring(e + 1);
                            b[f] = g
                        }
                    }
                }(), b[B.detectLngQS] && (a = b[B.detectLngQS])), !a && "undefined" != typeof document && B.useCookie) {
                var c = E.cookie.read(B.cookieName);
                c && (a = c)
            }
            return !a && "undefined" != typeof navigator && (a = navigator.language ? navigator.language : navigator.userLanguage), a
        }
        Array.prototype.indexOf || (Array.prototype.indexOf = function(a) {
            "use strict";
            if (null == this) throw new TypeError;
            var b = Object(this),
                c = b.length >>> 0;
            if (0 === c) return -1;
            var d = 0;
            if (arguments.length > 0 && (d = Number(arguments[1]), d != d ? d = 0 : 0 != d && d != 1 / 0 && d != -(1 / 0) && (d = (d > 0 || -1) * Math.floor(Math.abs(d)))), d >= c) return -1;
            for (var e = d >= 0 ? d : Math.max(c - Math.abs(d), 0); c > e; e++)
                if (e in b && b[e] === a) return e;
            return -1
        });
        var u, v = this,
            w = v.jQuery,
            x = {},
            y = {},
            z = 0,
            A = [];
        "undefined" != typeof module && module.exports ? module.exports = x : (w && (w.i18n = w.i18n || x), v.i18n = v.i18n || x);
        var B = {
                lng: void 0,
                load: "all",
                preload: [],
                lowerCaseLng: !1,
                returnObjectTrees: !1,
                fallbackLng: "dev",
                detectLngQS: "setLng",
                ns: "translation",
                fallbackToDefaultNS: !1,
                nsseparator: ":",
                keyseparator: ".",
                selectorAttr: "data-i18n",
                debug: !1,
                resGetPath: "locales/__lng__/__ns__.json",
                resPostPath: "locales/add/__lng__/__ns__",
                getAsync: !0,
                postAsync: !0,
                resStore: void 0,
                useLocalStorage: !1,
                localStorageExpirationTime: 6048e5,
                dynamicLoad: !1,
                sendMissing: !1,
                sendMissingTo: "fallback",
                sendType: "POST",
                interpolationPrefix: "__",
                interpolationSuffix: "__",
                reusePrefix: "$t(",
                reuseSuffix: ")",
                pluralSuffix: "_plural",
                pluralNotFound: ["plural_not_found", Math.random()].join(""),
                contextNotFound: ["context_not_found", Math.random()].join(""),
                setJqueryExt: !0,
                defaultValueFromContent: !0,
                useDataAttrOptions: !1,
                cookieExpirationTime: void 0,
                useCookie: !0,
                cookieName: "i18next",
                postProcess: void 0
            },
            C = {
                create: function(a, b, c) {
                    var d;
                    if (c) {
                        var e = new Date;
                        e.setTime(e.getTime() + 60 * c * 1e3), d = "; expires=" + e.toGMTString()
                    } else d = "";
                    document.cookie = a + "=" + b + d + "; path=/"
                },
                read: function(a) {
                    for (var b = a + "=", c = document.cookie.split(";"), d = 0; d < c.length; d++) {
                        for (var e = c[d];
                            " " == e.charAt(0);) e = e.substring(1, e.length);
                        if (0 === e.indexOf(b)) return e.substring(b.length, e.length)
                    }
                    return null
                },
                remove: function(a) {
                    this.create(a, "", -1)
                }
            },
            D = {
                create: function(a, b, c) {},
                read: function(a) {
                    return null
                },
                remove: function(a) {}
            },
            E = {
                extend: w ? w.extend : a,
                each: w ? w.each : b,
                ajax: w ? w.ajax : c,
                cookie: "undefined" != typeof document ? C : D,
                detectLanguage: t,
                log: function(a) {
                    B.debug && "undefined" != typeof console && console.log(a)
                },
                toLanguages: function(a) {
                    var b = [];
                    if ("string" == typeof a && a.indexOf("-") > -1) {
                        var c = a.split("-");
                        a = B.lowerCaseLng ? c[0].toLowerCase() + "-" + c[1].toLowerCase() : c[0].toLowerCase() + "-" + c[1].toUpperCase(), "unspecific" !== B.load && b.push(a), "current" !== B.load && b.push(c[0])
                    } else b.push(a);
                    return -1 === b.indexOf(B.fallbackLng) && B.fallbackLng && b.push(B.fallbackLng), b
                },
                regexEscape: function(a) {
                    return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
                }
            },
            F = {
                load: function(a, b, c) {
                    b.useLocalStorage ? F._loadLocal(a, b, function(d, e) {
                        for (var f = [], g = 0, h = a.length; h > g; g++) e[a[g]] || f.push(a[g]);
                        f.length > 0 ? F._fetch(f, b, function(a, b) {
                            E.extend(e, b), F._storeLocal(b), c(null, e)
                        }) : c(null, e)
                    }) : F._fetch(a, b, function(a, b) {
                        c(null, b)
                    })
                },
                _loadLocal: function(a, b, c) {
                    var d = {},
                        e = (new Date).getTime();
                    if (window.localStorage) {
                        var f = a.length;
                        E.each(a, function(a, g) {
                            var h = window.localStorage.getItem("res_" + g);
                            h && (h = JSON.parse(h), h.i18nStamp && h.i18nStamp + b.localStorageExpirationTime > e && (d[g] = h)), f--, 0 === f && c(null, d)
                        })
                    }
                },
                _storeLocal: function(a) {
                    if (window.localStorage)
                        for (var b in a) a[b].i18nStamp = (new Date).getTime(), window.localStorage.setItem("res_" + b, JSON.stringify(a[b]))
                },
                _fetch: function(a, b, c) {
                    var d = b.ns,
                        e = {};
                    if (b.dynamicLoad) {
                        var f = n(b.resGetPath, {
                            lng: a.join("+"),
                            ns: d.namespaces.join("+")
                        });
                        E.ajax({
                            url: f,
                            success: function(a, b, d) {
                                E.log("loaded: " + f), c(null, a)
                            },
                            error: function(a, b, d) {
                                E.log("failed loading: " + f), c("failed loading resource.json error: " + d)
                            },
                            dataType: "json",
                            async: b.getAsync
                        })
                    } else {
                        var g, h = d.namespaces.length * a.length;
                        E.each(d.namespaces, function(d, f) {
                            E.each(a, function(a, d) {
                                var i = function(a, b) {
                                    a && (g = g || [], g.push(a)), e[d] = e[d] || {}, e[d][f] = b, h--, 0 === h && c(g, e)
                                };
                                "function" == typeof b.customLoad ? b.customLoad(d, f, b, i) : F._fetchOne(d, f, b, i)
                            })
                        })
                    }
                },
                _fetchOne: function(a, b, c, d) {
                    var e = n(c.resGetPath, {
                        lng: a,
                        ns: b
                    });
                    E.ajax({
                        url: e,
                        success: function(a, b, c) {
                            E.log("loaded: " + e), d(null, a)
                        },
                        error: function(a, b, c) {
                            E.log("failed loading: " + e), d(c, {})
                        },
                        dataType: "json",
                        async: c.getAsync
                    })
                },
                postMissing: function(a, b, c, d, e) {
                    var f = {};
                    f[c] = d;
                    var g = [];
                    if ("fallback" === B.sendMissingTo) g.push({
                        lng: B.fallbackLng,
                        url: n(B.resPostPath, {
                            lng: B.fallbackLng,
                            ns: b
                        })
                    });
                    else if ("current" === B.sendMissingTo) g.push({
                        lng: a,
                        url: n(B.resPostPath, {
                            lng: a,
                            ns: b
                        })
                    });
                    else if ("all" === B.sendMissingTo)
                        for (var h = 0, i = e.length; i > h; h++) g.push({
                            lng: e[h],
                            url: n(B.resPostPath, {
                                lng: e[h],
                                ns: b
                            })
                        });
                    for (var j = 0, k = g.length; k > j; j++) {
                        var l = g[j];
                        E.ajax({
                            url: l.url,
                            type: B.sendType,
                            data: f,
                            success: function(a, e, f) {
                                E.log("posted missing key '" + c + "' to: " + l.url);
                                for (var g = c.split("."), h = 0, i = y[l.lng][b]; g[h];) i = h === g.length - 1 ? i[g[h]] = d : i[g[h]] = i[g[h]] || {}, h++
                            },
                            error: function(a, b, d) {
                                E.log("failed posting missing key '" + c + "' to: " + l.url)
                            },
                            dataType: "json",
                            async: B.postAsync
                        })
                    }
                }
            },
            G = {
                rules: {
                    ach: {
                        name: "Acholi",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    af: {
                        name: "Afrikaans",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ak: {
                        name: "Akan",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    am: {
                        name: "Amharic",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    an: {
                        name: "Aragonese",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ar: {
                        name: "Arabic",
                        numbers: [0, 1, 2, 3, 11, 100],
                        plurals: function(a) {
                            return Number(0 === a ? 0 : 1 == a ? 1 : 2 == a ? 2 : a % 100 >= 3 && 10 >= a % 100 ? 3 : a % 100 >= 11 ? 4 : 5)
                        }
                    },
                    arn: {
                        name: "Mapudungun",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    ast: {
                        name: "Asturian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ay: {
                        name: "Aymará",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    az: {
                        name: "Azerbaijani",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    be: {
                        name: "Belarusian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    bg: {
                        name: "Bulgarian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    bn: {
                        name: "Bengali",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    bo: {
                        name: "Tibetan",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    br: {
                        name: "Breton",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    bs: {
                        name: "Bosnian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    ca: {
                        name: "Catalan",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    cgg: {
                        name: "Chiga",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    cs: {
                        name: "Czech",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : a >= 2 && 4 >= a ? 1 : 2)
                        }
                    },
                    csb: {
                        name: "Kashubian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    cy: {
                        name: "Welsh",
                        numbers: [1, 2, 3, 8],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : 2 == a ? 1 : 8 != a && 11 != a ? 2 : 3)
                        }
                    },
                    da: {
                        name: "Danish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    de: {
                        name: "German",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    dz: {
                        name: "Dzongkha",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    el: {
                        name: "Greek",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    en: {
                        name: "English",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    eo: {
                        name: "Esperanto",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    es: {
                        name: "Spanish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    es_ar: {
                        name: "Argentinean Spanish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    et: {
                        name: "Estonian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    eu: {
                        name: "Basque",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    fa: {
                        name: "Persian",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    fi: {
                        name: "Finnish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    fil: {
                        name: "Filipino",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    fo: {
                        name: "Faroese",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    fr: {
                        name: "French",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    fur: {
                        name: "Friulian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    fy: {
                        name: "Frisian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ga: {
                        name: "Irish",
                        numbers: [1, 2, 3, 7, 11],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : 2 == a ? 1 : 7 > a ? 2 : 11 > a ? 3 : 4)
                        }
                    },
                    gd: {
                        name: "Scottish Gaelic",
                        numbers: [1, 2, 3, 20],
                        plurals: function(a) {
                            return Number(1 == a || 11 == a ? 0 : 2 == a || 12 == a ? 1 : a > 2 && 20 > a ? 2 : 3)
                        }
                    },
                    gl: {
                        name: "Galician",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    gu: {
                        name: "Gujarati",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    gun: {
                        name: "Gun",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    ha: {
                        name: "Hausa",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    he: {
                        name: "Hebrew",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    hi: {
                        name: "Hindi",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    hr: {
                        name: "Croatian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    hu: {
                        name: "Hungarian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    hy: {
                        name: "Armenian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ia: {
                        name: "Interlingua",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    id: {
                        name: "Indonesian",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    is: {
                        name: "Icelandic",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a % 10 != 1 || a % 100 == 11)
                        }
                    },
                    it: {
                        name: "Italian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ja: {
                        name: "Japanese",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    jbo: {
                        name: "Lojban",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    jv: {
                        name: "Javanese",
                        numbers: [0, 1],
                        plurals: function(a) {
                            return Number(0 !== a)
                        }
                    },
                    ka: {
                        name: "Georgian",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    kk: {
                        name: "Kazakh",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    km: {
                        name: "Khmer",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    kn: {
                        name: "Kannada",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ko: {
                        name: "Korean",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    ku: {
                        name: "Kurdish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    kw: {
                        name: "Cornish",
                        numbers: [1, 2, 3, 4],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : 2 == a ? 1 : 3 == a ? 2 : 3)
                        }
                    },
                    ky: {
                        name: "Kyrgyz",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    lb: {
                        name: "Letzeburgesch",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ln: {
                        name: "Lingala",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    lo: {
                        name: "Lao",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    lt: {
                        name: "Lithuanian",
                        numbers: [1, 2, 10],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    lv: {
                        name: "Latvian",
                        numbers: [0, 1, 2],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : 0 !== a ? 1 : 2)
                        }
                    },
                    mai: {
                        name: "Maithili",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    mfe: {
                        name: "Mauritian Creole",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    mg: {
                        name: "Malagasy",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    mi: {
                        name: "Maori",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    mk: {
                        name: "Macedonian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 == a || a % 10 == 1 ? 0 : 1)
                        }
                    },
                    ml: {
                        name: "Malayalam",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    mn: {
                        name: "Mongolian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    mnk: {
                        name: "Mandinka",
                        numbers: [0, 1, 2],
                        plurals: function(a) {
                            return Number(1 == a ? 1 : 2)
                        }
                    },
                    mr: {
                        name: "Marathi",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ms: {
                        name: "Malay",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    mt: {
                        name: "Maltese",
                        numbers: [1, 2, 11, 20],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : 0 === a || a % 100 > 1 && 11 > a % 100 ? 1 : a % 100 > 10 && 20 > a % 100 ? 2 : 3)
                        }
                    },
                    nah: {
                        name: "Nahuatl",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    nap: {
                        name: "Neapolitan",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    nb: {
                        name: "Norwegian Bokmal",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ne: {
                        name: "Nepali",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    nl: {
                        name: "Dutch",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    nn: {
                        name: "Norwegian Nynorsk",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    no: {
                        name: "Norwegian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    nso: {
                        name: "Northern Sotho",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    oc: {
                        name: "Occitan",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    or: {
                        name: "Oriya",
                        numbers: [2, 1],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    pa: {
                        name: "Punjabi",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    pap: {
                        name: "Papiamento",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    pl: {
                        name: "Polish",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    pms: {
                        name: "Piemontese",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ps: {
                        name: "Pashto",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    pt: {
                        name: "Portuguese",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    pt_br: {
                        name: "Brazilian Portuguese",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    rm: {
                        name: "Romansh",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ro: {
                        name: "Romanian",
                        numbers: [1, 2, 20],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : 0 === a || a % 100 > 0 && 20 > a % 100 ? 1 : 2)
                        }
                    },
                    ru: {
                        name: "Russian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    sah: {
                        name: "Yakut",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    sco: {
                        name: "Scots",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    se: {
                        name: "Northern Sami",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    si: {
                        name: "Sinhala",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    sk: {
                        name: "Slovak",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(1 == a ? 0 : a >= 2 && 4 >= a ? 1 : 2)
                        }
                    },
                    sl: {
                        name: "Slovenian",
                        numbers: [5, 1, 2, 3],
                        plurals: function(a) {
                            return Number(a % 100 == 1 ? 1 : a % 100 == 2 ? 2 : a % 100 == 3 || a % 100 == 4 ? 3 : 0)
                        }
                    },
                    so: {
                        name: "Somali",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    son: {
                        name: "Songhay",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    sq: {
                        name: "Albanian",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    sr: {
                        name: "Serbian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    su: {
                        name: "Sundanese",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    sv: {
                        name: "Swedish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    sw: {
                        name: "Swahili",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    ta: {
                        name: "Tamil",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    te: {
                        name: "Telugu",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    tg: {
                        name: "Tajik",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    th: {
                        name: "Thai",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    ti: {
                        name: "Tigrinya",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    tk: {
                        name: "Turkmen",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    tr: {
                        name: "Turkish",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    tt: {
                        name: "Tatar",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    ug: {
                        name: "Uyghur",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    uk: {
                        name: "Ukrainian",
                        numbers: [1, 2, 5],
                        plurals: function(a) {
                            return Number(a % 10 == 1 && a % 100 != 11 ? 0 : a % 10 >= 2 && 4 >= a % 10 && (10 > a % 100 || a % 100 >= 20) ? 1 : 2)
                        }
                    },
                    ur: {
                        name: "Urdu",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    uz: {
                        name: "Uzbek",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    vi: {
                        name: "Vietnamese",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    wa: {
                        name: "Walloon",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(a > 1)
                        }
                    },
                    wo: {
                        name: "Wolof",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    },
                    yo: {
                        name: "Yoruba",
                        numbers: [1, 2],
                        plurals: function(a) {
                            return Number(1 != a)
                        }
                    },
                    zh: {
                        name: "Chinese",
                        numbers: [1],
                        plurals: function(a) {
                            return 0
                        }
                    }
                },
                addRule: function(a, b) {
                    G.rules[a] = b
                },
                setCurrentLng: function(a) {
                    if (!G.currentRule || G.currentRule.lng !== a) {
                        var b = a.split("-");
                        G.currentRule = {
                            lng: a,
                            rule: G.rules[b[0]]
                        }
                    }
                },
                get: function(a, b) {
                    function c(b, c) {
                        var d;
                        if (d = G.currentRule && G.currentRule.lng === a ? G.currentRule.rule : G.rules[b]) {
                            var e = d.plurals(c),
                                f = d.numbers[e];
                            return 2 === d.numbers.length && 1 === d.numbers[0] && (2 === f ? f = -1 : 1 === f && (f = 1)), f
                        }
                        return 1 === c ? "1" : "-1"
                    }
                    var d = a.split("-");
                    return c(d[0], b)
                }
            },
            H = {},
            I = function(a, b) {
                H[a] = b
            },
            J = function() {
                function a(a) {
                    return Object.prototype.toString.call(a).slice(8, -1).toLowerCase()
                }

                function b(a, b) {
                    for (var c = []; b > 0; c[--b] = a);
                    return c.join("")
                }
                var c = function() {
                    return c.cache.hasOwnProperty(arguments[0]) || (c.cache[arguments[0]] = c.parse(arguments[0])), c.format.call(null, c.cache[arguments[0]], arguments)
                };
                return c.format = function(c, d) {
                    var e, f, g, h, i, j, k, l = 1,
                        m = c.length,
                        n = "",
                        o = [];
                    for (f = 0; m > f; f++)
                        if (n = a(c[f]), "string" === n) o.push(c[f]);
                        else if ("array" === n) {
                        if (h = c[f], h[2])
                            for (e = d[l], g = 0; g < h[2].length; g++) {
                                if (!e.hasOwnProperty(h[2][g])) throw J('[sprintf] property "%s" does not exist', h[2][g]);
                                e = e[h[2][g]]
                            } else e = h[1] ? d[h[1]] : d[l++];
                        if (/[^s]/.test(h[8]) && "number" != a(e)) throw J("[sprintf] expecting number but found %s", a(e));
                        switch (h[8]) {
                            case "b":
                                e = e.toString(2);
                                break;
                            case "c":
                                e = String.fromCharCode(e);
                                break;
                            case "d":
                                e = parseInt(e, 10);
                                break;
                            case "e":
                                e = h[7] ? e.toExponential(h[7]) : e.toExponential();
                                break;
                            case "f":
                                e = h[7] ? parseFloat(e).toFixed(h[7]) : parseFloat(e);
                                break;
                            case "o":
                                e = e.toString(8);
                                break;
                            case "s":
                                e = (e = String(e)) && h[7] ? e.substring(0, h[7]) : e;
                                break;
                            case "u":
                                e = Math.abs(e);
                                break;
                            case "x":
                                e = e.toString(16);
                                break;
                            case "X":
                                e = e.toString(16).toUpperCase()
                        }
                        e = /[def]/.test(h[8]) && h[3] && e >= 0 ? "+" + e : e, j = h[4] ? "0" == h[4] ? "0" : h[4].charAt(1) : " ", k = h[6] - String(e).length, i = h[6] ? b(j, k) : "", o.push(h[5] ? e + i : i + e)
                    }
                    return o.join("")
                }, c.cache = {}, c.parse = function(a) {
                    for (var b = a, c = [], d = [], e = 0; b;) {
                        if (null !== (c = /^[^\x25]+/.exec(b))) d.push(c[0]);
                        else if (null !== (c = /^\x25{2}/.exec(b))) d.push("%");
                        else {
                            if (null === (c = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(b))) throw "[sprintf] huh?";
                            if (c[2]) {
                                e |= 1;
                                var f = [],
                                    g = c[2],
                                    h = [];
                                if (null === (h = /^([a-z_][a-z_\d]*)/i.exec(g))) throw "[sprintf] huh?";
                                for (f.push(h[1]);
                                    "" !== (g = g.substring(h[0].length));)
                                    if (null !== (h = /^\.([a-z_][a-z_\d]*)/i.exec(g))) f.push(h[1]);
                                    else {
                                        if (null === (h = /^\[(\d+)\]/.exec(g))) throw "[sprintf] huh?";
                                        f.push(h[1])
                                    }
                                c[2] = f
                            } else e |= 2;
                            if (3 === e) throw "[sprintf] mixing positional and named placeholders is not (yet) supported";
                            d.push(c)
                        }
                        b = b.substring(c[0].length)
                    }
                    return d
                }, c
            }(),
            K = function(a, b) {
                return b.unshift(a), J.apply(null, b)
            };
        I("sprintf", function(a, b, c) {
            return c.sprintf ? "[object Array]" === Object.prototype.toString.apply(c.sprintf) ? K(a, c.sprintf) : "object" == typeof c.sprintf ? J(a, c.sprintf) : a : a
        }), x.init = d, x.setLng = j, x.preload = e, x.addResourceBundle = f, x.loadNamespace = h, x.loadNamespaces = i, x.setDefaultNamespace = g, x.t = r, x.translate = r, x.detectLanguage = E.detectLanguage, x.pluralExtensions = G, x.sync = F, x.functions = E, x.lng = l, x.addPostProcessor = I, x.options = B
    }();
var seajs = {
    _seajs: seajs,
    version: "1.2.0-dev",
    _data: {
        config: {
            debug: "",
            preload: []
        },
        memoizedMods: {},
        packageMods: []
    },
    _util: {},
    _fn: {}
};
! function(a) {
    var b = Object.prototype.toString,
        c = Array.prototype;
    a.isString = function(a) {
        return "[object String]" === b.call(a)
    }, a.isObject = function(a) {
        return a === Object(a)
    }, a.isFunction = function(a) {
        return "[object Function]" === b.call(a)
    }, a.isArray = Array.isArray || function(a) {
        return "[object Array]" === b.call(a)
    }, a.indexOf = c.indexOf ? function(a, b) {
        return a.indexOf(b)
    } : function(a, b) {
        for (var c = 0, d = a.length; d > c; c++)
            if (a[c] === b) return c;
        return -1
    };
    var d = a.forEach = c.forEach ? function(a, b) {
        a.forEach(b)
    } : function(a, b) {
        for (var c = 0, d = a.length; d > c; c++) b(a[c], c, a)
    };
    a.map = c.map ? function(a, b) {
        return a.map(b)
    } : function(a, b) {
        var c = [];
        return d(a, function(a, d, e) {
            c.push(b(a, d, e))
        }), c
    }, a.filter = c.filter ? function(a, b) {
        return a.filter(b)
    } : function(a, b) {
        var c = [];
        return d(a, function(a, d, e) {
            b(a, d, e) && c.push(a)
        }), c
    }, a.unique = function(a) {
        var b = [],
            c = {};
        if (d(a, function(a) {
                c[a] = 1
            }), Object.keys) b = Object.keys(c);
        else
            for (var e in c) c.hasOwnProperty(e) && b.push(e);
        return b
    }, a.now = Date.now || function() {
        return (new Date).getTime()
    }
}(seajs._util),
function(a, b) {
    a.error = function() {
        throw Array.prototype.join.call(arguments, " ")
    }, a.log = function() {
        b.config.debug && "undefined" != typeof console && console.log(Array.prototype.join.call(arguments, " "))
    }
}(seajs._util, seajs._data),
function(a, b, c, d) {
    function e(a) {
        return a = a.match(/.*(?=\/.*$)/), (a ? a[0] : ".") + "/"
    }

    function f(b) {
        if (b = b.replace(/([^:\/])\/+/g, "$1/"), -1 === b.indexOf(".")) return b;
        for (var c, d = b.split("/"), e = [], f = 0, g = d.length; g > f; f++) c = d[f], ".." === c ? (0 === e.length && a.error("Invalid path:", b), e.pop()) : "." !== c && e.push(c);
        return e.join("/")
    }

    function g(a) {
        return a = f(a), /#$/.test(a) ? a = a.slice(0, -1) : -1 === a.indexOf("?") && !/\.(?:css|js)$/.test(a) && (a += ".js"), a
    }

    function h(a) {
        if ("#" === a.charAt(0)) return a.substring(1);
        var b;
        if (j(a) && (b = k.alias)) {
            var c = a.split("/"),
                d = c[0];
            b.hasOwnProperty(d) && (c[0] = b[d], a = c.join("/"))
        }
        return a
    }

    function i(a) {
        return ~a.indexOf("://") || 0 === a.indexOf("//")
    }

    function j(a) {
        var b = a.charAt(0);
        return -1 === a.indexOf("://") && "." !== b && "/" !== b
    }
    var k = b.config,
        l = {},
        b = d.location,
        m = b.protocol + "//" + b.host + function(a) {
            return "/" !== a.charAt(0) && (a = "/" + a), a
        }(b.pathname);
    ~m.indexOf("\\") && (m = m.replace(/\\/g, "/")), a.dirname = e, a.realpath = f, a.normalize = g, a.parseAlias = h, a.parseMap = function(b, c) {
        if (c = c || k.map || [], !c.length) return b;
        var d = b;
        return a.forEach(c, function(a) {
            a && 1 < a.length && (d = d.replace(a[0], a[1]))
        }), l[d] = b, d
    }, a.unParseMap = function(a) {
        return l[a] || a
    }, a.id2Uri = function(a, b) {
        var c, a = h(a),
            b = b || m;
        return i(a) ? c = a : 0 === a.indexOf("./") || 0 === a.indexOf("../") ? (a = a.replace(/^\.\//, ""), c = e(b) + a) : c = "/" === a.charAt(0) && "/" !== a.charAt(1) ? b.replace(/^(\w+:\/\/[^\/]*)\/?.*$/, "$1") + a : k.base + "/" + a, g(c)
    }, a.isAbsolute = i, a.isTopLevel = j, a.pageUrl = m
}(seajs._util, seajs._data, seajs._fn, this),
function(a, b) {
    function c(c, f) {
        function g() {
            g.isCalled || (g.isCalled = !0, clearTimeout(h), f())
        }
        "SCRIPT" === c.nodeName ? d(c, g) : e(c, g);
        var h = setTimeout(function() {
            a.log("Time is out:", c.src), g()
        }, b.config.timeout)
    }

    function d(a, b) {
        a.onload = a.onerror = a.onreadystatechange = function() {
            if (/loaded|complete|undefined/.test(a.readyState)) {
                if (a.onload = a.onerror = a.onreadystatechange = null, a.parentNode) {
                    try {
                        if (a.clearAttributes) a.clearAttributes();
                        else
                            for (var c in a) delete a[c]
                    } catch (d) {}
                    g.removeChild(a)
                }
                a = void 0, b()
            }
        }
    }

    function e(a, b) {
        a.attachEvent ? a.attachEvent("onload", b) : setTimeout(function() {
            f(a, b)
        }, 0)
    }

    function f(a, b) {
        if (!b.isCalled) {
            var c;
            if (i) a.sheet && (c = !0);
            else if (a.sheet) try {
                a.sheet.cssRules && (c = !0)
            } catch (d) {
                1e3 === d.code && (c = !0)
            }
            setTimeout(function() {
                c ? b() : f(a, b)
            }, 1)
        }
    }
    var g = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
        h = navigator.userAgent,
        i = ~h.indexOf("AppleWebKit");
    a.getAsset = function(b, d, e) {
        var f = /\.css(?:\?|$)/i.test(b),
            h = document.createElement(f ? "link" : "script");
        e && (e = a.isFunction(e) ? e(b) : e) && (h.charset = e), c(h, d), f ? (h.rel = "stylesheet", h.href = b, g.appendChild(h)) : (h.async = "async", h.src = b, j = h, g.insertBefore(h, g.firstChild), j = null)
    };
    var j, k;
    a.getCurrentScript = function() {
        if (j) return j;
        if (k && "interactive" === k.readyState) return k;
        for (var a = g.getElementsByTagName("script"), b = 0; b < a.length; b++) {
            var c = a[b];
            if ("interactive" === c.readyState) return k = c
        }
    }, a.getScriptAbsoluteSrc = function(a) {
        return a.hasAttribute ? a.src : a.getAttribute("src", 4)
    }, a.isOpera = ~h.indexOf("Opera")
}(seajs._util, seajs._data),
function(a) {
    a.Module = function(a, b, c) {
        this.id = a, this.dependencies = b || [], this.factory = c
    }
}(seajs._fn),
function(a, b, c) {
    c.define = function(d, e, f) {
        var g = arguments.length;
        if (1 === g ? (f = d, d = void 0) : 2 === g && (f = e, e = void 0, a.isArray(d) && (e = d, d = void 0)), !a.isArray(e) && a.isFunction(f)) {
            for (var h, g = f.toString(), i = /(?:^|[^.])\brequire\s*\(\s*(["'])([^"'\s\)]+)\1\s*\)/g, j = [], g = g.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, "\n").replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, "\n"); h = i.exec(g);) h[2] && j.push(h[2]);
            e = a.unique(j)
        }
        if (d) var k = a.id2Uri(d);
        else document.attachEvent && !a.isOpera && ((g = a.getCurrentScript()) && (k = a.unParseMap(a.getScriptAbsoluteSrc(g))), k || a.log("Failed to derive URL from interactive script for:", f.toString()));
        g = new c.Module(d, e, f), k ? (a.memoize(k, g), b.packageMods.push(g)) : b.anonymousMod = g
    }
}(seajs._util, seajs._data, seajs._fn),
function(a, b, c) {
    function d(c) {
        var d, g, i = this.context;
        return a.isObject(c) ? (g = c, d = g.id) : a.isString(c) && (d = h.resolve(c, i), g = b.memoizedMods[d]), g ? f(i, d) ? (a.log("Found circular dependencies:", d), g.exports) : (g.exports || (c = g, i = {
            uri: d,
            parent: i
        }, d = c.factory, c.exports = {}, delete c.factory, delete c.ready, a.isFunction(d) ? (i = d(e(i), c.exports, c), void 0 !== i && (c.exports = i)) : void 0 !== d && (c.exports = d)), g.exports) : null
    }

    function e(a) {
        function b(a) {
            return d.call(c, a)
        }
        var c = {
            context: a || {}
        };
        b.constructor = d;
        for (var e in h) h.hasOwnProperty(e) && function(a) {
            b[a] = function() {
                return h[a].apply(c, g.call(arguments))
            }
        }(e);
        return b
    }

    function f(a, b) {
        return a.uri === b ? !0 : a.parent ? f(a.parent, b) : !1
    }
    var g = Array.prototype.slice,
        h = d.prototype;
    h.resolve = function(b, c) {
        return a.isString(b) ? a.id2Uri(b, (c || this.context || {}).uri) : a.map(b, function(a) {
            return h.resolve(a, c)
        })
    }, h.async = function(a, b) {
        c.load(a, b, this.context)
    }, h.load = function(b, c, d) {
        a.getAsset(b, c, d)
    }, c.Require = d, c.createRequire = e
}(seajs._util, seajs._data, seajs._fn),
function(a, b, c) {
    function d(b, c) {
        var f = o.preload,
            g = f.length;
        if (g) q += g, o.preload = [], a.forEach(p.resolve(f), function(a) {
            s[a] = 1
        }), e(f, function() {
            q -= g, d(b)
        });
        else if (c && m(c)) b();
        else if (r.push(b), 0 === q)
            for (; f = r.shift();) f()
    }

    function e(d, e, g) {
        a.isString(d) && (d = [d]);
        var h = p.resolve(d, g);
        f(h, function() {
            var d = c.createRequire(g),
                f = a.map(h, function(a) {
                    return d(b.memoizedMods[a])
                });
            e && e.apply(null, f)
        })
    }

    function f(a, b) {
        var c = j(a);
        if (0 === c.length) i(c), b();
        else
            for (var e = 0, h = c.length, l = h; h > e; e++)(function(a) {
                function e() {
                    d(function() {
                        var d = n[a];
                        if (d) {
                            var e = d.dependencies;
                            e.length && (e = d.dependencies = p.resolve(e, {
                                uri: d.id
                            }));
                            var g = e.length;
                            g && (e = k(a, e), g = e.length), g && (l += g, f(e, function() {
                                l -= g, 0 === l && (i(c), b())
                            }))
                        }
                        0 === --l && (i(c), b())
                    }, a)
                }
                n[a] ? e() : g(a, e)
            })(c[e])
    }

    function g(c, d) {
        var e = a.parseMap(c);
        u[e] ? d() : t[e] ? v[e].push(d) : (t[e] = !0, v[e] = [d], p.load(e, function() {
            u[e] = !0;
            var d = b.anonymousMod;
            d && (n[c] || h(c, d), b.anonymousMod = null), (d = b.packageMods[0]) && !n[c] && (n[c] = d), b.packageMods = [], t[e] && delete t[e], v[e] && (a.forEach(v[e], function(a) {
                a()
            }), delete v[e])
        }, b.config.charset))
    }

    function h(a, b) {
        b.id = a, n[a] = b
    }

    function i(b) {
        a.forEach(b, function(a) {
            n[a] && (n[a].ready = !0)
        })
    }

    function j(b) {
        return a.filter(b, function(a) {
            return a = n[a], !a || !a.ready
        })
    }

    function k(b, c) {
        return a.filter(c, function(a) {
            return !l(n[a], b)
        })
    }

    function l(b, c) {
        if (!b || b.ready) return !1;
        var d = b.dependencies || [];
        if (d.length) {
            if (~a.indexOf(d, c)) return !0;
            for (var e = 0; e < d.length; e++)
                if (l(n[d[e]], c)) return !0
        }
        return !1
    }

    function m(b) {
        if (s[b]) return !0;
        for (var c in s)
            if (n[c] && ~a.indexOf(n[c].dependencies, b)) return !0;
        return !1
    }
    var n = b.memoizedMods,
        o = b.config,
        p = c.Require.prototype,
        q = 0,
        r = [],
        s = {},
        t = {},
        u = {},
        v = {};
    a.memoize = h, c.preload = d, c.load = e
}(seajs._util, seajs._data, seajs._fn),
function(a, b, c, d) {
    function e(a, c) {
        a && a !== c && b.error("Alias is conflicted:", c)
    }
    var f = c.config,
        g = "seajs-ts=" + b.now(),
        c = document.getElementById("seajsnode");
    c || (c = document.getElementsByTagName("script"), c = c[c.length - 1]);
    var h = b.getScriptAbsoluteSrc(c) || b.pageUrl,
        h = b.dirname(h);
    b.loaderDir = h;
    var i = h.match(/^(.+\/)seajs\/[\d\.]+\/$/);
    i && (h = i[1]), f.base = h, (c = c.getAttribute("data-main")) && (b.isTopLevel(c) && (c = "./" + c), f.main = c), f.timeout = 2e4, d.config = function(c) {
        for (var h in c) {
            var i = f[h],
                j = c[h];
            if (i && "alias" === h)
                for (var k in j) j.hasOwnProperty(k) && (e(i[k], j[k]), i[k] = j[k]);
            else !i || "map" !== h && "preload" !== h ? f[h] = j : (b.isArray(j) || (j = [j]), b.forEach(j, function(a) {
                a && i.push(a)
            }))
        }
        return (c = f.base) && !b.isAbsolute(c) && (f.base = b.id2Uri("./" + c + "#")), 2 === f.debug && (f.debug = 1, d.config({
            map: [
                [/.*/, function(a) {
                    return -1 === a.indexOf("seajs-ts=") && (a += (-1 === a.indexOf("?") ? "?" : "&") + g), a
                }]
            ]
        })), f.debug && (a.debug = f.debug), this
    }
}(seajs, seajs._util, seajs._data, seajs._fn),
function(a, b, c, d) {
    var a = a.config,
        e = {},
        f = b.loaderDir;
    b.forEach("base,map,text,json,coffee,less".split(","), function(a) {
        a = "plugin-" + a, e[a] = f + a
    }), c.config({
        alias: e
    }), (~d.location.search.indexOf("seajs-debug") || ~document.cookie.indexOf("seajs=1")) && (c.config({
        debug: 2
    }), a.preload.push("plugin-map"))
}(seajs._data, seajs._util, seajs._fn, this),
function(a, b, c) {
    c.use = function(a, b) {
            c.preload(function() {
                c.load(a, b)
            })
        }, (b = b.config.main) && c.use([b]),
        function(b) {
            if (b) {
                for (var d = {
                        0: "config",
                        1: "use",
                        2: "define"
                    }, e = 0; e < b.length; e += 2) c[d[b[e]]].apply(a, b[e + 1]);
                delete a._seajs
            }
        }((a._seajs || 0).args)
}(seajs, seajs._data, seajs._fn),
function(a, b, c, d) {
    if (a._seajs) d.seajs = a._seajs;
    else {
        a.config = c.config, a.use = c.use;
        var e = d.define;
        d.define = c.define, a.noConflict = function(b) {
            return d.seajs = a._seajs, b && (d.define = e, a.define = c.define), a
        }, a.pluginSDK = {
            util: a._util,
            data: a._data
        }, (b = b.config.debug) && (a.debug = !!b), delete a._util, delete a._data, delete a._fn, delete a._seajs
    }
}(seajs, seajs._data, seajs._fn, this),
function(a) {
    "use strict";

    function b() {
        var a = document.documentElement;
        return "requestFullscreen" in a || "mozRequestFullScreen" in a && document.mozFullScreenEnabled || "webkitRequestFullScreen" in a || document.msFullscreenEnabled === !0
    }

    function c(a) {
        if (a.requestFullscreen) a.requestFullscreen();
        else if (a.mozRequestFullScreen) a.mozRequestFullScreen();
        else if (a.webkitRequestFullScreen) {
            var b = navigator.userAgent.toLowerCase(); - 1 != b.indexOf("safari") && (b.indexOf("chrome") > -1 ? a.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : a.webkitRequestFullScreen())
        } else a.msRequestFullscreen && a.msRequestFullscreen();
        g = !0
    }

    function d() {
        return g
    }

    function e() {
        document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitCancelFullScreen ? document.webkitCancelFullScreen() : document.msExitFullscreen && document.msExitFullscreen(), g = !1
    }

    function f(b) {
        h = !0, a(document).bind("fullscreenchange mozfullscreenchange webkitfullscreenchange", function() {
            g && !h && (h = !1, g = !1), b(d()), h = !1
        }), a(document).bind("MSFullscreenChange", function() {
            null != document.msFullscreenElement ? (g = !0, b(g)) : (g = !1, b(g))
        })
    }
    var g = !1,
        h = !1;
    a.support.fullscreen = b(), a.fn.fullScreen = function(b) {
        if (!a.support.fullscreen || 1 !== this.length) return this;
        if (d()) return e(), this;
        var g = a.extend({
                background: "#111",
                callback: a.noop(),
                fullscreenClass: "fullScreen"
            }, b),
            h = this,
            i = a("<div>", {
                css: {
                    overflow: "hidden",
                    background: g.background,
                    width: "100%",
                    height: "100%"
                }
            }).insertBefore(h).append(h);
        return h.addClass(g.fullscreenClass), i.click(function(a) {
            a.target == this && e()
        }), h.cancel = function() {
            return e(), h
        }, f(function(b) {
            b || (a(document).unbind("fullscreenchange mozfullscreenchange webkitfullscreenchange MSFullscreenChange"), h.removeClass(g.fullscreenClass).insertBefore(i), i.remove()), g.callback && g.callback(b)
        }), c(i.get(0)), h
    }, a.fn.cancelFullScreen = function() {
        return e(), this
    }
}(jQuery),
function(a) {
    var b = 0,
        c = {
            iframe: "iframe",
            popup: "popup"
        },
        d = {
            strict: "strict",
            loose: "loose",
            html5: "html5"
        },
        e = {
            mode: c.iframe,
            standard: d.html5,
            popHt: 500,
            popWd: 840,
            popX: 500,
            popY: 500,
            popTitle: "",
            popClose: !1,
            extraCss: "",
            extraHead: "",
            retainAttr: ["id", "class", "style"],
            nImageToLoad: 24,
            currentStep: 0,
            arrayUrl: "",
            printPageSizeWidth: 0,
            printPageSizeHeight: 0,
            printPopUps: !1
        },
        f = {};
    a.fn.printArea = function(c) {
        a.extend(f, e, c), b++;
        var d = "printArea_";
        a("[id^=" + d + "]").remove(), f.id = d + b;
        var h = a(this),
            i = g.getPrintWindow();
        g.write(i.doc, h)
    };
    var g = {
        print: function(a) {
            return
        },
        write: function(a, b) {
            a && (a.open(), a.write(g.docType() + "<html>" + g.getHead() + g.getBody(b) + "</html>"), a.close())
        },
        docType: function() {
            var a = f.standard == d.loose ? " Transitional" : "",
                b = f.standard == d.loose ? "loose" : "strict";
            return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + a + '//EN" "http://www.w3.org/TR/html4/' + b + '.dtd">'
        },
        getHead: function() {
            var a = "<head><title>" + f.popTitle + "</title>";
            a += '<script type="text/javascript" src="' + f.baseUrl + 'scripts/jquery-1.10.2.min.js"></script>', a += '<link rel="stylesheet" type="text/css" media="print,screen" href="' + f.baseUrl + 'styles/reader/webpdf.mini.css" />', a += '<style type="text/css" media="print,screen">', a += "  @page { size:" + f.printPageSizeWidth + "px " + f.printPageSizeHeight + "30px; margin: 0px }", a += "  body { margin: 0px; background: white}", a += "  html,body {overflow-y: visible;overflow-x: visible}", f.printPopUps || (a += ".no_print{display: none;}"), a += "body, span, div, table, tr, tbody, tfoot, td, hr {-webkit-print-color-adjust: exact;print-color-adjust: exact;}.print_css{text-align:center;vertical-align:middle;overflow:hidden;}.pagenext{page-break-after: always;}",
                a += "  </style>", a += '  <script type="text/javascript">', a += "    var nImageToLoad = " + f.nImageToLoad + ";", a += "    var currentStep = " + f.currentStep + ";", a += "    var ImageUrlArray = new Array();";
            for (var b = 0; b < f.arrayUrl.length; b++) a += "       ImageUrlArray[" + b + "] = ' " + f.arrayUrl[b] + "';";
            return a += '    var currentImageUrl = "";', a += "    document.printCallback = function(printDocument,printWindow){", a += "       window.focus();", a += "       window.print();", a += "    };", a += "    function loadImage(imageUrl,callback){", a += "       $.ajax({", a += "           url: imageUrl,", a += "           ifModified:true,", a += "           error:function(XMLHttpRequest, textStatus, errorThrown){", a += "               callback();", a += "           },", a += "           success:function(data,textStatus){", a += "               callback();", a += "           }", a += "       });", a += "    };", a += "    function loadNextStep() {", a += "      if (!jQuery) {", a += "        /* jQuery is not available yet, wait for a while. */", a += "        setTimeout(loadNextStep, 100);", a += "        return;", a += "      }", a += "      if (currentStep <= nImageToLoad) {", a += "        currentImageUrl = ImageUrlArray[currentStep];", a += "        currentStep ++;", a += "        loadImage(currentImageUrl, loadNextStep);", a += "        return;", a += "      }", a += "      if (!document.printCallback) {", a += "        /* The callback is not available yet, wait for a while.*/", a += "        setTimeout(loadNextStep, 100);", a += "        return;", a += "      }", a += "      document.printCallback(document, window);", a += "    }", a += "    window.onload = function(){setTimeout(function() { loadNextStep(); }, 1000)};", a += "  </script>", a += "  <title></title>", a += "</head>"
        },
        getBody: function(b) {
            var c = "",
                d = f.retainAttr;
            return b.each(function() {
                for (var b = g.getFormData(a(this)), e = "", f = 0; f < d.length; f++) {
                    var h = a(b).attr(d[f]);
                    h && (e += (e.length > 0 ? " " : "") + d[f] + "='" + h + "'")
                }
                c += "<div " + e + ">" + a(b).html() + "</div>"
            }), "<body>" + c + "</body>"
        },
        getFormData: function(b) {
            var c = b.clone(),
                d = a("input,select,textarea", c);
            return a("input,select,textarea", b).each(function(b) {
                var c = a(this).attr("type");
                "undefined" == typeof c && (c = a(this).is("select") ? "select" : a(this).is("textarea") ? "textarea" : "");
                var e = d.eq(b);
                "radio" == c || "checkbox" == c ? e.attr("checked", a(this).is(":checked")) : "text" == c ? e.attr("value", a(this).val()) : "select" == c ? a(this).find("option").each(function(b) {
                    a(this).is(":selected") && a("option", e).eq(b).attr("selected", !0)
                }) : "textarea" == c && e.text(a(this).val())
            }), c
        },
        getPrintWindow: function() {
            switch (f.mode) {
                case c.iframe:
                    var a = new g.Iframe;
                    return {
                        win: a.contentWindow || a,
                        doc: a.doc
                    };
                case c.popup:
                    var b = new g.Popup;
                    return {
                        win: b,
                        doc: b.doc
                    }
            }
        },
        Iframe: function() {
            var b, c = f.id,
                d = "border:0;position:absolute;width:10px;height:0px;right:0px;top:0px;";
            try {
                b = document.createElement("iframe"), document.body.appendChild(b), a(b).attr({
                    style: d,
                    id: c,
                    src: "#" + (new Date).getTime()
                }), b.doc = null, b.doc = b.contentDocument ? b.contentDocument : b.contentWindow ? b.contentWindow.document : b.document
            } catch (e) {
                throw e + ". iframes may not be supported in this browser."
            }
            if (null == b.doc) throw "Cannot find document.";
            return b
        },
        Popup: function() {
            var a = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
            a += ",width=" + f.popWd + ",height=" + f.popHt, a += ",resizable=yes,screenX=" + f.popX + ",screenY=" + f.popY + ",personalbar=no,scrollbars=yes";
            var b = window.open("", "_blank", a);
            try {
                b.doc = b.document
            } catch (c) {}
            return b
        }
    }
}(jQuery),
function(a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports && "object" == typeof module ? module.exports = a : a(jQuery)
}(function(a, b) {
    "use strict";

    function c(b, c, d, e) {
        for (var f = [], g = 0; g < b.length; g++) {
            var h = b[g];
            if (h) {
                var i = tinycolor(h),
                    j = i.toHsl().l < .5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                j += tinycolor.equals(c, h) ? " sp-thumb-active" : "";
                var k = i.toString(e.preferredFormat || "rgb"),
                    l = p ? "background-color:" + i.toRgbString() : "filter:" + i.toFilter();
                f.push('<span title="' + k + '" data-color="' + i.toRgbString() + '" class="' + j + '"><span class="sp-thumb-inner" style="' + l + ';" /></span>')
            } else {
                var m = "sp-clear-display";
                f.push(a("<div />").append(a('<span data-color="" style="background-color:transparent;" class="' + m + '"></span>').attr("title", e.noColorSelectedText)).html())
            }
        }
        return "<div class='sp-cf " + d + "'>" + f.join("") + "</div>"
    }

    function d() {
        for (var a = 0; a < n.length; a++) n[a] && n[a].hide()
    }

    function e(b, c) {
        var d = a.extend({}, m, b);
        return d.callbacks = {
            move: j(d.move, c),
            change: j(d.change, c),
            show: j(d.show, c),
            hide: j(d.hide, c),
            beforeShow: j(d.beforeShow, c)
        }, d
    }

    function f(f, h) {
        function j() {
            if (T.showPaletteOnly && (T.showPalette = !0), Ka.text(T.showPaletteOnly ? T.togglePaletteMoreText : T.togglePaletteLessText), T.palette) {
                la = T.palette.slice(0), ma = a.isArray(la[0]) ? la : [la], na = {};
                for (var b = 0; b < ma.length; b++)
                    for (var c = 0; c < ma[b].length; c++) {
                        var d = tinycolor(ma[b][c]).toRgbString();
                        na[d] = !0
                    }
            }
            va.toggleClass("sp-flat", U), va.toggleClass("sp-input-disabled", !T.showInput), va.toggleClass("sp-alpha-enabled", T.showAlpha), va.toggleClass("sp-clear-enabled", Xa), va.toggleClass("sp-buttons-disabled", !T.showButtons), va.toggleClass("sp-palette-buttons-disabled", !T.togglePaletteOnly), va.toggleClass("sp-palette-disabled", !T.showPalette), va.toggleClass("sp-palette-only", T.showPaletteOnly), va.toggleClass("sp-initial-disabled", !T.showInitial), va.addClass(T.className).addClass(T.containerClassName), N()
        }

        function m() {
            function b(b) {
                return b.data && b.data.ignore ? (G(a(b.target).closest(".sp-thumb-el").data("color")), J()) : (G(a(b.target).closest(".sp-thumb-el").data("color")), J(), M(!0), T.hideAfterPaletteSelect && E()), !1
            }
            if (o && va.find("*:not(input)").attr("unselectable", "on"), j(), Na && (ta.after(Oa), T.showBound === !1 && ta.hide()), Xa || Ia.hide(), U) ta.after(va), T.showBound === !1 && ta.hide();
            else {
                var c = "parent" === T.appendTo ? ta.parent() : a(T.appendTo);
                1 !== c.length && (c = a("body")), c.append(va)
            }
            t(), Pa.bind("click.spectrum touchstart.spectrum", function(b) {
                ua || B(), b.stopPropagation(), a(b.target).is("input") || b.preventDefault()
            }), (ta.is(":disabled") || T.disabled === !0) && R(), va.click(i), Ea.change(A), Ea.bind("paste", function() {
                setTimeout(A, 1)
            }), Ea.keydown(function(a) {
                13 == a.keyCode && A()
            }), Ha.text(T.cancelText), Ha.bind("click.spectrum", function(a) {
                a.stopPropagation(), a.preventDefault(), F(), E()
            }), Ia.attr("title", T.clearText), Ia.bind("click.spectrum", function(a) {
                a.stopPropagation(), a.preventDefault(), Wa = !0, J(), U && M(!0)
            }), Ja.text(T.chooseText), Ja.bind("click.spectrum", function(a) {
                a.stopPropagation(), a.preventDefault(), I() && (M(!0), E())
            }), Ka.text(T.showPaletteOnly ? T.togglePaletteMoreText : T.togglePaletteLessText), Ka.bind("click.spectrum", function(a) {
                a.stopPropagation(), a.preventDefault(), T.showPaletteOnly = !T.showPaletteOnly, T.showPaletteOnly || U || va.css("left", "-=" + (wa.outerWidth(!0) + 5)), j()
            }), k(Ca, function(a, b, c) {
                ka = a / ea, Wa = !1, c.shiftKey && (ka = Math.round(10 * ka) / 10), J()
            }, y, z), k(za, function(a, b) {
                ha = parseFloat(b / ca), Wa = !1, T.showAlpha || (ka = 1), J()
            }, y, z), k(xa, function(a, b, c) {
                if (c.shiftKey) {
                    if (!ra) {
                        var d = ia * _,
                            e = aa - ja * aa,
                            f = Math.abs(a - d) > Math.abs(b - e);
                        ra = f ? "x" : "y"
                    }
                } else ra = null;
                var g = !ra || "x" === ra,
                    h = !ra || "y" === ra;
                g && (ia = parseFloat(a / _)), h && (ja = parseFloat((aa - b) / aa)), Wa = !1, T.showAlpha || (ka = 1), J()
            }, y, z), Ra ? (G(Ra), K(), Ua = Ta || tinycolor(Ra).format, u(Ra)) : K(), U && C();
            var d = o ? "mousedown.spectrum" : "click.spectrum touchstart.spectrum";
            Fa.delegate(".sp-thumb-el", d, b), Ga.delegate(".sp-thumb-el:nth-child(1)", d, {
                ignore: !0
            }, b)
        }

        function t() {
            if (W && window.localStorage) {
                try {
                    var b = window.localStorage[W].split(",#");
                    b.length > 1 && (delete window.localStorage[W], a.each(b, function(a, b) {
                        u(b)
                    }))
                } catch (c) {}
                try {
                    oa = window.localStorage[W].split(";")
                } catch (c) {}
            }
        }

        function u(b) {
            if (V) {
                var c = tinycolor(b).toRgbString();
                if (!na[c] && -1 === a.inArray(c, oa))
                    for (oa.push(c); oa.length > pa;) oa.shift();
                if (W && window.localStorage) try {
                    window.localStorage[W] = oa.join(";")
                } catch (d) {}
            }
        }

        function v() {
            var a = [];
            if (T.showPalette)
                for (var b = 0; b < oa.length; b++) {
                    var c = tinycolor(oa[b]).toRgbString();
                    na[c] || a.push(oa[b])
                }
            return a.reverse().slice(0, T.maxSelectionSize)
        }

        function w() {
            var b = H(),
                d = a.map(ma, function(a, d) {
                    return c(a, b, "sp-palette-row sp-palette-row-" + d, T)
                });
            t(), oa && d.push(c(v(), b, "sp-palette-row sp-palette-row-selection", T)), Fa.html(d.join(""))
        }

        function x() {
            if (T.showInitial) {
                var a = Sa,
                    b = H();
                Ga.html(c([a, b], b, "sp-palette-row-initial", T))
            }
        }

        function y() {
            (0 >= aa || 0 >= _ || 0 >= ca) && N(), va.addClass(qa), ra = null, ta.trigger("dragstart.spectrum", [H()])
        }

        function z() {
            va.removeClass(qa), ta.trigger("dragstop.spectrum", [H()])
        }

        function A() {
            var a = Ea.val();
            if (null !== a && "" !== a || !Xa) {
                var b = tinycolor(a);
                b.isValid() ? (G(b), M(!0)) : Ea.addClass("sp-validation-error")
            } else G(null), M(!0)
        }

        function B() {
            $ ? E() : C()
        }

        function C() {
            var b = a.Event("beforeShow.spectrum");
            return $ ? void N() : (ta.trigger(b, [H()]), void(Y.beforeShow(H()) === !1 || b.isDefaultPrevented() || (d(), $ = !0, a(sa).bind("click.spectrum", D), a(window).bind("resize.spectrum", Z), Oa.addClass("sp-active"), va.removeClass("sp-hidden"), N(), K(), Sa = H(), x(), Y.show(Sa), ta.trigger("show.spectrum", [Sa]))))
        }

        function D(a) {
            2 != a.button && (Va ? M(!0) : F(), E())
        }

        function E() {
            $ && !U && ($ = !1, a(sa).unbind("click.spectrum", D), a(window).unbind("resize.spectrum", Z), Oa.removeClass("sp-active"), va.addClass("sp-hidden"), Y.hide(H()), ta.trigger("hide.spectrum", [H()]))
        }

        function F() {
            G(Sa, !0)
        }

        function G(a, b) {
            if (tinycolor.equals(a, H())) return void K();
            var c, d;
            !a && Xa ? Wa = !0 : (Wa = !1, c = tinycolor(a), d = c.toHsv(), ha = d.h % 360 / 360, ia = d.s, ja = d.v, ka = d.a), K(), c && c.isValid() && !b && (Ua = Ta || c.getFormat())
        }

        function H(a) {
            return a = a || {}, Xa && Wa ? null : tinycolor.fromRatio({
                h: ha,
                s: ia,
                v: ja,
                a: Math.round(100 * ka) / 100
            }, {
                format: a.format || Ua
            })
        }

        function I() {
            return !Ea.hasClass("sp-validation-error")
        }

        function J() {
            K(), Y.move(H()), ta.trigger("move.spectrum", [H()])
        }

        function K() {
            Ea.removeClass("sp-validation-error"), L();
            var a = tinycolor.fromRatio({
                h: ha,
                s: 1,
                v: 1
            });
            xa.css("background-color", a.toHexString());
            var b = Ua;
            1 > ka && (0 !== ka || "name" !== b) && ("hex" === b || "hex3" === b || "hex6" === b || "name" === b) && (b = "rgb");
            var c = H({
                    format: b
                }),
                d = "";
            if (Qa.removeClass("sp-clear-display"), Qa.css("background-color", "transparent"), !c && Xa) Qa.addClass("sp-clear-display");
            else {
                var e = c.toHexString(),
                    f = c.toRgbString();
                if (p || 1 === c.alpha ? Qa.css("background-color", f) : (Qa.css("background-color", "transparent"), Qa.css("filter", c.toFilter())), T.showAlpha) {
                    var g = c.toRgb();
                    g.a = 0;
                    var h = tinycolor(g).toRgbString(),
                        i = "linear-gradient(left, " + h + ", " + e + ")";
                    o ? Ba.css("filter", tinycolor(h).toFilter({
                        gradientType: 1
                    }, e)) : (Ba.css("background", "-webkit-" + i), Ba.css("background", "-moz-" + i), Ba.css("background", "-ms-" + i), Ba.css("background", "linear-gradient(to right, " + h + ", " + e + ")"))
                }
                d = c.toString(b)
            }
            T.showInput && Ea.val(d), T.showPalette && w(), x()
        }

        function L() {
            var a = ia,
                b = ja;
            if (Xa && Wa) Da.hide(), Aa.hide(), ya.hide();
            else {
                Da.show(), Aa.show(), ya.show();
                var c = a * _,
                    d = aa - b * aa;
                c = Math.max(-ba, Math.min(_ - ba, c - ba)), d = Math.max(-ba, Math.min(aa - ba, d - ba)), ya.css({
                    top: d + "px",
                    left: c + "px"
                });
                var e = ka * ea;
                Da.css({
                    left: e - fa / 2 + "px"
                });
                var f = ha * ca;
                Aa.css({
                    top: f - ga + "px"
                })
            }
        }

        function M(a) {
            var b = H(),
                c = "",
                d = !tinycolor.equals(b, Sa);
            b && (c = b.toString(Ua), u(b)), La && ta.val(c), a && d && (Y.change(b), ta.trigger("change", [b]))
        }

        function N() {
            _ = xa.width(), aa = xa.height(), ba = ya.height(), da = za.width(), ca = za.height(), ga = Aa.height(), ea = Ca.width(), fa = Da.width(), U || (va.css("position", "absolute"), T.offset ? va.offset(T.offset) : va.offset(g(va, Pa))), L(), T.showPalette && w(), ta.trigger("reflow.spectrum")
        }

        function O() {
            ta.show(), Pa.unbind("click.spectrum touchstart.spectrum"), va.remove(), Oa.remove(), n[Ya.id] = null
        }

        function P(c, d) {
            return c === b ? a.extend({}, T) : d === b ? T[c] : (T[c] = d, void j())
        }

        function Q() {
            ua = !1, ta.attr("disabled", !1), Pa.removeClass("sp-disabled")
        }

        function R() {
            E(), ua = !0, ta.attr("disabled", !0), Pa.addClass("sp-disabled")
        }

        function S(a) {
            T.offset = a, N()
        }
        var T = e(h, f),
            U = T.flat,
            V = T.showSelectionPalette,
            W = T.localStorageKey,
            X = T.theme,
            Y = T.callbacks,
            Z = l(N, 10),
            $ = !1,
            _ = 0,
            aa = 0,
            ba = 0,
            ca = 0,
            da = 0,
            ea = 0,
            fa = 0,
            ga = 0,
            ha = 0,
            ia = 0,
            ja = 0,
            ka = 1,
            la = [],
            ma = [],
            na = {},
            oa = T.selectionPalette.slice(0),
            pa = T.maxSelectionSize,
            qa = "sp-dragging",
            ra = null,
            sa = f.ownerDocument,
            ta = (sa.body, a(f)),
            ua = !1,
            va = a(s, sa).addClass(X),
            wa = va.find(".sp-picker-container"),
            xa = va.find(".sp-color"),
            ya = va.find(".sp-dragger"),
            za = va.find(".sp-hue"),
            Aa = va.find(".sp-slider"),
            Ba = va.find(".sp-alpha-inner"),
            Ca = va.find(".sp-alpha"),
            Da = va.find(".sp-alpha-handle"),
            Ea = va.find(".sp-input"),
            Fa = va.find(".sp-palette"),
            Ga = va.find(".sp-initial"),
            Ha = va.find(".sp-cancel"),
            Ia = va.find(".sp-clear"),
            Ja = va.find(".sp-choose"),
            Ka = va.find(".sp-palette-toggle"),
            La = ta.is("input"),
            Ma = La && q && "color" === ta.attr("type"),
            Na = La && !U,
            Oa = Na ? a(r).addClass(X).addClass(T.className).addClass(T.replacerClassName) : a([]),
            Pa = Na ? Oa : ta,
            Qa = Oa.find(".sp-preview-inner"),
            Ra = T.color || La && ta.val(),
            Sa = !1,
            Ta = T.preferredFormat,
            Ua = Ta,
            Va = !T.showButtons || T.clickoutFiresChange,
            Wa = !Ra,
            Xa = T.allowEmpty && !Ma;
        m();
        var Ya = {
            show: C,
            hide: E,
            toggle: B,
            reflow: N,
            option: P,
            enable: Q,
            disable: R,
            offset: S,
            set: function(a) {
                G(a), M()
            },
            get: H,
            destroy: O,
            container: va
        };
        return Ya.id = n.push(Ya) - 1, Ya
    }

    function g(b, c) {
        var d = 0,
            e = b.outerWidth(),
            f = b.outerHeight(),
            g = c.outerHeight(),
            h = b[0].ownerDocument,
            i = h.documentElement,
            j = i.clientWidth + a(h).scrollLeft(),
            k = i.clientHeight + a(h).scrollTop(),
            l = c.offset();
        return l.top += g, l.left -= Math.min(l.left, l.left + e > j && j > e ? Math.abs(l.left + e - j) : 0), l.top -= Math.min(l.top, l.top + f > k && k > f ? Math.abs(f + g - d) : d), l
    }

    function h() {}

    function i(a) {
        a.stopPropagation()
    }

    function j(a, b) {
        var c = Array.prototype.slice,
            d = c.call(arguments, 2);
        return function() {
            return a.apply(b, d.concat(c.call(arguments)))
        }
    }

    function k(b, c, d, e) {
        function f(a) {
            a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), a.returnValue = !1
        }

        function g(a) {
            if (k) {
                if (o && j.documentMode < 9 && !a.button) return i();
                var d = a.originalEvent && a.originalEvent.touches,
                    e = d ? d[0].pageX : a.pageX,
                    g = d ? d[0].pageY : a.pageY,
                    h = Math.max(0, Math.min(e - l.left, n)),
                    q = Math.max(0, Math.min(g - l.top, m));
                p && f(a), c.apply(b, [h, q, a])
            }
        }

        function h(c) {
            var e = c.which ? 3 == c.which : 2 == c.button;
            e || k || d.apply(b, arguments) !== !1 && (k = !0, m = a(b).height(), n = a(b).width(), l = a(b).offset(), a(j).bind(q), a(j.body).addClass("sp-dragging"), p || g(c), f(c))
        }

        function i() {
            k && (a(j).unbind(q), a(j.body).removeClass("sp-dragging"), e.apply(b, arguments)), k = !1
        }
        c = c || function() {}, d = d || function() {}, e = e || function() {};
        var j = document,
            k = !1,
            l = {},
            m = 0,
            n = 0,
            p = "ontouchstart" in window,
            q = {};
        q.selectstart = f, q.dragstart = f, q["touchmove mousemove"] = g, q["touchend mouseup"] = i, a(b).bind("touchstart mousedown", h)
    }

    function l(a, b, c) {
        var d;
        return function() {
            var e = this,
                f = arguments,
                g = function() {
                    d = null, a.apply(e, f)
                };
            c && clearTimeout(d), (c || !d) && (d = setTimeout(g, b))
        }
    }
    var m = {
            beforeShow: h,
            move: h,
            change: h,
            show: h,
            hide: h,
            color: !1,
            flat: !1,
            showInput: !1,
            allowEmpty: !1,
            showButtons: !0,
            clickoutFiresChange: !1,
            showInitial: !1,
            showPalette: !1,
            showPaletteOnly: !1,
            hideAfterPaletteSelect: !1,
            togglePaletteOnly: !1,
            showSelectionPalette: !0,
            localStorageKey: !1,
            appendTo: "body",
            maxSelectionSize: 7,
            cancelText: "cancel",
            chooseText: "choose",
            togglePaletteMoreText: "more",
            togglePaletteLessText: "less",
            clearText: "Clear Color Selection",
            noColorSelectedText: "No Color Selected",
            preferredFormat: !1,
            className: "",
            containerClassName: "",
            replacerClassName: "",
            showAlpha: !1,
            theme: "sp-light",
            palette: [
                ["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]
            ],
            selectionPalette: [],
            disabled: !1,
            offset: null,
            showBound: !1
        },
        n = [],
        o = !!/msie/i.exec(window.navigator.userAgent),
        p = function() {
            function a(a, b) {
                return !!~("" + a).indexOf(b)
            }
            var b = document.createElement("div"),
                c = b.style;
            return c.cssText = "background-color:rgba(0,0,0,.5)", a(c.backgroundColor, "rgba") || a(c.backgroundColor, "hsla")
        }(),
        q = function() {
            var b = a("<input type='color' value='!' />")[0];
            return "color" === b.type && "!" !== b.value
        }(),
        r = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "</div>"].join(""),
        s = function() {
            var a = "";
            if (o)
                for (var b = 1; 6 >= b; b++) a += "<div class='sp-" + b + "'></div>";
            return ["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "<div class='sp-palette-button-container sp-cf'>", "<button type='button' class='sp-palette-toggle'></button>", "</div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-clear sp-clear-display'>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", a, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "<div class='sp-button-container sp-cf'>", "<a class='sp-cancel' href='#'></a>", "<button type='button' class='sp-choose'></button>", "</div>", "</div>", "</div>"].join("")
        }(),
        t = "spectrum.id";
    a.fn.spectrum = function(b, c) {
            if ("string" == typeof b) {
                var d = this,
                    e = Array.prototype.slice.call(arguments, 1);
                return this.each(function() {
                    var c = n[a(this).data(t)];
                    if (c) {
                        var f = c[b];
                        if (!f) throw new Error("Spectrum: no such method: '" + b + "'");
                        "get" == b ? d = c.get() : "container" == b ? d = c.container : "option" == b ? d = c.option.apply(c, e) : "destroy" == b ? (c.destroy(), a(this).removeData(t)) : f.apply(c, e)
                    }
                }), d
            }
            return this.spectrum("destroy").each(function() {
                var c = a.extend({}, b, a(this).data()),
                    d = f(this, c);
                a(this).data(t, d.id)
            })
        }, a.fn.spectrum.load = !0, a.fn.spectrum.loadOpts = {}, a.fn.spectrum.draggable = k, a.fn.spectrum.defaults = m, a.spectrum = {}, a.spectrum.localization = {}, a.spectrum.palettes = {}, a.fn.spectrum.processNativeColorInputs = function() {
            q || a("input[type=color]").spectrum({
                preferredFormat: "hex6"
            })
        },
        function() {
            function a(a) {
                var c = {
                        r: 0,
                        g: 0,
                        b: 0
                    },
                    e = 1,
                    g = !1,
                    h = !1;
                return "string" == typeof a && (a = G(a)), "object" == typeof a && (a.hasOwnProperty("r") && a.hasOwnProperty("g") && a.hasOwnProperty("b") ? (c = b(a.r, a.g, a.b), g = !0, h = "%" === String(a.r).substr(-1) ? "prgb" : "rgb") : a.hasOwnProperty("h") && a.hasOwnProperty("s") && a.hasOwnProperty("v") ? (a.s = D(a.s), a.v = D(a.v), c = f(a.h, a.s, a.v), g = !0, h = "hsv") : a.hasOwnProperty("h") && a.hasOwnProperty("s") && a.hasOwnProperty("l") && (a.s = D(a.s), a.l = D(a.l), c = d(a.h, a.s, a.l), g = !0, h = "hsl"), a.hasOwnProperty("a") && (e = a.a)), e = w(e), {
                    ok: g,
                    format: a.format || h,
                    r: M(255, N(c.r, 0)),
                    g: M(255, N(c.g, 0)),
                    b: M(255, N(c.b, 0)),
                    a: e
                }
            }

            function b(a, b, c) {
                return {
                    r: 255 * x(a, 255),
                    g: 255 * x(b, 255),
                    b: 255 * x(c, 255)
                }
            }

            function c(a, b, c) {
                a = x(a, 255), b = x(b, 255), c = x(c, 255);
                var d, e, f = N(a, b, c),
                    g = M(a, b, c),
                    h = (f + g) / 2;
                if (f == g) d = e = 0;
                else {
                    var i = f - g;
                    switch (e = h > .5 ? i / (2 - f - g) : i / (f + g), f) {
                        case a:
                            d = (b - c) / i + (c > b ? 6 : 0);
                            break;
                        case b:
                            d = (c - a) / i + 2;
                            break;
                        case c:
                            d = (a - b) / i + 4
                    }
                    d /= 6
                }
                return {
                    h: d,
                    s: e,
                    l: h
                }
            }

            function d(a, b, c) {
                function d(a, b, c) {
                    return 0 > c && (c += 1), c > 1 && (c -= 1), 1 / 6 > c ? a + 6 * (b - a) * c : .5 > c ? b : 2 / 3 > c ? a + (b - a) * (2 / 3 - c) * 6 : a
                }
                var e, f, g;
                if (a = x(a, 360), b = x(b, 100), c = x(c, 100), 0 === b) e = f = g = c;
                else {
                    var h = .5 > c ? c * (1 + b) : c + b - c * b,
                        i = 2 * c - h;
                    e = d(i, h, a + 1 / 3), f = d(i, h, a), g = d(i, h, a - 1 / 3)
                }
                return {
                    r: 255 * e,
                    g: 255 * f,
                    b: 255 * g
                }
            }

            function e(a, b, c) {
                a = x(a, 255), b = x(b, 255), c = x(c, 255);
                var d, e, f = N(a, b, c),
                    g = M(a, b, c),
                    h = f,
                    i = f - g;
                if (e = 0 === f ? 0 : i / f, f == g) d = 0;
                else {
                    switch (f) {
                        case a:
                            d = (b - c) / i + (c > b ? 6 : 0);
                            break;
                        case b:
                            d = (c - a) / i + 2;
                            break;
                        case c:
                            d = (a - b) / i + 4
                    }
                    d /= 6
                }
                return {
                    h: d,
                    s: e,
                    v: h
                }
            }

            function f(a, b, c) {
                a = 6 * x(a, 360), b = x(b, 100), c = x(c, 100);
                var d = K.floor(a),
                    e = a - d,
                    f = c * (1 - b),
                    g = c * (1 - e * b),
                    h = c * (1 - (1 - e) * b),
                    i = d % 6,
                    j = [c, g, f, f, h, c][i],
                    k = [h, c, c, g, f, f][i],
                    l = [f, f, h, c, c, g][i];
                return {
                    r: 255 * j,
                    g: 255 * k,
                    b: 255 * l
                }
            }

            function g(a, b, c, d) {
                var e = [C(L(a).toString(16)), C(L(b).toString(16)), C(L(c).toString(16))];
                return d && e[0].charAt(0) == e[0].charAt(1) && e[1].charAt(0) == e[1].charAt(1) && e[2].charAt(0) == e[2].charAt(1) ? e[0].charAt(0) + e[1].charAt(0) + e[2].charAt(0) : e.join("")
            }

            function h(a, b, c, d) {
                var e = [C(E(d)), C(L(a).toString(16)), C(L(b).toString(16)), C(L(c).toString(16))];
                return e.join("")
            }

            function i(a, b) {
                b = 0 === b ? 0 : b || 10;
                var c = P(a).toHsl();
                return c.s -= b / 100, c.s = y(c.s), P(c)
            }

            function j(a, b) {
                b = 0 === b ? 0 : b || 10;
                var c = P(a).toHsl();
                return c.s += b / 100, c.s = y(c.s), P(c)
            }

            function k(a) {
                return P(a).desaturate(100)
            }

            function l(a, b) {
                b = 0 === b ? 0 : b || 10;
                var c = P(a).toHsl();
                return c.l += b / 100, c.l = y(c.l), P(c)
            }

            function m(a, b) {
                b = 0 === b ? 0 : b || 10;
                var c = P(a).toRgb();
                return c.r = N(0, M(255, c.r - L(255 * -(b / 100)))), c.g = N(0, M(255, c.g - L(255 * -(b / 100)))), c.b = N(0, M(255, c.b - L(255 * -(b / 100)))), P(c)
            }

            function n(a, b) {
                b = 0 === b ? 0 : b || 10;
                var c = P(a).toHsl();
                return c.l -= b / 100, c.l = y(c.l), P(c)
            }

            function o(a, b) {
                var c = P(a).toHsl(),
                    d = (L(c.h) + b) % 360;
                return c.h = 0 > d ? 360 + d : d, P(c)
            }

            function p(a) {
                var b = P(a).toHsl();
                return b.h = (b.h + 180) % 360, P(b)
            }

            function q(a) {
                var b = P(a).toHsl(),
                    c = b.h;
                return [P(a), P({
                    h: (c + 120) % 360,
                    s: b.s,
                    l: b.l
                }), P({
                    h: (c + 240) % 360,
                    s: b.s,
                    l: b.l
                })]
            }

            function r(a) {
                var b = P(a).toHsl(),
                    c = b.h;
                return [P(a), P({
                    h: (c + 90) % 360,
                    s: b.s,
                    l: b.l
                }), P({
                    h: (c + 180) % 360,
                    s: b.s,
                    l: b.l
                }), P({
                    h: (c + 270) % 360,
                    s: b.s,
                    l: b.l
                })]
            }

            function s(a) {
                var b = P(a).toHsl(),
                    c = b.h;
                return [P(a), P({
                    h: (c + 72) % 360,
                    s: b.s,
                    l: b.l
                }), P({
                    h: (c + 216) % 360,
                    s: b.s,
                    l: b.l
                })]
            }

            function t(a, b, c) {
                b = b || 6, c = c || 30;
                var d = P(a).toHsl(),
                    e = 360 / c,
                    f = [P(a)];
                for (d.h = (d.h - (e * b >> 1) + 720) % 360; --b;) d.h = (d.h + e) % 360, f.push(P(d));
                return f
            }

            function u(a, b) {
                b = b || 6;
                for (var c = P(a).toHsv(), d = c.h, e = c.s, f = c.v, g = [], h = 1 / b; b--;) g.push(P({
                    h: d,
                    s: e,
                    v: f
                })), f = (f + h) % 1;
                return g
            }

            function v(a) {
                var b = {};
                for (var c in a) a.hasOwnProperty(c) && (b[a[c]] = c);
                return b
            }

            function w(a) {
                return a = parseFloat(a), (isNaN(a) || 0 > a || a > 1) && (a = 1), a
            }

            function x(a, b) {
                A(a) && (a = "100%");
                var c = B(a);
                return a = M(b, N(0, parseFloat(a))), c && (a = parseInt(a * b, 10) / 100), K.abs(a - b) < 1e-6 ? 1 : a % b / parseFloat(b)
            }

            function y(a) {
                return M(1, N(0, a))
            }

            function z(a) {
                return parseInt(a, 16)
            }

            function A(a) {
                return "string" == typeof a && -1 != a.indexOf(".") && 1 === parseFloat(a)
            }

            function B(a) {
                return "string" == typeof a && -1 != a.indexOf("%")
            }

            function C(a) {
                return 1 == a.length ? "0" + a : "" + a
            }

            function D(a) {
                return 1 >= a && (a = 100 * a + "%"), a
            }

            function E(a) {
                return Math.round(255 * parseFloat(a)).toString(16)
            }

            function F(a) {
                return z(a) / 255
            }

            function G(a) {
                a = a.replace(H, "").replace(I, "").toLowerCase();
                var b = !1;
                if (Q[a]) a = Q[a], b = !0;
                else if ("transparent" == a) return {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0,
                    format: "name"
                };
                var c;
                return (c = S.rgb.exec(a)) ? {
                    r: c[1],
                    g: c[2],
                    b: c[3]
                } : (c = S.rgba.exec(a)) ? {
                    r: c[1],
                    g: c[2],
                    b: c[3],
                    a: c[4]
                } : (c = S.hsl.exec(a)) ? {
                    h: c[1],
                    s: c[2],
                    l: c[3]
                } : (c = S.hsla.exec(a)) ? {
                    h: c[1],
                    s: c[2],
                    l: c[3],
                    a: c[4]
                } : (c = S.hsv.exec(a)) ? {
                    h: c[1],
                    s: c[2],
                    v: c[3]
                } : (c = S.hsva.exec(a)) ? {
                    h: c[1],
                    s: c[2],
                    v: c[3],
                    a: c[4]
                } : (c = S.hex8.exec(a)) ? {
                    a: F(c[1]),
                    r: z(c[2]),
                    g: z(c[3]),
                    b: z(c[4]),
                    format: b ? "name" : "hex8"
                } : (c = S.hex6.exec(a)) ? {
                    r: z(c[1]),
                    g: z(c[2]),
                    b: z(c[3]),
                    format: b ? "name" : "hex"
                } : (c = S.hex3.exec(a)) ? {
                    r: z(c[1] + "" + c[1]),
                    g: z(c[2] + "" + c[2]),
                    b: z(c[3] + "" + c[3]),
                    format: b ? "name" : "hex"
                } : !1
            }
            var H = /^[\s,#]+/,
                I = /\s+$/,
                J = 0,
                K = Math,
                L = K.round,
                M = K.min,
                N = K.max,
                O = K.random,
                P = function T(b, c) {
                    if (b = b ? b : "", c = c || {}, b instanceof T) return b;
                    if (!(this instanceof T)) return new T(b, c);
                    var d = a(b);
                    this._originalInput = b, this._r = d.r, this._g = d.g, this._b = d.b, this._a = d.a, this._roundA = L(100 * this._a) / 100, this._format = c.format || d.format, this._gradientType = c.gradientType, this._r < 1 && (this._r = L(this._r)), this._g < 1 && (this._g = L(this._g)), this._b < 1 && (this._b = L(this._b)), this._ok = d.ok, this._tc_id = J++
                };
            P.prototype = {
                isDark: function() {
                    return this.getBrightness() < 128
                },
                isLight: function() {
                    return !this.isDark()
                },
                isValid: function() {
                    return this._ok
                },
                getOriginalInput: function() {
                    return this._originalInput
                },
                getFormat: function() {
                    return this._format
                },
                getAlpha: function() {
                    return this._a
                },
                getBrightness: function() {
                    var a = this.toRgb();
                    return (299 * a.r + 587 * a.g + 114 * a.b) / 1e3
                },
                setAlpha: function(a) {
                    return this._a = w(a), this._roundA = L(100 * this._a) / 100, this
                },
                toHsv: function() {
                    var a = e(this._r, this._g, this._b);
                    return {
                        h: 360 * a.h,
                        s: a.s,
                        v: a.v,
                        a: this._a
                    }
                },
                toHsvString: function() {
                    var a = e(this._r, this._g, this._b),
                        b = L(360 * a.h),
                        c = L(100 * a.s),
                        d = L(100 * a.v);
                    return 1 == this._a ? "hsv(" + b + ", " + c + "%, " + d + "%)" : "hsva(" + b + ", " + c + "%, " + d + "%, " + this._roundA + ")"
                },
                toHsl: function() {
                    var a = c(this._r, this._g, this._b);
                    return {
                        h: 360 * a.h,
                        s: a.s,
                        l: a.l,
                        a: this._a
                    }
                },
                toHslString: function() {
                    var a = c(this._r, this._g, this._b),
                        b = L(360 * a.h),
                        d = L(100 * a.s),
                        e = L(100 * a.l);
                    return 1 == this._a ? "hsl(" + b + ", " + d + "%, " + e + "%)" : "hsla(" + b + ", " + d + "%, " + e + "%, " + this._roundA + ")"
                },
                toHex: function(a) {
                    return g(this._r, this._g, this._b, a)
                },
                toHexString: function(a) {
                    return "#" + this.toHex(a)
                },
                toHex8: function() {
                    return h(this._r, this._g, this._b, this._a)
                },
                toHex8String: function() {
                    return "#" + this.toHex8()
                },
                toRgb: function() {
                    return {
                        r: L(this._r),
                        g: L(this._g),
                        b: L(this._b),
                        a: this._a
                    }
                },
                toRgbString: function() {
                    return 1 == this._a ? "rgb(" + L(this._r) + ", " + L(this._g) + ", " + L(this._b) + ")" : "rgba(" + L(this._r) + ", " + L(this._g) + ", " + L(this._b) + ", " + this._roundA + ")"
                },
                toPercentageRgb: function() {
                    return {
                        r: L(100 * x(this._r, 255)) + "%",
                        g: L(100 * x(this._g, 255)) + "%",
                        b: L(100 * x(this._b, 255)) + "%",
                        a: this._a
                    }
                },
                toPercentageRgbString: function() {
                    return 1 == this._a ? "rgb(" + L(100 * x(this._r, 255)) + "%, " + L(100 * x(this._g, 255)) + "%, " + L(100 * x(this._b, 255)) + "%)" : "rgba(" + L(100 * x(this._r, 255)) + "%, " + L(100 * x(this._g, 255)) + "%, " + L(100 * x(this._b, 255)) + "%, " + this._roundA + ")"
                },
                toName: function() {
                    return 0 === this._a ? "transparent" : this._a < 1 ? !1 : R[g(this._r, this._g, this._b, !0)] || !1
                },
                toFilter: function(a) {
                    var b = "#" + h(this._r, this._g, this._b, this._a),
                        c = b,
                        d = this._gradientType ? "GradientType = 1, " : "";
                    if (a) {
                        var e = P(a);
                        c = e.toHex8String()
                    }
                    return "progid:DXImageTransform.Microsoft.gradient(" + d + "startColorstr=" + b + ",endColorstr=" + c + ")"
                },
                toString: function(a) {
                    var b = !!a;
                    a = a || this._format;
                    var c = !1,
                        d = this._a < 1 && this._a >= 0,
                        e = !b && d && ("hex" === a || "hex6" === a || "hex3" === a || "name" === a);
                    return e ? "name" === a && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === a && (c = this.toRgbString()), "prgb" === a && (c = this.toPercentageRgbString()), ("hex" === a || "hex6" === a) && (c = this.toHexString()), "hex3" === a && (c = this.toHexString(!0)), "hex8" === a && (c = this.toHex8String()), "name" === a && (c = this.toName()), "hsl" === a && (c = this.toHslString()), "hsv" === a && (c = this.toHsvString()), c || this.toHexString())
                },
                _applyModification: function(a, b) {
                    var c = a.apply(null, [this].concat([].slice.call(b)));
                    return this._r = c._r, this._g = c._g, this._b = c._b, this.setAlpha(c._a), this
                },
                lighten: function() {
                    return this._applyModification(l, arguments)
                },
                brighten: function() {
                    return this._applyModification(m, arguments)
                },
                darken: function() {
                    return this._applyModification(n, arguments)
                },
                desaturate: function() {
                    return this._applyModification(i, arguments)
                },
                saturate: function() {
                    return this._applyModification(j, arguments)
                },
                greyscale: function() {
                    return this._applyModification(k, arguments)
                },
                spin: function() {
                    return this._applyModification(o, arguments)
                },
                _applyCombination: function(a, b) {
                    return a.apply(null, [this].concat([].slice.call(b)))
                },
                analogous: function() {
                    return this._applyCombination(t, arguments)
                },
                complement: function() {
                    return this._applyCombination(p, arguments)
                },
                monochromatic: function() {
                    return this._applyCombination(u, arguments)
                },
                splitcomplement: function() {
                    return this._applyCombination(s, arguments)
                },
                triad: function() {
                    return this._applyCombination(q, arguments)
                },
                tetrad: function() {
                    return this._applyCombination(r, arguments)
                }
            }, P.fromRatio = function(a, b) {
                if ("object" == typeof a) {
                    var c = {};
                    for (var d in a) a.hasOwnProperty(d) && ("a" === d ? c[d] = a[d] : c[d] = D(a[d]));
                    a = c
                }
                return P(a, b)
            }, P.equals = function(a, b) {
                return a && b ? P(a).toRgbString() == P(b).toRgbString() : !1
            }, P.random = function() {
                return P.fromRatio({
                    r: O(),
                    g: O(),
                    b: O()
                })
            }, P.mix = function(a, b, c) {
                c = 0 === c ? 0 : c || 50;
                var d, e = P(a).toRgb(),
                    f = P(b).toRgb(),
                    g = c / 100,
                    h = 2 * g - 1,
                    i = f.a - e.a;
                d = h * i == -1 ? h : (h + i) / (1 + h * i), d = (d + 1) / 2;
                var j = 1 - d,
                    k = {
                        r: f.r * d + e.r * j,
                        g: f.g * d + e.g * j,
                        b: f.b * d + e.b * j,
                        a: f.a * g + e.a * (1 - g)
                    };
                return P(k)
            }, P.readability = function(a, b) {
                var c = P(a),
                    d = P(b),
                    e = c.toRgb(),
                    f = d.toRgb(),
                    g = c.getBrightness(),
                    h = d.getBrightness(),
                    i = Math.max(e.r, f.r) - Math.min(e.r, f.r) + Math.max(e.g, f.g) - Math.min(e.g, f.g) + Math.max(e.b, f.b) - Math.min(e.b, f.b);
                return {
                    brightness: Math.abs(g - h),
                    color: i
                }
            }, P.isReadable = function(a, b) {
                var c = P.readability(a, b);
                return c.brightness > 125 && c.color > 500
            }, P.mostReadable = function(a, b) {
                for (var c = null, d = 0, e = !1, f = 0; f < b.length; f++) {
                    var g = P.readability(a, b[f]),
                        h = g.brightness > 125 && g.color > 500,
                        i = 3 * (g.brightness / 125) + g.color / 500;
                    (h && !e || h && e && i > d || !h && !e && i > d) && (e = h, d = i, c = P(b[f]))
                }
                return c
            };
            var Q = P.names = {
                    aliceblue: "f0f8ff",
                    antiquewhite: "faebd7",
                    aqua: "0ff",
                    aquamarine: "7fffd4",
                    azure: "f0ffff",
                    beige: "f5f5dc",
                    bisque: "ffe4c4",
                    black: "000",
                    blanchedalmond: "ffebcd",
                    blue: "00f",
                    blueviolet: "8a2be2",
                    brown: "a52a2a",
                    burlywood: "deb887",
                    burntsienna: "ea7e5d",
                    cadetblue: "5f9ea0",
                    chartreuse: "7fff00",
                    chocolate: "d2691e",
                    coral: "ff7f50",
                    cornflowerblue: "6495ed",
                    cornsilk: "fff8dc",
                    crimson: "dc143c",
                    cyan: "0ff",
                    darkblue: "00008b",
                    darkcyan: "008b8b",
                    darkgoldenrod: "b8860b",
                    darkgray: "a9a9a9",
                    darkgreen: "006400",
                    darkgrey: "a9a9a9",
                    darkkhaki: "bdb76b",
                    darkmagenta: "8b008b",
                    darkolivegreen: "556b2f",
                    darkorange: "ff8c00",
                    darkorchid: "9932cc",
                    darkred: "8b0000",
                    darksalmon: "e9967a",
                    darkseagreen: "8fbc8f",
                    darkslateblue: "483d8b",
                    darkslategray: "2f4f4f",
                    darkslategrey: "2f4f4f",
                    darkturquoise: "00ced1",
                    darkviolet: "9400d3",
                    deeppink: "ff1493",
                    deepskyblue: "00bfff",
                    dimgray: "696969",
                    dimgrey: "696969",
                    dodgerblue: "1e90ff",
                    firebrick: "b22222",
                    floralwhite: "fffaf0",
                    forestgreen: "228b22",
                    fuchsia: "f0f",
                    gainsboro: "dcdcdc",
                    ghostwhite: "f8f8ff",
                    gold: "ffd700",
                    goldenrod: "daa520",
                    gray: "808080",
                    green: "008000",
                    greenyellow: "adff2f",
                    grey: "808080",
                    honeydew: "f0fff0",
                    hotpink: "ff69b4",
                    indianred: "cd5c5c",
                    indigo: "4b0082",
                    ivory: "fffff0",
                    khaki: "f0e68c",
                    lavender: "e6e6fa",
                    lavenderblush: "fff0f5",
                    lawngreen: "7cfc00",
                    lemonchiffon: "fffacd",
                    lightblue: "add8e6",
                    lightcoral: "f08080",
                    lightcyan: "e0ffff",
                    lightgoldenrodyellow: "fafad2",
                    lightgray: "d3d3d3",
                    lightgreen: "90ee90",
                    lightgrey: "d3d3d3",
                    lightpink: "ffb6c1",
                    lightsalmon: "ffa07a",
                    lightseagreen: "20b2aa",
                    lightskyblue: "87cefa",
                    lightslategray: "789",
                    lightslategrey: "789",
                    lightsteelblue: "b0c4de",
                    lightyellow: "ffffe0",
                    lime: "0f0",
                    limegreen: "32cd32",
                    linen: "faf0e6",
                    magenta: "f0f",
                    maroon: "800000",
                    mediumaquamarine: "66cdaa",
                    mediumblue: "0000cd",
                    mediumorchid: "ba55d3",
                    mediumpurple: "9370db",
                    mediumseagreen: "3cb371",
                    mediumslateblue: "7b68ee",
                    mediumspringgreen: "00fa9a",
                    mediumturquoise: "48d1cc",
                    mediumvioletred: "c71585",
                    midnightblue: "191970",
                    mintcream: "f5fffa",
                    mistyrose: "ffe4e1",
                    moccasin: "ffe4b5",
                    navajowhite: "ffdead",
                    navy: "000080",
                    oldlace: "fdf5e6",
                    olive: "808000",
                    olivedrab: "6b8e23",
                    orange: "ffa500",
                    orangered: "ff4500",
                    orchid: "da70d6",
                    palegoldenrod: "eee8aa",
                    palegreen: "98fb98",
                    paleturquoise: "afeeee",
                    palevioletred: "db7093",
                    papayawhip: "ffefd5",
                    peachpuff: "ffdab9",
                    peru: "cd853f",
                    pink: "ffc0cb",
                    plum: "dda0dd",
                    powderblue: "b0e0e6",
                    purple: "800080",
                    rebeccapurple: "663399",
                    red: "f00",
                    rosybrown: "bc8f8f",
                    royalblue: "4169e1",
                    saddlebrown: "8b4513",
                    salmon: "fa8072",
                    sandybrown: "f4a460",
                    seagreen: "2e8b57",
                    seashell: "fff5ee",
                    sienna: "a0522d",
                    silver: "c0c0c0",
                    skyblue: "87ceeb",
                    slateblue: "6a5acd",
                    slategray: "708090",
                    slategrey: "708090",
                    snow: "fffafa",
                    springgreen: "00ff7f",
                    steelblue: "4682b4",
                    tan: "d2b48c",
                    teal: "008080",
                    thistle: "d8bfd8",
                    tomato: "ff6347",
                    turquoise: "40e0d0",
                    violet: "ee82ee",
                    wheat: "f5deb3",
                    white: "fff",
                    whitesmoke: "f5f5f5",
                    yellow: "ff0",
                    yellowgreen: "9acd32"
                },
                R = P.hexNames = v(Q),
                S = function() {
                    var a = "[-\\+]?\\d+%?",
                        b = "[-\\+]?\\d*\\.\\d+%?",
                        c = "(?:" + b + ")|(?:" + a + ")",
                        d = "[\\s|\\(]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")\\s*\\)?",
                        e = "[\\s|\\(]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")[,|\\s]+(" + c + ")\\s*\\)?";
                    return {
                        rgb: new RegExp("rgb" + d),
                        rgba: new RegExp("rgba" + e),
                        hsl: new RegExp("hsl" + d),
                        hsla: new RegExp("hsla" + e),
                        hsv: new RegExp("hsv" + d),
                        hsva: new RegExp("hsva" + e),
                        hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                        hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                        hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
                    }
                }();
            window.tinycolor = P
        }(), a(function() {
            a.fn.spectrum.load && a.fn.spectrum.processNativeColorInputs()
        })
}),
function(a) {
    return this.version = "(beta)(0.0.3)", this.all = {}, this.special_keys = {
        27: "esc",
        9: "tab",
        32: "space",
        13: "return",
        8: "backspace",
        145: "scroll",
        20: "capslock",
        144: "numlock",
        19: "pause",
        45: "insert",
        36: "home",
        46: "del",
        35: "end",
        33: "pageup",
        34: "pagedown",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        112: "f1",
        113: "f2",
        114: "f3",
        115: "f4",
        116: "f5",
        117: "f6",
        118: "f7",
        119: "f8",
        120: "f9",
        121: "f10",
        122: "f11",
        123: "f12"
    }, this.shift_nums = {
        "`": "~",
        1: "!",
        2: "@",
        3: "#",
        4: "$",
        5: "%",
        6: "^",
        7: "&",
        8: "*",
        9: "(",
        0: ")",
        "-": "_",
        "=": "+",
        ";": ":",
        "'": '"',
        ",": "<",
        ".": ">",
        "/": "?",
        "\\": "|"
    }, this.add = function(b, c, d) {
        a.isFunction(c) && (d = c, c = {});
        var e = {},
            f = {
                type: "keydown",
                propagate: !1,
                disableInInput: !1,
                target: a("html")[0],
                checkParent: !0
            },
            g = this;
        e = a.extend(e, f, c || {}), b = b.toLowerCase();
        var h = function(b) {
            b = a.event.fix(b);
            var c = b.target;
            if (c = 3 == c.nodeType ? c.parentNode : c,
                e.disableInInput) {
                var d = a(c);
                if (d.is("input") || d.is("textarea")) return
            }
            var f = b.which,
                h = b.type,
                i = String.fromCharCode(f).toLowerCase(),
                j = g.special_keys[f],
                k = b.shiftKey,
                l = b.ctrlKey,
                m = b.altKey,
                n = null;
            if (a.browser.opera || a.browser.safari || e.checkParent)
                for (; !g.all[c] && c.parentNode;) c = c.parentNode;
            var o = g.all[c].events[h].callbackMap;
            if (k || l || m) {
                var p = "";
                m && (p += "alt+"), l && (p += "ctrl+"), k && (p += "shift+"), n = o[p + j] || o[p + i] || o[p + g.shift_nums[i]]
            } else n = o[j] || o[i];
            return n && (n.cb(b), !n.propagate) ? (b.stopPropagation(), b.preventDefault(), !1) : void 0
        };
        return this.all[e.target] || (this.all[e.target] = {
            events: {}
        }), this.all[e.target].events[e.type] || (this.all[e.target].events[e.type] = {
            callbackMap: {}
        }, a.event.add(e.target, e.type, h)), this.all[e.target].events[e.type].callbackMap[b] = {
            cb: d,
            propagate: e.propagate
        }, a
    }, this.remove = function(b, c) {
        return c = c || {}, target = c.target || a("html")[0], type = c.type || "keydown", b = b.toLowerCase(), delete this.all[target].events[type].callbackMap[b], a
    }, a.hotkeys = this, a
}(jQuery),
function(a) {
    if ("object" == typeof exports) module.exports = a();
    else if ("function" == typeof define && define.amd) define(a);
    else {
        var b;
        try {
            b = window
        } catch (c) {
            b = self
        }
        b.SparkMD5 = a()
    }
}(function(a) {
    "use strict";

    function b(a, b, c, d, e, f) {
        return b = t(t(b, a), t(d, f)), t(b << e | b >>> 32 - e, c)
    }

    function c(a, c, d, e, f, g, h) {
        return b(c & d | ~c & e, a, c, f, g, h)
    }

    function d(a, c, d, e, f, g, h) {
        return b(c & e | d & ~e, a, c, f, g, h)
    }

    function e(a, c, d, e, f, g, h) {
        return b(c ^ d ^ e, a, c, f, g, h)
    }

    function f(a, c, d, e, f, g, h) {
        return b(d ^ (c | ~e), a, c, f, g, h)
    }

    function g(a, b) {
        var g = a[0],
            h = a[1],
            i = a[2],
            j = a[3];
        g = c(g, h, i, j, b[0], 7, -680876936), j = c(j, g, h, i, b[1], 12, -389564586), i = c(i, j, g, h, b[2], 17, 606105819), h = c(h, i, j, g, b[3], 22, -1044525330), g = c(g, h, i, j, b[4], 7, -176418897), j = c(j, g, h, i, b[5], 12, 1200080426), i = c(i, j, g, h, b[6], 17, -1473231341), h = c(h, i, j, g, b[7], 22, -45705983), g = c(g, h, i, j, b[8], 7, 1770035416), j = c(j, g, h, i, b[9], 12, -1958414417), i = c(i, j, g, h, b[10], 17, -42063), h = c(h, i, j, g, b[11], 22, -1990404162), g = c(g, h, i, j, b[12], 7, 1804603682), j = c(j, g, h, i, b[13], 12, -40341101), i = c(i, j, g, h, b[14], 17, -1502002290), h = c(h, i, j, g, b[15], 22, 1236535329), g = d(g, h, i, j, b[1], 5, -165796510), j = d(j, g, h, i, b[6], 9, -1069501632), i = d(i, j, g, h, b[11], 14, 643717713), h = d(h, i, j, g, b[0], 20, -373897302), g = d(g, h, i, j, b[5], 5, -701558691), j = d(j, g, h, i, b[10], 9, 38016083), i = d(i, j, g, h, b[15], 14, -660478335), h = d(h, i, j, g, b[4], 20, -405537848), g = d(g, h, i, j, b[9], 5, 568446438), j = d(j, g, h, i, b[14], 9, -1019803690), i = d(i, j, g, h, b[3], 14, -187363961), h = d(h, i, j, g, b[8], 20, 1163531501), g = d(g, h, i, j, b[13], 5, -1444681467), j = d(j, g, h, i, b[2], 9, -51403784), i = d(i, j, g, h, b[7], 14, 1735328473), h = d(h, i, j, g, b[12], 20, -1926607734), g = e(g, h, i, j, b[5], 4, -378558), j = e(j, g, h, i, b[8], 11, -2022574463), i = e(i, j, g, h, b[11], 16, 1839030562), h = e(h, i, j, g, b[14], 23, -35309556), g = e(g, h, i, j, b[1], 4, -1530992060), j = e(j, g, h, i, b[4], 11, 1272893353), i = e(i, j, g, h, b[7], 16, -155497632), h = e(h, i, j, g, b[10], 23, -1094730640), g = e(g, h, i, j, b[13], 4, 681279174), j = e(j, g, h, i, b[0], 11, -358537222), i = e(i, j, g, h, b[3], 16, -722521979), h = e(h, i, j, g, b[6], 23, 76029189), g = e(g, h, i, j, b[9], 4, -640364487), j = e(j, g, h, i, b[12], 11, -421815835), i = e(i, j, g, h, b[15], 16, 530742520), h = e(h, i, j, g, b[2], 23, -995338651), g = f(g, h, i, j, b[0], 6, -198630844), j = f(j, g, h, i, b[7], 10, 1126891415), i = f(i, j, g, h, b[14], 15, -1416354905), h = f(h, i, j, g, b[5], 21, -57434055), g = f(g, h, i, j, b[12], 6, 1700485571), j = f(j, g, h, i, b[3], 10, -1894986606), i = f(i, j, g, h, b[10], 15, -1051523), h = f(h, i, j, g, b[1], 21, -2054922799), g = f(g, h, i, j, b[8], 6, 1873313359), j = f(j, g, h, i, b[15], 10, -30611744), i = f(i, j, g, h, b[6], 15, -1560198380), h = f(h, i, j, g, b[13], 21, 1309151649), g = f(g, h, i, j, b[4], 6, -145523070), j = f(j, g, h, i, b[11], 10, -1120210379), i = f(i, j, g, h, b[2], 15, 718787259), h = f(h, i, j, g, b[9], 21, -343485551), a[0] = t(g, a[0]), a[1] = t(h, a[1]), a[2] = t(i, a[2]), a[3] = t(j, a[3])
    }

    function h(a) {
        var b, c = [];
        for (b = 0; 64 > b; b += 4) c[b >> 2] = a.charCodeAt(b) + (a.charCodeAt(b + 1) << 8) + (a.charCodeAt(b + 2) << 16) + (a.charCodeAt(b + 3) << 24);
        return c
    }

    function i(a) {
        var b, c = [];
        for (b = 0; 64 > b; b += 4) c[b >> 2] = a[b] + (a[b + 1] << 8) + (a[b + 2] << 16) + (a[b + 3] << 24);
        return c
    }

    function j(a) {
        var b, c, d, e, f, i, j = a.length,
            k = [1732584193, -271733879, -1732584194, 271733878];
        for (b = 64; j >= b; b += 64) g(k, h(a.substring(b - 64, b)));
        for (a = a.substring(b - 64), c = a.length, d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], b = 0; c > b; b += 1) d[b >> 2] |= a.charCodeAt(b) << (b % 4 << 3);
        if (d[b >> 2] |= 128 << (b % 4 << 3), b > 55)
            for (g(k, d), b = 0; 16 > b; b += 1) d[b] = 0;
        return e = 8 * j, e = e.toString(16).match(/(.*?)(.{0,8})$/), f = parseInt(e[2], 16), i = parseInt(e[1], 16) || 0, d[14] = f, d[15] = i, g(k, d), k
    }

    function k(a) {
        var b, c, d, e, f, h, j = a.length,
            k = [1732584193, -271733879, -1732584194, 271733878];
        for (b = 64; j >= b; b += 64) g(k, i(a.subarray(b - 64, b)));
        for (a = j > b - 64 ? a.subarray(b - 64) : new Uint8Array(0), c = a.length, d = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], b = 0; c > b; b += 1) d[b >> 2] |= a[b] << (b % 4 << 3);
        if (d[b >> 2] |= 128 << (b % 4 << 3), b > 55)
            for (g(k, d), b = 0; 16 > b; b += 1) d[b] = 0;
        return e = 8 * j, e = e.toString(16).match(/(.*?)(.{0,8})$/), f = parseInt(e[2], 16), h = parseInt(e[1], 16) || 0, d[14] = f, d[15] = h, g(k, d), k
    }

    function l(a) {
        var b, c = "";
        for (b = 0; 4 > b; b += 1) c += u[a >> 8 * b + 4 & 15] + u[a >> 8 * b & 15];
        return c
    }

    function m(a) {
        var b;
        for (b = 0; b < a.length; b += 1) a[b] = l(a[b]);
        return a.join("")
    }

    function n(a) {
        return /[\u0080-\uFFFF]/.test(a) && (a = unescape(encodeURIComponent(a))), a
    }

    function o(a, b) {
        var c, d = a.length,
            e = new ArrayBuffer(d),
            f = new Uint8Array(e);
        for (c = 0; d > c; c += 1) f[c] = a.charCodeAt(c);
        return b ? f : e
    }

    function p(a) {
        return String.fromCharCode.apply(null, new Uint8Array(a))
    }

    function q(a, b, c) {
        var d = new Uint8Array(a.byteLength + b.byteLength);
        return d.set(new Uint8Array(a)), d.set(new Uint8Array(b), a.byteLength), c ? d : d.buffer
    }

    function r(a) {
        var b, c = [],
            d = a.length;
        for (b = 0; d - 1 > b; b += 2) c.push(parseInt(a.substr(b, 2), 16));
        return String.fromCharCode.apply(String, c)
    }

    function s() {
        this.reset()
    }
    var t = function(a, b) {
            return a + b & 4294967295
        },
        u = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    return "5d41402abc4b2a76b9719d911017c592" !== m(j("hello")) && (t = function(a, b) {
        var c = (65535 & a) + (65535 & b),
            d = (a >> 16) + (b >> 16) + (c >> 16);
        return d << 16 | 65535 & c
    }), "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || ! function() {
        function b(a, b) {
            return a = 0 | a || 0, 0 > a ? Math.max(a + b, 0) : Math.min(a, b)
        }
        ArrayBuffer.prototype.slice = function(c, d) {
            var e, f, g, h, i = this.byteLength,
                j = b(c, i),
                k = i;
            return d !== a && (k = b(d, i)), j > k ? new ArrayBuffer(0) : (e = k - j, f = new ArrayBuffer(e), g = new Uint8Array(f), h = new Uint8Array(this, j, e), g.set(h), f)
        }
    }(), s.prototype.append = function(a) {
        return this.appendBinary(n(a)), this
    }, s.prototype.appendBinary = function(a) {
        this._buff += a, this._length += a.length;
        var b, c = this._buff.length;
        for (b = 64; c >= b; b += 64) g(this._hash, h(this._buff.substring(b - 64, b)));
        return this._buff = this._buff.substring(b - 64), this
    }, s.prototype.end = function(a) {
        var b, c, d = this._buff,
            e = d.length,
            f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (b = 0; e > b; b += 1) f[b >> 2] |= d.charCodeAt(b) << (b % 4 << 3);
        return this._finish(f, e), c = m(this._hash), a && (c = r(c)), this.reset(), c
    }, s.prototype.reset = function() {
        return this._buff = "", this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this
    }, s.prototype.getState = function() {
        return {
            buff: this._buff,
            length: this._length,
            hash: this._hash
        }
    }, s.prototype.setState = function(a) {
        return this._buff = a.buff, this._length = a.length, this._hash = a.hash, this
    }, s.prototype.destroy = function() {
        delete this._hash, delete this._buff, delete this._length
    }, s.prototype._finish = function(a, b) {
        var c, d, e, f = b;
        if (a[f >> 2] |= 128 << (f % 4 << 3), f > 55)
            for (g(this._hash, a), f = 0; 16 > f; f += 1) a[f] = 0;
        c = 8 * this._length, c = c.toString(16).match(/(.*?)(.{0,8})$/), d = parseInt(c[2], 16), e = parseInt(c[1], 16) || 0, a[14] = d, a[15] = e, g(this._hash, a)
    }, s.hash = function(a, b) {
        return s.hashBinary(n(a), b)
    }, s.hashBinary = function(a, b) {
        var c = j(a),
            d = m(c);
        return b ? r(d) : d
    }, s.ArrayBuffer = function() {
        this.reset()
    }, s.ArrayBuffer.prototype.append = function(a) {
        var b, c = q(this._buff.buffer, a, !0),
            d = c.length;
        for (this._length += a.byteLength, b = 64; d >= b; b += 64) g(this._hash, i(c.subarray(b - 64, b)));
        return this._buff = d > b - 64 ? new Uint8Array(c.buffer.slice(b - 64)) : new Uint8Array(0), this
    }, s.ArrayBuffer.prototype.end = function(a) {
        var b, c, d = this._buff,
            e = d.length,
            f = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (b = 0; e > b; b += 1) f[b >> 2] |= d[b] << (b % 4 << 3);
        return this._finish(f, e), c = m(this._hash), a && (c = r(c)), this.reset(), c
    }, s.ArrayBuffer.prototype.reset = function() {
        return this._buff = new Uint8Array(0), this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this
    }, s.ArrayBuffer.prototype.getState = function() {
        var a = s.prototype.getState.call(this);
        return a.buff = p(a.buff), a
    }, s.ArrayBuffer.prototype.setState = function(a) {
        return a.buff = o(a.buff, !0), s.prototype.setState.call(this, a)
    }, s.ArrayBuffer.prototype.destroy = s.prototype.destroy, s.ArrayBuffer.prototype._finish = s.prototype._finish, s.ArrayBuffer.hash = function(a, b) {
        var c = k(new Uint8Array(a)),
            d = m(c);
        return b ? r(d) : d
    }, s
}),
function(a) {
    function b() {
        for (var a = 0; a < w.length; a++) w[a][0](w[a][1]);
        w = [], p = !1
    }

    function c(a, c) {
        w.push([a, c]), p || (p = !0, v(b, 0))
    }

    function d(a, b) {
        function c(a) {
            g(b, a)
        }

        function d(a) {
            i(b, a)
        }
        try {
            a(c, d)
        } catch (e) {
            d(e)
        }
    }

    function e(a) {
        var b = a.owner,
            c = b.state_,
            b = b.data_,
            d = a[c];
        if (a = a.then, "function" == typeof d) {
            c = s;
            try {
                b = d(b)
            } catch (e) {
                i(a, e)
            }
        }
        f(a, b) || (c === s && g(a, b), c === t && i(a, b))
    }

    function f(a, b) {
        var c;
        try {
            if (a === b) throw new TypeError("A promises callback cannot return that same promise.");
            if (b && ("function" == typeof b || "object" == typeof b)) {
                var d = b.then;
                if ("function" == typeof d) return d.call(b, function(d) {
                    c || (c = !0, b !== d ? g(a, d) : h(a, d))
                }, function(b) {
                    c || (c = !0, i(a, b))
                }), !0
            }
        } catch (e) {
            return c || i(a, e), !0
        }
        return !1
    }

    function g(a, b) {
        a !== b && f(a, b) || h(a, b)
    }

    function h(a, b) {
        a.state_ === q && (a.state_ = r, a.data_ = b, c(k, a))
    }

    function i(a, b) {
        a.state_ === q && (a.state_ = r, a.data_ = b, c(l, a))
    }

    function j(a) {
        var b = a.then_;
        for (a.then_ = void 0, a = 0; a < b.length; a++) e(b[a])
    }

    function k(a) {
        a.state_ = s, j(a)
    }

    function l(a) {
        a.state_ = t, j(a)
    }

    function m(a) {
        if ("function" != typeof a) throw new TypeError("Promise constructor takes a function argument");
        if (!1 == this instanceof m) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
        this.then_ = [], d(a, this)
    }
    var n = a.Promise,
        o = n && "resolve" in n && "reject" in n && "all" in n && "race" in n && function() {
            var a;
            return new n(function(b) {
                a = b
            }), "function" == typeof a
        }();
    "undefined" != typeof exports && exports ? (exports.Promise = o ? n : m, exports.Polyfill = m) : "function" == typeof define && define.amd ? define(function() {
        return o ? n : m
    }) : o || (a.Promise = m);
    var p, q = "pending",
        r = "sealed",
        s = "fulfilled",
        t = "rejected",
        u = function() {},
        v = "undefined" != typeof setImmediate ? setImmediate : setTimeout,
        w = [];
    m.prototype = {
        constructor: m,
        state_: q,
        then_: null,
        data_: void 0,
        then: function(a, b) {
            var d = {
                owner: this,
                then: new this.constructor(u),
                fulfilled: a,
                rejected: b
            };
            return this.state_ === s || this.state_ === t ? c(e, d) : this.then_.push(d), d.then
        },
        "catch": function(a) {
            return this.then(null, a)
        }
    }, m.all = function(a) {
        if ("[object Array]" !== Object.prototype.toString.call(a)) throw new TypeError("You must pass an array to Promise.all().");
        return new this(function(b, c) {
            function d(a) {
                return g++,
                    function(c) {
                        f[a] = c, --g || b(f)
                    }
            }
            for (var e, f = [], g = 0, h = 0; h < a.length; h++)(e = a[h]) && "function" == typeof e.then ? e.then(d(h), c) : f[h] = e;
            g || b(f)
        })
    }, m.race = function(a) {
        if ("[object Array]" !== Object.prototype.toString.call(a)) throw new TypeError("You must pass an array to Promise.race().");
        return new this(function(b, c) {
            for (var d, e = 0; e < a.length; e++)(d = a[e]) && "function" == typeof d.then ? d.then(b, c) : b(d)
        })
    }, m.resolve = function(a) {
        return a && "object" == typeof a && a.constructor === this ? a : new this(function(b) {
            b(a)
        })
    }, m.reject = function(a) {
        return new this(function(b, c) {
            c(a)
        })
    }
}("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this),
function(a) {
    function b(b, d) {
        var e = b.zooms;
        return d.each(function(d, f) {
            var g = a(f).width(),
                h = (a(f).height(), Math.round(100 * g / b.original.width) / 100);
            h = c(h, e, b), b.zoom = h
        }), b
    }

    function c(a, b, c) {
        if (c.scale = a, b.indexOf(a) < 0) {
            a = a > b[b.length - 1] ? b[b.length - 1] : a, a = a < b[0] ? b[0] : a;
            for (var d = 0; d < b.length; d++)
                if ("number" == typeof b[d] && a <= b[d]) {
                    a = b[d];
                    break
                }
        }
        return navigator.userAgent.match(/mobile/i) && 1 > a && (a = 1), Configs.tile.enable || (a = 1), a
    }

    function d(a, b) {
        return a > b.length - 1 ? a = b.length - 1 : 0 > a && (a = 0), a
    }
    var e = "zoomin",
        f = "zoomout",
        g = "FitPage",
        h = {
            TYPE_UNLOAD: 0,
            TYPE_LOADING: 1,
            TYPE_LOADED: 2,
            TYPE_LOADFAIL: 3
        },
        i = function() {
            var a = navigator.userAgent.toLowerCase(),
                b = (window.opera, /msie/.test(a) && !/opera/.test(a) && document.all);
            if (b) {
                var c = parseFloat(a.match(/msie (\d+)/)[1]),
                    d = !!document.documentMode && document.documentMode < 8,
                    e = 8 == document.documentMode,
                    f = 9 == document.documentMode,
                    g = 7 == c && !document.documentMode || 7 == document.documentMode,
                    h = 7 > c || "BackCompact" == document.CompactMode;
                return f || d || e || g || h
            }
            return !1
        }(),
        j = function(b, c, d) {
            this.config = d, this.zoom = b, this.$viewport = c, this.width = d.original.width * b, this.height = d.original.height * b;
            var e = "overflow:hidden;width:" + this.width + "px;height:" + this.height + "px";
            this.$layer = a('<div class="tiles-layer tiles-layer-' + 100 * b + '" style=' + e + "/>"), this.addScaleTranslateCss(this.$layer, 1), this.prePosition = {
                top: 0,
                left: 0
            }, this.position = {
                top: 0,
                left: 0
            }, this.maxExtraCount = 2, this.loadCheck = h.TYPE_UNLOAD, this.retryCount = 20
        };
    j.prototype.getFitPageZoom = function(a) {
        var b = this.$viewport.parents("#" + this.config.containerId).width(),
            c = this.$viewport.parents("#" + this.config.containerId).height(),
            d = this.config.original.width,
            e = this.config.original.height;
        if (a % 180 != 0) {
            var f = d;
            d = e, e = f
        }
        var g = b / d,
            h = c / e;
        return g > h ? h : g
    }, j.prototype._loadTileImg = function(b, c, d) {
        var e = b.zoom.toString();
        e = e.replace(/\./g, "_");
        var f = [".tiles", e, c, d].join("-"),
            g = b.$layer.find(f);
        g.length > 0 && !g.data("loaded") && (g.attr("src", g.data("src")), g.data("loaded", !0), g.load(function() {
            a(this).fadeIn(100)
        }))
    }, j.prototype._render = function(b, c, d, e, f, g) {
        if (this.loadCheck != h.TYPE_LOADFAIL && (this.loadCheck != h.TYPE_LOADING || g)) {
            var i = this;
            if (this.loadCheck == h.TYPE_LOADED && a.isFunction(f)) return void f(i, b, c, d);
            this.config.loading && a(this.config.loading).show();
            var j = this.config.checkStatusPath + "/" + 100 * this.config.zoom + "/" + this.config.tileSize + this.config.checkStatusPathSuffix;
            return 0 >= e ? (console.warn("Maximum number of retries exceeded for render url: " + j), void(i.loadCheck = h.TYPE_UNLOAD)) : (i.loadCheck = h.TYPE_LOADING, e = e ? e : 20, a.ajax({
                url: j,
                crossDomain: !0,
                ifModified: !0,
                data: {},
                error: function() {
                    i.loaded = h.TYPE_UNLOAD
                },
                success: function(g, j, k) {
                    if ("1" === g) return void(i.loadCheck = h.TYPE_LOADFAIL);
                    var l = k.getResponseHeader("content-type") || "";
                    return l.indexOf("application/json") > -1 && "3" == g.status.toString() ? void("3" == g.status.toString() ? (i.loadCheck = h.TYPE_LOADING, setTimeout(function() {
                        i._render(i.position.top, i.position.left, d, --e, f, !0)
                    }, 2e3)) : "2" == g.status.toString() && (i.loadCheck = h.TYPE_LOADFAIL)) : (i.loadCheck = h.TYPE_LOADED, void(a.isFunction(f) && (i.config.loading && a(i.config.loading).hide(), f(i, b, c, d))))
                }
            }), !1)
        }
    }, j.prototype._isInLoadRange = function(a, b, c) {
        var d = (this.$viewport.parents("#" + this.config.containerId).width(), this.$viewport.parents("#" + this.config.containerId).height()),
            e = this.$viewport.position();
        a && (e.top = e.top - a), b && (e.left = e.left - b);
        var f = this.$viewport.width(),
            g = this.$viewport.height();
        if (c % 90 != 0) {
            var h = g;
            g = f, f = h
        }
        if (e.top + g < 0 || e.top > d) {
            var i = e.top < 0 && e.top + g * this.config.beforeVisiblePageCount + d >= 0 ? !0 : !1,
                j = e.top > 0 && e.top - g * this.config.afterVisiblePageCount < d ? !0 : !1;
            return i || j ? !0 : !1
        }
        return !0
    }, j.prototype._adjustLoadRange = function(b, c, d, e, f, g) {
        var h = {};
        switch (a.extend(h, e), d) {
            case 270:
                b.top < c.top ? h.endCol += g : b.top > c.top ? h.startCol -= g : (h.endCol += 1, h.startCol -= 1), b.left < c.left ? h.startRow -= g : b.left > c.left ? h.endRow += g : (h.endRow += 1, h.startRow -= 1);
                break;
            case 90:
                b.top < c.top ? h.startCol -= g : b.top > c.top ? h.endCol += g : (h.endCol += 1, h.startCol -= 1), b.left < c.left ? h.endRow += g : b.left > c.left ? h.startRow -= g : (h.endRow += 1, h.startRow -= 1);
                break;
            case 180:
                b.top < c.top ? h.endRow += g : b.top > c.top ? h.startRow -= g : (h.endRow += 1, h.startRow -= 1), b.left < c.left ? h.endCol += g : b.left > c.left ? h.startCol -= g : (h.endCol += 1, h.startCol -= 1);
                break;
            default:
                b.top < c.top ? h.startRow -= g : b.top > c.top ? h.endRow += g : (h.endRow += 1, h.startRow -= 1), b.left < c.left ? h.startCol -= g : b.left > c.left ? h.endCol += g : (h.endCol += 1, h.startCol -= 1)
        }
        return h.startRow = h.startRow < 1 ? 1 : h.startRow, h.endRow = h.endRow > f.maxRow ? f.maxRow : h.endRow, h.startCol = h.startCol < 1 ? 1 : h.startCol, h.endCol = h.endCol > f.maxCol ? f.maxCol : h.endCol, h
    }, j.prototype._calLoadRange = function(a, b, c, d, e) {
        var f = 0,
            g = 0,
            h = 0;
        a.top > 0 ? (g = 0, h = e.height - a.top, h > d.height && (h = d.height)) : (g = Math.abs(a.top), h = g + d.height, h > e.height && (h = e.height + g)), a.top = Math.abs(a.top), a.left = Math.abs(a.left), d.width - a.left < e.width ? (f = d.width, a.left = f - e.width) : f = a.left + e.width;
        var i = {},
            j = 0;
        switch (b) {
            case 270:
                i.startRow = Math.floor(a.left / c) + 1, i.endRow = Math.ceil(f / c), j = h, h = d.height - g, g = d.height - j, i.startCol = Math.floor(g / c) + 1, i.endCol = Math.ceil(h / c);
                break;
            case 90:
                j = a.left, f = d.width - a.left, a.left = d.width - e.width - j, a.left < 0 && (a.left = 0), i.startRow = Math.floor(a.left / c) + 1, i.endRow = Math.ceil(f / c), i.startCol = Math.floor(g / c) + 1, i.endCol = Math.ceil(h / c);
                break;
            case 180:
                j = a.left, f = d.width - a.left, a.left = d.width - e.width - j, a.left < 0 && (a.left = 0), i.startRow = Math.floor(a.left / c) + 1, i.endRow = Math.ceil(f / c), i.startCol = Math.floor(g / c) + 1, i.endCol = Math.ceil(h / c);
                break;
            default:
                i.startCol = Math.floor(a.left / c) + 1, i.endCol = Math.ceil(f / c), i.startRow = Math.floor(g / c) + 1, i.endRow = Math.ceil(h / c)
        }
        return i
    }, j.prototype._loadRange = function(a, b) {
        var c = a.startRow,
            d = a.endRow,
            e = a.startCol,
            f = a.endCol,
            g = 0,
            h = 0;
        switch (b) {
            case 270:
                for (g = f; g >= e; g--)
                    for (h = c; d >= h; h++) this._loadTileImg(this, g, h);
                break;
            case 90:
                for (g = e; f >= g; g++)
                    for (h = d; h >= c; h--) this._loadTileImg(this, g, h);
                break;
            case 180:
                for (h = d; h >= c; h--)
                    for (g = f; g >= e; g--) this._loadTileImg(this, g, h);
                break;
            default:
                for (h = c; d >= h; h++)
                    for (g = e; f >= g; g++) this._loadTileImg(this, g, h)
        }
    }, j.prototype._loadHidePage = function(a, b, c, d, e, f) {
        var g = this.maxExtraCount * d,
            h = a.top < 0 && a.top + b.height + g >= 0 ? !0 : !1,
            i = a.top > 0 && a.top - g < c.height ? !0 : !1;
        if (h || i) {
            var j = b.width - a.left < c.width ? b.width : a.left + c.width,
                k = Math.floor(a.left / d) + 1,
                l = Math.ceil(j / d),
                m = 0,
                n = 0;
            if (a.left = Math.abs(a.left), 270 == f) m = Math.floor(a.left / d) + 1, n = Math.ceil(j / d), h ? (k = 1, l = this.maxExtraCount) : i && (l = e.maxCol, k = e.maxCol - this.maxExtraCount + 1);
            else if (180 == f) {
                a.left;
                j = b.width - a.left, a.left = j - c.width, a.left < 0 && (a.left = 0), k = Math.floor(a.left / d) + 1, l = Math.ceil(j / d), h ? (m = 1, n = this.maxExtraCount) : i && (n = e.maxRow, m = e.maxRow - this.maxExtraCount + 1)
            } else 90 == f ? (j = b.width - a.left, a.left = j - c.width, a.left < 0 && (a.left = 0), m = Math.floor(a.left / d) + 1, n = Math.ceil(j / d), h ? (l = e.maxCol, k = e.maxCol - this.maxExtraCount + 1) : i && (k = 1, l = this.maxExtraCount)) : h ? (n = e.maxRow, m = e.maxRow - this.maxExtraCount + 1) : i && (m = 1, n = this.maxExtraCount);
            for (var o = 1 > m ? 1 : m, p = n > e.maxRow ? e.maxRow : n, q = 1 > k ? 1 : k, r = l > e.maxCol ? e.maxCol : l, s = o; p >= s; s++)
                for (var t = q; r >= t; t++) this._loadTileImg(this, t, s)
        }
    }, j.prototype._showTiles = function(a, b, c, d) {
        var e = a.config.tileSize;
        if (a.config.scale !== a.config.zoom) {
            var f = a.config.scale / a.config.zoom;
            e = a.config.tileSize * f
        }
        var g = a.$viewport.parents("#" + a.config.containerId).width(),
            h = a.$viewport.parents("#" + a.config.containerId).height(),
            i = a.$viewport.position();
        b && (i.top = i.top - b), c && (i.left = i.left - c);
        var j = a.$viewport.width(),
            k = a.$viewport.height(),
            l = Math.ceil(k / e),
            m = Math.ceil(j / e);
        if (d % 180 != 0) {
            var n = k;
            k = j, j = n
        }
        if (i.top + k < 0 || i.top > h) return a._loadHidePage(i, {
            width: j,
            height: k
        }, {
            width: g,
            height: h
        }, e, {
            maxRow: l,
            maxCol: m
        }, d), !1;
        var o = a._calLoadRange(i, d, e, {
            width: j,
            height: k
        }, {
            width: g,
            height: h
        });
        o = a._adjustLoadRange(a.position, a.prePosition, d, o, {
            maxRow: l,
            maxCol: m
        }, a.maxExtraCount), a.prePosition = a.position, a._loadRange(o, d)
    }, j.prototype.addScaleTranslateCss = function(a, b) {
        if (null == a) return !1;
        var c = "";
        null != b && 0 != b && (c += " scale(" + b + ")");
        var d = "0px 0px 0px";
        if (i) {
            var e = "progid:DXImageTransform.Microsoft.Matrix(M11=" + b + ", M12=0, M21=0, M22=" + b + ", SizingMethod='auto expand')";
            return void a.css({
                "-ms-filter": e,
                filter: e
            })
        }
        a.css({
            "-webkit-transform": c,
            "-moz-transform": c,
            "-o-transform": c,
            "-ms-transform": c,
            transform: c,
            "-webkit-transform-origin": d,
            "-moz-transform-origin": d,
            "-o-transform-origin": d,
            "-ms-transform-origin": d,
            "transform-origin": d
        })
    }, j.prototype.scaleView = function(a, b) {
        a = a ? a : this.config.zoom, b = b ? b : this.config.scale;
        var c = b / a;
        this.addScaleTranslateCss(this.$layer, c), this.config.lastzoom = this.config.scale
    }, j.prototype.move = function(a, b) {
        var c = this.$viewport.width(),
            d = this.$viewport.height(),
            e = b / this.zoom - d / 2,
            f = a / this.zoom - c / 2,
            g = -(c - this.width),
            h = -(d - this.height);
        e = Math.max(0, Math.min(h, e)), f = Math.max(0, Math.min(g, f)), c > this.width && (f = -(c - this.width) / 2), d > this.height && (e = -(d - this.height) / 2), this.$layer.css("top", -e), this.$layer.css("left", -f), this.centerX = (f + c / 2) * this.zoom, this.centerY = (e + d / 2) * this.zoom, this._ondrag()
    }, j.prototype.show = function(a) {
        var b = a ? 0 : 1;
        this.$layer.css("z-index", b), this.$layer.css("display", "block")
    }, j.prototype.hide = function() {
        this.$layer.css({
            zIndex: 1,
            display: "none"
        })
    }, j.prototype.resetContainment = function() {
        var a = this.$viewport,
            b = (this.$layer, a.offset()),
            c = this.width,
            d = this.height,
            e = [b.left + a.width() - c, b.top + a.height() - d, b.left, b.top];
        a.width() > c && (e[0] = b.left + (a.width() - c) / 2, e[2] = b.left + (a.width() - c) / 2), a.height() > d && (e[1] = b.top + (a.height() - d) / 2, e[3] = b.top + (a.height() - d) / 2)
    }, j.prototype.load = function() {
        var b = this.$viewport,
            c = this.$layer,
            d = this.zoom,
            e = this.config,
            f = this.width,
            g = this.height,
            h = e.tileSize;
        c.css("position", "absolute"), c.css("top", "0");
        for (var i = Math.ceil(f / h), j = Math.ceil(g / h), k = 1; j >= k; k++) {
            for (var l = a("<div/>"), m = 1; i >= m; m++) {
                var n = a("<div/>");
                n.css({
                    width: h,
                    height: h,
                    "float": "left",
                    "text-align": "left",
                    "vertical-align": "top"
                });
                var o = a("<img/>");
                k !== j || 0 == g % h ? (o.attr("height", h), o.data("oriheight", h)) : (o.attr("height", g % h), o.data("oriheight", g % h)), m !== i || 0 == f % h ? (o.attr("width", h), o.data("oriwidth", h)) : (o.attr("width", f % h), o.data("oriwidth", f % h));
                var p = ["tiles", d, m, k].join("-");
                p = p.replace(/\./g, "_"), o.addClass(p), o.css("vertical-align", "top"), o.data("loaded", !1), o.data("src", e.basePath + "tiles/" + 100 * d + "/" + h + "/" + m + "/" + k + e.basePathSuffix), o.hide(), n.append(o), l.append(n)
            }
            l.css("width", i * h), c.append(l)
        }
        b.find(".tile_layers").prepend(c);
        this.resetContainment(), this._ondrag(e.top, e.left, e.rotate), this.hide()
    }, j.prototype.scroll = function(a, b, c, d) {
        this.config.lastzoom !== this.config.scale && this.scaleView(), this._ondrag(a, b, c)
    }, j.prototype._ondrag = function(a, b, c) {
        this._isInLoadRange(a, b, c) && (this.position = {
            left: b,
            top: a
        }, this._render(a, b, c, this.retryCount, this._showTiles))
    };
    var k = function(b, c, d) {
        this.config = d, this.zoom = b, this.$viewport = c;
        var e = a('<div class="tiles-layer"/>');
        c.children().each(function(b) {
            a(this).detach().appendTo(e)
        }), this.$layer = e, this.centerX = 0, this.centerY = 0
    };
    k.prototype.show = function() {
        this.$layer.css("display", "block")
    }, k.prototype.hide = function() {
        this.$layer.css("display", "none")
    }, k.prototype.load = function() {
        this.$viewport.append(this.$layer)
    }, k.prototype.move = function(a, b) {
        this.centerX = a, this.centerY = b
    };
    var l = {
        init: function(c) {
            var d = a.extend({
                    original: {
                        width: null,
                        height: null
                    },
                    tileSize: 400,
                    basePath: "",
                    basePathSuffix: "",
                    loading: "",
                    zoom: null,
                    zooms: [],
                    no0zoom: !1,
                    scale: 1,
                    top: 0,
                    left: 0,
                    rotate: 0
                }, c),
                e = a('<div class="tile_layers"/>');
            if (a(this).prepend(e), d.scale = d.zoom, null == d.zoom && (d = b(d, this)), "number" != typeof d.original.width || "number" != typeof d.original.height) throw "Missing required fields original.width and original.height.";
            if (d.original.width <= 0 || d.original.height <= 0) throw "Both original.width and original.height must be > 0";
            var f = a.trim(d.basePath);
            f && -1 === f.indexOf("/", f.length - 1) && (f += "/"), d.basePath = f, this.data("config", d);
            var g = !1;
            return this.each(function() {
                var b = a(this);
                b.css("position", "relative");
                var c = {};
                if (d.basePath = f, d.no0zoom) {
                    if (0 === d.zoom) throw "You must specify a non-zero zoom if no0zoom is true"
                } else c[0] = new k(0, b, d), c[0].load(), c[0].hide();
                var e = d.zoom;
                0 !== e && (c[e] = new j(e, b, d), c[e].load()), (d.zooms.indexOf(d.scale) < 0 || navigator.userAgent.match(/mobile/i) && d.scale < 1) && (g = !0), g && (c[e].scaleView(), b.data("layers", c), b.data("zoom", e)), b.data("orizoom", d.scale), b.data("lastzoom", d.scale), c[e].show(), b.data("layers", c), b.data("zoom", e);
                var h = function() {
                        a.each(c, function(a, b) {
                            0 !== a && (b.resetContainment(), b._ondrag(d.top, d.left, d.rotate))
                        })
                    },
                    i = null;
                b.bind("resize reposition", function() {
                    i && clearTimeout(i), i = setTimeout(h, 300)
                })
            })
        },
        zoom: function(b, h, i, k) {
            return this.each(function() {
                function l(a, b, c) {
                    for (var d = null, e = 0; e < b.length; e++) {
                        var f = c[b[e]];
                        f && (d = null == d ? f.zoom : d, f.zoom > d && Math.abs(a - f.zoom) < Math.abs(a - d) && (d = f.zoom))
                    }
                    return d
                }

                function m(a, b) {
                    for (var c = 0; c < a.length; c++) {
                        var d = b[a[c]];
                        d && d.hide()
                    }
                }

                function n(a) {
                    var b = !1,
                        c = u[a].width,
                        d = u[a].height,
                        e = u[a].config.tileSize,
                        f = Math.ceil(d / e),
                        g = Math.ceil(c / e),
                        h = u[a].zoom.toString();
                    h = h.replace(/\./g, "_");
                    var i = [".tiles", h, 1, 1].join("-"),
                        j = u[a].$layer.find(i);
                    return b = j.length > 0 && j.data("loaded") ? !0 : !1, i = [".tiles", h, g, f].join("-"), j = u[a].$layer.find(i), b = j.length > 0 && j.data("loaded") ? b && !0 : b && !1
                }
                var o = a(this),
                    p = o.data("config");
                if (p) {
                    p.top = h, p.left = i, p.rotate = k;
                    var q = o.data("zoom"),
                        r = o.data("orizoom"),
                        s = p.zoom,
                        t = b;
                    if (t === g) {
                        var u = o.data("layers");
                        t = u[q].getFitPageZoom(k)
                    }
                    var v = 0;
                    t !== f && t !== e && (v = c(t, p.zooms, p), p.zoom = v), p.lastzoom = s;
                    var w = 0;
                    if (t === e ? (w = p.zooms.indexOf(q), w++, w = d(w, p.zooms), t = p.zooms[w]) : t === f && (w = p.zooms.indexOf(q), w--, w = d(w, p.zooms), t = p.zooms[w]), r === t) {
                        var u = o.data("layers");
                        return void u[q]._ondrag(h, i, k)
                    }
                    var u = o.data("layers");
                    m(p.zooms, u);
                    var x = l(v, p.zooms, u);
                    x && !n(x) && (x = 1), u[x] && x != v && (u[x].scaleView(x, p.scale == v ? v : p.scale), u[x].show(!0)), q = v, u[q] || (u[q] = new j(q, o, p), u[q].load()), u[q].scaleView(), u[q].show(), u[q]._ondrag(h, i, k), o.data("layers", u), o.data("zoom", q), o.data("orizoom", t)
                }
            })
        },
        move: function(b, c) {
            return this.each(function() {
                var d = a(this),
                    e = d.data("config");
                if (e) {
                    var f = d.data("zoom"),
                        g = d.data("layers");
                    g[f].move(b * f, c * f)
                }
            })
        },
        scroll: function(b, d, e) {
            return this.each(function() {
                var f = a(this),
                    g = f.data("config");
                if (g) {
                    var h = f.data("orizoom") || f.data("zoom"),
                        i = f.data("layers");
                    h = c(h, g.zooms, g), h && i && i[h] && i[h].scroll(b, d, e, g)
                }
            })
        },
        center: function() {
            return this.each(function() {
                var b = a(this),
                    c = b.data("config");
                if (c) {
                    var d = b.data("zoom"),
                        e = b.data("layers");
                    e[d].move(c.original.width / 2, c.original.height / 2)
                }
            })
        },
        zoomin: function() {
            this.tiles("zoom", e)
        },
        zoomout: function() {
            this.tiles("zoom", f)
        },
        hide: function() {
            a(this).find(".tile_layers").hide()
        },
        show: function() {
            a(this).find(".tile_layers").show()
        }
    };
    a.fn.tiles = function(b) {
        return l[b] ? l[b].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof b && b ? void a.error("No such method: " + b) : l.init.apply(this, arguments)
    }
}(jQuery), ! function(a, b) {
    "object" == typeof exports && "object" == typeof module ? module.exports = b() : "function" == typeof define && define.amd ? define([], b) : "object" == typeof exports ? exports.html2canvas = b() : a.html2canvas = b()
}(this, function() {
    return function(a) {
        function b(d) {
            if (c[d]) return c[d].exports;
            var e = c[d] = {
                i: d,
                l: !1,
                exports: {}
            };
            return a[d].call(e.exports, e, e.exports, b), e.l = !0, e.exports
        }
        var c = {};
        return b.m = a, b.c = c, b.d = function(a, c, d) {
            b.o(a, c) || Object.defineProperty(a, c, {
                configurable: !1,
                enumerable: !0,
                get: d
            })
        }, b.n = function(a) {
            var c = a && a.__esModule ? function() {
                return a["default"]
            } : function() {
                return a
            };
            return b.d(c, "a", c), c
        }, b.o = function(a, b) {
            return Object.prototype.hasOwnProperty.call(a, b)
        }, b.p = "", b(b.s = 22)
    }([function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                return function(a, b) {
                    if (Array.isArray(a)) return a;
                    if (Symbol.iterator in Object(a)) return function(a, b) {
                        var c = [],
                            d = !0,
                            e = !1,
                            f = void 0;
                        try {
                            for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                        } catch (a) {
                            e = !0, f = a
                        } finally {
                            try {
                                !d && h["return"] && h["return"]()
                            } finally {
                                if (e) throw f
                            }
                        }
                        return c
                    }(a, b);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            e = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            f = /^#([a-f0-9]{3})$/i,
            g = function(a) {
                var b = a.match(f);
                return !!b && [parseInt(b[1][0] + b[1][0], 16), parseInt(b[1][1] + b[1][1], 16), parseInt(b[1][2] + b[1][2], 16), null]
            },
            h = /^#([a-f0-9]{6})$/i,
            i = function(a) {
                var b = a.match(h);
                return !!b && [parseInt(b[1].substring(0, 2), 16), parseInt(b[1].substring(2, 4), 16), parseInt(b[1].substring(4, 6), 16), null]
            },
            j = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
            k = function(a) {
                var b = a.match(j);
                return !!b && [Number(b[1]), Number(b[2]), Number(b[3]), null]
            },
            l = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/,
            m = function(a) {
                var b = a.match(l);
                return !!(b && b.length > 4) && [Number(b[1]), Number(b[2]), Number(b[3]), Number(b[4])]
            },
            n = function(a) {
                return [Math.min(a[0], 255), Math.min(a[1], 255), Math.min(a[2], 255), a.length > 3 ? a[3] : null]
            },
            o = function(a) {
                var b = q[a.toLowerCase()];
                return b || !1
            },
            p = function() {
                function a(b) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a);
                    var c = Array.isArray(b) ? n(b) : g(b) || k(b) || m(b) || o(b) || i(b) || [0, 0, 0, null],
                        e = d(c, 4),
                        f = e[0],
                        h = e[1],
                        j = e[2],
                        l = e[3];
                    this.r = f, this.g = h, this.b = j, this.a = l
                }
                return e(a, [{
                    key: "isTransparent",
                    value: function() {
                        return 0 === this.a
                    }
                }, {
                    key: "toString",
                    value: function() {
                        return null !== this.a && 1 !== this.a ? "rgba(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")" : "rgb(" + this.r + "," + this.g + "," + this.b + ")"
                    }
                }]), a
            }();
        b["default"] = p;
        var q = {
            transparent: [0, 0, 0, 0],
            aliceblue: [240, 248, 255, null],
            antiquewhite: [250, 235, 215, null],
            aqua: [0, 255, 255, null],
            aquamarine: [127, 255, 212, null],
            azure: [240, 255, 255, null],
            beige: [245, 245, 220, null],
            bisque: [255, 228, 196, null],
            black: [0, 0, 0, null],
            blanchedalmond: [255, 235, 205, null],
            blue: [0, 0, 255, null],
            blueviolet: [138, 43, 226, null],
            brown: [165, 42, 42, null],
            burlywood: [222, 184, 135, null],
            cadetblue: [95, 158, 160, null],
            chartreuse: [127, 255, 0, null],
            chocolate: [210, 105, 30, null],
            coral: [255, 127, 80, null],
            cornflowerblue: [100, 149, 237, null],
            cornsilk: [255, 248, 220, null],
            crimson: [220, 20, 60, null],
            cyan: [0, 255, 255, null],
            darkblue: [0, 0, 139, null],
            darkcyan: [0, 139, 139, null],
            darkgoldenrod: [184, 134, 11, null],
            darkgray: [169, 169, 169, null],
            darkgreen: [0, 100, 0, null],
            darkgrey: [169, 169, 169, null],
            darkkhaki: [189, 183, 107, null],
            darkmagenta: [139, 0, 139, null],
            darkolivegreen: [85, 107, 47, null],
            darkorange: [255, 140, 0, null],
            darkorchid: [153, 50, 204, null],
            darkred: [139, 0, 0, null],
            darksalmon: [233, 150, 122, null],
            darkseagreen: [143, 188, 143, null],
            darkslateblue: [72, 61, 139, null],
            darkslategray: [47, 79, 79, null],
            darkslategrey: [47, 79, 79, null],
            darkturquoise: [0, 206, 209, null],
            darkviolet: [148, 0, 211, null],
            deeppink: [255, 20, 147, null],
            deepskyblue: [0, 191, 255, null],
            dimgray: [105, 105, 105, null],
            dimgrey: [105, 105, 105, null],
            dodgerblue: [30, 144, 255, null],
            firebrick: [178, 34, 34, null],
            floralwhite: [255, 250, 240, null],
            forestgreen: [34, 139, 34, null],
            fuchsia: [255, 0, 255, null],
            gainsboro: [220, 220, 220, null],
            ghostwhite: [248, 248, 255, null],
            gold: [255, 215, 0, null],
            goldenrod: [218, 165, 32, null],
            gray: [128, 128, 128, null],
            green: [0, 128, 0, null],
            greenyellow: [173, 255, 47, null],
            grey: [128, 128, 128, null],
            honeydew: [240, 255, 240, null],
            hotpink: [255, 105, 180, null],
            indianred: [205, 92, 92, null],
            indigo: [75, 0, 130, null],
            ivory: [255, 255, 240, null],
            khaki: [240, 230, 140, null],
            lavender: [230, 230, 250, null],
            lavenderblush: [255, 240, 245, null],
            lawngreen: [124, 252, 0, null],
            lemonchiffon: [255, 250, 205, null],
            lightblue: [173, 216, 230, null],
            lightcoral: [240, 128, 128, null],
            lightcyan: [224, 255, 255, null],
            lightgoldenrodyellow: [250, 250, 210, null],
            lightgray: [211, 211, 211, null],
            lightgreen: [144, 238, 144, null],
            lightgrey: [211, 211, 211, null],
            lightpink: [255, 182, 193, null],
            lightsalmon: [255, 160, 122, null],
            lightseagreen: [32, 178, 170, null],
            lightskyblue: [135, 206, 250, null],
            lightslategray: [119, 136, 153, null],
            lightslategrey: [119, 136, 153, null],
            lightsteelblue: [176, 196, 222, null],
            lightyellow: [255, 255, 224, null],
            lime: [0, 255, 0, null],
            limegreen: [50, 205, 50, null],
            linen: [250, 240, 230, null],
            magenta: [255, 0, 255, null],
            maroon: [128, 0, 0, null],
            mediumaquamarine: [102, 205, 170, null],
            mediumblue: [0, 0, 205, null],
            mediumorchid: [186, 85, 211, null],
            mediumpurple: [147, 112, 219, null],
            mediumseagreen: [60, 179, 113, null],
            mediumslateblue: [123, 104, 238, null],
            mediumspringgreen: [0, 250, 154, null],
            mediumturquoise: [72, 209, 204, null],
            mediumvioletred: [199, 21, 133, null],
            midnightblue: [25, 25, 112, null],
            mintcream: [245, 255, 250, null],
            mistyrose: [255, 228, 225, null],
            moccasin: [255, 228, 181, null],
            navajowhite: [255, 222, 173, null],
            navy: [0, 0, 128, null],
            oldlace: [253, 245, 230, null],
            olive: [128, 128, 0, null],
            olivedrab: [107, 142, 35, null],
            orange: [255, 165, 0, null],
            orangered: [255, 69, 0, null],
            orchid: [218, 112, 214, null],
            palegoldenrod: [238, 232, 170, null],
            palegreen: [152, 251, 152, null],
            paleturquoise: [175, 238, 238, null],
            palevioletred: [219, 112, 147, null],
            papayawhip: [255, 239, 213, null],
            peachpuff: [255, 218, 185, null],
            peru: [205, 133, 63, null],
            pink: [255, 192, 203, null],
            plum: [221, 160, 221, null],
            powderblue: [176, 224, 230, null],
            purple: [128, 0, 128, null],
            rebeccapurple: [102, 51, 153, null],
            red: [255, 0, 0, null],
            rosybrown: [188, 143, 143, null],
            royalblue: [65, 105, 225, null],
            saddlebrown: [139, 69, 19, null],
            salmon: [250, 128, 114, null],
            sandybrown: [244, 164, 96, null],
            seagreen: [46, 139, 87, null],
            seashell: [255, 245, 238, null],
            sienna: [160, 82, 45, null],
            silver: [192, 192, 192, null],
            skyblue: [135, 206, 235, null],
            slateblue: [106, 90, 205, null],
            slategray: [112, 128, 144, null],
            slategrey: [112, 128, 144, null],
            snow: [255, 250, 250, null],
            springgreen: [0, 255, 127, null],
            steelblue: [70, 130, 180, null],
            tan: [210, 180, 140, null],
            teal: [0, 128, 128, null],
            thistle: [216, 191, 216, null],
            tomato: [255, 99, 71, null],
            turquoise: [64, 224, 208, null],
            violet: [238, 130, 238, null],
            wheat: [245, 222, 179, null],
            white: [255, 255, 255, null],
            whitesmoke: [245, 245, 245, null],
            yellow: [255, 255, 0, null],
            yellowgreen: [154, 205, 50, null]
        };
        b.TRANSPARENT = new p([0, 0, 0, 0])
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseBoundCurves = b.calculatePaddingBoxPath = b.calculateBorderBoxPath = b.parsePathForBorder = b.parseDocumentSize = b.calculateContentBox = b.calculatePaddingBox = b.parseBounds = b.Bounds = void 0;
        var e = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            f = d(c(7)),
            g = d(c(27)),
            h = b.Bounds = function() {
                function a(b, c, d, e) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.left = b, this.top = c, this.width = d, this.height = e
                }
                return e(a, null, [{
                    key: "fromClientRect",
                    value: function(b, c, d) {
                        return new a(b.left + c, b.top + d, b.width, b.height)
                    }
                }]), a
            }(),
            i = (b.parseBounds = function(a, b, c) {
                return h.fromClientRect(a.getBoundingClientRect(), b, c)
            }, b.calculatePaddingBox = function(a, b) {
                return new h(a.left + b[3].borderWidth, a.top + b[0].borderWidth, a.width - (b[1].borderWidth + b[3].borderWidth), a.height - (b[0].borderWidth + b[2].borderWidth))
            }, b.calculateContentBox = function(a, b, c) {
                var d = b[0].value,
                    e = b[1].value,
                    f = b[2].value,
                    g = b[3].value;
                return new h(a.left + g + c[3].borderWidth, a.top + d + c[0].borderWidth, a.width - (c[1].borderWidth + c[3].borderWidth + g + e), a.height - (c[0].borderWidth + c[2].borderWidth + d + f))
            }, b.parseDocumentSize = function(a) {
                var b = a.body,
                    c = a.documentElement;
                if (!b || !c) throw new Error("");
                var d = Math.max(Math.max(b.scrollWidth, c.scrollWidth), Math.max(b.offsetWidth, c.offsetWidth), Math.max(b.clientWidth, c.clientWidth)),
                    e = Math.max(Math.max(b.scrollHeight, c.scrollHeight), Math.max(b.offsetHeight, c.offsetHeight), Math.max(b.clientHeight, c.clientHeight));
                return new h(0, 0, d, e)
            }, b.parsePathForBorder = function(a, b) {
                switch (b) {
                    case 0:
                        return i(a.topLeftOuter, a.topLeftInner, a.topRightOuter, a.topRightInner);
                    case 1:
                        return i(a.topRightOuter, a.topRightInner, a.bottomRightOuter, a.bottomRightInner);
                    case 2:
                        return i(a.bottomRightOuter, a.bottomRightInner, a.bottomLeftOuter, a.bottomLeftInner);
                    case 3:
                    default:
                        return i(a.bottomLeftOuter, a.bottomLeftInner, a.topLeftOuter, a.topLeftInner)
                }
            }, function(a, b, c, d) {
                var e = [];
                return a instanceof g["default"] ? e.push(a.subdivide(.5, !1)) : e.push(a), c instanceof g["default"] ? e.push(c.subdivide(.5, !0)) : e.push(c), d instanceof g["default"] ? e.push(d.subdivide(.5, !0).reverse()) : e.push(d), b instanceof g["default"] ? e.push(b.subdivide(.5, !1).reverse()) : e.push(b), e
            }),
            j = (b.calculateBorderBoxPath = function(a) {
                return [a.topLeftOuter, a.topRightOuter, a.bottomRightOuter, a.bottomLeftOuter]
            }, b.calculatePaddingBoxPath = function(a) {
                return [a.topLeftInner, a.topRightInner, a.bottomRightInner, a.bottomLeftInner]
            }, b.parseBoundCurves = function(a, b, c) {
                var d = a.width / 2,
                    e = a.height / 2,
                    g = c[j.TOP_LEFT][0].getAbsoluteValue(a.width) < d ? c[j.TOP_LEFT][0].getAbsoluteValue(a.width) : d,
                    h = c[j.TOP_LEFT][1].getAbsoluteValue(a.height) < e ? c[j.TOP_LEFT][1].getAbsoluteValue(a.height) : e,
                    i = c[j.TOP_RIGHT][0].getAbsoluteValue(a.width) < d ? c[j.TOP_RIGHT][0].getAbsoluteValue(a.width) : d,
                    l = c[j.TOP_RIGHT][1].getAbsoluteValue(a.height) < e ? c[j.TOP_RIGHT][1].getAbsoluteValue(a.height) : e,
                    m = c[j.BOTTOM_RIGHT][0].getAbsoluteValue(a.width) < d ? c[j.BOTTOM_RIGHT][0].getAbsoluteValue(a.width) : d,
                    n = c[j.BOTTOM_RIGHT][1].getAbsoluteValue(a.height) < e ? c[j.BOTTOM_RIGHT][1].getAbsoluteValue(a.height) : e,
                    o = c[j.BOTTOM_LEFT][0].getAbsoluteValue(a.width) < d ? c[j.BOTTOM_LEFT][0].getAbsoluteValue(a.width) : d,
                    p = c[j.BOTTOM_LEFT][1].getAbsoluteValue(a.height) < e ? c[j.BOTTOM_LEFT][1].getAbsoluteValue(a.height) : e,
                    q = a.width - i,
                    r = a.height - n,
                    s = a.width - m,
                    t = a.height - p;
                return {
                    topLeftOuter: g > 0 || h > 0 ? k(a.left, a.top, g, h, j.TOP_LEFT) : new f["default"](a.left, a.top),
                    topLeftInner: g > 0 || h > 0 ? k(a.left + b[3].borderWidth, a.top + b[0].borderWidth, Math.max(0, g - b[3].borderWidth), Math.max(0, h - b[0].borderWidth), j.TOP_LEFT) : new f["default"](a.left + b[3].borderWidth, a.top + b[0].borderWidth),
                    topRightOuter: i > 0 || l > 0 ? k(a.left + q, a.top, i, l, j.TOP_RIGHT) : new f["default"](a.left + a.width, a.top),
                    topRightInner: i > 0 || l > 0 ? k(a.left + Math.min(q, a.width + b[3].borderWidth), a.top + b[0].borderWidth, q > a.width + b[3].borderWidth ? 0 : i - b[3].borderWidth, l - b[0].borderWidth, j.TOP_RIGHT) : new f["default"](a.left + a.width - b[1].borderWidth, a.top + b[0].borderWidth),
                    bottomRightOuter: m > 0 || n > 0 ? k(a.left + s, a.top + r, m, n, j.BOTTOM_RIGHT) : new f["default"](a.left + a.width, a.top + a.height),
                    bottomRightInner: m > 0 || n > 0 ? k(a.left + Math.min(s, a.width - b[3].borderWidth), a.top + Math.min(r, a.height + b[0].borderWidth), Math.max(0, m - b[1].borderWidth), n - b[2].borderWidth, j.BOTTOM_RIGHT) : new f["default"](a.left + a.width - b[1].borderWidth, a.top + a.height - b[2].borderWidth),
                    bottomLeftOuter: o > 0 || p > 0 ? k(a.left, a.top + t, o, p, j.BOTTOM_LEFT) : new f["default"](a.left, a.top + a.height),
                    bottomLeftInner: o > 0 || p > 0 ? k(a.left + b[3].borderWidth, a.top + t, Math.max(0, o - b[3].borderWidth), p - b[2].borderWidth, j.BOTTOM_LEFT) : new f["default"](a.left + b[3].borderWidth, a.top + a.height - b[2].borderWidth)
                }
            }, {
                TOP_LEFT: 0,
                TOP_RIGHT: 1,
                BOTTOM_RIGHT: 2,
                BOTTOM_LEFT: 3
            }),
            k = function(a, b, c, d, e) {
                var h = (Math.sqrt(2) - 1) / 3 * 4,
                    i = c * h,
                    k = d * h,
                    l = a + c,
                    m = b + d;
                switch (e) {
                    case j.TOP_LEFT:
                        return new g["default"](new f["default"](a, m), new f["default"](a, m - k), new f["default"](l - i, b), new f["default"](l, b));
                    case j.TOP_RIGHT:
                        return new g["default"](new f["default"](a, b), new f["default"](a + i, b), new f["default"](l, m - k), new f["default"](l, m));
                    case j.BOTTOM_RIGHT:
                        return new g["default"](new f["default"](l, b), new f["default"](l, b + k), new f["default"](a + i, m), new f["default"](a, m));
                    case j.BOTTOM_LEFT:
                    default:
                        return new g["default"](new f["default"](l, m), new f["default"](l - i, m), new f["default"](a, b + k), new f["default"](a, b))
                }
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.calculateLengthFromValueWithUnit = b.LENGTH_TYPE = void 0;
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = (function(a) {
                a && a.__esModule
            }(c(5)), b.LENGTH_TYPE = {
                PX: 0,
                PERCENTAGE: 1
            }),
            f = function() {
                function a(b) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.type = "%" === b.substr(b.length - 1) ? e.PERCENTAGE : e.PX;
                    var c = parseFloat(b);
                    this.value = isNaN(c) ? 0 : c
                }
                return d(a, [{
                    key: "isPercentage",
                    value: function() {
                        return this.type === e.PERCENTAGE
                    }
                }, {
                    key: "getAbsoluteValue",
                    value: function(a) {
                        return this.isPercentage() ? a * (this.value / 100) : this.value
                    }
                }], [{
                    key: "create",
                    value: function(b) {
                        return new a(b)
                    }
                }]), a
            }();
        b["default"] = f, b.calculateLengthFromValueWithUnit = function(a, b, c) {
            switch (c) {
                case "px":
                case "%":
                    return new f(b + c);
                case "em":
                case "rem":
                    var d = new f(b);
                    return d.value *= "em" === c ? parseFloat(a.style.font.fontSize) : function e(a) {
                        var b = a.parent;
                        return b ? e(b) : parseFloat(a.style.font.fontSize)
                    }(a), d;
                default:
                    return new f("0")
            }
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.contains = function(a, b) {
            return 0 != (a & b)
        }, b.distance = function(a, b) {
            return Math.sqrt(a * a + b * b)
        }, b.copyCSSStyles = function(a, b) {
            for (var c = a.length - 1; c >= 0; c--) {
                var d = a.item(c);
                "content" !== d && b.style.setProperty(d, a.getPropertyValue(d))
            }
            return b
        }, b.SMALL_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.PATH = {
            VECTOR: 0,
            BEZIER_CURVE: 1,
            CIRCLE: 2
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(0)),
            f = c(3),
            g = c(6),
            h = c(10),
            i = c(28),
            j = c(29),
            k = c(30),
            l = c(31),
            m = c(32),
            n = c(33),
            o = c(14),
            p = c(15),
            q = c(9),
            r = c(34),
            s = c(16),
            t = c(35),
            u = c(36),
            v = c(37),
            w = c(1),
            x = c(17),
            y = ["INPUT", "TEXTAREA", "SELECT"],
            z = function() {
                function a(b, c, d, f) {
                    var z = this;
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.parent = c, this.index = f, this.childNodes = [];
                    var B = b.ownerDocument.defaultView,
                        C = B.pageXOffset,
                        D = B.pageYOffset,
                        E = B.getComputedStyle(b, null),
                        F = j.parseDisplay(E.display),
                        G = "radio" === b.type || "checkbox" === b.type,
                        H = p.parsePosition(E.position);
                    this.style = {
                        background: G ? x.INPUT_BACKGROUND : g.parseBackground(E, d),
                        border: G ? x.INPUT_BORDERS : h.parseBorder(E),
                        borderRadius: (b instanceof B.HTMLInputElement || b instanceof HTMLInputElement) && G ? x.getInputBorderRadius(b) : i.parseBorderRadius(E),
                        color: G ? x.INPUT_COLOR : new e["default"](E.color),
                        display: F,
                        "float": k.parseCSSFloat(E["float"]),
                        font: l.parseFont(E),
                        letterSpacing: m.parseLetterSpacing(E.letterSpacing),
                        opacity: parseFloat(E.opacity),
                        overflow: -1 === y.indexOf(b.tagName) ? n.parseOverflow(E.overflow) : n.OVERFLOW.HIDDEN,
                        padding: o.parsePadding(E),
                        position: H,
                        textDecoration: q.parseTextDecoration(E),
                        textShadow: r.parseTextShadow(E.textShadow),
                        textTransform: s.parseTextTransform(E.textTransform),
                        transform: t.parseTransform(E),
                        visibility: u.parseVisibility(E.visibility),
                        zIndex: v.parseZIndex(H !== p.POSITION.STATIC ? E.zIndex : "auto")
                    }, this.isTransformed() && (b.style.transform = "matrix(1,0,0,1,0,0)"), "IMG" === b.tagName && b.addEventListener("load", function() {
                        z.bounds = w.parseBounds(b, C, D), z.curvedBounds = w.parseBoundCurves(z.bounds, z.style.border, z.style.borderRadius)
                    }), this.image = A(b, d), this.bounds = G ? x.reformatInputBounds(w.parseBounds(b, C, D)) : w.parseBounds(b, C, D), this.curvedBounds = w.parseBoundCurves(this.bounds, this.style.border, this.style.borderRadius)
                }
                return d(a, [{
                    key: "getClipPaths",
                    value: function() {
                        var a = this.parent ? this.parent.getClipPaths() : [];
                        return this.style.overflow === n.OVERFLOW.HIDDEN || this.style.overflow === n.OVERFLOW.SCROLL ? a.concat([w.calculatePaddingBoxPath(this.curvedBounds)]) : a
                    }
                }, {
                    key: "isInFlow",
                    value: function() {
                        return this.isRootElement() && !this.isFloating() && !this.isAbsolutelyPositioned()
                    }
                }, {
                    key: "isVisible",
                    value: function() {
                        return !f.contains(this.style.display, j.DISPLAY.NONE) && this.style.opacity > 0 && this.style.visibility === u.VISIBILITY.VISIBLE
                    }
                }, {
                    key: "isAbsolutelyPositioned",
                    value: function() {
                        return this.style.position !== p.POSITION.STATIC && this.style.position !== p.POSITION.RELATIVE
                    }
                }, {
                    key: "isPositioned",
                    value: function() {
                        return this.style.position !== p.POSITION.STATIC
                    }
                }, {
                    key: "isFloating",
                    value: function() {
                        return this.style["float"] !== k.FLOAT.NONE
                    }
                }, {
                    key: "isRootElement",
                    value: function() {
                        return null === this.parent
                    }
                }, {
                    key: "isTransformed",
                    value: function() {
                        return null !== this.style.transform
                    }
                }, {
                    key: "isPositionedWithZIndex",
                    value: function() {
                        return this.isPositioned() && !this.style.zIndex.auto
                    }
                }, {
                    key: "isInlineLevel",
                    value: function() {
                        return f.contains(this.style.display, j.DISPLAY.INLINE) || f.contains(this.style.display, j.DISPLAY.INLINE_BLOCK) || f.contains(this.style.display, j.DISPLAY.INLINE_FLEX) || f.contains(this.style.display, j.DISPLAY.INLINE_GRID) || f.contains(this.style.display, j.DISPLAY.INLINE_LIST_ITEM) || f.contains(this.style.display, j.DISPLAY.INLINE_TABLE)
                    }
                }, {
                    key: "isInlineBlockOrInlineTable",
                    value: function() {
                        return f.contains(this.style.display, j.DISPLAY.INLINE_BLOCK) || f.contains(this.style.display, j.DISPLAY.INLINE_TABLE)
                    }
                }]), a
            }();
        b["default"] = z;
        var A = function(a, b) {
            if (a instanceof a.ownerDocument.defaultView.SVGSVGElement || a instanceof SVGSVGElement) {
                var c = new XMLSerializer;
                return b.loadImage("data:image/svg+xml," + encodeURIComponent(c.serializeToString(a)))
            }
            switch (a.tagName) {
                case "IMG":
                    var d = a;
                    return b.loadImage(d.currentSrc || d.src);
                case "CANVAS":
                    var e = a;
                    return b.loadCanvas(e);
                case "IFRAME":
                    var f = a.getAttribute("data-html2canvas-internal-iframe-key");
                    if (f) return f
            }
            return null
        }
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseBackgroundImage = b.parseBackground = b.calculateBackgroundRepeatPath = b.calculateBackgroundPosition = b.calculateBackgroungPositioningArea = b.calculateBackgroungPaintingArea = b.calculateGradientBackgroundSize = b.calculateBackgroundSize = b.BACKGROUND_ORIGIN = b.BACKGROUND_CLIP = b.BACKGROUND_SIZE = b.BACKGROUND_REPEAT = void 0;
        var e = d(c(0)),
            f = d(c(2)),
            g = d(c(26)),
            h = d(c(7)),
            i = c(1),
            j = c(14),
            k = b.BACKGROUND_REPEAT = {
                REPEAT: 0,
                NO_REPEAT: 1,
                REPEAT_X: 2,
                REPEAT_Y: 3
            },
            l = b.BACKGROUND_SIZE = {
                AUTO: 0,
                CONTAIN: 1,
                COVER: 2,
                LENGTH: 3
            },
            m = b.BACKGROUND_CLIP = {
                BORDER_BOX: 0,
                PADDING_BOX: 1,
                CONTENT_BOX: 2
            },
            n = b.BACKGROUND_ORIGIN = m,
            o = function w(a) {
                switch (function(a, b) {
                    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                }(this, w), a) {
                    case "contain":
                        this.size = l.CONTAIN;
                        break;
                    case "cover":
                        this.size = l.COVER;
                        break;
                    case "auto":
                        this.size = l.AUTO;
                        break;
                    default:
                        this.value = new f["default"](a)
                }
            },
            p = (b.calculateBackgroundSize = function(a, b, c) {
                var d = 0,
                    e = 0,
                    f = a.size;
                if (f[0].size === l.CONTAIN || f[0].size === l.COVER) {
                    var h = c.width / c.height,
                        i = b.width / b.height;
                    return i > h != (f[0].size === l.COVER) ? new g["default"](c.width, c.width / i) : new g["default"](c.height * i, c.height)
                }
                return f[0].value && (d = f[0].value.getAbsoluteValue(c.width)), f[0].size === l.AUTO && f[1].size === l.AUTO ? e = b.height : f[1].size === l.AUTO ? e = d / b.width * b.height : f[1].value && (e = f[1].value.getAbsoluteValue(c.height)), f[0].size === l.AUTO && (d = e / b.height * b.width), new g["default"](d, e)
            }, b.calculateGradientBackgroundSize = function(a, b) {
                var c = a.size,
                    d = c[0].value ? c[0].value.getAbsoluteValue(b.width) : b.width,
                    e = c[1].value ? c[1].value.getAbsoluteValue(b.height) : c[0].value ? d : b.height;
                return new g["default"](d, e)
            }, new o("auto")),
            q = (b.calculateBackgroungPaintingArea = function(a, b) {
                switch (b) {
                    case m.BORDER_BOX:
                        return i.calculateBorderBoxPath(a);
                    case m.PADDING_BOX:
                    default:
                        return i.calculatePaddingBoxPath(a)
                }
            }, b.calculateBackgroungPositioningArea = function(a, b, c, d) {
                var e = i.calculatePaddingBox(b, d);
                switch (a) {
                    case n.BORDER_BOX:
                        return b;
                    case n.CONTENT_BOX:
                        var f = c[j.PADDING_SIDES.LEFT].getAbsoluteValue(b.width),
                            g = c[j.PADDING_SIDES.RIGHT].getAbsoluteValue(b.width),
                            h = c[j.PADDING_SIDES.TOP].getAbsoluteValue(b.width),
                            k = c[j.PADDING_SIDES.BOTTOM].getAbsoluteValue(b.width);
                        return new i.Bounds(e.left + f, e.top + h, e.width - f - g, e.height - h - k);
                    case n.PADDING_BOX:
                    default:
                        return e
                }
            }, b.calculateBackgroundPosition = function(a, b, c) {
                return new h["default"](a[0].getAbsoluteValue(c.width - b.width), a[1].getAbsoluteValue(c.height - b.height))
            }, b.calculateBackgroundRepeatPath = function(a, b, c, d, e) {
                switch (a.repeat) {
                    case k.REPEAT_X:
                        return [new h["default"](Math.round(e.left), Math.round(d.top + b.y)), new h["default"](Math.round(e.left + e.width), Math.round(d.top + b.y)), new h["default"](Math.round(e.left + e.width), Math.round(c.height + d.top + b.y)), new h["default"](Math.round(e.left), Math.round(c.height + d.top + b.y))];
                    case k.REPEAT_Y:
                        return [new h["default"](Math.round(d.left + b.x), Math.round(e.top)), new h["default"](Math.round(d.left + b.x + c.width), Math.round(e.top)), new h["default"](Math.round(d.left + b.x + c.width), Math.round(e.height + e.top)), new h["default"](Math.round(d.left + b.x), Math.round(e.height + e.top))];
                    case k.NO_REPEAT:
                        return [new h["default"](Math.round(d.left + b.x), Math.round(d.top + b.y)), new h["default"](Math.round(d.left + b.x + c.width), Math.round(d.top + b.y)), new h["default"](Math.round(d.left + b.x + c.width), Math.round(d.top + b.y + c.height)), new h["default"](Math.round(d.left + b.x), Math.round(d.top + b.y + c.height))];
                    default:
                        return [new h["default"](Math.round(e.left), Math.round(e.top)), new h["default"](Math.round(e.left + e.width), Math.round(e.top)), new h["default"](Math.round(e.left + e.width), Math.round(e.height + e.top)), new h["default"](Math.round(e.left), Math.round(e.height + e.top))]
                }
            }, b.parseBackground = function(a, b) {
                return {
                    backgroundColor: new e["default"](a.backgroundColor),
                    backgroundImage: s(a, b),
                    backgroundClip: q(a.backgroundClip),
                    backgroundOrigin: r(a.backgroundOrigin)
                }
            }, function(a) {
                switch (a) {
                    case "padding-box":
                        return m.PADDING_BOX;
                    case "content-box":
                        return m.CONTENT_BOX
                }
                return m.BORDER_BOX
            }),
            r = function(a) {
                switch (a) {
                    case "padding-box":
                        return n.PADDING_BOX;
                    case "content-box":
                        return n.CONTENT_BOX
                }
                return n.BORDER_BOX
            },
            s = function(a, b) {
                var c = v(a.backgroundImage).map(function(a) {
                        if ("url" === a.method) {
                            var c = b.loadImage(a.args[0]);
                            a.args = c ? [c] : []
                        }
                        return a
                    }),
                    d = a.backgroundPosition.split(","),
                    e = a.backgroundRepeat.split(","),
                    f = a.backgroundSize.split(",");
                return c.map(function(a, b) {
                    var c = (f[b] || "auto").trim().split(" ").map(t),
                        g = (d[b] || "auto").trim().split(" ").map(u);
                    return {
                        source: a,
                        repeat: function(a) {
                            switch (a.trim()) {
                                case "no-repeat":
                                    return k.NO_REPEAT;
                                case "repeat-x":
                                case "repeat no-repeat":
                                    return k.REPEAT_X;
                                case "repeat-y":
                                case "no-repeat repeat":
                                    return k.REPEAT_Y;
                                case "repeat":
                                    return k.REPEAT
                            }
                            return k.REPEAT
                        }("string" == typeof e[b] ? e[b] : e[0]),
                        size: c.length < 2 ? [c[0], p] : [c[0], c[1]],
                        position: g.length < 2 ? [g[0], g[0]] : [g[0], g[1]]
                    }
                })
            },
            t = function(a) {
                return "auto" === a ? p : new o(a)
            },
            u = function(a) {
                switch (a) {
                    case "bottom":
                    case "right":
                        return new f["default"]("100%");
                    case "left":
                    case "top":
                        return new f["default"]("0%");
                    case "auto":
                        return new f["default"]("0")
                }
                return new f["default"](a)
            },
            v = b.parseBackgroundImage = function(a) {
                var b = /^\s$/,
                    c = [],
                    d = [],
                    e = "",
                    f = null,
                    g = "",
                    h = 0,
                    i = 0,
                    j = function() {
                        var a = "";
                        if (e) {
                            '"' === g.substr(0, 1) && (g = g.substr(1, g.length - 2)), g && d.push(g.trim());
                            var b = e.indexOf("-", 1) + 1;
                            "-" === e.substr(0, 1) && b > 0 && (a = e.substr(0, b).toLowerCase(), e = e.substr(b)), "none" !== (e = e.toLowerCase()) && c.push({
                                prefix: a,
                                method: e,
                                args: d
                            })
                        }
                        d = [], e = g = ""
                    };
                return a.split("").forEach(function(a) {
                    if (0 !== h || !b.test(a)) {
                        switch (a) {
                            case '"':
                                f ? f === a && (f = null) : f = a;
                                break;
                            case "(":
                                if (f) break;
                                if (0 === h) return void(h = 1);
                                i++;
                                break;
                            case ")":
                                if (f) break;
                                if (1 === h) {
                                    if (0 === i) return h = 0, void j();
                                    i--
                                }
                                break;
                            case ",":
                                if (f) break;
                                if (0 === h) return void j();
                                if (1 === h && 0 === i && !e.match(/^url$/i)) return d.push(g.trim()), void(g = "")
                        }
                        0 === h ? e += a : g += a
                    }
                }), j(), c
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = c(4);
        b["default"] = function e(a, b) {
            ! function(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.type = d.PATH.VECTOR, this.x = a, this.y = b
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = c(19),
            e = function(a) {
                return 0 === a[0] && 255 === a[1] && 0 === a[2] && 255 === a[3]
            },
            f = {get SUPPORT_RANGE_BOUNDS() {
                    var a = function(a) {
                        if (a.createRange) {
                            var b = a.createRange();
                            if (b.getBoundingClientRect) {
                                var c = a.createElement("boundtest");
                                c.style.height = "123px", c.style.display = "block", a.body.appendChild(c), b.selectNode(c);
                                var d = b.getBoundingClientRect(),
                                    e = Math.round(d.height);
                                if (a.body.removeChild(c), 123 === e) return !0
                            }
                        }
                        return !1
                    }(document);
                    return Object.defineProperty(f, "SUPPORT_RANGE_BOUNDS", {
                        value: a
                    }), a
                },
                get SUPPORT_SVG_DRAWING() {
                    var a = function(a) {
                        var b = new Image,
                            c = a.createElement("canvas"),
                            d = c.getContext("2d");
                        b.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";
                        try {
                            d.drawImage(b, 0, 0), c.toDataURL()
                        } catch (a) {
                            return !1
                        }
                        return !0
                    }(document);
                    return Object.defineProperty(f, "SUPPORT_SVG_DRAWING", {
                        value: a
                    }), a
                },
                get SUPPORT_BASE64_DRAWING() {
                    return function(a) {
                        var b = function(a, b) {
                            var c = new Image,
                                d = a.createElement("canvas"),
                                e = d.getContext("2d");
                            return new Promise(function(a) {
                                c.src = b;
                                var f = function() {
                                    try {
                                        e.drawImage(c, 0, 0), d.toDataURL()
                                    } catch (b) {
                                        return a(!1)
                                    }
                                    return a(!0)
                                };
                                c.onload = f, c.onerror = function() {
                                    return a(!1)
                                }, !0 === c.complete && setTimeout(function() {
                                    f()
                                }, 500)
                            })
                        }(document, a);
                        return Object.defineProperty(f, "SUPPORT_BASE64_DRAWING", {
                            value: function() {
                                return b
                            }
                        }), b
                    }
                },
                get SUPPORT_FOREIGNOBJECT_DRAWING() {
                    var a = "function" == typeof Array.from && "function" == typeof window.fetch ? function(a) {
                        var b = a.createElement("canvas");
                        b.width = 100, b.height = 100;
                        var c = b.getContext("2d");
                        c.fillStyle = "rgb(0, 255, 0)", c.fillRect(0, 0, 100, 100);
                        var f = new Image,
                            g = b.toDataURL();
                        f.src = g;
                        var h = d.createForeignObjectSVG(100, 100, 0, 0, f);
                        return c.fillStyle = "red", c.fillRect(0, 0, 100, 100), d.loadSerializedSVG(h).then(function(b) {
                            c.drawImage(b, 0, 0);
                            var f = c.getImageData(0, 0, 100, 100).data;
                            c.fillStyle = "red", c.fillRect(0, 0, 100, 100);
                            var h = a.createElement("div");
                            return h.style.backgroundImage = "url(" + g + ")", h.style.height = "100px", e(f) ? d.loadSerializedSVG(d.createForeignObjectSVG(100, 100, 0, 0, h)) : Promise.reject(!1)
                        }).then(function(a) {
                            return c.drawImage(a, 0, 0), e(c.getImageData(0, 0, 100, 100).data)
                        })["catch"](function(a) {
                            return !1
                        })
                    }(document) : Promise.resolve(!1);
                    return Object.defineProperty(f, "SUPPORT_FOREIGNOBJECT_DRAWING", {
                        value: a
                    }), a
                },
                get SUPPORT_CORS_IMAGES() {
                    var a = void 0 !== (new Image).crossOrigin;
                    return Object.defineProperty(f, "SUPPORT_CORS_IMAGES", {
                        value: a
                    }), a
                },
                get SUPPORT_RESPONSE_TYPE() {
                    var a = "string" == typeof(new XMLHttpRequest).responseType;
                    return Object.defineProperty(f, "SUPPORT_RESPONSE_TYPE", {
                        value: a
                    }), a
                },
                get SUPPORT_CORS_XHR() {
                    var a = "withCredentials" in new XMLHttpRequest;
                    return Object.defineProperty(f, "SUPPORT_CORS_XHR", {
                        value: a
                    }), a
                }
            };
        b["default"] = f
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseTextDecoration = b.TEXT_DECORATION_LINE = b.TEXT_DECORATION = b.TEXT_DECORATION_STYLE = void 0;
        var d = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(0)),
            e = b.TEXT_DECORATION_STYLE = {
                SOLID: 0,
                DOUBLE: 1,
                DOTTED: 2,
                DASHED: 3,
                WAVY: 4
            },
            f = b.TEXT_DECORATION = {
                NONE: null
            },
            g = b.TEXT_DECORATION_LINE = {
                UNDERLINE: 1,
                OVERLINE: 2,
                LINE_THROUGH: 3,
                BLINK: 4
            },
            h = function(a) {
                switch (a) {
                    case "underline":
                        return g.UNDERLINE;
                    case "overline":
                        return g.OVERLINE;
                    case "line-through":
                        return g.LINE_THROUGH
                }
                return g.BLINK
            };
        b.parseTextDecoration = function(a) {
            var b = function(a) {
                return "none" === a ? null : a.split(" ").map(h)
            }(a.textDecorationLine ? a.textDecorationLine : a.textDecoration);
            return null === b ? f.NONE : {
                textDecorationLine: b,
                textDecorationColor: a.textDecorationColor ? new d["default"](a.textDecorationColor) : null,
                textDecorationStyle: function(a) {
                    switch (a) {
                        case "double":
                            return e.DOUBLE;
                        case "dotted":
                            return e.DOTTED;
                        case "dashed":
                            return e.DASHED;
                        case "wavy":
                            return e.WAVY
                    }
                    return e.SOLID
                }(a.textDecorationStyle)
            }
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseBorder = b.BORDER_SIDES = b.BORDER_STYLE = void 0;
        var d = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(0)),
            e = b.BORDER_STYLE = {
                NONE: 0,
                SOLID: 1
            },
            f = b.BORDER_SIDES = {
                TOP: 0,
                RIGHT: 1,
                BOTTOM: 2,
                LEFT: 3
            },
            g = Object.keys(f).map(function(a) {
                return a.toLowerCase()
            });
        b.parseBorder = function(a) {
            return g.map(function(b) {
                var c = new d["default"](a.getPropertyValue("border-" + b + "-color")),
                    f = function(a) {
                        switch (a) {
                            case "none":
                                return e.NONE
                        }
                        return e.SOLID
                    }(a.getPropertyValue("border-" + b + "-style")),
                    g = parseFloat(a.getPropertyValue("border-" + b + "-width"));
                return {
                    borderColor: c,
                    borderStyle: f,
                    borderWidth: isNaN(g) ? 0 : g
                }
            })
        }
    }, function(a, b, c) {
        "use strict";

        function d(a, b, c) {
            return a.length > 0 ? b + c.toUpperCase() : a
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var e = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            f = c(16),
            g = c(18),
            h = function() {
                function a(b, c, d) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.text = b, this.parent = c, this.bounds = d
                }
                return e(a, null, [{
                    key: "fromTextNode",
                    value: function(b, c) {
                        var d = j(b.data, c.style.textTransform);
                        return new a(d, c, g.parseTextBounds(d, c, b))
                    }
                }]), a
            }();
        b["default"] = h;
        var i = /(^|\s|:|-|\(|\))([a-z])/g,
            j = function(a, b) {
                switch (b) {
                    case f.TEXT_TRANSFORM.LOWERCASE:
                        return a.toLowerCase();
                    case f.TEXT_TRANSFORM.CAPITALIZE:
                        return a.replace(i, d);
                    case f.TEXT_TRANSFORM.UPPERCASE:
                        return a.toUpperCase();
                    default:
                        return a
                }
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = c(4),
            f = c(9),
            g = function(a, b) {
                var c = Math.max.apply(null, a.colorStops.map(function(a) {
                        return a.stop
                    })),
                    d = 1 / Math.max(1, c);
                a.colorStops.forEach(function(a) {
                    b.addColorStop(d * a.stop, a.color.toString())
                })
            },
            h = function() {
                function a(b) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.canvas = b || document.createElement("canvas")
                }
                return d(a, [{
                    key: "render",
                    value: function(a) {
                        this.ctx = this.canvas.getContext("2d"), this.options = a, this.canvas.width = Math.floor(a.width * a.scale), this.canvas.height = Math.floor(a.height * a.scale), this.canvas.style.width = a.width + "px", this.canvas.style.height = a.height + "px", this.ctx.scale(this.options.scale, this.options.scale), this.ctx.translate(-a.x, -a.y), this.ctx.textBaseline = "bottom", a.logger.log("Canvas renderer initialized (" + a.width + "x" + a.height + " at " + a.x + "," + a.y + ") with scale " + this.options.scale)
                    }
                }, {
                    key: "clip",
                    value: function(a, b) {
                        var c = this;
                        a.length && (this.ctx.save(), a.forEach(function(a) {
                            c.path(a), c.ctx.clip()
                        })), b(), a.length && this.ctx.restore()
                    }
                }, {
                    key: "drawImage",
                    value: function(a, b, c) {
                        this.ctx.drawImage(a, b.left, b.top, b.width, b.height, c.left, c.top, c.width, c.height)
                    }
                }, {
                    key: "drawShape",
                    value: function(a, b) {
                        this.path(a), this.ctx.fillStyle = b.toString(), this.ctx.fill()
                    }
                }, {
                    key: "fill",
                    value: function(a) {
                        this.ctx.fillStyle = a.toString(), this.ctx.fill()
                    }
                }, {
                    key: "getTarget",
                    value: function() {
                        return Promise.resolve(this.canvas)
                    }
                }, {
                    key: "path",
                    value: function(a) {
                        var b = this;
                        this.ctx.beginPath(), Array.isArray(a) ? a.forEach(function(a, c) {
                            var d = a.type === e.PATH.VECTOR ? a : a.start;
                            0 === c ? b.ctx.moveTo(d.x, d.y) : b.ctx.lineTo(d.x, d.y), a.type === e.PATH.BEZIER_CURVE && b.ctx.bezierCurveTo(a.startControl.x, a.startControl.y, a.endControl.x, a.endControl.y, a.end.x, a.end.y)
                        }) : this.ctx.arc(a.x + a.radius, a.y + a.radius, a.radius, 0, 2 * Math.PI, !0), this.ctx.closePath()
                    }
                }, {
                    key: "rectangle",
                    value: function(a, b, c, d, e) {
                        this.ctx.fillStyle = e.toString(), this.ctx.fillRect(a, b, c, d)
                    }
                }, {
                    key: "renderLinearGradient",
                    value: function(a, b) {
                        var c = this.ctx.createLinearGradient(a.left + b.direction.x1, a.top + b.direction.y1, a.left + b.direction.x0, a.top + b.direction.y0);
                        g(b, c), this.ctx.fillStyle = c, this.ctx.fillRect(a.left, a.top, a.width, a.height)
                    }
                }, {
                    key: "renderRadialGradient",
                    value: function(a, b) {
                        var c = this,
                            d = a.left + b.center.x,
                            e = a.top + b.center.y,
                            f = this.ctx.createRadialGradient(d, e, 0, d, e, b.radius.x);
                        if (f)
                            if (g(b, f), this.ctx.fillStyle = f, b.radius.x !== b.radius.y) {
                                var h = a.left + .5 * a.width,
                                    i = a.top + .5 * a.height,
                                    j = b.radius.y / b.radius.x,
                                    k = 1 / j;
                                this.transform(h, i, [1, 0, 0, j, 0, 0], function() {
                                    return c.ctx.fillRect(a.left, k * (a.top - i) + i, a.width, a.height * k)
                                })
                            } else this.ctx.fillRect(a.left, a.top, a.width, a.height)
                    }
                }, {
                    key: "renderRepeat",
                    value: function(a, b, c, d, e) {
                        this.path(a), this.ctx.fillStyle = this.ctx.createPattern(this.resizeImage(b, c), "repeat"), this.ctx.translate(d, e), this.ctx.fill(), this.ctx.translate(-d, -e)
                    }
                }, {
                    key: "renderTextNode",
                    value: function(a, b, c, d, e) {
                        var g = this;
                        this.ctx.font = [c.fontStyle, c.fontVariant, c.fontWeight, c.fontSize, c.fontFamily].join(" "), a.forEach(function(a) {
                            if (g.ctx.fillStyle = b.toString(), e && a.text.trim().length ? e.slice(0).reverse().forEach(function(b) {
                                    g.ctx.shadowColor = b.color.toString(), g.ctx.shadowOffsetX = b.offsetX * g.options.scale, g.ctx.shadowOffsetY = b.offsetY * g.options.scale, g.ctx.shadowBlur = b.blur, g.ctx.fillText(a.text, a.bounds.left, a.bounds.top + a.bounds.height)
                                }) : g.ctx.fillText(a.text, a.bounds.left, a.bounds.top + a.bounds.height), null !== d) {
                                var h = d.textDecorationColor || b;
                                d.textDecorationLine.forEach(function(b) {
                                    switch (b) {
                                        case f.TEXT_DECORATION_LINE.UNDERLINE:
                                            var d = g.options.fontMetrics.getMetrics(c).baseline;
                                            g.rectangle(a.bounds.left, Math.round(a.bounds.top + d), a.bounds.width, 1, h);
                                            break;
                                        case f.TEXT_DECORATION_LINE.OVERLINE:
                                            g.rectangle(a.bounds.left, Math.round(a.bounds.top), a.bounds.width, 1, h);
                                            break;
                                        case f.TEXT_DECORATION_LINE.LINE_THROUGH:
                                            var e = g.options.fontMetrics.getMetrics(c).middle;
                                            g.rectangle(a.bounds.left, Math.ceil(a.bounds.top + e), a.bounds.width, 1, h)
                                    }
                                })
                            }
                        })
                    }
                }, {
                    key: "resizeImage",
                    value: function(a, b) {
                        if (a.width === b.width && a.height === b.height) return a;
                        var c = this.canvas.ownerDocument.createElement("canvas");
                        return c.width = b.width, c.height = b.height, c.getContext("2d").drawImage(a, 0, 0, a.width, a.height, 0, 0, b.width, b.height), c
                    }
                }, {
                    key: "setOpacity",
                    value: function(a) {
                        this.ctx.globalAlpha = a
                    }
                }, {
                    key: "transform",
                    value: function(a, b, c, d) {
                        this.ctx.save(), this.ctx.translate(a, b), this.ctx.transform(c[0], c[1], c[2], c[3], c[4], c[5]), this.ctx.translate(-a, -b), d(), this.ctx.restore()
                    }
                }]), a
            }();
        b["default"] = h
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = function() {
                function a(b, c, d) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.enabled = b, this.start = d || Date.now(), this.id = c
                }
                return d(a, [{
                    key: "child",
                    value: function(b) {
                        return new a(this.enabled, b, this.start)
                    }
                }, {
                    key: "log",
                    value: function() {
                        if (this.enabled && window.console && window.console.log) {
                            for (var a = arguments.length, b = Array(a), c = 0; a > c; c++) b[c] = arguments[c];
                            Function.prototype.bind.call(window.console.log, window.console).apply(window.console, [Date.now() - this.start + "ms", this.id ? "html2canvas (" + this.id + "):" : "html2canvas:"].concat([].slice.call(b, 0)))
                        }
                    }
                }, {
                    key: "error",
                    value: function() {
                        if (this.enabled && window.console && window.console.error) {
                            for (var a = arguments.length, b = Array(a), c = 0; a > c; c++) b[c] = arguments[c];
                            Function.prototype.bind.call(window.console.error, window.console).apply(window.console, [Date.now() - this.start + "ms", this.id ? "html2canvas (" + this.id + "):" : "html2canvas:"].concat([].slice.call(b, 0)))
                        }
                    }
                }]), a
            }();
        b["default"] = e
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parsePadding = b.PADDING_SIDES = void 0;
        var d = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(2)),
            e = (b.PADDING_SIDES = {
                TOP: 0,
                RIGHT: 1,
                BOTTOM: 2,
                LEFT: 3
            }, ["top", "right", "bottom", "left"]);
        b.parsePadding = function(a) {
            return e.map(function(b) {
                return new d["default"](a.getPropertyValue("padding-" + b))
            })
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = b.POSITION = {
            STATIC: 0,
            RELATIVE: 1,
            ABSOLUTE: 2,
            FIXED: 3,
            STICKY: 4
        };
        b.parsePosition = function(a) {
            switch (a) {
                case "relative":
                    return d.RELATIVE;
                case "absolute":
                    return d.ABSOLUTE;
                case "fixed":
                    return d.FIXED;
                case "sticky":
                    return d.STICKY
            }
            return d.STATIC
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = b.TEXT_TRANSFORM = {
            NONE: 0,
            LOWERCASE: 1,
            UPPERCASE: 2,
            CAPITALIZE: 3
        };
        b.parseTextTransform = function(a) {
            switch (a) {
                case "uppercase":
                    return d.UPPERCASE;
                case "lowercase":
                    return d.LOWERCASE;
                case "capitalize":
                    return d.CAPITALIZE
            }
            return d.NONE
        }
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.reformatInputBounds = b.inlineSelectElement = b.inlineTextAreaElement = b.inlineInputElement = b.getInputBorderRadius = b.INPUT_BACKGROUND = b.INPUT_BORDERS = b.INPUT_COLOR = void 0;
        var e = d(c(11)),
            f = c(6),
            g = c(10),
            h = d(c(41)),
            i = d(c(7)),
            j = d(c(0)),
            k = d(c(2)),
            l = (c(1), c(18), c(3)),
            m = (b.INPUT_COLOR = new j["default"]([42, 42, 42]), new j["default"]([165, 165, 165])),
            n = new j["default"]([222, 222, 222]),
            o = {
                borderWidth: 1,
                borderColor: m,
                borderStyle: g.BORDER_STYLE.SOLID
            },
            p = (b.INPUT_BORDERS = [o, o, o, o], b.INPUT_BACKGROUND = {
                backgroundColor: n,
                backgroundImage: [],
                backgroundClip: f.BACKGROUND_CLIP.PADDING_BOX,
                backgroundOrigin: f.BACKGROUND_ORIGIN.PADDING_BOX
            }, new k["default"]("50%")),
            q = [p, p],
            r = [q, q, q, q],
            s = new k["default"]("3px"),
            t = [s, s],
            u = [t, t, t, t],
            v = (b.getInputBorderRadius = function(a) {
                return "radio" === a.type ? r : u
            }, b.inlineInputElement = function(a, b) {
                if ("radio" === a.type || "checkbox" === a.type) {
                    if (a.checked) {
                        var c = Math.min(b.bounds.width, b.bounds.height);
                        b.childNodes.push("checkbox" === a.type ? [new i["default"](b.bounds.left + .39363 * c, b.bounds.top + .79 * c), new i["default"](b.bounds.left + .16 * c, b.bounds.top + .5549 * c), new i["default"](b.bounds.left + .27347 * c, b.bounds.top + .44071 * c), new i["default"](b.bounds.left + .39694 * c, b.bounds.top + .5649 * c), new i["default"](b.bounds.left + .72983 * c, b.bounds.top + .23 * c), new i["default"](b.bounds.left + .84 * c, b.bounds.top + .34085 * c), new i["default"](b.bounds.left + .39363 * c, b.bounds.top + .79 * c)] : new h["default"](b.bounds.left + c / 4, b.bounds.top + c / 4, c / 4))
                    }
                } else v(w(a), a, b, !1)
            }, b.inlineTextAreaElement = function(a, b) {
                v(a.value, a, b, !0)
            }, b.inlineSelectElement = function(a, b) {
                var c = a.options[a.selectedIndex || 0];
                v(c ? c.text || "" : "", a, b, !1)
            }, b.reformatInputBounds = function(a) {
                return a.width > a.height ? (a.left += (a.width - a.height) / 2, a.width = a.height) : a.width < a.height && (a.top += (a.height - a.width) / 2, a.height = a.width), a
            }, function(a, b, c, d) {
                var f = b.ownerDocument.body;
                if (a.length > 0 && f) {
                    var g = b.ownerDocument.createElement("html2canvaswrapper");
                    l.copyCSSStyles(b.ownerDocument.defaultView.getComputedStyle(b, null), g), g.style.position = "fixed", g.style.left = c.bounds.left + "px", g.style.top = c.bounds.top + "px", d || (g.style.whiteSpace = "nowrap");
                    var h = b.ownerDocument.createTextNode(a);
                    g.appendChild(h), f.appendChild(g), c.childNodes.push(e["default"].fromTextNode(h, c)), f.removeChild(g)
                }
            }),
            w = function(a) {
                var b = "password" === a.type ? new Array(a.value.length + 1).join("•") : a.value;
                return 0 === b.length ? a.placeholder || "" : b
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseTextBounds = b.TextBounds = void 0;
        var d = c(38),
            e = c(1),
            f = c(9),
            g = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(8)),
            h = /[^\u0000-\u00ff]/,
            i = function(a) {
                return d.ucs2.encode([a])
            },
            j = b.TextBounds = function o(a, b) {
                ! function(a, b) {
                    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                }(this, o), this.text = a, this.bounds = b
            },
            k = (b.parseTextBounds = function(a, b, c) {
                for (var e = d.ucs2.decode(a), n = 0 !== b.style.letterSpacing || function(a) {
                        return h.test(a)
                    }(a) ? e.map(i) : m(e), o = n.length, p = c.parentNode ? c.parentNode.ownerDocument.defaultView : null, q = p ? p.pageXOffset : 0, r = p ? p.pageYOffset : 0, s = [], t = 0, u = 0; o > u; u++) {
                    var v = n[u];
                    if (b.style.textDecoration !== f.TEXT_DECORATION.NONE || v.trim().length > 0)
                        if (g["default"].SUPPORT_RANGE_BOUNDS) s.push(new j(v, l(c, t, v.length, q, r)));
                        else {
                            var w = c.splitText(v.length);
                            s.push(new j(v, k(c, q, r))), c = w
                        } else g["default"].SUPPORT_RANGE_BOUNDS || (c = c.splitText(v.length));
                    t += v.length
                }
                return s
            }, function(a, b, c) {
                var d = a.ownerDocument.createElement("html2canvaswrapper");
                d.appendChild(a.cloneNode(!0));
                var f = a.parentNode;
                if (f) {
                    f.replaceChild(d, a);
                    var g = e.parseBounds(d, b, c);
                    return d.firstChild && f.replaceChild(d.firstChild, d), g
                }
                return new e.Bounds(0, 0, 0, 0)
            }),
            l = function(a, b, c, d, f) {
                var g = a.ownerDocument.createRange();
                return g.setStart(a, b), g.setEnd(a, b + c), e.Bounds.fromClientRect(g.getBoundingClientRect(), d, f)
            },
            m = function(a) {
                for (var b = [], c = 0, e = !1, f = void 0; a.length;) n(a[c]) === e ? ((f = a.splice(0, c)).length && b.push(d.ucs2.encode(f)), e = !e, c = 0) : c++, c >= a.length && (f = a.splice(0, c)).length && b.push(d.ucs2.encode(f));
                return b
            },
            n = function(a) {
                return -1 !== [32, 13, 10, 9, 45].indexOf(a)
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = function() {
                function a(b) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.element = b
                }
                return d(a, [{
                    key: "render",
                    value: function(a) {
                        var b = this;
                        this.options = a, this.canvas = document.createElement("canvas"), this.ctx = this.canvas.getContext("2d"), this.canvas.width = Math.floor(a.width) * a.scale, this.canvas.height = Math.floor(a.height) * a.scale, this.canvas.style.width = a.width + "px", this.canvas.style.height = a.height + "px", a.logger.log("ForeignObject renderer initialized (" + a.width + "x" + a.height + " at " + a.x + "," + a.y + ") with scale " + a.scale);
                        var c = f(Math.max(a.windowWidth, a.width) * a.scale, Math.max(a.windowHeight, a.height) * a.scale, a.scrollX * a.scale, a.scrollY * a.scale, this.element);
                        return g(c).then(function(c) {
                            return a.backgroundColor && (b.ctx.fillStyle = a.backgroundColor.toString(), b.ctx.fillRect(0, 0, a.width * a.scale, a.height * a.scale)), b.ctx.drawImage(c, -a.x * a.scale, -a.y * a.scale), b.canvas
                        })
                    }
                }]), a
            }();
        b["default"] = e;
        var f = b.createForeignObjectSVG = function(a, b, c, d, e) {
                var f = "http://www.w3.org/2000/svg",
                    g = document.createElementNS(f, "svg"),
                    h = document.createElementNS(f, "foreignObject");
                return g.setAttributeNS(null, "width", a), g.setAttributeNS(null, "height", b), h.setAttributeNS(null, "width", "100%"), h.setAttributeNS(null, "height", "100%"), h.setAttributeNS(null, "x", c), h.setAttributeNS(null, "y", d), h.setAttributeNS(null, "externalResourcesRequired", "true"), g.appendChild(h), h.appendChild(e), g
            },
            g = b.loadSerializedSVG = function(a) {
                return new Promise(function(b, c) {
                    var d = new Image;
                    d.onload = function() {
                        return b(d)
                    }, d.onerror = c, d.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent((new XMLSerializer).serializeToString(a))
                })
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.FontMetrics = void 0;
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = c(3);
        b.FontMetrics = function() {
            function a(b) {
                ! function(a, b) {
                    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                }(this, a), this._data = {}, this._document = b
            }
            return d(a, [{
                key: "_parseMetrics",
                value: function(a) {
                    var b = this._document.createElement("div"),
                        c = this._document.createElement("img"),
                        d = this._document.createElement("span"),
                        f = this._document.body;
                    if (!f) throw new Error("");
                    b.style.visibility = "hidden", b.style.fontFamily = a.fontFamily, b.style.fontSize = a.fontSize, b.style.margin = "0", b.style.padding = "0", f.appendChild(b), c.src = e.SMALL_IMAGE, c.width = 1, c.height = 1, c.style.margin = "0", c.style.padding = "0", c.style.verticalAlign = "baseline", d.style.fontFamily = a.fontFamily, d.style.fontSize = a.fontSize, d.style.margin = "0", d.style.padding = "0", d.appendChild(this._document.createTextNode("Hidden Text")), b.appendChild(d), b.appendChild(c);
                    var g = c.offsetTop - d.offsetTop + 2;
                    b.removeChild(d), b.appendChild(this._document.createTextNode("Hidden Text")), b.style.lineHeight = "normal", c.style.verticalAlign = "super";
                    var h = c.offsetTop - b.offsetTop + 2;
                    return f.removeChild(b), {
                        baseline: g,
                        middle: h
                    }
                }
            }, {
                key: "getMetrics",
                value: function(a) {
                    var b = a.fontFamily + " " + a.fontSize;
                    return void 0 === this._data[b] && (this._data[b] = this._parseMetrics(a)), this._data[b]
                }
            }]), a
        }()
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.Proxy = void 0;
        var d = function(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }(c(8));
        b.Proxy = function(a, b) {
            if (!b.proxy) return Promise.reject(null);
            var c = b.proxy;
            return new Promise(function(e, f) {
                var g = d["default"].SUPPORT_CORS_XHR && d["default"].SUPPORT_RESPONSE_TYPE ? "blob" : "text",
                    h = d["default"].SUPPORT_CORS_XHR ? new XMLHttpRequest : new XDomainRequest;
                if (h.onload = function() {
                        if (h instanceof XMLHttpRequest)
                            if (200 === h.status)
                                if ("text" === g) e(h.response);
                                else {
                                    var a = new FileReader;
                                    a.addEventListener("load", function() {
                                        return e(a.result)
                                    }, !1), a.addEventListener("error", function(a) {
                                        return f(a)
                                    }, !1), a.readAsDataURL(h.response)
                                } else f("");
                        else e(h.responseText)
                    }, h.onerror = f, h.open("GET", c + "?url=" + encodeURIComponent(a) + "&responseType=" + g), "text" !== g && h instanceof XMLHttpRequest && (h.responseType = g), b.imageTimeout) {
                    var i = b.imageTimeout;
                    h.timeout = i, h.ontimeout = function() {
                        return f("")
                    }
                }
                h.send()
            })
        }
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        var e = Object.assign || function(a) {
                for (var b = 1; b < arguments.length; b++) {
                    var c = arguments[b];
                    for (var d in c) Object.prototype.hasOwnProperty.call(c, d) && (a[d] = c[d])
                }
                return a
            },
            f = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
                return typeof a
            } : function(a) {
                return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
            },
            g = d(c(12)),
            h = d(c(13)),
            i = c(23),
            j = c(1),
            k = function(a, b) {
                "object" === ("undefined" == typeof console ? "undefined" : f(console)) && "function" == typeof console.log && console.log("html2canvas 1.0.0-alpha.4");
                var c = b || {},
                    d = new h["default"]("boolean" != typeof c.logging || c.logging),
                    k = a.ownerDocument;
                if (!k) return Promise.reject("Provided element is not within a Document");
                var l = k.defaultView,
                    m = l.pageXOffset,
                    n = l.pageYOffset,
                    o = "HTML" === a.tagName || "BODY" === a.tagName ? j.parseDocumentSize(k) : j.parseBounds(a, m, n),
                    p = o.width,
                    q = o.height,
                    r = o.left,
                    s = o.top,
                    t = {
                        async: !0,
                        allowTaint: !1,
                        backgroundColor: "#ffffff",
                        imageTimeout: 15e3,
                        logging: !0,
                        proxy: null,
                        removeContainer: !0,
                        foreignObjectRendering: !1,
                        scale: l.devicePixelRatio || 1,
                        target: new g["default"](c.canvas),
                        x: r,
                        y: s,
                        width: Math.ceil(p),
                        height: Math.ceil(q),
                        windowWidth: l.innerWidth,
                        windowHeight: l.innerHeight,
                        scrollX: l.pageXOffset,
                        scrollY: l.pageYOffset
                    },
                    u = i.renderElement(a, e({}, t, c), d);
                return u
            };
        k.CanvasRenderer = g["default"], a.exports = k
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.renderElement = void 0;
        var e = function() {
                return function(a, b) {
                    if (Array.isArray(a)) return a;
                    if (Symbol.iterator in Object(a)) return function(a, b) {
                        var c = [],
                            d = !0,
                            e = !1,
                            f = void 0;
                        try {
                            for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                        } catch (a) {
                            e = !0, f = a
                        } finally {
                            try {
                                !d && h["return"] && h["return"]()
                            } finally {
                                if (e) throw f
                            }
                        }
                        return c
                    }(a, b);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            f = (d(c(13)), c(24)),
            g = d(c(42)),
            h = d(c(19)),
            i = d(c(8)),
            j = c(1),
            k = c(45),
            l = c(20),
            m = c(0),
            n = d(m);
        b.renderElement = function o(a, b, c) {
            var d = a.ownerDocument,
                p = new j.Bounds(b.scrollX, b.scrollY, b.windowWidth, b.windowHeight),
                q = d.documentElement ? new n["default"](getComputedStyle(d.documentElement).backgroundColor) : m.TRANSPARENT,
                r = d.body ? new n["default"](getComputedStyle(d.body).backgroundColor) : m.TRANSPARENT,
                s = a === d.documentElement ? q.isTransparent() ? r.isTransparent() ? b.backgroundColor ? new n["default"](b.backgroundColor) : null : r : q : b.backgroundColor ? new n["default"](b.backgroundColor) : null;
            return (b.foreignObjectRendering ? i["default"].SUPPORT_FOREIGNOBJECT_DRAWING : Promise.resolve(!1)).then(function(i) {
                return i ? function(a) {
                    return a.inlineFonts(d).then(function() {
                        return a.resourceLoader.ready()
                    }).then(function() {
                        return new h["default"](a.documentElement).render({
                            backgroundColor: s,
                            logger: c,
                            scale: b.scale,
                            x: b.x,
                            y: b.y,
                            width: b.width,
                            height: b.height,
                            windowWidth: b.windowWidth,
                            windowHeight: b.windowHeight,
                            scrollX: b.scrollX,
                            scrollY: b.scrollY
                        })
                    })
                }(new k.DocumentCloner(a, b, c, !0, o)) : k.cloneWindow(d, p, a, b, c, o).then(function(a) {
                    var d = e(a, 3),
                        h = d[0],
                        i = d[1],
                        j = d[2],
                        k = f.NodeParser(i, j, c),
                        n = i.ownerDocument;
                    return s === k.container.style.background.backgroundColor && (k.container.style.background.backgroundColor = m.TRANSPARENT), j.ready().then(function(a) {
                        !0 === b.removeContainer && h.parentNode && h.parentNode.removeChild(h);
                        var d = new l.FontMetrics(n),
                            e = {
                                backgroundColor: s,
                                fontMetrics: d,
                                imageStore: a,
                                logger: c,
                                scale: b.scale,
                                x: b.x,
                                y: b.y,
                                width: b.width,
                                height: b.height
                            };
                        return Array.isArray(b.target) ? Promise.all(b.target.map(function(a) {
                            return new g["default"](a, e).render(k)
                        })) : new g["default"](b.target, e).render(k)
                    })
                })
            })
        }
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.NodeParser = void 0;
        var e = d(c(25)),
            f = d(c(5)),
            g = d(c(11)),
            h = c(17),
            i = (b.NodeParser = function(a, b, c) {
                var d = 0,
                    g = new f["default"](a, null, b, d++),
                    h = new e["default"](g, null, !0);
                return j(a, g, h, b, d), h
            }, ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"]),
            j = function n(a, b, c, d, j) {
                for (var m, o = a.firstChild; o; o = m) {
                    m = o.nextSibling;
                    var p = o.ownerDocument.defaultView;
                    if (o instanceof p.Text || o instanceof Text || p.parent && o instanceof p.parent.Text) o.data.trim().length > 0 && b.childNodes.push(g["default"].fromTextNode(o, b));
                    else if (o instanceof p.HTMLElement || o instanceof HTMLElement || p.parent && o instanceof p.parent.HTMLElement) {
                        if (-1 === i.indexOf(o.nodeName)) {
                            var q = new f["default"](o, b, d, j++);
                            if (q.isVisible()) {
                                "INPUT" === o.tagName ? h.inlineInputElement(o, q) : "TEXTAREA" === o.tagName ? h.inlineTextAreaElement(o, q) : "SELECT" === o.tagName && h.inlineSelectElement(o, q);
                                var r = "TEXTAREA" !== o.tagName,
                                    s = k(q, o);
                                if (s || l(q)) {
                                    var t = s || q.isPositioned() ? c.getRealParentStackingContext() : c,
                                        u = new e["default"](q, t, s);
                                    t.contexts.push(u), r && n(o, q, u, d, j)
                                } else c.children.push(q), r && n(o, q, c, d, j)
                            }
                        }
                    } else if (o instanceof p.SVGSVGElement || o instanceof SVGSVGElement || p.parent && o instanceof p.parent.SVGSVGElement) {
                        var v = new f["default"](o, b, d, j++),
                            w = k(v, o);
                        if (w || l(v)) {
                            var x = w || v.isPositioned() ? c.getRealParentStackingContext() : c,
                                y = new e["default"](v, x, w);
                            x.contexts.push(y)
                        } else c.children.push(v)
                    }
                }
            },
            k = function(a, b) {
                return a.isRootElement() || a.isPositionedWithZIndex() || a.style.opacity < 1 || a.isTransformed() || m(a, b)
            },
            l = function(a) {
                return a.isPositioned() || a.isFloating()
            },
            m = function(a, b) {
                return "BODY" === b.nodeName && a.parent instanceof f["default"] && a.parent.style.background.backgroundColor.isTransparent()
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = (function(a) {
                a && a.__esModule
            }(c(5)), c(15), function() {
                function a(b, c, d) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.container = b, this.parent = c, this.contexts = [], this.children = [], this.treatAsRealStackingContext = d
                }
                return d(a, [{
                    key: "getOpacity",
                    value: function() {
                        return this.parent ? this.container.style.opacity * this.parent.getOpacity() : this.container.style.opacity
                    }
                }, {
                    key: "getRealParentStackingContext",
                    value: function() {
                        return !this.parent || this.treatAsRealStackingContext ? this : this.parent.getRealParentStackingContext()
                    }
                }]), a
            }());
        b["default"] = e
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b["default"] = function d(a, b) {
            ! function(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }(this, d), this.width = a, this.height = b
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            e = c(4),
            f = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(7)),
            g = function(a, b, c) {
                return new f["default"](a.x + (b.x - a.x) * c, a.y + (b.y - a.y) * c)
            },
            h = function() {
                function a(b, c, d, f) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.type = e.PATH.BEZIER_CURVE, this.start = b, this.startControl = c, this.endControl = d, this.end = f
                }
                return d(a, [{
                    key: "subdivide",
                    value: function(b, c) {
                        var d = g(this.start, this.startControl, b),
                            e = g(this.startControl, this.endControl, b),
                            f = g(this.endControl, this.end, b),
                            h = g(d, e, b),
                            i = g(e, f, b),
                            j = g(h, i, b);
                        return c ? new a(this.start, d, h, j) : new a(j, i, f, this.end)
                    }
                }, {
                    key: "reverse",
                    value: function() {
                        return new a(this.end, this.endControl, this.startControl, this.start)
                    }
                }]), a
            }();
        b["default"] = h
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseBorderRadius = void 0;
        var d = function() {
                return function(a, b) {
                    if (Array.isArray(a)) return a;
                    if (Symbol.iterator in Object(a)) return function(a, b) {
                        var c = [],
                            d = !0,
                            e = !1,
                            f = void 0;
                        try {
                            for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                        } catch (a) {
                            e = !0, f = a
                        } finally {
                            try {
                                !d && h["return"] && h["return"]()
                            } finally {
                                if (e) throw f
                            }
                        }
                        return c
                    }(a, b);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            e = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(2)),
            f = ["top-left", "top-right", "bottom-right", "bottom-left"];
        b.parseBorderRadius = function(a) {
            return f.map(function(b) {
                var c = a.getPropertyValue("border-" + b + "-radius").split(" ").map(e["default"].create),
                    f = d(c, 2),
                    g = f[0],
                    h = f[1];
                return void 0 === h ? [g, g] : [g, h]
            })
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = b.DISPLAY = {
                NONE: 1,
                BLOCK: 2,
                INLINE: 4,
                RUN_IN: 8,
                FLOW: 16,
                FLOW_ROOT: 32,
                TABLE: 64,
                FLEX: 128,
                GRID: 256,
                RUBY: 512,
                SUBGRID: 1024,
                LIST_ITEM: 2048,
                TABLE_ROW_GROUP: 4096,
                TABLE_HEADER_GROUP: 8192,
                TABLE_FOOTER_GROUP: 16384,
                TABLE_ROW: 32768,
                TABLE_CELL: 65536,
                TABLE_COLUMN_GROUP: 1 << 17,
                TABLE_COLUMN: 1 << 18,
                TABLE_CAPTION: 1 << 19,
                RUBY_BASE: 1 << 20,
                RUBY_TEXT: 1 << 21,
                RUBY_BASE_CONTAINER: 1 << 22,
                RUBY_TEXT_CONTAINER: 1 << 23,
                CONTENTS: 1 << 24,
                INLINE_BLOCK: 1 << 25,
                INLINE_LIST_ITEM: 1 << 26,
                INLINE_TABLE: 1 << 27,
                INLINE_FLEX: 1 << 28,
                INLINE_GRID: 1 << 29
            },
            e = function(a, b) {
                return a | function(a) {
                    switch (a) {
                        case "block":
                            return d.BLOCK;
                        case "inline":
                            return d.INLINE;
                        case "run-in":
                            return d.RUN_IN;
                        case "flow":
                            return d.FLOW;
                        case "flow-root":
                            return d.FLOW_ROOT;
                        case "table":
                            return d.TABLE;
                        case "flex":
                            return d.FLEX;
                        case "grid":
                            return d.GRID;
                        case "ruby":
                            return d.RUBY;
                        case "subgrid":
                            return d.SUBGRID;
                        case "list-item":
                            return d.LIST_ITEM;
                        case "table-row-group":
                            return d.TABLE_ROW_GROUP;
                        case "table-header-group":
                            return d.TABLE_HEADER_GROUP;
                        case "table-footer-group":
                            return d.TABLE_FOOTER_GROUP;
                        case "table-row":
                            return d.TABLE_ROW;
                        case "table-cell":
                            return d.TABLE_CELL;
                        case "table-column-group":
                            return d.TABLE_COLUMN_GROUP;
                        case "table-column":
                            return d.TABLE_COLUMN;
                        case "table-caption":
                            return d.TABLE_CAPTION;
                        case "ruby-base":
                            return d.RUBY_BASE;
                        case "ruby-text":
                            return d.RUBY_TEXT;
                        case "ruby-base-container":
                            return d.RUBY_BASE_CONTAINER;
                        case "ruby-text-container":
                            return d.RUBY_TEXT_CONTAINER;
                        case "contents":
                            return d.CONTENTS;
                        case "inline-block":
                            return d.INLINE_BLOCK;
                        case "inline-list-item":
                            return d.INLINE_LIST_ITEM;
                        case "inline-table":
                            return d.INLINE_TABLE;
                        case "inline-flex":
                            return d.INLINE_FLEX;
                        case "inline-grid":
                            return d.INLINE_GRID
                    }
                    return d.NONE
                }(b)
            };
        b.parseDisplay = function(a) {
            return a.split(" ").reduce(e, 0)
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = b.FLOAT = {
            NONE: 0,
            LEFT: 1,
            RIGHT: 2,
            INLINE_START: 3,
            INLINE_END: 4
        };
        b.parseCSSFloat = function(a) {
            switch (a) {
                case "left":
                    return d.LEFT;
                case "right":
                    return d.RIGHT;
                case "inline-start":
                    return d.INLINE_START;
                case "inline-end":
                    return d.INLINE_END
            }
            return d.NONE
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseFont = function(a) {
            return {
                fontFamily: a.fontFamily,
                fontSize: a.fontSize,
                fontStyle: a.fontStyle,
                fontVariant: a.fontVariant,
                fontWeight: function(a) {
                    switch (a) {
                        case "normal":
                            return 400;
                        case "bold":
                            return 700
                    }
                    var b = parseInt(a, 10);
                    return isNaN(b) ? 400 : b
                }(a.fontWeight)
            }
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseLetterSpacing = function(a) {
            if ("normal" === a) return 0;
            var b = parseFloat(a);
            return isNaN(b) ? 0 : b
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = b.OVERFLOW = {
            VISIBLE: 0,
            HIDDEN: 1,
            SCROLL: 2,
            AUTO: 3
        };
        b.parseOverflow = function(a) {
            switch (a) {
                case "hidden":
                    return d.HIDDEN;
                case "scroll":
                    return d.SCROLL;
                case "auto":
                    return d.AUTO;
                case "visible":
                default:
                    return d.VISIBLE
            }
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseTextShadow = void 0;
        var d = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(0)),
            e = /^([+-]|\d|\.)$/i;
        b.parseTextShadow = function(a) {
            if ("none" === a || "string" != typeof a) return null;
            for (var b = "", c = !1, f = [], g = [], h = 0, i = null, j = function() {
                    b.length && (c ? f.push(parseFloat(b)) : i = new d["default"](b)), c = !1, b = ""
                }, k = function() {
                    f.length && null !== i && g.push({
                        color: i,
                        offsetX: f[0] || 0,
                        offsetY: f[1] || 0,
                        blur: f[2] || 0
                    }), f.splice(0, f.length), i = null
                }, l = 0; l < a.length; l++) {
                var m = a[l];
                switch (m) {
                    case "(":
                        b += m, h++;
                        break;
                    case ")":
                        b += m, h--;
                        break;
                    case ",":
                        0 === h ? (j(), k()) : b += m;
                        break;
                    case " ":
                        0 === h ? j() : b += m;
                        break;
                    default:
                        0 === b.length && e.test(m) && (c = !0), b += m
                }
            }
            return j(), k(), 0 === g.length ? null : g
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseTransform = void 0;
        var d = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(2)),
            e = function(a) {
                return parseFloat(a.trim())
            },
            f = /(matrix|matrix3d)\((.+)\)/,
            g = (b.parseTransform = function(a) {
                var b = h(a.transform || a.webkitTransform || a.mozTransform || a.msTransform || a.oTransform);
                return null === b ? null : {
                    transform: b,
                    transformOrigin: g(a.transformOrigin || a.webkitTransformOrigin || a.mozTransformOrigin || a.msTransformOrigin || a.oTransformOrigin)
                }
            }, function(a) {
                if ("string" != typeof a) {
                    var b = new d["default"]("0");
                    return [b, b]
                }
                var c = a.split(" ").map(d["default"].create);
                return [c[0], c[1]]
            }),
            h = function(a) {
                if ("none" === a || "string" != typeof a) return null;
                var b = a.match(f);
                if (b) {
                    if ("matrix" === b[1]) {
                        var c = b[2].split(",").map(e);
                        return [c[0], c[1], c[2], c[3], c[4], c[5]]
                    }
                    var d = b[2].split(",").map(e);
                    return [d[0], d[1], d[4], d[5], d[12], d[13]]
                }
                return null
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = b.VISIBILITY = {
            VISIBLE: 0,
            HIDDEN: 1,
            COLLAPSE: 2
        };
        b.parseVisibility = function(a) {
            switch (a) {
                case "hidden":
                    return d.HIDDEN;
                case "collapse":
                    return d.COLLAPSE;
                case "visible":
                default:
                    return d.VISIBLE
            }
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.parseZIndex = function(a) {
            var b = "auto" === a;
            return {
                auto: b,
                order: b ? 0 : parseInt(a, 10)
            }
        }
    }, function(a, b, c) {
        (function(a, d) {
            var e;
            ! function(d) {
                function f(a) {
                    throw new RangeError(C[a])
                }

                function g(a, b) {
                    for (var c = a.length, d = []; c--;) d[c] = b(a[c]);
                    return d
                }

                function h(a, b) {
                    var c = a.split("@"),
                        d = "";
                    return c.length > 1 && (d = c[0] + "@", a = c[1]), d + g((a = a.replace(B, ".")).split("."), b).join(".")
                }

                function i(a) {
                    for (var b, c, d = [], e = 0, f = a.length; f > e;)(b = a.charCodeAt(e++)) >= 55296 && 56319 >= b && f > e ? 56320 == (64512 & (c = a.charCodeAt(e++))) ? d.push(((1023 & b) << 10) + (1023 & c) + 65536) : (d.push(b), e--) : d.push(b);
                    return d
                }

                function j(a) {
                    return g(a, function(a) {
                        var b = "";
                        return a > 65535 && (b += F((a -= 65536) >>> 10 & 1023 | 55296), a = 56320 | 1023 & a), b += F(a)
                    }).join("")
                }

                function k(a) {
                    return 10 > a - 48 ? a - 22 : 26 > a - 65 ? a - 65 : 26 > a - 97 ? a - 97 : r
                }

                function l(a, b) {
                    return a + 22 + 75 * (26 > a) - ((0 != b) << 5)
                }

                function m(a, b, c) {
                    var d = 0;
                    for (a = c ? E(a / v) : a >> 1, a += E(a / b); a > D * t >> 1; d += r) a = E(a / D);
                    return E(d + (D + 1) * a / (a + u))
                }

                function n(a) {
                    var b, c, d, e, g, h, i, l, n, o, p = [],
                        u = a.length,
                        v = 0,
                        z = x,
                        A = w;
                    for ((c = a.lastIndexOf(y)) < 0 && (c = 0), d = 0; c > d; ++d) a.charCodeAt(d) >= 128 && f("not-basic"), p.push(a.charCodeAt(d));
                    for (e = c > 0 ? c + 1 : 0; u > e;) {
                        for (g = v, h = 1, i = r; e >= u && f("invalid-input"), ((l = k(a.charCodeAt(e++))) >= r || l > E((q - v) / h)) && f("overflow"), v += l * h, n = A >= i ? s : i >= A + t ? t : i - A, !(n > l); i += r) h > E(q / (o = r - n)) && f("overflow"), h *= o;
                        A = m(v - g, b = p.length + 1, 0 == g), E(v / b) > q - z && f("overflow"), z += E(v / b), v %= b, p.splice(v++, 0, z)
                    }
                    return j(p)
                }

                function o(a) {
                    var b, c, d, e, g, h, j, k, n, o, p, u, v, z, A, B = [];
                    for (u = (a = i(a)).length, b = x, c = 0, g = w, h = 0; u > h; ++h)(p = a[h]) < 128 && B.push(F(p));
                    for (d = e = B.length, e && B.push(y); u > d;) {
                        for (j = q, h = 0; u > h; ++h)(p = a[h]) >= b && j > p && (j = p);
                        for (j - b > E((q - c) / (v = d + 1)) && f("overflow"), c += (j - b) * v, b = j, h = 0; u > h; ++h)
                            if ((p = a[h]) < b && ++c > q && f("overflow"), p == b) {
                                for (k = c, n = r; o = g >= n ? s : n >= g + t ? t : n - g, !(o > k); n += r) A = k - o, z = r - o, B.push(F(l(o + A % z, 0))), k = E(A / z);
                                B.push(F(l(k, 0))), g = m(c, v, d == e), c = 0, ++d
                            }++c, ++b
                    }
                    return B.join("")
                }
                "object" == typeof b && b && b.nodeType, "object" == typeof a && a && a.nodeType;
                var p, q = 2147483647,
                    r = 36,
                    s = 1,
                    t = 26,
                    u = 38,
                    v = 700,
                    w = 72,
                    x = 128,
                    y = "-",
                    z = /^xn--/,
                    A = /[^\x20-\x7E]/,
                    B = /[\x2E\u3002\uFF0E\uFF61]/g,
                    C = {
                        overflow: "Overflow: input needs wider integers to process",
                        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                        "invalid-input": "Invalid input"
                    },
                    D = r - s,
                    E = Math.floor,
                    F = String.fromCharCode;
                p = {
                    version: "1.4.1",
                    ucs2: {
                        decode: i,
                        encode: j
                    },
                    decode: n,
                    encode: o,
                    toASCII: function(a) {
                        return h(a, function(a) {
                            return A.test(a) ? "xn--" + o(a) : a
                        })
                    },
                    toUnicode: function(a) {
                        return h(a, function(a) {
                            return z.test(a) ? n(a.slice(4).toLowerCase()) : a
                        })
                    }
                }, void 0 === (e = function() {
                    return p
                }.call(b, c, b, a)) || (a.exports = e)
            }()
        }).call(b, c(39)(a), c(40))
    }, function(a, b) {
        a.exports = function(a) {
            return a.webpackPolyfill || (a.deprecate = function() {}, a.paths = [], a.children || (a.children = []), Object.defineProperty(a, "loaded", {
                enumerable: !0,
                get: function() {
                    return a.l
                }
            }), Object.defineProperty(a, "id", {
                enumerable: !0,
                get: function() {
                    return a.i
                }
            }), a.webpackPolyfill = 1), a
        }
    }, function(a, b) {
        var c;
        c = function() {
            return this
        }();
        try {
            c = c || Function("return this")() || (0, eval)("this")
        } catch (a) {
            "object" == typeof window && (c = window)
        }
        a.exports = c
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = c(4);
        b["default"] = function e(a, b, c) {
            ! function(a, b) {
                if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
            }(this, e), this.type = d.PATH.CIRCLE, this.x = a, this.y = b, this.radius = c
        }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = function() {
                return function(a, b) {
                    if (Array.isArray(a)) return a;
                    if (Symbol.iterator in Object(a)) return function(a, b) {
                        var c = [],
                            d = !0,
                            e = !1,
                            f = void 0;
                        try {
                            for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                        } catch (a) {
                            e = !0, f = a
                        } finally {
                            try {
                                !d && h["return"] && h["return"]()
                            } finally {
                                if (e) throw f
                            }
                        }
                        return c
                    }(a, b);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            e = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            f = c(1),
            g = (c(20), c(43)),
            h = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(11)),
            i = c(6),
            j = c(10),
            k = function() {
                function a(b, c) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.target = b, this.options = c, b.render(c)
                }
                return e(a, [{
                    key: "renderNode",
                    value: function(a) {
                        a.isVisible() && (this.renderNodeBackgroundAndBorders(a), this.renderNodeContent(a))
                    }
                }, {
                    key: "renderNodeContent",
                    value: function(a) {
                        var b = this,
                            c = function() {
                                if (a.childNodes.length && a.childNodes.forEach(function(c) {
                                        if (c instanceof h["default"]) {
                                            var d = c.parent.style;
                                            b.target.renderTextNode(c.bounds, d.color, d.font, d.textDecoration, d.textShadow)
                                        } else b.target.drawShape(c, a.style.color)
                                    }), a.image) {
                                    var c = b.options.imageStore.get(a.image);
                                    if (c) {
                                        var d = f.calculateContentBox(a.bounds, a.style.padding, a.style.border),
                                            e = "number" == typeof c.width && c.width > 0 ? c.width : d.width,
                                            g = "number" == typeof c.height && c.height > 0 ? c.height : d.height;
                                        e > 0 && g > 0 && b.target.clip([f.calculatePaddingBoxPath(a.curvedBounds)], function() {
                                            b.target.drawImage(c, new f.Bounds(0, 0, e, g), d)
                                        })
                                    }
                                }
                            },
                            d = a.getClipPaths();
                        d.length ? this.target.clip(d, c) : c()
                    }
                }, {
                    key: "renderNodeBackgroundAndBorders",
                    value: function(a) {
                        var b = this,
                            c = !a.style.background.backgroundColor.isTransparent() || a.style.background.backgroundImage.length,
                            d = a.style.border.filter(function(a) {
                                return a.borderStyle !== j.BORDER_STYLE.NONE && !a.borderColor.isTransparent()
                            }),
                            e = function() {
                                var e = i.calculateBackgroungPaintingArea(a.curvedBounds, a.style.background.backgroundClip);
                                c && b.target.clip([e], function() {
                                    a.style.background.backgroundColor.isTransparent() || b.target.fill(a.style.background.backgroundColor), b.renderBackgroundImage(a)
                                }), d.forEach(function(c, d) {
                                    b.renderBorder(c, d, a.curvedBounds)
                                })
                            };
                        if (c || d.length) {
                            var f = a.parent ? a.parent.getClipPaths() : [];
                            f.length ? this.target.clip(f, e) : e()
                        }
                    }
                }, {
                    key: "renderBackgroundImage",
                    value: function(a) {
                        var b = this;
                        a.style.background.backgroundImage.slice(0).reverse().forEach(function(c) {
                            "url" === c.source.method && c.source.args.length ? b.renderBackgroundRepeat(a, c) : /gradient/i.test(c.source.method) && b.renderBackgroundGradient(a, c)
                        })
                    }
                }, {
                    key: "renderBackgroundRepeat",
                    value: function(a, b) {
                        var c = this.options.imageStore.get(b.source.args[0]);
                        if (c) {
                            var d = i.calculateBackgroungPositioningArea(a.style.background.backgroundOrigin, a.bounds, a.style.padding, a.style.border),
                                e = i.calculateBackgroundSize(b, c, d),
                                f = i.calculateBackgroundPosition(b.position, e, d),
                                g = i.calculateBackgroundRepeatPath(b, f, e, d, a.bounds),
                                h = Math.round(d.left + f.x),
                                j = Math.round(d.top + f.y);
                            this.target.renderRepeat(g, c, e, h, j)
                        }
                    }
                }, {
                    key: "renderBackgroundGradient",
                    value: function(a, b) {
                        var c = i.calculateBackgroungPositioningArea(a.style.background.backgroundOrigin, a.bounds, a.style.padding, a.style.border),
                            d = i.calculateGradientBackgroundSize(b, c),
                            e = i.calculateBackgroundPosition(b.position, d, c),
                            h = new f.Bounds(Math.round(c.left + e.x), Math.round(c.top + e.y), d.width, d.height),
                            j = g.parseGradient(a, b.source, h);
                        if (j) switch (j.type) {
                            case g.GRADIENT_TYPE.LINEAR_GRADIENT:
                                this.target.renderLinearGradient(h, j);
                                break;
                            case g.GRADIENT_TYPE.RADIAL_GRADIENT:
                                this.target.renderRadialGradient(h, j)
                        }
                    }
                }, {
                    key: "renderBorder",
                    value: function(a, b, c) {
                        this.target.drawShape(f.parsePathForBorder(c, b), a.borderColor)
                    }
                }, {
                    key: "renderStack",
                    value: function(a) {
                        var b = this;
                        if (a.container.isVisible()) {
                            var c = a.getOpacity();
                            c !== this._opacity && (this.target.setOpacity(a.getOpacity()), this._opacity = c);
                            var d = a.container.style.transform;
                            null !== d ? this.target.transform(a.container.bounds.left + d.transformOrigin[0].value, a.container.bounds.top + d.transformOrigin[1].value, d.transform, function() {
                                return b.renderStackContent(a)
                            }) : this.renderStackContent(a)
                        }
                    }
                }, {
                    key: "renderStackContent",
                    value: function(a) {
                        var b = m(a),
                            c = d(b, 5),
                            e = c[0],
                            f = c[1],
                            g = c[2],
                            h = c[3],
                            i = c[4],
                            j = l(a),
                            k = d(j, 2),
                            o = k[0],
                            p = k[1];
                        this.renderNodeBackgroundAndBorders(a.container), e.sort(n).forEach(this.renderStack, this), this.renderNodeContent(a.container), p.forEach(this.renderNode, this), h.forEach(this.renderStack, this), i.forEach(this.renderStack, this), o.forEach(this.renderNode, this), f.forEach(this.renderStack, this), g.sort(n).forEach(this.renderStack, this)
                    }
                }, {
                    key: "render",
                    value: function(a) {
                        this.options.backgroundColor && this.target.rectangle(this.options.x, this.options.y, this.options.width, this.options.height, this.options.backgroundColor), this.renderStack(a);
                        var b = this.target.getTarget();
                        return b
                    }
                }]), a
            }();
        b["default"] = k;
        var l = function(a) {
                for (var b = [], c = [], d = a.children.length, e = 0; d > e; e++) {
                    var f = a.children[e];
                    f.isInlineLevel() ? b.push(f) : c.push(f)
                }
                return [b, c]
            },
            m = function(a) {
                for (var b = [], c = [], d = [], e = [], f = [], g = a.contexts.length, h = 0; g > h; h++) {
                    var i = a.contexts[h];
                    i.container.isPositioned() || i.container.style.opacity < 1 || i.container.isTransformed() ? i.container.style.zIndex.order < 0 ? b.push(i) : i.container.style.zIndex.order > 0 ? d.push(i) : c.push(i) : i.container.isFloating() ? e.push(i) : f.push(i)
                }
                return [b, c, d, e, f]
            },
            n = function(a, b) {
                return a.container.style.zIndex.order > b.container.style.zIndex.order ? 1 : a.container.style.zIndex.order < b.container.style.zIndex.order ? -1 : a.container.index > b.container.index ? 1 : -1
            }
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }

        function e(a, b) {
            if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.transformWebkitRadialGradientArgs = b.parseGradient = b.RadialGradient = b.LinearGradient = b.RADIAL_GRADIENT_SHAPE = b.GRADIENT_TYPE = void 0;
        var f = function() {
                return function(a, b) {
                    if (Array.isArray(a)) return a;
                    if (Symbol.iterator in Object(a)) return function(a, b) {
                        var c = [],
                            d = !0,
                            e = !1,
                            f = void 0;
                        try {
                            for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                        } catch (a) {
                            e = !0, f = a
                        } finally {
                            try {
                                !d && h["return"] && h["return"]()
                            } finally {
                                if (e) throw f
                            }
                        }
                        return c
                    }(a, b);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            g = (d(c(5)), c(44)),
            h = d(c(0)),
            i = c(2),
            j = d(i),
            k = c(3),
            l = /^(to )?(left|top|right|bottom)( (left|top|right|bottom))?$/i,
            m = /^([+-]?\d*\.?\d+)% ([+-]?\d*\.?\d+)%$/i,
            n = /(px)|%|( 0)$/i,
            o = /^(from|to|color-stop)\((?:([\d.]+)(%)?,\s*)?(.+?)\)$/i,
            p = /^\s*(circle|ellipse)?\s*((?:([\d.]+)(px|r?em|%)\s*(?:([\d.]+)(px|r?em|%))?)|closest-side|closest-corner|farthest-side|farthest-corner)?\s*(?:at\s*(?:(left|center|right)|([\d.]+)(px|r?em|%))\s+(?:(top|center|bottom)|([\d.]+)(px|r?em|%)))?(?:\s|$)/i,
            q = b.GRADIENT_TYPE = {
                LINEAR_GRADIENT: 0,
                RADIAL_GRADIENT: 1
            },
            r = b.RADIAL_GRADIENT_SHAPE = {
                CIRCLE: 0,
                ELLIPSE: 1
            },
            s = {
                left: new j["default"]("0%"),
                top: new j["default"]("0%"),
                center: new j["default"]("50%"),
                right: new j["default"]("100%"),
                bottom: new j["default"]("100%")
            },
            t = b.LinearGradient = function G(a, b) {
                e(this, G), this.type = q.LINEAR_GRADIENT, this.colorStops = a, this.direction = b
            },
            u = b.RadialGradient = function H(a, b, c, d) {
                e(this, H), this.type = q.RADIAL_GRADIENT, this.colorStops = a, this.shape = b, this.center = c, this.radius = d
            },
            v = (b.parseGradient = function(a, b, c) {
                var d = b.args,
                    e = b.method,
                    f = b.prefix;
                return "linear-gradient" === e ? w(d, c, !!f) : "gradient" === e && "linear" === d[0] ? w(["to bottom"].concat(F(d.slice(3))), c, !!f) : "radial-gradient" === e ? x(a, "-webkit-" === f ? E(d) : d, c) : "gradient" === e && "radial" === d[0] ? x(a, F(E(d.slice(1))), c) : void 0
            }, function(a, b, c) {
                for (var d = [], e = b; e < a.length; e++) {
                    var f = a[e],
                        g = n.test(f),
                        i = f.lastIndexOf(" "),
                        k = new h["default"](g ? f.substring(0, i) : f),
                        l = g ? new j["default"](f.substring(i + 1)) : e === b ? new j["default"]("0%") : e === a.length - 1 ? new j["default"]("100%") : null;
                    d.push({
                        color: k,
                        stop: l
                    })
                }
                for (var m = d.map(function(a) {
                        var b = a.color,
                            d = a.stop;
                        return {
                            color: b,
                            stop: 0 === c ? 0 : d ? d.getAbsoluteValue(c) / c : null
                        }
                    }), o = m[0].stop, p = 0; p < m.length; p++)
                    if (null !== o) {
                        var q = m[p].stop;
                        if (null === q) {
                            for (var r = p; null === m[r].stop;) r++;
                            for (var s = r - p + 1, t = (m[r].stop - o) / s; r > p; p++) o = m[p].stop = o + t
                        } else o = q
                    }
                return m
            }),
            w = function(a, b, c) {
                var d = g.parseAngle(a[0]),
                    e = l.test(a[0]),
                    f = e || null !== d || m.test(a[0]),
                    h = f ? null !== d ? y(c ? d - .5 * Math.PI : d, b) : e ? A(a[0], b) : B(a[0], b) : y(Math.PI, b),
                    i = f ? 1 : 0,
                    j = Math.min(k.distance(Math.abs(h.x0) + Math.abs(h.x1), Math.abs(h.y0) + Math.abs(h.y1)), 2 * b.width, 2 * b.height);
                return new t(v(a, i, j), h)
            },
            x = function(a, b, c) {
                var d = b[0].match(p),
                    e = d && ("circle" === d[1] || void 0 !== d[3] && void 0 === d[5]) ? r.CIRCLE : r.ELLIPSE,
                    f = {},
                    g = {};
                d && (void 0 !== d[3] && (f.x = i.calculateLengthFromValueWithUnit(a, d[3], d[4]).getAbsoluteValue(c.width)), void 0 !== d[5] && (f.y = i.calculateLengthFromValueWithUnit(a, d[5], d[6]).getAbsoluteValue(c.height)), d[7] ? g.x = s[d[7].toLowerCase()] : void 0 !== d[8] && (g.x = i.calculateLengthFromValueWithUnit(a, d[8], d[9])), d[10] ? g.y = s[d[10].toLowerCase()] : void 0 !== d[11] && (g.y = i.calculateLengthFromValueWithUnit(a, d[11], d[12])));
                var h = {
                        x: void 0 === g.x ? c.width / 2 : g.x.getAbsoluteValue(c.width),
                        y: void 0 === g.y ? c.height / 2 : g.y.getAbsoluteValue(c.height)
                    },
                    j = D(d && d[2] || "farthest-corner", e, h, f, c);
                return new u(v(b, d ? 1 : 0, Math.min(j.x, j.y)), e, h, j)
            },
            y = function(a, b) {
                var c = b.width,
                    d = b.height,
                    e = .5 * c,
                    f = .5 * d,
                    g = (Math.abs(c * Math.sin(a)) + Math.abs(d * Math.cos(a))) / 2,
                    h = e + Math.sin(a) * g,
                    i = f - Math.cos(a) * g;
                return {
                    x0: h,
                    x1: c - h,
                    y0: i,
                    y1: d - i
                }
            },
            z = function(a) {
                return Math.acos(a.width / 2 / (k.distance(a.width, a.height) / 2))
            },
            A = function(a, b) {
                switch (a) {
                    case "bottom":
                    case "to top":
                        return y(0, b);
                    case "left":
                    case "to right":
                        return y(Math.PI / 2, b);
                    case "right":
                    case "to left":
                        return y(3 * Math.PI / 2, b);
                    case "top right":
                    case "right top":
                    case "to bottom left":
                    case "to left bottom":
                        return y(Math.PI + z(b), b);
                    case "top left":
                    case "left top":
                    case "to bottom right":
                    case "to right bottom":
                        return y(Math.PI - z(b), b);
                    case "bottom left":
                    case "left bottom":
                    case "to top right":
                    case "to right top":
                        return y(z(b), b);
                    case "bottom right":
                    case "right bottom":
                    case "to top left":
                    case "to left top":
                        return y(2 * Math.PI - z(b), b);
                    case "top":
                    case "to bottom":
                    default:
                        return y(Math.PI, b)
                }
            },
            B = function(a, b) {
                var c = a.split(" ").map(parseFloat),
                    d = f(c, 2),
                    e = d[0],
                    g = d[1],
                    h = e / 100 * b.width / (g / 100 * b.height);
                return y(Math.atan(isNaN(h) ? 1 : h) + Math.PI / 2, b)
            },
            C = function(a, b, c, d) {
                return [{
                    x: 0,
                    y: 0
                }, {
                    x: 0,
                    y: a.height
                }, {
                    x: a.width,
                    y: 0
                }, {
                    x: a.width,
                    y: a.height
                }].reduce(function(a, e) {
                    var f = k.distance(b - e.x, c - e.y);
                    return (d ? f < a.optimumDistance : f > a.optimumDistance) ? {
                        optimumCorner: e,
                        optimumDistance: f
                    } : a
                }, {
                    optimumDistance: d ? 1 / 0 : -1 / 0,
                    optimumCorner: null
                }).optimumCorner
            },
            D = function(a, b, c, d, e) {
                var f = c.x,
                    g = c.y,
                    h = 0,
                    i = 0;
                switch (a) {
                    case "closest-side":
                        b === r.CIRCLE ? h = i = Math.min(Math.abs(f), Math.abs(f - e.width), Math.abs(g), Math.abs(g - e.height)) : b === r.ELLIPSE && (h = Math.min(Math.abs(f), Math.abs(f - e.width)), i = Math.min(Math.abs(g), Math.abs(g - e.height)));
                        break;
                    case "closest-corner":
                        if (b === r.CIRCLE) h = i = Math.min(k.distance(f, g), k.distance(f, g - e.height), k.distance(f - e.width, g), k.distance(f - e.width, g - e.height));
                        else if (b === r.ELLIPSE) {
                            var j = Math.min(Math.abs(g), Math.abs(g - e.height)) / Math.min(Math.abs(f), Math.abs(f - e.width)),
                                l = C(e, f, g, !0);
                            i = j * (h = k.distance(l.x - f, (l.y - g) / j))
                        }
                        break;
                    case "farthest-side":
                        b === r.CIRCLE ? h = i = Math.max(Math.abs(f), Math.abs(f - e.width), Math.abs(g), Math.abs(g - e.height)) : b === r.ELLIPSE && (h = Math.max(Math.abs(f), Math.abs(f - e.width)), i = Math.max(Math.abs(g), Math.abs(g - e.height)));
                        break;
                    case "farthest-corner":
                        if (b === r.CIRCLE) h = i = Math.max(k.distance(f, g), k.distance(f, g - e.height), k.distance(f - e.width, g), k.distance(f - e.width, g - e.height));
                        else if (b === r.ELLIPSE) {
                            var m = Math.max(Math.abs(g), Math.abs(g - e.height)) / Math.max(Math.abs(f), Math.abs(f - e.width)),
                                n = C(e, f, g, !1);
                            i = m * (h = k.distance(n.x - f, (n.y - g) / m))
                        }
                        break;
                    default:
                        h = d.x || 0, i = void 0 !== d.y ? d.y : h
                }
                return {
                    x: h,
                    y: i
                }
            },
            E = b.transformWebkitRadialGradientArgs = function(a) {
                var b = "",
                    c = "",
                    d = "",
                    e = "",
                    f = 0,
                    g = /^(left|center|right|\d+(?:px|r?em|%)?)(?:\s+(top|center|bottom|\d+(?:px|r?em|%)?))?$/i,
                    h = /^\d+(px|r?em|%)?(?:\s+\d+(px|r?em|%)?)?$/i,
                    i = a[f].match(g);
                i && f++;
                var j = a[f].match(/^(circle|ellipse)?\s*(closest-side|closest-corner|farthest-side|farthest-corner|contain|cover)?$/i);
                j && (b = j[1] || "", "contain" === (d = j[2] || "") ? d = "closest-side" : "cover" === d && (d = "farthest-corner"), f++);
                var k = a[f].match(h);
                k && f++;
                var l = a[f].match(g);
                l && f++;
                var m = a[f].match(h);
                m && f++;
                var n = l || i;
                n && n[1] && (e = n[1] + (/^\d+$/.test(n[1]) ? "px" : ""), n[2] && (e += " " + n[2] + (/^\d+$/.test(n[2]) ? "px" : "")));
                var o = m || k;
                return o && (c = o[0], o[1] || (c += "px")), !e || b || c || d || (c = e, e = ""), e && (e = "at " + e), [
                    [b, d, c, e].filter(function(a) {
                        return !!a
                    }).join(" ")
                ].concat(a.slice(f))
            },
            F = function(a) {
                return a.map(function(a) {
                    return a.match(o)
                }).map(function(b, c) {
                    if (!b) return a[c];
                    switch (b[1]) {
                        case "from":
                            return b[4] + " 0%";
                        case "to":
                            return b[4] + " 100%";
                        case "color-stop":
                            return "%" === b[3] ? b[4] + " " + b[2] : b[4] + " " + 100 * parseFloat(b[2]) + "%"
                    }
                })
            }
    }, function(a, b, c) {
        "use strict";
        Object.defineProperty(b, "__esModule", {
            value: !0
        });
        var d = /([+-]?\d*\.?\d+)(deg|grad|rad|turn)/i;
        b.parseAngle = function(a) {
            var b = a.match(d);
            if (b) {
                var c = parseFloat(b[1]);
                switch (b[2].toLowerCase()) {
                    case "deg":
                        return Math.PI * c / 180;
                    case "grad":
                        return Math.PI / 200 * c;
                    case "rad":
                        return c;
                    case "turn":
                        return 2 * Math.PI * c
                }
            }
            return null
        }
    }, function(a, b, c) {
        "use strict";

        function d(a) {
            return a && a.__esModule ? a : {
                "default": a
            }
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.cloneWindow = b.DocumentCloner = void 0;
        var e = function() {
                return function(a, b) {
                    if (Array.isArray(a)) return a;
                    if (Symbol.iterator in Object(a)) return function(a, b) {
                        var c = [],
                            d = !0,
                            e = !1,
                            f = void 0;
                        try {
                            for (var g, h = a[Symbol.iterator](); !(d = (g = h.next()).done) && (c.push(g.value), !b || c.length !== b); d = !0);
                        } catch (a) {
                            e = !0, f = a
                        } finally {
                            try {
                                !d && h["return"] && h["return"]()
                            } finally {
                                if (e) throw f
                            }
                        }
                        return c
                    }(a, b);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            f = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            g = c(1),
            h = c(21),
            i = d(c(46)),
            j = c(3),
            k = c(6),
            l = d(c(12)),
            m = "data-html2canvas-ignore",
            n = b.DocumentCloner = function() {
                function a(b, c, d, e, f) {
                    ! function(a, b) {
                        if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
                    }(this, a), this.referenceElement = b, this.scrolledElements = [], this.copyStyles = e, this.inlineImages = e, this.logger = d, this.options = c, this.renderer = f, this.resourceLoader = new i["default"](c, d, window), this.documentElement = this.cloneNode(b.ownerDocument.documentElement)
                }
                return f(a, [{
                    key: "inlineAllImages",
                    value: function(a) {
                        var b = this;
                        if (this.inlineImages && a) {
                            var c = a.style;
                            Promise.all(k.parseBackgroundImage(c.backgroundImage).map(function(a) {
                                return "url" === a.method ? b.resourceLoader.inlineImage(a.args[0]).then(function(a) {
                                    return a && "string" == typeof a.src ? 'url("' + a.src + '")' : "none"
                                })["catch"](function(a) {}) : Promise.resolve("" + a.prefix + a.method + "(" + a.args.join(",") + ")")
                            })).then(function(a) {
                                a.length > 1 && (c.backgroundColor = ""), c.backgroundImage = a.join(",")
                            }), a instanceof HTMLImageElement && this.resourceLoader.inlineImage(a.src).then(function(b) {
                                if (b && a instanceof HTMLImageElement && a.parentNode) {
                                    var c = a.parentNode,
                                        d = j.copyCSSStyles(a.style, b.cloneNode(!1));
                                    c.replaceChild(d, a)
                                }
                            })["catch"](function(a) {})
                        }
                    }
                }, {
                    key: "inlineFonts",
                    value: function(a) {
                        var b = this;
                        return Promise.all(Array.from(a.styleSheets).map(function(b) {
                            return b.href ? fetch(b.href).then(function(a) {
                                return a.text()
                            }).then(function(a) {
                                return p(a, b.href)
                            })["catch"](function(a) {
                                return []
                            }) : o(b, a)
                        })).then(function(a) {
                            return a.reduce(function(a, b) {
                                return a.concat(b)
                            }, [])
                        }).then(function(a) {
                            return Promise.all(a.map(function(a) {
                                return fetch(a.formats[0].src).then(function(a) {
                                    return a.blob()
                                }).then(function(a) {
                                    return new Promise(function(b, c) {
                                        var d = new FileReader;
                                        d.onerror = c, d.onload = function() {
                                            var a = d.result;
                                            b(a)
                                        }, d.readAsDataURL(a)
                                    })
                                }).then(function(b) {
                                    return a.fontFace.setProperty("src", 'url("' + b + '")'), "@font-face {" + a.fontFace.cssText + " "
                                })
                            }))
                        }).then(function(c) {
                            var d = a.createElement("style");
                            d.textContent = c.join("\n"), b.documentElement.appendChild(d)
                        })
                    }
                }, {
                    key: "createElementClone",
                    value: function(a) {
                        var b = this;
                        if (this.copyStyles && a instanceof HTMLCanvasElement) {
                            var c = a.ownerDocument.createElement("img");
                            try {
                                return c.src = a.toDataURL(), c
                            } catch (a) {}
                        }
                        if (a instanceof HTMLIFrameElement) {
                            var d = a.cloneNode(!1),
                                e = C();
                            d.setAttribute("data-html2canvas-internal-iframe-key", e);
                            var f = g.parseBounds(a, 0, 0),
                                h = f.width,
                                i = f.height;
                            return this.resourceLoader.cache[e] = E(a, this.options).then(function(a) {
                                return b.renderer(a, {
                                    async: b.options.async,
                                    allowTaint: b.options.allowTaint,
                                    backgroundColor: "#ffffff",
                                    canvas: null,
                                    imageTimeout: b.options.imageTimeout,
                                    logging: b.options.logging,
                                    proxy: b.options.proxy,
                                    removeContainer: b.options.removeContainer,
                                    scale: b.options.scale,
                                    foreignObjectRendering: b.options.foreignObjectRendering,
                                    target: new l["default"],
                                    width: h,
                                    height: i,
                                    x: 0,
                                    y: 0,
                                    windowWidth: a.ownerDocument.defaultView.innerWidth,
                                    windowHeight: a.ownerDocument.defaultView.innerHeight,
                                    scrollX: a.ownerDocument.defaultView.pageXOffset,
                                    scrollY: a.ownerDocument.defaultView.pageYOffset
                                }, b.logger.child(e))
                            }).then(function(b) {
                                return new Promise(function(c, e) {
                                    var f = document.createElement("img");
                                    f.onload = function() {
                                        return c(b)
                                    }, f.onerror = e, f.src = b.toDataURL(), d.parentNode && d.parentNode.replaceChild(j.copyCSSStyles(a.ownerDocument.defaultView.getComputedStyle(a), f), d)
                                })
                            }), d
                        }
                        return a.cloneNode(!1)
                    }
                }, {
                    key: "cloneNode",
                    value: function(a) {
                        var b = a.nodeType === Node.TEXT_NODE ? document.createTextNode(a.nodeValue) : this.createElementClone(a),
                            c = a.ownerDocument.defaultView;
                        this.referenceElement === a && b instanceof c.HTMLElement && (this.clonedReferenceElement = b), b instanceof c.HTMLBodyElement && z(b);
                        for (var d = a.firstChild; d; d = d.nextSibling)(d.nodeType !== Node.ELEMENT_NODE || "SCRIPT" !== d.nodeName && !d.hasAttribute(m)) && (this.copyStyles && "STYLE" === d.nodeName || b.appendChild(this.cloneNode(d)));
                        if (a instanceof c.HTMLElement && b instanceof c.HTMLElement) switch (this.inlineAllImages(r(a, b, u)), this.inlineAllImages(r(a, b, v)), !this.copyStyles || a instanceof HTMLIFrameElement || j.copyCSSStyles(a.ownerDocument.defaultView.getComputedStyle(a), b), this.inlineAllImages(b), 0 === a.scrollTop && 0 === a.scrollLeft || this.scrolledElements.push([b, a.scrollLeft, a.scrollTop]), a.nodeName) {
                            case "CANVAS":
                                this.copyStyles || q(a, b);
                                break;
                            case "TEXTAREA":
                            case "SELECT":
                                b.value = a.value
                        }
                        return b
                    }
                }]), a
            }(),
            o = function(a, b) {
                return (a.cssRules ? Array.from(a.cssRules) : []).filter(function(a) {
                    return a.type === CSSRule.FONT_FACE_RULE
                }).map(function(a) {
                    for (var c = k.parseBackgroundImage(a.style.getPropertyValue("src")), d = [], e = 0; e < c.length; e++)
                        if ("url" === c[e].method && c[e + 1] && "format" === c[e + 1].method) {
                            var f = b.createElement("a");
                            f.href = c[e].args[0], b.body && b.body.appendChild(f);
                            var g = {
                                src: f.href,
                                format: c[e + 1].args[0]
                            };
                            d.push(g)
                        }
                    return {
                        formats: d.filter(function(a) {
                            return /^woff/i.test(a.format)
                        }),
                        fontFace: a.style
                    }
                }).filter(function(a) {
                    return a.formats.length
                })
            },
            p = function(a, b) {
                var c = document.implementation.createHTMLDocument(""),
                    d = document.createElement("base");
                d.href = b;
                var e = document.createElement("style");
                return e.textContent = a, c.head && c.head.appendChild(d), c.body && c.body.appendChild(e), e.sheet ? o(e.sheet, c) : []
            },
            q = function(a, b) {
                try {
                    if (b) {
                        b.width = a.width, b.height = a.height;
                        var c = a.getContext("2d"),
                            d = b.getContext("2d");
                        c ? d.putImageData(c.getImageData(0, 0, a.width, a.height), 0, 0) : d.drawImage(a, 0, 0)
                    }
                } catch (a) {}
            },
            r = function(a, b, c) {
                var d = a.ownerDocument.defaultView.getComputedStyle(a, c);
                if (d && d.content && "none" !== d.content && "-moz-alt-content" !== d.content && "none" !== d.display) {
                    var e = s(d.content),
                        f = e.match(t),
                        g = b.ownerDocument.createElement(f ? "img" : "html2canvaspseudoelement");
                    return f ? g.src = s(f[1]) : g.textContent = e, j.copyCSSStyles(d, g), g.className = w + " " + x, b.className += c === u ? " " + w : " " + x, c === u ? b.insertBefore(g, b.firstChild) : b.appendChild(g), g
                }
            },
            s = function(a) {
                var b = a.substr(0, 1);
                return b === a.substr(a.length - 1) && b.match(/['"]/) ? a.substr(1, a.length - 2) : a
            },
            t = /^url\((.+)\)$/i,
            u = ":before",
            v = ":after",
            w = "___html2canvas___pseudoelement_before",
            x = "___html2canvas___pseudoelement_after",
            y = '{\n    content: "" !important;\n    display: none !important;\n}',
            z = function(a) {
                A(a, "." + w + u + y + "\n         ." + x + v + y)
            },
            A = function(a, b) {
                var c = a.ownerDocument.createElement("style");
                c.innerHTML = b, a.appendChild(c)
            },
            B = function(a) {
                var b = e(a, 3),
                    c = b[0],
                    d = b[1],
                    f = b[2];
                c.scrollLeft = d, c.scrollTop = f
            },
            C = function() {
                return Math.ceil(Date.now() + 1e7 * Math.random()).toString(16)
            },
            D = /^data:text\/(.+);(base64)?,(.*)$/i,
            E = function(a, b) {
                try {
                    return Promise.resolve(a.contentWindow.document.documentElement)
                } catch (c) {
                    return b.proxy ? h.Proxy(a.src, b).then(function(a) {
                        var b = a.match(D);
                        return b ? "base64" === b[2] ? window.atob(decodeURIComponent(b[3])) : decodeURIComponent(b[3]) : Promise.reject()
                    }).then(function(b) {
                        return F(a.ownerDocument, g.parseBounds(a, 0, 0)).then(function(a) {
                            var c = a.contentWindow.document;
                            c.open(), c.write(b);
                            var d = G(a).then(function() {
                                return c.documentElement
                            });
                            return c.close(), d
                        })
                    }) : Promise.reject()
                }
            },
            F = function(a, b) {
                var c = a.createElement("iframe");
                return c.className = "html2canvas-container", c.style.visibility = "hidden", c.style.position = "fixed", c.style.left = "-10000px", c.style.top = "0px", c.style.border = "0", c.width = b.width.toString(), c.height = b.height.toString(), c.scrolling = "no", c.setAttribute(m, "true"), a.body ? (a.body.appendChild(c), Promise.resolve(c)) : Promise.reject("")
            },
            G = function(a) {
                var b = a.contentWindow,
                    c = b.document;
                return new Promise(function(d, e) {
                    b.onload = a.onload = c.onreadystatechange = function() {
                        var b = setInterval(function() {
                            c.body.childNodes.length > 0 && "complete" === c.readyState && (clearInterval(b), d(a))
                        }, 50)
                    }
                })
            };
        b.cloneWindow = function(a, b, c, d, e, f) {
            var g = new n(c, d, e, !1, f),
                h = a.defaultView.pageXOffset,
                i = a.defaultView.pageYOffset;
            return F(a, b).then(function(d) {
                var e = d.contentWindow,
                    f = e.document,
                    j = G(d).then(function() {
                        return g.scrolledElements.forEach(B), e.scrollTo(b.left, b.top), !/(iPad|iPhone|iPod)/g.test(navigator.userAgent) || e.scrollY === b.top && e.scrollX === b.left || (f.documentElement.style.top = -b.top + "px", f.documentElement.style.left = -b.left + "px", f.documentElement.style.position = "absolute"), g.clonedReferenceElement instanceof e.HTMLElement || g.clonedReferenceElement instanceof a.defaultView.HTMLElement || g.clonedReferenceElement instanceof HTMLElement ? Promise.resolve([d, g.clonedReferenceElement, g.resourceLoader]) : Promise.reject("")
                    });
                return f.open(), f.write("<!DOCTYPE html><html></html>"),
                    function(a, b, c) {
                        !a.defaultView || b === a.defaultView.pageXOffset && c === a.defaultView.pageYOffset || a.defaultView.scrollTo(b, c)
                    }(c.ownerDocument, h, i), f.replaceChild(f.adoptNode(g.documentElement), f.documentElement), f.close(), j
            })
        }
    }, function(a, b, c) {
        "use strict";

        function d(a, b) {
            if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(b, "__esModule", {
            value: !0
        }), b.ResourceStore = void 0;
        var e = function() {
                function a(a, b) {
                    for (var c = 0; c < b.length; c++) {
                        var d = b[c];
                        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(a, d.key, d)
                    }
                }
                return function(b, c, d) {
                    return c && a(b.prototype, c), d && a(b, d), b
                }
            }(),
            f = function(a) {
                return a && a.__esModule ? a : {
                    "default": a
                }
            }(c(8)),
            g = c(21),
            h = function() {
                function a(b, c, e) {
                    d(this, a), this.options = b, this._window = e, this.origin = this.getOrigin(e.location.href), this.cache = {}, this.logger = c, this._index = 0
                }
                return e(a, [{
                    key: "loadImage",
                    value: function(a) {
                        var b = this;
                        if (this.hasResourceInCache(a)) return a;
                        if (!o(a) || f["default"].SUPPORT_SVG_DRAWING) {
                            if (!0 === this.options.allowTaint || m(a) || this.isSameOrigin(a)) return this.addImage(a, a, !1);
                            if (!this.isSameOrigin(a)) {
                                if ("string" == typeof this.options.proxy) return this.cache[a] = g.Proxy(a, this.options).then(function(a) {
                                    return p(a, b.options.imageTimeout || 0)
                                }), a;
                                if (!0 === this.options.useCORS && f["default"].SUPPORT_CORS_IMAGES) return this.addImage(a, a, !0)
                            }
                        }
                    }
                }, {
                    key: "inlineImage",
                    value: function(a) {
                        var b = this;
                        return m(a) ? p(a, this.options.imageTimeout || 0) : this.hasResourceInCache(a) ? this.cache[a] : this.isSameOrigin(a) || "string" != typeof this.options.proxy ? this.xhrImage(a) : this.cache[a] = g.Proxy(a, this.options).then(function(a) {
                            return p(a, b.options.imageTimeout || 0)
                        })
                    }
                }, {
                    key: "xhrImage",
                    value: function(a) {
                        var b = this;
                        return this.cache[a] = new Promise(function(c, d) {
                            var e = new XMLHttpRequest;
                            if (e.onreadystatechange = function() {
                                    if (4 === e.readyState)
                                        if (200 !== e.status) d("Failed to fetch image " + a.substring(0, 256) + " with status code " + e.status);
                                        else {
                                            var b = new FileReader;
                                            b.addEventListener("load", function() {
                                                var a = b.result;
                                                c(a)
                                            }, !1), b.addEventListener("error", function(a) {
                                                return d(a)
                                            }, !1), b.readAsDataURL(e.response)
                                        }
                                }, e.responseType = "blob", b.options.imageTimeout) {
                                var f = b.options.imageTimeout;
                                e.timeout = f, e.ontimeout = function() {
                                    return d("")
                                }
                            }
                            e.open("GET", a, !0), e.send()
                        }).then(function(a) {
                            return p(a, b.options.imageTimeout || 0)
                        }), this.cache[a]
                    }
                }, {
                    key: "loadCanvas",
                    value: function(a) {
                        var b = String(this._index++);
                        return this.cache[b] = Promise.resolve(a), b
                    }
                }, {
                    key: "hasResourceInCache",
                    value: function(a) {
                        return void 0 !== this.cache[a]
                    }
                }, {
                    key: "addImage",
                    value: function(a, b, c) {
                        var d = this,
                            e = function(a) {
                                return new Promise(function(e, f) {
                                    var g = new Image;
                                    if (g.onload = function() {
                                            return e(g)
                                        }, a && !c || (g.crossOrigin = "anonymous"), g.onerror = f, g.src = b, !0 === g.complete && setTimeout(function() {
                                            e(g)
                                        }, 500), d.options.imageTimeout) {
                                        var h = d.options.imageTimeout;
                                        setTimeout(function() {
                                            return f("")
                                        }, h)
                                    }
                                })
                            };
                        return this.cache[a] = n(b) && !o(b) ? f["default"].SUPPORT_BASE64_DRAWING(b).then(e) : e(!0), a
                    }
                }, {
                    key: "isSameOrigin",
                    value: function(a) {
                        return this.getOrigin(a) === this.origin
                    }
                }, {
                    key: "getOrigin",
                    value: function(a) {
                        var b = this._link || (this._link = this._window.document.createElement("a"));
                        return b.href = a, b.href = b.href, b.protocol + b.hostname + b.port
                    }
                }, {
                    key: "ready",
                    value: function() {
                        var a = this,
                            b = Object.keys(this.cache),
                            c = b.map(function(b) {
                                return a.cache[b]["catch"](function(a) {
                                    return null
                                })
                            });
                        return Promise.all(c).then(function(a) {
                            return new i(b, a)
                        })
                    }
                }]), a
            }();
        b["default"] = h;
        var i = b.ResourceStore = function() {
                function a(b, c) {
                    d(this, a), this._keys = b, this._resources = c
                }
                return e(a, [{
                    key: "get",
                    value: function(a) {
                        var b = this._keys.indexOf(a);
                        return -1 === b ? null : this._resources[b]
                    }
                }]), a
            }(),
            j = /^data:image\/svg\+xml/i,
            k = /^data:image\/.*;base64,/i,
            l = /^data:image\/.*/i,
            m = function(a) {
                return l.test(a)
            },
            n = function(a) {
                return k.test(a)
            },
            o = function(a) {
                return "svg" === a.substr(-3).toLowerCase() || j.test(a)
            },
            p = function(a, b) {
                return new Promise(function(c, d) {
                    var e = new Image;
                    e.onload = function() {
                        return c(e)
                    }, e.onerror = d, e.src = a, !0 === e.complete && setTimeout(function() {
                        c(e)
                    }, 500), b && setTimeout(function() {
                        return d("")
                    }, b)
                })
            }
    }])
});