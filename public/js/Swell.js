"use strict";

var Swell = function (self) {
  var UA_SRC = "http://www.google-analytics.com/analytics.js"; // var UA_SRC = 'https://www.googletagmanager.com/gtag/js?id=UA-166249050-1';
  // var UA = "UA-154877621-1";

  var UA = "UA-166249050-1"; // test

  var UA_NAME = "swelllife";
  var GA_INJECTED = false;

  function isLoaded() {
    return window.ga && ga.create ? true : false;
  }

  function init() {
    if (self.DEBUG) {
      self.utils.log("initAnalytics()");
    }

    if (isLoaded()) {
      handleLoadGAScript();
    } else {
      self.utils.injectScript(UA_SRC, handleLoadGAScript);
    }
  }

  function handleLoadGAScript() {
    if (GA_INJECTED == false) {
      GA_INJECTED = true;
      ga("create", UA, "auto", {
        name: UA_NAME,
        allowLinker: true
      });
      ga("".concat(UA_NAME, ".require"), "linker");
      ga("".concat(UA_NAME, ".linker:autoLink"), ["app.swell.life", "swell.life"], false, false);
      ga("".concat(UA_NAME, ".send"), "pageview");
    }
  }

  function decorate(el) {
    if (self.DEBUG) {
      self.utils.log("analytics.decorate(", el, ")");
    }

    ga("".concat(UA_NAME, ".linker:decorate"), el);
  }

  function send(tag) {
    if (self.DEBUG) {
      self.utils.log("analytics.send(", tag, ")");
    }

    ga("".concat(self.analytics.UA_NAME, ".send"), tag);
  }

  self.analytics = Object.assign(self.analytics || {}, {
    isLoaded: isLoaded,
    init: init,
    decorate: decorate,
    send: send,
    UA_NAME: UA_NAME
  });
  return self;
}(window.Swell || {});
"use strict";

