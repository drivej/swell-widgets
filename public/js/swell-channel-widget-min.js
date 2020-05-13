"use strict";

var Swell = function (e) {
  function t() {
    return !(!window.ga || !ga.create);
  }

  function n() {
    e.DEBUG && e.utils.log("initAnalytics()"), t() ? l() : e.utils.injectScript(a, l);
  }

  function l() {
    0 == c && (c = !0, ga("create", s, "auto", {
      name: r,
      allowLinker: !0
    }), ga("".concat(r, ".require"), "linker"), ga("".concat(r, ".linker:autoLink"), ["app.swell.life", "swell.life"], !1, !1), ga("".concat(r, ".send"), "pageview"));
  }

  function i(t) {
    e.DEBUG && e.utils.log("analytics.decorate(", t, ")"), ga("".concat(r, ".linker:decorate"), t);
  }

  function o(t) {
    e.DEBUG && e.utils.log("analytics.send(", t, ")"), ga("".concat(e.analytics.UA_NAME, ".send"), t);
  }

  var a = "http://www.google-analytics.com/analytics.js",
      s = "UA-166249050-1",
      r = "swelllife",
      c = !1;
  return e.analytics = Object.assign(e.analytics || {}, {
    isLoaded: t,
    init: n,
    decorate: i,
    send: o,
    UA_NAME: r
  }), e;
}(window.Swell || {}),
    Swell = function (e) {
  var t = {
    THUMBSUP: {
      emoji: "👍"
    },
    CLAP: {
      emoji: "👏"
    },
    LOL: {
      emoji: "🤣"
    },
    THANKYOU: {
      emoji: "🙏"
    },
    OH: {
      emoji: "😮"
    },
    LOVE: {
      emoji: "🥰"
    },
    SMILE: {
      emoji: "😊"
    }
  };
  return e.data = e.data || {}, e.data.reactions = t, e.DEBUG = "localhost" == window.location.hostname || !1, e;
}(window.Swell || {}),
    Swell = function (e) {
  function t(e) {
    if (1 != e) return s && clearTimeout(s), void (s = setTimeout(function () {
      s = null, t(!0);
    }, 500));
    var n,
        l = document.querySelectorAll("[data-swellwidget]:not(.swell-widget-loaded)");
    if (0 == l.length) window.removeEventListener("scroll", t);else for (var o = 0; o < l.length; o++) {
      n = l[o], Swell.utils.isInViewport(n, 600) && i(n);
    }
  }

  function n() {
    e.analytics.init(), Swell.utils.injectStyle("swell-widgets"), l();
  }

  function l() {
    window.addEventListener("scroll", t), t(!0);
  }

  function i(e) {
    e.classList.add("swell-widget-loaded");
    var t = e.dataset.swellwidget;
    Swell.widgets[t] ? Swell.widgets[t].init(e) : e.innerHTML = "<h4>This Swell widget does not exist.</h4>";
  }

  function o(e) {
    null == e ? l() : i(e);
  }

  function a() {
    var e,
        n = document.querySelectorAll("[data-swellwidget]");
    window.removeEventListener("scroll", t);

    for (var l = 0; l < n.length; l++) {
      e = n[l], e.innerHTML = "", e.classList.remove("swell-widget-loaded");
    }
  }

  var s = null;
  return "complete" === document.readyState ? setTimeout(n, 1) : document.addEventListener("readystatechange", function (e) {
    "complete" === document.readyState && n();
  }), Object.assign(e, {
    render: o,
    renderWidgets: l,
    renderWidget: i,
    dispose: a
  }), e;
}(window.Swell || {}),
    Swell = function (e) {
  function t() {
    var e = Array.from(arguments);
    e.unshift("Swell Widget:"), console.log.apply(console, e);
  }

  function n() {
    var e = Array.from(arguments);
    e.unshift("Swell Widget:"), console.error.apply(console, e);
  }

  function l(t) {
    if (e.styles[t] && !0 !== s[t]) {
      var n = e.styles[t];
      s[t] = !0;
      var l = document.createElement("style");
      l.type = "text/css", l.styleSheet ? l.styleSheet.cssText = n : l.appendChild(document.createTextNode(n)), (document.head || document.getElementsByTagName("head")[0]).appendChild(l);
    }
  }

  function i(t) {
    if (!0 !== s[t]) {
      s[t] = !0;
      var n = (e.styles[t], document.createElement("link"));
      n.href = t, n.type = "text/css", n.rel = "stylesheet", document.getElementsByTagName("head")[0].appendChild(n);
    }
  }

  function o(t, n) {
    if (e.DEBUG && e.utils.log("injectScript()", t), !0 !== s[t]) {
      s[t] = !0;
      var l = document.createElement("script");
      l.type = "text/javascript", l.async = !0, l.onload = function () {
        setTimeout(n, 2e3);
      }, l.src = t, document.getElementsByTagName("head")[0].appendChild(l);
    } else n();
  }

  var a = function a(e, t) {
    var n = "number" == typeof t ? t : 0,
        l = e.getBoundingClientRect(),
        i = window.innerHeight || document.documentElement.clientHeight;
    return l.top >= -n && l.top <= i + n || l.bottom >= -n && l.bottom <= i + n;
  },
      s = {};

  return e.utils = Object.assign(e.utils || {}, {
    isInViewport: a,
    injectCSS: i,
    injectStyle: l,
    injectScript: o,
    log: t,
    logError: n
  }), e;
}(window.Swell || {}),
    Swell = function (e) {
  function t(e) {
    e.dataset.token, e.dataset.swellid;
    e.innerHTML = "<h4>Loading...</h4>", n(function (t) {
      i(t, e);
    });
  }

  function n(e) {
    var t = new XMLHttpRequest();
    t.onload = function (n) {
      e(t.response);
    }, t.open("POST", r, !0), t.setRequestHeader("Content-Type", "application/json"), t.setRequestHeader("authorization", "Bearer ".concat(c)), t.responseType = "json", t.send(d);
  }

  function l(e) {
    var t = new XMLHttpRequest();
    t.onload = function (n) {
      e(t.response);
    }, t.open("POST", s, !0), t.setRequestHeader("Content-Type", "application/json"), t.setRequestHeader("Authorization", "Bearer ".concat(c)), t.setRequestHeader("accept-encoding", "gzip"), t.setRequestHeader("referer", "https://stageapiv2gateway.swell.life/graphql?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6bnVsbCwiZW1haWwiOiJ0ZXN0cGFzczEuNEBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnlPTEg4a3ZJRUQiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODg5NTM3MjU0NTIiLCJpYXQiOjE1ODg5NTM3MjUsImV4cCI6MTU5MjU1MzcyNX0.KeaCQASO4p0Lwn6qQTzQSqVLiJzFYCdG962FuYEZJbY"), t.setRequestHeader("access-control-allow-origin", "*"), t.responseType = "json", t.send(d);
  }

  function i(t, n) {
    console.log("render", t), t = t.data, e.utils.injectStyle("sandbox-reset"), e.utils.injectStyle("swell-widgets");
    var l = parseInt(n.dataset.limit || 10),
        i = "0" != n.dataset.header,
        a = "0" != n.dataset.footer,
        s = "0" != n.dataset.scroll;
    t.channel = t.getSwellcast, t.channel.items = t.getSwellcast.swells, n.innerHTML = '\n    <div class="swell-widget swell-channel-widget">\n    <div class="swell-widget-header swell-channel-header">\n      <div class="swell-channel-header-info '.concat(i ? "" : "swell-hide", '">\n        <div class="swell-user-horizontal">\n          <div class="swell-avatar"></div>\n          <div>\n            <h2>').concat(t.channel.name, "</h2>\n            <p>").concat(t.channel.description, '</p>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class="swell-widget-body ').concat(s ? "swell-widget-scrollable" : "", '"><div class="swell-widget-body-content"></div></div>\n    <div class="swell-widget-footer ').concat(a ? "" : "swell-hide", '"><div class="swell-logo"></div></div>    </div><div style="clear:both"></div>\n    '), n.querySelector(".swell-channel-header").style.backgroundImage = "url(" + t.channel.image + ")", n.querySelector(".swell-avatar").style.backgroundImage = "url(" + t.channel.author.image + ")";
    var r = n.querySelector(".swell-widget-body-content");
    t.channel.items.filter(function (e) {
      return "SWELL" == e.type;
    }).slice(0, l).forEach(function (e) {
      r.appendChild(o(e));
    });
  }

  function o(t) {
    var n = document.createElement("a");
    return n.setAttribute("href", t.shareURL), n.setAttribute("target", "_blank"), n.innerHTML = '\n    <div data-storyid="'.concat(t.id, '" class="swell-story-row">\n        <div>\n            <div class="swell-circle-play-btn"></div>\n        </div>\n        <div>\n          <h2></h2>\n          <p></p>\n          <div class="swell-reactions"></div>\n        </div>\n    </div>\n    '), n.querySelector("h2").textContent = t.title, n.querySelector("p").textContent = t.description, n.addEventListener("click", a), e.widgets.reactions.render(n.querySelector(".swell-reactions"), t.reactions), n;
  }

  function a() {
    e.analytics.decorate(this), e.analytics.send("widget-channel.clickstory");
  }

  var s = "https://stageapiv2gateway.swell.life/graphql",
      r = "/api/stories",
      c = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6ImFhYWFhIiwiZW1haWwiOiJ0ZXN0LnRlc3QuMUBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnltTkdqRk56ZlkiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODkyOTgwMzY0MTAiLCJpYXQiOjE1ODkyOTgwMzYsImV4cCI6MTU5Mjg5ODAzNn0.1vC8TyZBDjHKQ99OF89-jNPgehwFsH1y5lTEvfb1Gdg",
      d = 'query{\n    getSwellcast(limit: 10, offset: 0, id:"CRyg01uAkCHh"){\n      id,\n      name,\n      description,\n      image,\n      author{\n        id,\n        image,\n        audio{\n          url,\n          name,\n          duration\n        },\n        alias,\n        badge,\n        swellcastId,\n        followingCount\n      },\n      createdOn,\n      swellCount,\n      followState,\n      followersCount,\n      swells{\n        id,\n        audio{\n          url,\n          name,\n          duration,\n          wave\n        },\n        title,\n        description,\n        shareURL,\n        tags,\n        visibility,\n        promotionScore,\n        type\n        articles{\n          link,\n          title,\n          image\n        },\n        author{\n          id,\n          image,\n          audio{\n            url,\n            name,\n            duration\n          },\n          alias,\n          badge,\n          swellcastId\n        },\n        categories{\n          id,\n          name\n        },\n        repliesCount,\n        replies{\n          id,\n          audio{\n            url,\n            name,\n            duration\n          },\n          message,\n          author{\n            id,\n            image,\n            audio{\n              url,\n              name,\n              duration\n            },\n            alias,\n            badge,\n            swellcastId\n          },\n          createdOn\n        },\n        reactions{\n          reaction\n          pressState,\n          count\n        },\n        createdOn\n      }\n    }\n  }';
  return e.widgets = e.widgets || {}, e.widgets.channelList = {
    init: t,
    getData2: l
  }, e;
}(window.Swell || {}),
    Swell = function (e) {
  function t(t, n, l) {
    l = Object.assign({
      showItemCount: !1
    }, l || {}), e.utils.injectStyle("sandbox-reset"), e.utils.injectStyle("swell-widgets");
    var i = n.reduce(function (e, t, n) {
      return e + t.count;
    }, 0);
    t.innerHTML = n.map(function (t) {
      var n = [];
      return Swell.data.reactions[t.reaction] ? (n.push('<span class="swell-reaction">' + Swell.data.reactions[t.reaction].emoji), 1 == l.showItemCount && t.count > 1 && n.push('<span class="swell-reaction-count">' + t.count + "</span>"), n.push("</span>")) : e.utils.logError("emoji not found", t), n.join("");
    }).concat([i > 1 ? '<span class="swell-reaction-count">(' + i + ")</span>" : ""]).join(" ");
  }

  return e.widgets = Object.assign(e.widgets || {}, {
    reactions: {
      render: t
    }
  }), e;
}(window.Swell || {}),
    Swell = function (e) {
  return e.styles = {}, e.styles["sandbox-reset"] = "", e.styles["swell-widgets"] = ".swell-widget a{text-decoration:none;color:inherit}[data-swellwidget]:not(.swell-widget-loaded){background-color:#eee;min-height:200px}.swell-widget-header{display:flex!important;background-color:#000;flex:0 1 auto}.swell-widget-body{display:flex!important;flex:1 0 auto}.swell-widget-body-content{width:100%}.swell-widget-body.swell-widget-scrollable{overflow:scroll;position:relative}.swell-widget-scrollable .swell-widget-body-content{position:absolute;top:0;right:0;left:0;bottom:0}.swell-widget-footer{display:flex!important;padding:7px;background-color:#fff;border-top:1px solid #ccc;justify-content:flex-end;position:relative}.swell-logo{width:73px;height:16px;display:block;background-size:contain;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODMiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8c3ZnIGlkPSJzd2VsbF9icmFuZCIgdmlld0JveD0iMCAwIDEzNS4yIDQ3Ij4KICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTkuMywxNC4zQzkuNiw3LjUsMTYuNSwyLjksMjMuNSwzLjJjNC4xLDAuMiw4LjQsMi4zLDExLjQsNS43bC01LjMsNS4zYzAsMC0yLTIuOS01LjctMy4xYy0yLjctMC4xLTQuOCwxLjYtNC45LDMuN2MtMC4xLDIsMS43LDMsNC45LDVsMy42LDIuMmM0LjcsMi44LDcuOCw3LjIsNy42LDEyLjVjLTAuNCw3LjQtNy4xLDExLjktMTQuOSwxMS42Yy00LjYtMC4yLTktMS42LTEzLjUtNy4xbDUuOS02LjRjMi42LDMuNSw1LjIsNS4zLDcuOSw1LjVjMi4zLDAuMSw0LjgtMS4yLDUtMy45YzAuMS0yLjQtMi4yLTMuOS01LjItNS43bC0zLjYtMi4yQzEyLjcsMjQsOSwyMC4yLDkuMywxNC4zeiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJzd2VsbC1icmFuZC1maWxsIiBkPSJNNjMuNSwzNGw1LjYtMjBsOC45LDIuNGwtMTEsMjloLTcuOWwtNC40LTE1LjNsLTQuNCwxNS4zaC03LjlsLTExLTI5bDguOS0yLjRsNS42LDIwbDQuOC0xOWg4LjFMNjMuNSwzNHoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTkyLjgsMzcuOWMzLTAuNyw1LjQtMy4xLDUuNC0zLjFsNC43LDZjMCwwLTIuNiwzLjYtOSw1LjFjLTkuNSwyLjItMTUuNy00LjQtMTcuNi0xMi42Uzc5LDE2LjIsODguMSwxNC4xYzUuNy0xLjMsMTIuMSwwLjUsMTMuNSw2LjNjMS43LDcuNC01LjEsMTIuOS0xNSwxNS40Qzg4LDM4LDg5LjgsMzguNiw5Mi44LDM3Ljl6IE05NC40LDIzLjJjLTAuMy0xLjUtMi4xLTIuNC00LjItMS45Yy0zLjMsMC44LTUuOCw0LjMtNS42LDguMUM5MC4zLDI3LjksOTUsMjUuNyw5NC40LDIzLjJ6Ij48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9InN3ZWxsLWJyYW5kLWZpbGwiIGQ9Ik0xMDMuNyw0NS40VjAuOGg4Ljl2NDQuNkgxMDMuN3oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTExNS42LDQ1LjRWMC44aDguNXY0NC42SDExNS42eiI+PC9wYXRoPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTEyNy44LDEuM2gtMC45djIuNWgtMC42VjEuM2gtMC45VjAuOGgyLjRWMS4zeiBNMTMwLDIuOWwwLjgtMi4xaDAuOHYyLjloLTAuNVYxLjRsMCwwbC0wLjksMi4zaC0wLjRsLTAuOS0yLjNsMCwwdjIuM2gtMC41VjAuOGgwLjhMMTMwLDIuOXoiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L3N2Zz4KPC9zdmc+)}.swell-user-horizontal{display:flex!important;flex-direction:row;align-items:center}.swell-user-horizontal .swell-avatar{margin-right:10px}.swell-widget .swell-user-horizontal h2{margin:0}.swell-avatar{display:inline-block;width:50px;height:50px;min-width:50px;min-height:50px;border:2px solid #fff;background-color:#7ea768;border-radius:50%;box-shadow:0 2px 7px rgba(0,0,0,.3);background-size:cover;position:relative}.swell-circle-play-btn{border-radius:50%;width:50px;height:50px;border:3px solid #fff;box-shadow:0 2px 7px rgba(0,0,0,.3);background-color:#7ea768;background-position:center;background-size:60%;background-repeat:no-repeat;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAp0lEQVR4Ae3VIQxBURiGYUEQREEURVEX9STq06dPnz59oj5Rnz5BFARBEB7pBBNsGF84Tw/vdu/3n0ZVVdUL6KUFXTBDMyWo2GGQFAQ3LNBKCSoOGCUFFSt0koLghElSULFBLynIT06E9+wwCAj6wYnwmTW6CUFHjBM+2Q1LtBN+6j2GCbO/Yo5mwmHcop/wdJwxTXlcy5T/43nKf/Y45QBfnnJVVdUdCE/4IC+1ysQAAAAASUVORK5CYII=)}.swell-hide{display:none!important}.swell-channel-widget{display:flex;flex-direction:column;font-family:Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif;width:100%;height:inherit}.swell-widget-button{border-radius:7px;background-color:#7ea768;color:#fff;min-width:75px;min-height:40px;padding:0 13px 0 13px;font-size:14px;border:2px solid #fff}.swell-channel-widget h2{font-weight:400;font-size:18px;margin:0 0 10px 0}.swell-channel-widget h3{font-weight:400;font-size:12px;margin:0 0 10px 0}.swell-channel-widget p{font-size:12px;margin:0 0 10px 0}.swell-channel-widget h2:last-child,.swell-channel-widget p:last-child{margin-bottom:0}.swell-channel-header{flex-direction:column;background-size:cover}.swell-channel-header>div{display:flex}.swell-channel-header .swell-logo{position:absolute;top:5px;right:5px}.swell-channel-header-info{padding:10px;background-color:rgba(0,0,0,.6);display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;align-items:center;color:#fff}.swell-widget-body-content{background-color:#fff}div.swell-story-row{display:flex;flex-direction:row;padding:10px 10px 10px 10px;transition:.3s}div.swell-story-row:not(:last-child){border-bottom:1px solid #ccc}.swell-story-row:hover{background-color:#f1f1f1}.swell-story-row h2{font-size:16px;margin-bottom:5px}.swell-story-row>div{padding:6px;display:flex;flex-direction:column}.swell-story-row>div:first-child{flex:0 1 auto}.swell-story-row>div:nth-child(2){flex:1 1 auto}.swell-play-btn-container{flex-shrink:1}.swell-reactions{font-size:13px}.swell-reaction{font-size:1em}.swell-reaction-count{font-size:.85em;margin-left:.3em}", e.styles.roboto = '@font-face{font-family:Roboto;font-style:normal;font-weight:400;src:local("Roboto"),local("Roboto-Regular"),url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf) format("truetype")}@font-face{font-family:Roboto;font-style:normal;font-weight:500;src:local("Roboto Medium"),local("Roboto-Medium"),url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc9.ttf) format("truetype")}@font-face{font-family:Roboto;font-style:normal;font-weight:700;src:local("Roboto Bold"),local("Roboto-Bold"),url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf) format("truetype")}', e.styles.typekit = '@import url(https://p.typekit.net/p.css?s=1&k=xyd2ebx&ht=tk&f=28554&a=832764&app=typekit&e=css);@font-face{font-family:triplex-sans;src:url(https://use.typekit.net/af/e91c54/00000000000000003b9ade09/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format("woff2"),url(https://use.typekit.net/af/e91c54/00000000000000003b9ade09/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format("woff"),url(https://use.typekit.net/af/e91c54/00000000000000003b9ade09/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format("opentype");font-display:auto;font-style:normal;font-weight:800}.tk-triplex-sans{font-family:triplex-sans,sans-serif}', e;
}(window.Swell || {});