var Swell = function (self) {
  var reactions = {
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
  self.data = self.data || {};
  self.data.reactions = reactions;
  self.DEBUG = window.location.hostname == 'localhost' || false; // set to true to force debug mode

  return self;
}(window.Swell || {});
"use strict";

var Swell = function (self) {
  var checkViewportTimeout = null;

  function checkViewport(instant) {
    // don't spam the engine too much
    if (instant != true) {
      if (checkViewportTimeout) {
        clearTimeout(checkViewportTimeout);
      }

      checkViewportTimeout = setTimeout(function () {
        checkViewportTimeout = null;
        checkViewport(true);
      }, 500);
      return;
    }

    var $widgets = document.querySelectorAll("[data-swellwidget]:not(.swell-widget-loaded)");
    var $widget;

    if ($widgets.length == 0) {
      // we're done loading widgets!
      window.removeEventListener("scroll", checkViewport);
    } else {
      for (var i = 0; i < $widgets.length; i++) {
        $widget = $widgets[i];

        if (Swell.utils.isInViewport($widget, 600)) {
          renderWidget($widget);
        }
      }
    }
  }

  function initWidgets() {
    self.analytics.init();
    Swell.utils.injectStyle("swell-widgets");
    renderWidgets();
  }

  function renderWidgets() {
    window.addEventListener("scroll", checkViewport);
    checkViewport(true);
  }

  function renderWidget($widget) {
    $widget.classList.add("swell-widget-loaded");
    var key = $widget.dataset.swellwidget; // check if widget exists

    if (Swell.widgets[key]) {
      Swell.widgets[key].init($widget);
    } else {
      // widget not found
      $widget.innerHTML = "<h4>This Swell widget does not exist.</h4>";
    }
  }

  function render($widget) {
    if ($widget == null) {
      renderWidgets();
    } else {
      renderWidget($widget);
    }
  }

  function dispose() {
    var $widgets = document.querySelectorAll("[data-swellwidget]");
    var $widget;
    window.removeEventListener("scroll", checkViewport);

    for (var i = 0; i < $widgets.length; i++) {
      $widget = $widgets[i];
      $widget.innerHTML = "";
      $widget.classList.remove("swell-widget-loaded");
    }
  } // what if someone injects this after ready?


  if (document.readyState === "complete") {
    setTimeout(initWidgets, 1);
  } else {
    document.addEventListener("readystatechange", function (event) {
      if (document.readyState === "complete") {
        initWidgets();
      }
    });
  }

  Object.assign(self, {
    render: render,
    renderWidgets: renderWidgets,
    renderWidget: renderWidget,
    dispose: dispose
  });
  return self;
}(window.Swell || {});
"use strict";

var Swell = function (self) {
  function log() {
    var args = Array.from(arguments);
    args.unshift("Swell Widget:");
    console.log.apply(console, args);
  }

  function logError() {
    var args = Array.from(arguments);
    args.unshift("Swell Widget:");
    console.error.apply(console, args);
  } // check if element is in view


  var isInViewport = function isInViewport(elem, buffer) {
    // buffers allows render when container is near the viewport
    var heightBuffer = typeof buffer == "number" ? buffer : 0;
    var rect = elem.getBoundingClientRect();
    var h = window.innerHeight || document.documentElement.clientHeight;
    return rect.top >= -heightBuffer && rect.top <= h + heightBuffer || rect.bottom >= -heightBuffer && rect.bottom <= h + heightBuffer;
  }; // register assets to avoid duplicate injections


  var injectedAsset = {};

  function injectStyle(key) {
    if (self.styles[key] && injectedAsset[key] !== true) {
      var cssStr = self.styles[key];
      injectedAsset[key] = true;
      var b = document.createElement("style");
      b.type = "text/css";

      if (b.styleSheet) {
        b.styleSheet.cssText = cssStr;
      } else {
        b.appendChild(document.createTextNode(cssStr));
      }

      (document.head || document.getElementsByTagName("head")[0]).appendChild(b);
    }
  }

  function injectCSS(href) {
    if (injectedAsset[href] !== true) {
      injectedAsset[href] = true;
      var cssStr = self.styles[href];
      var link = document.createElement("link");
      link.href = href;
      link.type = "text/css";
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
  }

  function injectScript(src, callback) {
    if (self.DEBUG) {
      self.utils.log("injectScript()", src);
    }

    if (injectedAsset[src] !== true) {
      injectedAsset[src] = true;
      var script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;

      script.onload = function () {
        setTimeout(callback, 2000);
      };

      script.src = src;
      document.getElementsByTagName("head")[0].appendChild(script);
    } else {
      callback();
    }
  }

  self.utils = Object.assign(self.utils || {}, {
    isInViewport: isInViewport,
    injectCSS: injectCSS,
    injectStyle: injectStyle,
    injectScript: injectScript,
    log: log,
    logError: logError
  }); // self.utils = self.utils || {};
  // self.utils.isInViewport = isInViewport;
  // self.utils.injectCSS = injectCSS;
  // self.utils.injectStyle = injectStyle;
  // self.utils.injectScript = injectScript;
  // self.utils.log = log;

  return self;
}(window.Swell || {});
"use strict";

var Swell = function (self) {
  var GRAPH_URL = "https://stageapiv2gateway.swell.life/graphql";
  var API_URL = "/api/stories";
  var TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6ImFhYWFhIiwiZW1haWwiOiJ0ZXN0LnRlc3QuMUBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnltTkdqRk56ZlkiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODkyOTgwMzY0MTAiLCJpYXQiOjE1ODkyOTgwMzYsImV4cCI6MTU5Mjg5ODAzNn0.1vC8TyZBDjHKQ99OF89-jNPgehwFsH1y5lTEvfb1Gdg";

  function init($container) {
    var token = $container.dataset.token;
    var swellid = $container.dataset.swellid;
    $container.innerHTML = "<h4>Loading...</h4>";
    getData(function (data) {
      render(data, $container);
    });
  }

  var graph = "query{\n    getSwellcast(limit: 10, offset: 0, id:\"CRyg01uAkCHh\"){\n      id,\n      name,\n      description,\n      image,\n      author{\n        id,\n        image,\n        audio{\n          url,\n          name,\n          duration\n        },\n        alias,\n        badge,\n        swellcastId,\n        followingCount\n      },\n      createdOn,\n      swellCount,\n      followState,\n      followersCount,\n      swells{\n        id,\n        audio{\n          url,\n          name,\n          duration,\n          wave\n        },\n        title,\n        description,\n        shareURL,\n        tags,\n        visibility,\n        promotionScore,\n        type\n        articles{\n          link,\n          title,\n          image\n        },\n        author{\n          id,\n          image,\n          audio{\n            url,\n            name,\n            duration\n          },\n          alias,\n          badge,\n          swellcastId\n        },\n        categories{\n          id,\n          name\n        },\n        repliesCount,\n        replies{\n          id,\n          audio{\n            url,\n            name,\n            duration\n          },\n          message,\n          author{\n            id,\n            image,\n            audio{\n              url,\n              name,\n              duration\n            },\n            alias,\n            badge,\n            swellcastId\n          },\n          createdOn\n        },\n        reactions{\n          reaction\n          pressState,\n          count\n        },\n        createdOn\n      }\n    }\n  }";

  function getData(cb) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function (e) {
      cb(xhr.response);
    };

    xhr.open("POST", API_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("authorization", "Bearer ".concat(TOKEN));
    xhr.responseType = "json";
    xhr.send(graph);
  }

  function getData2(cb) {
    var xhr = new XMLHttpRequest();

    xhr.onload = function (e) {
      cb(xhr.response);
    }; // xhr.onreadystatechange = function(e){
    //   console.log('error',e);
    // };


    xhr.open("POST", GRAPH_URL, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer ".concat(TOKEN));
    xhr.setRequestHeader("accept-encoding", "gzip");
    xhr.setRequestHeader("referer", "https://stageapiv2gateway.swell.life/graphql?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhbGlhcyI6bnVsbCwiZW1haWwiOiJ0ZXN0cGFzczEuNEBnbWFpbC5jb20iLCJ1c2VySWQiOiJVUnlPTEg4a3ZJRUQiLCJyb2xlcyI6bnVsbCwic2Vzc2lvbiI6IjE1ODg5NTM3MjU0NTIiLCJpYXQiOjE1ODg5NTM3MjUsImV4cCI6MTU5MjU1MzcyNX0.KeaCQASO4p0Lwn6qQTzQSqVLiJzFYCdG962FuYEZJbY");
    xhr.setRequestHeader("access-control-allow-origin", "*");
    xhr.responseType = "json";
    xhr.send(graph);
  } // getData((resp) => {
  //   console.log('resp',resp);
  // })


  function render(data, $container) {
    console.log("render", data);
    data = data.data; // inject styles

    self.utils.injectStyle("sandbox-reset");
    self.utils.injectStyle("swell-widgets"); // get config

    var limit = parseInt($container.dataset.limit || 10);
    var showHeader = $container.dataset.header == "0" ? false : true;
    var showFooter = $container.dataset.footer == "0" ? false : true;
    var scrollable = $container.dataset.scroll == "0" ? false : true;
    data.channel = data.getSwellcast;
    data.channel.items = data.getSwellcast.swells; // <div><button class="swell-widget-button">Vist My Channel</button></div>

    $container.innerHTML = "\n    <div class=\"swell-widget swell-channel-widget\">\n    <div class=\"swell-widget-header swell-channel-header\">\n      <div class=\"swell-channel-header-info ".concat(showHeader ? "" : "swell-hide", "\">\n        <div class=\"swell-user-horizontal\">\n          <div class=\"swell-avatar\"></div>\n          <div>\n            <h2>").concat(data.channel.name, "</h2>\n            <p>").concat(data.channel.description, "</p>\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"swell-widget-body ").concat(scrollable ? "swell-widget-scrollable" : "", "\"><div class=\"swell-widget-body-content\"></div></div>\n    <div class=\"swell-widget-footer ").concat(showFooter ? "" : "swell-hide", "\"><div class=\"swell-logo\"></div></div>    </div><div style=\"clear:both\"></div>\n    ");
    $container.querySelector(".swell-channel-header").style.backgroundImage = "url(" + data.channel.image + ")";
    $container.querySelector(".swell-avatar").style.backgroundImage = "url(" + data.channel.author.image + ")";
    var $stories = $container.querySelector(".swell-widget-body-content");
    data.channel.items.filter(function (item) {
      return item.type == "SWELL";
    }).slice(0, limit).forEach(function (item) {
      $stories.appendChild(StoryRow(item));
    });
  }

  function StoryRow(item) {
    var $story = document.createElement("a"); // $story.setAttribute('href',`/api/dynamiclink/?storyid=${item.id}`);

    $story.setAttribute("href", item.shareURL);
    $story.setAttribute("target", "_blank"); // "https://swell.life/story/SRyhNIUCoBfe"https://app.swell.life/swellcast/${item.id}

    $story.innerHTML = "\n    <div data-storyid=\"".concat(item.id, "\" class=\"swell-story-row\">\n        <div>\n            <div class=\"swell-circle-play-btn\"></div>\n        </div>\n        <div>\n          <h2></h2>\n          <p></p>\n          <div class=\"swell-reactions\"></div>\n        </div>\n    </div>\n    ");
    $story.querySelector("h2").textContent = item.title;
    $story.querySelector("p").textContent = item.description;
    $story.addEventListener("click", handleClickStory);
    self.widgets.reactions.render($story.querySelector(".swell-reactions"), item.reactions);
    return $story;
  }

  function handleClickStory() {
    self.analytics.decorate(this);
    self.analytics.send("widget-channel.clickstory");
  }

  self.widgets = self.widgets || {};
  self.widgets.channelList = {
    init: init,
    getData2: getData2
  };
  return self;
}(window.Swell || {});
"use strict";

var Swell = function (self) {
  function init($container) {}

  function render($container, reactions, options) {
    options = Object.assign({
      showItemCount: false
    }, options || {}); // inject styles

    self.utils.injectStyle("sandbox-reset");
    self.utils.injectStyle("swell-widgets");
    var totalCount = reactions.reduce(function (n, e, i) {
      return n + e.count;
    }, 0);
    $container.innerHTML = reactions.map(function (r) {
      var htm = [];

      if (Swell.data.reactions[r.reaction]) {
        htm.push('<span class="swell-reaction">' + Swell.data.reactions[r.reaction].emoji);

        if (options.showItemCount == true && r.count > 1) {
          htm.push('<span class="swell-reaction-count">' + r.count + "</span>");
        }

        htm.push("</span>");
      } else {
        self.utils.logError("emoji not found", r);
      }

      return htm.join("");
    }).concat([totalCount > 1 ? '<span class="swell-reaction-count">(' + totalCount + ")</span>" : ""]).join(" ");
  }

  self.widgets = Object.assign(self.widgets || {}, {
    reactions: {
      render: render
    }
  });
  return self;
}(window.Swell || {});
"use strict";

var Swell = function (self) {
  self.styles = {};
  self.styles["sandbox-reset"] = '';
  self.styles["swell-widgets"] = '.swell-widget a{text-decoration:none;color:inherit}[data-swellwidget]:not(.swell-widget-loaded){background-color:#eee;min-height:200px}.swell-widget-header{display:flex!important;background-color:#000;flex:0 1 auto}.swell-widget-body{display:flex!important;flex:1 0 auto}.swell-widget-body-content{width:100%}.swell-widget-body.swell-widget-scrollable{overflow:scroll;position:relative}.swell-widget-scrollable .swell-widget-body-content{position:absolute;top:0;right:0;left:0;bottom:0}.swell-widget-footer{display:flex!important;padding:7px;background-color:#fff;border-top:1px solid #ccc;justify-content:flex-end;position:relative}.swell-logo{width:73px;height:16px;display:block;background-size:contain;background-repeat:no-repeat;background-image:url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODMiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8c3ZnIGlkPSJzd2VsbF9icmFuZCIgdmlld0JveD0iMCAwIDEzNS4yIDQ3Ij4KICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTkuMywxNC4zQzkuNiw3LjUsMTYuNSwyLjksMjMuNSwzLjJjNC4xLDAuMiw4LjQsMi4zLDExLjQsNS43bC01LjMsNS4zYzAsMC0yLTIuOS01LjctMy4xYy0yLjctMC4xLTQuOCwxLjYtNC45LDMuN2MtMC4xLDIsMS43LDMsNC45LDVsMy42LDIuMmM0LjcsMi44LDcuOCw3LjIsNy42LDEyLjVjLTAuNCw3LjQtNy4xLDExLjktMTQuOSwxMS42Yy00LjYtMC4yLTktMS42LTEzLjUtNy4xbDUuOS02LjRjMi42LDMuNSw1LjIsNS4zLDcuOSw1LjVjMi4zLDAuMSw0LjgtMS4yLDUtMy45YzAuMS0yLjQtMi4yLTMuOS01LjItNS43bC0zLjYtMi4yQzEyLjcsMjQsOSwyMC4yLDkuMywxNC4zeiI+PC9wYXRoPgogICAgICAgIDxwYXRoIGNsYXNzPSJzd2VsbC1icmFuZC1maWxsIiBkPSJNNjMuNSwzNGw1LjYtMjBsOC45LDIuNGwtMTEsMjloLTcuOWwtNC40LTE1LjNsLTQuNCwxNS4zaC03LjlsLTExLTI5bDguOS0yLjRsNS42LDIwbDQuOC0xOWg4LjFMNjMuNSwzNHoiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTkyLjgsMzcuOWMzLTAuNyw1LjQtMy4xLDUuNC0zLjFsNC43LDZjMCwwLTIuNiwzLjYtOSw1LjFjLTkuNSwyLjItMTUuNy00LjQtMTcuNi0xMi42Uzc5LDE2LjIsODguMSwxNC4xYzUuNy0xLjMsMTIuMSwwLjUsMTMuNSw2LjNjMS43LDcuNC01LjEsMTIuOS0xNSwxNS40Qzg4LDM4LDg5LjgsMzguNiw5Mi44LDM3Ljl6IE05NC40LDIzLjJjLTAuMy0xLjUtMi4xLTIuNC00LjItMS45Yy0zLjMsMC44LTUuOCw0LjMtNS42LDguMUM5MC4zLDI3LjksOTUsMjUuNyw5NC40LDIzLjJ6Ij48L3BhdGg+CiAgICAgICAgPHBhdGggY2xhc3M9InN3ZWxsLWJyYW5kLWZpbGwiIGQ9Ik0xMDMuNyw0NS40VjAuOGg4Ljl2NDQuNkgxMDMuN3oiPjwvcGF0aD4KICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTExNS42LDQ1LjRWMC44aDguNXY0NC42SDExNS42eiI+PC9wYXRoPgogICAgICAgIDxnPgogICAgICAgICAgICA8cGF0aCBjbGFzcz0ic3dlbGwtYnJhbmQtZmlsbCIgZD0iTTEyNy44LDEuM2gtMC45djIuNWgtMC42VjEuM2gtMC45VjAuOGgyLjRWMS4zeiBNMTMwLDIuOWwwLjgtMi4xaDAuOHYyLjloLTAuNVYxLjRsMCwwbC0wLjksMi4zaC0wLjRsLTAuOS0yLjNsMCwwdjIuM2gtMC41VjAuOGgwLjhMMTMwLDIuOXoiPjwvcGF0aD4KICAgICAgICA8L2c+CiAgICA8L3N2Zz4KPC9zdmc+)}.swell-user-horizontal{display:flex!important;flex-direction:row;align-items:center}.swell-user-horizontal .swell-avatar{margin-right:10px}.swell-widget .swell-user-horizontal h2{margin:0}.swell-avatar{display:inline-block;width:50px;height:50px;min-width:50px;min-height:50px;border:2px solid #fff;background-color:#7ea768;border-radius:50%;box-shadow:0 2px 7px rgba(0,0,0,.3);background-size:cover;position:relative}.swell-circle-play-btn{border-radius:50%;width:50px;height:50px;border:3px solid #fff;box-shadow:0 2px 7px rgba(0,0,0,.3);background-color:#7ea768;background-position:center;background-size:60%;background-repeat:no-repeat;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAp0lEQVR4Ae3VIQxBURiGYUEQREEURVEX9STq06dPnz59oj5Rnz5BFARBEB7pBBNsGF84Tw/vdu/3n0ZVVdUL6KUFXTBDMyWo2GGQFAQ3LNBKCSoOGCUFFSt0koLghElSULFBLynIT06E9+wwCAj6wYnwmTW6CUFHjBM+2Q1LtBN+6j2GCbO/Yo5mwmHcop/wdJwxTXlcy5T/43nKf/Y45QBfnnJVVdUdCE/4IC+1ysQAAAAASUVORK5CYII=)}.swell-hide{display:none!important}.swell-channel-widget{display:flex;flex-direction:column;font-family:Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif;width:100%;height:inherit}.swell-widget-button{border-radius:7px;background-color:#7ea768;color:#fff;min-width:75px;min-height:40px;padding:0 13px 0 13px;font-size:14px;border:2px solid #fff}.swell-channel-widget h2{font-weight:400;font-size:18px;margin:0 0 10px 0}.swell-channel-widget h3{font-weight:400;font-size:12px;margin:0 0 10px 0}.swell-channel-widget p{font-size:12px;margin:0 0 10px 0}.swell-channel-widget h2:last-child,.swell-channel-widget p:last-child{margin-bottom:0}.swell-channel-header{flex-direction:column;background-size:cover}.swell-channel-header>div{display:flex}.swell-channel-header .swell-logo{position:absolute;top:5px;right:5px}.swell-channel-header-info{padding:10px;background-color:rgba(0,0,0,.6);display:flex;flex-wrap:wrap;flex-direction:row;justify-content:space-between;align-items:center;color:#fff}.swell-widget-body-content{background-color:#fff}div.swell-story-row{display:flex;flex-direction:row;padding:10px 10px 10px 10px;transition:.3s}div.swell-story-row:not(:last-child){border-bottom:1px solid #ccc}.swell-story-row:hover{background-color:#f1f1f1}.swell-story-row h2{font-size:16px;margin-bottom:5px}.swell-story-row>div{padding:6px;display:flex;flex-direction:column}.swell-story-row>div:first-child{flex:0 1 auto}.swell-story-row>div:nth-child(2){flex:1 1 auto}.swell-play-btn-container{flex-shrink:1}.swell-reactions{font-size:13px}.swell-reaction{font-size:1em}.swell-reaction-count{font-size:.85em;margin-left:.3em}';
  self.styles["roboto"] = '@font-face{font-family:Roboto;font-style:normal;font-weight:400;src:local("Roboto"),local("Roboto-Regular"),url(https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf) format("truetype")}@font-face{font-family:Roboto;font-style:normal;font-weight:500;src:local("Roboto Medium"),local("Roboto-Medium"),url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc9.ttf) format("truetype")}@font-face{font-family:Roboto;font-style:normal;font-weight:700;src:local("Roboto Bold"),local("Roboto-Bold"),url(https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf) format("truetype")}';
  self.styles["typekit"] = '@import url(https://p.typekit.net/p.css?s=1&k=xyd2ebx&ht=tk&f=28554&a=832764&app=typekit&e=css);@font-face{font-family:triplex-sans;src:url(https://use.typekit.net/af/e91c54/00000000000000003b9ade09/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format("woff2"),url(https://use.typekit.net/af/e91c54/00000000000000003b9ade09/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format("woff"),url(https://use.typekit.net/af/e91c54/00000000000000003b9ade09/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n8&v=3) format("opentype");font-display:auto;font-style:normal;font-weight:800}.tk-triplex-sans{font-family:triplex-sans,sans-serif}';
  return self;
}(window.Swell || {});